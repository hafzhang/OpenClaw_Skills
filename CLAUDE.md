# OpenClaw Hub - VibeHacks #03

> OpenClaw Skill 市场网站 | openclaw-tools.com


### 1.1 规划 vs 实施分离

```markdown
## Planning vs Implementation

When asked for plans, documentation, or analysis, provide ONLY the requested document first. Do NOT autonomously generate code, implementation files, or explore the codebase unless explicitly requested. Wait for user confirmation before moving from planning to implementation phase.
```

### 1.2 文件操作检查

```markdown
## File Operations

Always check file existence and current project context before attempting modifications. If user references content that cannot be located in the current project, explicitly confirm whether it belongs to a different codebase rather than attempting blind modifications.
```

### 1.3 Git 操作策略

```markdown
## Git Operations

For git operations with large files (>100MB) or many files, always discuss strategy first. Consider Git LFS for large images, test network connectivity before pushes, and handle encoding issues proactively for Chinese character content.
```

### 1.4 数据库操作验证

```markdown
## Database Operations

Before implementing database or API changes, verify table existence and schema matches expectations. When path resolution issues occur, use absolute paths or detect script location dynamically.
```

### 1.5 MCP 服务器配置

```markdown
## MCP Server Configuration

When working with MCP servers or external APIs, add explicit API key checks and validation steps in documentation. Test basic connectivity before attempting complex operations.
```


## 技术栈
```
Next.js 16 + React 19 + TypeScript + Tailwind CSS 3.4.17 + shadcn/ui
⚠️ 使用 Tailwind v3，v4 有 CSS bug
```

## 项目结构
```
src/
├── app/       # pages: skills, tutorials, configs
├── data/      # JSON 数据 (200+ skills, 30 tutorials)
├── lib/       # getAllSkills(), getAllTutorials()
└── components/
```

## 开发命令
```bash
npm run dev    # 开发
npm run build  # 构建
npm run test   # Playwright 测试 (8个全过)
```

## 数据访问
```typescript
import { getAllSkills, getSkillBySlug } from '@/lib/skills';
const skills = getAllSkills();
```

## 重要说明
- **静态站点**: 数据来自 `src/data/*.json`
- **Tailwind**: v3.4.17，`postcss.config.mjs` + `tailwind.config.js`
- **颜色**: HSL 值 `hsl(var(--background))`
- **迁移**: 升级 Supabase 时前端 100% 复用

## 添加技能
编辑 `src/data/skills.json`，仓库必须 HTTP 200 可访问

## 部署
```bash
vercel --prod
```

---
**VibeHacks #03** | docs/full-product-plan.md
