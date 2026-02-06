// Add 4 new Beginner tutorials for US-093
const fs = require('fs');
const path = require('path');

const tutorialsPath = path.join(__dirname, '../../src/data/tutorials.json');
const tutorials = JSON.parse(fs.readFileSync(tutorialsPath, 'utf8'));

// Tutorial 053: Markdown 写作规范
const tutorial053 = {
  id: "tutorial-053",
  title: "Markdown 写作规范完全指南",
  slug: "markdown-writing-guide",
  description: "学习 Markdown 语法规范，掌握文档写作的最佳实践，创建清晰易读的技术文档。",
  content: `# Markdown 写作规范完全指南

Markdown 是一种轻量级标记语言，让你可以使用易读易写的纯文本格式编写文档。本教程将带你掌握 Markdown 语法规范和写作最佳实践。

## 什么是 Markdown？

### Markdown 的优势

- **简单易学**: 语法直观，几分钟即可上手
- **纯文本格式**: 任何文本编辑器都能编辑
- **版本控制友好**: 与 Git 完美配合
- **跨平台兼容**: 支持几乎所有平台
- **可转换性强**: 可轻松转换为 HTML、PDF 等格式

### Markdown 的应用场景

| 场景 | 说明 |
|------|------|
| 技术文档 | API 文档、开发指南 |
| 项目 README | 项目介绍和使用说明 |
| 博客文章 | 技术博客、教程 |
| 笔记整理 | 个人知识管理 |
| 协作文档 | 团队共享文档 |

## 基础语法

### 标题

使用 \`#\` 表示标题，一级标题最高，六级标题最低：

~~~
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
~~~

**最佳实践**:
- 每个文档只使用一个一级标题
- 标题层级不要跳跃（从 ## 直接跳到 ####）
- 标题要简短描述性

### 段落和换行

~~~
这是第一段。

这是第二段。

第一段后面加两个空格
可以强制换行。
~~~

### 强调

~~~
*斜体* 或 _斜体_
**粗体** 或 __粗体__
***粗斜体*** 或 ___粗斜体___
~~~

### 列表

#### 无序列表

~~~
- 项目 1
- 项目 2
  - 嵌套项目 2.1
  - 嵌套项目 2.2
- 项目 3
~~~

#### 有序列表

~~~
1. 第一步
2. 第二步
3. 第三步
~~~

### 代码

#### 行内代码

使用单个反引号包裹代码：

~~~
使用 \`console.log()\` 输出信息。
~~~

#### 代码块

使用三个反引号包裹代码块，可指定语言：

~~~javascript
function hello() {
    console.log("Hello, World!");
}
~~~

**支持的语言**: javascript, python, java, go, rust, bash, json, yaml, sql 等

### 引用

~~~
> 这是一段引用
>
> 可以包含多个段落
>
>> 嵌套引用
~~~

### 分隔线

~~~
---
***
___
~~~

## 链接和图片

### 链接

~~~
[链接文本](https://example.com)
[带标题的链接](https://example.com "鼠标悬停显示")
~~~

### 图片

~~~
![替代文本](https://example.com/image.jpg)
![带标题的图片](https://example.com/image.jpg "图片标题")
~~~

## 表格

### 基本表格

~~~
| 列 1 | 列 2 | 列 3 |
|------|------|------|
| 数据 1 | 数据 2 | 数据 3 |
| 数据 4 | 数据 5 | 数据 6 |
~~~

### 对齐方式

~~~
| 左对齐 | 居中 | 右对齐 |
|:-------|:----:|-------:|
| 内容 1 | 内容 2 | 内容 3 |
~~~

## 其他语法

### 任务列表

~~~
- [ ] 未完成任务
- [x] 已完成任务
- [ ] 子任务 1
- [x] 子任务 2
~~~

### 删除线

~~~
~~删除的文本~~
~~~

### HTML 标签

可以在 Markdown 中直接使用 HTML 标签：

~~~html
<details>
<summary>点击展开</summary>

这是隐藏的内容
</details>
~~~

## 文档结构规范

### README 结构

~~~markdown
# 项目名称

简短描述项目用途。

## 功能特性

- 特性 1
- 特性 2

## 安装

~~~bash
npm install project-name
~~~

## 使用方法

~~~javascript
const project = require('project-name');
project.run();
~~~

## API 文档

详细说明 API 接口...

## 贡献指南

如何贡献代码...

## 许可证

MIT
~~~

### 技术文档结构

~~~markdown
# 标题

简介部分

## 前置要求

需要的环境和工具...

## 快速开始

最简单的使用示例...

## 核心概念

关键概念解释...

## 使用指南

详细使用说明...

## API 参考

API 详细文档...

## 示例

实战示例...

## 常见问题

FAQ...

## 附录

补充信息...
~~~

## 写作最佳实践

### 1. 标题规范

- 每个 Markdown 文件应只有一个一级标题（#）
- 一级标题应该与文件名一致
- 标题使用描述性文字，避免"简介"、"概述"等模糊标题

**好的标题**:
~~~markdown
# OAuth 2.0 认证实现指南
~~~

**不好的标题**:
~~~markdown
# 简介
~~~

### 2. 列表规范

- 列表项应该是短语，不是完整句子
- 列表项使用平行结构（都是名词或都是动词）
- 列表项首字母小写（专有名词除外）

**好的列表**:
~~~markdown
- 配置环境变量
- 安装依赖包
- 启动开发服务器
~~~

### 3. 代码示例规范

- 所有代码示例都应该指定语言
- 代码示例应该完整可运行
- 关键代码添加注释说明
- 复杂示例先说明再展示代码

### 4. 链接规范

- 链接文本应该描述目标内容
- 避免使用"点击这里"、"这个链接"等模糊文本
- 外部链接应该检查有效性

**好的链接**:
~~~markdown
查看 [React 官方文档](https://react.dev) 了解更多信息。
~~~

**不好的链接**:
~~~markdown
[点击这里](https://react.dev) 查看更多信息。
~~~

## 工具和资源

### Markdown 编辑器

| 工具 | 平台 | 特点 |
|------|------|------|
| VS Code | 跨平台 | 强大、可定制 |
| Typora | 跨平台 | 所见即所得 |
| Obsidian | 跨平台 | 知识管理 |
| MarkText | 跨平台 | 开源免费 |

### 在线工具

- **StackEdit**: https://stackedit.io/
- **Dillinger**: https://dillinger.io/
- **Markdown It Demo**: https://markdown-it.github.io/

### 转换工具

~~~bash
# Markdown 转 PDF（使用 Pandoc）
pandoc input.md -o output.pdf

# Markdown 转 HTML
pandoc input.md -o output.html

# Markdown 转 DOCX
pandoc input.md -o output.docx
~~~

## GitHub Flavored Markdown (GFM)

GitHub 扩展了 Markdown 语法：

### 语法高亮

~~~javascript
const greeting = "Hello";
~~~

### 任务列表

- [x] 完成的任务
- [ ] 未完成的任务

### 表格

| 列 1 | 列 2 |
|------|------|
| 数据 | 数据 |

### 自动链接

https://github.com

### 删除线

~~删除的文本~~

## 常见问题

### Q: 如何转义特殊字符？

A: 使用反斜杠转义：\\\\\\\\\\*\\_\\#\\[\\]\\(\\)\\{\\}

### Q: 如何在代码块中显示反引号？

A: 使用更多反引号包裹，或使用波浪号~~~作为分隔符。

### Q: 表格不支持复杂格式怎么办？

A: 使用 HTML 表格或重新组织数据结构。

### Q: 不同平台渲染不一致怎么办？

A: 使用 CommonMark 标准语法，避免平台特有语法。

## 进阶技巧

### 自定义容器（部分平台支持）

::: tip 提示
这是一个提示信息
:::

::: warning 警告
这是一个警告信息
:::

### 目录（TOC）

~~~markdown
[[toc]]
~~~

### Emoji

:smile: :heart: :thumbsup:

## 相关技能

- [VS Code](/skills) - 强大的 Markdown 编辑器
- [Git](/skills/git) - 版本控制
- [文档写作](/skills/documentation) - 技术写作

## 参考资源

- [CommonMark 规范](https://spec.commonmark.org/)
- [GitHub Flavored Markdown 规范](https://github.github.com/gfm/)
- [Markdown 指南](https://www.markdownguide.org/)
- [Markdown 基础语法](https://markdown.com.cn/basic-syntax/)`
};

