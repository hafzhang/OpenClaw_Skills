import tutorials from './src/data/tutorials.json' with { type: 'json' };
import skills from './src/data/skills.json' with { type: 'json' };

console.log('=== Phase 3 Acceptance Testing ===\n');

// Tutorial count
console.log('✓ Tutorials:', tutorials.length, '(target: 30)');
console.log('  ', tutorials.length >= 30 ? 'PASS ✓' : 'FAIL ✗');

// Skill count
console.log('\n✓ Skills:', skills.length, '(target: 200)');
console.log('  ', skills.length >= 200 ? 'PASS ✓' : 'FAIL ✗');

// Tutorial distribution
const tutorialCats = {};
tutorials.forEach(t => tutorialCats[t.difficulty] = (tutorialCats[t.difficulty] || 0) + 1);
console.log('\nTutorial by difficulty:', tutorialCats);

// Skill distribution
const skillCats = {};
skills.forEach(s => skillCats[s.category] = (skillCats[s.category] || 0) + 1);
console.log('\nSkills by category:', skillCats);

// Verified skills
const verifiedSkills = skills.filter(s => s.verified);
console.log('\n✓ Verified skills:', verifiedSkills.length, '/', skills.length);
console.log('  ', verifiedSkills.length === skills.length ? 'PASS ✓' : 'FAIL ✗');

// Installation commands
let badCmds = 0;
skills.forEach(s => {
  if (!s.command.includes('npx clawhub@latest install')) badCmds++;
});
console.log('\n✓ Installation commands valid:', skills.length - badCmds, '/', skills.length);
console.log('  ', badCmds === 0 ? 'PASS ✓' : 'FAIL ✗');

// Slugs unique
const slugs = new Set(skills.map(s => s.slug));
console.log('\n✓ Unique slugs:', slugs.size, '/', skills.length);
console.log('  ', slugs.size === skills.length ? 'PASS ✓' : 'FAIL ✗');

// Summary
console.log('\n=== Summary ===');
const allPass = tutorials.length >= 30 && skills.length >= 200 && verifiedSkills.length === skills.length && badCmds === 0 && slugs.size === skills.length;
console.log('All checks:', allPass ? 'PASS ✓' : 'FAIL ✗');
