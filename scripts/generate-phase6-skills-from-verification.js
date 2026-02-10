#!/usr/bin/env node

/**
 * Generate Phase 6 Skills from Verification Report
 *
 * This script reads the phase 6 verification report and generates
 * new skill entries for all valid HTTP 200 repositories.
 */

const fs = require('fs');
const path = require('path');

// File paths
const VERIFICATION_REPORT = path.join(__dirname, '../reports/phase6-valid-repos-aggregated.json');
const EXISTING_SKILLS = path.join(__dirname, '../src/data/skills.json');
const OUTPUT_FILE = path.join(__dirname, '../src/data/skills-phase6-new.json');

// Category mapping
const CATEGORY_MAP = {
  // Development
  'Frontend Framework Ecosystem': 'development',
  'Database Tools Ecosystem': 'development',
  'Testing Tools Ecosystem': 'development',
  'Build Tools & Bundlers': 'development',
  'IDE & Editor Plugins': 'development',

  // Productivity
  'Editors & IDEs - Productivity': 'productivity',
  'Productivity - Note-taking and Knowledge Management': 'productivity',
  'Terminal & Shell - Productivity': 'productivity',
  'Productivity Tools': 'productivity',
  'Design & Animation Tools': 'productivity',
  'Collaboration and Communication Tools': 'productivity',

  // DevOps
  'Container Technology': 'devops',
  'CI/CD Tools': 'devops',
  'Cloud Platform Tools': 'devops',
  'Monitoring and Logging Tools': 'devops',
  'Configuration Management and Orchestration Tools': 'devops',

  // AI
  'AI Tools and Platforms': 'ai',
  'LLM Libraries and Tools': 'ai',

  // Utilities
  'System Tools': 'utilities',
  'File Processing and Network Tools': 'utilities'
};

// Tag generation based on category keywords
const CATEGORY_TAGS = {
  'Frontend Framework Ecosystem': ['前端', '框架', 'React', 'Vue', 'JavaScript', 'TypeScript', 'UI'],
  'Database Tools Ecosystem': ['数据库', 'ORM', 'SQL', 'NoSQL', '数据', '存储'],
  'Testing Tools Ecosystem': ['测试', '单元测试', 'E2E', '测试框架', '质量保证'],
  'Build Tools & Bundlers': ['构建', '打包', 'Webpack', 'Vite', '工具链', '编译'],
  'IDE & Editor Plugins': ['IDE', '编辑器', '插件', 'VSCode', '扩展'],
  'Editors & IDEs - Productivity': ['编辑器', 'IDE', '生产力', '开发环境'],
  'Productivity - Note-taking and Knowledge Management': ['笔记', '知识管理', '文档', 'Markdown', '生产力'],
  'Terminal & Shell - Productivity': ['终端', 'Shell', '命令行', 'CLI', 'Bash'],
  'Productivity Tools': ['生产力', '工具', '效率', '自动化'],
  'Design & Animation Tools': ['设计', '动画', 'UI', '可视化', 'CSS'],
  'Collaboration and Communication Tools': ['协作', '通信', '团队', 'API', '集成'],
  'Container Technology': ['容器', 'Docker', 'Kubernetes', '虚拟化', '部署'],
  'CI/CD Tools': ['CI/CD', '持续集成', '持续部署', '自动化', '管道'],
  'Cloud Platform Tools': ['云平台', 'AWS', 'Azure', 'GCP', '云计算'],
  'Monitoring and Logging Tools': ['监控', '日志', '追踪', '分析', '可观测性'],
  'Configuration Management and Orchestration Tools': ['配置管理', '编排', '基础设施', 'Terraform', 'Ansible'],
  'AI Tools and Platforms': ['AI', '人工智能', '机器学习', '平台', '模型'],
  'LLM Libraries and Tools': ['LLM', '大语言模型', 'GPT', '提示工程', 'NLP'],
  'System Tools': ['系统工具', '系统管理', '进程', '性能', '调试'],
  'File Processing and Network Tools': ['文件处理', '网络', 'HTTP', '传输', '工具']
};

// Description templates
const DESCRIPTION_TEMPLATES = {
  development: '{name} - 开发工具，提升编码效率',
  productivity: '{name} - 生产力工具，优化工作流程',
  devops: '{name} - DevOps 工具，简化运维部署',
  ai: '{name} - AI 工具，智能辅助开发',
  utilities: '{name} - 系统工具，增强终端能力'
};

const LONG_DESCRIPTION_TEMPLATES = {
  development: '{name} 是一款优秀的 {category} 工具。适用于 {categoryLower}、开发、工程化等场景。',
  productivity: '{name} 是一款优秀的 {category} 工具。适用于 {categoryLower}、效率提升、工作流优化等场景。',
  devops: '{name} 是一款优秀的 {category} 工具。适用于 {categoryLower}、部署、监控、运维等场景。',
  ai: '{name} 是一款优秀的 {category} 工具。适用于 {categoryLower}、智能辅助、自动化等场景。',
  utilities: '{name} 是一款优秀的 {category} 工具。适用于 {categoryLower}、系统管理、文件处理等场景。'
};

/**
 * Extract owner and repo name from "owner/repo" format
 */
function parseRepository(repoString) {
  const [owner, repo] = repoString.split('/');
  return { owner, repo };
}

/**
 * Generate slug from owner and repo name
 */
function generateSlug(owner, repo) {
  return `${owner}-${repo}`.toLowerCase();
}

/**
 * Generate tags based on repo name and category
 */
