# FAQ 模板

本文档提供教程常见问题（FAQ）的标准模板和编写规范。

## 1. FAQ 标准格式

每个 FAQ 条目使用以下格式：

```markdown
### Q: [问题描述]

A: [回答内容]

**详细说明**：
1. 步骤一
2. 步骤二

**相关链接**：[链接文字](URL)

**相关技能**：[技能名称](/skills/[slug])
```

## 2. 必需的 FAQ 类型

每个教程应至少包含以下 4 类 FAQ：

### 2.1 安装和配置问题

#### 模板：安装失败

```markdown
### Q: 安装 OpenClaw 时提示权限错误怎么办？

A: 这是常见问题，通常有以下几种解决方案：

**方案 1：使用 sudo 安装（Linux/macOS）**
```bash
$ sudo npm install -g @openclaw/cli
```

**方案 2：使用 npx 直接运行（无需安装）**
```bash
$ npx @openclaw/cli [命令]
```

**方案 3：配置 npm 全局目录**
```bash
# 创建自定义全局目录
$ mkdir ~/.npm-global
# 配置 npm 使用该目录
$ npm config set prefix '~/.npm-global'
# 添加到 PATH（在 ~/.bashrc 或 ~/.zshrc 中）
$ export PATH=~/.npm-global/bin:$PATH
```

**相关文档**：[OpenClaw 安装指南](https://docs.openclaw.dev/install)
```

#### 模板：配置文件找不到

```markdown
### Q: 提示"找不到配置文件"错误？

A: 确保配置文件位于正确的位置：

**默认配置文件位置**：
- Linux/macOS: `~/.openclaw/config.yaml`
- Windows: `%USERPROFILE%\.openclaw\config.yaml`

**检查配置文件**：
```bash
# 查看配置文件位置
$ openclaw config path

# 验证配置文件
$ openclaw config validate
```

**创建默认配置**：
```bash
$ openclaw config init
```

**相关技能**：[配置管理技能](/skills/config-management)
```

### 2.2 使用问题

#### 模板：命令执行失败

```markdown
### Q: 运行命令时提示"命令不存在"？

A: 检查以下几点：

**1. 确认 OpenClaw 已安装**
```bash
$ openclaw version
```

如果提示命令不存在，说明 OpenClaw 未正确安装或未在 PATH 中。

**2. 检查 PATH 环境变量**
```bash
# 查看 PATH
$ echo $PATH  # Linux/macOS
> echo %PATH% # Windows
```

确认 OpenClaw 安装目录在 PATH 中。

**3. 重新安装 OpenClaw**
```bash
$ npm uninstall -g @openclaw/cli
$ npm install -g @openclaw/cli
```

**相关教程**：[5 分钟上手 OpenClaw](/tutorial/getting-started-with-openclaw)
```

#### 模板：权限不足

```markdown
### Q: 执行操作时提示权限不足？

A: 根据操作类型选择解决方案：

**API 权限问题**：
检查 API 密钥权限，确保具有所需权限：
```bash
$ openclaw auth verify
```

**文件访问权限**：
```bash
# Linux/macOS: 使用 sudo
$ sudo openclaw [命令]

# 或修改文件权限
$ chmod +x file.sh
```

**技能权限问题**：
某些技能需要特定权限，查看技能文档了解要求。

**相关技能**：[权限管理](/skills/permission-management)
```

### 2.3 性能和优化问题

#### 模板：运行速度慢

```markdown
### Q: 操作执行很慢，如何优化？

A: 性能问题通常有以下几个原因和解决方案：

**1. 网络延迟**
- 使用离线模式（如果支持）
- 配置代理设置
- 选择更近的服务器区域

**2. 并发处理**
```bash
# 增加并发数
$ openclaw run --parallel 4
```

**3. 缓存配置**
```yaml
# config.yaml
cache:
  enabled: true
  ttl: 3600
```

**4. 模型选择**
- 对于简单任务使用更快的模型
- 启用流式输出
- 减少 maxTokens

**相关教程**：[性能优化指南](/tutorial/performance-optimization)
```

