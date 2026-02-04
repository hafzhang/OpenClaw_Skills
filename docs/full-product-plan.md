# OpenClaw Hub - 完整产品方案

> 打造 OpenClaw 中文生态的一站式平台

---

## 一、产品愿景

### 1.1 核心定位
**OpenClaw 中文生态中枢** - 连接开发者、用户、技能的完整平台

### 1.2 产品使命
1. **降低使用门槛** - 让中文用户轻松发现和使用 OpenClaw Skills
2. **促进创作分享** - 激励开发者创造更多优质 Skills
3. **构建社区生态** - 形成学习、交流、创作的良性循环

### 1.3 目标用户

| 用户群 | 需求 | 价值 |
|--------|------|------|
| 终端用户 | 发现好用的 Skill | 节省时间，提升效率 |
| 开发者 | 分享自己的 Skill | 获得用户反馈和曝光 |
| 内容创作者 | 寻找创作灵感 | 发现创新玩法 |

---

## 二、产品架构

### 2.1 核心模块

```
                    ┌─────────────────┐
                    │   OpenClaw Hub  │
                    └─────────────────┘
                            │
    ┌───────────┬───────────┼───────────┬───────────┐
    │           │           │           │           │
┌───▼───┐  ┌───▼───┐  ┌───▼───┐  ┌───▼───┐  ┌───▼───┐
│ Skill │  │ Agent │  │  文档 │  │ 社区 │  │ 开发者│
│ 市场  │  │ 配置  │  │ 中心 │  │ 论坛 │  │ 中心 │
└───────┘  └───────┘  └───────┘  └───────┘  └───────┘
```

### 2.2 产品全景

