import skills from './src/data/skills.json' with { type: 'json' };

const categories = {};
const allIds = new Set();

skills.forEach(s => {
  categories[s.category] = (categories[s.category] || 0) + 1;
  allIds.add(s.id);
});

console.log('Current skill count:', skills.length);
console.log('\nCurrent distribution:');
Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count}`);
});
console.log('\nSkill ID range:', [...allIds].sort()[0], 'to', [...allIds].sort().pop());
