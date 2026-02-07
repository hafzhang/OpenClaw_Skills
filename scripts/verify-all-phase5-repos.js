#!/usr/bin/env node

/**
 * Batch Verification Script for Phase 5 Research Documents
 *
 * This script extracts GitHub repository URLs from all Phase 5 research markdown files
 * and verifies they return HTTP 200. It generates a comprehensive report with:
 * - HTTP status codes
 * - Star counts (from research data)
 * - Last update information
 * - Success/failure statistics
 *
 * Usage: node scripts/verify-all-phase5-repos.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const RESEARCH_DIR = path.join(process.cwd(), 'docs');
const OUTPUT_FILE = path.join(process.cwd(), 'docs', 'phase5-repo-verification-report.json');
const TIMEOUT = 15000;
const CONCURRENT = 5; // Number of concurrent requests

// Research documents to process
const RESEARCH_FILES = [
  'skill-research-phase5-batch1.md',
  'skill-research-phase5-batch2.md',
  'skill-research-phase5-batch3.md',
  'skill-research-phase5-batch4.md',
  'skill-research-phase5-batch5.md',
  'skill-research-phase5-batch6.md',
  'skill-research-phase5-batch7.md',
  'skill-research-phase5-batch8.md'
];

/**
 * Extract GitHub URLs and metadata from markdown files
 */
function extractReposFromMarkdown(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const repos = [];
  let currentCategory = '';
  let currentSubcategory = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Track categories (## headers)
    if (line.startsWith('## ') && !line.includes('Summary') && !line.includes('Selection') && !line.includes('Next') && !line.includes('Verification')) {
      currentCategory = line.replace(/^##\s+/, '').trim();
      currentSubcategory = '';
    }

    // Track subcategories (### headers)
    if (line.startsWith('### ')) {
      currentSubcategory = line.replace(/^###\s+/, '').trim();
    }

    // Extract table rows with GitHub URLs
    // Format: | # | Name | Repository | Stars | Description |
    const tableRowMatch = line.match(/^\|\s*\d+\s*\|\s*([^|]+)\s*\|\s*(https:\/\/github\.com\/[^\s|]+)\s*\|\s*(\d+k\+|\d+\+|\d+)\s*\|\s*([^|]+)\s*\|/);
    if (tableRowMatch) {
      const [, name, url, stars, description] = tableRowMatch;
      repos.push({
        name: name.trim(),
        url: url.trim(),
        stars: stars.trim(),
        description: description.trim(),
        category: currentCategory,
        subcategory: currentSubcategory,
        sourceFile: path.basename(filePath)
      });
    }
  }

  return repos;
}

/**
 * Verify a single repository URL
 */
function verifyUrl(repo) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const urlObj = new URL(repo.url);

    const options = {
      method: 'HEAD',
      host: urlObj.hostname,
      path: urlObj.pathname,
      timeout: TIMEOUT,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OpenClaw-Skills-Verifier/1.0)',
        'Accept': 'text/html,application/xhtml+xml'
      }
    };

    const req = https.request(options, (res) => {
      const duration = Date.now() - startTime;

      // Handle redirects
      if ([301, 302, 307, 308].includes(res.statusCode)) {
        const redirectUrl = res.headers.location;
        if (redirectUrl) {
          // Recursively follow redirect
          resolve(verifyUrl({ ...repo, url: redirectUrl, originalUrl: repo.url || repo.url }));
          return;
        }
      }

      resolve({
        ...repo,
        originalUrl: repo.originalUrl || repo.url,
        status: res.statusCode,
        success: res.statusCode === 200,
        duration,
        finalUrl: repo.url
      });
    });

    req.on('error', (err) => {
      resolve({
        ...repo,
        originalUrl: repo.originalUrl || repo.url,
        status: 0,
        success: false,
        error: err.message,
        duration: Date.now() - startTime
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        ...repo,
        originalUrl: repo.originalUrl || repo.url,
        status: 0,
        success: false,
        error: 'Timeout',
        duration: Date.now() - startTime
      });
    });

    req.setTimeout(TIMEOUT);
    req.end();
  });
}

/**
 * Process repos in batches to avoid rate limiting
 */
