# 教程创作模板套件

本目录包含完整的教程创作模板和规范文档。

## 模板文件

### 1. [教程大纲模板](./tutorial-outline.md)
用于规划教程的整体结构、学习目标和章节安排。
- **用途**：写作前的规划阶段
- **内容**：基本信息、目标受众、学习目标、章节结构、实战案例规划
- **使用时机**：开始编写教程之前

### 2. [教程 Markdown 模板](./tutorial.md)（本文件）
用于编写完整的教程内容。
- **用途**：实际教程编写
- **内容**：完整的教程结构模板
- **使用时机**：根据大纲编写教程内容

### 3. [代码示例规范](./code-example-standards.md)
定义代码示例的格式标准和最佳实践。
- **用途**：确保代码质量一致性
- **内容**：代码块格式、注释规范、不同语言示例
- **使用时机**：编写代码示例时参考

### 4. [FAQ 模板](./faq-template.md)
提供常见问题的标准格式和编写规范。
- **用途**：编写教程 FAQ 章节
- **内容**：FAQ 类型、格式模板、编写规范
- **使用时机**：编写教程 FAQ 部分

### 5. [质量检查清单](./tutorial-quality-checklist.md)
完整的教程质量检查清单。
- **用途**：发布前的质量验证
- **内容**：15 个类别的检查项
- **使用时机**：教程完成后、发布前

### 6. [创作流程文档](./tutorial-creation-workflow.md)
说明从规划到发布的完整流程。
- **用途**：指导整个教程创作过程
- **内容**：四个阶段的详细步骤
- **使用时机**：首次创建教程时阅读

## 使用流程

```
1. 阅读 [创作流程文档](./tutorial-creation-workflow.md)
   ↓
2. 使用 [教程大纲模板](./tutorial-outline.md) 进行规划
   ↓
3. 参考本文件（[教程 Markdown 模板](./tutorial.md)）编写内容
   ↓
4. 参考 [代码示例规范](./code-example-standards.md) 编写代码
   ↓
5. 参考 [FAQ 模板](./faq-template.md) 编写 FAQ
   ↓
6. 使用 [质量检查清单](./tutorial-quality-checklist.md) 进行检查
   ↓
7. 提交审核和发布
```

## 快速开始

1. **首次创作**：先阅读 [创作流程文档](./tutorial-creation-workflow.md)
2. **开始规划**：复制 [教程大纲模板](./tutorial-outline.md)
3. **编写内容**：使用下方的教程模板
4. **确保质量**：使用 [质量检查清单](./tutorial-quality-checklist.md)

---

# 教程标题

简短描述教程内容和目标受众（1-2 句话）

## 前置条件

- OpenClaw 已安装
- 基本的命令行操作经验
- （其他具体前置条件）

## 学习目标

完成本教程后，你将能够：

- 目标 1
- 目标 2
- 目标 3

## 背景知识

（可选）简要介绍相关背景知识或概念

## 实战步骤

### 步骤 1：准备工作

```bash
# 示例命令
openclaw init my-project
cd my-project
```

说明这个步骤的作用和预期结果。

### 步骤 2：核心配置

```json
{
  "name": "示例配置",
  "value": "配置值"
}
```

解释配置的含义和可选项。

### 步骤 3：验证结果

```bash
# 验证命令
openclaw test
```

说明如何验证配置是否成功。

## 配置示例

### 完整配置文件

```json
{
  "name": "项目名称",
  "description": "项目描述",
  "config": {
    "option1": "value1",
    "option2": "value2"
  }
}
```

### 常用选项

| 选项 | 说明 | 默认值 |
|------|------|--------|
| option1 | 选项1说明 | default1 |
| option2 | 选项2说明 | default2 |

## 常见问题 (FAQ)

### Q: 遇到错误 X 怎么办？

A: 检查以下几点：
1. 确认配置文件格式正确
2. 检查 API 密钥是否有效
3. 查看日志文件获取更多信息

### Q: 如何自定义配置？

A: 可以通过修改配置文件中的参数来调整行为，详见上方配置示例。

## 进阶内容

（可选）更高级的用法或技巧

## 相关资源

- [官方文档链接](https://example.com) - 必须可访问
- [相关教程链接](/tutorial/slug)
- 相关技能：skill-name - **要求：技能的 GitHub 仓库必须存在且可访问**

## 总结

简要总结教程内容，鼓励用户尝试并指向下一步学习资源。

---

**元数据参考**（用于添加到 `src/data/tutorials.json`）：

```json
{
  "id": "tutorial-XXX",
  "title": "教程标题",
  "slug": "tutorial-slug",
  "description": "简短描述教程内容和目标受众",
  "content": "（将上面的 Markdown 内容放在这里，注意转义引号和换行符）",
  "category": "quick-start | productivity | development | content | creative",
  "tags": ["标签1", "标签2", "标签3"],
  "difficulty": "beginner | intermediate | advanced",
  "readTime": 阅读时间（分钟）,
  "author": "作者名称",
  "relatedSkills": ["skill-XXX"],
  "stats": {
    "viewCount": 0
  },
  "createdAt": "2026-01-01T00:00:00Z",
  "featured": true | false
}
```

**content 字段格式说明**：
- 将完整的 Markdown 内容作为 JSON 字符串存储
- 需要转义的特殊字符：双引号 `"` → `\"`，换行符 → `\n`
- 建议使用工具（如 jq、在线 JSON 转义工具）进行转义
- 或者使用 Node.js: `JSON.stringify(markdownContent)`

**Markdown 格式规范**：

1. 标题层级：使用 `#` `##` `###` 表示标题层级
2. 代码块：使用 ` ```language ` 指定语言
3. 链接：使用 `[文本](URL)` 格式
4. 列表：使用 `-` 或 `1.` 格式
5. 表格：使用 Markdown 表格语法
6. 强调：使用 `**粗体**` 或 `*斜体*`

---

## 教程质量检查清单

发布前请确认：

- [ ] 教程标题清晰描述主题
- [ ] 前置条件完整列出
- [ ] 学习目标具体可衡量
- [ ] 每个代码示例可独立运行
- [ ] 所有链接有效且可访问
- [ ] 相关技能的 GitHub 仓库存在
- [ ] FAQ 覆盖常见问题
- [ ] Markdown 格式正确无误
- [ ] 代码块指定了正确的语言
- [ ] 阅读时间估算合理（约 200-300 字/分钟）