### 2.4 错误排查

#### 模板：通用错误排查

```markdown
### Q: 遇到错误时如何排查问题？

A: 按照以下步骤系统性地排查问题：

**步骤 1：查看详细错误信息**
```bash
# 启用详细日志
$ openclaw [命令] --verbose

# 或设置环境变量
$ export OPENCLAW_DEBUG=1
```

**步骤 2：检查版本**
```bash
$ openclaw version
$ openclaw check-updates
```

**步骤 3：验证配置**
```bash
$ openclaw config validate
$ openclaw config show
```

**步骤 4：查看日志文件**
```bash
# 日志位置
$ openclaw logs path
$ openclaw logs tail
```

**步骤 5：重置配置（最后手段）**
```bash
# 备份现有配置
$ cp ~/.openclaw/config.yaml ~/.openclaw/config.yaml.backup

# 重置为默认配置
$ openclaw config reset
```

**获取帮助**：
- [官方文档](https://docs.openclaw.dev)
- [GitHub Issues](https://github.com/openclaw/openclaw/issues)
- [社区论坛](https://community.openclaw.dev)
```

#### 模板：特定错误代码

```markdown
### Q: 错误代码 E001 表示什么？

A: 错误代码 E001 表示 API 密钥无效或已过期。

**解决方案**：

1. **验证 API 密钥**
```bash
$ openclaw auth verify
```

2. **重新生成 API 密钥**
- 访问 [OpenClaw 控制台](https://console.openclaw.dev)
- 生成新的 API 密钥
- 更新配置文件

3. **更新配置**
```yaml
# config.yaml
auth:
  apiKey: sk-new-api-key-here
```

**相关技能**：[API 管理](/skills/api-management)
```

### 2.5 最佳实践

#### 模板：生产环境配置

```markdown
### Q: 生产环境部署有哪些注意事项？

A: 生产环境需要特别注意以下配置：

**1. 安全配置**
```yaml
# 使用环境变量存储敏感信息
auth:
  apiKey: ${OPENCLAW_API_KEY}

# 启用加密
security:
  encryption: true
```

**2. 性能配置**
```yaml
# 启用缓存
cache:
  enabled: true
  redisUrl: ${REDIS_URL}

# 配置并发
concurrency:
  maxWorkers: 4
  queueSize: 100
```

**3. 监控配置**
```yaml
# 启用日志
logging:
  level: info
  format: json
  output: /var/log/openclaw.log

# 启用监控
monitoring:
  enabled: true
  metricsEndpoint: /metrics
```

**4. 错误处理**
```yaml
# 重试配置
retry:
  maxAttempts: 3
  backoff: exponential
```

**相关教程**：[生产环境部署指南](/tutorial/production-deployment)
```

## 3. FAQ 编写规范

### 3.1 问题描述

- [ ] 使用清晰、具体的问题描述
- [ ] 从用户角度描述问题
- [ ] 包含常见的关键词（便于搜索）
- [ ] 一个问题只关注一个主题

### 3.2 回答内容

- [ ] 提供直接的解决方案
- [ ] 按步骤编号说明
- [ ] 包含可执行的代码示例
- [ ] 说明每一步的作用
- [ ] 提供替代方案（如有）

### 3.3 代码示例

- [ ] 代码可以实际运行
- [ ] 包含必要的注释
- [ ] 标注命令用途
- [ ] 显示预期输出

### 3.4 相关链接

每个 FAQ 应包含：

- **相关文档**：官方文档链接
- **相关教程**：内部教程链接
- **相关技能**：技能详情页链接（仓库必须可访问）

## 4. FAQ 数量建议

按难度级别建议的 FAQ 数量：

| 难度 | 最少 FAQ | 推荐数量 | 必含类型 |
|------|----------|----------|----------|
| Beginner | 3-4 | 5-6 | 安装、配置、基础使用 |
| Intermediate | 4-5 | 7-8 | 配置、错误排查、优化 |
| Advanced | 5-6 | 8-10 | 性能调优、故障排查、架构 |

## 5. FAQ 组织方式

### 按主题分类

