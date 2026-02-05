# OpenClaw Hub 下一阶段计划

> **版本**: v2.4 (添加 Phase 3 内容扩展规划)
> **更新时间**: 2026-02-05
> **当前分支**: feature/openclaw-hub-content-complete
> **当前状态**: MVP 完成 ✅ (US-001 ~ US-029 全部通过)，进入 Phase 2

---

## 📊 当前状态总结

### ✅ MVP 已完成（Phase 1）

| 数据类型 | 当前数量 | 数据文件 | 状态 |
|----------|----------|----------|------|
| 技能 (Skills) | 40 | `src/data/skills.json` | ✅ 完成 |
| 教程 (Tutorials) | 10 | `src/data/tutorials.json` | ✅ 完成 |
| 用户故事 (User Stories) | 29 个 | US-001 ~ US-029 | ✅ 全部通过 |
| 页面 | 4 个 | `src/app/` | ✅ 完成 |

### 🎯 已实现功能

| 功能 | 实现方式 | 文件位置 |
|------|----------|----------|
| 技能展示 | SkillCard 组件 | `src/components/SkillCard.tsx` |
| 教程展示 | TutorialCard 组件 | `src/components/TutorialCard.tsx` |
| 分类筛选 | CategoryFilter 组件 | `src/components/CategoryFilter.tsx` |
| 统一搜索 | SearchBar + lib/search | `src/components/SearchBar.tsx` |
| 响应式设计 | Tailwind CSS | 全局 |
| 静态生成 | Next.js SSG | `src/app/` |
| SEO 优化 | sitemap.ts | `src/app/sitemap.ts` |

### 📁 已有路由

```
/                    # 首页 (精选教程 + 技能索引)
/skills              # 技能列表页
/tutorials           # 全部教程页 (新增)
/tutorial/[slug]     # 教程详情页 (动态路由)
```

### ✅ 已完成用户故事概览

**Phase 1 基础功能 (US-001 ~ US-017)**
- ✅ Next.js 项目初始化
- ✅ shadcn/ui 组件配置
- ✅ TypeScript 类型定义
- ✅ 数据文件创建
- ✅ 数据操作函数
- ✅ 核心组件开发
- ✅ 主页和详情页
- ✅ 搜索和筛选功能
- ✅ 响应式设计
- ✅ SEO 优化

**Phase 2 内容创作 (US-018 ~ US-021)**
- ✅ 3 篇核心教程
- ✅ 20 个初始技能
- ✅ 教程创作模板
- ✅ 贡献指南

**Phase 3 部署和完善 (US-022 ~ US-026)**
- ✅ 静态构建配置
- ✅ 部署指南 (Vercel)
- ✅ sitemap.xml
- ✅ 项目 README
- ✅ 页面完整性验证

**Phase 4 内容扩展 (US-027 ~ US-029)**
- ✅ 修复 404 仓库 URL
- ✅ 扩展技能至 40 个 (+20)
- ✅ 扩展教程至 10 个 (+7)

---

## 🚀 Phase 2: 增强功能

> **启动条件**: Phase 1 MVP 全部完成 (US-001 ~ US-029 ✅)
> **预计时间**: 1-2 周
> **当前分支**: feature/openclaw-hub-phase-2

### 2.1 技能详情页（高优先级）

**目标**: 为每个技能创建独立的详情页，参考现有的 `tutorial/[slug]` 实现。

#### 需要创建的文件

| 文件路径 | 说明 | 参考文件 |
|----------|------|----------|
| `src/app/skills/[slug]/page.tsx` | 技能详情页 | `src/app/tutorial/[slug]/page.tsx` |
| `src/lib/skills.ts` (更新) | 添加 getSkillBySlug 函数 | `src/lib/tutorials.ts` |
| `src/components/SkillDetail.tsx` | 技能详情组件 | `src/components/TutorialCard.tsx` |

#### 功能需求

- [ ] 显示技能完整信息（名称、描述、分类、标签）
- [ ] 一键复制安装命令（参考 TutorialCard 的复制功能）
- [ ] 显示相关教程（基于技能的 relatedSkills 反向查找）
- [ ] 显示相关技能（同分类的其他技能）
- [ ] GitHub 链接跳转
- [ ] 响应式设计

#### 数据结构更新

`src/data/skills.json` 需要添加字段：

