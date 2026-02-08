# OpenClaw Hub 下一阶段计划

> **版本**: v5.0 (Phase 6 规划中：分享 Agent 配置功能)
> **更新时间**: 2026-02-08
> **当前分支**: feature/openclaw-hub-phase-3
> **当前状态**: Phase 5 完成 ✅ (教程 100 篇，技能 1000 个) | Phase 6 规划中 🚧

---

## 📊 当前状态总结

### ✅ Phase 1 已完成（MVP）

| 数据类型 | 当前数量 | 数据文件 | 状态 |
|----------|----------|----------|------|
| 技能 (Skills) | 40 | `src/data/skills.json` | ✅ 完成 |
| 教程 (Tutorials) | 10 | `src/data/tutorials.json` | ✅ 完成 |
| 用户故事 | 29 个 | US-001 ~ US-029 | ✅ 全部通过 |

### ✅ Phase 2 已完成（增强功能）

| 数据类型 | 当前数量 | 数据文件 | 状态 |
|----------|----------|----------|------|
| 技能详情页 | 300 | `src/app/skills/[slug]/page.tsx` | ✅ 完成 |
| 配置分享 | 5 | `src/data/configs.json` | ✅ 完成 |
| 用户故事 | 16 个 | US-030 ~ US-045 | ✅ 全部通过 |

### ✅ Phase 3 已完成（内容扩展）

| 数据类型 | 目标数量 | 实际完成 | 状态 |
|----------|----------|----------|------|
| 教程 (Tutorials) | 40 | 40 | ✅ 完成 |
| 技能 (Skills) | 300 | 300 | ✅ 完成 |
| 用户故事 | 16 个 | US-046 ~ US-077 | ✅ 全部通过 |

### ✅ Phase 4 已完成（高级功能）

| 功能模块 | 文件 | 状态 |
|----------|------|------|
| 高级搜索和筛选 | `src/lib/advanced-search.ts` + components | ✅ 完成 |
| 书签和阅读列表 | `src/lib/bookmarks.ts` + components | ✅ 完成 |
| 教程进度跟踪 | `src/lib/progress.ts` + components | ✅ 完成 |
| 技能安装跟踪 | `src/lib/installations.ts` | ✅ 完成 |
| 内容评分系统 | `src/lib/ratings.ts` | ✅ 完成 |
| 深色模式增强 | `src/components/theme/` | ✅ 完成 |
| 目录导航 | `src/components/tutorial/` | ✅ 完成 |
| 打印/PDF 导出 | CSS print styles | ✅ 完成 |
| 代码复制改进 | 一键复制 + 反馈 | ✅ 完成 |
| 外部链接验证 | `src/lib/link-validator.ts` | ✅ 完成 |
| 类型定义扩展 | `src/types/index.ts` | ✅ 完成 |

### ✅ Phase 5 已完成（大规模内容扩展）

| 数据类型 | 基础数量 | 实际完成 | 状态 |
|----------|----------|----------|------|
| 教程 (Tutorials) | 40 | 100 | ✅ 完成 |
| 技能 (Skills) | 300 | 1000 | ✅ 完成 |
| 用户故事 | - | US-089 ~ US-100 | ✅ 全部通过 |

### 🚀 Phase 6 规划中（分享 Agent 配置功能）

| 功能模块 | 文件 | 状态 |
|----------|------|------|
| 配置提交表单 | `src/components/configs/ConfigSubmissionForm.tsx` | 🚧 规划中 |
| GitHub PR 生成器 | `src/lib/github-pr.ts` | 🚧 规划中 |
| 配置验证工具 | `src/lib/config-validation.ts` | 🚧 规划中 |
| PR 模板 | `.github/PULL_REQUEST_TEMPLATE/config_submission.md` | 🚧 规划中 |

---

## 🚀 Phase 6: 分享 Agent 配置功能 🚧 规划中

> **启动条件**: Phase 5 全部完成 (教程 100 篇，技能 1000 个) ✅
> **当前状态**: 规划中
> **核心目标**: 实现用户友好的配置分享功能，让用户通过 GitHub PR 提交自己的 Agent 配置

### 功能概述

实现一个用户友好的配置分享功能，让用户能够通过 GitHub PR 提交自己的 Agent 配置到分享站。

### 当前状态分析

