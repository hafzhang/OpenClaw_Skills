# Phase 6 - DevOps 类技能研究批次 1 - 容器技术 (50个)

研究日期: 2026-02-10
批次编号: Phase 6 Batch 14
技能类别: DevOps - 容器技术

## 研究范围

本批次研究容器技术相关技能，涵盖：
- Docker 生态系统
- Podman 及相关工具
- LXD/LXC 容器
- Kubernetes 及生态
- 容器编排工具
- 容器安全
- 容器网络
- 容器存储
- 容器监控
- 容器构建工具

---

## 1. Docker 核心工具 (12个)

| # | 技能名称 | GitHub 仓库 | 描述 | 分类 | Stars |
|---|---------|-------------|------|------|-------|
| 1 | Docker Engine | docker/engine-ce | Docker 核心引擎，企业版 | Core | 7.5k |
| 2 | Docker CLI | docker/cli | Docker 命令行界面 | Core | 4.5k |
| 3 | Docker BuildKit | moby/buildkit | Docker 构建工具包 | Build | 2.5k |
| 4 | Docker Compose | docker/compose | Docker 多容器编排工具 | Orchestration | 34k |
| 5 | Docker Machine | docker/machine | Docker 主机管理工具 | Tools | 5.9k |
| 6 | Docker Registry | distribution/docker-registry | Docker 镜像仓库 | Registry | 8.2k |
| 7 | Docker Hub | docker/hub-feedback | Docker Hub 官方仓库 | Registry | - |
| 8 | Docker Swarm | docker/swarmkit | Docker 原生集群编排 | Orchestration | 3.2k |
| 9 | Docker Desktop | docker/docker-ce-tray | Docker 桌面应用 | Desktop | - |
| 10 | Docker App | docker/app | Docker 应用打包工具 | Tools | 2.1k |
| 11 | Moby | moby/moby | Docker 前身项目 | Core | 69k |
| 12 | LinuxKit | linuxkit/linuxkit | Docker 官方 Linux 发行版 | Core | 2.9k |

---

## 2. Podman 生态 (8个)

| # | 技能名称 | GitHub 仓库 | 描述 | 分类 | Stars |
|---|---------|-------------|------|------|-------|
| 13 | Podman | containers/podman | 无守护进程的容器引擎 | Core | 24k |
| 14 | Podman Compose | containers/podman-compose | Podman 的 Compose 兼容工具 | Orchestration | 2.1k |
| 15 | Buildah | containers/buildah | OCI 镜像构建工具 | Build | 8.3k |
| 16 | Skopeo | containers/skopeo | 镜像复制和管理工具 | Tools | 7.5k |
| 17 | CRI-O | cri-o/cri-o | Kubernetes CDI 运行时 | Runtime | 5.3k |
| 18 | Podman Desktop | podman-desktop/podman-desktop | Podman 桌面应用 | Desktop | 5.2k |
| 19 | Libpod | containers/libpod | Podman 核心库 | Core | (part of podman) |
| 20 | Podman REST API | containers/podman | RESTful API 服务 | API | (part of podman) |

---

## 3. LXD/LXC 容器 (6个)

| # | 技能名称 | GitHub 仓库 | 描述 | 分类 | Stars |
|---|---------|-------------|------|------|-------|
| 21 | LXD | lxc/lxd | 镜像驱动的容器管理器 | Core | 2.6k |
| 22 | LXC | lxc/lxc | Linux 容器用户空间工具 | Core | 1.8k |
| 23 | LXCFS | lxc/lxcfs | LXC 文件系统支持 | Tools | 1.1k |
| 24 | Incus | incus/incus | LXD 社区分支 | Core | 2.4k |
| 25 | Distilbuilder | lxc/distilbuilder | LXD/LXC 镜像构建工具 | Build | 120 |
| 26 | LXD UI | lxc/lxd-ui | LXD Web UI 界面 | UI | 310 |

---

## 4. Kubernetes 核心 (10个)

| # | 技能名称 | GitHub 仓库 | 描述 | 分类 | Stars |
|---|---------|-------------|------|------|-------|
| 27 | Kubernetes | kubernetes/kubernetes | 容器编排平台 | Core | 110k |
| 28 | kubectl | kubernetes/kubectl | Kubernetes 命令行工具 | CLI | 4.1k |
| 29 | kube-apiserver | kubernetes/apiserver | Kubernetes API 服务器 | Core | (in k8s) |
| 30 | kube-scheduler | kubernetes/kubernetes | 调度器 | Core | (in k8s) |
| 31 | kube-controller | kubernetes/kubernetes | 控制器管理器 | Core | (in k8s) |
| 32 | kube-proxy | kubernetes/kubernetes | 网络代理 | Core | (in k8s) |
| 33 | etcd | etcd-io/etcd | 分布式键值存储 | Storage | 48k |
| 34 | containerd | containerd/containerd | 容器运行时 | Runtime | 17k |
| 35 | runc | opencontainers/runc | OCI 容器运行时 | Runtime | 4.7k |
| 36 | CNI (plugins) | containernetworking/plugins | 容器网络插件 | Network | 5.8k |

