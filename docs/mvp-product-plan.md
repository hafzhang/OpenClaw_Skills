# OpenClaw Hub - 实战指南 MVP 产品方案

> 教程为主 + 技能索引为辅，帮助中文用户快速上手 OpenClaw

---

## 一、产品定位

### 1.1 核心价值

**混合模式定位**：
- **主要价值**：提供中文实战教程和最佳实践，帮助用户真正学会使用 OpenClaw
- **辅助功能**：精选技能索引，方便查找和安装验证过的技能

### 1.2 目标用户

| 用户群 | 占比 | 痛点 | 价值 |
|--------|------|------|------|
| **中文开发者** | 60% | 官方文档英文，不知道如何应用到实际工作 | 实战案例 + 配置模板 |
| **内容创作者** | 25% | 写作效率低，缺乏创意 | AI 辅助创作教程 |
| **AI 爱好者** | 15% | 想探索 AI 工具的新玩法 | 创意案例和技巧 |

### 1.3 产品口号

**旧口号**（删除）："发现最好用的 OpenClaw 中文技能"

**新口号**：**"OpenClaw 实战指南 - 让 AI 助手真正帮你工作"**

---

## 二、功能范围

### 2.1 核心功能（P0）

| 功能 | 描述 | 交互 |
|------|------|------|
| **教程展示** | 卡片式展示实战教程 | 标题、描述、阅读时间、难度、相关技能 |
| **教程详情** | Markdown 渲染的完整教程 | 步骤、代码、配置、FAQ |
| **技能索引** | 精选技能列表（辅助） | 名称、描述、验证状态、安装命令 |
| **搜索功能** | 统一搜索教程和技能 | 关键词匹配标题和描述 |
| **响应式设计** | 适配手机/平板/桌面 | 移动端优先 |

### 2.2 重要功能（P1）

| 功能 | 描述 |
|------|------|
| **分类筛选** | 按场景分类（工作效率、开发辅助、内容创作等） |
| **难度筛选** | 按难度筛选（入门、进阶、专家） |
| **贡献指南** | GitHub Issues 提交教程 |
| **订阅系统** | 邮件订阅更新通知 |

### 2.3 未来功能（P2）

- 视频教程
- 交互式代码演示
- 用户评论和反馈
- 技能评分系统（基于真实使用数据）

---

## 三、产品原型

### 3.1 页面结构

```
首页
├── Hero 区域
│   ├── 标题: "OpenClaw 实战指南"
│   ├── 副标题: "30 个真实案例，让 AI 助手帮你工作"
│   ├── 搜索框（统一搜索教程+技能）
│   └── CTA: "开始学习"
├── 快速入门（3 个核心教程）
│   ├── 🎯 5 分钟上手 OpenClaw
│   ├── 🔧 配置你的第一个 Agent
│   └── 📝 实战：用 OpenClaw 写代码
├── 精选教程（按场景分类）
│   ├── 💼 工作效率（8 篇）
│   ├── 👨‍💻 开发辅助（10 篇）
│   ├── ✍️ 内容创作（6 篇）
│   └── 🎨 创意玩法（6 篇）
├── 技能索引（辅助功能）
│   └── 按字母顺序列出所有验证过的技能
└── 页脚
    ├── 关于我们
    ├── 贡献指南
    └── 联系方式
```

### 3.2 教程卡片设计

```
┌─────────────────────────────────────────┐
│ 🎯 实战：用 OpenClaw 自动化代码审查      │
│                                         │
│ 学习如何配置 Code Review Agent，自动    │
│ 审查 PR 并提供改进建议，提升代码质量。  │
│                                         │
│ ⏱️  阅读时间: 10 分钟   难度: 进阶      │
│ 📦 涉及技能: code-review, github        │
│ 👁️  234 人已学                          │
│                                         │
│ [开始阅读]  [收藏]                       │
└─────────────────────────────────────────┘
```

### 3.3 技能卡片设计（简化版）

