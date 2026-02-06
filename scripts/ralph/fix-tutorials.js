const fs = require('fs');
const tutorials = JSON.parse(fs.readFileSync('src/data/tutorials.json', 'utf8'));

// Find tutorials with undefined relatedSkills
const problematic = tutorials.filter(t => !t.relatedSkills || !Array.isArray(t.relatedSkills));
console.log('Tutorials with undefined relatedSkills:', problematic.length);

if (problematic.length > 0) {
  console.log('Problematic tutorials:');
  problematic.forEach(t => console.log('-', t.id, t.title));
}

// Fix them
tutorials.forEach(t => {
  if (!t.relatedSkills || !Array.isArray(t.relatedSkills)) {
    t.relatedSkills = [];
  }
});

// Save back
fs.writeFileSync('src/data/tutorials.json', JSON.stringify(tutorials, null, 2), 'utf8');
console.log('Fixed tutorials.json');
