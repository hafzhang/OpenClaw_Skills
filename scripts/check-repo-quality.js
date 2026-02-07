#!/usr/bin/env node

/**
 * Repository Quality Check Script for Phase 5
 *
 * This script checks the quality of repositories that passed HTTP verification.
 * It verifies:
 * - Repository has actual content (README, code files)
 * - Repository was updated in the last 6 months
 * - Star count meets quality threshold (>100 preferred)
 * - Excludes low-quality repositories (宁可缺毋滥)
 *
 * Usage: node scripts/check-repo-quality.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const VERIFICATION_REPORT = path.join(process.cwd(), 'docs', 'phase5-repo-verification-report.json');
const OUTPUT_FILE = path.join(process.cwd(), 'docs', 'phase5-repo-quality-report.json');
const TIMEOUT = 15000;
const CONCURRENT = 3; // More conservative for API requests
const SIX_MONTHS_AGO = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);

/**
 * Parse star count from research data (e.g., "100k+", "500+", "2500")
 */
function parseStarCount(starStr) {
  if (!starStr) return 0;
  const str = starStr.toString().toLowerCase().replace('+', '').trim();
  if (str.endsWith('k')) {
    return parseInt(parseFloat(str.replace('k', '')) * 1000);
  }
  return parseInt(str) || 0;
}

/**
 * Fetch repository metadata from GitHub API
 */
function fetchRepoMetadata(repoUrl, starStr) {
  return new Promise((resolve) => {
    // Extract owner/repo from URL
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      resolve({
        url: repoUrl,
        hasMetadata: false,
        error: 'Invalid GitHub URL'
      });
      return;
    }

    const [, owner, repo] = match;
    const apiPath = `/repos/${owner}/${repo}`;
    const stars = parseStarCount(starStr);

    const options = {
      host: 'api.github.com',
      path: apiPath,
      method: 'GET',
      timeout: TIMEOUT,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OpenClaw-Skills-Quality-Checker/1.0)',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const metadata = JSON.parse(data);
            const hasReadme = metadata.has_readme || false;
            const pushedAt = metadata.pushed_at ? new Date(metadata.pushed_at) : null;
            const updatedAt = metadata.updated_at ? new Date(metadata.updated_at) : null;
            const stargazersCount = metadata.stargazers_count || 0;
            const forksCount = metadata.forks_count || 0;
            const openIssuesCount = metadata.open_issues_count || 0;
            const size = metadata.size || 0; // in KB
            const language = metadata.language || null;
            const isArchived = metadata.archived || false;
            const description = metadata.description || '';
            const topics = metadata.topics || [];

            // Determine quality metrics
            const recentUpdate = pushedAt && pushedAt > SIX_MONTHS_AGO;
            const hasContent = size > 10 || hasReadme; // At least 10KB or README
            const starQuality = stargazersCount >= 100;
            const highStarQuality = stargazersCount >= 500;

            resolve({
              url: repoUrl,
              owner,
              repo,
              hasMetadata: true,
              hasReadme,
              hasContent,
              pushedAt: pushedAt ? pushedAt.toISOString() : null,
              updatedAt: updatedAt ? updatedAt.toISOString() : null,
              recentUpdate,
              stars: stargazersCount,
              starQuality,
              highStarQuality,
              forks: forksCount,
              openIssues: openIssuesCount,
              size,
              language,
              isArchived,
              description,
              topics,
              overallQuality: calculateOverallQuality({
                hasContent,
                recentUpdate,
                starQuality,
                highStarQuality,
                isArchived
              })
            });
          } catch (err) {
            resolve({
              url: repoUrl,
              hasMetadata: false,
              error: 'Parse error: ' + err.message
            });
          }
        } else if (res.statusCode === 403 || res.statusCode === 429) {
          // Rate limited
          resolve({
            url: repoUrl,
            hasMetadata: false,
            error: 'Rate limited',
            statusCode: res.statusCode
          });
        } else {
          resolve({
            url: repoUrl,
            hasMetadata: false,
            error: `HTTP ${res.statusCode}`,
            statusCode: res.statusCode
          });
        }
      });
    });

    req.on('error', (err) => {
      resolve({
        url: repoUrl,
        hasMetadata: false,
        error: err.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url: repoUrl,
        hasMetadata: false,
        error: 'Timeout'
      });
    });

    req.setTimeout(TIMEOUT);
    req.end();
  });
}

/**
 * Calculate overall quality score
 */
function calculateOverallQuality(metrics) {
  let score = 0;
  let reasons = [];

  if (metrics.hasContent) {
    score += 2;
  } else {
    reasons.push('No content');
  }

  if (metrics.recentUpdate) {
    score += 2;
  } else {
    reasons.push('Not updated in 6 months');
  }

  if (metrics.highStarQuality) {
    score += 3;
  } else if (metrics.starQuality) {
    score += 2;
  } else {
    reasons.push('Low stars (<100)');
  }

  if (metrics.isArchived) {
    score -= 1;
    reasons.push('Archived');
  }

  // Quality levels: 7=Excellent, 5-6=Good, 3-4=Acceptable, 0-2=Low
  let quality = 'low';
  if (score >= 7) quality = 'excellent';
  else if (score >= 5) quality = 'good';
  else if (score >= 3) quality = 'acceptable';

  return {
    score,
    quality,
    reasons: reasons.length > 0 ? reasons : ['All criteria met']
  };
}

