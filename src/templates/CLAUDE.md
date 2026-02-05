# Tutorial Templates

This directory contains the complete template suite for creating tutorials.

## Template Files

### Core Templates

1. **`tutorial-outline.md`** - Tutorial outline template
   - Used for planning the tutorial structure
   - Contains learning objectives, prerequisites, chapter structure
   - Required before writing any tutorial

2. **`tutorial.md`** - Tutorial Markdown template (main template)
   - Serves as the index for all templates
   - Contains the standard tutorial structure
   - Use this when writing the actual tutorial content

### Supporting Templates

3. **`code-example-standards.md`** - Code example format standards
   - Defines formatting for all code blocks
   - Language-specific conventions
   - Comment and documentation standards
   - Reference this when writing any code examples

4. **`faq-template.md`** - FAQ template
   - Standard FAQ format and structure
   - Required FAQ types (installation, usage, errors, best practices)
   - Quality guidelines for FAQ content

5. **`tutorial-quality-checklist.md`** - Quality checklist
   - 15 categories of checklist items
   - Must pass all items before publishing
   - Use for self-review and peer review

6. **`tutorial-creation-workflow.md`** - Creation workflow
   - Complete guide from planning to publishing
   - Four phases: Planning → Writing → Review → Publishing
   - Read this first when creating a new tutorial

## Tutorial Creation Workflow

```
1. Read tutorial-creation-workflow.md (first time)
2. Use tutorial-outline.md to plan the tutorial
3. Write content using tutorial.md template
4. Reference code-example-standards.md for code
5. Reference faq-template.md for FAQ section
6. Use tutorial-quality-checklist.md before publishing
```

## Content Standards

### Tutorial Length by Difficulty
- Beginner: 2000+ words, 5+ code examples, 2+ case studies
- Intermediate: 2500+ words, 6+ code examples, 3+ case studies
- Advanced: 3000+ words, 8+ code examples, 4+ case studies

### Reading Time Estimation
- Base: 200-300 words per minute
- Add 1-2 minutes per code example
- Add time for practice exercises

### Required FAQ Count
- Beginner: 3-4 FAQs
- Intermediate: 4-5 FAQs
- Advanced: 5-6 FAQs

### Required FAQ Types
1. Installation/configuration issues
2. Usage problems
3. Error troubleshooting
4. Best practices

## Code Example Requirements

- All code blocks must specify language identifier
- Code must be runnable (or clearly document dependencies)
- Include necessary comments
- Follow language best practices
- No hardcoded sensitive information

## Quality Gates

Before publishing a tutorial:
1. Complete all items in tutorial-quality-checklist.md
2. Verify all code examples run successfully
3. Verify all links are accessible
4. Verify all related skill repositories return HTTP 200
5. Run `npm run build` successfully

## Important Gotchas

- **Skill repository validation**: All related skills must have accessible GitHub repos (HTTP 200). Do not link to 404 repos.
- **Content escaping**: When adding tutorial content to tutorials.json, the Markdown content must be escaped for JSON (use `JSON.stringify()`)
- **Slug uniqueness**: Tutorial slugs must be unique across all tutorials
- **ID format**: Use tutorial-XXX format for IDs (increment from highest existing)

## File Modification Guidelines

- When adding new templates, update tutorial.md to include them in the index
- When updating standards, ensure all existing templates still comply
- Keep templates consistent with each other
- Update the creation workflow if adding new steps

## Related Files

- `src/data/tutorials.json` - Tutorial data storage
- `src/types/index.ts` - Tutorial type definitions
- `src/lib/tutorials.ts` - Tutorial data access functions
- `docs/tutorial-topics-phase3.md` - Planned tutorial topics
