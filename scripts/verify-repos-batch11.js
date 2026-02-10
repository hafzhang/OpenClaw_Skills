/**
 * Verify GitHub repositories for Phase 6 Batch 11 - Productivity Tools
 * File Search, Text Processing, Directory Navigation, System Monitor, Network Tools, Dev Tools
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Repositories to verify - 50 productivity tools
const repos = [
  // File Search Tools (10)
  'https://github.com/junegunn/fzf',
  'https://github.com/sharkdp/fd',
  'https://github.com/BurntSushi/ripgrep',
  'https://github.com/ggreer/the_silver_searcher',
  'https://github.com/peco/peco',
  'https://github.com/lotabout/skim',
  'https://github.com/moncho/dry',
  'https://github.com/jarun/nnn',
  'https://github.com/ranger/ranger',
  'https://github.com/dylanaraps/fff',

  // Text Viewing and Processing (10)
  'https://github.com/sharkdp/bat',
  'https://github.com/sharkdp/hexyl',
  'https://github.com/sharkdp/pastel',
  'https://github.com/sharkdp/hyperfine',
  'https://github.com/chmln/sd',
  'https://github.com/BurntSushi/xsv',
  'https://github.com/jqnatividad/qsv',
  'https://github.com/wader/fq',
  'https://github.com/itchyny/mmv',
  'https://github.com/dandavison/delta',

  // Directory Navigation and Listing (8)
  'https://github.com/eza-community/eza',
  'https://github.com/ogham/exa',
  'https://github.com/lsd-rs/lsd',
  'https://github.com/clvv/fasd',
  'https://github.com/wting/autojump',
  'https://github.com/rupa/z',
  'https://github.com/skywind3000/z.lua',
  'https://github.com/ajeetdsouza/zoxide',

  // System Monitor and Process Management (8)
  'https://github.com/aristocratos/btop',
  'https://github.com/aristocratos/bashtop',
  'https://github.com/ClementTsang/bottom',
  'https://github.com/dalance/procs',
  'https://github.com/Xfennec/progress',
  'https://github.com/imsnif/bandwhich',
  'https://github.com/timgrossmann/InstaPy',
  'https://github.com/s0md3v/roop',

  // Network Tools (7)
  'https://github.com/httpie/httpie',
  'https://github.com/curl/curl',
  'https://github.com/rs/curlie',
  'https://github.com/httpie/desktop',
  'https://github.com/taviso/ctftool',
  'https://github.com/projectdiscovery/httpx',
  'https://github.com/projectdiscovery/subfinder',

  // Development Assistant Tools (7)
  'https://github.com/jesseduffield/lazygit',
  'https://github.com/jesseduffield/lazydocker',
  'https://github.com/charmbracelet/mods',
  'https://github.com/charmbracelet/soft-serve',
  'https://github.com/charmbracelet/vhs',
  'https://github.com/charmbracelet/wish',
  'https://github.com/charmbracelet/skate'
];

function checkRepo(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const options = {
      method: 'HEAD',
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      timeout: 15000,
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

    await new Promise(r => setTimeout(r, 100));
  }

  console.log('\n=== Verification Report ===');
  console.log(`Total: ${repos.length}`);
  console.log(`✓ Success (200): ${successCount} (${(successCount/repos.length*100).toFixed(1)}%)`);
  console.log(`✗ Failed (404/other): ${failCount} (${(failCount/repos.length*100).toFixed(1)}%)`);
  console.log(`⏱ Timeout: ${timeoutCount} (${(timeoutCount/repos.length*100).toFixed(1)}%)`);
  console.log(`✗ Error: ${errorCount} (${(errorCount/repos.length*100).toFixed(1)}%)`);

  const reportPath = './reports/batch11-repos-verification.json';
  const fs = require('fs');
  const report = {
    timestamp: new Date().toISOString(),
    batch: 'Phase 6 - Batch 11 (Productivity Tools)',
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

  console.log('\n=== Successful Repositories (HTTP 200) ===');
  results
    .filter(r => r.success)
    .forEach(r => console.log(`  ✓ ${r.url}`));

  console.log('\n=== Failed/Timeout Repositories ===');
  results
    .filter(r => !r.success)
    .forEach(r => console.log(`  ✗ ${r.url} - ${r.status}${r.error ? ` (${r.error})` : ''}`));
}

verifyAllRepos().catch(console.error);