- 已有 `/configs` 页面展示现有配置 (`src/app/configs/page.tsx`)
- 已有简单的文字提示引导用户通过 GitHub PR 提交
- 数据存储在静态 `src/data/configs.json` 中
- 站点为静态导出，无后端 API

### 实现方案

#### 1. 添加 shadcn/ui Dialog 组件
```bash
npx shadcn add dialog textarea label
```

#### 2. 创建配置提交表单组件
**文件:** `src/components/configs/ConfigSubmissionForm.tsx`

功能:
- 配置名称 (input)
- 描述 (textarea)
- 作者名 (input)
- GitHub 用户名 (input)
- 配置分类 (select)
- 标签 (input，逗号分隔)
- 配置内容 JSON (textarea，带格式化验证)

#### 3. 创建 GitHub PR 链接生成器
**文件:** `src/lib/github-pr.ts`

功能:
- 接收表单数据，生成预填充的 GitHub PR 链接
- 使用 GitHub 的 `compare` 功能创建 PR 模板
- 或者使用 GitHub Issues 作为临时方案

#### 4. 更新 configs 页面
**文件:** `src/app/configs/page.tsx`

修改:
- 将静态提示卡片改为可点击的"分享配置"按钮
- 点击后打开 Dialog 模态框
- 模态框内嵌 ConfigSubmissionForm

#### 5. 添加 PR 模板
**文件:** `.github/PULL_REQUEST_TEMPLATE/config_submission.md`

用于标准化配置提交格式

#### 6. 可选：创建配置验证函数
**文件:** `src/lib/config-validation.ts`

验证:
- JSON 格式有效性
- 必填字段
- 配置结构是否符合 AgentConfig 类型

### 关键文件路径

| 用途 | 路径 |
|------|------|
| 新增表单组件 | `src/components/configs/ConfigSubmissionForm.tsx` |
| 新增 GitHub PR 工具 | `src/lib/github-pr.ts` |
| 修改配置列表页 | `src/app/configs/page.tsx` |
| 新增验证工具 | `src/lib/config-validation.ts` |
| PR 模板 | `.github/PULL_REQUEST_TEMPLATE/config_submission.md` |
| 类型定义(已有) | `src/types/index.ts` |

### UI 流程

1. 用户访问 `/configs` 页面
2. 点击"分享你的配置"按钮
3. 打开模态框 Dialog
4. 填写表单（配置名、描述、作者、分类、标签、JSON 内容）
5. 点击"生成 PR"
6. 打开新标签页到 GitHub，预填充 PR 内容
7. 用户完成 PR 提交流程

### 验收标准

- [ ] 配置提交表单组件创建完成
- [ ] GitHub PR 链接生成器正常工作
- [ ] configs 页面集成分享按钮和 Dialog
- [ ] 表单验证功能正常（JSON 格式、必填字段）
- [ ] PR 模板创建完成
- [ ] 可选：配置验证工具创建
- [ ] npm run build 构建成功
- [ ] 浏览器测试表单提交流程

### 注意事项

- 由于是静态站点，无法直接保存用户数据，必须通过 GitHub PR 流程
- 表单需要在前端做 JSON 格式验证，避免用户提交格式错误的配置
- 考虑添加"复制到剪贴板"功能作为备选方案

---

## ✅ Phase 5: 大规模内容扩展（已完成）

> **启动条件**: Phase 4 全部完成 (US-078 ~ US-088 ✅)
> **当前状态**: 规划中
> **新目标**: 教程 40 → 100 (+60)，技能 300 → 1000 (+700)
> **核心原则**: 宁缺毋滥 - 所有仓库必须验证通过且内容完整

### 📚 教程扩展计划（新增 60 篇）

#### 难度分布规划

| 难度 | 当前 | 目标 | 新增 |
|------|------|------|------|
| Beginner | 16 | 40 | +24 |
| Intermediate | 15 | 40 | +25 |
| Advanced | 9 | 20 | +11 |

#### 新增教程主题（60 篇）

**Beginner (24篇) - 扩展基础知识和实用技能**
1. Linux 命令行基础
2. SQL 数据库入门
3. HTML/CSS 基础教程
4. JavaScript 基础语法
5. TypeScript 入门
6. Docker 基础教程
7. Kubernetes 入门
8. Redis 缓存入门
9. Nginx 入门指南
10. Git 进阶使用
11. SSH 密钥管理
12. 正则表达式入门
13. Markdown 写作规范
14. YAML 配置文件
15. JSON 数据格式
16. API 设计基础
17. 微服务概念入门
18. 容器化基础
19. CI/CD 基础概念
20. 监控和日志基础
21. Web 安全基础
22. 单元测试入门
23. 集成测试基础
24. 调试技巧入门

