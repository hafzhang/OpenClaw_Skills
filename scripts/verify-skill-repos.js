#!/usr/bin/env node

/**
 * Repository Verification Script for OpenClaw Skills
 *
 * This script verifies that skill repositories exist and are accessible.
 * It performs HTTP HEAD requests to check repository status.
 *
 * Usage:
 *   node scripts/verify-skill-repos.js [options]
 *
 * Options:
 *   --file <path>    Path to JSON file containing skill candidates (default: docs/skill-candidates-phase3.json)
 *   --output <path>  Output report path (default: docs/repo-verification-report.json)
 *   --timeout <ms>   Request timeout in milliseconds (default: 10000)
 *   --format         Report format: json or csv (default: json)
 *   --verbose        Show detailed output for each repository
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  file: 'docs/skill-candidates-phase3.json',
  output: 'docs/repo-verification-report.json',
  timeout: 10000,
  format: 'json',
  verbose: false
};

for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--file':
      options.file = args[++i];
      break;
    case '--output':
      options.output = args[++i];
      break;
    case '--timeout':
      options.timeout = parseInt(args[++i], 10);
      break;
    case '--format':
      options.format = args[++i];
      break;
    case '--verbose':
      options.verbose = true;
      break;
    case '--help':
      console.log(`
Repository Verification Script for OpenClaw Skills

Usage: node scripts/verify-skill-repos.js [options]

Options:
  --file <path>    Path to JSON file containing skill candidates
                   (default: docs/skill-candidates-phase3.json)
  --output <path>  Output report path
                   (default: docs/repo-verification-report.json)
  --timeout <ms>   Request timeout in milliseconds (default: 10000)
  --format <fmt>   Report format: json or csv (default: json)
  --verbose        Show detailed output for each repository
  --help           Show this help message

Examples:
  node scripts/verify-skill-repos.js
  node scripts/verify-skill-repos.js --file skills.json --verbose
  node scripts/verify-skill-repos.js --format csv --output report.csv
      `);
      process.exit(0);
  }
}

/**
 * Perform HTTP HEAD request to check if URL is accessible
 */
function checkUrl(url, timeout = options.timeout) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const urlObj = new URL(url);

    const requestOptions = {
      method: 'HEAD',
      host: urlObj.hostname,
      port: urlObj.port || (url.startsWith('https') ? 443 : 80),
      path: urlObj.pathname,
      timeout: timeout,
      headers: {
        'User-Agent': 'OpenClaw-Skills-Verifier/1.0'
      }
    };

    const req = client.request(requestOptions, (res) => {
      // Follow redirects (301, 302, 307, 308)
      if ([301, 302, 307, 308].includes(res.statusCode)) {
        const redirectUrl = res.headers.location;
        if (redirectUrl) {
          if (options.verbose) {
            console.log(`  → Redirecting to: ${redirectUrl}`);
          }
          resolve(checkUrl(redirectUrl, timeout - 100)); // Decrease timeout for redirects
          return;
        }
      }

      resolve({
        url,
        status: res.statusCode,
        success: res.statusCode >= 200 && res.statusCode < 400,
        finalUrl: url
      });
    });

    req.on('error', (error) => {
      resolve({
        url,
        status: 0,
        success: false,
        error: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        status: 0,
        success: false,
        error: 'Timeout'
      });
    });

    req.setTimeout(timeout);
    req.end();
  });
}

/**
 * Main verification function
 */
