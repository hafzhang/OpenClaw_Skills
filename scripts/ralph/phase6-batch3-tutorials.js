// Script to add 5 new Beginner tutorials for Phase 6 Sprint 9.3
const fs = require('fs');
const path = require('path');

const tutorialsDir = path.join(__dirname, '../../src/data');
const tutorialsFile = path.join(tutorialsDir, 'tutorials.json');

// Read existing tutorials
const tutorials = JSON.parse(fs.readFileSync(tutorialsFile, 'utf-8'));

// Find the max tutorial number
const maxNum = tutorials.map(t => parseInt(t.id.split('-')[1])).reduce((a, b) => Math.max(a, b), 0);

// Read tutorial content from separate JSON file
const tutorialsContent = JSON.parse(fs.readFileSync(path.join(__dirname, 'phase6-batch3-content.json'), 'utf-8'));

// Create new tutorials with IDs
const newTutorials = tutorialsContent.map((t, i) => ({
  ...t,
  id: `tutorial-${maxNum + 1 + i}`,
  createdAt: new Date().toISOString()
}));

// Add new tutorials to the array
tutorials.push(...newTutorials);

// Write back to file
fs.writeFileSync(tutorialsFile, JSON.stringify(tutorials, null, 2) + '\n', 'utf-8');

console.log(`Added ${newTutorials.length} new tutorials:`);
newTutorials.forEach(t => console.log(`- ${t.id}: ${t.title}`));
