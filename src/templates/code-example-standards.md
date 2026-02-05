# 代码示例格式规范

本文档定义了教程中代码示例的格式标准，确保代码清晰、可读、可运行。

## 1. 代码块标记

### 标准格式

使用三个反引号包裹代码，并指定语言标识符：

````markdown
```language
代码内容
```
````

### 支持的语言标识符

| 语言 | 标识符 | 说明 |
|------|--------|------|
| Bash | `bash` | Shell 命令和脚本 |
| Python | `python` | Python 代码 |
| JavaScript | `javascript` 或 `js` | JavaScript 代码 |
| TypeScript | `typescript` 或 `ts` | TypeScript 代码 |
| JSON | `json` | JSON 配置文件 |
| YAML | `yaml` | YAML 配置文件 |
| SQL | `sql` | SQL 查询语句 |
| Markdown | `markdown` 或 `md` | Markdown 示例 |

**正确示例**：
````markdown
```bash
# 安装 OpenClaw
npm install -g @openclaw/cli
```
````

**错误示例**：
````markdown
```
npm install -g @openclaw/cli
```
````

## 2. 代码注释规范

### 行内注释

在代码中添加注释说明关键步骤：

```python
# 读取配置文件
config = load_config('config.yaml')

# 初始化 OpenClaw 客户端
client = OpenClawClient(config)
```

### 代码块说明注释

使用特殊注释标记说明代码的作用：

```bash
# ===== 安装依赖 =====
npm install

# ===== 启动开发服务器 =====
npm run dev
```

### 注意事项注释

使用注释标记需要注意的地方：

```python
# 注意：此操作会覆盖现有配置
save_config(config, 'config.yaml')
```

```python
# TODO: 添加错误处理
# FIXME: 修复内存泄漏问题
```

## 3. 命令行代码规范

### 命令格式

- 使用 `$` 表示普通用户命令
- 使用 `#` 表示 root 用户命令
- 使用 `>` 表示 Windows 命令

```bash
# 普通用户命令
$ npm install

# root 用户命令
# apt-get install python3

# Windows 命令
> pip install openclaw
```

### 命令说明

命令前添加说明性注释：

```bash
# 克隆项目仓库
$ git clone https://github.com/user/repo.git

# 进入项目目录
$ cd repo

# 安装依赖
$ npm install
```

### 命令输出

使用注释标记预期输出：

```bash
$ openclaw version
# 输出: OpenClaw CLI v1.2.3
```

或使用代码块：

```bash
$ openclaw version
OpenClaw CLI v1.2.3
```

### 长命令处理

使用反斜杠换行：

```bash
$ openclaw agent create \
  --name "my-agent" \
  --model "claude-3" \
  --temperature 0.7
```

## 4. 配置文件规范

### JSON 配置

使用 2 空格缩进：

```json
{
  "name": "my-agent",
  "description": "My OpenClaw agent",
  "config": {
    "model": "claude-3",
    "temperature": 0.7,
    "maxTokens": 2000
  }
}
```

### YAML 配置

使用 2 空格缩进：

```yaml
name: my-agent
description: My OpenClaw agent
config:
  model: claude-3
  temperature: 0.7
  maxTokens: 2000
```

### 环境变量

使用 `.env` 格式：

```bash
# OpenClaw 配置
OPENCLAW_API_KEY=your_api_key_here
OPENCLAW_MODEL=claude-3
OPENCLAW_TEMPERATURE=0.7
```

## 5. 代码示例完整性

### 可运行性

每个代码示例应该：

- [ ] 可以独立运行（或清楚说明依赖）
- [ ] 包含必要的导入语句
- [ ] 包含必要的初始化代码
- [ ] 有明确的输入输出

### 示例模板

#### Python 示例

```python
import openclaw
from openclaw import Agent

# 初始化客户端
client = openclaw.Client(api_key="your-api-key")

# 创建 Agent
agent = Agent(
    name="my-agent",
    model="claude-3",
    temperature=0.7
)

# 执行任务
result = agent.run("分析以下文本...")
print(result)
```

#### JavaScript 示例

```javascript
import { OpenClaw } from '@openclaw/sdk';

// 初始化客户端
const client = new OpenClaw({
  apiKey: process.env.OPENCLAW_API_KEY
});

// 创建 Agent
const agent = client.createAgent({
  name: 'my-agent',
  model: 'claude-3',
  temperature: 0.7
});

// 执行任务
const result = await agent.run('分析以下文本...');
console.log(result);
```

## 6. 代码高亮和强调

### 行内代码

使用单个反引号标记行内代码：

在命令行中运行 `npm install` 安装依赖。

配置文件位于 `~/.openclaw/config.yaml`。

### 关键行高亮

使用注释标记重要代码：

```python
# 重要：设置正确的 API 密钥
client = OpenClaw(api_key="sk-...")
```

## 7. 错误处理示例

### 包含错误处理

```python
try:
    result = client.run(prompt)
except OpenClawError as e:
    print(f"错误: {e}")
    # 处理错误
```

### 错误示例

展示常见错误和解决方案：

```python
# 错误：未设置 API 密钥
client = OpenClaw()
# 会抛出: OpenClawError: API key not found

# 正确：设置 API 密钥
client = OpenClaw(api_key="sk-...")
```

## 8. 输出示例

### 终端输出

使用注释标记或代码块：

```bash
$ openclaw agent list
# 输出:
# ID          Name          Status
# agent-001   my-agent      running
# agent-002   test-agent    stopped
```

### JSON 输出

```json
{
  "agents": [
    {
      "id": "agent-001",
      "name": "my-agent",
      "status": "running"
    }
  ]
}
```

## 9. 代码对比

### Before/After

使用注释标记：

```python
# 之前：使用同步方式
result = sync_operation()

# 之后：使用异步方式
result = await async_operation()
```

### 标记改动

使用注释标记新增或修改：

```python
# 新增：添加重试逻辑
for attempt in range(3):
    try:
        result = client.run(prompt)
        break
    except OpenClawError:
        if attempt == 2:
            raise
```

## 10. 代码检查清单

发布前检查：

- [ ] 所有代码块指定了正确的语言标识符
- [ ] 代码可以正常运行（或清楚说明依赖）
- [ ] 包含必要的注释
- [ ] 使用一致的缩进（2 或 4 空格）
- [ ] 变量命名清晰有意义
- [ ] 错误处理适当
- [ ] 输出示例清晰
- [ ] 遵循语言最佳实践
- [ ] 没有硬编码的敏感信息
- [ ] 命令示例包含必要的说明

## 11. 特殊场景

### 跨平台命令

同时提供不同平台的命令：

```bash
# Linux/macOS
$ export OPENCLAW_KEY="your-key"

# Windows
> set OPENCLAW_KEY=your-key
```

### 版本特定代码

标注代码适用的版本：

```python
# OpenClaw SDK v1.2+
client = OpenClaw(api_version="v1")
```

### 可选步骤

使用 `[可选]` 标记：

```bash
# [可选] 验证安装
$ openclaw version
```

---

**代码示例质量原则**

1. **清晰性**：代码应该自解释，必要时添加注释
2. **完整性**：代码应该可以运行，或清楚说明依赖
3. **正确性**：代码应该经过测试验证
4. **最佳实践**：代码应该遵循语言和框架的最佳实践
5. **安全性**：不要暴露敏感信息，使用环境变量
