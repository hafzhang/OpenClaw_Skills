#!/usr/bin/env node

/**
 * Fix duplicate skill IDs in skills.json
 * Keeps the first occurrence of each skill ID and removes subsequent duplicates
 */

const fs = require('fs');
const path = require('path');

// Read current skills
const skillsPath = path.join(__dirname, '../src/data/skills.json');
const skills = JSON.parse(fs.readFileSync(skillsPath, 'utf8'));

console.log(`Original skills: ${skills.length}`);

// Remove duplicates, keeping first occurrence
const seenIds = new Set();
const uniqueSkills = [];

for (const skill of skills) {
  if (!seenIds.has(skill.id)) {
    seenIds.add(skill.id);
    uniqueSkills.push(skill);
  } else {
    console.log(`Removing duplicate: ${skill.id}`);
  }
}

console.log(`\nUnique skills: ${uniqueSkills.length}`);
console.log(`Removed ${skills.length - uniqueSkills.length} duplicates`);

// Write back
fs.writeFileSync(skillsPath, JSON.stringify(uniqueSkills, null, 2));
console.log(`Updated ${skillsPath}`);

// Verify
const verify = JSON.parse(fs.readFileSync(skillsPath, 'utf8'));
console.log(`\nVerification: ${verify.length} skills in file`);