```
┌─────────────────────────────────────────────────────────────────┐
│                         OpenClaw Hub                            │
├─────────────────────────────────────────────────────────────────┤
│ 🔍 搜索    📦 Skill市场    🎨 配置分享    📖 文档中心    💬 社区 │
│                    👤 登录/注册    🌙 深色模式                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  🔥 本周热门                     [查看全部]               │ │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐              │ │
│  │  │Skill│ │Skill│ │Skill│ │Skill│ │Skill│ │Skill│  横向滚动│ │
│  │  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘              │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  📦 技能市场                            [筛选 ▾] [排序 ▾] │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────┐     │ │
│  │  │ 📌 翻译助手 Pro                  ⭐ 4.8  📥 2.1k │     │ │
│  │  │                                                   │     │ │
│  │  │ 中英日多语言实时翻译，支持对话式翻译和文档翻     │     │ │
│  │  │ 译。新增批量翻译、历史记录、快捷短语功能。       │     │ │
│  │  │                                                   │     │ │
│  │  │ [效率工具] [AI] [翻译]         [@openclaw] 更新于2天前│     │ │
│  │  │                                                   │     │ │
│  │  │  [一键安装]  [详情]  [收藏 ⭐]                     │     │ │
│  │  └─────────────────────────────────────────────────┘     │ │
│  │  ...更多 Skills                                          │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  🎨 配置分享站                            [上传配置]       │ │
│  │  社区热传的 Agent 配置，一键导入使用                       │ │
│  │                                                           │ │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                    │ │
│  │  │配置1 │ │配置2 │ │配置3 │ │配置4 │                    │ │
│  │  │ 👍234│ │ 👍189│ │ 👍156│ │ 👍142│                    │ │
│  │  └──────┘ └──────┘ └──────┘ └──────┘                    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  📖 热门教程                                               │ │
│  │  ┌─────────────────────┐ ┌─────────────────────┐        │ │
│  │  │ 30分钟上手 OpenClaw │ │ 构建你的第一个 Skill │        │ │
│  │  │ 📺 12分钟   👀 8.2k │ │ 📝 图文教程 👀 5.1k │        │ │
│  │  └─────────────────────┘ └─────────────────────┘        │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 三、功能详解

### 3.1 📦 Skill 市场

#### 基础功能
| 功能 | 描述 |
|------|------|
| 全文搜索 | 名称、描述、标签、作者全文检索 |
| 多维筛选 | 分类 + 标签 + 安装量 + 评分 + 更新时间 |
| 智能排序 | 热度/评分/最新/相关度 |
| 技能详情 | 完整介绍、截图、使用教程、更新日志 |

#### 详情页设计
```
┌────────────────────────────────────────────────────────┐
│  翻译助手 Pro                                ⭐ 收藏 分享│
├────────────────────────────────────────────────────────┤
│  ┌────────┐  中英日多语言实时翻译，支持对话式翻译和     │
│  │        │  文档翻译。新增批量翻译、历史记录、快捷短  │
│  │ 封面图 │  语功能。                                  │
│  │        │                                            │
│  └────────┘  标签: [效率工具] [AI] [翻译]             │
│                                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │  ⭐ 4.8 (326 评价)    📥 2.1k 安装    👁️ 12k 浏览│  │
│  │  作者 @openclaw     更新于 2 天前                 │  │
│  └─────────────────────────────────────────────────┘  │
│                                                        │
│  📋 功能特性                                           │
│  ✓ 支持 20+ 语言互译                                   │
│  ✓ 对话式翻译，保持上下文                               │
│  ✓ 批量文档翻译                                         │
│  ✓ 翻译历史记录                                         │
│  ✓ 自定义快捷短语                                       │
│                                                        │
│  📸 截图展示                                           │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                          │
│  │图1 │ │图2 │ │图3 │ │图4 │  横向滚动               │
│  └────┘ └────┘ └────┘ └────┘                          │
│                                                        │
│  📖 使用教程                                           │
│  → 快速上手 (3分钟)                                    │
│  → 进阶技巧 (8分钟)                                    │
│  → 常见问题                                            │
│                                                        │
│  📝 更新日志                                           │
│  v2.1.0 (2025-02-01)                                   │
│    + 新增批量翻译功能                                   │
│    + 优化翻译准确性                                     │
│    × 修复已知问题                                       │
│                                                        │
│  💬 用户评论 (326)                                     │
│  ┌─────────────────────────────────────────────────┐  │
│  │ 👤 张三  ⭐⭐⭐⭐⭐  2天前                          │  │
│  │ 超级好用，翻译质量很高！强烈推荐 👍              │  │
│  └─────────────────────────────────────────────────┘  │
│                                                        │
│  [一键安装命令]  [复制配置]  [反馈问题]                 │
└────────────────────────────────────────────────────────┘
```

#### 高级功能
| 功能 | 描述 |
|------|------|
| 订阅更新 | 关注 Skill，更新时收到通知 |
| 版本历史 | 查看所有版本和更新日志 |
| 使用统计 | 作者查看安装量、使用频率 |
| AB 测试 | 支持多版本测试 |
| 私有 Skill | 支持私密分享 |

---

### 3.2 🎨 Agent 配置分享站

#### 核心功能
| 功能 | 描述 |
|------|------|
| 配置上传 | JSON/YAML 格式，支持拖拽上传 |
| 自动脱敏 | 检测并隐藏 API Key 等敏感信息 |
| 配置预览 | 实时预览配置效果 |
| 一键导入 | 复制配置或直接导入 OpenClaw |
| 版本管理 | 支持配置版本控制 |
| Fork 编辑 | 基于他人配置修改创建 |

#### 配置卡片设计
```
┌────────────────────────────────────────┐
│  🎨 写作助手配置           👍 234  👁️ 1.2k │
│                                        │
│  专为长文写作优化的 Agent 配置，包含    │
│  大纲生成、段落扩展、润色等流程         │
│                                        │
│  作者 @writer   更新于 1周前           │
│                                        │
│  [预览]  [一键导入]  [Fork]  [收藏]    │
└────────────────────────────────────────┘
```

#### 配置编辑器
```
┌────────────────────────────────────────────────────────┐
│  创建新配置                                    [保存] [发布]│
├────────────────────────────────────────────────────────┤
│  配置名称: [__________________]                         │
│  配置描述:                                              │
│  ┌────────────────────────────────────────────────┐   │
│  │                                                │   │
│  │                                                │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
│  配置编辑器                     [JSON] [可视化]         │
│  ┌────────────────────────────────────────────────┐   │
│  │ {                                              │   │
│  │   "name": "写作助手",                           │   │
│  │   "prompt": "...",                             │   │
│  │   "temperature": 0.7,                          │   │
│  │   "tools": ["search", "writer"]                │   │
│  │ }                                              │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
│  ☐ 自动脱敏敏感信息                                    │
│  ☐ 允许他人 Fork                                       │
└────────────────────────────────────────────────────────┘
```

---

### 3.3 📖 文档中心

#### 内容结构
```
文档中心
├── 快速开始
│   ├── 安装指南
│   ├── 基础配置
│   └── 第一个 Skill
├── 使用指南
│   ├── 命令参考
│   ├── 技能管理
│   └── 高级技巧
├── 开发教程
│   ├── Skill 开发入门
│   ├── API 参考
│   ├── 最佳实践
│   └── 示例项目
└── 常见问题
    ├── 安装问题
    ├── 使用问题
    └── 开发问题
