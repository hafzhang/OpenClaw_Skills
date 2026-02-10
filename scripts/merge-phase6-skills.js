#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔄 Starting Phase 6 Skills Merge...');

// Read files
const existingSkillsPath = path.join(__dirname, '../src/data/skills.json');
const newSkillsPath = path.join(__dirname, '../src/data/skills-phase6-new.json');

console.log('📖 Reading existing skills.json...');
const existingSkills = JSON.parse(fs.readFileSync(existingSkillsPath, 'utf8'));
console.log(`   ✓ Found ${existingSkills.length} existing skills`);

console.log('📖 Reading skills-phase6-new.json...');
const newSkills = JSON.parse(fs.readFileSync(newSkillsPath, 'utf8'));
console.log(`   ✓ Found ${newSkills.length} new skills`);

// Merge skills
const mergedSkills = [...existingSkills, ...newSkills];
console.log(`📊 Merged total: ${mergedSkills.length} skills`);

// Write output
const outputPath = path.join(__dirname, '../src/data/skills.json');
console.log('💾 Writing merged skills.json...');
fs.writeFileSync(outputPath, JSON.stringify(mergedSkills, null, 2));
console.log('   ✓ Done!');

console.log('\n✅ Merge complete!');
console.log(`   Before: ${existingSkills.length} skills`);
console.log(`   Added: ${newSkills.length} skills`);
console.log(`   After: ${mergedSkills.length} skills`);
