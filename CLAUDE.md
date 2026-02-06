# OpenClaw Hub - VibeHacks #03

> OpenClaw Skill 市场网站 | openclaw-tools.com

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