```

#### 特色功能
| 功能 | 描述 |
|------|------|
| 视频教程 | 配套视频，边看边学 |
| 交互示例 | 在线试运行代码 |
| 贡献指南 | 邀请社区补充文档 |
| 多版本支持 | 跟随 OpenClaw 版本更新 |

---

### 3.4 💬 社区论坛

#### 版块设计
```
社区
├── 💡 技能分享
│   ├── 新发布
│   ├── 热门推荐
│   └── 使用心得
├── 🤝 互助问答
│   ├── 使用问题
│   ├── 开发求助
│   └── Bug 反馈
├── 🎨 创意展示
│   ├── 有趣配置
│   ├── 创意组合
│   └── 应用案例
└── 📢 公告活动
    ├── 官方公告
    ├── 活动发布
    └── 版本更新
```

#### 特色功能
| 功能 | 描述 |
|------|------|
| Markdown 编辑 | 支持代码高亮、图片上传 |
| 代码片段 | 可直接复制运行 |
| 最佳答案 | 标记问题解决方案 |
| 声望系统 | 激励高质量内容 |
| 实时通知 | 回复、点赞即时提醒 |

---

### 3.5 👤 用户体系

#### 账号功能
| 功能 | 描述 |
|------|------|
| 多种登录 | GitHub / Google / 邮箱 |
| 个人主页 | 展示自己的 Skills、配置、贡献 |
| 收藏夹 | 收藏喜欢的 Skills 和配置 |
| 使用历史 | 查看浏览、安装记录 |
| 消息中心 | 系统通知、互动提醒 |

#### 个人主页
```
┌────────────────────────────────────────────────────────┐
│  ┌────────┐                                           │
│  │ 头像   │  @username                                │
│  └────────┘                                           │
│  全栈开发者 | OpenClaw 爱好者                          │
│                                                        │
│  📊 我的数据                                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │   12     │ │   1.2k   │ │   328    │             │
│  │ 发布Skills│ │ 获得安装 │ │ 获得星星 │             │
│  └──────────┘ └──────────┘ └──────────┘             │
│                                                        │
│  📦 我的 Skills (12)                    [查看全部]     │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                │
│  │Skill1│ │Skill2│ │Skill3│ │Skill4│                │
│  └──────┘ └──────┘ └──────┘ └──────┘                │
│                                                        │
│  🎨 我的配置 (8)                        [查看全部]     │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                │
│  │配置1 │ │配置2 │ │配置3 │ │配置4 │                │
│  └──────┘ └──────┘ └──────┘ └──────┘                │
│                                                        │
│  ⭐ 我的收藏                                          │
│  Skills (24) | 配置 (18)                               │
└────────────────────────────────────────────────────────┘
```

---

### 3.6 🔧 管理后台

#### 功能模块
| 模块 | 功能 |
|------|------|
| **内容管理** | 审核 Skills、配置、评论 |
| **用户管理** | 用户列表、权限管理、封禁 |
| **数据看板** | PV/UV、安装量、用户增长 |
| **分类管理** | 添加/编辑分类和标签 |
| **公告管理** | 首页公告、系统通知 |
| **活动配置** | 比赛活动、投票评选 |

#### 数据看板
```
┌────────────────────────────────────────────────────────┐
│  📊 数据看板                    [时间范围 ▾] [刷新]    │
├────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │   总用户数   │ │  总 Skills  │ │  总安装量    │      │
│  │   12,345    │ │     856     │ │   125.6k    │      │
│  │  +123 本周  │ │   +23 本周  │ │  +5.2k 本周 │      │
│  └─────────────┘ └─────────────┘ └─────────────┘      │
│                                                        │
│  📈 访问趋势                        📥 安装趋势        │
│  ┌─────────────────────┐         ┌─────────────────┐  │
│  │      折线图          │         │     折线图       │  │
│  │                     │         │                 │  │
│  └─────────────────────┘         └─────────────────┘  │
│                                                        │
│  🔥 热门 Skills Top 10                                 │
│  ┌─────────────────────────────────────────────────┐  │
│  │ 1. 翻译助手 Pro        2,345 安装  +234 本周    │  │
│  │ 2. 代码审查器         1,890 安装  +156 本周    │  │
│  │ ...                                             │  │
│  └─────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