```
┌─────────────────────────────────────────┐
│ 🔌 Code Review              [已验证]    │
│                                         │
│ 自动审查代码，提供改进建议              │
│                                         │
│ 👤 @openclaw                            │
│                                         │
│ [复制安装命令]                          │
└─────────────────────────────────────────┘
```

### 3.4 场景分类体系

| 场景 | 说明 | 示例教程 |
|------|------|---------|
| **快速入门** | 5 分钟上手 OpenClaw | 安装配置、第一个技能、常见问题 |
| **工作效率** | 提升日常工作效率 | 自动化邮件、会议纪要、任务管理 |
| **开发辅助** | 辅助编程开发 | 代码审查、文档生成、调试助手 |
| **内容创作** | 文章/图片创作 | 写作助手、创意生成、内容优化 |
| **创意玩法** | 探索 AI 新玩法 | 游戏脚本、自动化任务、有趣案例 |

---

## 四、技术方案

### 4.1 技术栈

```
前端框架: Next.js 14 (App Router + SSG)
样式方案: Tailwind CSS
UI 组件: shadcn/ui
Markdown: react-markdown + rehype
部署平台: Vercel (免费)
数据源: JSON 文件 (src/data/)
域名: vercel.app 子域名（免费）

技术优势:
├── SSG 静态生成，加载速度快
├── Markdown 教程易于编写和维护
├── MVP 用 JSON 数据，后续可无缝迁移数据库
└── 与完整版代码 100% 兼容
```

### 4.2 项目结构

```
openclaw-hub/
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── layout.tsx               # 全局布局
│   │   ├── page.tsx                 # 首页（教程列表）
│   │   ├── tutorial/
│   │   │   └── [slug]/
│   │   │       └── page.tsx         # 教程详情页
│   │   ├── skills/
│   │   │   └── page.tsx            # 技能索引页
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                      # shadcn/ui 组件
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── TutorialCard.tsx         # 教程卡片
│   │   ├── SkillCard.tsx            # 技能卡片
│   │   ├── SearchBar.tsx
│   │   └── CategoryFilter.tsx
│   ├── data/
│   │   ├── tutorials.json           # 教程数据
│   │   └── skills.json              # 技能数据
│   ├── lib/
│   │   ├── tutorials.ts             # 教程数据操作
│   │   ├── skills.ts                # 技能数据操作
│   │   └── utils.ts                 # 工具函数
│   ├── types/
│   │   └── index.ts                 # 类型定义
│   └── templates/
│       └── tutorial.md              # 教程创作模板
├── public/
│   └── images/
├── next.config.js
├── tailwind.config.js
├── components.json                  # shadcn/ui 配置
└── package.json
```

### 4.3 数据结构（真实数据，无假数据）

#### Tutorial 类型

```typescript
// src/types/index.ts
export interface Tutorial {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string; // Markdown 内容
  category: TutorialCategory;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: number; // 阅读时间（分钟）
  author: {
    name: string;
    avatar?: string;
    url?: string;
  };
  relatedSkills: string[]; // 涉及的技能 ID
  stats: {
    views: number;
    bookmarks: number;
  };
  createdAt: string;
  featured: boolean;
}

export interface TutorialCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}
```

#### Skill 类型（去除假数据）

```typescript
export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  command: string;
  source: 'official' | 'community' | 'verified';
  verified: boolean; // 是否经过验证
  url?: string; // GitHub 仓库链接
  createdAt: string;
  // ❌ 删除 hot（随机热度）
  // ❌ 删除 rating（随机评分）
}
```

#### 初始数据示例

```json
{
  "tutorials": [
    {
      "id": "quick-start",
      "title": "5 分钟上手 OpenClaw",
      "slug": "quick-start",
      "description": "从安装到第一个技能，快速入门 OpenClaw",
      "category": "getting-started",
      "tags": ["入门", "基础", "快速开始"],
      "difficulty": "beginner",
      "readTime": 5,
      "author": {"name": "OpenClaw Hub"},
      "relatedSkills": ["*"],
      "stats": {"views": 0, "bookmarks": 0},
      "featured": true,
      "createdAt": "2025-02-04"
    }
  ],
  "skills": [
    {
      "id": "code-review",
      "name": "Code Review",
      "description": "自动审查代码，提供改进建议",
      "category": "开发工具",
      "tags": ["代码审查", "CI/CD", "GitHub"],
      "author": "@openclaw",
      "command": "npx @openclaw/skill-code-review",
      "source": "official",
      "verified": true,
      "url": "https://github.com/openclaw/skill-code-review",
      "createdAt": "2025-02-04"
    }
  ]
}
```

