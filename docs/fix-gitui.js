const fs = require('fs');

const candidates = JSON.parse(fs.readFileSync('docs/skill-candidates-phase3-100.json', 'utf8'));

// Remove gitui and add replacement
const filtered = candidates.filter(c => c.name !== 'gitui');

const replacement = {
  id: 'skill-220',
  name: 'tig',
  slug: 'tig',
  description: 'Text-mode interface for Git',
  category: 'development',
  tags: ['Git', 'TUI', 'Terminal', 'NCurses'],
  author: 'jonas',
  source: 'https://github.com/jonas/tig',
  url: 'https://github.com/jonas/tig',
  verified: true,
  createdAt: '2026-02-06T00:00:00Z'
};

const result = [...filtered, replacement].sort((a, b) => a.id.localeCompare(b.id));

fs.writeFileSync('docs/skill-candidates-phase3-100.json', JSON.stringify(result, null, 2));
console.log('Replaced gitui with tig');
console.log('Total candidates:', result.length);