---

## 四、技术方案

### 4.1 技术架构

```
┌─────────────────────────────────────────────────────────┐
│                    统一技术栈                           │
│  Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui    │
└─────────────────────────────────────────────────────────┘
                          │
         ┌────────────────┴────────────────┐
         ▼                                 ▼
┌─────────────────┐              ┌─────────────────┐
│   MVP 阶段       │              │   完整版阶段     │
├─────────────────┤              ├─────────────────┤
│ 数据: JSON 文件  │    ────▶     │ 数据: Supabase  │
│ 构建: SSG 静态   │    迁移       │ 构建: SSR/ISR   │
│ 成本: ¥0        │    无需       │ 成本: ¥200/月   │
│                 │    重写       │                 │
│ 前端代码 100% 复用 │              │ + 用户认证      │
│                  │              │ + API Routes    │
│                  │              │ + 实时功能      │
└─────────────────┘              └─────────────────┘

┌─────────────────────────────────────────────────────────┐
│                       前端层                            │
│  Next.js 14 + React 18 + TypeScript + Tailwind CSS     │
│  └── shadcn/ui + React Query + Zustand                  │
├─────────────────────────────────────────────────────────┤
│                       后端层                            │
│  Next.js API Routes + TypeScript                       │
│  └── JWT 认证 + Rate Limiting + CORS                   │
├─────────────────────────────────────────────────────────┤
│                       数据层                            │
│  PostgreSQL (Supabase) - 主数据库                      │
│  Redis (Upstash) - 缓存 + 排行榜 + 会话                │
├─────────────────────────────────────────────────────────┤
│                       存储层                            │
│  Cloudflare R2 - 图片/文件存储                          │
├─────────────────────────────────────────────────────────┤
│                       服务层                            │
│  Vercel - 全栈托管 (前端 + API)                        │
│  Resend - 邮件服务                                     │
│  Umami - 数据分析                                      │
└─────────────────────────────────────────────────────────┘
```

### 4.2 数据库设计

#### ER 图核心表

```sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  avatar_url VARCHAR(255),
  bio TEXT,
  github_id VARCHAR(100) UNIQUE,
  role VARCHAR(20) DEFAULT 'user', -- user, admin, moderator
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Skills 表
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  tags TEXT[],
  author_id UUID REFERENCES users(id),
  github_url VARCHAR(255),
  install_command VARCHAR(255),
  latest_version VARCHAR(20),
  install_count INT DEFAULT 0,
  view_count INT DEFAULT 0,
  rating_avg DECIMAL(3,2) DEFAULT 0,
  rating_count INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active', -- active, deprecated, removed
  published_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_category (category_id),
  INDEX idx_author (author_id),
  INDEX idx_status (status),
  INDEX idx_updated (updated_at DESC)
);

-- 分类表
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  icon VARCHAR(50),
  description TEXT,
  sort_order INT DEFAULT 0,
  parent_id UUID REFERENCES categories(id)
);

-- 评分表
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  skill_id UUID REFERENCES skills(id),
  score INT CHECK (score >= 1 AND score <= 5),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- 评论表
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  skill_id UUID REFERENCES skills(id),
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 配置分享表
CREATE TABLE configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  author_id UUID REFERENCES users(id),
  config_json JSONB NOT NULL,
  forked_from UUID REFERENCES configs(id),
  likes_count INT DEFAULT 0,
  views_count INT DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 收藏表
CREATE TABLE favorites (
  user_id UUID REFERENCES users(id),
  target_id UUID NOT NULL,
  target_type VARCHAR(20) NOT NULL, -- skill, config
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, target_id, target_type)
);

-- 安装记录表
CREATE TABLE installs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  skill_id UUID REFERENCES skills(id),
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 通知表
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL, -- comment, like, follow, update
  title VARCHAR(200),
  content TEXT,
  link VARCHAR(255),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 文章表 (教程/文档)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image VARCHAR(255),
  author_id UUID REFERENCES users(id),
  category VARCHAR(50),
  tags TEXT[],
  status VARCHAR(20) DEFAULT 'draft', -- draft, published
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4.3 API 设计

#### RESTful API 端点

```
# 认证
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me