/**
 * Process repos in batches
 */
async function checkQuality(repos) {
  const results = [];
  let rateLimited = false;

  for (let i = 0; i < repos.length; i += CONCURRENT) {
    if (rateLimited) {
      console.log('\n⚠️  Rate limited, using basic quality check...');
      // Fall back to basic check using only research data
      const remaining = repos.slice(i);
      for (const repo of remaining) {
        const stars = parseStarCount(repo.stars);
        const basicQuality = {
          url: repo.url,
          name: repo.name,
          hasMetadata: false,
          // Use research data as fallback
          stars,
          starQuality: stars >= 100,
          highStarQuality: stars >= 500,
          hasContent: true, // Assume yes if we can't verify
          recentUpdate: true, // Assume yes if we can't verify
          isArchived: false,
          overallQuality: {
            score: stars >= 500 ? 5 : (stars >= 100 ? 3 : 1),
            quality: stars >= 500 ? 'good' : (stars >= 100 ? 'acceptable' : 'low'),
            reasons: ['Based on research data only']
          }
        };
        results.push({ ...repo, ...basicQuality });
      }
      break;
    }

    const batch = repos.slice(i, i + CONCURRENT);
    const batchResults = await Promise.all(batch.map(repo =>
      fetchRepoMetadata(repo.url, repo.stars).then(metadata => ({
        ...repo,
        ...metadata
      }))
    ));

    // Check for rate limiting
    const rateLimitHits = batchResults.filter(r =>
      r.statusCode === 403 || r.statusCode === 429 || r.error === 'Rate limited'
    );

    if (rateLimitHits.length > 0) {
      rateLimited = true;
    }

    results.push(...batchResults);

    // Show progress
    const completed = Math.min(i + CONCURRENT, repos.length);
    process.stdout.write(`\r[${completed}/${repos.length}] Checking repository quality...`);

    // Rate limiting delay
    if (i + CONCURRENT < repos.length && !rateLimited) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}

/**
 * Main function
 */
async function main() {
  console.log(`🔍 Phase 5 Repository Quality Check`);
  console.log(`====================================`);
  console.log(`Input file: ${VERIFICATION_REPORT}`);
  console.log(`Output file: ${OUTPUT_FILE}`);
  console.log(`Timeout: ${TIMEOUT}ms`);
  console.log(`Concurrent requests: ${CONCURRENT}`);
  console.log(``);

  // Load verification report
  if (!fs.existsSync(VERIFICATION_REPORT)) {
    console.error(`❌ Verification report not found: ${VERIFICATION_REPORT}`);
    console.log(`Please run node scripts/verify-all-phase5-repos.js first`);
    process.exit(1);
  }

  const verificationReport = JSON.parse(fs.readFileSync(VERIFICATION_REPORT, 'utf-8'));
  const verifiedRepos = verificationReport.results.filter(r => r.success);

  console.log(`📊 Found ${verifiedRepos.length} verified repositories`);
  console.log('');
  console.log(`🌐 Fetching repository metadata from GitHub API...`);
  console.log(``);

  const results = await checkQuality(verifiedRepos);
  console.log(''); // New line after progress

  // Calculate statistics
  const byQuality = {
    excellent: results.filter(r => r.overallQuality?.quality === 'excellent').length,
    good: results.filter(r => r.overallQuality?.quality === 'good').length,
    acceptable: results.filter(r => r.overallQuality?.quality === 'acceptable').length,
    low: results.filter(r => r.overallQuality?.quality === 'low').length,
    noMetadata: results.filter(r => !r.hasMetadata).length
  };

  const withRecentUpdate = results.filter(r => r.recentUpdate).length;
  const withContent = results.filter(r => r.hasContent).length;
  const withStarQuality = results.filter(r => r.starQuality).length;
  const archived = results.filter(r => r.isArchived).length;

  // Group by category
  const byCategory = {};
  results.forEach(r => {
    if (!byCategory[r.category]) {
      byCategory[r.category] = { total: 0, excellent: 0, good: 0, acceptable: 0, low: 0, repos: [] };
    }
    byCategory[r.category].total++;
    byCategory[r.category].repos.push(r);

    const quality = r.overallQuality?.quality || 'unknown';
    if (byCategory[r.category][quality] !== undefined) {
      byCategory[r.category][quality]++;
    }
  });

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    criteria: {
      sixMonthsAgo: SIX_MONTHS_AGO.toISOString(),
      minStarThreshold: 100,
      highStarThreshold: 500
    },
    summary: {
      total: results.length,
      excellent: byQuality.excellent,
      good: byQuality.good,
      acceptable: byQuality.acceptable,
      low: byQuality.low,
      noMetadata: byQuality.noMetadata,
      recommendedForInclusion: byQuality.excellent + byQuality.good,
      potentiallyInclude: byQuality.acceptable,
      recommendExclusion: byQuality.low
    },
    metrics: {
      withRecentUpdate: withRecentUpdate,
      withContent: withContent,
      withStarQuality: withStarQuality,
      archived: archived
    },
    byCategory: Object.fromEntries(
      Object.entries(byCategory).map(([cat, data]) => [
        cat,
        {
          total: data.total,
          excellent: data.excellent,
          good: data.good,
          acceptable: data.acceptable,
          low: data.low
        }
      ])
    ),
    results: results
  };

  // Save report
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));

  // Print summary
  console.log(`📊 Quality Check Summary`);
  console.log(`=======================`);
  console.log(`Total repositories checked: ${results.length}`);
  console.log(``);
  console.log(`Quality Distribution:`);
  console.log(`  ⭐ Excellent:    ${byQuality.excellent} (7/7 score)`);
  console.log(`  ✅ Good:         ${byQuality.good} (5-6/7 score)`);
  console.log(`  🟡 Acceptable:   ${byQuality.acceptable} (3-4/7 score)`);
  console.log(`  ❌ Low:          ${byQuality.low} (0-2/7 score)`);
  console.log(`  ⚠️  No Metadata: ${byQuality.noMetadata}`);
  console.log(``);
  console.log(`Recommendations (宁可缺毋滥 - Quality over Quantity):`);
  console.log(`  ✅ Include:      ${report.summary.recommendedForInclusion} (Excellent + Good)`);
  console.log(`  🟡 Consider:     ${report.summary.potentiallyInclude} (Acceptable - manual review)`);
  console.log(`  ❌ Exclude:      ${report.summary.recommendExclusion} (Low quality)`);
  console.log(``);
  console.log(`Key Metrics:`);
  console.log(`  📅 Updated < 6 months: ${withRecentUpdate} (${((withRecentUpdate/results.length)*100).toFixed(1)}%)`);
  console.log(`  📄 Has content:       ${withContent} (${((withContent/results.length)*100).toFixed(1)}%)`);
  console.log(`  ⭐ Stars >= 100:      ${withStarQuality} (${((withStarQuality/results.length)*100).toFixed(1)}%)`);
  console.log(`  📦 Archived:          ${archived}`);
  console.log(``);

  // Print by category
  console.log(`By Category:`);
  Object.entries(byCategory)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([cat, data]) => {
      const includeRate = ((data.excellent + data.good) / data.total * 100).toFixed(0);
      console.log(`  ${cat.substring(0, 50).padEnd(50)} ${data.excellent + data.good}/${data.total} (${includeRate}% include)`);
    });

  console.log(``);
  console.log(`📄 Report saved to: ${OUTPUT_FILE}`);

  // List low-quality repositories
  const lowQuality = results.filter(r => r.overallQuality?.quality === 'low');
  if (lowQuality.length > 0) {
    console.log(``);
    console.log(`❌ Low Quality Repositories (${lowQuality.length}) - Recommend Exclusion:`);
    lowQuality.slice(0, 20).forEach(r => {
      console.log(`   ${r.name} (${r.category})`);
      console.log(`      URL: ${r.url}`);
      console.log(`      Stars: ${r.stars}, Updated: ${r.pushedAt || 'N/A'}`);
      console.log(`      Reasons: ${r.overallQuality?.reasons?.join(', ')}`);
    });
    if (lowQuality.length > 20) {
      console.log(`   ... and ${lowQuality.length - 20} more`);
    }
  }

  console.log(``);

  // Generate CSV for easy analysis
  const csvFile = OUTPUT_FILE.replace('.json', '.csv');
  const csvHeaders = 'Name,URL,Stars,Quality,Score,HasContent,RecentUpdate,IsArchived,Language,Category,Subcategory,Reasons\n';
  const csvRows = results.map(r => {
    const quality = r.overallQuality?.quality || 'unknown';
    const score = r.overallQuality?.score || 0;
    const reasons = r.overallQuality?.reasons?.join('; ') || '';
    return `"${r.name}","${r.url}",${r.stars},"${quality}",${score},${r.hasContent},${r.recentUpdate},${r.isArchived},"${r.language || ''}","${r.category}","${r.subcategory}","${reasons}"`;
  }).join('\n');
  fs.writeFileSync(csvFile, csvHeaders + csvRows);
  console.log(`📄 CSV report saved to: ${csvFile}`);

  console.log(``);
  console.log(`✅ Quality check complete!`);
}

main().catch(err => {
  console.error('❌ Fatal error:', err.message);
  console.error(err.stack);
  process.exit(1);
});