**Intermediate (25篇) - 深入技术和实战应用**
1. NestJS 后端开发
2. Next.js 全栈开发
3. React 性能优化
4. Vue.js 3 组合式 API
5. Spring Boot 开发
6. Django REST API 开发
7. Flask 微服务开发
8. PostgreSQL 高级查询
9. MongoDB 数据建模
10. Redis 高级用法
11. Elasticsearch 搜索引擎
12. RabbitMQ 消息队列
13. Kafka 流处理
14. AWS Lambda 无服务器
15. GCP Cloud Functions
16. Azure Functions
17. Terraform 基础设施
18. Ansible 自动化
19. Jenkins CI/CD
20. GitOps 实践
21. 可观测性 (Observability)
22. 分布式追踪
23. 限流和熔断
24. API 网关设计
25. GraphQL 进阶

**Advanced (11篇) - 架构设计和高级主题**
1. 大规模系统架构
2. 高可用架构设计
3. 灾难恢复和备份
4. 安全架构设计
5. 性能调优实战
6. 微服务治理
7. 服务网格进阶
7. 云原生架构模式
8. 实时数据处理
9. 流处理系统
10. 机器学习工程
11. 企业级 DevOps 实践

#### 教程质量标准

每篇新教程需满足：
- ✅ 完整的 Markdown 内容（2000+ 字）
- ✅ 至少 5 个代码示例
- ✅ 至少 2 个实战案例
- ✅ 相关技能链接（relatedSkills）
- ✅ 常见问题解答（FAQ）
- ✅ 清晰的学习目标
- ✅ 适当的难度标签
- ✅ 准确的阅读时间估算
- ✅ **相关仓库必须验证通过（HTTP 200）**

### 🛠️ 技能扩展计划（新增 700 个）

#### 分类扩展目标

| 分类 | 当前 | 目标 | 新增 | 重点领域 |
|------|------|------|------|----------|
| development | 88 | 300 | +212 | 编程语言、框架、工具、测试 |
| productivity | 65 | 250 | +185 | 办公、协作、自动化、设计 |
| devops | 60 | 200 | +140 | CI/CD、监控、容器、编排、安全 |
| ai-llms | 41 | 150 | +109 | AI 工具、LLM 集成、提示工程 |
| utilities | 46 | 100 | +54 | 系统工具、CLI、文件处理 |

#### 技能来源策略

1. **社区精选 (50%)**
   - GitHub trending repositories
   - npm 高质量包（周下载 > 1000）
   - 社区推荐和验证
   - Star 数 >500（优先）

2. **官方工具 (30%)**
   - 开源项目官方 CLI
   - 云服务提供商工具
   - 技术公司官方 SDK

3. **实用工具 (20%)**
   - 填补分类空白
   - 独特功能工具
   - 创新解决方案

#### 技能数据要求（严格）

每个新技能必须包含：
- ✅ **唯一的 slug（URL 友好，kebab-case）**
- ✅ **中文名称**
- ✅ **简短描述（50-100字）**
- ✅ **详细描述（150-300字，可选）**
- ✅ **英文原文名称**
- ✅ **准确的分类（5大类之一）**
- ✅ **3-5 个相关标签**
- ✅ **作者信息**
- ✅ **正确的安装命令**
- ✅ **GitHub 仓库链接（或替代链接）**
- ✅ **仓库必须验证通过（HTTP 200，宁缺毋滥）**
- ✅ **verified: true**
- ✅ **仓库必须有实际内容（README、代码等）**
- ✅ **仓库最近 6 个月有更新**
- ✅ **仓库 Star 数 >100（确保质量）**

#### 仓库验证要求（严格执行）

- **硬性要求**：
  - 仓库不存在（404）的技能不能添加到列表
  - 仓库无法访问的技能不能添加到列表
  - 仓库内容过少（如仅有一个 README）需谨慎考虑
  - 仓库长期不维护（>1 年无更新）需谨慎考虑

