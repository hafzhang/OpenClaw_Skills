const fs = require("fs");

// Read existing skills (200)
const existingSkills = JSON.parse(fs.readFileSync("src/data/skills.json", "utf8"));
console.log("Existing skills:", existingSkills.length);

// Read new skills (100)
const newSkills = JSON.parse(fs.readFileSync("docs/skill-candidates-final-100.json", "utf8"));
console.log("New skills:", newSkills.length);

// Merge
const merged = [...existingSkills, ...newSkills];
console.log("Total skills after merge:", merged.length);

// Verify count
const byCategory = {};
merged.forEach(s => {
  byCategory[s.category] = (byCategory[s.category] || 0) + 1;
});
console.log("\nBy category:");
Object.entries(byCategory).forEach(([cat, count]) => {
  console.log("  " + cat + ":", count);
});

// Write merged file
fs.writeFileSync("src/data/skills.json", JSON.stringify(merged, null, 2));
console.log("\nUpdated src/data/skills.json with", merged.length, "skills");
