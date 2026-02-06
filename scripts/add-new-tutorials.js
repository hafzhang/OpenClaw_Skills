const fs = require('fs');

// Read existing tutorials
const tutorialsPath = './src/data/tutorials.json';
const data = fs.readFileSync(tutorialsPath, 'utf8');
const tutorials = JSON.parse(data);

// New tutorials to add - using proper JSON escaping
const newTutorials = [
  {
    "id": "tutorial-031",
    "title": "RESTful API 设计入门",
    "slug": "restful-api-design-basics",
    "description": "学习 RESTful API 设计的基本原则和最佳实践，掌握资源建模、HTTP 方法使用、状态码设计和 API 文档编写。",
    "content": "# RESTful API 设计入门\n\nRESTful API 是现代 Web 服务的核心，理解其设计原则对于构建可维护、可扩展的后端服务至关重要。\n\n## 什么是 REST？\n\nREST（Representational State Transfer）是一种软件架构风格，定义了一组约束条件和原则。遵循这些原则的 API 被称为 RESTful API。\n\n### 核心概念\n\n- **资源（Resource）**: API 的核心概念，使用 URI 唯一标识\n- **表现层（Representation）**: 资源的展示方式（JSON、XML 等）\n- **状态转移（State Transfer）**: 通过 HTTP 方法操作资源状态\n- **无状态（Stateless）**: 每个请求包含所有必要信息\n\n## RESTful 设计原则\n\n### 1. 资源命名规范\n\n#### 使用名词而非动词\n\n```bash\n# 错误：使用动词\nGET /getUsers\nPOST /createUser\nDELETE /deleteUser/1\n\n# 正确：使用名词\nGET /users\nPOST /users\nDELETE /users/1\n```\n\n#### 使用复数形式\n\n```bash\n# 推荐：使用复数\nGET /users\nGET /users/1\nGET /users/1/posts\n```\n\n#### 资源层级关系\n\n```bash\n# 一级资源\nGET /users\n\n# 二级资源（用户下的文章）\nGET /users/1/posts\nGET /users/1/posts/2\n\n# 三级资源（文章下的评论）\nGET /users/1/posts/2/comments\nGET /users/1/posts/2/comments/3\n```\n\n### 2. HTTP 方法正确使用\n\n#### 常用 HTTP 方法\n\n| 方法 | 操作 | 示例 | 幂等性 |\n|------|------|------|--------|\n| GET | 获取资源 | GET /users | 是 |\n| POST | 创建资源 | POST /users | 否 |\n| PUT | 完整更新 | PUT /users/1 | 是 |\n| PATCH | 部分更新 | PATCH /users/1 | 否 |\n| DELETE | 删除资源 | DELETE /users/1 | 是 |\n\n#### GET - 获取资源\n\n```bash\n# 获取所有用户\nGET /users\n\n# 获取特定用户\nGET /users/1\n\n# 带查询参数\nGET /users?page=1&limit=10\nGET /users?role=admin&status=active\n```\n\n#### POST - 创建资源\n\n```javascript\n// 创建新用户\nPOST /users\nContent-Type: application/json\n\n{\n  \"name\": \"Alice\",\n  \"email\": \"alice@example.com\",\n  \"role\": \"user\"\n}\n\n// 响应：201 Created\nLocation: /users/123\n\n{\n  \"id\": 123,\n  \"name\": \"Alice\",\n  \"email\": \"alice@example.com\",\n  \"role\": \"user\",\n  \"createdAt\": \"2026-02-06T10:00:00Z\"\n}\n```\n\n#### PUT - 完整更新资源\n\n```javascript\n// 完整更新用户（需提供所有字段）\nPUT /users/1\nContent-Type: application/json\n\n{\n  \"name\": \"Alice Updated\",\n  \"email\": \"alice.updated@example.com\",\n  \"role\": \"admin\"\n}\n```\n\n#### PATCH - 部分更新资源\n\n```javascript\n// 只更新邮箱\nPATCH /users/1\nContent-Type: application/json\n\n{\n  \"email\": \"newemail@example.com\"\n}\n```\n\n#### DELETE - 删除资源\n\n```bash\n# 删除用户\nDELETE /users/1\n\n# 响应：204 No Content（无响应体）\n```\n\n### 3. HTTP 状态码\n\n#### 成功响应（2xx）\n\n```bash\n# 200 OK - 请求成功\nGET /users/1\n\n# 201 Created - 资源创建成功\nPOST /users\n\n# 204 No Content - 成功但无返回内容\nDELETE /users/1\n```\n\n#### 客户端错误（4xx）\n\n```bash\n# 400 Bad Request - 请求参数错误\nPOST /users\n{\"name\": \"\"}  # 无效数据\n\n# 401 Unauthorized - 未认证\nGET /users\n# 缺少 Authorization 头\n\n# 403 Forbidden - 无权限\nDELETE /users/1\n# 用户无删除权限\n\n# 404 Not Found - 资源不存在\nGET /users/999\n\n# 409 Conflict - 资源冲突\nPOST /users\n{\"email\": \"existing@example.com\"}  # 邮箱已存在\n\n# 422 Unprocessable Entity - 语义错误\nPOST /users\n{\"age\": \"invalid\"}  # 年龄应为数字\n```\n\n## API 响应格式\n\n### 统一响应结构\n\n```json\n// 成功响应\n{\n  \"data\": {\n    \"id\": 1,\n    \"name\": \"Alice\"\n  },\n  \"meta\": {\n    \"timestamp\": \"2026-02-06T10:00:00Z\"\n  }\n}\n\n// 错误响应\n{\n  \"error\": {\n    \"code\": \"VALIDATION_ERROR\",\n    \"message\": \"Invalid email format\",\n    \"details\": {\n      \"field\": \"email\",\n      \"value\": \"invalid-email\"\n    }\n  }\n}\n\n// 列表响应（带分页）\n{\n  \"data\": [\n    {\"id\": 1, \"name\": \"Alice\"},\n    {\"id\": 2, \"name\": \"Bob\"}\n  ],\n  \"meta\": {\n    \"page\": 1,\n    \"limit\": 10,\n    \"total\": 100,\n    \"totalPages\": 10\n  }\n}\n```\n\n### 分页和过滤\n\n```bash\n# 分页参数\nGET /users?page=1&limit=10\n\n# 排序\nGET /users?sort=name&order=asc\n\n# 过滤\nGET /users?role=admin&status=active\n\n# 搜索\nGET /users?q=alice\n\n# 字段选择\nGET /users?fields=id,name,email\n```\n\n## 版本控制\n\n### URL 版本控制\n\n```bash\n# API 版本号在 URL 中\nGET /api/v1/users\nGET /api/v2/users\n```\n\n### Header 版本控制\n\n```bash\n# 使用自定义 header\nGET /api/users\nAccept: application/vnd.myapi.v1+json\n```\n\n## 实战案例：博客 API 设计\n\n### 资源结构\n\n```bash\n# 用户资源\nGET    /api/v1/users          # 获取用户列表\nPOST   /api/v1/users          # 创建用户\nGET    /api/v1/users/{id}     # 获取用户详情\nPUT    /api/v1/users/{id}     # 更新用户\nPATCH  /api/v1/users/{id}     # 部分更新用户\nDELETE /api/v1/users/{id}     # 删除用户\n\n# 文章资源\nGET    /api/v1/posts          # 获取文章列表\nPOST   /api/v1/posts          # 创建文章\nGET    /api/v1/posts/{id}     # 获取文章详情\nPUT    /api/v1/posts/{id}     # 更新文章\nDELETE /api/v1/posts/{id}     # 删除文章\n\n# 评论资源（嵌套）\nGET    /api/v1/posts/{id}/comments      # 获取文章评论\nPOST   /api/v1/posts/{id}/comments      # 创建评论\nDELETE /api/v1/posts/{id}/comments/{cid}  # 删除评论\n```\n\n### Node.js 实现\n\n```javascript\nconst express = require('express');\nconst app = express();\napp.use(express.json());\n\n// 模拟数据存储\nlet users = [\n  { id: 1, name: 'Alice', email: 'alice@example.com' },\n  { id: 2, name: 'Bob', email: 'bob@example.com' }\n];\nlet nextUserId = 3;\n\n// GET /users - 获取用户列表\napp.get('/api/v1/users', (req, res) => {\n  const { page = 1, limit = 10 } = req.query;\n  const startIndex = (page - 1) * limit;\n  const endIndex = startIndex + parseInt(limit);\n  \n  const paginatedUsers = users.slice(startIndex, endIndex);\n  \n  res.json({\n    data: paginatedUsers,\n    meta: {\n      page: parseInt(page),\n      limit: parseInt(limit),\n      total: users.length,\n      totalPages: Math.ceil(users.length / limit)\n    }\n  });\n});\n\n// GET /users/:id - 获取用户详情\napp.get('/api/v1/users/:id', (req, res) => {\n  const user = users.find(u => u.id === parseInt(req.params.id));\n  \n  if (!user) {\n    return res.status(404).json({\n      error: {\n        code: 'NOT_FOUND',\n        message: 'User not found'\n      }\n    });\n  }\n  \n  res.json({ data: user });\n});\n\n// POST /users - 创建用户\napp.post('/api/v1/users', (req, res) => {\n  const { name, email } = req.body;\n  \n  if (!name || !email) {\n    return res.status(400).json({\n      error: {\n        code: 'VALIDATION_ERROR',\n        message: 'Name and email are required'\n      }\n    });\n  }\n  \n  if (users.find(u => u.email === email)) {\n    return res.status(409).json({\n      error: {\n        code: 'CONFLICT',\n        message: 'Email already exists'\n      }\n    });\n  }\n  \n  const newUser = {\n    id: nextUserId++,\n    name,\n    email,\n    createdAt: new Date().toISOString()\n  };\n  \n  users.push(newUser);\n  \n  res.status(201)\n     .set('Location', `/api/v1/users/${newUser.id}`)\n     .json({ data: newUser });\n});\n\n// DELETE /users/:id - 删除用户\napp.delete('/api/v1/users/:id', (req, res) => {\n  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));\n  \n  if (userIndex === -1) {\n    return res.status(404).json({\n      error: {\n        code: 'NOT_FOUND',\n        message: 'User not found'\n      }\n    });\n  }\n  \n  users.splice(userIndex, 1);\n  res.status(204).send();\n});\n\napp.listen(3000, () => {\n  console.log('API server running on port 3000');\n});\n```\n\n## 常见问题 (FAQ)\n\n### Q: PUT 和 PATCH 有什么区别？\n\nA: PUT 用于完整替换资源，PATCH 用于部分更新。\n\n### Q: 什么时候返回 404 vs 401 vs 403？\n\nA: \n- 404: 资源不存在\n- 401: 未提供认证信息\n- 403: 已认证但无权限\n\n### Q: 如何处理嵌套资源？\n\nA: 最多嵌套 3 层，超过则使用查询参数。\n\n```bash\n# 推荐\nGET /users/1/posts/2/comments\n\n# 避免\nGET /users/1/posts/2/comments/3/replies/4/likes\n\n# 改进\nGET /comments?post=2&user=1\n```\n\n## 相关技能\n\n- [Node.js](/skills/nodejs) - 服务端 JavaScript 开发\n- [Python](/skills/python) - Python Web 开发\n- [HTTP Server](/skills/http-server) - HTTP 服务器配置\n\n## 参考资源\n\n- [REST API Tutorial](https://restfulapi.net)\n- [OpenAPI Specification](https://swagger.io/specification)\n- [MDN Web Docs - HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP)",
    "category": "development",
    "tags": [
      "API",
      "REST",
      "后端",
      "HTTP",
      "入门"
    ],
    "difficulty": "beginner",
    "readTime": 12,
    "author": "OpenClaw Team",
    "relatedSkills": [
      "skill-002",
      "skill-023",
      "skill-034"
    ],
    "stats": {
      "viewCount": 120
    },
    "createdAt": "2026-02-06T00:00:00Z",
    "featured": true
  }
];

// Append new tutorials
tutorials.push(...newTutorials);

// Write back
fs.writeFileSync(tutorialsPath, JSON.stringify(tutorials, null, 2), 'utf8');

console.log(`Added ${newTutorials.length} new tutorials. Total: ${tutorials.length}`);