- **验证流程**：
  1. 使用 HTTP HEAD 请求验证仓库存在性
  2. 检查仓库基本内容（README、代码文件等）
  3. 验证仓库更新活跃度
  4. 记录验证结果和仓库元数据（Star 数、更新时间）
  5. 对失败的仓库直接排除，不寻找替代

- **验证工具**：
  - `scripts/verify-skill-repos.js` - 批量验证脚本
  - 生成验证报告（JSON/CSV 格式）
  - 统计成功率和失败原因

### 📋 实施步骤

#### Sprint 7: 教程扩展（分批执行，每批 4-6 篇）

**批次划分原则**: 每批 4-6 篇教程，确保每批完成后可以立即测试和验证

| 批次 | 任务 | 教程数量 | 工作量 |
|------|------|----------|--------|
| **阶段 1: 确定教程主题** |
| 7.0 | 确定 60 个新教程主题列表 | 60 | 4小时 |
| **阶段 2: Beginner 教程 (24篇，分6批)** |
| 7.1 | Beginner 批次 1: Linux、SQL、HTML/CSS、JavaScript | 4 | 1天 |
| 7.2 | Beginner 批次 2: TypeScript、Docker、Kubernetes、Redis | 4 | 1天 |
| 7.3 | Beginner 批次 3: Nginx、Git进阶、SSH、正则表达式 | 4 | 1天 |
| 7.4 | Beginner 批次 4: Markdown、YAML、JSON、API设计 | 4 | 1天 |
| 7.5 | Beginner 批次 5: 微服务、容器化、CI/CD、监控日志 | 4 | 1天 |
| 7.6 | Beginner 批次 6: Web安全、单元测试、集成测试、调试 | 4 | 1天 |
| **阶段 3: Intermediate 教程 (25篇，分5批)** |
| 7.7 | Intermediate 批次 1: NestJS、Next.js、React性能、Vue.js | 4 | 1.5天 |
| 7.8 | Intermediate 批次 2: Spring Boot、Django、Flask、PostgreSQL | 4 | 1.5天 |
| 7.9 | Intermediate 批次 3: MongoDB、Redis、Elasticsearch、RabbitMQ | 4 | 1.5天 |
| 7.10 | Intermediate 批次 4: Kafka、AWS Lambda、GCP、Azure | 4 | 1.5天 |
| 7.11 | Intermediate 批次 5: Terraform、Ansible、Jenkins、GitOps、可观测性 | 5 | 2天 |
| 7.12 | Intermediate 批次 6: 分布式追踪、限流熔断、API网关、GraphQL | 4 | 1.5天 |
| **阶段 4: Advanced 教程 (11篇，分3批)** |
| 7.13 | Advanced 批次 1: 大规模架构、高可用、灾难恢复 | 3 | 2天 |
| 7.14 | Advanced 批次 2: 安全架构、性能调优、微服务治理 | 3 | 2天 |
| 7.15 | Advanced 批次 3: 服务网格、云原生、实时数据、流处理、ML工程、DevOps | 5 | 3天 |
| **阶段 5: 验收和测试** |
| 7.16 | 每批完成后: 更新 tutorials.json + 构建测试 | - | 每批30分钟 |
| 7.17 | 教程代码审查和质量检查（分批进行） | 60 | 3天 |
| 7.18 | 最终构建测试 + 浏览器 MCP 测试 | - | 2小时 |

**每批验收标准**:
- [ ] 教程 Markdown 文件创建完成
- [ ] 内容符合字数要求（Beginner≥2000字，Intermediate≥2500字，Advanced≥3000字）
- [ ] 包含足够的代码示例和实战案例
- [ ] 相关仓库链接有效（HTTP 200）
- [ ] 更新 tutorials.json
- [ ] npm run build 成功
- [ ] 浏览器测试教程详情页

**最终验收标准**:
- [ ] 新增 60 篇教程，总计 100 篇
- [ ] 所有教程通过内容质量检查
- [ ] 教程详情页正确渲染
- [ ] 相关仓库链接有效（如适用）
- [ ] npm run build 构建成功
- [ ] 浏览器 MCP 测试所有新教程

#### Sprint 8: 技能扩展（分批执行，每批 50-100 个）

**批次划分原则**: 按分类分批，每批 50-100 个技能，确保每批完成后可以验证

