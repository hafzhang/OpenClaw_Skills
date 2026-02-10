const fs = require('fs');
const path = require('path');

// Read aggregated valid repos
const aggregatedPath = path.join(__dirname, '../reports/phase6-valid-repos-aggregated.json');
const aggregated = JSON.parse(fs.readFileSync(aggregatedPath, 'utf8'));

console.log('Metadata:', JSON.stringify(aggregated.metadata, null, 2));
console.log('\nSummary:');

// Get all repos (excluding metadata and summary)
const repoKeys = Object.keys(aggregated).filter(k => k !== 'metadata' && k !== 'summary');
console.log('Total valid repos:', repoKeys.length);

// Show sample repo
console.log('\nSample repo:');
console.log(JSON.stringify(aggregated[repoKeys[0]], null, 2));