// Tutorial 054: YAML 配置文件
const tutorial054 = {
  id: "tutorial-054",
  title: "YAML 配置文件完全指南",
  slug: "yaml-configuration-guide",
  description: "学习 YAML 语法、数据结构、配置文件编写，掌握现代应用的配置管理。",
  content: `# YAML 配置文件完全指南

YAML（YAML Ain't Markup Language）是一种人类可读的数据序列化语言，广泛用于配置文件。本教程将带你全面掌握 YAML 语法和配置管理最佳实践。

## 什么是 YAML？

### YAML 的特点

- **人类可读**: 语法简洁直观
- **层次清晰**: 使用缩进表示层级关系
- **类型丰富**: 支持多种数据类型
- **注释友好**: 支持 \`#\` 注释
- **跨语言**: 被大多数编程语言支持

### YAML vs JSON vs TOML

| 特性 | YAML | JSON | TOML |
|------|------|------|------|
| 可读性 | 高 | 中 | 高 |
| 注释 | 支持 | 不支持 | 支持 |
| 复杂度 | 高 | 中 | 低 |
| 学习曲线 | 陡峭 | 平缓 | 平缓 |
| 适用场景 | 配置文件 | 数据交换 | 简单配置 |

### YAML 的应用场景

| 场景 | 示例 |
|------|------|
| CI/CD 配置 | GitHub Actions、GitLab CI |
| 容器编排 | Docker Compose、Kubernetes |
| 应用配置 | Spring Boot、Rails |
| 静态站点 | Jekyll、Hugo |
| API 规范 | OpenAPI/Swagger |

## 基础语法

### 注释

~~~yaml
# 这是单行注释

# 注释可以
# 跨越多行

key: value  # 行尾注释
~~~

### 键值对

~~~yaml
# 简单键值对
name: John Doe
age: 30
active: true

# 键中使用空格（需要引号）
"full name": John Doe
~~~

### 字符串

~~~yaml
# 不需要引号
string1: Hello World

# 单引号（严格转义）
string2: 'This is a string'

# 双引号（支持转义字符）
string3: "This is a string\\\\nwith newline"

# 多行字符串（保留换行）
multiline1: |
  Line 1
  Line 2
  Line 3

# 多行字符串（折叠换行）
multiline2: >
  This is a single
  long line that
  spans multiple lines
~~~

### 数字

~~~yaml
integer: 42
float: 3.14
negative: -10
exponential: 1.23e4
~~~

### 布尔值

~~~yaml
true1: true
true2: True
true3: yes
true4: on

false1: false
false2: False
false3: no
false4: off
~~~

### 空值

~~~yaml
null1: null
null2: Null
null3: ~
empty1:
empty2: ""
~~~

## 数据结构

### 列表/数组

~~~yaml
# 行内格式
fruits: [apple, banana, orange]

# 块格式
fruits:
  - apple
  - banana
  - orange

# 对象列表
users:
  - name: John
    age: 30
  - name: Jane
    age: 25
~~~

### 字典/对象

~~~yaml
# 行内格式
person: {name: John, age: 30}

# 块格式
person:
  name: John
  age: 30

# 嵌套对象
database:
  host: localhost
  port: 5432
  credentials:
    username: admin
    password: secret
~~~

## 高级特性

### 锚点和别名

~~~yaml
# 定义锚点
defaults: &defaults
  timeout: 30
  retries: 3

# 使用别名（引用）
service1:
  <<: *defaults
  url: http://service1.local

service2:
  <<: *defaults
  url: http://service2.local
  timeout: 60  # 覆盖默认值
~~~

### 多文档

~~~yaml
---
document: 1
---
document: 2
---
document: 3
~~~

## 实战案例

### 案例 1：Docker Compose

~~~yaml
version: '3.8'

services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
    depends_on:
      - api
    networks:
      - frontend

  api:
    build: ./api
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://db:5432/myapp
    depends_on:
      - db
    networks:
      - frontend
      - backend

  db:
    image: postgres:14
    environment:
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=myapp
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - backend

volumes:
  pgdata:

networks:
  frontend:
  backend:
~~~

### 案例 2：GitHub Actions

~~~yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: \\\${{ env.NODE_VERSION }}

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build application
        run: |
          npm ci
          npm run build

      - name: Deploy to production
        if: github.ref == 'refs/heads/main'
        run: npm run deploy
~~~

## 最佳实践

### 1. 缩进规范

- 使用空格缩进，不要使用 Tab
- 通常使用 2 个空格缩进
- 保持一致的缩进层级

### 2. 命名规范

~~~yaml
# 使用 kebab-case
database-url: postgresql://localhost

# 使用蛇形命名
database_url: postgresql://localhost

# 不要混用
~~~

### 3. 配置分层

~~~yaml
# 推荐：按功能分组
database:
  host: localhost
  port: 5432
cache:
  type: redis
  host: localhost
logging:
  level: info
~~~

### 4. 环境变量

~~~yaml
# 使用环境变量
database:
  url: \\\${DATABASE_URL}
  password: \\\${DB_PASSWORD}

# 提供默认值
timeout: \\\${TIMEOUT:-30}
~~~

## 常见问题

### Q: 缩进错误？

A: 确保使用空格而不是 Tab，保持缩进一致。

### Q: 特殊字符转义？

A: 使用引号包裹包含特殊字符的字符串。

### Q: 如何表示多行字符串？

A: 使用 \`|\` 保留换行，使用 \`>\` 折叠换行。

### Q: YAML 和 JSON 如何选择？

A: 需要注释和可读性用 YAML，需要简单数据交换用 JSON。

## 相关技能

- [Docker](/skills/docker) - 容器化配置
- [Kubernetes](/skills/kubernetes) - 容器编排
- [CI/CD](/skills/ci-cd) - 持续集成配置

## 参考资源

- [YAML 官方网站](https://yaml.org/)
- [YAML 规范 1.2.2](https://yaml.org/spec/1.2.2/)
- [YAML 初学者指南](https://learnxinyminutes.com/docs/yaml/)
- [Ansible YAML 语法](https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html)`
};

