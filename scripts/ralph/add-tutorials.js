const fs = require('fs');

// Read existing tutorials
const tutorials = JSON.parse(fs.readFileSync('src/data/tutorials.json', 'utf8'));

// New tutorials to add
const newTutorials = [
  {
    id: 'tutorial-102',
    title: '环境变量管理最佳实践',
    slug: 'environment-variables-best-practices',
    description: '学习如何安全地管理环境变量，使用 dotenv、配置文件和 Secrets 管理敏感信息。',
    content: '# 环境变量管理最佳实践\n\n环境变量是配置应用程序的关键方式。本教程将深入讲解如何安全地管理环境变量，避免硬编码敏感信息。\n\n## 环境变量概述\n\n### 什么是环境变量？\n\n环境变量是进程运行时的动态值，用于：\n\n- **配置管理**: 数据库连接、API 密钥\n- **环境区分**: 开发、测试、生产环境\n- **安全保护**: 敏感信息不进入代码仓库\n\n### 为什么需要环境变量？\n\n```javascript\n// ❌ 错误：硬编码敏感信息\nconst apiKey = "sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxx";\n\n// ✅ 正确：使用环境变量\nconst apiKey = process.env.API_KEY;\n```\n\n## Node.js 环境变量\n\n### 基础用法\n\n```javascript\nconst port = process.env.PORT || 3000;\nconst nodeEnv = process.env.NODE_ENV || 'development';\n```\n\n## dotenv 使用\n\n### 安装和配置\n\n```bash\nnpm install dotenv\n```\n\n### 基础使用\n\n```javascript\n// .env 文件\nAPI_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxx\nDATABASE_URL=postgresql://user:pass@localhost:5432/mydb\nPORT=3000\n```\n\n```javascript\n// app.js\nrequire('dotenv').config();\nconst apiKey = process.env.API_KEY;\n```\n\n## 安全最佳实践\n\n### .gitignore 配置\n\n```gitignore\n.env\n.env.local\n.env.*.local\n```\n\n## 实战案例\n\n### 案例 1：Express API 配置\n\n```javascript\nrequire('dotenv').config();\n\nmodule.exports = {\n  port: process.env.PORT || 3000,\n  database: {\n    url: process.env.DATABASE_URL,\n  },\n};\n```\n\n### 案例 2：React 前端配置\n\n```javascript\n// .env.development\nVITE_API_URL=http://localhost:3001/api\n\n// .env.production\nVITE_API_URL=https://api.example.com\n```\n\n## 相关技能\n\n- [dotenv](https://github.com/motdotla/dotenv) - 环境变量加载\n- [Vite](https://vitejs.dev/) - 环境变量支持',
    category: 'development',
    tags: ['环境变量', 'dotenv', '安全', '配置管理', '最佳实践'],
    difficulty: 'beginner',
    readTime: 10,
    author: 'OpenClaw Team',
    relatedSkills: ['skill-327', 'skill-580', 'skill-432'],
    stats: { viewCount: 0 },
    createdAt: '2026-02-09T00:00:00.000Z',
    featured: false
  },
  {
    id: 'tutorial-103',
    title: 'JWT 认证完全指南',
    slug: 'jwt-authentication-complete-guide',
    description: '深入理解 JSON Web Token（JWT），学习如何实现安全的用户认证和授权。',
    content: '# JWT 认证完全指南\n\nJWT (JSON Web Token) 是现代应用认证的标准方案。本教程将深入讲解 JWT 原理、使用方法和安全最佳实践。\n\n## JWT 概述\n\n### 什么是 JWT？\n\nJWT 是一种开放标准 (RFC 7519)，用于在各方之间安全传输信息的简洁且自包含的方式。\n\n### JWT 的优势\n\n- **无状态**: 服务器不需要存储会话\n- **跨域**: 适合分布式系统和微服务\n- **扩展性**: 易于水平扩展\n\n### JWT 结构\n\n```\nHeader.Payload.Signature\n```\n\n## Node.js JWT 实现\n\n### 安装依赖\n\n```bash\nnpm install jsonwebtoken bcryptjs\n```\n\n### 生成 JWT\n\n```javascript\nconst jwt = require('jsonwebtoken');\n\nfunction generateToken(payload) {\n  return jwt.sign(payload, process.env.JWT_SECRET, {\n    expiresIn: '7d',\n  });\n}\n```\n\n### 认证中间件\n\n```javascript\nfunction authenticate(req, res, next) {\n  const authHeader = req.headers.authorization;\n  \n  if (!authHeader || !authHeader.startsWith('Bearer ')) {\n    return res.status(401).json({ error: 'No token provided' });\n  }\n\n  const token = authHeader.substring(7);\n\n  try {\n    const decoded = jwt.verify(token, process.env.JWT_SECRET);\n    req.user = decoded;\n    next();\n  } catch (error) {\n    return res.status(401).json({ error: 'Invalid token' });\n  }\n}\n```\n\n## 实战案例\n\n### 案例 1：用户注册和登录\n\n```javascript\nconst bcrypt = require('bcryptjs');\nconst jwt = require('jsonwebtoken');\n\n// 注册\nrouter.post('/register', async (req, res) => {\n  const { username, email, password } = req.body;\n  const hashedPassword = await bcrypt.hash(password, 10);\n  \n  const user = await User.create({\n    username,\n    email,\n    password: hashedPassword,\n  });\n\n  const token = jwt.sign(\n    { userId: user.id, email: user.email },\n    process.env.JWT_SECRET,\n    { expiresIn: '7d' }\n  );\n\n  res.status(201).json({ token, user });\n});\n\n// 登录\nrouter.post('/login', async (req, res) => {\n  const { email, password } = req.body;\n  const user = await User.findOne({ email });\n  \n  const isValidPassword = await bcrypt.compare(password, user.password);\n  if (!isValidPassword) {\n    return res.status(401).json({ error: 'Invalid credentials' });\n  }\n\n  const token = jwt.sign(\n    { userId: user.id, email: user.email },\n    process.env.JWT_SECRET,\n    { expiresIn: '7d' }\n  );\n\n  res.json({ token, user });\n});\n```\n\n### 案例 2：保护路由\n\n```javascript\nrouter.get('/profile', authenticate, (req, res) => {\n  res.json({ user: req.user });\n});\n\nrouter.delete('/users/:id', authenticate, authorize('admin'), (req, res) => {\n  res.json({ message: 'User deleted' });\n});\n```\n\n## 相关技能\n\n- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - 密码加密\n- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - JWT 库\n- [Passport](http://www.passportjs.org/) - 认证中间件',
    category: 'development',
    tags: ['JWT', '认证', '授权', '安全', 'Node.js'],
    difficulty: 'beginner',
    readTime: 15,
    author: 'OpenClaw Team',
    relatedSkills: ['skill-327', 'skill-581', 'skill-582'],
    stats: { viewCount: 0 },
    createdAt: '2026-02-09T00:00:00.000Z',
    featured: false
  },
  {
    id: 'tutorial-104',
    title: 'REST API 设计最佳实践',
    slug: 'rest-api-design-best-practices',
    description: '学习如何设计符合 REST 架构风格的 API，掌握资源命名、HTTP 方法和状态码的使用。',
    content: '# REST API 设计最佳实践\n\nREST (Representational State Transfer) 是现代 Web API 的标准架构风格。本教程将深入讲解 REST API 设计原则和最佳实践。\n\n## REST 概述\n\n### 什么是 REST？\n\nREST 是一种软件架构风格，具有以下约束：\n\n- **客户端-服务器分离**: 关注点分离\n- **无状态**: 每个请求包含所有必要信息\n- **可缓存**: 响应必须明确是否可缓存\n- **统一接口**: 简化架构\n\n### RESTful API 原则\n\n1. **资源导向**: URL 表示资源\n2. **HTTP 方法**: 表示操作\n3. **状态码**: 表示结果\n4. **无状态**: 不存储会话状态\n5. **JSON 格式**: 标准数据格式\n\n## 资源命名\n\n### URL 设计原则\n\n```\n# ✅ 好的 URL 设计\nGET    /users          # 获取用户列表\nGET    /users/123      # 获取特定用户\nPOST   /users          # 创建用户\nPUT    /users/123      # 更新用户\nDELETE /users/123      # 删除用户\n\n# ❌ 不好的 URL 设计\nGET    /getUsers\nPOST   /createUser\nGET    /user?id=123\n```\n\n### 命名规范\n\n```bash\n# 使用名词复数\nGET /products\nGET /orders\n\n# 使用小写和连字符\nGET /user-profiles\nGET /order-items\n\n# 避免动词\n# ❌ GET /getUsers\n# ✅ GET /users\n```\n\n## HTTP 方法\n\n### 标准 CRUD 操作\n\n| 方法 | 操作 | 幂等 | 示例 |\n|------|------|------|------|\n| GET | 读取 | ✅ | GET /users/123 |\n| POST | 创建 | ❌ | POST /users |\n| PUT | 完整更新 | ✅ | PUT /users/123 |\n| PATCH | 部分更新 | ❌ | PATCH /users/123 |\n| DELETE | 删除 | ✅ | DELETE /users/123 |\n\n## HTTP 状态码\n\n### 成功响应 (2xx)\n\n```javascript\n// 200 OK - 请求成功\nres.status(200).json(user);\n\n// 201 Created - 资源创建成功\nres.status(201).json({ user: newUser });\n\n// 204 No Content - 成功但无返回内容\nres.status(204).send();\n```\n\n### 客户端错误 (4xx)\n\n```javascript\n// 400 Bad Request\nres.status(400).json({ error: 'Invalid input' });\n\n// 401 Unauthorized\nres.status(401).json({ error: 'Authentication required' });\n\n// 403 Forbidden\nres.status(403).json({ error: 'Access denied' });\n\n// 404 Not Found\nres.status(404).json({ error: 'User not found' });\n\n// 422 Unprocessable Entity\nres.status(422).json({ error: 'Validation failed' });\n```\n\n## 实战案例\n\n### 案例 1：用户管理 API\n\n```javascript\nconst express = require('express');\nconst router = express.Router();\n\n// 获取用户列表\nrouter.get('/users', async (req, res) => {\n  const { page = 1, limit = 20 } = req.query;\n  const skip = (page - 1) * limit;\n\n  const [users, total] = await Promise.all([\n    User.find().skip(skip).limit(parseInt(limit)),\n    User.countDocuments()\n  ]);\n\n  res.json({\n    data: users,\n    meta: {\n      page: parseInt(page),\n      limit: parseInt(limit),\n      total,\n      totalPages: Math.ceil(total / limit)\n    }\n  });\n});\n\n// 获取用户详情\nrouter.get('/users/:id', async (req, res) => {\n  const user = await User.findById(req.params.id);\n  \n  if (!user) {\n    return res.status(404).json({ error: 'User not found' });\n  }\n\n  res.json({ data: user });\n});\n\n// 创建用户\nrouter.post('/users', async (req, res) => {\n  const { name, email, password } = req.body;\n\n  const user = await User.create({ name, email, password });\n\n  res.status(201).json({\n    data: {\n      id: user._id,\n      name: user.name,\n      email: user.email\n    }\n  });\n});\n\n// 更新用户\nrouter.patch('/users/:id', async (req, res) => {\n  const user = await User.findByIdAndUpdate(\n    req.params.id,\n    { $set: req.body },\n    { new: true }\n  );\n\n  if (!user) {\n    return res.status(404).json({ error: 'User not found' });\n  }\n\n  res.json({ data: user });\n});\n\n// 删除用户\nrouter.delete('/users/:id', async (req, res) => {\n  const user = await User.findByIdAndDelete(req.params.id);\n\n  if (!user) {\n    return res.status(404).json({ error: 'User not found' });\n  }\n\n  res.status(204).send();\n});\n```\n\n### 案例 2：统一响应格式\n\n```javascript\n// 成功响应\n{\n  \"data\": {\n    \"id\": \"123\",\n    \"name\": \"John Doe\"\n  },\n  \"meta\": {\n    \"page\": 1,\n    \"total\": 100\n  }\n}\n\n// 错误响应\n{\n  \"error\": {\n    \"code\": \"VALIDATION_ERROR\",\n    \"message\": \"Invalid input\",\n    \"details\": [...]\n  }\n}\n```\n\n## 相关技能\n\n- [Express](https://expressjs.com/) - Web 框架\n- [Fastify](https://www.fastify.io/) - 高性能框架\n- [OpenAPI](https://swagger.io/specification/) - API 规范',
    category: 'development',
    tags: ['REST', 'API', 'Express', 'HTTP', 'Node.js'],
    difficulty: 'beginner',
    readTime: 16,
    author: 'OpenClaw Team',
    relatedSkills: ['skill-327', 'skill-336', 'skill-414'],
    stats: { viewCount: 0 },
    createdAt: '2026-02-09T00:00:00.000Z',
    featured: false
  },
  {
    id: 'tutorial-105',
    title: 'Git 工作流和协作最佳实践',
    slug: 'git-workflow-collaboration-best-practices',
    description: '掌握 Git 高级工作流，学习分支策略、代码审查和团队协作技巧。',
    content: '# Git 工作流和协作最佳实践\n\nGit 是现代软件开发的基石。本教程将深入讲解 Git 工作流、分支策略和团队协作最佳实践。\n\n## Git 工作流概述\n\n### 什么是 Git 工作流？\n\nGit 工作流是使用 Git 进行版本控制的工作流程，包括：\n\n- **分支策略**: 如何组织和管理分支\n- **提交规范**: 如何编写清晰的提交信息\n- **代码审查**: 如何进行 PR 审查\n- **发布管理**: 如何管理版本发布\n\n### 常见工作流模式\n\n| 工作流 | 适用场景 | 复杂度 |\n|--------|----------|--------|\n| Basic Workflow | 小型项目 | 低 |\n| Feature Branch | 中小型团队 | 中 |\n| Gitflow | 有发布周期的项目 | 高 |\n| GitHub Flow | 持续部署项目 | 中 |\n\n## Feature Branch 工作流\n\n### 分支模型\n\n```\nmain (production)\n  ↑\ndevelop (development)\n  ↑\nfeature/* (功能分支)\nhotfix/* (紧急修复)\n```\n\n### 工作流程\n\n```bash\n# 1. 从 develop 创建功能分支\ngit checkout develop\ngit pull origin develop\ngit checkout -b feature/user-authentication\n\n# 2. 开发功能\ngit add .\ngit commit -m \"feat: add user login functionality\"\n\n# 3. 推送到远程\ngit push origin feature/user-authentication\n\n# 4. 创建 Pull Request\n```\n\n## 提交规范\n\n### Conventional Commits\n\n```\n<type>[optional scope]: <description>\n```\n\n### 提交类型\n\n```bash\n# 功能\nfeat: add user authentication\n\n# 修复\nfix: resolve database connection timeout\n\n# 文档\ndocs: update API documentation\n\n# 样式\nstyle: format code with prettier\n\n# 重构\nrefactor: simplify user service logic\n\n# 性能\nperf: improve image loading speed\n\n# 测试\ntest: add unit tests for auth module\n```\n\n## Pull Request 最佳实践\n\n### PR 模板\n\n```markdown\n## Description\nBrief description of changes\n\n## Type of Change\n- [ ] Bug fix\n- [ ] New feature\n- [ ] Breaking change\n\n## Testing\n- [ ] Unit tests added/updated\n- [ ] Manual testing completed\n\n## Related Issues\nCloses #123\n```\n\n### 代码审查清单\n\n```markdown\n## 功能性\n- [ ] 代码实现了预期功能\n- [ ] 边界情况得到处理\n\n## 代码质量\n- [ ] 代码清晰易读\n- [ ] 遵循项目规范\n\n## 安全性\n- [ ] 没有安全漏洞\n- [ ] 敏感信息得到保护\n```\n\n## 实战案例\n\n### 案例 1：团队协作工作流\n\n```bash\n# 开发者 A：开始新功能\ngit checkout develop\ngit checkout -b feature/user-dashboard\n\n# 开发者 A：提交更改\ngit commit -m \"feat: add user dashboard layout\"\ngit push origin feature/user-dashboard\n\n# 开发者 A：创建 PR\n# GitHub: feature/user-dashboard → develop\n\n# 开发者 B：审查 PR\n# 检查代码，提出建议\n\n# 开发者 A：根据反馈修改\ngit commit -m \"feat: add responsive design\"\ngit push origin feature/user-dashboard\n\n# 开发者 B：批准并合并 PR\n```\n\n### 案例 2：紧急修复流程\n\n```bash\n# 从 main 创建 hotfix\ngit checkout main\ngit checkout -b hotfix/payment-processing-error\n\n# 快速修复\ngit commit -m \"hotfix: fix payment gateway timeout\"\ngit push origin hotfix/payment-processing-error\n\n# 创建 PR 并快速审查\n# 合并后打标签\ngit checkout main\ngit tag -a v1.0.1 -m \"Hotfix: payment processing\"\n```\n\n## 最佳实践\n\n### 1. 频繁提交\n\n```bash\n# ✅ 好的做法\n小的、频繁的提交\ngit commit -m \"feat: add login form\"\ngit commit -m \"feat: add form validation\"\n\n# ❌ 不好的做法\n大的、不频繁的提交\ngit commit -m \"implement everything\"\n```\n\n### 2. 保持历史清洁\n\n```bash\n# 交互式变基\ngit rebase -i HEAD~3\n```\n\n### 3. 使用 .gitignore\n\n```bash\ndist/\nnode_modules/\n.env\n*.log\n.DS_Store\n```\n\n## 相关技能\n\n- [GitHub](https://github.com/) - Git 托管服务\n- [GitLab](https://about.gitlab.com/) - DevOps 平台\n- [Bitbucket](https://bitbucket.org/) - 代码托管',
    category: 'development',
    tags: ['Git', '工作流', '协作', 'PR', '版本控制'],
    difficulty: 'beginner',
    readTime: 14,
    author: 'OpenClaw Team',
    relatedSkills: ['skill-001', 'skill-440', 'skill-441'],
    stats: { viewCount: 0 },
    createdAt: '2026-02-09T00:00:00.000Z',
    featured: false
  }
];

// Add new tutorials to array
tutorials.push(...newTutorials);

// Write back to file
fs.writeFileSync('src/data/tutorials.json', JSON.stringify(tutorials, null, 2));

console.log('Added', newTutorials.length, 'new tutorials');
console.log('Total tutorials:', tutorials.length);