| 批次 | 任务 | 技能数量 | 工作量 |
|------|------|----------|--------|
| **阶段 1: 工具准备** |
| 8.0 | 创建仓库验证脚本 | - | 2小时 |
| **阶段 2: 研究和筛选（按分类分批）** |
| 8.1 | Development 类批次 1: 编程语言基础 (JavaScript/TypeScript/Python/Go) | 40 | 4小时 |
| 8.2 | Development 类批次 2: 前端框架 (React/Vue/Next.js/Nuxt) | 40 | 4小时 |
| 8.3 | Development 类批次 3: 后端框架 (NestJS/Spring/Django/Flask) | 40 | 4小时 |
| 8.4 | Development 类批次 4: 数据库 (PostgreSQL/MongoDB/Redis) | 30 | 3小时 |
| 8.5 | Development 类批次 5: 测试工具 (Jest/Playwright/Cypress) | 20 | 2小时 |
| 8.6 | Development 类批次 6: 构建工具 (Webpack/Vite/Esbuild) | 20 | 2小时 |
| 8.7 | Development 类批次 7: 其他开发工具 | 22 | 2小时 |
| 8.8 | Productivity 类批次 1: 编辑器和 IDE (VS Code/Vim/Neovim) | 40 | 3小时 |
| 8.9 | Productivity 类批次 2: 笔记和文档 (Notion/Obsidian/Markdown) | 40 | 3小时 |
| 8.10 | Productivity 类批次 3: 终端工具 (Shell/zsh/fish) | 35 | 3小时 |
| 8.11 | Productivity 类批次 4: 效率工具 (fzf/ripgrep/tmux) | 35 | 3小时 |
| 8.12 | Productivity 类批次 5: 设计和协作 | 35 | 3小时 |
| 8.13 | DevOps 类批次 1: 容器技术 (Docker/Kubernetes/Podman) | 40 | 3小时 |
| 8.14 | DevOps 类批次 2: CI/CD (GitHub Actions/GitLab CI/Jenkins) | 35 | 3小时 |
| 8.15 | DevOps 类批次 3: 云平台 (AWS/GCP/Azure) | 35 | 3小时 |
| 8.16 | DevOps 类批次 4: 监控和日志 (Prometheus/Grafana/ELK) | 30 | 2小时 |
| **阶段 3: AI/LLM 和 Utilities** |
| 8.17 | AI/LLMs 类批次 1: AI 工具和集成 | 55 | 4小时 |
| 8.18 | AI/LLMs 类批次 2: LLM 相关工具 | 54 | 4小时 |
| 8.19 | Utilities 类批次 1: 系统工具 | 30 | 2小时 |
| 8.20 | Utilities 类批次 2: 文件处理和网络 | 24 | 2小时 |
| **阶段 4: 仓库验证（分批进行）** |
| 8.21 | 批量验证所有候选技能仓库 (HTTP HEAD 检查) | - | 4小时 |
| 8.22 | 排除 404 和无法访问的仓库 | - | 2小时 |
| 8.23 | 检查仓库内容质量和活跃度 | - | 3小时 |
| **阶段 5: 内容创建** |
| 8.24 | 为验证通过的技能编写中文描述（分批进行） | - | 8小时 |
| 8.25 | 创建技能 slug 和分类标签 | - | 2小时 |
| **阶段 6: 集成和测试** |
| 8.26 | 分批更新 skills.json（每批 50 个） | - | 4小时 |
| 8.27 | 测试技能链接和安装命令 | - | 2小时 |
| 8.28 | 最终构建验证和性能测试 | - | 1小时 |
| 8.29 | 浏览器 MCP 测试核心功能 | - | 1小时 |

**每批验收标准**:
- [ ] 候选技能列表确定
- [ ] GitHub 仓库可访问（HTTP 200）
- [ ] 仓库有实际内容（README、代码）
- [ ] 仓库最近 6 个月有更新
- [ ] Star 数 >100（Utilities 类 >50）
- [ ] 中文描述准确完整
- [ ] slug 唯一且 URL 友好
- [ ] 分类和标签正确
- [ ] 安装命令正确
- [ ] verified: true
- [ ] npm run build 成功

