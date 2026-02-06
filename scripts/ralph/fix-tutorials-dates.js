const fs = require('fs');
const tutorials = JSON.parse(fs.readFileSync('src/data/tutorials.json', 'utf8'));

// Fix new tutorials with missing createdAt
const newTutorialIds = ['tutorial-053', 'tutorial-054', 'tutorial-055', 'tutorial-056'];

tutorials.forEach(t => {
  if (newTutorialIds.includes(t.id)) {
    if (!t.createdAt) {
      t.createdAt = '2026-02-06T00:00:00Z';
    }
    if (!t.stats) {
      t.stats = { viewCount: 0 };
    }
    if (t.featured === undefined) {
      t.featured = false;
    }
  }
});

// Save back
fs.writeFileSync('src/data/tutorials.json', JSON.stringify(tutorials, null, 2), 'utf8');
console.log('Fixed tutorials dates and stats');
