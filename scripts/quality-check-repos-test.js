#!/usr/bin/env node

/**
 * Quick test version of quality check - processes only first 10 repositories
 * Run this to verify the script works before running the full version
 */

const fs = require('fs');
const path = require('path');

// Override the config for testing
const originalScript = fs.readFileSync(path.join(__dirname, 'quality-check-repos.js'), 'utf8');

// Limit to first 10 repos for testing
const testScript = originalScript
  .replace(
    'return Array.from(repos.values());',
    'const all = Array.from(repos.values());\n  console.log(`\\n🧪 TEST MODE: Limiting to 10 repositories (was ${all.length})`);\n  return all.slice(0, 10);'
  )
  .replace(
    'const CONFIG = {',
    'const CONFIG = { IS_TEST_MODE: true,'
  )
  .replace(
    'RATE_LIMIT: {',
    'RATE_LIMIT: { requestsPerHour: 1000, requestsPerMinute: 60, // Relaxed limits for testing'
  )
  .replace(
    '  // Minimum delay between requests (6 seconds = 10 per minute)',
    '  // Minimum delay between requests (2 seconds for testing)'
  )
  .replace(
    'if (timeSinceLastRequest < 6000)',
    'if (timeSinceLastRequest < 2000)'
  )
  .replace(
    'await new Promise(resolve => setTimeout(resolve, 6000 - timeSinceLastRequest));',
    'await new Promise(resolve => setTimeout(resolve, 2000 - timeSinceLastRequest));'
  );

// Create test directory and write the test script
const testDir = path.join(__dirname, '../reports');
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
}

eval(testScript);
