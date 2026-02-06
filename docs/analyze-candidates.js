const fs = require('fs');

const existing = JSON.parse(fs.readFileSync('src/data/skills.json', 'utf8'));
const candidates = JSON.parse(fs.readFileSync('docs/skill-candidates-phase3-100.json', 'utf8'));

// Check for duplicates
const existingNames = new Set(existing.map(s => s.name.toLowerCase()));
const candidatesWithDuplicates = candidates.filter(c => existingNames.has(c.name.toLowerCase()));

console.log('=== DUPLICATE CHECK ===');
if (candidatesWithDuplicates.length > 0) {
  console.log('Found duplicates:');
  candidatesWithDuplicates.forEach(c => console.log('  - ' + c.name));
  process.exit(1);
} else {
  console.log('No duplicates found!');
  console.log('Total existing skills:', existing.length);
  console.log('Total candidate skills:', candidates.length);
}

// Category distribution
console.log('\n=== CATEGORY DISTRIBUTION ===');
const categoryCounts = {};
candidates.forEach(c => {
  categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
});

Object.entries(categoryCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([cat, count]) => {
    const percentage = ((count / candidates.length) * 100).toFixed(1);
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

// Sample skills by category
console.log('\n=== SAMPLE SKILLS BY CATEGORY ===');
Object.entries(categoryCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([cat, count]) => {
    const skills = candidates.filter(c => c.category === cat).slice(0, 5);
    console.log(`\n${cat} (${count} total):`);
    skills.forEach(s => {
      console.log(`  - ${s.name}: ${s.description}`);
    });
  });

// Accessibility notes
console.log('\n=== ACCESSIBILITY NOTES ===');
const githubUrls = candidates.map(c => c.source);
console.log(`Total GitHub URLs: ${githubUrls.length}`);
console.log('Note: All candidates reference GitHub repositories');
console.log('Recommendation: Verify HTTP 200 accessibility before adding to skills.json');
