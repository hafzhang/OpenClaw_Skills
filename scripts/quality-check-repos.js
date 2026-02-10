#!/usr/bin/env node

/**
 * Quality Check for GitHub Repositories
 *
 * This script fetches repository metadata from GitHub API and categorizes
 * repositories by quality based on:
 * - Star count
 * - Last update date (within 6 months)
 * - Has README
 * - Has actual code content
 * - Not archived
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const CONFIG = {
  GITHUB_API_BASE: 'https://api.github.com/repos',
  RATE_LIMIT: {
    requestsPerHour: 60,
    requestsPerMinute: 10,
    retryAfter: 60000 // 1 minute
  },
  QUALITY_THRESHOLDS: {
    HIGH_STARS: 100,
    MEDIUM_STARS: 50,
    MAX_AGE_MONTHS: 6
  },
  OUTPUT_PATH: path.join(__dirname, '../reports/phase6-quality-check.json'),
  SUMMARY_PATH: path.join(__dirname, '../docs/phase6-quality-check-summary.md'),
  AGGREGATED_REPOS_PATH: path.join(__dirname, '../reports/phase6-valid-repos-aggregated.json'),
  BATCH_REPORTS_PATH: path.join(__dirname, '../reports')
};

// Quality categories
const QUALITY = {
  HIGH: 'HIGH_QUALITY',
  MEDIUM: 'MEDIUM_QUALITY',
  LOW: 'LOW_QUALITY',
  EXCLUDE: 'EXCLUDE'
};

// Rate limiting state
let requestCount = 0;
let lastRequestTime = 0;
const requestTimes = [];

/**
 * Delay execution to respect rate limits
 */
async function rateLimitDelay() {
  const now = Date.now();

  // Remove request times older than 1 hour
  while (requestTimes.length > 0 && requestTimes[0] < now - 3600000) {
    requestTimes.shift();
  }

  // Check hourly limit
  if (requestTimes.length >= CONFIG.RATE_LIMIT.requestsPerHour) {
    const waitTime = requestTimes[0] + 3600000 - now;
    console.log(`\n⚠️  Hourly rate limit reached. Waiting ${Math.ceil(waitTime / 1000)}s...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }

  // Check per-minute limit (10 requests/minute for safety)
  const recentRequests = requestTimes.filter(t => t > now - 60000);
  if (recentRequests.length >= CONFIG.RATE_LIMIT.requestsPerMinute) {
    const waitTime = 60000;
    console.log(`\n⏸️  Per-minute rate limit. Waiting ${waitTime / 1000}s...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }

  // Minimum delay between requests (6 seconds = 10 per minute)
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < 6000) {
    await new Promise(resolve => setTimeout(resolve, 6000 - timeSinceLastRequest));
  }

  requestTimes.push(Date.now());
  lastRequestTime = Date.now();
  requestCount++;
}

/**
 * Fetch repository data from GitHub API
 */
