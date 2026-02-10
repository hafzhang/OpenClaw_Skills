#!/usr/bin/env node

/**
 * Quick test script for quality check
 * Tests with just 5 repositories to verify functionality
 */

const fs = require('fs');
const path = require('path');

// Import the main module and override for testing
const https = require('https');

const TEST_REPOS = [
  'https://github.com/pmndrs/zustand',
  'https://github.com/vuejs/core',
  'https://github.com/nuxt/nuxt',
  'https://github.com/facebook/react',
  'https://github.com/vercel/next.js'
];

const GITHUB_API_BASE = 'https://api.github.com/repos';

function fetchRepoData(owner, repo) {
  return new Promise((resolve, reject) => {
    const url = `${GITHUB_API_BASE}/${owner}/${repo}`;

    https.get(url, {
      headers: {
        'User-Agent': 'OpenClaw-Hub-Quality-Check-Test',
        'Accept': 'application/vnd.github.v3+json'
      }
    }, (res) => {
      let data = '';

      res.on('data', chunk => { data += chunk; });

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

function parseGitHubUrl(url) {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (match) {
    return { owner: match[1], repo: match[2].replace('.git', '') };
  }
  return null;
}

function isRecentlyUpdated(updatedAt) {
  const updateDate = new Date(updatedAt);
  const now = new Date();
  const monthsDiff = (now - updateDate) / (1000 * 60 * 60 * 24 * 30);
  return monthsDiff <= 6;
}

function assessQuality(repoData) {
  const reasons = [];
  let category = 'HIGH_QUALITY';

  if (repoData.archived) {
    category = 'EXCLUDE';
    reasons.push('Repository is archived');
    return { category, reasons };
  }

  if (repoData.size === 0) {
    category = 'EXCLUDE';
    reasons.push('Repository is empty');
    return { category, reasons };
  }

  if (repoData.stargazers_count < 50) {
    reasons.push(`Low star count (${repoData.stargazers_count})`);
  }

  if (!isRecentlyUpdated(repoData.updated_at)) {
    reasons.push(`Not recently updated (last: ${repoData.updated_at})`);
  }

  if (!repoData.has_readme && !repoData.description) {
    reasons.push('No README found');
  }

  if (reasons.length > 1) {
    category = 'LOW_QUALITY';
  } else if (reasons.length === 1) {
    category = 'MEDIUM_QUALITY';
  }

  return { category, reasons };
}

async function main() {
  console.log('🧪 Quality Check Test Script');
  console.log('Testing with', TEST_REPOS.length, 'repositories\n');

  const results = [];

  for (const url of TEST_REPOS) {
    const parsed = parseGitHubUrl(url);
    if (!parsed) continue;

    console.log(`📊 Testing ${parsed.owner}/${parsed.repo}...`);

    try {
      const repoData = await fetchRepoData(parsed.owner, parsed.repo);
      const { category, reasons } = assessQuality(repoData);

      results.push({
        url,
        repository: `${parsed.owner}/${parsed.repo}`,
        quality: category,
        reasons: reasons.length > 0 ? reasons : undefined,
        metadata: {
          stars: repoData.stargazers_count,
          updatedAt: repoData.updated_at,
          archived: repoData.archived,
          size: repoData.size,
          hasReadme: repoData.has_readme,
          description: repoData.description
        }
      });

      console.log(`   ✅ ${category}${reasons.length > 0 ? ' - ' + reasons.join(', ') : ''}\n`);
    } catch (error) {
      results.push({
        url,
        error: error.message,
        quality: 'EXCLUDE',
        reasons: [error.message]
      });
      console.log(`   ❌ Error: ${error.message}\n`);
    }

    // Small delay to be nice to GitHub
    await new Promise(r => setTimeout(r, 1000));
  }

  // Save test results
  const outputPath = path.join(__dirname, '../reports/phase6-quality-check-test.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    metadata: {
      title: 'Phase 6 Quality Check - Test Run',
      generatedAt: new Date().toISOString(),
      totalRepositories: results.length
    },
    results
  }, null, 2));

  console.log('✅ Test complete!');
  console.log(`📄 Results saved to: ${outputPath}`);
  console.log('\nSummary:');
  console.log('  High Quality:', results.filter(r => r.quality === 'HIGH_QUALITY').length);
  console.log('  Medium Quality:', results.filter(r => r.quality === 'MEDIUM_QUALITY').length);
  console.log('  Low Quality:', results.filter(r => r.quality === 'LOW_QUALITY').length);
  console.log('  Excluded:', results.filter(r => r.quality === 'EXCLUDE').length);
}

main().catch(console.error);
