#!/usr/bin/env node

/**
 * Repository Verification Script for Phase 6 Batch 1
 * Verifies HTTP 200 status for all researched skill repositories
 */

const https = require('https');
const http = require('http');
const fs = require('fs');

// Repositories from Batch 1 research
const repositories = [
  // Python Tools
  'https://github.com/python-poetry/poetry',
  'https://github.com/psf/black',
  'https://github.com/astral-sh/ruff',
  'https://github.com/pytest-dev/pytest',
  'https://github.com/python/mypy',
  'https://github.com/astral-sh/uv',
  'https://github.com/celery/celery',
  'https://github.com/encode/httpx',
  'https://github.com/tiangolo/fastapi',
  'https://github.com/fastapi/typer',
  'https://github.com/Textualize/rich',
  'https://github.com/pydantic/pydantic',
  'https://github.com/jiffyclub/snakeviz',
  'https://github.com/PyCQA/bandit',
  'https://github.com/pre-commit/pre-commit',

  // Go Tools
  'https://github.com/spf13/cobra',
  'https://github.com/spf13/viper',
  'https://github.com/golang/tools',
  'https://github.com/golangci/golangci-lint',
  'https://github.com/cosmtrek/air',
  'https://github.com/go-swagger/go-swagger',
  'https://github.com/google/wire',
  'https://github.com/bufbuild/buf',
  'https://github.com/gogf/gf',
  'https://github.com/ent/ent',
  'https://github.com/go-kit/kit',
  'https://github.com/gin-gonic/gin',
  'https://github.com/go-chi/chi',
  'https://github.com/a-h/templ',

  // Rust Tools
  'https://github.com/clap-rs/clap',
  'https://github.com/tokio-rs/tokio',
  'https://github.com/serde-rs/serde',
  'https://github.com/dtolnay/anyhow',
  'https://github.com/dtolnay/thiserror',
  'https://github.com/tokio-rs/tracing',
  'https://github.com/tokio-rs/axum',
  'https://github.com/launchbadge/sqlx',
  'https://github.com/leptos-rs/leptos',
  'https://github.com/dtolnay/cargo-expand',

  // PHP Tools
  'https://github.com/composer/composer',
  'https://github.com/PHP-CS-Fixer/PHP-CS-Fixer',
  'https://github.com/vimeo/psalm',
  'https://github.com/sebastianbergmann/phpunit',
  'https://github.com/laravel/framework',
  'https://github.com/symfony/symfony',
  'https://github.com/pest-php/pest',
  'https://github.com/rector/rector',
  'https://github.com/xdebug/xdebug',
  'https://github.com/Seldaek/monolog',
];

// Results tracking
const results = {
  total: repositories.length,
  success: 0,
  failed: 0,
  errors: 0,
  details: []
};

// Function to check URL status
function checkUrl(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;

    const options = {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OpenClaw-Hub/1.0)'
      },
      timeout: 10000 // 10 second timeout
    };

    const req = client.request(url, options, (res) => {
      resolve({
        url: url,
        status: res.statusCode,
        success: res.statusCode === 200
      });
    });

    req.on('error', (err) => {
      resolve({
        url: url,
        status: 'ERROR',
        success: false,
        error: err.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url: url,
        status: 'TIMEOUT',
        success: false,
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

// Function to process repositories with concurrency limit
async function processRepositories(repos, concurrency = 10) {
  const results = [];

  for (let i = 0; i < repos.length; i += concurrency) {
    const batch = repos.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(checkUrl));
    results.push(...batchResults);

    // Print progress
    const completed = Math.min(i + concurrency, repos.length);
    console.log(`Progress: ${completed}/${repos.length} repositories checked`);
  }

  return results;
}

// Main execution
async function main() {
  console.log('='.repeat(60));
  console.log('Repository Verification - Phase 6 Batch 1');
  console.log('Python/Go/Rust/PHP Tools (50 repositories)');
  console.log('='.repeat(60));
  console.log('');

  const verificationResults = await processRepositories(repositories);

  // Process results
  verificationResults.forEach(result => {
    if (result.success) {
      results.success++;
      results.details.push({ url: result.url, status: result.status });
    } else if (result.status === 'ERROR' || result.status === 'TIMEOUT') {
      results.errors++;
      results.details.push({ url: result.url, status: result.status, error: result.error });
    } else {
      results.failed++;
      results.details.push({ url: result.url, status: result.status });
    }
  });

  // Print summary
  console.log('');
  console.log('='.repeat(60));
  console.log('VERIFICATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Repositories: ${results.total}`);
  console.log(`✅ Success (200):     ${results.success} (${((results.success/results.total)*100).toFixed(1)}%)`);
  console.log(`❌ Failed (not 200):  ${results.failed} (${((results.failed/results.total)*100).toFixed(1)}%)`);
  console.log(`⚠️  Errors/Timeout:   ${results.errors} (${((results.errors/results.total)*100).toFixed(1)}%)`);
  console.log('');

  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.total,
      success: results.success,
      failed: results.failed,
      errors: results.errors,
      successRate: ((results.success/results.total)*100).toFixed(1) + '%'
    },
    details: results.details
  };

  const reportPath = 'scripts/repo-verification-report-batch1.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`Detailed report saved to: ${reportPath}`);

  // List failed/error repositories if any
  const problemRepos = results.details.filter(r => !r.success || (r.status !== 200 && typeof r.status === 'number'));
  if (problemRepos.length > 0) {
    console.log('');
    console.log('Repositories with issues:');
    problemRepos.forEach(repo => {
      console.log(`  - ${repo.url}: ${repo.status} ${repo.error || ''}`);
    });
  }

  console.log('');
  console.log('='.repeat(60));
}

main().catch(console.error);