async function verifyBatch(repos) {
  const results = [];
  for (let i = 0; i < repos.length; i += CONCURRENT) {
    const batch = repos.slice(i, i + CONCURRENT);
    const batchResults = await Promise.all(batch.map(verifyUrl));
    results.push(...batchResults);

    // Show progress
    const completed = Math.min(i + CONCURRENT, repos.length);
    process.stdout.write(`\r[${completed}/${repos.length}] Verifying repositories...`);

    // Rate limiting delay between batches
    if (i + CONCURRENT < repos.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  return results;
}

/**
 * Main function
 */
async function main() {
  console.log(`🔍 Phase 5 Repository Verification`);
  console.log(`===================================`);
  console.log(`Research files: ${RESEARCH_FILES.length}`);
  console.log(`Output file: ${OUTPUT_FILE}`);
  console.log(`Timeout: ${TIMEOUT}ms`);
  console.log(`Concurrent requests: ${CONCURRENT}`);
  console.log('');

  // Extract all repositories from research files
  const allRepos = [];
  console.log(`📂 Extracting repositories from research files...`);

  for (const file of RESEARCH_FILES) {
    const filePath = path.join(RESEARCH_DIR, file);
    if (fs.existsSync(filePath)) {
      const repos = extractReposFromMarkdown(filePath);
      console.log(`  ✅ ${file}: ${repos.length} repositories`);
      allRepos.push(...repos);
    } else {
      console.log(`  ⚠️  ${file}: File not found`);
    }
  }

  console.log(`\n📊 Total repositories to verify: ${allRepos.length}`);
  console.log('');

  // Verify all repositories
  console.log(`🌐 Verifying repositories...`);
  const results = await verifyBatch(allRepos);
  console.log(''); // New line after progress

  // Calculate statistics
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;
  const avgDuration = Math.round(results.reduce((a, b) => a + (b.duration || 0), 0) / results.length);

  // Group by source file
  const bySourceFile = {};
  results.forEach(r => {
    if (!bySourceFile[r.sourceFile]) {
      bySourceFile[r.sourceFile] = { total: 0, success: 0, failed: 0, repos: [] };
    }
    bySourceFile[r.sourceFile].total++;
    bySourceFile[r.sourceFile].repos.push(r);
    if (r.success) {
      bySourceFile[r.sourceFile].success++;
    } else {
      bySourceFile[r.sourceFile].failed++;
    }
  });

  // Group by category
  const byCategory = {};
  results.forEach(r => {
    if (!byCategory[r.category]) {
      byCategory[r.category] = { total: 0, success: 0, failed: 0 };
    }
    byCategory[r.category].total++;
    if (r.success) {
      byCategory[r.category].success++;
    } else {
      byCategory[r.category].failed++;
    }
  });

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.length,
      success: successCount,
      failed: failCount,
      successRate: ((successCount / results.length) * 100).toFixed(2) + '%',
      avgDuration: avgDuration + 'ms'
    },
    bySourceFile: Object.fromEntries(
      Object.entries(bySourceFile).map(([file, data]) => [
        file,
        {
          total: data.total,
          success: data.success,
          failed: data.failed,
          successRate: ((data.success / data.total) * 100).toFixed(1) + '%'
        }
      ])
    ),
    byCategory: Object.fromEntries(
      Object.entries(byCategory).map(([cat, data]) => [
        cat,
        {
          total: data.total,
          success: data.success,
          failed: data.failed,
          successRate: ((data.success / data.total) * 100).toFixed(1) + '%'
        }
      ])
    ),
    results: results.map(r => ({
      name: r.name,
      url: r.originalUrl || r.url,
      finalUrl: r.finalUrl,
      status: r.status,
      success: r.success,
      duration: r.duration + 'ms',
      error: r.error,
      stars: r.stars,
      category: r.category,
      subcategory: r.subcategory,
      sourceFile: r.sourceFile
    }))
  };

  // Save report
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));

  // Print summary
  console.log(`📊 Verification Summary`);
  console.log(`======================`);
  console.log(`Total repositories: ${results.length}`);
  console.log(`✅ Successful: ${successCount} (${((successCount / results.length) * 100).toFixed(1)}%)`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`⏱️  Average duration: ${avgDuration}ms`);
  console.log('');

  console.log(`By Source File:`);
  Object.entries(bySourceFile)
    .sort((a, b) => b[1].total - a[1].total)
    .forEach(([file, data]) => {
      const rate = ((data.success / data.total) * 100).toFixed(1);
      console.log(`  ${file.padEnd(35)} ${data.success}/${data.total} (${rate}%)`);
    });

  console.log('');
  console.log(`📄 Report saved to: ${OUTPUT_FILE}`);

  // List failed repositories
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('');
    console.log(`❌ Failed Repositories (${failed.length}):`);
    failed.forEach(r => {
      console.log(`   ${r.name} (${r.sourceFile})`);
      console.log(`      URL: ${r.url}`);
      console.log(`      Status: ${r.status} ${r.error || ''}`);
    });
  }

  console.log('');

  // Generate CSV file for easy analysis
  const csvFile = OUTPUT_FILE.replace('.json', '.csv');
  const csvHeaders = 'Name,URL,Status,Success,Duration(ms),Stars,Category,Subcategory,SourceFile,Error\n';
  const csvRows = results.map(r =>
    `"${r.name}","${r.originalUrl || r.url}",${r.status},${r.success},${r.duration},"${r.stars}","${r.category}","${r.subcategory}","${r.sourceFile}","${r.error || ''}"`
  ).join('\n');
  fs.writeFileSync(csvFile, csvHeaders + csvRows);
  console.log(`📄 CSV report saved to: ${csvFile}`);

  // Exit with appropriate code
  process.exit(failCount > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