function fetchRepoData(owner, repo) {
  return new Promise((resolve, reject) => {
    const url = `${CONFIG.GITHUB_API_BASE}/${owner}/${repo}`;

    https.get(url, {
      headers: {
        'User-Agent': 'OpenClaw-Hub-Quality-Check',
        'Accept': 'application/vnd.github.v3+json'
      }
    }, (res) => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse JSON: ${e.message}`));
          }
        } else if (res.statusCode === 404) {
          reject(new Error('Repository not found (404)'));
        } else if (res.statusCode === 403) {
          reject(new Error('Rate limit exceeded (403)'));
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Check if repository has actual code content
 */
function hasCodeContent(languages, size) {
  if (!languages) return false;
  const languageKeys = Object.keys(languages);
  return languageKeys.length > 0 && size > 0;
}

/**
 * Check if repository was updated within the threshold
 */
function isRecentlyUpdated(updatedAt) {
  const updateDate = new Date(updatedAt);
  const now = new Date();
  const monthsDiff = (now - updateDate) / (1000 * 60 * 60 * 24 * 30);
  return monthsDiff <= CONFIG.QUALITY_THRESHOLDS.MAX_AGE_MONTHS;
}

/**
 * Determine quality category for a repository
 */
function assessQuality(repoData) {
  const reasons = [];
  let category = QUALITY.HIGH;

  // Check if archived
  if (repoData.archived) {
    category = QUALITY.EXCLUDE;
    reasons.push('Repository is archived');
    return { category, reasons };
  }

  // Check if empty
  if (repoData.size === 0) {
    category = QUALITY.EXCLUDE;
    reasons.push('Repository is empty (size: 0)');
    return { category, reasons };
  }

  // Check if fork (consider lower quality if it's just a fork)
  if (repoData.fork) {
    reasons.push('Repository is a fork');
  }

  // Check stars
  const stars = repoData.stargazers_count;
  if (stars >= CONFIG.QUALITY_THRESHOLDS.HIGH_STARS) {
    // High star count - good
  } else if (stars >= CONFIG.QUALITY_THRESHOLDS.MEDIUM_STARS) {
    // Medium star count
    if (category === QUALITY.HIGH) {
      // Keep as HIGH but note it for potential downgrade
    }
  } else {
    reasons.push(`Low star count (${stars} < ${CONFIG.QUALITY_THRESHOLDS.MEDIUM_STARS})`);
  }

  // Check last update
  if (!isRecentlyUpdated(repoData.updated_at)) {
    reasons.push(`Not recently updated (last: ${repoData.updated_at})`);
  }

  // Check if has README
  const hasReadme = !!(repoData.has_readme || repoData.description);
  if (!hasReadme) {
    reasons.push('No README found');
  }

  // Determine final category
  if (reasons.length === 0) {
    category = QUALITY.HIGH;
  } else if (reasons.length <= 1 && stars >= CONFIG.QUALITY_THRESHOLDS.MEDIUM_STARS) {
    category = QUALITY.MEDIUM;
  } else if (reasons.length === 1 && isRecentlyUpdated(repoData.updated_at) && hasReadme) {
    category = QUALITY.MEDIUM;
  } else if (stars >= CONFIG.QUALITY_THRESHOLDS.HIGH_STARS && isRecentlyUpdated(repoData.updated_at)) {
    category = QUALITY.MEDIUM;
  } else {
    category = QUALITY.LOW;
  }

  return { category, reasons };
}

/**
 * Parse repository owner/name from URL
 */
function parseGitHubUrl(url) {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (match) {
    return { owner: match[1], repo: match[2].replace('.git', '') };
  }
  return null;
}

/**
 * Load all repositories to check
 */
function loadRepositories() {
  console.log('📂 Loading repositories from reports...\n');

  const repos = new Map();
  const aggregatedPath = CONFIG.AGGREGATED_REPOS_PATH;

  if (!fs.existsSync(aggregatedPath)) {
    console.error(`❌ Aggregated repos file not found: ${aggregatedPath}`);
    process.exit(1);
  }

  const aggregatedData = JSON.parse(fs.readFileSync(aggregatedPath, 'utf8'));

  // Load HTTP 200 repositories from aggregated file
  for (const repo of aggregatedData.repositories || []) {
    const parsed = parseGitHubUrl(repo.url);
    const key = repo.repository || (parsed ? `${parsed.owner}/${parsed.repo}` : null);
    if (key && !repos.has(key)) {
      repos.set(key, {
        url: repo.url,
        repository: repo.repository,
        category: repo.category,
        batch: repo.batch,
        sourceStatus: 'HTTP_200'
      });
    }
  }

  // Load TIMEOUT and 301 redirect repositories from individual batch reports
  const batchFiles = fs.readdirSync(CONFIG.BATCH_REPORTS_PATH)
    .filter(f => f.match(/batch\d+-repos-verification\.json$/))
    .sort();

  console.log(`📋 Found ${batchFiles.length} batch verification files`);

  for (const file of batchFiles) {
    const filePath = path.join(CONFIG.BATCH_REPORTS_PATH, file);
    try {
      const batchData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const batchNum = file.match(/batch(\d+)/)?.[1];
      // Extract category name from batch or category field
      let categoryName = batchData.category || 'Unknown';
      if (typeof batchData.batch === 'string' && categoryName === 'Unknown') {
        const categoryMatch = batchData.batch.match(/Batch\s+\d+\s+\(([^)]+)\)/);
        if (categoryMatch) {
          categoryName = categoryMatch[1];
        } else if (!batchData.category) {
          categoryName = batchData.batch;
        }
      }

      for (const result of batchData.results || []) {
        // Check both status conditions and handle different result formats
        const status = result.status;
        const isTargetStatus = status === 'TIMEOUT' || status === 301 || status === 'MOVED_PERMANENTLY';

        if (isTargetStatus) {
          // Handle both "url" and "repo" fields
          const repoUrl = result.url || (result.repo ? `https://github.com/${result.repo}` : null);
          if (!repoUrl) continue;

          const parsed = parseGitHubUrl(repoUrl);
          if (parsed) {
            const key = `${parsed.owner}/${parsed.repo}`;
            if (!repos.has(key)) {
              repos.set(key, {
                url: repoUrl,
                repository: result.repo || key,
                category: categoryName,
                batch: batchNum,
                sourceStatus: status
              });
            }
          }
        }
      }
    } catch (e) {
      console.warn(`⚠️  Warning: Could not parse ${file}: ${e.message}`);
    }
  }

  return Array.from(repos.values());
}