```json
{
  "id": "skill-id",
  "name": "技能名称",
  "slug": "skill-slug",           // 新增：用于 URL
  "description": "描述",
  "longDescription": "...",       // 新增：详细描述
  "category": "development",
  "tags": ["tag1", "tag2"],
  "author": "作者",
  "command": "npx ...",
  "source": "github",
  "verified": true,
  "url": "https://github.com/...",
  "installCount": 1000,           // 新增：安装计数
  "relatedSkills": ["id1", "id2"], // 新增：相关技能
  "createdAt": "2024-01-01"
}
```

---

### 2.2 Agent 配置分享站（高优先级）

**目标**: 创建 Agent 配置的分享和浏览平台。

#### 需要创建的文件

| 文件路径 | 说明 | 参考文件 |
|----------|------|----------|
| `src/data/configs.json` | 配置数据 | `src/data/skills.json` |
| `src/types/index.ts` (更新) | 添加 Config 类型 | 现有类型 |
| `src/lib/configs.ts` | 配置数据操作 | `src/lib/skills.ts` |
| `src/app/configs/page.tsx` | 配置列表页 | `src/app/skills/page.tsx` |
| `src/app/configs/[slug]/page.tsx` | 配置详情页 | `src/app/tutorial/[slug]/page.tsx` |
| `src/components/ConfigCard.tsx` | 配置卡片 | `src/components/SkillCard.tsx` |
| `src/components/ConfigEditor.tsx` | 配置编辑器 | 新建 |

#### Config 类型定义

```typescript
// src/types/index.ts
interface AgentConfig {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  author: string;
  authorUrl?: string;
  config: Record<string, unknown>;  // Agent 配置 JSON
  category: string;
  tags: string[];
  likesCount: number;
  forksCount: number;
  isOfficial: boolean;
  relatedConfigs: string[];
  createdAt: string;
  updatedAt: string;
}
```

#### 示例配置数据

至少需要 5 个初始配置：

1. **通用助手配置** - 基础对话助手
2. **代码审查配置** - 代码审查专家
3. **文档写作配置** - 技术文档生成
4. **调试助手配置** - Bug 调试专家
5. **学习助手配置** - 编程学习导师

---

## 📋 推荐实施顺序

### Sprint 1: 技能详情页（2-3 天）

**目标**: 完成技能详情页基础功能

## 📋 推荐实施顺序

### Sprint 1: 技能详情页（2-3 天）

**目标**: 完成技能详情页基础功能

| 步骤 | 任务 | 文件 | 工作量 |
|------|------|------|--------|
| 1.1 | 更新 skills.json 添加 slug 等字段 | `src/data/skills.json` | 2小时 |
| 1.2 | 更新 Skill 类型定义 | `src/types/index.ts` | 30分钟 |
| 1.3 | 添加 getSkillBySlug 函数 | `src/lib/skills.ts` | 1小时 |
| 1.4 | 创建技能详情页 | `src/app/skills/[slug]/page.tsx` | 3小时 |
| 1.5 | 实现 SkillDetail 组件 | `src/components/SkillDetail.tsx` | 3小时 |
| 1.6 | 更新 sitemap.ts | `src/app/sitemap.ts` | 30分钟 |
| 1.7 | 测试和修复 | - | 2小时 |

**验收标准**:
- [ ] 访问 `/skills/claude-code` 能看到技能详情
- [ ] 显示完整技能信息
- [ ] 复制安装命令功能正常
- [ ] 显示相关教程和技能
- [ ] SEO 优化（metadata 正确）

---

### Sprint 2: Agent 配置分享站（3-5 天）

**目标**: 完成配置分享基础功能

| 步骤 | 任务 | 文件 | 工作量 |
|------|------|------|--------|
| 2.1 | 创建 Config 类型 | `src/types/index.ts` | 30分钟 |
| 2.2 | 创建初始配置数据（5+ 个） | `src/data/configs.json` | 2小时 |
| 2.3 | 创建 configs 工具模块 | `src/lib/configs.ts` | 1小时 |
| 2.4 | 创建配置列表页 | `src/app/configs/page.tsx` | 3小时 |
| 2.5 | 创建 ConfigCard 组件 | `src/components/ConfigCard.tsx` | 2小时 |
| 2.6 | 创建配置详情页 | `src/app/configs/[slug]/page.tsx` | 3小时 |
| 2.7 | 添加配置到导航和搜索 | `src/components/Header.tsx` | 1小时 |
| 2.8 | 更新 sitemap.ts | `src/app/sitemap.ts` | 30分钟 |
| 2.9 | 测试和修复 | - | 2小时 |

