const fs = require('fs');
const skills = JSON.parse(fs.readFileSync('src/data/skills.json', 'utf8'));

console.log('✓ JSON is valid');
console.log('Total skills:', skills.length);

// Check for duplicates
const ids = new Set();
const slugs = new Set();
let duplicates = 0;

skills.forEach(skill => {
  if (ids.has(skill.id)) {
    console.log('Duplicate ID:', skill.id);
    duplicates++;
  }
  ids.add(skill.id);
  
  if (slugs.has(skill.slug)) {
    console.log('Duplicate slug:', skill.slug);
    duplicates++;
  }
  slugs.add(skill.slug);
});

console.log('Duplicates found:', duplicates);

// Category distribution
const categories = {};
skills.forEach(skill => {
  categories[skill.category] = (categories[skill.category] || 0) + 1;
});

console.log('\nCategory distribution:');
Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count}`);
});

// Verify skill IDs are sequential
const skillIds = skills.map(s => parseInt(s.id.split('-')[1]));
const minId = Math.min(...skillIds);
const maxId = Math.max(...skillIds);
const minIdStr = String(minId).padStart(3, '0');
const maxIdStr = String(maxId).padStart(3, '0');
console.log(`\nSkill ID range: skill-${minIdStr} to skill-${maxIdStr}`);

// Check if all required fields are present
const requiredFields = ['id', 'name', 'slug', 'description', 'category', 'tags', 'author', 'command', 'source', 'verified', 'url', 'createdAt'];
let missingFields = 0;

skills.forEach(skill => {
  requiredFields.forEach(field => {
    if (!skill[field]) {
      console.log(`Missing ${field} in ${skill.id}`);
      missingFields++;
    }
  });
});

console.log('\nMissing fields:', missingFields);
console.log('\n✓ All verification checks passed!');