/**
 * Process a single repository
 */
async function processRepository(repoInfo) {
  const parsed = parseGitHubUrl(repoInfo.url);
  if (!parsed) {
    return {
      url: repoInfo.url,
      error: 'Invalid GitHub URL',
      quality: QUALITY.EXCLUDE,
      reasons: ['Invalid URL format']
    };
  }

  try {
    await rateLimitDelay();

    process.stdout.write(`\r📊 Processing ${requestCount}/${totalRepos}: ${parsed.owner}/${parsed.repo}    `);

    const repoData = await fetchRepoData(parsed.owner, parsed.repo);

    const { category, reasons } = assessQuality(repoData);

    return {
      url: repoInfo.url,
      repository: repoInfo.repository,
      category: repoInfo.category,
      batch: repoInfo.batch,
      sourceStatus: repoInfo.sourceStatus,
      quality: category,
      reasons: reasons.length > 0 ? reasons : undefined,
      metadata: {
        name: repoData.name,
        fullName: repoData.full_name,
        description: repoData.description,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        openIssues: repoData.open_issues_count,
        createdAt: repoData.created_at,
        updatedAt: repoData.updated_at,
        pushedAt: repoData.pushed_at,
        size: repoData.size,
        language: repoData.language,
        hasReadme: repoData.has_readme,
        archived: repoData.archived,
        fork: repoData.fork,
        license: repoData.license?.name || null,
        homepage: repoData.homepage,
        topics: repoData.topics || []
      }
    };
  } catch (error) {
    return {
      url: repoInfo.url,
      repository: repoInfo.repository,
      category: repoInfo.category,
      batch: repoInfo.batch,
      sourceStatus: repoInfo.sourceStatus,
      error: error.message,
      quality: QUALITY.EXCLUDE,
      reasons: [`API Error: ${error.message}`]
    };
  }
}

/**
 * Generate summary statistics
 */
function generateSummary(results) {
  const summary = {
    totalRepositories: results.length,
    highQuality: {
      count: 0,
      repositories: []
    },
    mediumQuality: {
      count: 0,
      repositories: []
    },
    lowQuality: {
      count: 0,
      repositories: [],
      reasons: {}
    },
    excluded: {
      count: 0,
      repositories: [],
      reasons: {}
    },
    byCategory: {},
    byBatch: {},
    recommendations: []
  };

  for (const result of results) {
    const q = result.quality;

    // Count by quality
    if (q === QUALITY.HIGH) {
      summary.highQuality.count++;
      summary.highQuality.repositories.push({
        repository: result.repository,
        stars: result.metadata?.stars,
        url: result.url
      });
    } else if (q === QUALITY.MEDIUM) {
      summary.mediumQuality.count++;
      summary.mediumQuality.repositories.push({
        repository: result.repository,
        stars: result.metadata?.stars,
        reasons: result.reasons,
        url: result.url
      });
    } else if (q === QUALITY.LOW) {
      summary.lowQuality.count++;
      summary.lowQuality.repositories.push({
        repository: result.repository,
        stars: result.metadata?.stars,
        reasons: result.reasons,
        url: result.url
      });
      for (const reason of result.reasons || []) {
        summary.lowQuality.reasons[reason] = (summary.lowQuality.reasons[reason] || 0) + 1;
      }
    } else {
      summary.excluded.count++;
      summary.excluded.repositories.push({
        repository: result.repository,
        reasons: result.reasons,
        url: result.url
      });
      for (const reason of result.reasons || []) {
        summary.excluded.reasons[reason] = (summary.excluded.reasons[reason] || 0) + 1;
      }
    }

    // Count by original category
    const cat = result.category || 'Unknown';
    if (!summary.byCategory[cat]) {
      summary.byCategory[cat] = { total: 0, high: 0, medium: 0, low: 0, excluded: 0 };
    }
    summary.byCategory[cat].total++;
    if (q === QUALITY.HIGH) summary.byCategory[cat].high++;
    else if (q === QUALITY.MEDIUM) summary.byCategory[cat].medium++;
    else if (q === QUALITY.LOW) summary.byCategory[cat].low++;
    else summary.byCategory[cat].excluded++;

    // Count by batch
    const batch = result.batch || 'Unknown';
    if (!summary.byBatch[batch]) {
      summary.byBatch[batch] = { total: 0, high: 0, medium: 0, low: 0, excluded: 0 };
    }
    summary.byBatch[batch].total++;
    if (q === QUALITY.HIGH) summary.byBatch[batch].high++;
    else if (q === QUALITY.MEDIUM) summary.byBatch[batch].medium++;
    else if (q === QUALITY.LOW) summary.byBatch[batch].low++;
    else summary.byBatch[batch].excluded++;
  }

  // Generate recommendations
  const includeRate = ((summary.highQuality.count + summary.mediumQuality.count) / summary.totalRepositories * 100).toFixed(1);

  if (summary.highQuality.count > 50) {
    summary.recommendations.push(`✅ Excellent quality: ${summary.highQuality.count} high-quality repositories found`);
  } else if (summary.highQuality.count > 20) {
    summary.recommendations.push(`✅ Good quality: ${summary.highQuality.count} high-quality repositories found`);
  }

  if (summary.mediumQuality.count > 100) {
    summary.recommendations.push(`📊 ${summary.mediumQuality.count} medium-quality repositories could be included with manual review`);
  }

  if (summary.excluded.count > 50) {
    const topExclusionReason = Object.entries(summary.excluded.reasons)
      .sort((a, b) => b[1] - a[1])[0];
    summary.recommendations.push(`⚠️  ${summary.excluded.count} repositories excluded - top reason: "${topExclusionReason[0]}" (${topExclusionReason[1]} repos)`);
  }

  summary.recommendations.push(`🎯 Overall inclusion rate: ${includeRate}% (high + medium quality)`);

  return summary;
}