// Tutorial 055: JSON 数据格式
const tutorial055 = {
  id: "tutorial-055",
  title: "JSON 数据格式完全指南",
  slug: "json-data-format-guide",
  description: "全面掌握 JSON 数据格式、语法规则、数据操作和最佳实践。",
  content: `# JSON 数据格式完全指南

JSON（JavaScript Object Notation）是一种轻量级的数据交换格式，易于人类阅读和编写，同时也易于机器解析和生成。本教程将带你全面掌握 JSON 的各个方面。

## 什么是 JSON？

### JSON 的特点

- **轻量级**: 比 XML 更简洁
- **语言无关**: 几乎所有编程语言都支持
- **易读易写**: 语法简单直观
- **结构清晰**: 键值对和数组结构
- **广泛支持**: Web API、配置文件、数据存储

### JSON vs XML

| 特性 | JSON | XML |
|------|------|-----|
| 可读性 | 高 | 中 |
| 冗余度 | 低 | 高 |
| 解析速度 | 快 | 慢 |
| 数据类型 | 丰富 | 主要是文本 |
| 注释 | 不支持 | 支持 |

### JSON 的应用场景

| 场景 | 说明 |
|------|------|
| API 数据交换 | RESTful API 请求/响应 |
| 配置文件 | package.json、tsconfig.json |
| 数据存储 | MongoDB、NoSQL 数据库 |
| 日志文件 | 结构化日志 |
| 数据传输 | WebSocket、Ajax |

## JSON 语法

### 基本规则

- 数据使用键值对
- 数据由逗号分隔
- 大括号 \`{}\` 保存对象
- 方括号 \`[]\` 保存数组
- 键必须是字符串，使用双引号
- 最后一个元素后不能有逗号

### 数据类型

#### 字符串

~~~json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, \\"World\\"!",
  "unicode": "\\u0048\\u0065\\u006c\\u006c\\u006f"
}
~~~

**字符串转义序列**:

| 转义 | 含义 |
|------|------|
| \\" | 双引号 |
| \\\\ | 反斜杠 |
| \\n | 换行 |
| \\t | 制表符 |
| \\uXXXX | Unicode 字符 |

#### 数字

~~~json
{
  "integer": 42,
  "negative": -10,
  "float": 3.14,
  "exponential": 1.23e4
}
~~~

#### 布尔值

~~~json
{
  "isActive": true,
  "isDeleted": false
}
~~~

#### 空值

~~~json
{
  "middleName": null,
  "spouse": null
}
~~~

#### 对象

~~~json
{
  "person": {
    "name": "John Doe",
    "age": 30,
    "address": {
      "street": "123 Main St",
      "city": "New York"
    }
  }
}
~~~

#### 数组

~~~json
{
  "numbers": [1, 2, 3, 4, 5],
  "names": ["Alice", "Bob", "Charlie"],
  "mixed": [1, "two", true, null]
}
~~~

## 编程语言中的 JSON

### JavaScript

~~~javascript
// JSON 字符串转对象
const jsonString = '{"name": "John", "age": 30}';
const obj = JSON.parse(jsonString);

// 对象转 JSON 字符串
const person = { name: "John", age: 30 };
const json = JSON.stringify(person);

// 格式化输出
const formatted = JSON.stringify(person, null, 2);
~~~

### Python

~~~python
import json

# JSON 字符串转字典
json_string = '{"name": "John", "age": 30}'
data = json.loads(json_string)

# 字典转 JSON 字符串
person = {"name": "John", "age": 30}
json_str = json.dumps(person)

# 格式化输出
formatted = json.dumps(person, indent=2)
~~~

## JSON 配置文件

### package.json

~~~json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "A sample project",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "jest",
    "build": "webpack --mode production"
  },
  "dependencies": {
    "express": "^4.18.0",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "webpack": "^5.0.0"
  }
}
~~~

### tsconfig.json

~~~json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
~~~

## JSON 工具

### 在线工具

- **JSONLint**: https://jsonlint.com/ - JSON 验证
- **JSON Editor Online**: https://jsoneditoronline.org/ - 可视化编辑

### 命令行工具 (jq)

~~~bash
# 格式化输出
cat data.json | jq '.'

# 提取字段
cat data.json | jq '.name'

# 过滤数组
cat data.json | jq '.users[] | select(.age > 25)'
~~~

## 最佳实践

### 1. 命名规范

~~~json
{
  "firstName": "John",
  "lastName": "Doe",
  "isActive": true,
  "createdAt": "2024-02-06T10:00:00Z"
}
~~~

### 2. 日期处理

~~~json
{
  "createdAt": "2024-02-06T10:00:00Z",
  "updatedAt": "2024-02-06T10:00:00.123Z"
}
~~~

### 3. 空值处理

~~~json
{
  "middleName": null,
  "spouse": null
}
~~~

## 常见问题

### Q: JSON 支持注释吗？

A: 标准 JSON 不支持注释，但可以使用 JSON5 扩展格式。

### Q: 如何处理大文件？

A: 使用流式解析器，而不是一次性加载整个文件。

### Q: JSON vs JSONC vs JSON5？

A: JSONC 支持注释，JSON5 支持更多 ECMAScript 特性。

## 相关技能

- [RESTful API](/skills/rest-api) - API 设计
- [JavaScript](/skills/javascript) - Web 开发
- [Python](/skills/python) - 数据处理

## 参考资源

- [JSON 官方网站](https://www.json.org/)
- [RFC 8259 - JSON 规范](https://datatracker.ietf.org/doc/html/rfc8259)
- [JSON Schema](https://json-schema.org/)`
};