### 4.4 核心代码示例

#### 教程数据操作

```typescript
// src/lib/tutorials.ts
import tutorials from '@/data/tutorials.json';
import type { Tutorial } from '@/types';

export function getAllTutorials(): Tutorial[] {
  return tutorials.tutorials;
}

export function getFeaturedTutorials(): Tutorial[] {
  return tutorials.tutorials.filter(t => t.featured);
}

export function getTutorialsByCategory(category: string): Tutorial[] {
  return tutorials.tutorials.filter(t => t.category === category);
}

export function getTutorialBySlug(slug: string): Tutorial | undefined {
  return tutorials.tutorials.find(t => t.slug === slug);
}

export function searchTutorials(query: string): Tutorial[] {
  const q = query.toLowerCase();
  return tutorials.tutorials.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.tags.some(tag => tag.toLowerCase().includes(q))
  );
}
```

#### 统一搜索（教程 + 技能）

```typescript
// src/lib/search.ts
import { searchTutorials } from './tutorials';
import { searchSkills } from './skills';
import type { Tutorial, Skill } from '@/types';

export interface SearchResult {
  type: 'tutorial' | 'skill';
  item: Tutorial | Skill;
}

export function searchAll(query: string): SearchResult[] {
  const tutorialResults = searchTutorials(query).map(t => ({
    type: 'tutorial' as const,
    item: t
  }));
  const skillResults = searchSkills(query).map(s => ({
    type: 'skill' as const,
    item: s
  }));
  return [...tutorialResults, ...skillResults];
}
```

#### 教程详情页

```typescript
// src/app/tutorial/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getTutorialBySlug, getAllTutorials } from '@/lib/tutorials';
import ReactMarkdown from 'react-markdown';

export async function generateStaticParams() {
  const tutorials = getAllTutorials();
  return tutorials.map(t => ({ slug: t.slug }));
}

export default function TutorialPage({ params }: { params: { slug: string } }) {
  const tutorial = getTutorialBySlug(params.slug);

  if (!tutorial) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-4">
        <span className="text-sm text-gray-500">
          {tutorial.category.name} · {tutorial.readTime} 分钟
        </span>
      </div>
      <h1 className="text-4xl font-bold mb-4">{tutorial.title}</h1>
      <p className="text-xl text-gray-600 mb-8">{tutorial.description}</p>
      <ReactMarkdown className="prose prose-lg max-w-none">
        {tutorial.content}
      </ReactMarkdown>
    </article>
  );
}
```

---

## 五、实施计划

### 5.1 时间线（4 周快速上线）

| 周数 | 任务 | 产出 |
|------|------|------|
| Week 1 | 基础搭建 + 初始内容 | 项目框架、3 篇核心教程、10 个技能 |
| Week 2 | 内容完善 + 部署 | 8 篇教程、25 个技能、Vercel 部署 |
| Week 3 | 软启动 + 社区建设 | 分享推广、收集反馈、建立微信群 |
| Week 4 | 正式发布 + 持续运营 | Product Hunt、持续更新、数据分析 |

### 5.2 启动清单

```
Week 1: 基础搭建
☑️ 初始化 Next.js 项目
☑️ 配置 Tailwind CSS 和 shadcn/ui
☑️ 创建类型定义（Tutorial + Skill）
☑️ 创建数据文件（tutorials.json + skills.json）
☑️ 开发核心组件（TutorialCard, SkillCard, SearchBar）
☑️ 写 3 篇核心教程
☑️ 准备 10 个技能数据

Week 2: 完善与部署
☑️ 再写 5 篇教程
☑️ 添加 15 个技能
☑️ 创建贡献指南
☑️ SEO 优化
☑️ 移动端适配
☑️ 部署到 Vercel

Week 3-4: 软启动与推广
☑️ 分享到微信群
☑️ 发布到 V2EX
☑️ 建立邮件订阅
☑️ 持续更新内容
```

