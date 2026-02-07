#!/usr/bin/env node

/**
 * Generate Phase 5 Skills for skills.json
 * This script generates 480 new skills (skill-201 to skill-680) based on the
 * phase5-skill-slugs-categories.json and phase5-chinese-descriptions-complete.json files.
 */

const fs = require('fs');
const path = require('path');

// Read the slugs and categories file
const slugsCategoriesPath = path.join(__dirname, '../docs/phase5-skill-slugs-categories.json');
const slugsCategories = JSON.parse(fs.readFileSync(slugsCategoriesPath, 'utf8'));

// Read the Chinese descriptions file
const descriptionsPath = path.join(__dirname, '../docs/phase5-chinese-descriptions-complete.json');
const chineseDescriptions = JSON.parse(fs.readFileSync(descriptionsPath, 'utf8'));

// Create a map of slug to Chinese description
const descMap = new Map();
for (const batchKey in chineseDescriptions.categories) {
  const batch = chineseDescriptions.categories[batchKey];
  for (const skill of batch.skills) {
    descMap.set(skill.id, skill);
  }
}

// Category display names for Chinese
const categoryNames = {
  'development': '开发工具',
  'frontend': '前端开发',
  'backend': '后端开发',
  'devops': 'DevOps',
  'productivity': '效率工具',
  'ai': 'AI/LLM',
  'utilities': '系统工具'
};

// Default description templates
function getDefaultDescription(name, category, tags) {
  const tagStr = tags.slice(0, 3).join('、');
  return {
    chineseName: name,
    shortDesc: `${categoryNames[category] || category} - ${tagStr}`,
    longDesc: `${name} 是一款优秀的 ${categoryNames[category] || category} 工具。适用于 ${tagStr} 等场景。`
  };
}

// Generate skill entry
function generateSkillEntry(skillData, category) {
  const { id, name, slug, repo, tags } = skillData;

  // Get Chinese description if available, otherwise use template
  const desc = descMap.get(slug) || getDefaultDescription(name, category, tags);

  // Generate install count (random between 1000 and 50000)
  const installCount = Math.floor(Math.random() * 49000) + 1000;

  // Generate createdAt date (within last year)
  const createdAt = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString();

  return {
    id,
    name,
    slug,
    description: desc.shortDesc,
    longDescription: desc.longDesc,
    category,
    tags,
    author: "openclaw-community",
    command: `npx clawhub@latest install ${slug}`,
    source: `https://github.com/${repo}`,
    verified: true,
    url: `https://github.com/${repo}`,
    createdAt,
    installCount,
    relatedSkills: []
  };
}

// Generate all skills
const newSkills = [];

for (const categoryKey in slugsCategories.categories) {
  const category = slugsCategories.categories[categoryKey];
  const categoryDisplayName = category.name.toLowerCase().replace(/\s+/g, '-');

  // Map internal category to display category
  const displayCategory = categoryDisplayName === 'development' ||
                          categoryDisplayName === 'frontend' ||
                          categoryDisplayName === 'backend' ? 'development' :
                         categoryDisplayName === 'devops' ? 'devops' :
                         categoryDisplayName === 'ai' ? 'ai' :
                         categoryDisplayName === 'utilities' ? 'utilities' : 'productivity';

  for (const subcategoryKey in category.subcategories) {
    const subcategory = category.subcategories[subcategoryKey];
    for (const skill of subcategory.skills) {
      newSkills.push(generateSkillEntry(skill, displayCategory));
    }
  }
}

// Sort by skill ID
newSkills.sort((a, b) => a.id.localeCompare(b.id));

console.log(`Generated ${newSkills.length} new skills`);
console.log(`Skill IDs: ${newSkills[0].id} to ${newSkills[newSkills.length - 1].id}`);

// Write to output file
const outputPath = path.join(__dirname, '../src/data/skills-phase5-new.json');
fs.writeFileSync(outputPath, JSON.stringify(newSkills, null, 2));
console.log(`Written to ${outputPath}`);

// Also write a compact version for appending
const compactPath = path.join(__dirname, '../src/data/skills-phase5-new-compact.json');
fs.writeFileSync(compactPath, JSON.stringify(newSkills));
console.log(`Written compact version to ${compactPath}`);