**最终验收标准**:
- [ ] 新增 700 个技能，总计 1000 个（宁缺毋滥）
- [ ] 所有技能 verified: true
- [ ] 所有 GitHub 链接可访问（HTTP 200）
- [ ] 所有仓库有实际内容（README、代码）
- [ ] 所有仓库最近 6 个月有更新
- [ ] 优先仓库 Star 数 >100
- [ ] 所有安装命令正确
- [ ] 分类分布接近目标：development(300), productivity(250), devops(200), ai-llms(150), utilities(100)
- [ ] 技能页面正常显示（性能测试）
- [ ] 搜索功能正常工作
- [ ] npm run build 构建成功
- [ ] 浏览器 MCP 测试核心功能

### 🎯 Phase 5 成功指标

完成 Phase 5 后，项目应该达到：

1. **内容规模**
   - ✅ 100 篇高质量教程（覆盖入门到高级）
   - ✅ 1000 个验证过的技能（宁缺毋滥）
   - ✅ 覆盖所有主要技术场景和使用场景

2. **内容质量**
   - 所有教程符合质量标准
   - 所有技能经过严格仓库验证
   - 仓库必须活跃且有实际内容
   - 内容准确、实用、及时

3. **性能和体验**
   - 搜索结果丰富且相关
   - 页面加载速度快（1000 技能仍快速）
   - Phase 4 高级功能正常工作

4. **社区价值**
   - 成为 OpenClaw 技能最全面的索引站
   - 教程覆盖从入门到精通的学习路径
   - 社区贡献内容的质量标准

### ⚠️ 注意事项

1. **质量优先，宁缺毋滥**
   - 不追求数量，质量第一
   - 每个教程都要有实际价值
   - 每个技能都必须验证仓库通过
   - 仓库不存在或无内容的直接排除

2. **仓库验证是硬性要求**
   - 不存在的仓库不能添加到技能列表
   - 仓库无内容（如只有空 README）需谨慎
   - 长期不维护（>1 年）的仓库需谨慎
   - 404 处理：遇到 404 的技能直接排除
   - 工具优先：创建验证脚本提高效率

3. **分批实施，持续验证**
   - 按分类分批添加技能
   - 每批添加后验证构建和测试
   - 定期检查技能链接有效性
   - 更新过时的教程内容

4. **社区参与**
   - 鼓励社区贡献教程
   - 接受技能推荐
   - 建立内容审核机制

---

## 📝 变更日志

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v5.0 | 2026-02-08 | Phase 5 完成 ✅ (教程 100 篇，技能 1000 个)，Phase 6 规划中：分享 Agent 配置功能 |
| v4.1 | 2026-02-06 | Phase 5 任务细化：教程扩展分 17 批（每批 3-6 篇），技能扩展分 30 批（每批 20-55 个），确保每批可独立完成和验证 |
| v4.0 | 2026-02-06 | Phase 4 完成 ✅ (US-078 ~ US-088)，Phase 5 规划中：教程 40→100 (+60)，技能 300→1000 (+700) |
| v3.0 | 2026-02-06 | Phase 2 完成 ✅，Phase 3 完成 ✅ (US-046 ~ US-077)，教程 40 篇、技能 300 个 |
| v2.4 | 2026-02-05 | Phase 3 进行中：教程 10→30 (+20)，技能 40→200 (+160) |
| v2.3 | 2026-02-05 | 移除用户系统和云端收藏，专注于技能详情页和配置分享站 |
| v2.2 | 2026-02-05 | 根据 prd.json 更新状态，确认 US-001~US-029 全部完成 |
| v2.1 | 2025-02-05 | 调整实施顺序，重新规划 Sprint |
| v2.0 | 2025-02-04 | 添加 Phase 2 完整规划 |
| v1.0 | 2025-01-xx | 初始版本规划 |

---

**下一步**: 开始 Phase 6 - 实现分享 Agent 配置功能

1. 添加 shadcn/ui Dialog 组件 (`npx shadcn add dialog textarea label`)
2. 创建配置提交表单组件 (`ConfigSubmissionForm.tsx`)
3. 创建 GitHub PR 链接生成器 (`github-pr.ts`)
4. 更新 configs 页面，集成分享按钮和 Dialog
5. 添加 PR 模板 (`config_submission.md`)
6. 创建配置验证工具 (`config-validation.ts`)
7. 构建测试和浏览器验证

**核心原则**: 用户友好 - 通过 GitHub PR 流程实现配置分享

**执行策略**:
- 从表单组件开始，逐步添加功能
- 每个组件完成后立即测试验证
- 最后整合到 configs 页面
- 确保静态站点特性不受影响
