#!/usr/bin/env node

/**
 * Verify GitHub repositories from a markdown file
 * Extracts GitHub URLs and verifies they return HTTP 200
 */

const fs = require('fs');
const https = require('https');
const http = require('http');

const INPUT_FILE = process.argv[2] || 'development-github-repos-2026.md';
const OUTPUT_FILE = process.argv[3] || 'reports/dev-repos-verification.json';
const TIMEOUT = 10000;

// Read markdown file
const markdown = fs.readFileSync(INPUT_FILE, 'utf-8');

// Extract GitHub URLs
const urlRegex = /https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+/g;
const urls = [...new Set(markdown.match(urlRegex) || [])];

console.log(`🔍 Verifying ${urls.length} GitHub repositories...`);
console.log('');

const results = [];
let completed = 0;

function verifyUrl(url) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const protocol = url.startsWith('https') ? https : http;
    const urlObj = new URL(url);

    const options = {
      method: 'HEAD',
      host: urlObj.hostname,
      path: urlObj.pathname,
      timeout: TIMEOUT,
      headers: {
        'User-Agent': 'OpenClaw-Skills-Verifier/1.0'
      }
    };

    const req = protocol.request(options, (res) => {
      const duration = Date.now() - startTime;
      resolve({
        url,
        status: res.statusCode,
        success: res.statusCode === 200,
        duration,
        redirect: res.headers.location
      });
    });

    req.on('error', (err) => {
      resolve({
        url,
        status: 'ERROR',
        success: false,
        error: err.message,
        duration: Date.now() - startTime
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        success: false,
        error: 'Request timeout',
        duration: Date.now() - startTime
      });
    });

    req.end();
  });
}

async function verifyAll() {
  for (const url of urls) {
    const result = await verifyUrl(url);
    results.push(result);
    completed++;

    const status = result.success ? '✅' : '❌';
    const statusText = typeof result.status === 'number' ? `${result.status}` : result.status;
    console.log(`${status} [${completed}/${urls.length}] ${statusText} - ${url}`);
  }

  // Generate summary
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;
  const avgDuration = Math.round(results.reduce((a, b) => a + b.duration, 0) / results.length);

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.length,
      success: successCount,
      failed: failCount,
      successRate: ((successCount / results.length) * 100).toFixed(2) + '%',
      avgDuration: avgDuration + 'ms'
    },
    results: results
  };

  // Ensure output directory exists
  const outputDir = require('path').dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write report
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));

  console.log('');
  console.log('='.repeat(50));
  console.log('📊 Verification Summary');
  console.log('='.repeat(50));
  console.log(`Total: ${results.length}`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📈 Success Rate: ${report.summary.successRate}`);
  console.log(`⏱️  Avg Duration: ${avgDuration}ms`);
  console.log(`📄 Report saved to: ${OUTPUT_FILE}`);
  console.log('');

  // List failed repositories
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('❌ Failed Repositories:');
    failed.forEach(r => {
      console.log(`   ${r.url} - ${r.status} ${r.error || ''}`);
    });
  }
}

verifyAll().catch(console.error);
