#!/usr/bin/env node

/**
 * Merge Phase 5 Skills into skills.json
 * This script reads the existing skills.json and appends the new Phase 5 skills.
 */

const fs = require('fs');
const path = require('path');

// Read existing skills
const skillsPath = path.join(__dirname, '../src/data/skills.json');
const existingSkills = JSON.parse(fs.readFileSync(skillsPath, 'utf8'));

// Read new skills
const newSkillsPath = path.join(__dirname, '../src/data/skills-phase5-new.json');
const newSkills = JSON.parse(fs.readFileSync(newSkillsPath, 'utf8'));

console.log(`Existing skills: ${existingSkills.length}`);
console.log(`New skills: ${newSkills.length}`);

// Merge skills
const mergedSkills = [...existingSkills, ...newSkills];

console.log(`Total skills after merge: ${mergedSkills.length}`);

// Write merged skills back to skills.json
fs.writeFileSync(skillsPath, JSON.stringify(mergedSkills, null, 2));
console.log(`Updated ${skillsPath}`);

// Verify the result
const verify = JSON.parse(fs.readFileSync(skillsPath, 'utf8'));
console.log(`Verification: ${verify.length} skills in file`);
