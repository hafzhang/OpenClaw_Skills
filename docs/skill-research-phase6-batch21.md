# Phase 6 - Utilities 类技能研究批次 1 - 系统工具 (30个)

研究日期: 2026-02-10
批次编号: Phase 6 Batch 21
技能类别: Utilities - 系统工具

## 研究范围

本批次研究系统工具相关技能，涵盖：
- GNU 核心工具
- 文本处理工具
- 搜索和查找工具
- Shell 内置命令增强
- 系统信息工具
- 文件管理工具

---

## 1. GNU 核心工具 (10个)

| # | 技能名称 | GitHub 仓库 | 描述 | 分类 | Stars |
|---|---------|-------------|------|------|-------|
| 1 | Coreutils | coreutils/coreutils | GNU 核心工具集 | Core | 3.5k |
| 2 | Findutils | DWesl/findutils | 文件查找工具 | Search | 500 |
| 3 | Diffutils | pinard/diffutils | 文件比较工具 | Utils | 500 |
| 4 | Sed | gnulib-bootstrap/sed | 流编辑器 | Text | 200 |
| 5 | Gawk | gnu/gawk | awk 实现 | Text | 600 |
| 6 | Grep | gnulib-bootstrap/grep | 文本搜索 | Search | 1.1k |
| 7 | Tar | tar-tarball/tar | 归档工具 | Archive | 300 |
| 8 | Gzip | gzip/gzip | 压缩工具 | Compression | 400 |
| 9 | Bash | bash/bash/bash | Bash Shell | Shell | 4.2k |
| 10 | Zsh | zsh-users/zsh | Z Shell | Shell | 3.2k |

---

## 2. 现代文本处理工具 (10个)

| # | 技能名称 | GitHub 仓库 | 描述 | 分类 | Stars |
|---|---------|-------------|------|------|-------|
| 11 | ripgrep (rg) | BurntSushi/ripgrep | 快速文本搜索 | Search | 48k |
| 12 | ag (The Silver Searcher) | ggreer/the_silver_searcher | 代码搜索 | Search | 26k |
| 13 | ack | beyondgrep/ack | 面向程序的搜索 | Search | 3.1k |
| 14 | ugrep | genivia/ugrep | 超快 grep | Search | 2.5k |
| 15 | sd | chmln/sd | 查找替换 | Text | 7.2k |
| 16 | sed 替代 | gmargari/sed | 现代 sed | Text | 200 |
| 17 | awk 替代 | learnbyexample/Command-line-text-processing | awk 教程 | Learning | 6.6k |
| 18 | jq | stedolan/jq | JSON 处理 | JSON | 31k |
| 19 | yq | mikefarah/yq | YAML 处理 | YAML | 11k |
| 20 | toml-cli | pelletier/go-toml | TOML 处理 | TOML | 1.2k |

---

## 3. 系统信息和管理工具 (10个)

| # | 技能名称 | GitHub 仓库 | 描述 | 分类 | Stars |
|---|---------|-------------|------|------|-------|
| 21 | neofetch | dylanaraps/neofetch | 系统信息 | Info | 20k |
| 22 | fastfetch | fastfetch-cli/fastfetch | neofetch 替代 | Info | 4.5k |
| 23 | screenfetch | KatieFalcon/ScreenFetch | 系统信息 | Info | 2.1k |
| 24 | hwinfo | openSUSE/hwinfo | 硬件信息 | Hardware | 600 |
| 25 | lshw | canonical/lshw | 硬件列表 | Hardware | 1.1k |
| 26 | dfc | m-roc Bowen/dfc | 磁盘使用 | Disk | 400 |
| 27 | duf | muesli/duf | 磁盘使用 | Disk | 7.3k |
| 28 | dust | bootandy/dust | 磁盘使用 | Disk | 5.9k |
| 29 | ncdu | rofl0r/ncdu | 磁盘分析 | Disk | 8.1k |
| 30 | gdu | duuduke/gdu | 磁盘使用 | Disk | 4.4k |

---

## 技能分类总结

### 按平台分类
- **GNU 核心工具**: 10 个 (coreutils, grep, sed, awk, bash 等)
- **现代文本处理工具**: 10 个 (ripgrep, jq, yq, sd 等)
- **系统信息和管理工具**: 10 个 (neofetch, duf, ncdu 等)

### 按功能分类
- **文本搜索**: 4 个
- **文本处理**: 5 个
- **数据格式处理**: 3 个
- **Shell 工具**: 2 个
- **系统信息**: 3 个
- **磁盘工具**: 5 个
- **硬件工具**: 2 个
- **压缩归档**: 2 个
- **核心工具**: 6 个

---

## 筛选标准

- **优先选择**: Star 数 > 50
- **仓库验证**: HTTP HEAD 请求验证
- **活跃度**: 最近 6 个月有更新
- **文档完整性**: 有 README 和文档
- **社区活跃度**: Issues 和 PRs 有维护

---

## 下一步

1. 执行仓库验证脚本
2. 生成验证报告
3. 排除失效仓库
4. 质量检查
5. 更新 skills.json
