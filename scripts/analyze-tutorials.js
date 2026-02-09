const fs = require('fs');
const path = require('path');

const tutorialsPath = path.join(__dirname, '../src/data/tutorials.json');
const tutorials = JSON.parse(fs.readFileSync(tutorialsPath, 'utf8'));

// Check tutorials 101-150
const newTutorials = tutorials.filter(t => {
  const id = parseInt(t.id.replace('tutorial-', ''));
  return id >= 101 && id <= 150;
});

console.log('=== Tutorials 101-150 Content Analysis ===\n');

const issues = [];

newTutorials.forEach(t => {
  const wordCount = t.content.length;
  const codeBlocks = (t.content.match(/```/g) || []).length / 2;
  const hasRelatedSkills = t.relatedSkills && t.relatedSkills.length > 0;
  const difficulty = t.difficulty;

  // Check for minimum requirements
  const minWords = difficulty === 'beginner' ? 2000 : (difficulty === 'intermediate' ? 2500 : 3000);
  const minCodeBlocks = difficulty === 'beginner' ? 5 : (difficulty === 'intermediate' ? 6 : 8);

  const tutorialIssues = [];

  if (wordCount < minWords) {
    tutorialIssues.push(`Content too short: ${wordCount} chars (min: ${minWords})`);
  }

  if (codeBlocks < minCodeBlocks) {
    tutorialIssues.push(`Too few code blocks: ${codeBlocks} (min: ${minCodeBlocks})`);
  }

  if (!hasRelatedSkills) {
    tutorialIssues.push('Missing relatedSkills');
  }

  console.log(`${t.id}: ${t.title}`);
  console.log(`  Content length: ${wordCount} chars`);
  console.log(`  Code blocks: ${codeBlocks}`);
  console.log(`  Related skills: ${t.relatedSkills ? t.relatedSkills.length : 0}`);

  if (tutorialIssues.length > 0) {
    console.log(`  ISSUES: ${tutorialIssues.join(', ')}`);
    issues.push({ id: t.id, title: t.title, issues: tutorialIssues });
  }
  console.log('');
});

console.log('\n=== Summary ===');
console.log(`Total new tutorials: ${newTutorials.length}`);
console.log(`Tutorials with issues: ${issues.length}`);

if (issues.length > 0) {
  console.log('\n=== Issues Detail ===');
  issues.forEach(i => {
    console.log(`${i.id}: ${i.issues.join(', ')}`);
  });
}
