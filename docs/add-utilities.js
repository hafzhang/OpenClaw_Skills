const fs = require('fs');

const candidates = JSON.parse(fs.readFileSync('docs/skill-candidates-phase3-extended.json', 'utf8'));

// Additional utilities
const additionalUtilities = [
  { id: 'skill-361', name: 'ripgrep-all', slug: 'ripgrep-all', description: 'Search tool for searching in PDFs, E-Books, Office documents', category: 'utilities', tags: ['Search', 'Ripgrep', 'Documents', 'CLI'], author: 'phiresky', source: 'https://github.com/phiresky/ripgrep-all', url: 'https://github.com/phiresky/ripgrep-all', verified: true, createdAt: '2026-02-06T00:00:00Z' },
  { id: 'skill-362', name: 'fd', slug: 'fd-find', description: 'Fast, user-friendly alternative to find command', category: 'utilities', tags: ['Find', 'Search', 'Rust', 'CLI'], author: 'sharkdp', source: 'https://github.com/sharkdp/fd', url: 'https://github.com/sharkdp/fd', verified: true, createdAt: '2026-02-06T00:00:00Z' },
  { id: 'skill-363', name: 'sd', slug: 'sd', description: 'Intuitive find and replace CLI', category: 'utilities', tags: ['Find', 'Replace', 'Sed', 'Rust'], author: 'chmln', source: 'https://github.com/chmln/sd', url: 'https://github.com/chmln/sd', verified: true, createdAt: '2026-02-06T00:00:00Z' },
  { id: 'skill-364', name: 'choose', slug: 'choose', description: 'Fuzzy matcher for human-friendly selections', category: 'utilities', tags: ['Fuzzy', 'Selection', 'Rust', 'CLI'], author: 'theryangeary', source: 'https://github.com/theryangeary/choose', url: 'https://github.com/theryangeary/choose', verified: true, createdAt: '2026-02-06T00:00:00Z' },
  { id: 'skill-365', name: 'gping', slug: 'gping', description: 'Ping, but with a graph', category: 'utilities', tags: ['Ping', 'Network', 'Graph', 'Rust'], author: 'orf', source: 'https://github.com/orf/gping', url: 'https://github.com/orf/gping', verified: true, createdAt: '2026-02-06T00:00:00Z' },
  { id: 'skill-366', name: 'procs', slug: 'procs', description: 'Modern replacement for ps command', category: 'utilities', tags: ['Process', 'System', 'CLI', 'Rust'], author: 'dalance', source: 'https://github.com/dalance/procs', url: 'https://github.com/dalance/procs', verified: true, createdAt: '2026-02-06T00:00:00Z' },
  { id: 'skill-367', name: 'bandwhich', slug: 'bandwhich', description: 'CLI utility for tracking current bandwidth utilization', category: 'utilities', tags: ['Network', 'Bandwidth', 'Monitor', 'Rust'], author: 'imsnif', source: 'https://github.com/imsnif/bandwhich', url: 'https://github.com/imsnif/bandwhich', verified: true, createdAt: '2026-02-06T00:00:00Z' },
  { id: 'skill-368', name: 'xh', slug: 'xh', description: 'Friendly and fast tool for sending HTTP requests', category: 'utilities', tags: ['HTTP', 'CLI', 'Curl', 'Rust'], author: 'ducaale', source: 'https://github.com/ducaale/xh', url: 'https://github.com/ducaale/xh', verified: true, createdAt: '2026-02-06T00:00:00Z' }
];

const result = [...candidates, ...additionalUtilities].sort((a, b) => a.id.localeCompare(b.id));

fs.writeFileSync('docs/skill-candidates-phase3-final.json', JSON.stringify(result, null, 2));
console.log('Total candidates:', result.length);

// Category distribution
const categoryCounts = {};
result.forEach(c => {
  categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
});

console.log('\nCategory distribution:');
Object.entries(categoryCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([cat, count]) => {
    const percentage = ((count / result.length) * 100).toFixed(1);
    console.log(`${cat}: ${count} (${percentage}%)`);
  });

// Target comparison
console.log('\n=== TARGET VS ACTUAL ===');
const targets = {
  development: 25,
  productivity: 25,
  devops: 20,
  'ai-llms': 15,
  utilities: 15
};

Object.entries(targets).forEach(([cat, target]) => {
  const actual = categoryCounts[cat] || 0;
  const diff = actual - target;
  const status = diff >= 0 ? '✓' : '✗';
  console.log(`${status} ${cat}: ${actual}/${target} (${diff >= 0 ? '+' : ''}${diff})`);
});
