// Script to add 5 new Beginner tutorials for Phase 6 Sprint 9.2
const fs = require('fs');
const path = require('path');

const tutorialsDir = path.join(__dirname, '../../src/data');
const tutorialsFile = path.join(tutorialsDir, 'tutorials.json');

// Read existing tutorials
const tutorials = JSON.parse(fs.readFileSync(tutorialsFile, 'utf-8'));

// Find the max tutorial number
const maxNum = tutorials.map(t => parseInt(t.id.split('-')[1])).reduce((a, b) => Math.max(a, b), 0);

const newTutorials = [
  {
    id: `tutorial-${maxNum + 1}`,
    title: "Markdown写作规范与最佳实践",
    slug: "markdown-writing-best-practices",
    description: "全面掌握Markdown写作规范，学习如何在技术文档、README文件和博客中写出清晰规范的Markdown内容。",
    content: `# Markdown写作规范与最佳实践

Markdown是一种轻量级标记语言，广泛用于技术文档、README文件和博客写作。本教程将教你如何写出清晰、规范、易读的Markdown内容。

## 为什么选择Markdown？

Markdown的优势：

- **简洁易学**: 语法简单，几分钟即可上手
- **广泛支持**: GitHub、Reddit、Discord等平台都支持
- **版本控制友好**: 纯文本格式，Git diff友好
- **可转换性强**: 可轻松转换为HTML、PDF等格式
- **专注内容**: 让你专注于写作而非格式

## 基础语法规范

### 标题层级

正确使用标题层级对文档结构至关重要：

\`\`\`markdown
# 一级标题 - 文档标题
## 二级标题 - 主要章节
### 三级标题 - 子章节
#### 四级标题 - 小节
##### 五级标题 - 细节
###### 六级标题 - 最小层级
\`\`\`

**最佳实践**:
- 每个文档只有一个一级标题
- 标题层级不要跳过（如从一级直接跳到三级）
- 标题要简洁明确，反映内容主题
- 标题长度建议在50字符以内

### 文本格式

\`\`\`markdown
**粗体文本** 或 __粗体文本__
*斜体文本* 或 _斜体文本_
***粗斜体文本*** 或 ___粗斜体文本___
~~删除线~~
\`行内代码\`
\`\`\`
**粗体** - 强调重要内容
*斜体* - 表示术语或引用
~~删除线~~ - 标记过时内容

### 列表规范

#### 无序列表

\`\`\`markdown
- 项目一
- 项目二
  - 嵌套项目一
  - 嵌套项目二
- 项目三
\`\`\`

#### 有序列表

\`\`\`markdown
1. 第一步
2. 第二步
3. 第三步
\`\`\`

**最佳实践**:
- 列表项之间保持逻辑一致性
- 嵌套层级不超过3层
- 每个列表项保持简洁
- 有序列表用于步骤，无序列表用于并列内容

### 链接规范

\`\`\`markdown
[链接文本](URL)
[链接文本](URL "鼠标悬停提示")
\`\`\`

**最佳实践**:
- 链接文本要描述性，避免"点击这里"
- 外部链接注明来源或作者
- 长URL使用引用式链接：

\`\`\`markdown
[详细文档][doc-link]

[doc-link]: https://example.com/very/long/url
\`\`\`

### 图片规范

\`\`\`markdown
![替代文本](图片URL)
![替代文本](图片URL "图片标题")
\`\`\`

**最佳实践**:
- 替代文本（Alt）描述图片内容
- 图片标题提供额外说明
- 控制图片尺寸，避免过大
- 使用相对路径指向本地图片

## 代码块规范

### 行内代码

使用反引号包裹代码片段：

\`\`\`markdown
使用 \`npm install\` 命令安装依赖。
在 \`package.json\` 中配置脚本。
\`\`\`

### 代码块

使用三个反引号创建代码块，指定语言：

\`\`\`\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`\`\`\`

### 代码块最佳实践

\`\`\`\`\`\`bash
# Shell命令 - 添加注释说明
npm install

# 启动开发服务器
npm run dev
\`\`\`\`\`\`

**语法高亮支持的语言**:
- \`javascript\`, \`typescript\` - JS/TS代码
- \`python\`, \`java\`, \`go\` - 后端语言
- \`bash\`, \`sh\`, \`powershell\` - Shell脚本
- \`json\`, \`yaml\`, \`xml\` - 配置文件
- \`markdown\`, \`html\`, \`css\` - Web技术

## 表格规范

### 基本表格

\`\`\`markdown
| 姓名 | 角色 | 邮箱 |
|------|------|------|
| 张三 | 开发 | zhang@example.com |
| 李四 | 设计 | li@example.com |
\`\`\`

### 对齐方式

\`\`\`markdown
| 左对齐 | 居中对齐 | 右对齐 |
|:-------|:--------:|-------:|
| Left   | Center   | Right  |
| 数据1  | 数据2    | 数据3  |
\`\`\`

**最佳实践**:
- 表格要有清晰的表头
- 列数不超过6列（手机端显示）
- 复杂数据考虑用代码块或列表
- 添加说明文字解释表格内容

## 引用规范

\`\`\`markdown
> 这是一段引用文本
>
> > 可以嵌套引用
>
> -- 作者，来源
\`\`\`

**使用场景**:
- 引用他人观点
- 突出重要提示
- 说明注意事项

## 分隔线

\`\`\`markdown
---
***
___
\`\`\`

**使用场景**:
- 分隔主要内容
- 标记章节边界
- 不要过度使用

## GitHub Flavored Markdown (GFM)

### 任务列表

\`\`\`markdown
- [x] 已完成的任务
- [ ] 未完成的任务
- [ ] 待办事项
\`\`\`

### 代码块语法高亮

\`\`\`\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com'
};
\`\`\`\`\`\`

### 表格（已包含）

### 自动链接

\`\`\`markdown
https://github.com/openclaw/skills
\`\`\`

## 技术文档写作规范

### README结构模板

\`\`\`markdown
# 项目名称

简短的项目描述（一句话说明项目用途）

## 功能特性

- 特性一
- 特性二
- 特性三

## 安装

\`\`\`bash
npm install project-name
\`\`\`

## 快速开始

\`\`\`javascript
const project = require('project-name');

project.init();
\`\`\`

## API文档

### methodOne(param1, param2)

描述方法功能。

**参数**:
- \`param1\` (string): 参数说明
- \`param2\` (number): 参数说明

**返回值**: 返回值说明

**示例**:
\`\`\`javascript
const result = project.methodOne('test', 123);
\`\`\`

## 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| option1 | boolean | true | 选项说明 |

## 常见问题

### Q: 问题标题？

A: 问题答案

## 贡献指南

欢迎贡献代码！请查看 [CONTRIBUTING.md](CONTRIBUTING.md)

## 许可证

MIT License
\`\`\`

### 代码注释规范

在代码块中添加注释：

\`\`\`\`\`\`javascript
// 导入必要的模块
const fs = require('fs');

/**
 * 读取并解析JSON文件
 * @param {string} filePath - 文件路径
 * @returns {Object} 解析后的JSON对象
 */
function readJsonFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

// 读取配置文件
const config = readJsonFile('./config.json');
\`\`\`\`\`\`

## 文档质量检查清单

发布前检查：

- [ ] 所有链接有效
- [ ] 代码示例可运行
- [ ] 图片加载正常
- [ ] 标题层级正确
- [ ] 没有拼写错误
- [ ] 格式统一规范
- [ ] 移动端显示正常
- [ ] 语法高亮正确

## 常用工具

### 编辑器

- **VS Code**: 安装Markdown All in One扩展
- **Typora**: 所见即所得编辑器
- **Obsidian**: 知识管理工具

### 预览工具

- **VS Code**: Ctrl/Cmd + Shift + V
- **GitHub**: 直接预览
- **Markdown Preview Plus**: 浏览器扩展

### Lint工具

\`\`\`bash
# 安装markdownlint
npm install -g markdownlint-cli

# 检查文档
markdownlint README.md
\`\`\`

## 高级技巧

### 自定义容器

\`\`\`markdown
::: tip 提示
这是一个提示信息
:::

::: warning 警告
这是一个警告信息
:::

::: danger 危险
这是一个危险操作警告
:::
\`\`\`

### 脚注

\`\`\`markdown
这是一段文字，包含脚注[^1]。

[^1]: 脚注内容
\`\`\`

### 定义列表

\`\`\`markdown
术语一
:   定义一

术语二
:   定义二
\`\`\`

## 实战案例

### 案例1：API文档

\`\`\`markdown
# 用户API

## 获取用户信息

\`GET /api/users/:id\`

获取指定ID的用户信息。

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 用户ID |

**响应示例**:

\`\`\`json
{
  "id": 1,
  "name": "张三",
  "email": "zhang@example.com"
}
\`\`\`

**错误响应**:

\`\`\`json
{
  "error": "User not found"
}
\`\`\`
\`\`\`

### 案例2：教程文档

\`\`\`markdown
# Node.js入门教程

## 简介

Node.js是一个基于Chrome V8引擎的JavaScript运行时。

## 安装

\`\`\`bash
# 使用nvm安装（推荐）
nvm install node

# 验证安装
node --version
npm --version
\`\`\`

## Hello World

创建 \`app.js\` 文件：

\`\`\`javascript
console.log('Hello, World!');
\`\`\`

运行：

\`\`\`bash
node app.js
\`\`\`

> **提示**: 使用 \`nodemon\` 可以自动重启服务器

## 下一步

- 学习[异步编程](/tutorial/async-programming)
- 了解[Express框架](/tutorial/express)
\`\`\`

## 性能优化

### 图片优化

- 使用WebP格式
- 压缩图片大小
- 使用CDN加速

### 代码块优化

- 避免过长的代码块
- 使用折叠语法

\`\`\`\`\`\`javascript
// 折叠的代码块
// 点击展开查看完整代码
\`\`\`\`\`\`

## 相关技能

- [VS Code](/skills) - 代码编辑器
- [Git](/skills) - 版本控制
- [GitHub](/skills) - 代码托管

## 参考资源

- [Markdown官方规范](https://spec.commonmark.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- [Markdown Guide](https://www.markdownguide.org/)`
    ,
    category: "development",
    tags: ["Markdown", "写作", "文档", "基础"],
    difficulty: "beginner",
    readTime: 12,
    author: "OpenClaw Team",
    relatedSkills: ["skill-001", "skill-021"],
    stats: { viewCount: 0 },
    createdAt: new Date().toISOString(),
    featured: false
  },
  {
    id: `tutorial-${maxNum + 2}`,
    title: "正则表达式入门指南",
    slug: "regular-expressions-getting-started",
    description: "从零开始学习正则表达式，掌握文本匹配、搜索和替换的强大工具。",
    content: `# 正则表达式入门指南

正则表达式（Regular Expression，简称Regex）是一种强大的文本模式匹配工具。本教程将带你从零开始学习正则表达式。

## 什么是正则表达式？

正则表达式是一种描述文本模式的特殊字符串，用于：

- **验证**: 检查输入是否符合格式要求（如邮箱、电话号码）
- **搜索**: 在文本中查找特定模式
- **替换**: 批量替换符合模式的文本
- **提取**: 从文本中提取需要的信息

### 实际应用场景

\`\`\`javascript
// 验证邮箱格式
const emailRegex = /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/;

// 提取URL中的域名
const urlRegex = /https?:\\/\\/([^\\/]+)/;

// 替换多余的空格
const cleanText = text.replace(/\\s+/g, ' ');
\`\`\`

## 基础语法

### 字符匹配

#### 字面字符

匹配字符本身：

\`\`\`regex
hello    // 匹配 "hello"
123      // 匹配 "123"
@        // 匹配 "@"
\`\`\`

#### 通配符 .

\`\`\`regex
.     // 匹配任意单个字符（除换行符）
..    // 匹配任意两个字符
\`\`\`

#### 字符集 []

\`\`\`regex
[abc]   // 匹配 a、b 或 c
[a-z]   // 匹配任意小写字母
[A-Z]   // 匹配任意大写字母
[0-9]   // 匹配任意数字
[a-zA-Z0-9]  // 匹配任意字母数字

[^abc]  // 匹配除 a、b、c 之外的字符
[^0-9]  // 匹配非数字字符
\`\`\`

### 预定义字符类

\`\`\`regex
\\d     // 数字，等同于 [0-9]
\\D     // 非数字，等同于 [^0-9]
\\w     // 单词字符（字母、数字、下划线），等同于 [a-zA-Z0-9_]
\\W     // 非单词字符
\\s     // 空白字符（空格、制表符、换行符）
\\S     // 非空白字符
\`\`\`

### 量词

\`\`\`regex
*      // 匹配0次或多次
+      // 匹配1次或多次
?      // 匹配0次或1次
{n}    // 匹配恰好 n 次
{n,}   // 匹配至少 n 次
{n,m}  // 匹配 n 到 m 次
\`\`\`

**示例**：

\`\`\`regex
\\d*      // 0个或多个数字
\\d+      // 1个或多个数字
\\d?      // 0个或1个数字
\\d{3}    // 恰好3个数字
\\d{3,}   // 至少3个数字
\\d{3,5}  // 3到5个数字
\`\`\`

## 边界匹配

\`\`\`regex
^        // 字符串开始
$        // 字符串结束
\\b       // 单词边界
\\B       // 非单词边界
\`\`\`

**示例**：

\`\`\`regex
^hello   // 以hello开头
world$   // 以world结尾
\\bcat\\b  // 匹配完整单词"cat"，不会匹配"category"
\`\`\`

## 分组和引用

### 捕获分组 ()

\`\`\`regex
(abc)    // 捕获"abc"作为一组
(ab)+    // 捕获"ab"重复1次或多次
\`\`\`

### 非捕获分组 (?:)

\`\`\`regex
(?:abc)+  // 不捕获，仅用于分组
\`\`\`

### 引用 \\1、\\2

\`\`\`regex
(\\w+)\\s+\\1   // 匹配重复的单词："hello hello"
\`\`\`

## 字符转义

如果要匹配特殊字符，需要使用反斜杠转义：

\`\`\`regex
\\$       // 匹配 "$"
\\.       // 匹配 "."
\\\\      // 匹配 "\\"
\\*       // 匹配 "*"
\\+       // 匹配 "+"
\\?       // 匹配 "?"
\\|       // 匹配 "|"
\\[       // 匹配 "["
\\]       // 匹配 "]"
\\(       // 匹配 "("
\\)       // 匹配 ")"
\`\`\`

## 常用模式

### 邮箱验证

\`\`\`regex
^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$
\`\`\`

### 手机号（中国大陆）

\`\`\`regex
^1[3-9]\\d{9}$
\`\`\`

### URL匹配

\`\`\`regex
https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)
\`\`\`

### 日期格式

\`\`\`regex
\\d{4}-\\d{2}-\\d{2}      // YYYY-MM-DD
\\d{4}/\\d{2}/\\d{2}      // YYYY/MM/DD
\`\`\`

### IPv4地址

\`\`\`regex
^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$
\`\`\`

### 十六进制颜色

\`\`\`regex
^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$
\`\`\`

## JavaScript中的正则表达式

### 创建方式

\`\`\`javascript
// 方式1：字面量
const regex1 = /\\d+/;

// 方式2：构造函数
const regex2 = new RegExp('\\\\d+');

// 带标志
const regex3 = /\\d+/g;  // 全局匹配
const regex4 = /\\d+/i;  // 忽略大小写
const regex5 = /\\d+/m;  // 多行模式
\`\`\`

### 常用方法

#### test() - 测试匹配

\`\`\`javascript
const regex = /^\\d{11}$/;

console.log(regex.test('13800138000'));  // true
console.log(regex.test('abc'));          // false
\`\`\`

#### match() - 提取匹配

\`\`\`javascript
const text = '我的手机号是13800138000，座机是010-12345678';
const phoneRegex = /\\d{11}|\\d{3}-\\d{8}/g;

const phones = text.match(phoneRegex);
console.log(phones);  // ['13800138000', '010-12345678']
\`\`\`

#### replace() - 替换

\`\`\`javascript
// 简单替换
const text1 = 'Hello World';
console.log(text1.replace(/World/, 'Regex'));  // 'Hello Regex'

// 使用$1引用分组
const text2 = 'John Smith';
console.log(text2.replace(/(\\w+)\\s+(\\w+)/, '$2, $1'));  // 'Smith, John'

// 使用函数替换
const text3 = 'price: 100, tax: 20';
const result = text3.replace(/\\d+/g, (match) => {
  return parseInt(match) * 1.1;
});
console.log(result);  // 'price: 110, tax: 22'
\`\`\`

#### split() - 分割

\`\`\`javascript
const text = 'apple,banana;orange:grape';
const fruits = text.split(/[,;]/);
console.log(fruits);  // ['apple', 'banana', 'orange:grape']
\`\`\`

#### search() - 查找位置

\`\`\`javascript
const text = 'Hello World';
console.log(text.search(/World/));  // 6
console.log(text.search(/Regex/));  // -1
\`\`\`

## 实战案例

### 案例1：表单验证

\`\`\`javascript
// 验证用户名：4-16位字母数字下划线
function validateUsername(username) {
  const regex = /^[a-zA-Z0-9_]{4,16}$/;
  return regex.test(username);
}

// 验证密码：至少8位，包含字母和数字
function validatePassword(password) {
  const regex = /^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*#?&]{8,}$/;
  return regex.test(password);
}

// 验证邮箱
function validateEmail(email) {
  const regex = /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/;
  return regex.test(email);
}

// 使用
console.log(validateUsername('john_doe123'));  // true
console.log(validatePassword('Pass1234'));     // true
console.log(validateEmail('test@example.com')); // true
\`\`\`

### 案例2：提取数据

\`\`\`javascript
// 从日志中提取日期和错误信息
const log = \`
[2024-01-15 10:30:00] ERROR: Database connection failed
[2024-01-15 10:31:00] INFO: Retry attempt 1
[2024-01-15 10:32:00] ERROR: Connection timeout
\`;

const logRegex = /\\[(\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2})\\]\\s+(\\w+):\\s+(.+)/g;
let match;

while ((match = logRegex.exec(log)) !== null) {
  console.log({
    timestamp: match[1],
    level: match[2],
    message: match[3]
  });
}
\`\`\`

### 案例3：清理数据

\`\`\`javascript
// 清理多余空格
function cleanSpaces(str) {
  return str.replace(/\\s+/g, ' ').trim();
}

// 移除HTML标签
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '');
}

// 统一引号
function normalizeQuotes(str) {
  return str.replace(/[""''"]/g, '"');
}

// 使用
console.log(cleanSpaces('Hello    World'));  // 'Hello World'
console.log(stripHtml('<p>Hello <b>World</b></p>'));  // 'Hello World'
console.log(normalizeQuotes('Hello "World"'));  // 'Hello "World"'
\`\`\`

### 案例4：URL参数解析

\`\`\`javascript
function parseUrlParams(url) {
  const params = {};
  const regex = /[?&]([^=]+)=([^&]*)/g;
  let match;

  while ((match = regex.exec(url)) !== null) {
    params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
  }

  return params;
}

const url = 'https://example.com/search?q=regex&page=1&lang=zh';
console.log(parseUrlParams(url));
// { q: 'regex', page: '1', lang: 'zh' }
\`\`\`

## 性能优化

### 避免回溯

\`\`\`regex
// 不好：可能导致回溯问题
^([a-z]+)*$

// 更好：明确限定
^[a-z]*$
\`\`\`

### 使用非捕获分组

\`\`\`regex
// 不好：捕获不需要的分组
(\\d{4})-(\\d{2})-(\\d{2})

// 更好：不捕获
(?:\\d{4})-(?:\\d{2})-(?:\\d{2})
\`\`\`

### 使用原子分组（部分支持）

\`\`\`regex
(?>\\d+)-\\w+
\`\`\`

## 调试技巧

### 在线工具

- **Regex101**: https://regex101.com/
- **RegExr**: https://regexr.com/
- **Debuggex**: https://www.debuggex.com/

### 测试方法

\`\`\`javascript
// 创建测试函数
function testRegex(regex, tests) {
  tests.forEach(({ input, expected, description }) => {
    const result = regex.test(input);
    const status = result === expected ? '✓' : '✗';
    console.log(\`\${status} \${description}\`);
    console.log(\`  Input: \${input}\`);
    console.log(\`  Expected: \${expected}, Got: \${result}\\n\`);
  });
}

// 使用测试函数
const emailRegex = /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/;

testRegex(emailRegex, [
  { input: 'test@example.com', expected: true, description: 'Valid email' },
  { input: 'invalid', expected: false, description: 'Invalid email' },
  { input: 'test@', expected: false, description: 'Missing domain' }
]);
\`\`\`

## 常见陷阱

### 1. 忘记转义

\`\`\`javascript
// 错误：匹配任意字符
const regex1 = /./;

// 正确：匹配点
const regex2 = /\\./;
\`\`\`

### 2. 贪婪匹配

\`\`\`javascript
const html = '<div>First</div><div>Second</div>';

// 贪婪：匹配到最后的</div>
const greedy = /<div>.*<\\/div>/;
console.log(html.match(greedy)[0]);
// '<div>First</div><div>Second</div>'

// 非贪婪：匹配第一个</div>
const lazy = /<div>.*?<\\/div>/;
console.log(html.match(lazy)[0]);
// '<div>First</div>'
\`\`\`

### 3. 忘记全局标志

\`\`\`javascript
const text = 'a1b2c3';

// 只匹配第一个
console.log(text.match(/\\d/));  // ['1']

// 匹配所有
console.log(text.match(/\\d/g));  // ['1', '2', '3']
\`\`\`

## 快速参考

| 模式 | 说明 | 示例 |
|------|------|------|
| \`\\d\` | 数字 | \`\\d+\` 匹配多个数字 |
| \`\\w\` | 单词字符 | \`\\w+\` 匹配单词 |
| \`\\s\` | 空白字符 | \`\\s+\` 匹配多个空格 |
| \`^\` | 字符串开始 | \`^Hello\` |
| \`$\` | 字符串结束 | \`World$\` |
| \`*\` | 0次或多次 | \`a*\` |
| \`+\` | 1次或多次 | \`a+\` |
| \`?\` | 0次或1次 | \`a?\` |
| \`{n}\` | 恰好n次 | \`\\d{4}\` |
| \`[]\` | 字符集 | \`[abc]\` |
| \`()\` | 分组 | \`(abc)+\` |
| \`\\|\` | 或 | \`a\\|b\` |

## 相关技能

- [JavaScript](/skills) - JavaScript编程
- [Python](/skills) - Python中的re模块
- [VS Code](/skills) - 正则表达式测试插件

## 参考资源

- [MDN - 正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions)
- [RegexOne - 交互式教程](https://regexone.com/)
- [Learn Regex the Easy Way](https://github.com/ziishaned/learn-regex)`
    ,
    category: "development",
    tags: ["正则表达式", "JavaScript", "文本处理", "基础"],
    difficulty: "beginner",
    readTime: 15,
    author: "OpenClaw Team",
    relatedSkills: ["skill-001", "skill-012"],
    stats: { viewCount: 0 },
    createdAt: new Date().toISOString(),
    featured: false
  },
  {
    id: `tutorial-${maxNum + 3}`,
    title: "数据库索引基础与优化",
    slug: "database-index-basics",
    description: "深入理解数据库索引原理，学习如何创建高效索引来提升查询性能。",
    content: `# 数据库索引基础与优化

数据库索引是提升查询性能的核心技术。本教程将带你深入理解索引原理、类型和优化策略。

## 什么是索引？

索引是对数据库表中一列或多列的值进行排序的一种结构，类似于书籍的目录。

### 索引的作用

- **加速查询**: 快速定位数据，避免全表扫描
- **优化排序**: 使用索引的有序性
- **强制唯一**: 唯一索引保证数据唯一性

### 索引的代价

- **存储空间**: 索引需要额外的磁盘空间
- **写入性能**: INSERT/UPDATE/DELETE需要维护索引
- **维护成本**: 索引越多，维护越复杂

## 索引原理

### B-Tree索引

B-Tree（平衡树）是最常用的索引结构：

\`\`\`
┌─────────────┐
│     50      │  根节点
└─────────────┘
      │
  ┌───┴────┬─────┐
  ▼        ▼     ▼
┌────┐  ┌────┐  ┌────┐
│ 25 │  │ 75 │  │100 │  内部节点
└────┘  └────┘  └────┘
  │       │
  ▼       ▼
┌──┬──┐  ┌──┬──┐
│10│35│  │60│85│  叶子节点
└──┴──┘  └──┴──┘
\`\`\`

**特点**：
- 保持树的平衡
- 查询时间复杂度O(log n)
- 范围查询高效
- 适合>、<、BETWEEN等操作

### Hash索引

基于哈希表的索引：

\`\`\`
Hash Function
     │
     ▼
┌─────────────┐
│  Bucket 1   │ → Data1, Data2
├─────────────┤
│  Bucket 2   │ → Data3
├─────────────┤
│  Bucket 3   │ → Data4, Data5
└─────────────┘
\`\`\`

**特点**：
- 精确匹配O(1)
- 不支持范围查询
- 不支持排序
- 适合=、IN操作

## 索引类型

### 主键索引 (PRIMARY KEY)

\`\`\`sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);

-- 或已存在表添加
ALTER TABLE users ADD PRIMARY KEY (id);
\`\`\`

**特点**：
- 唯一且非空
- 一个表只能有一个
- 自动创建聚集索引

### 唯一索引 (UNIQUE)

\`\`\`sql
CREATE UNIQUE INDEX idx_email ON users(email);

-- 或建表时定义
CREATE TABLE users (
    id INT PRIMARY KEY,
    email VARCHAR(100) UNIQUE
);
\`\`\`

**特点**：
- 保证值唯一
- 可以有多个唯一索引
- 允许NULL值（多个）

### 普通索引 (INDEX)

\`\`\`sql
CREATE INDEX idx_name ON users(name);

-- 多列索引
CREATE INDEX idx_name_email ON users(name, email);
\`\`\`

### 全文索引 (FULLTEXT)

\`\`\`sql
CREATE FULLTEXT INDEX idx_content ON articles(content);

-- 使用
SELECT * FROM articles
WHERE MATCH(content) AGAINST('search term');
\`\`\`

## 索引设计原则

### 选择合适的列

**适合索引的列**：
- WHERE子句中频繁使用的列
- JOIN条件的列
- ORDER BY、GROUP BY的列
- 高选择性的列（唯一值多）

**不适合索引的列**：
- 频繁更新的列
- 数据重复度高的列（如性别）
- BLOB、TEXT等大字段
- 很少查询的列

### 单列索引 vs 组合索引

\`\`\`sql
-- 单列索引
CREATE INDEX idx_name ON users(name);
CREATE INDEX idx_age ON users(age);

-- 组合索引
CREATE INDEX idx_name_age ON users(name, age);
\`\`\`

**组合索引最左前缀原则**：

\`\`\`sql
-- 创建索引
CREATE INDEX idx_a_b_c ON table(a, b, c);

-- 使用索引的查询
WHERE a = 1                    ✓
WHERE a = 1 AND b = 2          ✓
WHERE a = 1 AND b = 2 AND c = 3 ✓
WHERE b = 2                    ✗
WHERE c = 3                    ✗
WHERE b = 2 AND c = 3          ✗
\`\`\`

### 索引选择性

选择性 = 唯一值数量 / 总行数

\`\`\`sql
-- 计算选择性
SELECT
    COUNT(DISTINCT column_name) / COUNT(*) AS selectivity
FROM table_name;
\`\`\`

**选择性参考**：
- 高选择性：> 0.9（如主键、身份证）
- 中选择性：0.1 - 0.9（如用户名）
- 低选择性：< 0.1（如性别、状态）

## 索引优化策略

### 1. 分析查询执行计划

\`\`\`sql
-- MySQL
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- PostgreSQL
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
\`\`\`

**关键字段**：
- **type**: 访问类型（ALL=全表扫描，index=索引扫描，range=范围扫描，ref=索引查找）
- **key**: 实际使用的索引
- **rows**: 预估扫描行数
- **Extra**: 额外信息（Using index=覆盖索引）

### 2. 使用覆盖索引

\`\`\`sql
-- 创建组合索引包含所有查询字段
CREATE INDEX idx_covering ON orders(user_id, status, created_at);

-- 查询只使用索引，不需要回表
SELECT user_id, status, created_at
FROM orders
WHERE user_id = 123;
\`\`\`

### 3. 优化LIKE查询

\`\`\`sql
-- 不使用索引
WHERE name LIKE '%John%'

-- 使用索引
WHERE name LIKE 'John%'

-- 使用全文索引替代
WHERE MATCH(name) AGAINST('John')
\`\`\`

### 4. 避免函数操作

\`\`\`sql
-- 不使用索引
WHERE YEAR(created_at) = 2024

-- 使用索引
WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01'
\`\`\`

### 5. 优化OR查询

\`\`\`sql
-- 可能不使用索引
WHERE col1 = 'value' OR col2 = 'value'

-- 使用UNION替代
SELECT * FROM table WHERE col1 = 'value'
UNION
SELECT * FROM table WHERE col2 = 'value'
\`\`\`

## 索引维护

### 查看索引

\`\`\`sql
-- MySQL
SHOW INDEX FROM users;

-- PostgreSQL
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'users';
\`\`\`

### 删除索引

\`\`\`sql
DROP INDEX idx_name ON users;

-- MySQL删除主键
ALTER TABLE users DROP PRIMARY KEY;
\`\`\`

### 重建索引

\`\`\`sql
-- MySQL
OPTIMIZE TABLE users;

-- PostgreSQL
REINDEX TABLE users;
\`\`\`

## 实战案例

### 案例1：慢查询优化

**问题**：订单查询慢

\`\`\`sql
-- 慢查询
SELECT * FROM orders
WHERE user_id = 123
  AND status = 'completed'
ORDER BY created_at DESC;
\`\`\`

**分析**：

\`\`\`sql
EXPLAIN SELECT * FROM orders
WHERE user_id = 123 AND status = 'completed';
-- type: ALL（全表扫描）
-- key: NULL（没使用索引）
\`\`\`

**解决方案**：

\`\`\`sql
-- 创建组合索引
CREATE INDEX idx_user_status_time
ON orders(user_id, status, created_at DESC);

-- 验证
EXPLAIN SELECT * FROM orders
WHERE user_id = 123 AND status = 'completed';
-- type: ref（索引查找）
-- key: idx_user_status_time
\`\`\`

### 案例2：覆盖索引优化

**问题**：统计查询需要回表

\`\`\`sql
SELECT COUNT(*) FROM orders WHERE status = 'pending';
\`\`\`

**优化**：

\`\`\`sql
-- 创建状态索引
CREATE INDEX idx_status ON orders(status);

-- 或使用覆盖索引
CREATE INDEX idx_status_covering
ON orders(status, id);  -- id是主键
\`\`\`

### 案例3：JOIN优化

**问题**：多表JOIN性能差

\`\`\`sql
SELECT o.*, u.name
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.status = 'completed';
\`\`\`

**优化**：

\`\`\`sql
-- 确保JOIN字段有索引
CREATE INDEX idx_user_id ON orders(user_id);
CREATE INDEX idx_id ON users(id);

-- 确保过滤字段有索引
CREATE INDEX idx_status ON orders(status);
\`\`\`

## 性能测试

### 对比测试

\`\`\`sql
-- 创建测试表
CREATE TABLE performance_test (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入100万条数据
INSERT INTO performance_test (name, email)
SELECT CONCAT('user', n), CONCAT('user', n, '@example.com')
FROM (
    SELECT @n := @n + 1 AS n
    FROM information_schema.columns a
    JOIN information_schema.columns b
    LIMIT 1000000
) numbers
CROSS JOIN (SELECT @n := 0) init;

-- 无索引查询
SELECT * FROM performance_test WHERE email = 'user500000@example.com';
-- 耗时: ~500ms

-- 创建索引
CREATE INDEX idx_email ON performance_test(email);

-- 有索引查询
SELECT * FROM performance_test WHERE email = 'user500000@example.com';
-- 耗时: ~1ms
\`\`\`

## 常见陷阱

### 1. 过度索引

\`\`\`sql
-- 不好的做法：给所有列都建索引
CREATE INDEX idx_col1 ON table(col1);
CREATE INDEX idx_col2 ON table(col2);
CREATE INDEX idx_col3 ON table(col3);
...
\`\`\`

**问题**：
- 占用大量存储
- 降低写入性能
- 优化器选择困难

### 2. 忽略查询模式

\`\`\`sql
-- 查询是这样的
WHERE col1 = 'value' AND col2 = 'value'

-- 却创建了这样的索引
CREATE INDEX idx_col2_col1 ON table(col2, col1);  -- 顺序错误
\`\`\`

### 3. 低效的组合索引

\`\`\`sql
-- 查询中只用到了col1
WHERE col1 = 'value'

-- 却创建了大量列的组合索引
CREATE INDEX idx_large ON table(col1, col2, col3, col4, col5);
\`\`\`

## 索引监控

### MySQL

\`\`\`sql
-- 查看未使用的索引
SELECT
    object_schema,
    object_name,
    index_name
FROM performance_schema.table_io_waits_summary_by_index_usage
WHERE index_name IS NOT NULL
  AND count_star = 0
  AND object_schema = 'your_database'
ORDER BY object_schema, object_name;
\`\`\`

### PostgreSQL

\`\`\`sql
-- 查看索引使用情况
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan ASC;
\`\`\`

## 快速检查清单

创建索引前检查：

- [ ] 该列是否频繁用于WHERE/JOIN/ORDER BY？
- [ ] 查询性能是否真的有问题？
- [ ] 列的选择性是否足够高？
- [ ] 是否有合适的组合索引？
- [ ] 写入性能能否接受？
- [ ] 有足够的存储空间吗？

## 相关技能

- [PostgreSQL](/skills) - PostgreSQL数据库
- [MySQL](/skills) - MySQL数据库
- [MongoDB](/skills) - MongoDB索引

## 参考资源

- [MySQL索引优化](https://dev.mysql.com/doc/refman/8.0/en/optimization-indexes.html)
- [PostgreSQL索引](https://www.postgresql.org/docs/current/indexes.html)
- [数据库索引原理](https://queue.acm.org/detail.cfm?id=2528415)`
    ,
    category: "development",
    tags: ["数据库", "索引", "性能优化", "SQL"],
    difficulty: "beginner",
    readTime: 18,
    author: "OpenClaw Team",
    relatedSkills: ["skill-015", "skill-016"],
    stats: { viewCount: 0 },
    createdAt: new Date().toISOString(),
    featured: false
  },
  {
    id: `tutorial-${maxNum + 4}`,
    title: "HTTP协议完全指南",
    slug: "http-protocol-complete-guide",
    description: "全面理解HTTP协议，包括请求响应、状态码、头字段和缓存机制。",
    content: `# HTTP协议完全指南

HTTP（Hypertext Transfer Protocol）是现代Web通信的基础协议。本教程将带你全面理解HTTP协议的工作原理。

## 什么是HTTP？

HTTP是一种用于传输超媒体文档（如HTML）的应用层协议，是客户端与服务器之间通信的规则。

### HTTP特点

- **无状态**: 每个请求都是独立的
- **文本协议**: 易读易调试
- **请求-响应**: 客户端发起，服务器响应
- **灵活**: 可传输任意类型的数据

### HTTP版本

| 版本 | 发布时间 | 主要特性 |
|------|----------|----------|
| HTTP/0.9 | 1991 | 仅支持GET，仅HTML |
| HTTP/1.0 | 1996 | HEAD、POST，状态码 |
| HTTP/1.1 | 1997 | 持久连接、分块传输 |
| HTTP/2 | 2015 | 多路复用、头部压缩 |
| HTTP/3 | 2022 | 基于QUIC，解决队头阻塞 |

## URL结构

URL（统一资源定位符）标识Web上的资源：

\`\`\`
https://www.example.com:443/path/to/resource?key=value&id=123#section
  │       │                │   │                │                   │
  │       │                │   │                │                   └─ 片段标识符
  │       │                │   │                └───────────────────── 查询参数
  │       │                │   └────────────────────────────────────── 路径
  │       │                └───────────────────────────────────────── 端口
  │       └────────────────────────────────────────────────────────── 主机名
  └────────────────────────────────────────────────────────────────── 协议
\`\`\`

## HTTP请求

### 请求结构

\`\`\`http
GET /api/users?page=1&limit=10 HTTP/1.1
Host: api.example.com
User-Agent: Mozilla/5.0
Accept: application/json
Authorization: Bearer token123
\`\`\`

### 请求方法

| 方法 | 描述 | 幂等性 | 安全性 |
|------|------|--------|--------|
| GET | 获取资源 | ✓ | ✓ |
| POST | 创建资源 | ✗ | ✗ |
| PUT | 更新整个资源 | ✓ | ✗ |
| PATCH | 部分更新 | ✗ | ✗ |
| DELETE | 删除资源 | ✓ | ✗ |
| HEAD | 获取响应头 | ✓ | ✓ |
| OPTIONS | 查询支持的方法 | ✓ | ✓ |
| CONNECT | 建立隧道 | ✓ | ✗ |
| TRACE | 回显请求 | ✓ | ✓ |

### GET vs POST

\`\`\`http
GET /api/users?id=123 HTTP/1.1
- 参数在URL中
- 可被缓存
- 有长度限制
- 可被书签保存

POST /api/users HTTP/1.1
Content-Type: application/json

{"id": 123, "name": "John"}
- 参数在请求体中
- 默认不可缓存
- 无长度限制
- 更安全
\`\`\`

### 常用请求头

\`\`\`http
# 通用头
Accept: application/json, text/plain
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9

# 认证头
Authorization: Bearer token123
Cookie: session_id=abc123

# 内容头
Content-Type: application/json
Content-Length: 256

# 条件头
If-None-Match: "33a64df551425fcc"
If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT
\`\`\`

## HTTP响应

### 响应结构

\`\`\`http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 1234
Date: Wed, 09 Feb 2026 12:00:00 GMT
Server: nginx/1.18.0

{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
\`\`\`

### 状态码

| 类别 | 范围 | 含义 |
|------|------|------|
| 信息 | 100-199 | 请求已接收，继续处理 |
| 成功 | 200-299 | 请求成功 |
| 重定向 | 300-399 | 需要进一步操作 |
| 客户端错误 | 400-499 | 请求包含错误 |
| 服务器错误 | 500-599 | 服务器无法处理 |

### 常见状态码

\`\`\`http
# 成功响应
200 OK              - 请求成功
201 Created         - 资源创建成功
204 No Content      - 成功但无返回内容

# 重定向
301 Moved Permanently  - 永久重定向
302 Found              - 临时重定向
304 Not Modified       - 资源未修改，使用缓存

# 客户端错误
400 Bad Request        - 请求格式错误
401 Unauthorized       - 未认证
403 Forbidden          - 无权限
404 Not Found          - 资源不存在
405 Method Not Allowed - 方法不支持
409 Conflict           - 请求冲突（如重复创建）
422 Unprocessable      - 语义错误
429 Too Many Requests  - 请求过多（限流）

# 服务器错误
500 Internal Server Error - 服务器内部错误
502 Bad Gateway          - 网关错误
503 Service Unavailable  - 服务不可用
504 Gateway Timeout      - 网关超时
\`\`\`

### 常用响应头

\`\`\`http
# 内容头
Content-Type: application/json
Content-Length: 1234
Content-Encoding: gzip
Content-Disposition: attachment; filename="data.csv"

# 缓存头
Cache-Control: max-age=3600
ETag: "33a64df551425fcc"
Last-Modified: Wed, 09 Feb 2026 12:00:00 GMT

# CORS头
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization

# 安全头
Strict-Transport-Security: max-age=31536000
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
\`\`\`

## HTTP缓存

### 缓存机制

\`\`\`http
# 强缓存
Cache-Control: max-age=3600        # 缓存1小时
Cache-Control: no-cache            # 每次验证
Cache-Control: no-store            # 不缓存

# 协商缓存
ETag: "33a64df551425fcc"
Last-Modified: Wed, 09 Feb 2026 12:00:00 GMT
\`\`\`

### 缓存流程

\`\`\`
客户端请求
    │
    ├─ 有缓存？─是───检查Cache-Control
    │              │
    │              ├─ max-age有效───使用缓存（200 OK）
    │              │
    │              └─ 需要验证───发送条件请求
    │                                │
    │                                ├─ ETag匹配───304 Not Modified
    │                                └─ ETag不匹配───200 OK（新内容）
    │
    └─ 无缓存───────向服务器请求──────200 OK（新内容）
                     │
                     └─ 返回Cache-Control和ETag
\`\`\`

## HTTP认证

### Basic认证

\`\`\`http
GET /api/users HTTP/1.1
Authorization: Basic base64(username:password)
\`\`\`

### Bearer Token

\`\`\`http
GET /api/users HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

### API Key

\`\`\`http
GET /api/users?api_key=your_key_here HTTP/1.1

# 或通过头
X-API-Key: your_key_here
\`\`\`

## HTTPS

HTTPS是HTTP的安全版本，通过TLS/SSL加密通信：

\`\`\`
客户端                     服务器
  │                          │
  │───1. Client Hello───────▶│
  │◀──2. Server Hello + 证书─│
  │───3. 验证证书 + 生成密钥──▶│
  │◀──4. Server Hello Done───│
  │───5. Client Key Exchange─▶│
  │                          │
  │────加密通信开始───────────│
\`\`\`

### HTTPS特点

- **加密**: 所有数据加密传输
- **认证**: 验证服务器身份
- **完整性**: 防止数据篡改
- **信任**: 基于证书颁发机构

## HTTP/2特性

### 多路复用

\`\`\`
HTTP/1.1 (串行):
请求1 ─────▶ 响应1
请求2 ─────────────▶ 响应2
请求3 ───────────────────▶ 响应3

HTTP/2 (并行):
请求1 ──┐
请求2 ──┼──▶ 响应1、2、3
请求3 ──┘
\`\`\`

### 头部压缩

HPACK算法压缩重复的头部：

\`\`\`http
# 请求1
GET /page1 HTTP/2
header: name1, name2, name3...

# 请求2（仅发送差异）
GET /page2 HTTP/2
header: name4 (name1, name2, name3被复用)
\`\`\`

### 服务器推送

\`\`\`http
# 客户端请求
GET /index.html HTTP/2

# 服务器主动推送
PUSH /style.css
PUSH /script.js
\`\`\`

## RESTful API设计

### 资源命名

\`\`\`http
# 好的设计
GET    /users          # 获取用户列表
GET    /users/123      # 获取特定用户
POST   /users          # 创建用户
PUT    /users/123      # 更新整个用户
PATCH  /users/123      # 部分更新用户
DELETE /users/123      # 删除用户

# 不好的设计
GET    /getUsers
POST   /createUser
GET    /user.php?id=123
\`\`\`

### 状态码使用

\`\`\`http
GET    /users/123    → 200 OK (找到) / 404 Not Found
POST   /users        → 201 Created (成功) / 400 Bad Request
PUT    /users/123    → 200 OK / 204 No Content / 404
DELETE /users/123    → 204 No Content / 404
\`\`\`

### 版本控制

\`\`\`http
# URL版本
GET /v1/users
GET /v2/users

# 头版本
GET /users
Accept: application/vnd.myapi.v2+json
\`\`\`

## 实战案例

### 案例1：使用fetch API

\`\`\`javascript
// GET请求
fetch('https://api.example.com/users?page=1')
  .then(response => {
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}\`);
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error(error));

// POST请求
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com'
  })
})
  .then(response => response.json())
  .then(data => console.log(data));
\`\`\`

### 案例2：错误处理

\`\`\`javascript
async function fetchWithHandling(url, options = {}) {
  try {
    const response = await fetch(url, options);

    // 检查HTTP状态
    if (!response.ok) {
      switch (response.status) {
        case 401:
          throw new Error('未认证，请登录');
        case 403:
          throw new Error('无权限访问');
        case 404:
          throw new Error('资源不存在');
        case 429:
          throw new Error('请求过多，请稍后再试');
        case 500:
          throw new Error('服务器错误');
        default:
          throw new Error(\`请求失败: \${response.status}\`);
      }
    }

    return await response.json();
  } catch (error) {
    console.error('请求错误:', error);
    throw error;
  }
}
\`\`\`

### 案例3：请求取消

\`\`\`javascript
// 创建AbortController
const controller = new AbortController();

// 发送请求
fetch('https://api.example.com/slow', {
  signal: controller.signal
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('请求已取消');
    }
  });

// 5秒后取消请求
setTimeout(() => controller.abort(), 5000);
\`\`\`

## 调试工具

### curl命令

\`\`\`bash
# GET请求
curl -X GET https://api.example.com/users

# POST请求
curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -d '{"name":"John","email":"john@example.com"}'

# 带认证
curl -H "Authorization: Bearer token123" \\
  https://api.example.com/users

# 查看响应头
curl -I https://api.example.com/users

# 详细输出
curl -v https://api.example.com/users
\`\`\`

### 浏览器开发者工具

\`\`\`javascript
// Network标签查看
- 请求方法和URL
- 请求和响应头
- 请求体和响应体
- 状态码和耗时

// Console中复制fetch
copy(fetch)  // 复制为curl命令
\`\`\`

## 安全最佳实践

### 1. 使用HTTPS

\`\`\`javascript
// 强制HTTPS
if (location.protocol !== 'https:') {
  location.replace(\`https:\${location.href.substring(location.protocol.length)}\`);
}
\`\`\`

### 2. 防止XSS

\`\`\`http
Content-Security-Policy: default-src 'self'
X-XSS-Protection: 1; mode=block
\`\`\`

### 3. 防止CSRF

\`\`\`http
# 使用SameSite Cookie
Set-Cookie: session_id=abc123; SameSite=Strict

# 使用CSRF Token
X-CSRF-Token: random_token_here
\`\`\`

## 快速参考

| 场景 | 状态码 | 说明 |
|------|--------|------|
| 成功获取 | 200 | 正常返回 |
| 创建成功 | 201 | 资源已创建 |
| 无返回内容 | 204 | 成功但无内容 |
| 参数错误 | 400 | 请求格式错误 |
| 未登录 | 401 | 需要认证 |
| 无权限 | 403 | 认证但无权限 |
| 不存在 | 404 | 资源未找到 |
| 限流 | 429 | 请求过多 |
| 服务器错误 | 500 | 内部错误 |

## 相关技能

- [JavaScript](/skills) - Fetch API
- [Node.js](/skills) - HTTP服务器
- [curl](/skills) - 命令行工具

## 参考资源

- [MDN - HTTP](https://developer.mozilla.org/zh-CN/docs/Web/HTTP)
- [HTTP/3 Explained](https://http3-explained.haxx.tile/)
- [REST API设计指南](https://restfulapi.net/)`
    ,
    category: "development",
    tags: ["HTTP", "网络", "Web", "协议"],
    difficulty: "beginner",
    readTime: 20,
    author: "OpenClaw Team",
    relatedSkills: ["skill-001", "skill-011"],
    stats: { viewCount: 0 },
    createdAt: new Date().toISOString(),
    featured: false
  },
  {
    id: `tutorial-${maxNum + 5}`,
    title: "CSS Grid布局完全指南",
    slug: "css-grid-complete-guide",
    description: "全面掌握CSS Grid布局系统，学习创建复杂响应式布局的强大工具。",
    content: `# CSS Grid布局完全指南

CSS Grid是一个强大的二维布局系统，可以同时处理行和列。本教程将带你从零开始掌握Grid布局。

## 什么是CSS Grid？

Grid布局是一种二维布局系统，具有以下特点：

- **二维**: 同时控制行和列
- **灵活**: 支持固定、自动和弹性尺寸
- **强大**: 可以实现复杂布局
- **直观**: 声明式语法

## 基础概念

### Grid容器和项目

\`\`\`html
<div class="container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
</div>
\`\`\`

\`\`\`css
.container {
  display: grid;
}
\`\`\`

- **Grid容器**: 设置\`display: grid\`的父元素
- **Grid项目**: 容器的直接子元素
- **Grid线**: 构成Grid结构的分隔线

## 定义网格

### 基础语法

\`\`\`css
.container {
  display: grid;
  grid-template-columns: 100px 100px 100px;  /* 三列，每列100px */
  grid-template-rows: 50px 50px;             /* 两行，每行50px */
}
\`\`\`

### 使用fr单位

\`\`\`css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;  /* 1:2:1比例 */
  grid-template-rows: 100px;           /* 固定高度 */
}

/* 混合使用 */
.container {
  grid-template-columns: 200px 1fr 100px;  /* 左200px，右100px，中间自适应 */
}
\`\`\`

### repeat()函数

\`\`\`css
/* 不使用repeat */
grid-template-columns: 1fr 1fr 1fr 1fr;

/* 使用repeat */
grid-template-columns: repeat(4, 1fr);

/* 自动填充 */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
\`\`\`

## 放置项目

### 基础放置

\`\`\`css
.item1 {
  grid-column: 1;   /* 从第1列线开始 */
  grid-row: 1;      /* 从第1行线开始 */
}

.item2 {
  grid-column: 3;   /* 从第3列线开始 */
  grid-row: 2;      /* 从第2行线开始 */
}
\`\`\`

### 跨越多列/行

\`\`\`css
.item1 {
  /* 从第1列线到第3列线，跨越2列 */
  grid-column: 1 / 3;

  /* 或使用span */
  grid-column: 1 / span 2;
}

.item2 {
  /* 从第2行线到第4行线，跨越2行 */
  grid-row: 2 / 4;
}
\`\`\`

### 命名网格线

\`\`\`css
.container {
  display: grid;
  grid-template-columns:
    [start] 1fr
    [center-start] 2fr
    [center-end] 1fr
    [end];
}

.item {
  grid-column: start / center-end;
}
\`\`\`

### 命名网格区域

\`\`\`css
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main   main"
    "footer footer footer";
  grid-template-columns: 200px 1fr 1fr;
  grid-template-rows: auto 1fr auto;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
\`\`\`

## 间距

### gap属性

\`\`\`css
/* 行间距和列间距相同 */
.container {
  gap: 20px;
}

/* 分别设置 */
.container {
  row-gap: 20px;
  column-gap: 10px;
}

/* 简写 */
.container {
  gap: 20px 10px;  /* row-gap column-gap */
}
\`\`\`

## 对齐

### 主轴对齐（justify）

\`\`\`css
.container {
  justify-items: start | end | center | stretch;
  justify-content: start | end | center | stretch | space-between | space-around | space-evenly;
}

.item {
  justify-self: start | end | center | stretch;
}
\`\`\`

### 交叉轴对齐（align）

\`\`\`css
.container {
  align-items: start | end | center | stretch;
  align-content: start | end | center | stretch | space-between | space-around | space-evenly;
}

.item {
  align-self: start | end | center | stretch;
}
\`\`\`

### 简写属性

\`\`\`css
/* 项目对齐 */
.container {
  place-items: align justify;
}

/* 内容对齐 */
.container {
  place-content: align-content justify-content;
}

/* 单个项目 */
.item {
  place-self: align-self justify-self;
}
\`\`\`

## 自动布局

### auto-flow

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-flow: row;  /* 默认值，按行排列 */
  grid-auto-flow: column;  /* 按列排列 */
  grid-auto-flow: dense;  /* 紧凑排列，填充空隙 */
}
\`\`\`

### 隐式网格

\`\`\`css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 100px;  /* 隐式创建的行高度 */
  grid-auto-columns: 200px;  /* 隐式创建的列宽度 */
}
\`\`\`

## 实用布局模式

### 响应式网格

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
\`\`\`

### 圣杯布局

\`\`\`html
<div class="layout">
  <header class="header">Header</header>
  <aside class="sidebar">Sidebar</aside>
  <main class="main">Main</main>
  <aside class="ads">Ads</aside>
  <footer class="footer">Footer</footer>
</div>
\`\`\`

\`\`\`css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main ads"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  gap: 20px;
}

@media (max-width: 768px) {
  .layout {
    grid-template-areas:
      "header"
      "main"
      "sidebar"
      "ads"
      "footer";
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto auto;
  }
}
\`\`\`

### 卡片网格

\`\`\`html
<div class="card-grid">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
  <div class="card">Card 4</div>
  <div class="card">Card 5</div>
  <div class="card">Card 6</div>
</div>
\`\`\`

\`\`\`css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}
\`\`\`

### 图片画廊

\`\`\`css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 200px;
  gap: 10px;
}

.gallery-item {
  overflow: hidden;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 大图跨2列 */
.gallery-item.large {
  grid-column: span 2;
  grid-row: span 2;
}
\`\`\`

### 仪表盘布局

\`\`\`css
.dashboard {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr;
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  min-height: 100vh;
}

.header {
  grid-area: header;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.sidebar {
  grid-area: sidebar;
  background: #2c3e50;
  color: white;
}

.main {
  grid-area: main;
  padding: 20px;
}
\`\`\`

## 实战案例

### 案例1：产品展示

\`\`\`html
<div class="products">
  <article class="product">
    <img src="product1.jpg" alt="Product">
    <h3>Product Name</h3>
    <p class="price">$99.99</p>
    <button>Add to Cart</button>
  </article>
  <!-- 更多产品... -->
</div>
\`\`\`

\`\`\`css
.products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.product {
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: 15px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.product img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #e74c3c;
}
\`\`\`

### 案例2：响应式导航

\`\`\`html
<nav class="navbar">
  <div class="logo">Brand</div>
  <ul class="nav-links">
    <li><a href="#">Home</a></li>
    <li><a href="#">Products</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>
\`\`\`

\`\`\`css
.navbar {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  padding: 0 20px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-links {
  display: grid;
  grid-auto-flow: column;
  gap: 30px;
  list-style: none;
  justify-content: end;
}

@media (max-width: 768px) {
  .navbar {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
  }

  .nav-links {
    grid-auto-flow: row;
    justify-content: center;
  }
}
\`\`\`

### 案例3：表单布局

\`\`\`html
<form class="form">
  <div class="form-group">
    <label>Username</label>
    <input type="text" placeholder="Enter username">
  </div>
  <div class="form-group">
    <label>Email</label>
    <input type="email" placeholder="Enter email">
  </div>
  <div class="form-group">
    <label>Password</label>
    <input type="password" placeholder="Enter password">
  </div>
  <button type="submit">Sign Up</button>
</form>
\`\`\`

\`\`\`css
.form {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 15px 20px;
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  display: contents;  /* 使label和input成为grid的直接子项 */
}

.form-group label {
  grid-column: 1;
  align-self: center;
}

.form-group input {
  grid-column: 2;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  grid-column: 1 / -1;
  padding: 12px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
\`\`\`

## 与Flexbox对比

| 特性 | Grid | Flexbox |
|------|------|---------|
| 维度 | 二维（行+列） | 一维（行或列） |
| 适用场景 | 整体布局 | 组件内部布局 |
| 对齐 | 更强大 | 较简单 |
| 浏览器支持 | 较新 | 更广泛 |

### 结合使用

\`\`\`css
/* Grid用于整体布局 */
.container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
}

/* Flexbox用于组件内部 */
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
\`\`\`

## 浏览器支持

\`\`\`css
/* 现代浏览器支持Grid */
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

/* 提供降级方案 */
@supports not (display: grid) {
  .container {
    display: flex;
    flex-wrap: wrap;
  }

  .item {
    width: 33.333%;
  }
}
\`\`\`

## 性能优化

### 避免过度布局

\`\`\`css
/* 不好：多层嵌套 */
.parent {
  display: grid;
}
.child {
  display: grid;
}
.grandchild {
  display: grid;
}

/* 更好：扁平化结构 */
.container {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}
\`\`\`

### 使用content-visibility

\`\`\`css
.item {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}
\`\`\`

## 调试技巧

### Chrome DevTools

1. 选择Grid容器
2. 在Styles面板中找到Grid设置
3. 点击图标显示Grid线
4. 查看Grid区域编号

### CSS Grid高亮

\`\`\`css
/* 开发时使用 */
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  background: #f0f0f0;
}

.item {
  background: white;
  border: 2px solid #3498db;
}
\`\`\`

## 快速参考

| 属性 | 值 | 说明 |
|------|-----|------|
| \`display\` | grid | 创建grid容器 |
| \`grid-template-columns\` | repeat(3, 1fr) | 定义列 |
| \`grid-template-rows\` | auto 1fr | 定义行 |
| \`gap\` | 20px | 行列间距 |
| \`grid-column\` | 1 / 3 | 列位置 |
| \`grid-row\` | 1 / span 2 | 行位置 |
| \`grid-area\` | header | 区域名称 |
| \`justify-items\` | center | 水平对齐 |
| \`align-items\` | center | 垂直对齐 |

## 相关技能

- [CSS Flexbox](/skills) - 一维布局
- [Responsive Design](/skills) - 响应式设计
- [Tailwind CSS](/skills) - CSS框架

## 参考资源

- [CSS Grid Layout](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Grid_Layout)
- [CSS-Tricks Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Grid Garden](https://cssgridgarden.com/) - 互动游戏`
    ,
    category: "development",
    tags: ["CSS", "Grid", "布局", "前端"],
    difficulty: "beginner",
    readTime: 16,
    author: "OpenClaw Team",
    relatedSkills: ["skill-001", "skill-011"],
    stats: { viewCount: 0 },
    createdAt: new Date().toISOString(),
    featured: false
  }
];

// Add new tutorials to the array
tutorials.push(...newTutorials);

// Write back to file
fs.writeFileSync(tutorialsFile, JSON.stringify(tutorials, null, 2) + '\n', 'utf-8');

console.log(`Added ${newTutorials.length} new tutorials:`);
newTutorials.forEach(t => console.log(`- ${t.id}: ${t.title}`));