function generateTags(repoName, category) {
  const tags = new Set();

  // Add category-specific tags
  const categoryTagList = CATEGORY_TAGS[category] || [];
  categoryTagList.forEach(tag => tags.add(tag));

  // Extract meaningful tags from repo name
  const nameParts = repoName.toLowerCase().split(/[-._]/);
  nameParts.forEach(part => {
    if (part.length > 2 && !['js', 'ts', 'cli', 'api', 'io', 'lib'].includes(part)) {
      tags.add(part.charAt(0).toUpperCase() + part.slice(1));
    }
  });

  // Add common tech tags based on name patterns
  if (repoName.toLowerCase().includes('react')) tags.add('React');
  if (repoName.toLowerCase().includes('vue')) tags.add('Vue');
  if (repoName.toLowerCase().includes('angular')) tags.add('Angular');
  if (repoName.toLowerCase().includes('node')) tags.add('Node.js');
  if (repoName.toLowerCase().includes('python')) tags.add('Python');
  if (repoName.toLowerCase().includes('rust')) tags.add('Rust');
  if (repoName.toLowerCase().includes('go')) tags.add('Go');
  if (repoName.toLowerCase().includes('docker')) tags.add('Docker');
  if (repoName.toLowerCase().includes('kubernetes') || repoName.toLowerCase().includes('k8s')) tags.add('Kubernetes');

  // Convert to array and limit to 8 tags
  const tagArray = Array.from(tags).slice(0, 8);

  // Ensure at least 3 tags
  while (tagArray.length < 3) {
    tagArray.push('工具');
  }

  return tagArray;
}

/**
 * Generate description based on repo name and category
 */
function generateDescription(repoName, category, mappedCategory) {
  const template = DESCRIPTION_TEMPLATES[mappedCategory] || DESCRIPTION_TEMPLATES.utilities;
  return template.replace('{name}', repoName);
}

/**
 * Generate long description
 */
function generateLongDescription(repoName, category, mappedCategory) {
  const template = LONG_DESCRIPTION_TEMPLATES[mappedCategory] || LONG_DESCRIPTION_TEMPLATES.utilities;
  return template
    .replace(/{name}/g, repoName)
    .replace(/{category}/g, category)
    .replace(/{categoryLower}/g, category.toLowerCase());
}

/**
 * Get the last skill ID from existing skills
 */
function getLastSkillId(skills) {
  if (skills.length === 0) return 0;
  const lastSkill = skills[skills.length - 1];
  const match = lastSkill.id.match(/skill-(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Generate skill ID
 */
function generateSkillId(index) {
  return `skill-${String(index).padStart(3, '0')}`;
}

/**
 * Main function
 */
function main() {
  console.log('🚀 Starting Phase 6 Skills Generation...\n');

  // Read verification report
  console.log('📖 Reading verification report...');
  const reportContent = fs.readFileSync(VERIFICATION_REPORT, 'utf8');
  const report = JSON.parse(reportContent);
  const repositories = report.repositories || [];

  console.log(`   ✓ Found ${repositories.length} valid repositories\n`);

  // Read existing skills
  console.log('📖 Reading existing skills...');
  const skillsContent = fs.readFileSync(EXISTING_SKILLS, 'utf8');
  const existingSkills = JSON.parse(skillsContent);

  const lastId = getLastSkillId(existingSkills);
  console.log(`   ✓ Last skill ID: skill-${lastId}\n`);

  // Generate new skills
  console.log('🔨 Generating new skill entries...\n');
  const newSkills = [];
  let currentId = lastId + 1;
  const createdAt = new Date().toISOString();

  repositories.forEach((repo, index) => {
    try {
      const { owner, repo: repoName } = parseRepository(repo.repository);

      if (!owner || !repoName) {
        console.warn(`   ⚠ Skipping invalid repository format at index ${index}: ${repo.repository}`);
        return;
      }

      const slug = generateSlug(owner, repoName);
      const category = repo.category || 'System Tools'; // Default category if missing
      const mappedCategory = CATEGORY_MAP[category] || 'utilities';

      const skill = {
        id: generateSkillId(currentId),
        name: repoName,
        slug: slug,
        description: generateDescription(repoName, category, mappedCategory),
        longDescription: generateLongDescription(repoName, category, mappedCategory),
        category: mappedCategory,
        tags: generateTags(repoName, category),
        author: 'openclaw-community',
        command: `npx clawhub@latest install ${owner}-${repoName}`,
        source: repo.url,
        verified: true,
        url: repo.url,
        createdAt: createdAt,
        installCount: 1000,
        relatedSkills: []
      };

      newSkills.push(skill);
      currentId++;

      if ((index + 1) % 100 === 0) {
        console.log(`   ✓ Processed ${index + 1}/${repositories.length} repositories`);
      }
    } catch (error) {
      console.warn(`   ⚠ Skipping repository at index ${index}: ${error.message}`);
    }
  });

  console.log(`   ✓ Generated ${newSkills.length} new skills\n`);

  // Write output
  console.log('💾 Writing output file...');
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(newSkills, null, 2), 'utf8');
  console.log(`   ✓ Written to ${OUTPUT_FILE}\n`);

  // Summary
  console.log('📊 Summary:');
  console.log(`   Input repositories: ${repositories.length}`);
  console.log(`   Generated skills: ${newSkills.length}`);
  console.log(`   ID range: skill-${lastId + 1} to skill-${currentId - 1}\n`);

  // Category breakdown
  const categoryBreakdown = {};
  newSkills.forEach(skill => {
    categoryBreakdown[skill.category] = (categoryBreakdown[skill.category] || 0) + 1;
  });

  console.log('📁 Category breakdown:');
  Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b - a)
    .forEach(([category, count]) => {
      console.log(`   ${category}: ${count}`);
    });

  console.log('\n✅ Generation complete!\n');
}

// Run the script
if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

module.exports = { main };
