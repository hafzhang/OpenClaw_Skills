const fs = require("fs");
const selected = JSON.parse(fs.readFileSync("docs/skill-candidates-final-100.json", "utf8"));

console.log("Current count:", selected.length);

// Remove 2 from development to get exactly 100
const devSkills = selected.filter(s => s.category === "development");
const otherSkills = selected.filter(s => s.category !== "development");

console.log("Development skills:", devSkills.length);
console.log("Other skills:", otherSkills.length);

// Remove last 2 development skills (least priority ones)
const adjustedDev = devSkills.slice(0, 41);
const finalSkills = [...otherSkills, ...adjustedDev];

console.log("\nFinal count:", finalSkills.length);

// Verify by category
const byCategory = {};
finalSkills.forEach(s => {
  byCategory[s.category] = (byCategory[s.category] || 0) + 1;
});
console.log("\nFinal distribution:");
Object.entries(byCategory).forEach(([cat, count]) => {
  console.log("  " + cat + ":", count);
});

// Update skill IDs to be consecutive (skill-201 to skill-300)
const withIds = finalSkills.map((s, i) => ({
  ...s,
  id: "skill-" + (201 + i),
  command: "npx clawhub@latest install " + s.slug
}));

fs.writeFileSync("docs/skill-candidates-final-100.json", JSON.stringify(withIds, null, 2));
console.log("\nSaved to docs/skill-candidates-final-100.json");
console.log("Skill IDs: skill-201 to skill-" + (200 + withIds.length));