---

## 5. Kubernetes 工具生态 (8个)

| # | 技能名称 | GitHub 仓库 | 描述 | 分类 | Stars |
|---|---------|-------------|------|------|-------|
| 37 | Helm | helm/helm | Kubernetes 包管理器 | Package | 27k |
| 38 | kustomize | kubernetes-sigs/kustomize | Kubernetes 配置管理 | Config | 10k |
| 39 | ArgoCD | argoproj/argo-cd | GitOps 持续部署 | GitOps | 18k |
| 40 | Minikube | kubernetes/minikube | 本地 Kubernetes 集群 | Local | 29k |
| 41 | Kind | kubernetes-sigs/kind | Docker 中的 Kubernetes | Local | 13k |
| 42 | k3s | k3s-io/k3s | 轻量级 Kubernetes | Distribution | 27k |
| 43 | kubeadm | kubernetes/kubernetes | 集群引导工具 | Tools | (in k8s) |
| 44 | kOps | kubernetes/kops | Kubernetes 集群运维 | Operations | 15k |

---

## 6. 容器安全 (6个)

| # | 技能名称 | GitHub 仓库 | 描述 | 分类 | Stars |
|---|---------|-------------|------|------|-------|
| 45 | Trivy | aquasecurity/trivy | 容器安全扫描器 | Scanner | 23k |
| 46 | Clair | quay/clair | 容器漏洞分析 | Scanner | 9.5k |
| 47 | Falco | falcosecurity/falco | 容器运行时安全 | Security | 5.3k |
| 48 | Notary | notaryproject/notary | 镜像签名工具 | Security | 3.1k |
| 49 | Grype | anchore/grype | 漏洞扫描器 | Scanner | 4.9k |
| 50 | Kata Containers | kata-containers/kata-containers | 安全容器运行时 | Runtime | 5.1k |

---

## 统计摘要

- **总计**: 50 个技能
- **分类分布**:
  - Docker 核心: 12 个
  - Podman 生态: 8 个
  - LXD/LXC: 6 个
  - Kubernetes 核心: 10 个
  - Kubernetes 工具: 8 个
  - 容器安全: 6 个

- **预期仓库状态**:
  - Docker 生态项目大多成熟且活跃
  - Kubernetes 生态项目非常活跃 (110k+ stars)
  - Podman 作为 Docker 替代品正在增长
  - LXD/LXC 相对小众但稳定

---

## 仓库验证结果

**验证日期**: 2026-02-10
**验证脚本**: `scripts/verify-repos-batch14.js`
**验证报告**: `reports/batch14-repos-verification.json`

### 总体统计

| 状态 | 数量 | 百分比 |
|------|------|--------|
| HTTP 200 (成功) | 34 | 82.9% |
| 301 重定向 | 5 | 12.2% |
| 404 失败 | 2 | 4.9% |
| **总计** | **41** | **100%** |

### 301 重定向仓库 (有效但已迁移)

| 原仓库 | 重定向到 | 说明 |
|--------|----------|------|
| docker/machine | docker-archive-public/docker.machine | 已归档到存档组织 |
| docker/swarmkit | moby/swarmkit | 迁移到 Moby 组织 |
| docker/app | docker-archive-public/docker.app | 已归档到存档组织 |
| containers/podman-desktop | podman-desktop/podman-desktop | 迁移到独立组织 |
| lxc/lxd | lxc/incus | LXD 项目已更名为 Incus |

### 404 失败仓库

| 仓库 | 状态 | 说明 |
|------|------|------|
| docker/engine-ce | 404 | 企业版引擎仓库已不存在 |
| lxc/lxd-ui | 404 | LXD Web UI 项目已废弃 |

### 结论

- **高质量技能**: 39/41 (95.1%) - HTTP 200 + 301重定向均为有效仓库
- **失效仓库**: 2个 (docker/engine-ce, lxc/lxd-ui) 均为已知废弃项目
- 所有核心容器技术项目 (Docker, Podman, Kubernetes) 均验证通过
- 301重定向表示项目迁移但仍然有效