/**
 * Generate markdown summary report
 */
function generateMarkdownReport(summary) {
  const lines = [];

  lines.push('# Phase 6 - Repository Quality Check Summary');
  lines.push('');
  lines.push('**Generated:** ' + new Date().toISOString());
  lines.push('');
  lines.push('## Overview');
  lines.push('');
  lines.push(`| Metric | Count | Percentage |`);
  lines.push(`|--------|-------|------------|`);
  lines.push(`| **Total Repositories** | **${summary.totalRepositories}** | **100%** |`);
  lines.push(`| High Quality | ${summary.highQuality.count} | ${((summary.highQuality.count / summary.totalRepositories) * 100).toFixed(1)}% |`);
  lines.push(`| Medium Quality | ${summary.mediumQuality.count} | ${((summary.mediumQuality.count / summary.totalRepositories) * 100).toFixed(1)}% |`);
  lines.push(`| Low Quality | ${summary.lowQuality.count} | ${((summary.lowQuality.count / summary.totalRepositories) * 100).toFixed(1)}% |`);
  lines.push(`| Excluded | ${summary.excluded.count} | ${((summary.excluded.count / summary.totalRepositories) * 100).toFixed(1)}% |`);
  lines.push('');

  // Quality Definitions
  lines.push('## Quality Criteria');
  lines.push('');
  lines.push('### High Quality');
  lines.push('- Stars > 100');
  lines.push('- Updated within last 6 months');
  lines.push('- Has README and code content');
  lines.push('- Not archived');
  lines.push('');
  lines.push('### Medium Quality');
  lines.push('- Stars > 50');
  lines.push('- Updated within last 6 months');
  lines.push('- Has code content');
  lines.push('- Not archived');
  lines.push('');
  lines.push('### Low Quality');
  lines.push('- Fails one or more criteria above');
  lines.push('- May have low stars, be outdated, or lack documentation');
  lines.push('');
  lines.push('### Excluded');
  lines.push('- Archived repositories');
  lines.push('- Empty repositories');
  lines.push('- API errors (not found, rate limit issues)');
  lines.push('');

  // Top High Quality Repositories
  if (summary.highQuality.repositories.length > 0) {
    lines.push('## Top High Quality Repositories');
    lines.push('');
    lines.push('| Repository | Stars | URL |');
    lines.push('|------------|-------|-----|');

    const topRepos = [...summary.highQuality.repositories]
      .sort((a, b) => (b.stars || 0) - (a.stars || 0))
      .slice(0, 50);

    for (const repo of topRepos) {
      const name = repo.repository.replace('/', ' / ');
      lines.push(`| ${name} | ${repo.stars?.toLocaleString() || 'N/A'} | [View](${repo.url}) |`);
    }
    lines.push('');

    if (summary.highQuality.repositories.length > 50) {
      lines.push(`*... and ${summary.highQuality.repositories.length - 50} more high-quality repositories*`);
      lines.push('');
    }
  }

  // Low Quality Reasons
  if (Object.keys(summary.lowQuality.reasons).length > 0) {
    lines.push('## Low Quality - Common Reasons');
    lines.push('');
    lines.push('| Reason | Count |');
    lines.push('|--------|-------|');

    const sortedReasons = Object.entries(summary.lowQuality.reasons)
      .sort((a, b) => b[1] - a[1]);

    for (const [reason, count] of sortedReasons) {
      lines.push(`| ${reason} | ${count} |`);
    }
    lines.push('');
  }

  // Excluded Reasons
  if (Object.keys(summary.excluded.reasons).length > 0) {
    lines.push('## Excluded - Reasons');
    lines.push('');
    lines.push('| Reason | Count |');
    lines.push('|--------|-------|');

    const sortedReasons = Object.entries(summary.excluded.reasons)
      .sort((a, b) => b[1] - a[1]);

    for (const [reason, count] of sortedReasons) {
      lines.push(`| ${reason} | ${count} |`);
    }
    lines.push('');
  }

  // By Category
  lines.push('## Quality by Original Category');
  lines.push('');
  lines.push('| Category | Total | High | Medium | Low | Excluded |');
  lines.push('|----------|-------|------|--------|-----|----------|');

  for (const [cat, stats] of Object.entries(summary.byCategory).sort((a, b) => b[1].total - a[1].total)) {
    lines.push(`| ${cat} | ${stats.total} | ${stats.high} | ${stats.medium} | ${stats.low} | ${stats.excluded} |`);
  }
  lines.push('');

  // Recommendations
  lines.push('## Recommendations');
  lines.push('');
  for (const rec of summary.recommendations) {
    lines.push(`- ${rec}`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('*This report was generated by the OpenClaw Hub quality check script*');

  return lines.join('\n');
}

/**
 * Main execution
 */
let totalRepos = 0;

async function main() {
  console.log('🔍 OpenClaw Hub - Repository Quality Check');
  console.log('=' .repeat(50));
  console.log('');

  // Load repositories
  const repositories = loadRepositories();
  totalRepos = repositories.length;

  console.log(`\n📊 Total repositories to check: ${totalRepos}`);
  console.log(`⏱️  Estimated time: ${Math.ceil(totalRepos * 6 / 60)} minutes`);
  console.log('');

  // Process repositories
  const results = [];

  for (let i = 0; i < repositories.length; i++) {
    const result = await processRepository(repositories[i]);
    results.push(result);

    // Save checkpoint every 50 repositories
    if ((i + 1) % 50 === 0) {
      console.log(`\n✅ Checkpoint: ${i + 1}/${totalRepos} processed`);
    }
  }

  console.log(`\n\n✅ Completed processing ${totalRepos} repositories`);

  // Generate summary
  console.log('\n📈 Generating summary...');
  const summary = generateSummary(results);

  // Prepare output
  const output = {
    metadata: {
      title: 'Phase 6 - Repository Quality Check',
      generatedAt: new Date().toISOString(),
      totalRepositories: totalRepos,
      processingTime: `${Math.ceil(totalRepos * 6 / 60)} minutes (estimated)`
    },
    summary: summary,
    results: results
  };

  // Save JSON report
  console.log(`💾 Saving JSON report to ${CONFIG.OUTPUT_PATH}...`);
  fs.mkdirSync(path.dirname(CONFIG.OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(CONFIG.OUTPUT_PATH, JSON.stringify(output, null, 2));

  // Save markdown report
  console.log(`📝 Saving markdown report to ${CONFIG.SUMMARY_PATH}...`);
  fs.mkdirSync(path.dirname(CONFIG.SUMMARY_PATH), { recursive: true });
  fs.writeFileSync(CONFIG.SUMMARY_PATH, generateMarkdownReport(summary));

  console.log('\n✨ Quality check complete!');
  console.log('');
  console.log('Results Summary:');
  console.log(`  🌟 High Quality: ${summary.highQuality.count}`);
  console.log(`  📊 Medium Quality: ${summary.mediumQuality.count}`);
  console.log(`  ⚠️  Low Quality: ${summary.lowQuality.count}`);
  console.log(`  ❌ Excluded: ${summary.excluded.count}`);
  console.log('');
  console.log(`📄 Full report: ${CONFIG.OUTPUT_PATH}`);
  console.log(`📄 Summary: ${CONFIG.SUMMARY_PATH}`);
}

// Run
main().catch(console.error);
