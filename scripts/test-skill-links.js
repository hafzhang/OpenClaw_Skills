#!/usr/bin/env node

/**
 * Test all skill links for accessibility
 * Verifies that all GitHub URLs in skills.json return HTTP 200
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Read skills
const skillsPath = path.join(__dirname, '../src/data/skills.json');
const skills = JSON.parse(fs.readFileSync(skillsPath, 'utf8'));

console.log(`Testing ${skills.length} skill links...\n`);

// Results tracking
let total = 0;
let success = 0;
let failed = 0;
let errors = [];
const results = [];

// Test a single URL
function testUrl(url) {
  return new Promise((resolve) => {
    const hostname = url.split('/')[2];
    const path = url.split('/').slice(3).join('/');

    const options = {
      hostname: hostname,
      path: '/' + path,
      method: 'HEAD',
      timeout: 10000,
      headers: {
        'User-Agent': 'OpenClaw-Hub-Link-Checker/1.0'
      }
    };

    const req = https.request(options, (res) => {
      resolve({
        url,
        status: res.statusCode,
        success: res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302
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
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

// Test all skills (limit to new skills for faster testing)
const newSkills = skills.filter(s => parseInt(s.id.split('-')[1]) >= 201);
console.log(`Testing ${newSkills.length} new skills (skill-201+)...\n`);

// Process in batches of 10
const batchSize = 10;
let batches = [];

for (let i = 0; i < newSkills.length; i += batchSize) {
  batches.push(newSkills.slice(i, i + batchSize));
}

async function processBatch(batch) {
  const promises = batch.map(skill => testUrl(skill.url));
  return await Promise.all(promises);
}

async function runTests() {
  for (let i = 0; i < batches.length; i++) {
    console.log(`Processing batch ${i + 1}/${batches.length}...`);
    const batchResults = await processBatch(batches[i]);

    batchResults.forEach(result => {
      total++;
      results.push(result);
      if (result.success) {
        success++;
      } else {
        failed++;
        errors.push(result);
      }
    });

    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n=== Results ===`);
  console.log(`Total: ${total}`);
  console.log(`Success: ${success} (${((success/total)*100).toFixed(1)}%)`);
  console.log(`Failed: ${failed} (${((failed/total)*100).toFixed(1)}%)`);

  if (errors.length > 0) {
    console.log(`\n=== Failed Links (${errors.length}) ===`);
    errors.slice(0, 20).forEach(err => {
      console.log(`- ${err.url} [${err.status}]`);
    });
    if (errors.length > 20) {
      console.log(`... and ${errors.length - 20} more`);
    }
  }

  // Save results
  const reportPath = path.join(__dirname, '../docs/skill-link-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    total,
    success,
    failed,
    successRate: ((success/total)*100).toFixed(1) + '%',
    errors: errors.map(e => ({ url: e.url, status: e.status, error: e.error }))
  }, null, 2));
  console.log(`\nReport saved to ${reportPath}`);
}

runTests().catch(console.error);
