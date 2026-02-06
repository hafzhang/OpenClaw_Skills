const fs = require("fs");
const verified = JSON.parse(fs.readFileSync("docs/skill-candidates-phase3-100-verified.json", "utf8"));

console.log("Total verified candidates:", verified.length);

// Count by category
const byCategory = {};
verified.forEach(s => {
  byCategory[s.category] = (byCategory[s.category] || 0) + 1;
});
console.log("\nBy category:");
Object.entries(byCategory).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
  console.log("  " + cat + ":", count);
});

// Target distribution for 100 skills
const targets = {
  "development": 43,
  "productivity": 30,
  "devops": 19,
  "ai-llms": 24,
  "utilities": 0
};

console.log("\nTarget distribution for new 100 skills:");
Object.entries(targets).forEach(([cat, target]) => {
  console.log("  " + cat + ": ~" + target);
});

// Group by category
const byCategoryGroup = {};
verified.forEach(s => {
  if (!byCategoryGroup[s.category]) {
    byCategoryGroup[s.category] = [];
  }
  byCategoryGroup[s.category].push(s);
});

// Select from each category
const selected = [];
Object.entries(targets).forEach(([cat, target]) => {
  if (target === 0) return;
  const available = byCategoryGroup[cat] || [];
  const toSelect = Math.min(target, available.length);
  console.log("\nSelecting", toSelect, "of", available.length, "from", cat);
  selected.push(...available.slice(0, toSelect));
});

console.log("\nTotal selected:", selected.length);

// Verify count
let actualCount = 0;
const actualByCat = {};
selected.forEach(s => {
  actualCount++;
  actualByCat[s.category] = (actualByCat[s.category] || 0) + 1;
});
console.log("\nActual selection by category:");
Object.entries(actualByCat).forEach(([cat, count]) => {
  console.log("  " + cat + ":", count);
});

// Save selected skills with skill-201 to skill-300 IDs
const finalSkills = selected.map((s, i) => ({
  ...s,
  id: "skill-" + (201 + i),
  command: "npx clawhub@latest install " + s.slug,
  createdAt: "2026-02-06T00:00:00Z"
}));

fs.writeFileSync("docs/skill-candidates-final-100.json", JSON.stringify(finalSkills, null, 2));
console.log("\nSaved to docs/skill-candidates-final-100.json");
console.log("Skill IDs: skill-201 to skill-" + (200 + finalSkills.length));
