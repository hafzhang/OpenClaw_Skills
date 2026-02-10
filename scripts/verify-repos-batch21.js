/**
 * Repository Verification Script for Phase 6 Batch 21
 * System Tools (30 repositories)
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Repositories to verify
const repos = [
  // GNU Core Tools (10)
  'https://github.com/coreutils/coreutils',
  'https://github.com/DWesl/findutils',
  'https://github.com/pinard/diffutils',
  'https://github.com/gnulib-bootstrap/sed',
  'https://github.com/gnu/gawk',
  'https://github.com/gnulib-bootstrap/grep',
  'https://github.com/tar-tarball/tar',
  'https://github.com/gzip/gzip',
  'https://github.com/bash/bash/bash',
  'https://github.com/zsh-users/zsh',

  // Modern Text Processing Tools (10)
  'https://github.com/BurntSushi/ripgrep',
  'https://github.com/ggreer/the_silver_searcher',
  'https://github.com/beyondgrep/ack',
  'https://github.com/genivia/ugrep',
  'https://github.com/chmln/sd',
  'https://github.com/gmargari/sed',
  'https://github.com/learnbyexample/Command-line-text-processing',
  'https://github.com/stedolan/jq',
  'https://github.com/mikefarah/yq',
  'https://github.com/pelletier/go-toml',

  // System Info and Management Tools (10)
  'https://github.com/dylanaraps/neofetch',
  'https://github.com/fastfetch-cli/fastfetch',
  'https://github.com/KatieFalcon/ScreenFetch',
  'https://github.com/openSUSE/hwinfo',
  'https://github.com/canonical/lshw',
  'https://github.com/m-roc Bowen/dfc',
  'https://github.com/muesli/duf',
  'https://github.com/bootandy/dust',
  'https://github.com/rofl0r/ncdu',
  'https://github.com/duuduke/gdu'
];

// Results storage
const results = [];
let successCount = 0;
let failCount = 0;
let timeoutCount = 0;
let errorCount = 0;
let redirectCount = 0;

/**
 * Perform HTTP HEAD request to check repository accessibility
 */
function checkRepo(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;

    const options = {
      method: 'HEAD',
      host: urlObj.hostname,
      path: urlObj.pathname,
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OpenClaw-Hub/1.0)'
      }
    };

    const req = client.request(options, (res) => {
      let redirectUrl = null;
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        redirectUrl = res.headers.location;
      }

      resolve({
        url,
        status: res.statusCode,
        redirectUrl,
        success: res.statusCode === 200
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        redirectUrl: null,
        success: false
      });
    });

    req.on('error', (err) => {
      resolve({
        url,
        status: `ERROR: ${err.message}`,
        redirectUrl: null,
        success: false
      });
    });

    req.end();
  });
}

/**
 * Main verification function
 */
async function verifyRepos() {
  console.log('='.repeat(60));
  console.log('Phase 6 Batch 21 - Repository Verification');
  console.log('System Tools');
  console.log('(GNU Core/Text Processing/System Info)');
  console.log(`Total repositories: ${repos.length}`);
  console.log('='.repeat(60));

  const total = repos.length;

  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i];
    const repoName = repo.split('/').pop();

    process.stdout.write(`\r[${i + 1}/${total}] Checking ${repoName}...`);

    const result = await checkRepo(repo);
    results.push(result);

    if (result.success) {
      successCount++;
    } else if (result.status === 'TIMEOUT') {
      timeoutCount++;
    } else if (typeof result.status === 'string' && result.status.startsWith('ERROR')) {
      errorCount++;
    } else {
      failCount++;
    }

    if (result.redirectUrl) {
      redirectCount++;
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('\n\n' + '='.repeat(60));
  console.log('Verification Complete');
  console.log('='.repeat(60));

  // Print summary
  console.log(`\nSummary:`);
  console.log(`  Total: ${total}`);
  console.log(`  Success (HTTP 200): ${successCount} (${((successCount / total) * 100).toFixed(1)}%)`);
  console.log(`  Timeout: ${timeoutCount} (${((timeoutCount / total) * 100).toFixed(1)}%)`);
  console.log(`  Error: ${errorCount} (${((errorCount / total) * 100).toFixed(1)}%)`);
  console.log(`  Other Failures: ${failCount} (${((failCount / total) * 100).toFixed(1)}%)`);
  console.log(`  Redirects (301/302): ${redirectCount}`);

  // Print failed repositories
  console.log('\n' + '-'.repeat(60));
  console.log('Failed Repositories:');
  console.log('-'.repeat(60));

  const failed = results.filter(r => !r.success);
  failed.forEach(r => {
    console.log(`  [${r.status}] ${r.url}`);
    if (r.redirectUrl) {
      console.log(`    -> Redirects to: ${r.redirectUrl}`);
    }
  });

  // Save results to JSON
  const reportPath = path.join(__dirname, '..', 'reports', 'batch21-repos-verification.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    batch: 21,
    category: 'System Tools',
    total: total,
    summary: {
      success: successCount,
      timeout: timeoutCount,
      error: errorCount,
      fail: failCount,
      redirect: redirectCount
    },
    results: results
  }, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log(`Report saved to: ${reportPath}`);
  console.log('='.repeat(60));
}

// Run verification
verifyRepos().catch(console.error);
