/**
 * Verify GitHub repositories for Phase 6 Batch 10 - Terminal & Shell (Productivity)
 * Zsh, Fish Shell, Prompts, History, Terminal Multiplexers, TUI Tools
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Repositories to verify - 50 terminal and shell repositories
const repos = [
  // Zsh Ecosystem (12)
  'https://github.com/ohmyzsh/ohmyzsh',
  'https://github.com/zsh-users/zsh-autosuggestions',
  'https://github.com/zsh-users/zsh-syntax-highlighting',
  'https://github.com/romkatv/powerlevel10k',
  'https://github.com/getantibody/antibody',
  'https://github.com/zsh-users/zsh-completions',
  'https://github.com/zdharma-continuum/fast-syntax-highlighting',
  'https://github.com/unixorn/git-extra-commands',
  'https://github.com/djui/alias-tips',
  'https://github.com/zshzoo/mzo',
  'https://github.com/junegunn/fzf',
  'https://github.com/agkozak/zsh-z',

  // Fish Shell (10)
  'https://github.com/fish-shell/fish-shell',
  'https://github.com/jorgebucaran/fisher',
  'https://github.com/oh-my-fish/oh-my-fish',
  'https://github.com/franciscolourenco/done',
  'https://github.com/jethrokuan/z',
  'https://github.com/PatrickF1/fzf.fish',
  'https://github.com/IlanCosman/tide',
  'https://github.com/catppuccin/fish',
  'https://github.com/gazorby/fish-abbreviation-tips',
  'https://github.com/jorgebucaran/aw.fish',

  // Prompts and Status Bars (8)
  'https://github.com/starship/starship',
  'https://github.com/denysdovhan/spaceship-prompt',
  'https://github.com/sindresorhus/pure',
  'https://github.com/janriemer/spaceship',
  'https://github.com/romkatv/gitstatus',
  'https://github.com/oredwarf/nish',
  'https://github.com/raylee/tide',
  'https://github.com/distanta/pure',

  // Shell History and Enhancements (7)
  'https://github.com/ellie/atuin',
  'https://github.com/di_an/dfw',
  'https://github.com/wugong/ash',
  'https://github.com/revision-co/revsh',
  'https://github.com/nix-community/nix-your-shell',
  'https://github.com/rsteube/carapace',
  'https://github.com/raine/shellquote',

  // Terminal Multiplexers (6)
  'https://github.com/tmux/tmux',
  'https://github.com/tmux-plugins/tpm',
  'https://github.com/tmux-plugins/tmux-resurrect',
  'https://github.com/tmux-plugins/tmux-continuum',
  'https://github.com/tmux-plugins/tmux-sensible',
  'https://github.com/tmux-plugins/tmux-copycat',

  // Terminal UI and Tools (7)
  'https://github.com/charmbracelet/gum',
  'https://github.com/charmbracelet/glow',
  'https://github.com/charmbracelet/bubbletea',
  'https://github.com/charmbracelet/lipgloss',
  'https://github.com/daskol/nodes',
  'https://github.com/kognise/charm.sh',
  'https://github.com/aptos-dev/awesome-terminal-apps'
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

  const reportPath = './reports/batch10-repos-verification.json';
  const fs = require('fs');
  const report = {
    timestamp: new Date().toISOString(),
    batch: 'Phase 6 - Batch 10 (Terminal & Shell - Productivity)',
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