// Tutorial 056: API 设计基础
const tutorial056 = {
  id: "tutorial-056",
  title: "API 设计基础完全指南",
  slug: "api-design-basics",
  description: "学习 RESTful API 设计原则、最佳实践、安全性和文档编写，构建高质量 API。",
  content: `# API 设计基础完全指南

API（Application Programming Interface，应用程序接口）是现代软件架构的核心组件。本教程将带你掌握 API 设计的基础知识、最佳实践和常见模式。

## 什么是 API？

### API 的作用

- **接口定义**: 定义软件组件之间的交互方式
- **服务集成**: 连接不同的服务和系统
- **数据交换**: 在客户端和服务器之间传输数据
- **功能复用**: 暴露服务功能供其他应用使用

### API 类型

| 类型 | 说明 | 示例 |
|------|------|------|
| RESTful | 基于 HTTP 方法的资源导向 API | GitHub API |
| GraphQL | 查询语言，客户端精确获取数据 | GitHub GraphQL API |
| gRPC | 高性能 RPC 框架 | 微服务内部通信 |
| WebSocket | 全双工通信，实时数据推送 | 聊天应用 |
| Webhook | 事件驱动的 HTTP 回调 | GitHub 事件通知 |

## RESTful API 基础

### HTTP 方法

| 方法 | 操作 | 幂等性 | 安全性 |
|------|------|--------|--------|
| GET | 获取资源 | 是 | 是 |
| POST | 创建资源 | 否 | 否 |
| PUT | 完整更新资源 | 是 | 否 |
| PATCH | 部分更新资源 | 否 | 否 |
| DELETE | 删除资源 | 是 | 否 |

### URL 设计

~~~
# 资源命名使用名词，复数形式
GET    /api/users          # 获取用户列表
GET    /api/users/123      # 获取特定用户
POST   /api/users          # 创建用户
PUT    /api/users/123      # 完整更新用户
PATCH  /api/users/123      # 部分更新用户
DELETE /api/users/123      # 删除用户

# 嵌套资源
GET    /api/users/123/posts        # 获取用户的文章
POST   /api/users/123/posts        # 为用户创建文章
~~~

### 状态码

| 状态码 | 含义 | 使用场景 |
|--------|------|----------|
| 200 | OK | 请求成功 |
| 201 | Created | 资源创建成功 |
| 204 | No Content | 成功但无返回内容 |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未认证 |
| 403 | Forbidden | 无权限 |
| 404 | Not Found | 资源不存在 |
| 422 | Unprocessable Entity | 验证失败 |
| 500 | Internal Server Error | 服务器错误 |

## API 设计最佳实践

### 1. 版本控制

~~~
# URL 版本
https://api.example.com/v1/users
https://api.example.com/v2/users

# Header 版本
GET /api/users
Headers:
  API-Version: v1
~~~

### 2. 分页

~~~
# 基于偏移量的分页
GET /api/users?page=1&limit=20

# 响应格式
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  },
  "links": {
    "self": "/api/users?page=1",
    "next": "/api/users?page=2"
  }
}
~~~

### 3. 排序和筛选

~~~
# 排序
GET /api/users?sort=createdAt
GET /api/users?sort=-createdAt  # 降序

# 筛选
GET /api/users?status=active
GET /api/users?age_gte=18&age_lte=65
~~~

### 4. 字段选择

~~~
# 指定返回字段
GET /api/users?fields=id,name,email
~~~

## 请求和响应格式

### 成功响应

~~~json
{
  "data": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
~~~

### 错误响应

~~~json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
~~~

## API 安全性

### 1. 认证

#### Bearer Token

~~~http
GET /api/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
~~~

#### API Key

~~~http
GET /api/users
X-API-Key: your_api_key_here
~~~

### 2. HTTPS

始终使用 HTTPS 加密通信。

### 3. 输入验证

~~~javascript
// 示例：输入验证
function validateUser(data) {
  const errors = [];

  if (!data.name || data.name.length < 2) {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  if (!data.email || !/^[^@]+@[^@]+$/.test(data.email)) {
    errors.push({ field: 'email', message: 'Valid email is required' });
  }

  return errors;
}
~~~

### 4. 速率限制

~~~http
# 响应头
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1707207000

# 超限响应
HTTP/1.1 429 Too Many Requests
Retry-After: 3600
~~~

## API 文档

### OpenAPI 规范

~~~yaml
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0

paths:
  /users:
    get:
      summary: Get all users
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
      responses:
        '200':
          description: Successful response
    post:
      summary: Create user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                email:
                  type: string
                  format: email
~~~

## 测试 API

### 使用 curl

~~~bash
# GET 请求
curl https://api.example.com/users

# POST 请求
curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -d '{"name":"John","email":"john@example.com"}'

# 带认证
curl https://api.example.com/users \\
  -H "Authorization: Bearer your_token"
~~~

## 最佳实践总结

### 设计原则

1. **一致性**: 保持命名和结构一致
2. **简洁性**: 避免过度设计
3. **可预测性**: 遵循惯例
4. **文档完善**: 提供清晰的文档
5. **错误处理**: 提供有用的错误信息

### 命名规范

- URL 使用 kebab-case: \`/api/user-profiles\`
- JSON 使用 camelCase: \`{"firstName": "John"}\`
- HTTP 方法使用大写: GET, POST, PUT, DELETE

## 相关技能

- [RESTful API](/skills/rest-api) - REST API 开发
- [Node.js](/skills/nodejs) - 后端开发
- [Postman](/skills/postman) - API 测试

## 参考资源

- [REST API Tutorial](https://restfulapi.net/)
- [OpenAPI 规范](https://swagger.io/specification/)
- [API 设计指南](https://github.com/microsoft/api-guidelines)`
};

// Add tutorials to the array
tutorials.push(tutorial053, tutorial054, tutorial055, tutorial056);

// Save back to file
fs.writeFileSync(tutorialsPath, JSON.stringify(tutorials, null, 2), 'utf8');

console.log(`Added 4 new tutorials (Tutorial-053 to Tutorial-056)`);
console.log(`Total tutorials: ${tutorials.length}`);