```markdown
## 安装和配置

### Q: ...
### Q: ...

## 使用问题

### Q: ...
### Q: ...

## 性能优化

### Q: ...
```

### 按难度分类

```markdown
## 基础问题

### Q: ...

## 进阶问题

### Q: ...
```

### 按场景分类

```markdown
## 开发环境

### Q: ...

## 生产环境

### Q: ...
```

## 6. FAQ 维护

### 定期更新

- [ ] 每月检查 FAQ 是否需要更新
- [ ] 根据用户反馈添加新 FAQ
- [ ] 更新过时的解决方案
- [ ] 验证所有链接仍然有效

### 反馈收集

通过以下方式收集 FAQ 需求：

- GitHub Issues
- 用户反馈
- 支持工单
- 社区讨论

## 7. FAQ 检查清单

发布前检查：

- [ ] FAQ 覆盖常见问题
- [ ] 所有代码示例可运行
- [ ] 所有链接有效
- [ ] 相关技能仓库可访问
- [ ] 语言简洁易懂
- [ ] 技术术语准确
- [ ] 包含多种解决方案（如适用）
- [ ] 格式统一规范
- [ ] 分类清晰合理

## 8. FAQ 示例

完整的 FAQ 章节示例：

```markdown
## 常见问题 (FAQ)

### 安装和配置

### Q: 如何在 Windows 上安装 OpenClaw？

A: Windows 上安装 OpenClaw 有多种方式：

**推荐：使用 npm 安装**
```powershell
> npm install -g @openclaw/cli
```

**验证安装**
```powershell
> openclaw version
OpenClaw CLI v1.2.3
```

**如果遇到权限问题**
```powershell
# 以管理员身份运行 PowerShell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Q: 配置文件位于哪里？

A: 配置文件位置取决于操作系统：

- **Windows**: `%USERPROFILE%\.openclaw\config.yaml`
- **Linux/macOS**: `~/.openclaw/config.yaml`

**查看配置文件位置**
```bash
$ openclaw config path
```

### 使用问题

### Q: 如何更改使用的模型？

A: 可以通过配置文件或命令行参数更改模型：

**方式 1：配置文件**
```yaml
# config.yaml
model:
  name: claude-3-opus
  temperature: 0.7
```

**方式 2：命令行参数**
```bash
$ openclaw run --model claude-3-opus --temperature 0.7
```

**可用模型列表**
```bash
$ openclaw models list
```

### Q: 如何启用调试模式？

A: 使用 `--verbose` 参数或设置环境变量：

```bash
# 方式 1：命令行参数
$ openclaw run --verbose

# 方式 2：环境变量
$ export OPENCLAW_DEBUG=1
$ openclaw run
```

### 性能优化

### Q: 如何提高响应速度？

A: 以下优化可以提高响应速度：

1. **使用缓存**
```yaml
cache:
  enabled: true
  ttl: 3600
```

2. **增加并发**
```bash
$ openclaw run --parallel 4
```

3. **使用更快的模型**
```bash
$ openclaw run --model claude-3-haiku
```

### 错误排查

### Q: 遇到"API 密钥无效"错误？

A: 按以下步骤排查：

1. **验证 API 密钥**
```bash
$ openclaw auth verify
```

2. **检查配置文件**
```bash
$ openclaw config show
```

3. **重新设置密钥**
```bash
$ openclaw auth login
```

### 获取更多帮助

如果以上 FAQ 没有解决你的问题：

- 查看 [官方文档](https://docs.openclaw.dev)
- 搜索 [GitHub Issues](https://github.com/openclaw/openclaw/issues)
- 加入 [社区论坛](https://community.openclaw.dev)
- 联系技术支持：support@openclaw.dev
```

---

**FAQ 编写原则**

1. **用户导向**：从用户角度描述问题
2. **具体明确**：问题描述具体，解决方案明确
3. **可执行性**：提供可直接执行的命令和代码
4. **完整性**：包含多种解决方案（如适用）
5. **相关性**：关联相关文档和技能（仓库必须可访问）
6. **时效性**：定期更新，确保信息准确
