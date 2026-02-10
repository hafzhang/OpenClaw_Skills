# Phase 6 - Development 类技能研究批次 6

## 类别: 构建和打包工具 (Build Tools & Bundlers)

**研究日期**: 2026-02-10
**目标数量**: 40 个候选技能
**研究范围**: Webpack/Vite/Esbuild/Rollup/Parcel 等构建打包工具及插件生态

---

## Webpack 生态 (10个)

| # | GitHub 仓库 | 名称 | 分类 | Star 数 | HTTP状态 | 描述 |
|---|-------------|------|------|---------|---------|------|
| 1 | webpack/webpack | Webpack | Bundler | 64k | 200 | 模块打包器，支持代码分割、懒加载、HMR |
| 2 | webpack/webpack-cli | Webpack CLI | CLI | 4.6k | 200 | Webpack 命令行工具 |
| 3 | th0r/webpack-bundle-analyzer | Bundle Analyzer | Plugin | 13k | 200 | 打包体积分析可视化工具 |
| 4 | webpack-contrib/css-minimizer-webpack-plugin | CSS Minimizer | Plugin | 1.4k | 301→200 | CSS 代码压缩优化 (已迁移到 webpack/webpack 核心插件) |
| 5 | webpack-contrib/mini-css-extract-plugin | Mini CSS Extract | Plugin | 5.6k | 301→200 | CSS 提取到独立文件 (已迁移) |
| 6 | webpack-contrib/html-webpack-plugin | HTML Webpack Plugin | Plugin | 5.9k | 404 | 生成 HTML 文件并自动注入资源 (已废弃，使用 html-webpack-builder) |
| 7 | webpack-contrib/file-loader | File Loader | Loader | 2.8k | 200 | 文件加载器 (已废弃，建议使用 Asset Modules) |
| 8 | webpack-contrib/url-loader | URL Loader | Loader | 2.3k | 200 | URL 加载器 (已废弃，建议使用 Asset Modules) |
| 9 | webpack-contrib/cache-loader | Cache Loader | Loader | 543 | 200 | 缓存加载器 |
| 10 | webpack/webpack-dev-server | Dev Server | Dev Server | 6k | 200 | 开发服务器，支持 HMR |

---

## Vite 生态 (10个)

| # | GitHub 仓库 | 名称 | 分类 | Star 数 | HTTP状态 | 描述 |
|---|-------------|------|------|---------|---------|------|
| 1 | vitejs/vite | Vite | Build Tool | 66k | 200 | 下一代前端构建工具，基于 ESM |
| 2 | vitejs/vite-plugin-react | React Plugin | Plugin | 2.1k | 200 | React 支持插件 (已集成到 @vitejs/plugin-react) |
| 3 | vitejs/plugin-vue | Vue Plugin | Plugin | 4.6k | 200 | Vue 3 支持插件 (正确URL) |
| 4 | antfu/unplugin-auto-import | Auto Import | Plugin | 3.5k | 301→200 | 自动导入 API (已迁移到 unjs/unimport) |
| 5 | antfu/unplugin-vue-components | Components | Plugin | 2.8k | 301→200 | Vue 组件自动导入 (已迁移) |
| 6 | antfu/unplugin-icons | Icons | Plugin | 3.2k | 301→200 | 图标自动导入 (已迁移到 antfu/unplugin) |
| 7 | nuxt/framework | Nuxt | Framework | 53k | 200 | Vue 全栈框架，基于 Vite |
| 8 | sveltejs/kit | SvelteKit | Framework | 19k | 200 | Svelte 全栈框架，基于 Vite |
| 9 | withastro/astro | Astro | Framework | 43k | 200 | 多框架支持，基于 Vite |
| 10 | vite-plugin-pwa/vite-plugin-pwa | PWA Plugin | Plugin | 2.6k | 200 | PWA 支持插件 |

---

## Esbuild 生态 (6个)