# Skills
GET    /api/skills                    # 获取 Skills 列表
GET    /api/skills/:slug              # 获取 Skill 详情
POST   /api/skills                    # 创建 Skill (需认证)
PUT    /api/skills/:id                # 更新 Skill
DELETE /api/skills/:id                # 删除 Skill
GET    /api/skills/:slug/versions     # 获取版本历史
POST   /api/skills/:id/install        # 记录安装
POST   /api/skills/:id/rate           # 评分
GET    /api/skills/:id/comments       # 获取评论
POST   /api/skills/:id/comments       # 添加评论

# 配置
GET    /api/configs                   # 获取配置列表
GET    /api/configs/:slug             # 获取配置详情
POST   /api/configs                   # 上传配置 (需认证)
PUT    /api/configs/:id               # 更新配置
DELETE /api/configs/:id               # 删除配置
POST   /api/configs/:id/fork          # Fork 配置
POST   /api/configs/:id/like          # 点赞

# 用户
GET    /api/users/:username           # 获取用户信息
GET    /api/users/:username/skills    # 获取用户的 Skills
GET    /api/users/:username/configs   # 获取用户的配置
PUT    /api/users/me                  # 更新个人资料
GET    /api/users/me/favorites        # 获取收藏夹
POST   /api/users/me/favorites        # 添加收藏
DELETE /api/users/me/favorites/:id    # 删除收藏
GET    /api/users/me/notifications    # 获取通知
PUT    /api/users/me/notifications/:id/read  # 标记已读

# 搜索
GET    /api/search?q=keyword          # 全文搜索

# 分类
GET    /api/categories                # 获取所有分类

# 统计
GET    /api/stats/popular             # 热门排行
GET    /api/stats/trending            # 趋势数据
```

### 4.4 前端项目结构

```
openclaw-hub/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (main)/
│   │   │   ├── page.tsx        # 首页
│   │   │   ├── skills/
│   │   │   │   ├── page.tsx    # Skills 列表
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx # Skill 详情
│   │   │   ├── configs/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   ├── docs/
│   │   │   ├── community/
│   │   │   └── users/
│   │   │       └── [username]/
│   │   │           └── page.tsx
│   │   ├── api/                 # API Routes
│   │   │   ├── auth/
│   │   │   ├── skills/
│   │   │   └── ...
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                  # shadcn/ui 组件
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── skill/
│   │   │   ├── SkillCard.tsx
│   │   │   ├── SkillList.tsx
│   │   │   ├── SkillDetail.tsx
│   │   │   └── SkillFilters.tsx
│   │   ├── config/
│   │   ├── search/
│   │   └── auth/
│   ├── lib/
│   │   ├── api.ts               # API 客户端
│   │   ├── auth.ts              # 认证逻辑
│   │   ├── db.ts                # 数据库客户端
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useSkills.ts
│   │   └── useSearch.ts
│   ├── stores/
│   │   └── useStore.ts          # Zustand 状态管理
│   └── types/
│       └── index.d.ts
├── public/
│   ├── images/
│   └── icons/
├── supabase/
│   └── migrations/              # 数据库迁移
├── .env.local
├── next.config.js
├── tailwind.config.js
└── package.json
```

### 4.5 从 MVP 到完整版的迁移

#### 数据层迁移

```typescript
// ========== MVP 阶段 ==========
// src/lib/skills.ts
import skills from '@/data/skills.json';

