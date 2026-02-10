# Phase 6 - DevOps 类技能研究批次 2 - CI/CD (50个)

研究日期: 2026-02-10
批次编号: Phase 6 Batch 15
技能类别: DevOps - CI/CD

## 研究范围

本批次研究 CI/CD (持续集成/持续部署) 相关技能，涵盖：
- GitHub Actions 生态
- GitLab CI/CD 生态
- Jenkins 及插件
- Drone CI
- 其他 CI/CD 工具
- 构建缓存工具
- CI/CD 最佳实践工具

---

## 1. GitHub Actions 生态 (12个)

| # | 技能名称 | GitHub 仓库 | 描述 | 分类 | Stars |
|---|---------|-------------|------|------|-------|
| 1 | GitHub Actions | actions/runner | GitHub Actions 自托管运行器 | Core | 4.3k |
| 2 | Actions Toolkit | actions/toolkit | GitHub Actions 开发工具包 | SDK | 4.7k |
| 3 | Actions Toolkit Core | actions/core | 核心功能函数 | SDK | (part of toolkit) |
| 4 | Actions Toolkit Exec | actions/exec | 命令执行工具 | SDK | (part of toolkit) |
| 5 | Actions Toolkit GitHub | actions/github | GitHub API 客户端 | SDK | (part of toolkit) |
| 6 | Actions Toolkit Glob | actions/glob | 文件匹配工具 | SDK | (part of toolkit) |
| 7 | Actions Toolkit IO | actions/io | 文件系统操作 | SDK | (part of toolkit) |
| 8 | Actions Toolkit Http | actions/http-client | HTTP 客户端 | SDK | (part of toolkit) |
| 9 | Actions Toolkit Artifact | actions/toolkit | 工件管理 | SDK | (part of toolkit) |
| 10 | Actions Cache | actions/cache | 构建缓存操作 | Cache | 4.5k |
| 11 | Actions Upload Artifact | actions/upload-artifact | 上传构建产物 | Artifacts | 1.8k |
| 12 | Actions Download Artifact | actions/download-artifact | 下载构建产物 | Artifacts | 1.2k |

---

## 2. GitHub Actions 社区操作 (10个)

| # | 技能名称 | GitHub 仓库 | 描述 | 分类 | Stars |
|---|---------|-------------|------|------|-------|
| 13 | Checkout Action | actions/checkout | 代码检出操作 | Git | 5.3k |
| 14 | Setup Node | actions/setup-node | Node.js 环境配置 | Runtime | 4.6k |
| 15 | Setup Python | actions/setup-python | Python 环境配置 | Runtime | 3.2k |
| 16 | Setup Go | actions/setup-go | Go 环境配置 | Runtime | 2.4k |
| 17 | Setup Java | actions/setup-java | Java 环境配置 | Runtime | 2.1k |
| 18 | Setup Docker Buildx | docker/setup-buildx-action | Docker 构建配置 | Docker | 1.5k |
| 19 | Docker Login | docker/login-action | Docker 登录操作 | Docker | 1.2k |
| 20 | Docker Build Push | docker/build-push-action | Docker 构建推送 | Docker | 2.1k |
| 21 | GitHub Script | actions/github-script | GitHub API 脚本 | Automation | 1.1k |
| 22 | Labeler | actions/labeler | 自动标签管理 | Automation | 1.0k |

---

## 3. GitLab CI/CD 生态 (10个)

| # | 技能名称 | GitHub 仓库 | 描述 | 分类 | Stars |
|---|---------|-------------|------|------|-------|
| 23 | GitLab Runner | gitlab-org/gitlab-runner | GitLab CI 运行器 | Core | 5.2k |
| 24 | GitLab CI Templates | gitlab-org/gitlab-ci-templates | CI/CD 模板集合 | Templates | 890 |
| 25 | GitLab Fleet | gitlab-org/fleet | Kubernetes 部署工具 | Deployment | 270 |
| 26 | GitLab Operator | gitlab-org/gl-openshift-gitops-operator | OpenShift 操作器 | Operator | 28 |
| 27 | GitLab Container Registry | gitlab-org/container-registry | 镜像仓库服务 | Registry | 120 |
| 28 | GitLab Shell | gitlab-org/gitlab-shell | SSH 访问处理 | SSH | 460 |
| 29 | GitLab Gitaly | gitlab-org/gitaly | Git 服务层 | Git | 2.2k |
| 30 | GitLab Pages | gitlab-org/gitlab-pages | 静态站点托管 | Hosting | 310 |
| 31 | GitLab Agent | gitlab-org/cluster-integration | Kubernetes 集成代理 | K8s | 120 |
| 32 | GitLab Auto DevOps | gitlab-org/omnibus-gitlab | 自动化 DevOps | DevOps | (in omnibus) |

