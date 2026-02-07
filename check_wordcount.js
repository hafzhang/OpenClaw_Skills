const data = require('./tutorials_041_100.json');
const t = data.find(t => t.id === 'tutorial-041');
const content = t.content;
const lines = content.split('\n');

console.log('Tutorial 041 - Linux Command Line Basics');
console.log('Total lines:', lines.length);
console.log('Total chars (all):', content.length);

const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
console.log('Code blocks:', codeBlocks.length);

const withoutCode = content.replace(/```[\s\S]*?```/g, '');
console.log('Content without code (chars):', withoutCode.length);

const chinese = (withoutCode.match(/[\u4e00-\u9fa5]/g) || []).length;
const english = (withoutCode.match(/[a-zA-Z]+/g) || []).length;

console.log('Chinese chars:', chinese);
console.log('English words:', english);
console.log('Total words (chinese + english):', chinese + english);

// Show first few lines
console.log('\nFirst 20 lines of content:');
console.log(content.split('\n').slice(0, 20).join('\n'));