export function getAllSkills(): Skill[] {
  return skills.skills;
}

export async function getSkillBySlug(slug: string): Skill | undefined {
  return skills.skills.find(s => s.slug === slug);
}

// ========== 完整版阶段 ==========
// 只需修改 lib/skills.ts，组件代码完全不用动
// src/lib/skills.ts
import { db } from '@/lib/db';

export async function getAllSkills(): Promise<Skill[]> {
  return await db.skills.findMany({
    where: { status: 'active' },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getSkillBySlug(slug: string): Promise<Skill | null> {
  return await db.skills.findUnique({
    where: { slug },
    include: { author: true, ratings: true }
  });
}
```

#### 添加用户认证

```typescript
// 组件层无需改动，只需添加中间件保护
// src/middleware.ts
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/api/skills/create']
};
```

#### 迁移清单

```
数据迁移
☑️ 将 JSON 数据导入 Supabase
☑️ 修改数据访问函数 (lib/skills.ts)
☑️ 添加环境变量配置

功能迁移
☑️ 添加 NextAuth.js 认证
☑️ 创建 API Routes
☑️ 添加中间件保护

测试验证
☑️ 功能回归测试
☑️ 性能测试
☑️ 部署验证
```

---

### 4.6 核心代码示例

#### API 客户端

```typescript
// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
});

// 请求拦截器 - 添加 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // 跳转登录
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Skills API
export const skillsApi = {
  list: (params?: SkillListParams) =>
    api.get('/skills', { params }),
  getBySlug: (slug: string) =>
    api.get(`/skills/${slug}`),
  create: (data: CreateSkillDto) =>
    api.post('/skills', data),
  update: (id: string, data: UpdateSkillDto) =>
    api.put(`/skills/${id}`, data),
  delete: (id: string) =>
    api.delete(`/skills/${id}`),
  install: (id: string) =>
    api.post(`/skills/${id}/install`),
  rate: (id: string, score: number) =>
    api.post(`/skills/${id}/rate`, { score }),
};

export default api;
```

#### 数据获取 Hook

```typescript
// src/hooks/useSkills.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { skillsApi } from '@/lib/api';

export function useSkills(params?: SkillListParams) {
  return useQuery({
    queryKey: ['skills', params],
    queryFn: () => skillsApi.list(params),
  });
}

export function useSkill(slug: string) {
  return useQuery({
    queryKey: ['skill', slug],
    queryFn: () => skillsApi.getBySlug(slug),
  });
}

export function useInstallSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (skillId: string) => skillsApi.install(skillId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
}
```

---

## 五、实施计划

### 5.1 开发阶段

#### MVP 升级路径

```
如果你已经完成了 MVP 版本，升级到完整版只需：

1. 数据迁移 (1-2天)
   ├─ 将 skills.json 导入 Supabase
   ├─ 修改数据访问函数
   └─ 测试数据读取

2. 添加认证 (1-2天)
   ├─ 集成 NextAuth.js
   ├─ 创建用户表
   └─ 添加登录页面

3. API 开发 (3-5天)
   ├─ 创建 API Routes
   ├─ 实现评分、评论功能
   └─ 添加管理接口

4. 高级功能 (1-2周)
   ├─ 配置分享站
   ├─ 文档中心
   └─ 社区论坛

总计：2-3周完成从 MVP 到完整版的升级
前端代码几乎无需改动！
```

#### Phase 1: MVP (2周)
```
Week 1: 基础架构 + Skill 市场
├── Day 1-2: 项目初始化、数据库设计
├── Day 3-4: 用户认证系统
├── Day 5-7: Skill 市场 CRUD
├── Day 8-10: 搜索、筛选、排序
└── Day 11-14: Skill 详情页、评分评论

