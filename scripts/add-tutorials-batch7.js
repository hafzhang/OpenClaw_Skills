const fs = require('fs');
const path = require('path');

const tutorialsJsonPath = path.join(__dirname, '..', 'src', 'data', 'tutorials.json');
const tutorials = JSON.parse(fs.readFileSync(tutorialsJsonPath, 'utf8'));

// Read tutorial contents from separate files to avoid heredoc issues
const tutorial069 = JSON.parse(fs.readFileSync(path.join(__dirname, 'tutorial-069-springboot.json'), 'utf8'));
const tutorial070 = JSON.parse(fs.readFileSync(path.join(__dirname, 'tutorial-070-django.json'), 'utf8'));
const tutorial071 = JSON.parse(fs.readFileSync(path.join(__dirname, 'tutorial-071-flask.json'), 'utf8'));
const tutorial072 = JSON.parse(fs.readFileSync(path.join(__dirname, 'tutorial-072-postgresql.json'), 'utf8'));

tutorials.push(tutorial069, tutorial070, tutorial071, tutorial072);
fs.writeFileSync(tutorialsJsonPath, JSON.stringify(tutorials, null, 2), 'utf8');

console.log('Added 4 new Intermediate tutorials (69-72)');
console.log('Total tutorials:', tutorials.length);
