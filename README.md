# OpenClaw 实战指南

**教程为主，技能索引为辅** - 帮助中文用户快速上手 OpenClaw，30 个真实案例让 AI 助手真正帮你工作。

## 项目简介

OpenClaw 实战指南是一个静态网站项目，提供高质量的 OpenClaw 教程和技能索引。所有教程内容经过精心编写，技能数据经过人工验证，确保准确性和实用性。

### 特点

- 📚 **教程导向**：以实战教程为主，帮助用户快速掌握 OpenClaw
- 🔧 **技能索引**：辅助功能，提供可用的 OpenClaw 技能列表
- ✅ **内容验证**：所有教程和技能都经过人工验证
- 🚀 **静态部署**：基于 Next.js 静态导出，快速且安全
- 📱 **响应式设计**：支持桌面端和移动端访问

## 快速开始

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站。

### 构建生产版本

```bash
npm run build
```

静态文件将生成在 `out/` 目录下。

### 预览生产构建

```bash
npx serve out
```

## ralph.sh使用方式

  # 基本用法（40次迭代，10分钟超时）
  ./scripts/ralph/ralph.sh --tool claude 40

  # 自定义超时（5分钟）
  ./scripts/ralph/ralph.sh --tool claude --timeout 300 40

  # 自定义延迟和超时
  ./scripts/ralph/ralph.sh --tool claude --timeout 600 --delay 60 40

## 项目结构

```
openclaw-hub/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # 全局布局
│   │   ├── page.tsx            # 主页
│   │   ├── sitemap.ts          # SEO sitemap
│   │   ├── globals.css         # 全局样式
│   │   ├── skills/             # 技能索引页
│   │   │   └── page.tsx
│   │   └── tutorial/[slug]/    # 教程详情页（动态路由）
│   │       └── page.tsx
│   ├── components/             # React 组件
│   │   ├── ui/                 # shadcn/ui 组件
│   │   ├── Header.tsx          # 头部组件
│   │   ├── SearchBar.tsx       # 搜索框
│   │   ├── TutorialCard.tsx    # 教程卡片
│   │   ├── SkillCard.tsx       # 技能卡片
│   │   └── CategoryFilter.tsx  # 分类筛选
│   ├── data/                   # 数据文件
│   │   ├── tutorials.json      # 教程数据
│   │   └── skills.json         # 技能数据
│   ├── lib/                    # 工具函数
│   │   ├── tutorials.ts        # 教程数据操作
│   │   ├── skills.ts           # 技能数据操作
│   │   └── search.ts           # 搜索功能
│   ├── types/                  # TypeScript 类型
│   │   └── index.ts
│   └── templates/              # 内容模板
│       └── tutorial.md         # 教程创作模板
├── public/                     # 静态资源
├── CONTRIBUTING.md             # 贡献指南
├── DEPLOY.md                   # 部署指南
├── next.config.ts              # Next.js 配置
├── tailwind.config.ts          # Tailwind CSS 配置
└── package.json
```

## 数据来源

### 教程数据

- **来源**：手动编写，基于 OpenClaw 官方文档和实际使用经验
- **验证**：所有教程经过内容审核和代码验证
- **更新**：定期更新和补充新教程

### 技能数据

- **来源**：手动精选自 GitHub 上的 OpenClaw 技能仓库
- **验证**：所有技能标记为 `verified: true`，表示已通过人工验证
- **标准**：
  - 仓库活跃且有完整文档
  - 安装命令可用
  - 代码安全可靠
  - 具有实用价值

## 技术栈

- **框架**：Next.js 16 (App Router)
- **语言**：TypeScript
- **样式**：Tailwind CSS v4
- **组件库**：shadcn/ui
- **Markdown**：react-markdown + rehype-highlight
- **部署**：Vercel（静态导出）

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 贡献指南

欢迎贡献教程和技能！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详情。

### 贡献方式

1. **提交教程**：Fork 仓库 → 创建分支 → 提交 PR
2. **提交技能**：通过 GitHub Issues 提交

## 部署

查看 [DEPLOY.md](DEPLOY.md) 了解如何部署到 Vercel 或其他静态托管平台。

## 许可证

[MIT License](LICENSE)

## 联系方式

- GitHub Issues: [提交问题](https://github.com/YOUR_USERNAME/openclaw-hub/issues)
- Discussions: [参与讨论](https://github.com/YOUR_USERNAME/openclaw-hub/discussions)

---

**让 AI 助手真正帮你工作** | OpenClaw 实战指南
