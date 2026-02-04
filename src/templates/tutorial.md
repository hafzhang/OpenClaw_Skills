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

- [官方文档链接](https://example.com)
- [相关教程链接](/tutorial/slug)
- 相关技能：skill-name

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

**Markdown 格式规范**：

1. 标题层级：使用 `#` `##` `###` 表示标题层级
2. 代码块：使用 ` ```language ` 指定语言
3. 链接：使用 `[文本](URL)` 格式
4. 列表：使用 `-` 或 `1.` 格式
5. 表格：使用 Markdown 表格语法
6. 强调：使用 `**粗体**` 或 `*斜体*`
