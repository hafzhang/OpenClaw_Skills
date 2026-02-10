/**
 * Verify GitHub repositories for Phase 6 Batch 7 - IDE & Editor Plugins
 * VS Code, IntelliJ, Vim, Neovim, Emacs
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Repositories to verify - 40 IDE and editor repositories
const repos = [
  // VS Code Ecosystem (12)
  'https://github.com/microsoft/vscode',
  'https://github.com/microsoft/vscode-eslint',
  'https://github.com/dbaeumer/vscode-eslint',
  'https://github.com/esbenp/prettier-vscode',
  'https://github.com/microsoft/vscode-python',
  'https://github.com/microsoft/debugpy',
  'https://github.com/golang/go',
  'https://github.com/Dart-Code/flutter',
  'https://github.com/vue-language-server/volar',
  'https://github.com/astro-build/astro-vscode',
  'https://github.com/vscode-icons/vscode-icons',
  'https://github.com/PKief/material-icon-theme',

  // IntelliJ Platform Ecosystem (8)
  'https://github.com/JetBrains/intellij-community',
  'https://github.com/JetBrains/kotlin',
  'https://github.com/JetBrains/gradle-intellij-plugin',
  'https://github.com/ignatov/intellij-erlang',
  'https://github.com/MichaelGrigoryan95/intellij-plugins',
  'https://github.com/zskimmer/intellij-haskell',
  'https://github.com/rinrab/intellij-idea-community-fork',
  'https://github.com/intellij-rust/intellij-rust',

  // Vim Ecosystem (8)
  'https://github.com/vim/vim',
  'https://github.com/neovim/neovim',
  'https://github.com/preservim/nerdtree',
  'https://github.com/vim-airline/vim-airline',
  'https://github.com/ctrlpvim/ctrlp.vim',
  'https://github.com/junegunn/fzf',
  'https://github.com/junegunn/fzf.vim',
  'https://github.com/tpope/vim-sensible',

  // Neovim Ecosystem (8)
  'https://github.com/nvim-lualine/lualine.nvim',
  'https://github.com/nvim-tree/nvim-tree.lua',
  'https://github.com/nvim-telescope/telescope.nvim',
  'https://github.com/nvim-treesitter/nvim-treesitter',
  'https://github.com/folke/which-key.nvim',
  'https://github.com/folke/tokyonight.nvim',
  'https://github.com/akinsho/bufferline.nvim',
  'https://github.com/lewis6991/gitsigns.nvim',

  // Emacs Ecosystem (4)
  'https://github.com/emacs-mirror/emacs',
  'https://github.com/doomemacs/doomemacs',
  'https://github.com/hlissner/doom-emacs',
  'https://github.com/jimeh/git-gutter-fringe'
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

  const reportPath = './reports/batch7-repos-verification.json';
  const fs = require('fs');
  const report = {
    timestamp: new Date().toISOString(),
    batch: 'Phase 6 - Batch 7 (IDE & Editor Plugins)',
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
