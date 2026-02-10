# Phase 6 - DevOps 类技能研究批次 5 - 配置管理和编排 (30个)

研究日期: 2026-02-10
批次编号: Phase 6 Batch 18
技能类别: DevOps - 配置管理和编排

## 研究范围

本批次研究配置管理和编排相关技能，涵盖：
- Ansible 生态
- Terraform 生态
- Helm 和 Kubernetes 包管理
- 配置管理工具
- 基础设施编排工具
- CI/CD 编排工具
- 工作流自动化工具

---

## 1. Ansible 生态 (10个)

| # | 技能名称 | GitHub 仓库 | 描述 | 分类 | Stars |
|---|---------|-------------|------|------|-------|
| 1 | Ansible Core | ansible/ansible | 自动化配置管理工具 | Core | 62k |
| 2 | Ansible Collections | ansible-community/ansible-build-data | Ansible 集合数据 | Collections | 100 |
| 3 | Ansible Galaxy | ansible/galaxy | Ansible 角色仓库 | Galaxy | 1.4k |
| 4 | Ansible Lint | ansible/ansible-lint | Ansible 最佳实践检查器 | Linting | 1.1k |
| 5 | Molecule | ansible-community/molecule | Ansible 角色测试框架 | Testing | 1.1k |
| 6 | Ansible Navigator | ansible/ansible-navigator | Ansible 文本用户界面 | CLI | 700 |
| 7 | Ansible Builder | ansible/ansible-builder | Ansible 执行环境构建器 | Builder | 500 |
| 8 | Ansible Core CI | ansible/ansible-test | Ansible 测试工具 | Testing | 50 |
| 9 | AWX | ansible/awx | Ansible Tower 的上游项目 | UI | 14k |
| 10 | Semaphore | ansible-semaphore/semaphore | Ansible UI 工具 | UI | 4.2k |

---

## 2. Terraform 生态 (8个)

| # | 技能名称 | GitHub 仓库 | 描述 | 分类 | Stars |
|---|---------|-------------|------|------|-------|
| 11 | Terraform | hashicorp/terraform | 基础设施即代码工具 | Core | 42k |
| 12 | Terraform Provider SDK | hashicorp/terraform-plugin-sdk | Provider 开发工具包 | SDK | 800 |
| 13 | Terraform Provider | hashicorp/terraform-provider | 框架模板 | Provider | 100 |
| 14 | Terraform Docs | terraform-docs/terraform-docs | 文档生成工具 | Docs | 4.1k |
| 15 | Terraform Format | hashicorp/terraform-json | JSON 序列化 | Format | 200 |
| 16 | Terraform Language | hashicorp/hcl | HashiCorp 配置语言 | Language | 5.2k |
| 17 | Terraform State | hashicorp/terraform-svchost | State 服务 | State | 50 |
| 18 | Checkov | bridgecrewio/checkov | 基础设施扫描工具 | Security | 6.3k |

---

## 3. Helm 和 Kubernetes 包管理 (7个)

| # | 技能名称 | GitHub 仓库 | 描述 | 分类 | Stars |
|---|---------|-------------|------|------|-------|
| 19 | Helm | helm/helm | Kubernetes 包管理器 | Core | 26k |
| 20 | Chart Museum | helm/chartmuseum | Helm Chart 仓库 | Repository | 2.4k |
| 21 | Helm File | helm/helm-file | Helm 文件插件 | Plugin | 200 |
| 22 | Helm Diff | helm/helm-diff | Helm Diff 插件 | Plugin | 1.1k |
| 23 | Helm Secrets | folkerts/helm-secrets | Helm Secrets 插件 | Plugin | 1k |
| 24 | Helm Template | helm/helm-2to3 | Helm 2 到 3 迁移 | Migration | 400 |
| 25 | Kustomize | kubernetes-sigs/kustomize | Kubernetes 原生配置管理 | Config | 11k |

---

## 4. 其他配置管理工具 (5个)

| # | 技能名称 | GitHub 仓库 | 描述 | 分类 | Stars |
|---|---------|-------------|------|------|-------|
| 26 | SaltStack | saltstack/salt | 事件驱动自动化 | Automation | 14k |
| 27 | Puppet | puppetlabs/puppet | 配置管理工具 | Config | 7.3k |
| 28 | Chef | chef/chef | 配置管理工具 | Config | 7.5k |
| 29 | CFEngine | cfengine/core | 配置管理引擎 | Config | 400 |
| 30 | Nix | NixOS/nix | 纯函数式包管理器 | Package | 12k |

---

## 技能分类总结

### 按平台分类
- **Ansible 生态**: 10 个 (核心 + 集合 + 工具 + UI)
- **Terraform 生态**: 8 个 (核心 + SDK + 语言 + 文档 + 安全)
- **Helm 和 K8s 包管理**: 7 个 (Helm + 插件 + Kustomize)
- **其他配置管理**: 5 个 (SaltStack, Puppet, Chef, CFEngine, Nix)

### 按功能分类
- **配置管理核心平台**: 4 个
- **基础设施即代码**: 2 个
- **包管理器**: 3 个
- **插件/扩展**: 4 个
- **测试和检查**: 2 个
- **文档生成**: 1 个
- **UI 工具**: 2 个
- **语言和 SDK**: 2 个
- **安全扫描**: 1 个
- **构建工具**: 1 个

---

## 筛选标准

- **优先选择**: Star 数 > 100
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