Week 2: 完善功能 + 部署
├── Day 15-17: 配置分享站
├── Day 18-19: 用户中心
├── Day 20-21: SEO 优化、性能优化
└── Day 22-28: 测试、部署、上线
```

#### Phase 2: 增强功能 (2-4周)
```
Week 3-4: 社区功能
├── 论坛系统
├── 实时通知
└── 活动系统

Week 5-6: 高级功能
├── 文档中心
├── 数据分析
└── 管理后台
```

#### Phase 3: 迭代优化 (持续)
```
持续改进
├── 用户反馈收集
├── 性能优化
├── 新功能开发
└── 社区运营
```

### 5.2 上线清单

```
开发完成
☑️ 所有功能测试通过
☑️ 性能测试达标 (Lighthouse >90)
☑️ 安全审计完成
☑️ 错误监控配置

域名配置
☑️ 购买域名
☑️ DNS 配置
☑️ SSL 证书

部署准备
☑️ 环境变量配置
☑️ 数据库迁移
☑️ CDN 配置
☑️ 备份策略

运营准备
☑️ 社交媒体账号
☑️ 初始内容准备
☑️ 宣传材料
☑️ 用户反馈渠道
```

---

## 六、成本预算

### 6.1 初始成本

| 项目 | 费用 | 说明 |
|------|------|------|
| 域名 | ¥50-150 | .com / .cn |
| Logo 设计 | ¥200-500 | 或用 AI 生成 |
| **初始总计** | **¥250-650** | 一次性 |

### 6.2 月度运营成本

| 项目 | 免费额度 | 付费方案 | 月费 |
|------|---------|---------|------|
| 前端托管 (Vercel) | 100GB 带宽 | Pro | ¥150 |
| 后端托管 (Railway) | 512MB RAM | Starter | ¥50 |
| 数据库 (Supabase) | 500MB | Pro | ¥100 |
| 缓存 (Upstash) | 10k 请求/天 | Standard | ¥50 |
| 存储 (R2) | 10GB | - | ¥10 |
| 邮件 (Resend) | 3k 封/月 | - | ¥0 |
| 分析 (Umami) | - | - | ¥0 |
| **免费档总计** | - | - | **¥10** |
| **付费档总计** | - | - | **¥360** |

### 6.3 扩展成本

| 阶段 | 用户量 | 月成本 |
|------|--------|--------|
| MVP | < 1000 | ¥10 |
| 增长期 | 1k-10k | ¥100 |
| 规模化 | 10k+ | ¥500+ |

---

## 七、商业模式

### 7.1 收入来源

```
短期（0-6个月）
├── 暂无 - 专注用户增长
└── 积累用户和数据

中期（6-12个月）
├── 广告收入 - Google AdSense
├── 赞助位置 - 精选推荐位
└── 会员订阅 - 高级功能

长期（12个月+）
├── Skills 付费分发 - 开发者分成
├── 企业版 - 私有部署
├── 培训课程 - OpenClaw 教程
└── 咨询服务 - 定制开发
```

### 7.2 会员体系

| 等级 | 价格 | 权益 |
|------|------|------|
| 免费版 | ¥0 | 基础功能、有限搜索 |
| 专业版 | ¥19/月 | 高级搜索、无限收藏、优先支持 |
| 团队版 | ¥99/月 | 团队协作、私有 Skills、数据分析 |

---

## 八、运营策略

### 8.1 内容运营

```
初始内容
├── 收集整理 100+ Skills
├── 编写 20+ 教程文档
└── 准备 10+ 示例配置

持续更新
├── 每周新增 5-10 Skills
├── 每周发布 1-2 教程
└── 每月组织 1 次活动
```

### 8.2 用户增长

```
冷启动 (0-1000 用户)
├── 微信群、Discord 分享
├── V2EX、掘金发布
├── Product Hunt 上线
└── KOL 合作

增长期 (1000-10000 User)
├── SEO 优化
├── 内容营销
├── 社交媒体运营
└── 用户推荐奖励

规模化 (10000+ User)
├── 品牌建设
├── 付费推广
├── 合作伙伴
└── 线下活动
```

### 8.3 社区运营

```
社区建设
├── 建立微信群/Discord
├── 定期举办线上活动
├── 技能开发比赛
└── 优秀作品展示