---

## 六、数据来源（真实数据）

### 6.1 数据获取策略

#### 方案一：手动精选（推荐 MVP）

**数据来源**：
1. **官方文档** - 从官方 GitHub 仓库提取核心技能
2. **自己实践** - 亲自测试并记录使用经验
3. **社区贡献** - 从微信群、Discord 收集实战案例

**初始数据量**：
- 教程：8 篇（3 篇核心 + 5 篇扩展）
- 技能：25 个（全部经过验证）

**数据质量**：
- 100% 验证过才上线
- 每个技能都有真实的安装测试
- 每篇教程都经过实际操作验证

### 6.2 数据维护方式

```
MVP 阶段（0-3 个月）
├── 手动编辑 JSON 文件
├── Git 提交更新
├── 每周更新 1-2 次
└── 100% 验证

增长期（3-6 个月）
├── GitHub Issues 收集贡献
├── 人工审核后发布
├── 每日更新
└── 社区贡献激励机制

规模化（6 个月+）
├── 自动化脚本
├── 人工审核
├── 实时更新
└── 完善的审核流程
```

### 6.3 贡献指南

用 GitHub Issues 替代 Google Form，更透明：

```markdown
## 提交教程

1. Fork 项目
2. 创建新分支
3. 使用 `templates/tutorial.md` 模板编写教程
4. 提交 Pull Request

## 提交技能

1. 确保技能经过测试验证
2. 提供 GitHub 仓库链接
3. 在 Issues 中提交，包含：
   - 技能名称
   - 简短描述
   - 使用场景
   - 安装命令
   - 测试截图（可选）
```

---

## 七、推广策略（现实版）

### 7.1 冷启动渠道

| 渠道 | 操作 | 预期 |
|------|------|------|
| **微信群** | 分享到哥飞社群、Vibe Friends | 首批 30-50 用户 |
| **V2EX** | 发布 "OpenClaw 实战指南上线" | 技术用户关注 |
| **即刻** | 发布实战教程分享 | 互动传播 |
| **GitHub** | 开源项目，社区贡献 | 长期流量 |

### 7.2 SEO 策略

```
目标关键词
- "OpenClaw 教程"
- "OpenClaw 实战"
- "OpenClaw 中文指南"
- "OpenClaw 最佳实践"

优化手段
- 每篇教程包含丰富的关键词
- Meta 描述优化
- sitemap.xml
- 内部链接优化
```

### 7.3 内容营销

```
Week 1-2: 基础内容
├── 3 篇核心教程
├── 1 篇项目介绍
└── 社交媒体分享

Week 3-4: 内容扩展
├── 每周 2-3 篇新教程
├── 1 篇月度总结
└── 社区精选案例

Month 2+: 持续运营
├── 建立内容日历
├── 邮件订阅推送
└── 社区互动
```

---

## 八、成本预算（现实版）

| 项目 | 费用 | 说明 |
|------|------|------|
| 域名 | ¥0-10/月 | vercel.app 免费，.com 可选 |
| 托管 | ¥0 | Vercel 免费版足够 |
| 邮件服务 | ¥0 | Resend 免费版 |
| 分析工具 | ¥0 | Umami 自托管 |
| 社区奖励 | ¥0-200/月 | 可选，用于激励贡献者 |
| **总计** | **¥0-210/月** | MVP 阶段可完全免费 |

---

## 九、成功指标（现实版）

### 9.1 第一个月目标

| 指标 | 目标 | 实现路径 |
|------|------|---------|
| **教程篇数** | 8-10 篇 | 自己写 5 篇，社区贡献 3-5 篇 |
| **技能数量** | 25-30 个 | 手动精选，全部验证 |
| **访问量 (PV)** | 100-200 | 微信群 + V2EX 自然流量 |
| **独立访客 (UV)** | 50-100 | - |
| **订阅用户** | 30-50 人 | 邮件订阅 |
| **完成学习** | 20-30 次 | 教程完成数 |

