const fs = require('fs');
const tutorials = JSON.parse(fs.readFileSync('src/data/tutorials.json', 'utf8'));

// Tutorial definitions with all required fields
const tutorialDefinitions = {
  'tutorial-053': {
    difficulty: 'beginner',
    category: 'development',
    tags: ['Markdown', '文档写作', '技术文档', '写作规范'],
    readTime: 15,
    author: 'OpenClaw Team'
  },
  'tutorial-054': {
    difficulty: 'beginner',
    category: 'devops',
    tags: ['YAML', '配置文件', 'Docker', 'Kubernetes', 'CI/CD'],
    readTime: 18,
    author: 'OpenClaw Team'
  },
  'tutorial-055': {
    difficulty: 'beginner',
    category: 'development',
    tags: ['JSON', '数据格式', 'API', '数据交换', 'JavaScript'],
    readTime: 16,
    author: 'OpenClaw Team'
  },
  'tutorial-056': {
    difficulty: 'beginner',
    category: 'development',
    tags: ['API', 'REST', '接口设计', 'Web开发', '后端开发'],
    readTime: 20,
    author: 'OpenClaw Team'
  }
};

// Fix new tutorials with missing fields
tutorials.forEach(t => {
  if (tutorialDefinitions[t.id]) {
    const defs = tutorialDefinitions[t.id];
    // Apply all defined fields
    Object.assign(t, defs);
    // Ensure these fields are set
    if (!t.relatedSkills || !Array.isArray(t.relatedSkills)) {
      t.relatedSkills = [];
    }
    if (!t.tags || !Array.isArray(t.tags)) {
      t.tags = defs.tags;
    }
    if (!t.stats) {
      t.stats = { viewCount: 0 };
    }
    if (!t.createdAt) {
      t.createdAt = '2026-02-06T00:00:00Z';
    }
    if (t.featured === undefined) {
      t.featured = false;
    }
  }
});

// Save back
fs.writeFileSync('src/data/tutorials.json', JSON.stringify(tutorials, null, 2), 'utf8');
console.log('Fixed all tutorial fields');

// Verify
const newTutorials = tutorials.filter(t => t.id.startsWith('tutorial-05'));
console.log('\nVerified tutorials:');
newTutorials.forEach(t => {
  console.log('-', t.id, 'difficulty:', t.difficulty, 'category:', t.category, 'readTime:', t.readTime);
});
