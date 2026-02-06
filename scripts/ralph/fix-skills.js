const fs = require('fs');
const skills = JSON.parse(fs.readFileSync('src/data/skills.json', 'utf8'));

// Find skills with undefined relatedSkills
const problematic = skills.filter(s => !s.relatedSkills || !Array.isArray(s.relatedSkills));
console.log('Skills with undefined relatedSkills:', problematic.length);

if (problematic.length > 0) {
  console.log('Problematic skills:');
  problematic.forEach(s => console.log('-', s.id, s.name || s.slug));
}

// Fix them
skills.forEach(s => {
  if (!s.relatedSkills || !Array.isArray(s.relatedSkills)) {
    s.relatedSkills = [];
  }
});

// Save back
fs.writeFileSync('src/data/skills.json', JSON.stringify(skills, null, 2), 'utf8');
console.log('Fixed skills.json');
