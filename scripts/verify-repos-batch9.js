// Verify GitHub repositories for Phase 6 Batch 9 (Note-taking and Knowledge Management tools)
// Run with: node scripts/verify-repos-batch9.js

const https = require('https');

const repos = [
  // Notion Ecosystem (8)
  'notion-enhancer/notion-enhancer',
  'dragonwool/notion-puppy',
  'notionhq/notion-sdk-js',
  'notionhq-client/notion-sdk-py',
  'tem-py/notion2md',
  'notion-backup/notion-backup',
  'notion-exporter/notion-exporter',
  'notionhq/notion-api-example',
  // Obsidian Ecosystem (12)
  'obsidianmd/obsidian-releases',
  'obsidianmd/obsidian-sample-plugin',
  'mgmeyers/obsidian-kanban',
  'obsidian-tasks-group/obsidian-tasks',
  'blacksmithgu/obsidian-dataview',
  'obsidian-calendar/obsidian-calendar-plugin',
  'tnichols217/obsidian-advanced-tables',
  'mProjectsCode/obsidian-zotero',
  'vslinko/obsidian-outliner',
  'jameschao/obsidian-mindmap',
  'zram-pathshala/obsidian-excalidraw-plugin',
  'artisticat1/obsidian-latex-suite',
  // Logseq Ecosystem (6)
  'logseq/logseq',
  'logseq/logseq-plugin-samples',
  'logseq/logseq-graph-analysis',
  'sballin/logseq-zotero',
  'sawhney17/logseq-upload-plugin',
  'pengx17/logsql',
  // Joplin Ecosystem (6)
  'laurent22/joplin',
  'laurent22/joplin-android',
  'laurent22/joplin-ios',
  'laurent22/joplin-plugins',
  'calebj0rg/joplin-link-notes',
  'richard-fine/joplin-export',
  // Trilium Notes Ecosystem (5)
  'zadam/trilium-notes',
  'zadam/trilium-scripts',
  'Nartrove/trilium-yt-export',
  'trilium-sync/trilium-sync',
  'trilium-search/trilium-search',
  // Foam Ecosystem (4)
  'foamhq/foam',
  'foamhq/foam-template',
  'foamhq/foam-vscode',
  'foam-graph/foam-graph',
  // TiddlyWiki Ecosystem (5)
  'Jermolene/TiddlyWiki5',
  'fphony/tiddlywiki-got5',
  'tiddly-gittly/TiddlyWiki-Plugins',
  'tiddlywiki/tiddlyweb',
  'tiddlywiki/tiddlydesktop',
  // Other Note-taking Tools (4)
  'AppFlowy-IO/AppFlowy',
  'toeverything/affine',
  'siyuan-note/siyuan',
  'pbek/QOwnNotes'
];

function checkRepo(repo, timeout = 5000) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve({ repo, status: 'TIMEOUT' });
    }, timeout);

    const options = {
      hostname: 'github.com',
      port: 443,
      path: `/${repo}`,
      method: 'HEAD',
      headers: {
        'User-Agent': 'Node.js Repo Checker'
      }
    };

    const req = https.request(options, (res) => {
      clearTimeout(timer);
      resolve({ repo, status: res.statusCode, location: res.headers.location });
    });

    req.on('error', (err) => {
      clearTimeout(timer);
      resolve({ repo, status: 'ERROR', error: err.message });
    });

    req.end();
  });
}

async function checkAllRepos() {
  console.log('Verifying Phase 6 Batch 9 repositories...\n');

  const results = [];
  for (const repo of repos) {
    const result = await checkRepo(repo);
    results.push(result);
    console.log(`${result.status}\t${result.repo}`);
  }

  // Summary
  const success = results.filter(r => r.status === 200).length;
  const notFound = results.filter(r => r.status === 404).length;
  const timeout = results.filter(r => r.status === 'TIMEOUT').length;
  const redirect = results.filter(r => r.status === 301 || r.status === 302).length;
  const error = results.filter(r => r.status === 'ERROR').length;

  console.log('\n=== Summary ===');
  console.log(`Total: ${results.length}`);
  console.log(`HTTP 200 (Success): ${success} (${(success/results.length*100).toFixed(1)}%)`);
  console.log(`HTTP 301/302 (Redirect): ${redirect} (${(redirect/results.length*100).toFixed(1)}%)`);
  console.log(`HTTP 404 (Not Found): ${notFound} (${(notFound/results.length*100).toFixed(1)}%)`);
  console.log(`TIMEOUT: ${timeout} (${(timeout/results.length*100).toFixed(1)}%)`);
  console.log(`ERROR: ${error} (${(error/results.length*100).toFixed(1)}%)`);

  // Save detailed report
  const fs = require('fs');
  const report = {
    batch: 'Phase 6 Batch 9',
    category: 'Productivity - Note-taking and Knowledge Management',
    timestamp: new Date().toISOString(),
    summary: { total: results.length, success, notFound, timeout, redirect, error },
    results: results.map(r => ({
      repo: r.repo,
      status: r.status,
      location: r.location,
      error: r.error
    }))
  };

  fs.writeFileSync('reports/batch9-repos-verification.json', JSON.stringify(report, null, 2));
  console.log('\nDetailed report saved to reports/batch9-repos-verification.json');
}

checkAllRepos().catch(console.error);