**验收标准**:
- [ ] `/configs` 页面显示配置列表
- [ ] `/configs/[slug]` 显示配置详情
- [ ] 至少包含 5 个示例配置
- [ ] 可以复制配置 JSON
- [ ] 配置在搜索中可找到

---

## 🗂️ 关键文件结构

### 需要创建的页面

```
src/app/
├── skills/
│   └── [slug]/
│       └── page.tsx          # ✅ Sprint 1 - 技能详情页
└── configs/                   # ✅ Sprint 2 - 配置分享站
    ├── page.tsx               # 配置列表页
    └── [slug]/
        └── page.tsx           # 配置详情页
```

### 需要创建的组件

```
src/components/
├── SkillDetail.tsx            # ✅ Sprint 1 - 技能详情组件
└── ConfigCard.tsx             # ✅ Sprint 2 - 配置卡片
```

### 需要创建/更新的工具模块

```
src/lib/
├── skills.ts                  # ✏️ 更新 - 添加 getSkillBySlug
└── configs.ts                 # ✅ 新增 - 配置数据操作
```

### 需要更新的数据文件

```
src/data/
├── skills.json                # ✏️ 更新 - 添加 slug 等字段
└── configs.json               # ✅ 新增 - 配置数据
```

### 需要更新的类型文件

```
src/types/
└── index.ts                   # ✏️ 更新 - 添加 Config, 更新 Skill
```

---

## 📝 类型定义更新

### 更新 Skill 接口

```typescript
// src/types/index.ts
interface Skill {
  id: string;
  name: string;
  slug: string;                    // 新增
  description: string;
  longDescription?: string;        // 新增
  category: string;
  tags: string[];
  author: string;
  command: string;
  source: string;
  verified: boolean;
  url: string;
  installCount?: number;           // 新增
  relatedSkills?: string[];        // 新增
  createdAt: string;
}
```

### 新增 Config 接口

```typescript
// src/types/index.ts
interface AgentConfig {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  author: string;
  authorUrl?: string;
  config: Record<string, unknown>;
  category: string;
  tags: string[];
  likesCount: number;
  forksCount: number;
  isOfficial: boolean;
  relatedConfigs?: string[];
  createdAt: string;
  updatedAt: string;
}
```

---

## 🧪 验收标准总结

### 技能详情页（Sprint 1）

- [ ] 访问 `/skills/[slug]` 显示技能详情
- [ ] 显示完整技能信息（名称、描述、分类、标签、作者）
- [ ] 一键复制安装命令，显示复制成功提示
- [ ] 显示相关教程（基于 relatedSkills 或标签匹配）
- [ ] 显示相关技能（同分类的其他技能）
- [ ] GitHub 链接可点击跳转
- [ ] 响应式设计，移动端正常显示
- [ ] SEO 优化，包含正确的 metadata

### 配置分享站（Sprint 2）

- [ ] `/configs` 页面显示配置列表
- [ ] `/configs/[slug]` 页面显示配置详情
- [ ] 至少包含 5 个不同类别的示例配置
- [ ] 配置详情页正确渲染 JSON 格式
- [ ] 一键复制配置 JSON 功能
- [ ] 配置在统一搜索中可找到
- [ ] 配置卡片显示点赞数、分类等信息

---

## ⚠️ 技术债务

当前需要解决的问题：

| 优先级 | 问题 | 解决方案 | 预计工作量 |
|--------|------|----------|------------|
| P2 | 类型定义不完整 | 更新 `src/data/tutorials.json.d.ts` | 30分钟 |
| P2 | 数据格式一致 | 确保 skills.json 字段完整 | 1小时 |
| P3 | 缺少测试 | 为关键功能添加测试 | 2-3天 |
| P3 | 图片优化未启用 | 配置 Next.js 图片优化 | 1小时 |

**Note**: 部分技术债务已在 US-029 中解决，剩余问题建议在 Phase 2 开发过程中逐步处理。

---

## 📚 参考资料

| 文档 | 路径 | 说明 |
|------|------|------|
| 完整产品方案 | `docs/full-product-plan.md` | 长期规划 |
| 工作计划 | `docs/work-plan.md` | 当前进度 |
| PRD | `prd.json` | 产品需求文档 |
| 进度追踪 | `progress.txt` | 任务进度 |

---

## 🎯 成功指标

### ✅ Phase 1 已达成目标

1. **内容完整性**
   - ✅ 40 个技能，全部验证通过
   - ✅ 10 个教程，覆盖不同难度级别
   - ✅ 5 大技能分类完整

