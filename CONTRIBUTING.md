# 贡献指南

感谢你对 OpenClaw 实战指南的关注！我们欢迎所有形式的贡献。

## 如何贡献

### 提交教程

教程是本项目的核心内容，我们欢迎高质量的实战教程。

#### 准备工作

1. 阅读 [教程创作模板](src/templates/tutorial.md)
2. 确保教程内容基于真实经验，包含实际代码示例
3. 教程应具有实用价值，帮助用户解决实际问题

#### 提交流程

1. **Fork 仓库**
   ```bash
   # 在 GitHub 上点击 Fork 按钮
   git clone https://github.com/YOUR_USERNAME/openclaw-hub.git
   cd openclaw-hub
   ```

2. **创建分支**
   ```bash
   git checkout -b feature/your-tutorial-title
   ```

3. **添加教程**
   - 编辑 `src/data/tutorials.json`
   - 添加新的教程条目，遵循现有格式
   - 确保 `content` 字段包含完整的 Markdown 内容
   - 设置正确的 `category`、`difficulty`、`readTime` 等字段

4. **测试构建**
   ```bash
   npm install
   npm run build
   npm run dev
   ```
   在浏览器中访问 http://localhost:3000 验证教程显示正常

5. **提交更改**
   ```bash
   git add src/data/tutorials.json
   git commit -m "docs: add tutorial for [主题]"
   git push origin feature/your-tutorial-title
   ```

6. **创建 Pull Request**
   - 在 GitHub 上创建 Pull Request
   - 在 PR 描述中说明教程的目的和主要内容
   - 等待维护者审核

#### 教程要求

- **内容真实**：基于实际使用经验，避免虚构内容
- **代码正确**：所有代码示例应经过验证
- **格式规范**：使用 Markdown 格式，遵循模板结构
- **长度适中**：阅读时间建议在 5-20 分钟之间
- **分类准确**：选择合适的场景分类（快速入门、工作效率、开发辅助、内容创作、创意玩法）
- **难度标注**：准确标注难度（入门、进阶、高级）

### 提交技能

技能索引是辅助功能，帮助用户发现可用的 OpenClaw 技能。

#### 提交流程

由于技能数据存储在项目仓库中，请通过 GitHub Issues 提交新技能：

1. **检查技能是否已存在**
   - 访问 [技能索引页](https://openclaw-hub.vercel.app/skills)
   - 搜索你想提交的技能

2. **创建 Issue**
   - 在 GitHub 上创建新 Issue
   - 使用 "New Skill" 标签
   - 填写以下信息：
     ```
     ### 技能名称
     [技能名称]

     ### GitHub 仓库
     [仓库链接]

     ### 安装命令
     ```bash
     openclaw skill install xxx
     ```

     ### 技能描述
     [简短描述技能的功能和用途]

     ### 分类
     - [ ] 开发辅助
     - [ ] 工作效率
     - [ ] 系统工具
     - [ ] 创意工具

     ### 标签
     [相关标签，用逗号分隔]

     ### 作者
     [技能作者名称或 GitHub 用户名]
     ```

3. **等待审核**
   - 维护者会验证技能的有效性
   - 审核通过后会添加到技能索引中

#### 技能验证要求

- **仓库活跃**：GitHub 仓库应有一定活跃度
- **文档完整**：有清晰的 README 和使用说明
- **可安装**：安装命令能够正常工作
- **无恶意代码**：技能代码安全可靠
- **实用性**：技能具有实际使用价值

## 代码规范

### JSON 数据格式

- 使用 2 空格缩进
- 字符串使用双引号
- 对象和数组末尾元素后不加逗号
- 日期格式：ISO 8601 (`2026-01-15T00:00:00Z`)

### TypeScript 代码

- 使用 TypeScript 类型注解
- 函数组件使用 `function` 声明（非箭头函数）
- 客户端组件在文件顶部添加 `'use client'`
- 导入顺序：Next.js -> 第三方库 -> 本地模块

### Git 提交信息

使用语义化提交信息：

```
feat: 新功能
fix: 修复问题
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具相关
```

## 审核流程

### 教程审核

1. **自动检查**
   - TypeScript 类型检查
   - 构建成功
   - 格式验证

2. **人工审核**
   - 内容质量和准确性
   - 代码示例正确性
   - 语言和格式规范

3. **反馈**
   - 如有需要修改的地方，会在 PR 中留言
   - 请及时回应评论和修改建议

### 技能审核

1. **验证**：测试技能安装和基本功能
2. **文档检查**：确认 README 和使用说明
3. **安全审查**：检查代码安全性
4. **添加到索引**：审核通过后添加到 skills.json

## 获取帮助

如果有任何问题：

1. 查看 [现有教程](https://openclaw-hub.vercel.app)
2. 在 GitHub 上创建 Issue 或 Discussion
3. 查看 OpenClaw [官方文档](https://openclaw.dev)

## 行为准则

- 尊重所有贡献者
- 建设性的反馈和讨论
- 避免争议性话题
- 专注于项目目标

## 许可证

贡献的内容将采用与项目相同的 [MIT 许可证](LICENSE)。

---

再次感谢你的贡献！让我们一起让 OpenClaw 实战指南变得更好。
