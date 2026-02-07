const fs = require('fs');
const s = JSON.parse(fs.readFileSync('./src/data/skills.json', 'utf8'));

const dupes = {};
s.forEach((sk, idx) => {
  if (dupes[sk.id] !== undefined) {
    console.log('Duplicate:', sk.id, 'at index', dupes[sk.id], 'and', idx);
  }
  dupes[sk.id] = idx;
});