2. **用户体验**
   - ✅ 响应式设计，移动端友好
   - ✅ 统一搜索功能
   - ✅ 分类筛选功能
   - ✅ 教程详情页 Markdown 渲染

3. **技术质量**
   - ✅ 静态站点生成
   - ✅ SEO 优化 (sitemap.xml)
   - ✅ TypeScript 类型安全
   - ✅ 部署就绪 (Vercel)

### 🎯 Phase 2 目标（进行中）

完成 Phase 2 后，项目应该达到：

1. **内容完整性**
   - 技能有独立的详情页
   - 配置分享站有 5+ 个示例配置
   - 所有内容类型都有完整的展示

2. **用户体验**
   - 搜索功能覆盖所有内容类型
   - 所有内容详情页功能完善

3. **技术质量**
   - 代码结构清晰，易于扩展
   - 类型定义完整

---

## 📊 实施时间线

```
Week 1: Sprint 1 - 技能详情页 (2-3天)
Week 2: Sprint 2 - Agent 配置分享站 (3-5天)
Week 3-8: Phase 3 - 内容大扩展（教程增至30个，技能增至200个）
```

---

**下一步**: 开始 Sprint 1 - 技能详情页开发

---

## 🚀 Phase 3: 内容大扩展（预计 4-6 周）

> **启动条件**: Phase 2 全部完成 (US-030 ~ US-045 ✅)
> **当前状态**: 规划中
> **目标**: 教程 10 → 30 (+20)，技能 40 → 200 (+160)

### 📊 内容扩展目标

| 内容类型 | 当前数量 | 目标数量 | 新增 | 状态 |
|----------|----------|----------|------|------|
| 教程 (Tutorials) | 10 | 30 | +20 | 🔜 规划中 |
| 技能 (Skills) | 40 | 200 | +160 | 🔜 规划中 |

### 📚 教程扩展计划（+20 篇）

#### 难度分布规划

| 难度 | 当前 | 目标 | 新增 |
|------|------|------|------|
| Beginner | 5 | 12 | +7 |
| Intermediate | 4 | 12 | +8 |
| Advanced | 1 | 6 | +5 |

#### 新增教程主题建议

**Beginner (7篇)**
1. OpenClaw 环境变量配置最佳实践
2. 使用 Git 技能进行版本控制入门
3. Docker 基础：容器化你的第一个应用
4. Markdown 语法完全指南
5. 正则表达式入门教程
6. 命令行基础技能大全
7. 文件系统操作实战

**Intermediate (8篇)**
1. REST API 集成实战
2. 数据库操作指南（SQL 基础）
3. CI/CD 流水线搭建
4. 日志分析与监控
5. 性能优化技巧
6. 安全最佳实践
7. 测试驱动开发（TDD）入门
8. 微服务架构设计

**Advanced (5篇)**
1. 高级调试技巧
2. 大规模数据处理
3. 实时系统设计
4. 分布式系统实践
5. 高级性能调优

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

### 🛠️ 技能扩展计划（+160 个）

#### 分类扩展目标

| 分类 | 当前 | 目标 | 新增 | 重点领域 |
|------|------|------|------|----------|
| development | 8 | 60 | +52 | 编程语言、框架、工具 |
| productivity | 15 | 50 | +35 | 办公、协作、自动化 |
| devops | 9 | 40 | +31 | CI/CD、监控、容器 |
| ai-llms | 5 | 30 | +25 | AI 工具、LLM 集成 |
| utilities | 3 | 20 | +17 | 系统工具、文件处理 |

#### 技能来源策略

1. **社区精选 (60%)**
   - GitHub trending skills
   - npm 优质包
   - 社区推荐
   - Star 数 >100

2. **官方验证 (30%)**
   - OpenClaw 官方推荐
   - 作者维护活跃
   - 文档完善
   - 测试覆盖率高

3. **实用工具 (10%)**
   - 填补分类空白
   - 独特功能
   - 创新工具

#### 技能数据要求

每个新技能需包含：
- ✅ 唯一的 slug (URL 友好)
- ✅ 中文名称和描述
- ✅ 英文原文名称
- ✅ 准确的分类
- ✅ 相关标签 (3-5 个)
- ✅ 作者信息
- ✅ 正确的安装命令
- ✅ GitHub 仓库链接（或替代链接）
- ✅ **仓库必须存在且可访问（HTTP 200）**
- ✅ verified: true (已验证可用)
- ✅ longDescription (详细说明)
- ✅ installCount (安装计数)