### 9.2 第二个月目标

| 指标 | 目标 |
|------|------|
| 教程篇数 | 15-20 篇 |
| 月活用户 (MAU) | 150-250 |
| 订阅用户 | 80-120 |
| 社区贡献 | 3-5 篇 |

### 9.3 第三个月目标

| 指标 | 目标 |
|------|------|
| 教程篇数 | 25-30 篇 |
| MAU | 300-500 |
| 订阅用户 | 150-200 |
| 社区贡献者 | 10+ 人 |

---

## 十、下一步行动

### 10.1 Week 1 行动清单

**Day 1-2: 项目初始化**
```bash
# 创建 Next.js 项目
npx create-next-app@latest openclaw-hub --typescript --tailwind --app

# 安装依赖
cd openclaw-hub
npm install react-markdown rehype-highlight

# 初始化 shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add card button input badge
```

**Day 3-5: 核心开发**
- [ ] 创建类型定义
- [ ] 创建 TutorialCard 组件
- [ ] 创建 SkillCard 组件
- [ ] 实现首页
- [ ] 实现教程详情页
- [ ] 实现搜索功能

**Day 6-7: 初始内容**
- [ ] 写"5 分钟上手 OpenClaw"教程
- [ ] 写"配置第一个 Agent"教程
- [ ] 写"代码审查实战"教程
- [ ] 准备 10 个技能数据

### 10.2 Week 2 行动清单

**Day 8-10: 内容扩充**
- [ ] 再写 5 篇教程
- [ ] 添加 15 个技能
- [ ] 创建贡献指南
- [ ] 完善页面样式

**Day 11-12: 优化部署**
- [ ] SEO 优化
- [ ] 性能优化
- [ ] 移动端适配
- [ ] 部署到 Vercel

### 10.3 Week 3-4 行动清单

**软启动**
- [ ] 分享到微信群
- [ ] 发布到 V2EX
- [ ] 建立邮件订阅
- [ ] 收集反馈

**持续运营**
- [ ] 每周更新 2-3 篇教程
- [ ] 回复用户评论
- [ ] 审核社区贡献
- [ ] 分析数据并优化

---

## 附录：关键文件

### 需要修改的文件
- `docs/mvp-product-plan.md` - 本文档

### 需要创建的文件
- `src/types/index.ts` - 类型定义
- `src/data/tutorials.json` - 教程数据
- `src/data/skills.json` - 技能数据
- `src/components/TutorialCard.tsx` - 教程卡片
- `src/components/SkillCard.tsx` - 技能卡片
- `src/templates/tutorial.md` - 教程创作模板
- `CONTRIBUTING.md` - 贡献指南

### 验证命令

```bash
# 检查数据结构
cat src/data/tutorials.json | jq '.tutorials | length'
cat src/data/skills.json | jq '.skills | length'

# 确认无假数据
cat src/data/skills.json | jq '.skills[] | select(.hot != null)' # 应该返回空
cat src/data/skills.json | jq '.skills[] | select(.rating != null)' # 应该返回空

# 运行开发服务器
npm run dev

# 构建测试
npm run build

# 部署
vercel --prod
```

---

## 与原方案的主要区别

| 方面 | 原方案 | 新方案 |
|------|--------|--------|
| **产品定位** | 技能目录 | 教程为主 + 技能索引为辅 |
| **数据来源** | 依赖爬虫 | 手动精选 |
| **假数据** | 随机热度、评分 | 完全删除，用真实数据 |
| **第一个月 PV** | 500+ | 100-200（现实） |
| **商业模式** | 未考虑 | MVP 阶段专注产品 |
| **核心竞争力** | 中文翻译 | 实战案例 + 最佳实践 |

---

**文档版本**: v2.0 (改进版)
**最后更新**: 2026-02-04
**状态**: 待执行
