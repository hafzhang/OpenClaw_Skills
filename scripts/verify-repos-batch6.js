/**
 * Verify GitHub repositories for Phase 6 Batch 6 - Build Tools & Bundlers
 * Build Tools: Webpack, Vite, Esbuild, Rollup, Parcel
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Repositories to verify - 40 build tool repositories
const repos = [
  // Webpack Ecosystem (10)
  'https://github.com/webpack/webpack',
  'https://github.com/webpack/webpack-cli',
  'https://github.com/webpack-contrib/webpack-bundle-analyzer',
  'https://github.com/webpack-contrib/css-minimizer-webpack-plugin',
  'https://github.com/webpack-contrib/mini-css-extract-plugin',
  'https://github.com/webpack-contrib/html-webpack-plugin',
  'https://github.com/webpack-contrib/file-loader',
  'https://github.com/webpack-contrib/url-loader',
  'https://github.com/webpack-contrib/cache-loader',
  'https://github.com/webpack/webpack-dev-server',

  // Vite Ecosystem (10)
  'https://github.com/vitejs/vite',
  'https://github.com/vitejs/vite-plugin-react',
  'https://github.com/vitejs/plugin-vue',
  'https://github.com/antfu/unplugin-auto-import',
  'https://github.com/antfu/unplugin-vue-components',
  'https://github.com/antfu/unplugin-icons',
  'https://github.com/nuxt/framework',
  'https://github.com/sveltejs/kit',
  'https://github.com/withastro/astro',
  'https://github.com/vitejs/vite-plugin-pwa',

  // Esbuild Ecosystem (6)
  'https://github.com/evanw/esbuild',
  'https://github.com/evanw/esbuild-visualizer',
  'https://github.com/andrew_codes/esbuild-runner',
  'https://github.com/elg/tsnr',
  'https://github.com/yankeeinlondon/esbuild-runner',
  'https://github.com/remorses/esbuild-plugins',

  // Rollup Ecosystem (8)
  'https://github.com/rollup/rollup',
  'https://github.com/rollup/plugins',
  'https://github.com/ezolenko/rollup-plugin-typescript2',
  'https://github.com/trivago/rollup-plugin-preserve-shebang',
  'https://github.com/TrySound/rollup-plugin-node-resolve',
  'https://github.com/rollup/rollup-plugin-commonjs',
  'https://github.com/vitejs/rollup-plugin-license',
  'https://github.com/TrySound/rollup-plugin-terser',

  // Parcel Ecosystem (6)
  'https://github.com/parcel-bundler/parcel',
  'https://github.com/parcel-bundler/parcel-css',
  'https://github.com/parcel-bundler/parcel-packager-node',
  'https://github.com/parcel-bundler/utils',
  'https://github.com/parcel-bundler/parcel-reporter-bundle-buddy',
  'https://github.com/mischnic/parcel-reporter-multiple-file'
];

function checkRepo(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const options = {
      method: 'HEAD',
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      timeout: 15000, // 15 seconds timeout for large repos
      headers: {
        'User-Agent': 'OpenClaw-Skills-Verifier/1.0'
      }
    };

    const client = urlObj.protocol === 'https:' ? https : http;

    const req = client.request(options, (res) => {
      resolve({
        url,
        status: res.statusCode,
        success: res.statusCode === 200
      });
    });

    req.on('error', (err) => {
      resolve({
        url,
        status: 'ERROR',
        success: false,
        error: err.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        success: false,
        error: 'Request timeout (15s)'
      });
    });

    req.end();
  });
}

async function verifyAllRepos() {
  console.log(`Verifying ${repos.length} repositories...\n`);

  const results = [];
  let successCount = 0;
  let failCount = 0;
  let timeoutCount = 0;
  let errorCount = 0;

  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i];
    process.stdout.write(`[${i + 1}/${repos.length}] Checking ${repo.split('/').pop()}... `);

    const result = await checkRepo(repo);
    results.push(result);

    if (result.success) {
      successCount++;
      console.log(`✓ ${result.status}`);
    } else if (result.status === 'TIMEOUT') {
      timeoutCount++;
      console.log(`⏱ TIMEOUT`);
    } else if (result.status === 'ERROR') {
      errorCount++;
      console.log(`✗ ERROR: ${result.error || 'Unknown error'}`);
    } else {
      failCount++;
      console.log(`✗ ${result.status}`);
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 100));
  }

  // Generate report
  console.log('\n=== Verification Report ===');
  console.log(`Total: ${repos.length}`);
  console.log(`✓ Success (200): ${successCount} (${(successCount/repos.length*100).toFixed(1)}%)`);
  console.log(`✗ Failed (404/other): ${failCount} (${(failCount/repos.length*100).toFixed(1)}%)`);
  console.log(`⏱ Timeout: ${timeoutCount} (${(timeoutCount/repos.length*100).toFixed(1)}%)`);
  console.log(`✗ Error: ${errorCount} (${(errorCount/repos.length*100).toFixed(1)}%)`);

  // Save detailed report
  const reportPath = './reports/batch6-repos-verification.json';
  const fs = require('fs');
  const report = {
    timestamp: new Date().toISOString(),
    batch: 'Phase 6 - Batch 6 (Build Tools & Bundlers)',
    total: repos.length,
    summary: {
      success: successCount,
      failed: failCount,
      timeout: timeoutCount,
      error: errorCount
    },
    results: results
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nDetailed report saved to: ${reportPath}`);

  // List successful repos
  console.log('\n=== Successful Repositories (HTTP 200) ===');
  results
    .filter(r => r.success)
    .forEach(r => console.log(`  ✓ ${r.url}`));

  // List failed/timeout repos
  console.log('\n=== Failed/Timeout Repositories ===');
  results
    .filter(r => !r.success)
    .forEach(r => console.log(`  ✗ ${r.url} - ${r.status}${r.error ? ` (${r.error})` : ''}`));
}

verifyAllRepos().catch(console.error);