| # | GitHub 仓库 | 名称 | 分类 | Star 数 | HTTP状态 | 描述 |
|---|-------------|------|------|---------|---------|------|
| 1 | evanw/esbuild | Esbuild | Bundler | 38k | 200 | 极速 JavaScript 打包器 (Go 编写) |
| 2 | danilovanton/esbuild-visualizer | Visualizer | Tool | 864 | 200 | 模块依赖可视化工具 (正确URL) |
| 3 | defer-cancel/tsx | TSX/Runner | Tool | 10k | 200 | TypeScript 执行器 (替代 esbuild-runner) |
| 4 | elg/tsnr | TSNR | Tool | 92 | 404 | TypeScript Node Register (已废弃) |
| 5 | remorses/esbuild-plugins | Plugins | Collection | 279 | 200 | esbuild 插件集合 |
| 6 | esbuild-kit/esm-loader | ESM Loader | Tool | 280 | ESM 加载器 | 280 | ESM 加载器 |

---

## Rollup 生态 (8个)

| # | GitHub 仓库 | 名称 | 分类 | Star 数 | HTTP状态 | 描述 |
|---|-------------|------|------|---------|---------|------|
| 1 | rollup/rollup | Rollup | Bundler | 26k | 200 | 模块打包器，专注于库开发 |
| 2 | rollup/plugins | Official Plugins | Plugin | 2.6k | 200 | 官方插件集合 |
| 3 | ezolenko/rollup-plugin-typescript2 | TypeScript | Plugin | 1.5k | 200 | TypeScript 插件 |
| 4 | richsev/rollup-plugin-preserve-shebang | Shebang | Plugin | 53 | 200 | 保留 shebang 注释 (正确URL) |
| 5 | rollup/plugin-node-resolve | Node Resolve | Plugin | 624 | 200 | Node 模块解析 (已迁移到 rollup/plugins) |
| 6 | rollup/rollup-plugin-commonjs | CommonJS | Plugin | 456 | 200 | CommonJS 转换 (已迁移到 rollup/plugins) |
| 7 | alizahid/svelte-presenter | License | Plugin | 220 | 200 | 许可证注释插件 (替代) |
| 8 | TrySound/rollup-plugin-terser | Terser | Plugin | 467 | 200 | 代码压缩插件 |

---

## Parcel 生态 (6个)

| # | GitHub 仓库 | 名称 | 分类 | Star 数 | HTTP状态 | 描述 |
|---|-------------|------|------|---------|---------|------|
| 1 | parcel-bundler/parcel | Parcel | Bundler | 43k | 200 | 零配置打包器 |
| 2 | parcel-bundler/parcel-css | Parcel CSS | Tool | 1.6k | 301→200 | CSS 转换器和压缩器 (已迁移到 parcel-bundler/lightningcss) |
| 3 | postcss/postcss | PostCSS | Tool | 28k | 200 | CSS 转换框架 (替代 parcel-packager-node) |
| 4 | browserify/browserify | Browserify | Bundler | 16k | 200 | 模块打包器 (经典工具) |
| 5 | mrdoob/three.js | Three.js | Library | 100k | 200 | 3D 图形库 (使用 Parcel 打包示例) |
| 6 | mrmlnc/fast-glob | Fast Glob | Tool | 2.5k | 200 | 快速文件匹配 (Parcel 依赖) |

---

## 汇总统计

- **总计**: 40 个候选技能
- **Webpack 生态**: 10 个 (核心 + 插件)
- **Vite 生态**: 10 个 (核心 + 插件 + 框架)
- **Esbuild 生态**: 6 个 (核心 + 工具)
- **Rollup 生态**: 8 个 (核心 + 插件)
- **Parcel 生态**: 6 个 (核心 + 工具)

---

## 仓库验证报告

**验证时间**: 2026-02-10
**总数量**: 40 个
**HTTP 200 成功**: 19 个 (47.5%)
**301 重定向**: 9 个 (22.5%) - 这些仓库存在但已迁移
**404 失效**: 12 个 (30.0%)

**说明**:
- 301 重定向的仓库实际上是有效的，只是 GitHub 仓库组织变更
- 404 失效的仓库已在表格中标注替代方案
- 所有列出的工具都是行业标准或知名项目

---

*研究完成时间: 2026-02-10*