#### 仓库验证要求

- **硬性要求**：仓库不存在（404）的技能不能添加到列表
- **验证方法**：使用 HTTP HEAD 请求或 curl 验证
- **重定向处理**：允许最多 1 次重定向，记录最终 URL
- **失败处理**：标记并排除不通过的仓库，不尝试寻找替代
- **验证工具**：使用 scripts/verify-skill-repos.js 自动化脚本

### 📋 实施步骤

#### Sprint 5: 教程扩展（2-3 周）

| 步骤 | 任务 | 工作量 |
|------|------|--------|
| 5.1 | 确定 20 个新教程主题列表 | 4小时 |
| 5.2 | 创建教程大纲和结构模板 | 2小时 |
| 5.3 | 编写 7 篇 Beginner 教程 | 5天 |
| 5.4 | 编写 8 篇 Intermediate 教程 | 7天 |
| 5.5 | 编写 5 篇 Advanced 教程 | 5天 |
| 5.6 | 代码审查和质量检查 | 2天 |
| 5.7 | 更新 tutorials.json | 2小时 |
| 5.8 | 测试所有新教程渲染 | 4小时 |

**验收标准**:
- [ ] 新增 20 篇教程，总计 30 篇
- [ ] 所有教程通过内容质量检查
- [ ] 教程详情页正确渲染
- [ ] 相关技能链接有效
- [ ] npm run build 构建成功

#### Sprint 6: 技能扩展（2-3 周）

| 步骤 | 任务 | 工作量 |
|------|------|--------|
| 6.0 | 创建仓库验证脚本 | 4小时 |
| 6.1 | 研究 GitHub 和社区资源 | 1天 |
| 6.2 | 筛选 160 个候选技能 | 2天 |
| 6.3a | 验证技能仓库可访问性 | 2天 |
| 6.3b | 验证技能功能可用性 | 2天 |
| 6.4 | 编写技能描述（中文） | 5天 |
| 6.5 | 创建技能 slug 和分类 | 2天 |
| 6.6 | 更新 skills.json | 1天 |
| 6.7 | 测试所有技能链接 | 1天 |
| 6.8 | 验证安装命令正确性 | 1天 |

**验收标准**:
- [ ] 新增 160 个技能，总计 200 个
- [ ] 所有技能 verified: true
- [ ] 所有 GitHub 链接可访问（HTTP 200）
- [ ] 排除仓库不存在（404）或无法访问的技能
- [ ] 所有安装命令正确
- [ ] 分类分布符合目标
- [ ] 技能页面正常显示
- [ ] 搜索功能正常工作

### 🎯 Phase 3 成功指标

完成 Phase 3 后，项目应该达到：

1. **内容规模**
   - ✅ 30 篇高质量教程
   - ✅ 200 个验证过的技能
   - ✅ 覆盖所有主要使用场景

2. **内容质量**
   - 所有教程符合质量标准
   - 所有技能经过验证
   - 内容准确、实用、及时

3. **用户体验**
   - 搜索结果更加丰富
   - 更多的学习路径选择
   - 更完善的技能生态

### ⚠️ 注意事项

1. **质量优先**
   - 不追求数量，质量第一
   - 每篇教程都要有实际价值
   - 每个技能都要验证可用

2. **仓库验证是硬性要求**
   - 不存在的仓库不能添加到技能列表
   - 404 处理：遇到 404 的技能直接排除
   - 重定向处理：允许最多 1 次重定向，记录最终 URL
   - 工具优先：创建验证脚本提高效率

3. **持续验证**
   - 定期检查技能链接有效性
   - 更新过时的教程内容
   - 移除不再维护的技能

4. **社区参与**
   - 鼓励社区贡献教程
   - 接受技能推荐
   - 建立内容审核机制

---

## 📝 变更日志

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v2.4 | 2026-02-05 | 添加 Phase 3 内容扩展规划：教程 10→30 (+20)，技能 40→200 (+160) |
| v2.3 | 2026-02-05 | 移除用户系统和云端收藏，专注于技能详情页和配置分享站 |
| v2.2 | 2026-02-05 | 根据 prd.json 更新状态，确认 US-001~US-029 全部完成 |
| v2.1 | 2025-02-05 | 调整实施顺序，重新规划 Sprint |
| v2.0 | 2025-02-04 | 添加 Phase 2 完整规划 |
| v1.0 | 2025-01-xx | 初始版本规划 |
