const fs = require('fs');
const tutorials = JSON.parse(fs.readFileSync('src/data/tutorials.json', 'utf8'));

// Fix new tutorials with missing fields
const newTutorialIds = ['tutorial-053', 'tutorial-054', 'tutorial-055', 'tutorial-056'];

tutorials.forEach(t => {
  if (newTutorialIds.includes(t.id)) {
    // Ensure all required fields exist
    if (!t.tags || !Array.isArray(t.tags)) {
      t.tags = [];
    }
    if (!t.relatedSkills || !Array.isArray(t.relatedSkills)) {
      t.relatedSkills = [];
    }
    if (!t.stats) {
      t.stats = { viewCount: 0 };
    }
    if (!t.createdAt) {
      t.createdAt = '2026-02-06T00:00:00Z';
    }
    if (t.featured === undefined) {
      t.featured = false;
    }
  }
});

// Save back
fs.writeFileSync('src/data/tutorials.json', JSON.stringify(tutorials, null, 2), 'utf8');
console.log('Fixed tutorials - all required fields added');
