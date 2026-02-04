# 部署指南

本指南说明如何将 OpenClaw 实战指南部署到 Vercel。

## 前置条件

- Node.js 18+ 已安装
- Git 已安装
- Vercel 账户（[免费注册](https://vercel.com/signup)）
- GitHub 账户

## 方法一：通过 Vercel Dashboard 部署（推荐）

### 1. 准备 Git 仓库

```bash
# 如果还没有推送到 GitHub
git init
git add .
git commit -m "Initial commit"
# 创建 GitHub 仓库后
git remote add origin https://github.com/YOUR_USERNAME/your-repo.git
git push -u origin main
```

### 2. 在 Vercel 导入项目

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New..." -> "Project"
3. 导入你的 GitHub 仓库
4. Vercel 会自动检测 Next.js 项目

### 3. 配置项目设置

Vercel 会自动识别 Next.js 配置，但请确认以下设置：

**Framework Preset**: Next.js

**Build and Output Settings**:
- Build Command: `npm run build`（自动检测）
- Output Directory: `out`（自动检测）
- Install Command: `npm install`（自动检测）

### 4. 部署

点击 "Deploy" 按钮，Vercel 会：
1. 安装依赖
2. 运行构建命令
3. 生成静态文件
4. 部署到 CDN

部署完成后，你会获得一个 `.vercel.app` 域名。

### 5. 配置自定义域名（可选）

1. 在 Vercel 项目设置中，选择 "Domains"
2. 添加你的自定义域名
3. 按照提示配置 DNS 记录

## 方法二：通过 Vercel CLI 部署

### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

### 2. 登录 Vercel

```bash
vercel login
```

### 3. 部署项目

```bash
# 在项目根目录执行
vercel
```

按照提示操作：
- ? Set up and deploy "~/your-project"? [Y/n] Y
- ? Which scope do you want to deploy to? (选择你的账户)
- ? Link to existing project? [y/N] N
- ? What's your project's name? openclaw-hub
- ? In which directory is your code located? ./

Vercel 会自动检测 Next.js 配置并部署。

### 4. 生产部署

```bash
vercel --prod
```

## 验证构建

在部署前，确保本地构建成功：

```bash
# 安装依赖
npm install

# 运行构建
npm run build

# 验证 out/ 目录生成
ls -la out/
```

你应该看到：
- `index.html` - 主页
- `skills/index.html` - 技能页面
- `tutorial/[slug].html` - 教程详情页
- `_next/` - Next.js 静态资源

## 部署后验证清单

部署完成后，检查以下内容：

### 功能验证

- [ ] 主页可以访问（https://your-domain.vercel.app）
- [ ] 教程列表显示正常
- [ ] 点击教程卡片可以进入详情页
- [ ] 搜索功能正常工作
- [ ] 分类筛选功能正常
- [ ] 技能索引页可以访问
- [ ] 所有链接可以正常跳转

### 性能验证

- [ ] 页面加载速度正常（Lighthouse 分数 > 90）
- [ ] 静态资源正确加载（无 404 错误）
- [ ] 控制台无 JavaScript 错误

### SEO 验证

- [ ] 页面 title 正确显示
- [ ] meta description 存在
- [ ] Open Graph 标签存在（可在社交媒体预览）

### 移动端验证

- [ ] 在手机上访问，布局正常
- [ ] 搜索框可以正常输入
- [ ] 按钮可以正常点击

## 常见问题

### Q: 构建失败怎么办？

A: 检查以下几点：
1. 确认 `package.json` 中的 `build` 脚本正确
2. 查看构建日志找出具体错误
3. 确认所有依赖都在 `package.json` 中

### Q: 部署后页面显示 404

A: 确认以下几点：
1. `next.config.ts` 中配置了 `output: 'export'`
2. 构建成功生成了 `out/` 目录
3. Vercel 的输出目录设置为 `out`

### Q: 如何更新部署？

A: 只需推送新代码到 GitHub：
```bash
git add .
git commit -m "Update content"
git push
```
Vercel 会自动重新部署。

### Q: 如何回滚到之前的版本？

A:
1. 在 Vercel Dashboard 中进入项目
2. 点击 "Deployments"
3. 找到想要回滚的版本
4. 点击 "Promote to Production"

## 环境变量（可选）

如果需要配置环境变量：

1. 在 Vercel 项目设置中，选择 "Environment Variables"
2. 添加变量名和值
3. 重新部署项目

本项目不需要环境变量即可运行。

## 监控和日志

Vercel 提供：
- **Analytics**: 访问分析和性能监控
- **Logs**: 实时日志和错误追踪
- **Speed Insights**: 页面加载速度分析

访问 Vercel Dashboard 查看这些信息。

## 成本和限制

**Vercel 免费套餐**：
- 无限带宽
- 100GB 部署/月
- 100 次构建/天
- 自动 HTTPS
- 全球 CDN

对于本项目（静态站点），免费套餐完全够用。

## 生产环境建议

1. **启用自动 HTTPS**: Vercel 默认启用
2. **配置自定义域名**: 提升品牌形象
3. **设置构建缓存**: 加快构建速度
4. **监控错误**: 使用 Vercel Logs 或集成第三方服务
5. **定期更新依赖**: 保持安全性

## 相关链接

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [项目仓库](https://github.com/YOUR_USERNAME/openclaw-hub)