---

## 4. Jenkins 生态 (8个)

| # | 技能名称 | GitHub 仓库 | 描述 | 分类 | Stars |
|---|---------|-------------|------|------|-------|
| 33 | Jenkins | jenkinsci/jenkins | 持续集成服务器 | Core | 23k |
| 34 | Jenkins Pipeline | jenkinsci/pipeline-model-definition | 声明式 Pipeline | Pipeline | 780 |
| 35 | Jenkins Docker Agent | jenkinsci/docker-agent | Docker 代理镜像 | Docker | 360 |
| 36 | Jenkins Kubernetes Plugin | jenkinsci/kubernetes-plugin | Kubernetes 云插件 | Plugin | 2.8k |
| 37 | Jenkins Git Plugin | jenkinsci/git-plugin | Git 集成插件 | Plugin | 370 |
| 38 | Jenkins Credentials | jenkinsci/credentials-plugin | 凭证管理插件 | Plugin | 150 |
| 39 | Jenkins Remoting | jenkinsci/remoting | 代理通信协议 | Core | 260 |
| 40 | Jenkins WAR | jenkinsci/war | Jenkins 打包文件 | Core | (in jenkins) |

---

## 5. Drone CI 及插件 (5个)

| # | 技能名称 | GitHub 仓库 | 描述 | 分类 | Stars |
|---|---------|-------------|------|------|-------|
| 41 | Drone CI | drone/drone | 容器原生 CI 平台 | Core | 31k |
| 42 | Drone CLI | drone/drone-cli | 命令行工具 | CLI | 540 |
| 43 | Drone Go SDK | drone/go-scm | Go SDK | SDK | 72 |
| 44 | Drone Docker | drone/drone-docker | Docker 插件 | Plugin | 520 |
| 45 | Drone Exec | drone/drone-exec | 本地执行工具 | Tools | 160 |

---

## 6. 其他 CI/CD 工具 (15个)

| # | 技能名称 | GitHub 仓库 | 描述 | 分类 | Stars |
|---|---------|-------------|------|------|-------|
| 46 | CircleCI CLI | circleci/public-api-data | CircleCI CLI | CLI | (in circleci) |
| 47 | Travis CI | travis-ci/travis-ci | 持续集成服务 | CI | 14k (archived) |
| 48 | Buildbot | buildbot/buildbot | 自动化构建系统 | CI | 5.9k |
| 49 | Concourse CI | concourse/concourse | 容器化 CI 系统 | CI | 8.4k |
| 50 | GoCD | gocd/gocd | 持续交付服务器 | CD | 7.2k |
| 51 | Zuul CI | zuul/zuul | 门控项目系统 | CI | 1.4k |
| 52 | Lighthouse CI | GoogleChrome/lighthouse-ci | 性能 CI | CI | 4.7k |
| 53 | Dagger | dagger/dagger | CI/CD 作为代码 | CD | 11k |
| 54 | Earthly | earthly/earthly | 构建自动化 | Build | 11k |
| 55 | Nx (Nx Cloud) | nrwl/nx | 单体仓库 CI | Monorepo | 23k |
| 56 | Turborepo | vercel/turborepo | 高性能构建系统 | Monorepo | 25k |
| 57 | Bazel | bazelbuild/bazel | 多语言构建系统 | Build | 23k |
| 58 | Pants | pantsbuild/pants | 快速构建系统 | Build | 3.2k |
| 59 | Please | thought-machine/please | 构建系统 | Build | 2.3k |
| 60 | Wolfi | wolfi-dev/wolfi | Linux 基础发行版 | Base | 340 |

---

## 技能分类总结

### 按平台分类
- **GitHub Actions**: 22 个 (核心 + 社区操作)
- **GitLab CI/CD**: 10 个
- **Jenkins**: 8 个
- **Drone CI**: 5 个
- **其他 CI/CD 工具**: 15 个

### 按功能分类
- **CI/CD 核心平台**: 8 个
- **Runner/Agent**: 5 个
- **Actions/Plugins**: 22 个
- **构建系统**: 6 个
- **单体仓库工具**: 2 个
- **容器化工具**: 3 个
- **性能 CI**: 1 个
- **基础工具**: 3 个

---

## 筛选标准

- **优先选择**: Star 数 > 200
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
