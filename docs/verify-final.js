const fs = require('fs');
const candidates = JSON.parse(fs.readFileSync('docs/skill-candidates-phase3-100.json', 'utf8'));

console.log('=== FINAL VERIFICATION ===');
console.log('File: docs/skill-candidates-phase3-100.json');
console.log('Total candidates:', candidates.length);
console.log('ID range:', candidates[0].id, 'to', candidates[candidates.length-1].id);

// Category counts
const categoryCounts = {};
candidates.forEach(c => {
  categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
});

console.log('\nCategory distribution:');
Object.entries(categoryCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([cat, count]) => {
    const percentage = ((count / candidates.length) * 100).toFixed(1);
    console.log(`  ${cat}: ${count} (${percentage}%)`);
  });

// Sample first 5
console.log('\nFirst 5 candidates:');
candidates.slice(0, 5).forEach(c => {
  console.log(`  ${c.id}: ${c.name} - ${c.description}`);
});

// Sample last 5
console.log('\nLast 5 candidates:');
candidates.slice(-5).forEach(c => {
  console.log(`  ${c.id}: ${c.name} - ${c.description}`);
});
