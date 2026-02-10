/**
 * Verify GitHub repositories for Phase 6 Batch 8 - Editors & IDEs (Productivity)
 * VS Code, Vim/Neovim, Emacs, IntelliJ, Sublime, Others
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Repositories to verify - 50 editor and IDE repositories
const repos = [
  // VS Code Ecosystem (12)
  'https://github.com/microsoft/vscode',
  'https://github.com/VSCodium/vscodium',
  'https://github.com/open-vsx/publish-extensions',
  'https://github.com/code-server/code-server',
  'https://github.com/coder/coder',
  'https://github.com/github/copilot-vscode',
  'https://github.com/Continue/continue',
  'https://github.com/eclipse-theia/theia',
  'https://github.com/microsoft/vscode-jupyter',
  'https://github.com/microsoft/vscode-live-server',
  'https://github.com/formulahendry/auto-rename-tag',
  'https://github.com/usernamehw/vscode-error-lens',

  // Vim/Neovim (10)
  'https://github.com/neovim/neovim',
  'https://github.com/vim/vim',
  'https://github.com/SpaceVim/SpaceVim',
  'https://github.com/nvim-lualine/lualine.nvim',
  'https://github.com/nvim-tree/nvim-tree.lua',
  'https://github.com/nvim-telescope/telescope.nvim',
  'https://github.com/nvim-treesitter/nvim-treesitter',
  'https://github.com/folke/lazy.nvim',
  'https://github.com/wbthomason/packer.nvim',
  'https://github.com/folke/trouble.nvim',

  // Emacs (8)
  'https://github.com/emacs-mirror/emacs',
  'https://github.com/doomemacs/doomemacs',
  'https://github.com/syl20bnr/spacemacs',
  'https://github.com/hlissner/doom-emacs',
  'https://github.com/magit/magit',
  'https://github.com/emacs-evil/evil',
  'https://github.com/company-mode/company',
  'https://github.com/emacs-vscode/module',

  // IntelliJ IDEA (7)
  'https://github.com/JetBrains/intellij-community',
  'https://github.com/JetBrains/ideavim',
  'https://github.com/intellij-rust/intellij-rust',
  'https://github.com/JetBrains/kotlin',
  'https://github.com/smalltech/jetbrains-project-zoom',
  'https://github.com/cmf/idea-gitignore',
  'https://github.com/jjs-aged/filename-search-idea',

  // Sublime Text (5)
  'https://github.com/SublimeText/Packages',
  'https://github.com/SublimeText/UnitTesting',
  'https://github.com/SublimeText/LSP',
  'https://github.com/SublimeText/Origami',
  'https://github.com/alepez/guinetwork',

  // Other Editors (8)
  'https://github.com/atom/atom',
  'https://github.com/microsoft/monaco-editor',
  'https://github.com/facebook/nuclide',
  'https://github.com/textareainput/focus',
  'https://github.com/occlum/occlum',
  'https://github.com/zyedidia/micro',
  'https://github.com/josephschmitt/Clown',
  'https://github.com/ryanoasis/nerd-fonts'
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

  const reportPath = './reports/batch8-repos-verification.json';
  const fs = require('fs');
  const report = {
    timestamp: new Date().toISOString(),
    batch: 'Phase 6 - Batch 8 (Editors & IDEs - Productivity)',
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