激励机制
├── 开发者认证徽章
├── 热门作品推荐
├── 月度最佳评选
└── 实物/虚拟奖励
```

---

## 九、竞争分析

### 9.1 竞品对比

| 平台 | 优势 | 劣势 | 我们的机会 |
|------|------|------|-----------|
| 官方仓库 | 权威、更新快 | 无中文、体验差 | 中文优化、更好体验 |
| GitHub | 开发者熟悉 | 搜索不便、无评分 | 垂直优化、精选内容 |
| Reddit/Discord | 讨论活跃 | 信息分散 | 结构化、易检索 |

### 9.2 差异化优势

```
产品层面
├── 中文本地化
├── 精选优质内容
├── 完善的评价体系
└── 一键安装体验

社区层面
├── 活跃的中文社区
├── 开发者激励机制
├── 持续的内容输出
└── 定期活动组织
```

---

## 十、风险与应对

### 10.1 潜在风险

| 风险 | 概率 | 影响 | 应对 |
|------|------|------|------|
| 官方推出类似产品 | 中 | 高 | 提前建立社区壁垒 |
| 用户增长缓慢 | 高 | 中 | 加强推广、内容营销 |
| 开发者贡献少 | 中 | 中 | 激励机制、降低门槛 |
| 服务器成本高 | 低 | 中 | 优化性能、按需扩展 |

### 10.2 备选方案

```
Plan A: 独立运营
└── 持续投入，打造品牌

Plan B: 与官方合作
└── 成为官方中文合作伙伴

Plan C: 转型
└── 转为付费订阅或企业服务
```

---

## 十一、成功指标

### 11.1 核心指标

| 指标 | 第1月 | 第3月 | 第6月 | 第12月 |
|------|-------|-------|-------|--------|
| MAU | 500 | 2000 | 5000 | 10000 |
| Skills 数量 | 100 | 300 | 500 | 1000 |
| 活跃开发者 | 20 | 50 | 100 | 200 |
| 月安装量 | 1000 | 5000 | 15000 | 30000 |

### 11.2 关键里程碑

```
1 个月
├── 上线 MVP
├── 获得 500 用户
└── 收录 100 Skills

3 个月
├── 完成 Phase 2
├── 获得 2000 用户
└── 开始产生收入

6 个月
├── 形成社区壁垒
├── 获得 5000 用户
└── 实现收支平衡

12 个月
├── 成为第一中文平台
├── 获得 10000 用户
└── 盈利运营
```

---

## 十二、快速开始

### 12.1 项目初始化

```bash
# 创建 Next.js 项目
npx create-next-app@latest openclaw-hub --typescript --tailwind --app

# 进入目录
cd openclaw-hub

# 安装依赖
npm install @tanstack/react-query zustand axios
npm install -D @types/node

# 初始化 Supabase
npx supabase init

# 安装 shadcn/ui
npx shadcn-ui@latest init

# 启动开发服务器
npm run dev
```

### 12.2 环境变量

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
```

### 12.3 数据库迁移

```bash
# 创建迁移文件
supabase migration initial_schema

# 应用迁移
supabase db push

# 生成 TypeScript 类型
supabase gen types typescript --local > src/types/database.ts
```

---

## 附录

### A. 相关资源

- [Next.js 文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)
- [shadcn/ui 文档](https://ui.shadcn.com)
- [OpenClaw 官方文档](#)

### B. 设计资源

- 颜色方案：蓝紫色系
- 字体：Inter + Noto Sans SC
- 图标：Lucide Icons
- 图片：Unsplash

### C. 联系方式

- GitHub: [openclaw-hub](#)
- 微信群: [扫码加入](#)
- 邮箱: contact@openclawhub.com

---

*文档版本：v2.0 - 统一技术栈*
*最后更新：2025-02-04*
*维护者：OpenClaw Hub Team*

---

## 技术栈说明

本方案与 MVP 版本使用 **完全相同的技术栈**：

- **Next.js 14** - App Router
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式方案
- **shadcn/ui** - UI 组件库

**关键优势**：MVP 和完整版的代码可以 100% 复用，升级时无需重写。
