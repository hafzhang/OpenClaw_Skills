/**
 * Repository Verification Script for Phase 6 Batch 13
 * Collaboration and Communication Tools (40 repositories)
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Repositories to verify
const repos = [
  // Team Chat and Instant Messaging (10)
  'https://github.com/slackapi/python-slack-sdk',
  'https://github.com/mattermost/mattermost',
  'https://github.com/RocketChat/Rocket.Chat',
  'https://github.com/zulip/zulip',
  'https://github.com/discordpy/discord.py',
  'https://github.com/DV8FromTheWorld/JDA',
  'https://github.com/revoltchat/self-hosted',
  'https://github.com/matrix-org/synapse',
  'https://github.com/vector-im/element-web',
  'https://github.com/gotify/server',

  // Video Conferencing and Screen Sharing (8)
  'https://github.com/jitsi/jitsi-meet',
  'https://github.com/bigbluebutton/bigbluebutton',
  'https://github.com/OpenVidu/openvidu',
  'https://github.com/livekit/livekit',
  'https://github.com/daily-co/daily-js',
  'https://github.com/versatica/mediasoup',
  'https://github.com/ossrs/srs',
  'https://github.com/coturn/coturn',

  // Project Management and Collaboration (8)
  'https://github.com/taigaio/taiga-back',
  'https://github.com/opf/openproject',
  'https://github.com/redmine/redmine',
  'https://github.com/vikunja/vikunja',
  'https://github.com/makeplane/plane',
  'https://github.com/AppFlowy-IO/AppFlowy',
  'https://github.com/toeverything/AFFiNE',
  'https://github.com/triagetriage/triage',

  // Documentation Collaboration and Wiki (6)
  'https://github.com/outline/outline',
  'https://github.com/requarks/wiki',
  'https://github.com/BookStackApp/BookStack',
  'https://github.com/docsifyjs/docsify',
  'https://github.com/squidfunk/mkdocs-material',
  'https://github.com/facebook/docusaurus',

  // Notifications and Message Pushing (3 - Gotify already counted)
  'https://github.com/binwiederhier/ntfy',
  'https://github.com/containrrr/shoutrrr',
  'https://github.com/caronc/apprise',

  // Forms and Feedback Collection (4)
  'https://github.com/Typeform/embed',
  'https://github.com/formkit/formkit',
  'https://github.com/formspree/formspree',
  'https://github.com/tallyhq/tally'
];

// Results storage
const results = [];
let successCount = 0;
let failCount = 0;
let timeoutCount = 0;
let errorCount = 0;

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
  console.log('Phase 6 Batch 13 - Repository Verification');
  console.log('Collaboration and Communication Tools');
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
  const reportPath = path.join(__dirname, '..', 'reports', 'batch13-repos-verification.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    batch: 13,
    category: 'Collaboration and Communication Tools',
    total: total,
    summary: {
      success: successCount,
      timeout: timeoutCount,
      error: errorCount,
      fail: failCount
    },
    results: results
  }, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log(`Report saved to: ${reportPath}`);
  console.log('='.repeat(60));
}

// Run verification
verifyRepos().catch(console.error);