async function verifyRepositories() {
  console.log(`🔍 OpenClaw Skills Repository Verification`);
  console.log(`===========================================`);
  console.log(`Input file: ${options.file}`);
  console.log(`Output file: ${options.output}`);
  console.log(`Timeout: ${options.timeout}ms`);
  console.log(`Format: ${options.format}`);
  console.log('');

  // Load skills data
  let skills;
  try {
    const filePath = path.resolve(process.cwd(), options.file);
    const content = fs.readFileSync(filePath, 'utf-8');
    skills = JSON.parse(content);
    console.log(`✅ Loaded ${skills.length} skills from ${options.file}`);
    console.log('');
  } catch (error) {
    console.error(`❌ Error loading skills file: ${error.message}`);
    process.exit(1);
  }

  // Verify each repository
  const results = [];
  let successCount = 0;
  let failCount = 0;
  let redirectCount = 0;

  for (let i = 0; i < skills.length; i++) {
    const skill = skills[i];
    const { name } = skill;
    // Support both 'github' and 'url' fields
    const repoUrl = skill.github || skill.url;

    if (!repoUrl) {
      console.log(`\n⚠️  Skipping ${name} - no repository URL`);
      continue;
    }

    if (options.verbose) {
      console.log(`[${i + 1}/${skills.length}] Checking: ${name}`);
      console.log(`  URL: ${repoUrl}`);
    } else {
      process.stdout.write(`\r[${i + 1}/${skills.length}] Checking ${name}...`);
    }

    const result = await checkUrl(repoUrl);

    const verificationResult = {
      name,
      slug: skill.slug,
      category: skill.category,
      originalUrl: repoUrl,
      finalUrl: result.finalUrl || repoUrl,
      status: result.status,
      success: result.success,
      error: result.error,
      redirected: result.finalUrl !== repoUrl
    };

    results.push(verificationResult);

    if (result.success) {
      successCount++;
      if (result.finalUrl !== repoUrl) {
        redirectCount++;
      }
      if (options.verbose) {
        console.log(`  ✅ Status: ${result.status}`);
        if (result.finalUrl !== repoUrl) {
          console.log(`  → Final URL: ${result.finalUrl}`);
        }
      }
    } else {
      failCount++;
      if (options.verbose) {
        console.log(`  ❌ Status: ${result.status || 'Error'}`);
        if (result.error) {
          console.log(`  Error: ${result.error}`);
        }
      }
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  if (!options.verbose) {
    console.log(''); // New line after progress indicator
  }

  // Generate summary
  const summary = {
    timestamp: new Date().toISOString(),
    total: skills.length,
    success: successCount,
    failed: failCount,
    redirected: redirectCount,
    successRate: ((successCount / skills.length) * 100).toFixed(2) + '%',
    byCategory: {}
  };

  // Calculate stats by category
  skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = { total: 0, success: 0, failed: 0 };
    }
    acc[skill.category].total++;
    const result = results.find(r => r.slug === skill.slug);
    if (result && result.success) {
      acc[skill.category].success++;
    } else {
      acc[skill.category].failed++;
    }
    return acc;
  }, summary.byCategory);

  // Print summary
  console.log('');
  console.log(`📊 Verification Summary`);
  console.log(`======================`);
  console.log(`Total skills:    ${summary.total}`);
  console.log(`✅ Successful:   ${summary.success} (${summary.successRate})`);
  console.log(`❌ Failed:       ${summary.failed}`);
  console.log(`↪️  Redirected:   ${summary.redirected}`);
  console.log('');

  console.log(`By Category:`);
  Object.entries(summary.byCategory)
    .sort((a, b) => b[1].total - a[1].total)
    .forEach(([category, stats]) => {
      const rate = ((stats.success / stats.total) * 100).toFixed(1);
      console.log(`  ${category.padEnd(15)} ${stats.success}/${stats.total} (${rate}%)`);
    });

  // Generate report
  const report = {
    summary,
    results
  };

  // Save report
  const outputDir = path.dirname(options.output);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (options.format === 'csv') {
    // Generate CSV report
    const csvHeaders = ['Name', 'Slug', 'Category', 'Original URL', 'Final URL', 'Status', 'Success', 'Error'];
    const csvRows = results.map(r => [
      r.name,
      r.slug,
      r.category,
      r.originalUrl,
      r.finalUrl,
      r.status,
      r.success ? 'Yes' : 'No',
      r.error || ''
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    fs.writeFileSync(options.output.replace('.json', '.csv'), csvContent);
    console.log(``);
    console.log(`📄 CSV report saved to: ${options.output.replace('.json', '.csv')}`);
  } else {
    // Save JSON report
    fs.writeFileSync(options.output, JSON.stringify(report, null, 2));
    console.log(``);
    console.log(`📄 JSON report saved to: ${options.output}`);
  }

  // List failed repositories if any
  if (failCount > 0) {
    console.log(``);
    console.log(`❌ Failed Repositories (${failCount}):`);
    results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`  - ${r.name} (${r.slug}): ${r.error || r.status}`);
      });
  }

  // Exit with error code if any failures
  process.exit(failCount > 0 ? 1 : 0);
}

// Run verification
verifyRepositories().catch(error => {
  console.error(`❌ Fatal error: ${error.message}`);
  process.exit(1);
});
