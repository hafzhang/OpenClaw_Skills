import skills from './src/data/skills.json' with { type: 'json' };

console.log('Total skills:', skills.length);
let badCmd = 0;
let slugMismatch = 0;

skills.forEach(s => {
  const expected = 'npx clawhub@latest install ' + s.slug;
  if (s.command !== expected) {
    badCmd++;
    console.log('Bad command:', s.id, s.slug);
    console.log('  Expected:', expected);
    console.log('  Got:', s.command);
  }
  
  if (!s.command.includes(s.slug)) {
    slugMismatch++;
  }
});

console.log('\nSummary:');
console.log('  Bad commands:', badCmd);
console.log('  Slug mismatches:', slugMismatch);
console.log('  All valid:', badCmd === 0);
