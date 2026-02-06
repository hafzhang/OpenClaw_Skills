const fs = require('fs');
const path = require('path');

// Read current tutorials
const tutorialsPath = path.join(__dirname, '../src/data/tutorials.json');
const tutorials = JSON.parse(fs.readFileSync(tutorialsPath, 'utf8'));

// Helper function to escape ${} in template strings
function escapeDollarSigns(str) {
  return str.replace(/\$\{/g, '\\${');
}

// Tutorial 049: Nginx Web Server
const tutorial049Content = `# Nginx Web 服务器入门

Nginx (发音为 "engine-x") 是一个高性能的 HTTP 服务器和反向代理服务器。本教程将带你掌握 Nginx 的核心概念和配置技能。

## 什么是 Nginx？

### 为什么使用 Nginx？

- **高性能**: 处理大量并发连接，内存占用低
- **反向代理**: 代理后端服务，实现负载均衡
- **静态文件服务**: 高效地提供静态资源
- **SSL/TLS 支持**: HTTPS 加密通信
- **灵活配置**: 模块化设计，易于扩展
- **稳定可靠**: 在高流量网站广泛应用

### Nginx vs Apache

| 特性 | Nginx | Apache |
|------|-------|--------|
| 架构 | 事件驱动 | 进程驱动 |
| 并发处理 | 高 | 中 |
| 内存使用 | 低 | 高 |
| 静态文件 | 极快 | 快 |
| 动态内容 | 通过代理 | 原生支持 |
| 配置风格 | 简洁 | 复杂 |

## 安装 Nginx

### Docker 安装（推荐）

\`\`\`bash
# 拉取 Nginx 镜像
docker pull nginx:alpine

# 运行 Nginx 容器
docker run -d \\
  --name nginx \\
  -p 80:80 \\
  -p 443:443 \\
  -v nginx-html:/usr/share/nginx/html \\
  -v nginx-conf:/etc/nginx \\
  nginx:alpine

# 测试
curl http://localhost
\`\`\`

### macOS 安装

\`\`\`bash
# 使用 Homebrew
brew install nginx

# 启动 Nginx
brew services start nginx

# 查看状态
brew services list

# 测试
curl http://localhost:8080
\`\`\`

### Linux 安装

\`\`\`bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install nginx

# 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 测试
curl http://localhost
\`\`\`

## Nginx 基本配置

### 配置文件结构

\`\`\`text
/etc/nginx/
├── nginx.conf           # 主配置文件
├── conf.d/             # 自定义配置目录
├── sites-available/    # 可用站点配置
├── sites-enabled/      # 已启用站点（符号链接）
└── modules/            # 模块目录
\`\`\`

### nginx.conf 主配置

\`\`\`nginx
# /etc/nginx/nginx.conf

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    # 性能优化
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript
               application/json application/javascript application/xml+rss;

    # 包含站点配置
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
\`\`\`

## 静态文件服务

### 基本静态站点

\`\`\`nginx
# /etc/nginx/conf.d/static.conf

server {
    listen 80;
    server_name example.com www.example.com;

    # 网站根目录
    root /var/www/html;
    index index.html index.htm;

    # 基本路由
    location / {
        try_files $uri $uri/ =404;
    }

    # 错误页面
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
\`\`\`

## 反向代理

### 基本反向代理

\`\`\`nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;

        # 传递真实客户端信息
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
\`\`\`

### 路径路由

\`\`\`nginx
server {
    listen 80;
    server_name example.com;

    # 前端应用
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
    }

    # API 服务
    location /api/ {
        proxy_pass http://api:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 静态文件
    location /static/ {
        alias /var/www/static/;
        expires 1y;
        add_header Cache-Control "public";
    }
}
\`\`\`

## 负载均衡

### 基本负载均衡

\`\`\`nginx
# 定义上游服务器组
upstream backend {
    server 10.0.0.1:3000;
    server 10.0.0.2:3000;
    server 10.0.0.3:3000;
}

server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
\`\`\`

### 负载均衡策略

\`\`\`nginx
# 轮询（默认）
upstream round_robin {
    server backend1.example.com;
    server backend2.example.com;
    server backend3.example.com;
}

# 最少连接
upstream least_conn {
    least_conn;
    server backend1.example.com;
    server backend2.example.com;
    server backend3.example.com;
}

# IP 哈希（会话保持）
upstream ip_hash {
    ip_hash;
    server backend1.example.com;
    server backend2.example.com;
    server backend3.example.com;
}

# 权重
upstream weighted {
    server backend1.example.com weight=3;
    server backend2.example.com weight=2;
    server backend3.example.com weight=1;
}
\`\`\`

## SSL/TLS 配置

### 基本SSL配置

\`\`\`nginx
server {
    listen 443 ssl http2;
    server_name example.com www.example.com;

    # SSL 证书
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    # SSL 协议
    ssl_protocols TLSv1.2 TLSv1.3;

    # SSL 加密套件
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;

    # SSL 会话缓存
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto https;
    }
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$server_name$request_uri;
}
\`\`\`

### Let's Encrypt 自动证书

\`\`\`bash
# 安装 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书（自动配置 Nginx）
sudo certbot --nginx -d example.com -d www.example.com

# 自动续期
sudo certbot renew --dry-run
\`\`\`

## 安全配置

### 基本安全措施

\`\`\`nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    # 隐藏 Nginx 版本
    server_tokens off;

    # 限制请求大小
    client_max_body_size 10M;

    # 超时设置
    client_body_timeout 12;
    client_header_timeout 12;
    send_timeout 10;

    # 限制连接
    limit_conn_zone $binary_remote_addr zone=conn:10m;
    limit_conn conn 10;

    # 限制请求速率
    limit_req_zone $binary_remote_addr zone=req:10m rate=10r/s;
    limit_req zone=req burst=20;

    location / {
        # ...
    }
}
\`\`\`

### 安全头

\`\`\`nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
\`\`\`

## 常用命令

\`\`\`bash
# 测试配置
nginx -t

# 重新加载配置
nginx -s reload

# 停止 Nginx
nginx -s stop

# 优雅停止
nginx -s quit

# 查看进程
ps aux | grep nginx

# 查看日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
\`\`\`

## 最佳实践

### 1. 使用 include 组织配置

\`\`\`nginx
# nginx.conf
http {
    include /etc/nginx/mime.types;
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
\`\`\`

### 2. 启用 Gzip 压缩

\`\`\`nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript
           application/json application/javascript application/xml+rss;
\`\`\`

### 3. 设置缓存

\`\`\`nginx
# 代理缓存
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=cache:10m;

server {
    location / {
        proxy_cache cache;
        proxy_cache_valid 200 302 10m;
        proxy_cache_valid 404 1m;
        proxy_pass http://backend;
    }
}
\`\`\`

## 常见问题

### Q: 502 Bad Gateway？

A: 检查后端服务是否运行，防火墙是否开放端口。

### Q: 配置修改后不生效？

A: 运行 \`nginx -s reload\` 重新加载配置。

### Q: 如何限制访问频率？

A: 使用 \`limit_req\` 模块实现速率限制。

## 相关技能

- [Docker](/skills/docker) - 容器化部署
- [Kubernetes](/skills/kubernetes) - 容器编排
- [CI/CD](/skills/ci-cd) - 持续集成部署

## 参考资源

- [Nginx 官方文档](http://nginx.org/en/docs/)
- [Nginx 配置示例](https://www.nginx.com/resources/wiki/start/)
- [Let's Encrypt](https://letsencrypt.org/)`;

const tutorial049 = {
  "id": "tutorial-049",
  "title": "Nginx Web 服务器入门",
  "slug": "nginx-web-server",
  "description": "学习 Nginx Web 服务器配置，包括反向代理、负载均衡、静态文件服务和 SSL/TLS 配置。",
  "content": tutorial049Content,
  "category": "devops",
  "tags": [
    "Nginx",
    "Web服务器",
    "反向代理",
    "负载均衡"
  ],
  "difficulty": "beginner",
  "readTime": 18,
  "author": "OpenClaw Team",
  "relatedSkills": [
    "skill-037"
  ],
  "stats": {
    "viewCount": 0
  },
  "createdAt": "2026-02-06T00:00:00Z",
  "featured": false
};

// Tutorial 050: Git Advanced Tips
const tutorial050Content = `# Git 进阶技巧

本教程将带你掌握 Git 的高级功能，让你能够更高效地管理代码历史和协作开发。

## 交互式暂存

### 暂存部分修改

\`\`\`bash
# 查看文件状态
git status

# 交互式暂存
git add -i

# 暂存文件的特定部分
git add -p <file>

# 暂存特定行
git add -L 10,20:src/app.js
\`\`\`

## 修改历史

### 修改最后一次提交

\`\`\`bash
# 修改提交信息
git commit --amend

# 添加遗漏的文件
git add forgotten_file.js
git commit --amend --no-edit

# 修改提交内容和信息
git add new_file.js
git commit --amend -m "Updated commit message"
\`\`\`

### 修改多个提交

\`\`\`bash
# 交互式变基（修改最近 3 个提交）
git rebase -i HEAD~3

# 命令说明：
#   p, pick = 保留提交
#   r, reword = 修改提交信息
#   e, edit = 修改提交内容
#   s, squash = 合并到前一个提交
#   f, fixup = 合并到前一个提交（不保留信息）
#   d, drop = 删除提交
\`\`\`

## Git Rebase

### 变基基础

\`\`\`bash
# 将当前分支变基到 main
git rebase main

# 变基到指定提交
git rebase <commit-hash>

# 变基到远程分支
git rebase origin/main
\`\`\`

### 变基 vs 合并

| 操作 | Rebase | Merge |
|------|--------|--------|
| 历史 | 线性 | 分支 |
| 冲突 | 逐个解决 | 一次性解决 |
| 安全性 | 危险（修改历史） | 安全 |
| 适用 | 个人分支 | 公共分支 |

### 变基最佳实践

\`\`\`bash
# 1. 只在未推送的本地分支使用
git rebase main

# 2. 变基前先拉取
git fetch origin
git rebase origin/main

# 3. 强制推送（谨慎使用）
git push --force-with-lease
\`\`\`

## Cherry-pick

### 选择性合并提交

\`\`\`bash
# 选择单个提交
git cherry-pick <commit-hash>

# 选择多个提交
git cherry-pick <hash1> <hash2> <hash3>

# 选择范围
git cherry-pick <start-hash>..<end-hash>

# 只应用更改，不创建提交
git cherry-pick -n <commit-hash>
\`\`\`

### Cherry-pick 场景

\`\`\`bash
# 场景 1：将热修复应用到多个分支
git checkout main
git cherry-pick <hotfix-commit>

git checkout release
git cherry-pick <hotfix-commit>

# 场景 2：从其他分支提取功能
git checkout feature-branch
git cherry-pick <feature-commit>

# 场景 3：撤销提交但保留更改
git revert -n <commit-hash>
\`\`\`

## Git Bisect

### 二分查找问题

\`\`\`bash
# 开始二分查找
git bisect start

# 标记当前为坏的
git bisect bad

# 标记已知好的版本
git bisect good <good-commit-hash>

# Git 会自动切换到中间版本
# 测试后标记好坏
git bisect good  # 或 git bisect bad

# 重复直到找到问题提交
# 完成后返回到原分支
git bisect reset
\`\`\`

### 自动化二分

\`\`\`bash
# 使用脚本自动测试
git bisect start HEAD <good-commit>
git bisect run ./test-script.sh

# 测试脚本示例
cat > test-script.sh << 'EOF'
#!/bin/bash
npm test
exit $?
EOF

chmod +x test-script.sh
\`\`\`

## Git Reflog

### 恢复丢失的提交

\`\`\`bash
# 查看引用日志
git reflog

# 查看详细日志
git reflog show

# 恢复丢失的提交
git reset --hard HEAD@{n}

# 恢复到特定状态
git reset --hard <commit-hash>

# 查看分支日志
git reflog show feature-branch
\`\`\`

### Reflog 示例

\`\`\`bash
# 误操作：删除了分支
git branch -D feature-branch

# 恢复分支
git reflog
# 找到分支最后的 commit
git checkout <commit-hash>
git checkout -b feature-branch

# 误操作：强制推送错误的提交
git reset --hard HEAD@{5}
\`\`\`

## Git Stash

### 高级 Stash

\`\`\`bash
# 暂存当前工作
git stash

# 暂存并包含未跟踪文件
git stash -u

# 暂存并添加消息
git stash save "Work in progress on feature X"

# 查看列表
git stash list

# 应用 stash
git stash apply

# 应用并删除
git stash pop

# 应用特定 stash
git stash apply stash@{2}

# 删除 stash
git stash drop stash@{0}

# 清空所有 stash
git stash clear
\`\`\`

### Stash 分支

\`\`\`bash
# 从 stash 创建分支
git stash branch <branch-name> stash@{n}

# 示例
git stash branch fix-bug stash@{0}
\`\`\`

## Git 子模块

### 添加和管理子模块

\`\`\`bash
# 添加子模块
git submodule add https://github.com/user/repo.git lib/repo

# 初始化子模块
git submodule init

# 更新子模块
git submodule update

# 克隆包含子模块的项目
git clone --recursive https://github.com/user/project.git

# 添加子模块到已克隆的项目
git submodule update --init --recursive
\`\`\`

## 高级合并

### 合并策略

\`\`\`bash
# 递归合并（默认）
git merge -s recursive branch

# 策略合并
git merge -s ours branch    # 使用我们的版本
git merge -s theirs branch  # 使用他们的版本
git merge -s octopus branch1 branch2 branch3  # 多分支合并
\`\`\`

### 合并冲突解决

\`\`\`bash
# 使用我们的版本
git checkout --ours path/to/file

# 使用他们的版本
git checkout --theirs path/to/file

# 查看冲突
git diff --ours
git diff --theirs
git diff --base

# 合并工具
git mergetool

# 继续合并
git merge --continue

# 放弃合并
git merge --abort
\`\`\`

## 实用技巧

### 查看历史

\`\`\`bash
# 图形化历史
git log --graph --oneline --all

# 查看文件历史
git log --follow -- file.txt

# 查看特定作者
git log --author="John"

# 查看特定时间范围
git log --since="2 weeks ago" --until="1 week ago"

# 查看更改统计
git log --stat

# 查看简洁历史
git log --pretty=format:"%h - %an, %ar : %s"
\`\`\`

### 搜索代码

\`\`\`bash
# 搜索代码内容
git grep "search-term"

# 搜索并显示行号
git grep -n "search-term"

# 只搜索特定分支
git grep "search-term" feature-branch

# 统计匹配次数
git grep -c "function"
\`\`\`

## 常见问题

### Q: 变基冲突太多？

A: 使用 \`git rerere\` 记住冲突解决方案。

### Q: 误删了分支？

A: 使用 \`git reflog\` 找回丢失的提交。

### Q: 合并冲突复杂？

A: 使用 \`git mergetool\` 图形化解决冲突。

## 相关技能

- [GitHub](/skills/github) - 代码托管协作
- [Git](/skills/git) - 版本控制基础
- [CI/CD](/skills/ci-cd) - 持续集成部署

## 参考资源

- [Git 官方文档](https://git-scm.com/doc)
- [Pro Git 书籍](https://git-scm.com/book)
- [Git GitHub Flow](https://guides.github.com/introduction/flow/)`;

const tutorial050 = {
  "id": "tutorial-050",
  "title": "Git 进阶技巧",
  "slug": "git-advanced-tips",
  "description": "掌握 Git 高级用法，包括 rebase、cherry-pick、bisect、子模块和交互式暂存。",
  "content": tutorial050Content,
  "category": "development",
  "tags": [
    "Git",
    "版本控制",
    "进阶",
    "开发工具"
  ],
  "difficulty": "beginner",
  "readTime": 20,
  "author": "OpenClaw Team",
  "relatedSkills": [
    "skill-004"
  ],
  "stats": {
    "viewCount": 0
  },
  "createdAt": "2026-02-06T00:00:00Z",
  "featured": false
};

// Tutorial 051: SSH Remote Management
const tutorial051Content = `# SSH 远程管理入门

SSH (Secure Shell) 是网络管理员和开发者的必备工具，用于安全地远程管理服务器。本教程将带你掌握 SSH 的核心功能和高级用法。

## 什么是 SSH？

### SSH 的作用

- **远程登录**: 安全地访问远程服务器
- **文件传输**: 通过 SCP/SFTP 传输文件
- **端口转发**: 创建加密隧道
- **命令执行**: 在远程服务器运行命令
- **隧道代理**: 突破网络限制

## SSH 基本用法

### 远程登录

\`\`\`bash
# 基本登录
ssh user@hostname

# 指定端口
ssh -p 2222 user@hostname

# 使用 IP 地址
ssh user@192.168.1.100

# 执行单条命令
ssh user@hostname "ls -la"

# 执行多条命令
ssh user@hostname "cd /var/www && ls -la"
\`\`\`

### 配置文件

\`\`\`bash
# ~/.ssh/config

Host server1
    HostName 192.168.1.100
    User admin
    Port 22

Host server2
    HostName example.com
    User deploy
    Port 2222
    IdentityFile ~/.ssh/id_rsa_deploy

Host *.amazonaws.com
    User ec2-user
    IdentityFile ~/.ssh/aws.pem
\`\`\`

使用配置文件后：

\`\`\`bash
# 简化登录
ssh server1
ssh server2
\`\`\`

## SSH 密钥认证

### 生成密钥对

\`\`\`bash
# 生成 ED25519 密钥（推荐）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 生成 RSA 密钥
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 指定文件名
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_work
\`\`\`

### 密钥类型对比

| 类型 | 密钥长度 | 安全性 | 兼容性 |
|------|----------|--------|--------|
| RSA | 2048+ | 中 | 高 |
| ED25519 | 256 | 高 | 中 |
| ECDSA | 256/384/521 | 高 | 中 |

### 复制公钥到服务器

\`\`\`bash
# 使用 ssh-copy-id（推荐）
ssh-copy-id user@hostname

# 指定端口
ssh-copy-id -p 2222 user@hostname

# 使用特定公钥
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@hostname
\`\`\`

### 密钥管理

\`\`\`bash
# 查看公钥指纹
ssh-keygen -lf ~/.ssh/id_ed25519.pub

# 查看所有密钥
ssh-add -l

# 添加密钥到代理
ssh-add ~/.ssh/id_ed25519

# 删除所有密钥
ssh-add -D
\`\`\`

## SSH 端口转发

### 本地端口转发

\`\`\`bash
# 基本语法
ssh -L local_port:remote_host:remote_port user@ssh_server

# 示例：访问远程 MySQL
ssh -L 3306:localhost:3306 user@server

# 现在可以通过 localhost:3306 访问远程 MySQL
mysql -h 127.0.0.1 -P 3306

# 后台运行
ssh -f -N -L 3306:localhost:3306 user@server
\`\`\`

### 远程端口转发

\`\`\`bash
# 基本语法
ssh -R remote_port:local_host:local_port user@ssh_server

# 示例：让远程服务器访问本地服务
ssh -R 8080:localhost:3000 user@server

# 持久化隧道
ssh -f -N -R 8080:localhost:3000 user@server
\`\`\`

### 动态端口转发（SOCKS 代理）

\`\`\`bash
# 创建 SOCKS 代理
ssh -D 1080 user@server

# 后台运行
ssh -f -N -D 1080 user@server

# 使用 curl 通过代理
curl -x socks5://localhost:1080 https://example.com
\`\`\`

## SCP 文件传输

### 基本用法

\`\`\`bash
# 复制文件到远程
scp local.txt user@host:/remote/path/

# 从远程复制文件
scp user@host:/remote/path/file.txt local/

# 复制目录（递归）
scp -r local_dir/ user@host:/remote/path/

# 保留文件属性
scp -p local.txt user@host:/remote/path/

# 使用不同端口
scp -P 2222 local.txt user@host:/remote/path/
\`\`\`

### 高级用法

\`\`\`bash
# 限制带宽（KB/s）
scp -l 1024 largefile.zip user@host:/remote/

# 显示进度
scp -v local.txt user@host:/remote/path/

# 压缩传输
scp -C local.txt user@host:/remote/path/
\`\`\`

## SFTP 交互式传输

### SFTP 命令

\`\`\`bash
# 连接 SFTP
sftp user@hostname

# 常用命令
pwd               # 查看远程目录
lpwd              # 查看本地目录
ls                # 列出远程文件
lls               # 列出本地文件
cd /remote/path   # 切换远程目录
lcd /local/path   # 切换本地目录
get remote.txt    # 下载文件
put local.txt     # 上传文件
get -r dir/       # 下载目录
put -r dir/       # 上传目录
bye               # 退出
\`\`\`

## SSH 高级配置

### 服务器配置

\`\`\`bash
# /etc/ssh/sshd_config

# 禁用密码登录
PasswordAuthentication no

# 禁用 root 登录
PermitRootLogin no

# 限制用户
AllowUsers user1 user2

# 更改端口
Port 2222

# 重启 SSH 服务
sudo systemctl restart sshd
\`\`\`

### 客户端配置

\`\`\`bash
# ~/.ssh/config

# 连接超时
ConnectTimeout 10

# 保持连接
ServerAliveInterval 60
ServerAliveCountMax 3

# 压缩
Compression yes
\`\`\`

## 故障排查

### 连接问题

\`\`\`bash
# 详细输出
ssh -v user@hostname

# 最详细输出
ssh -vvv user@hostname

# 测试连接
ssh -T user@hostname
\`\`\`

### 权限问题

\`\`\`bash
# 检查密钥权限
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
chmod 600 ~/.ssh/authorized_keys

# 检查服务器配置
sudo sshd -t
\`\`\`

## 最佳实践

### 1. 使用配置文件

集中管理所有连接在 ~/.ssh/config

### 2. 启用密钥认证

禁用密码登录，提高安全性

### 3. 定期更新

保持 SSH 客户端和服务器更新

## 常见问题

### Q: 连接超时？

A: 检查防火墙、网络连接和服务器状态。

### Q: 权限被拒绝？

A: 检查密钥权限、authorized_keys 配置和服务器日志。

### Q: 连接断开？

A: 使用 ServerAliveInterval 保持连接活跃。

## 相关技能

- [Linux](/skills/linux) - 命令行操作
- [Git](/skills/git) - 版本控制
- [Docker](/skills/docker) - 容器化部署

## 参考资源

- [OpenSSH 官方文档](https://www.openssh.com/manual.html)
- [SSH 配置生成器](https://www.ssh.com/academy/ssh/config-generator)`;

const tutorial051 = {
  "id": "tutorial-051",
  "title": "SSH 远程管理入门",
  "slug": "ssh-remote-management",
  "description": "学习 SSH 远程登录、密钥认证、端口转发、隧道和自动化运维技巧。",
  "content": tutorial051Content,
  "category": "devops",
  "tags": [
    "SSH",
    "远程管理",
    "DevOps",
    "安全"
  ],
  "difficulty": "beginner",
  "readTime": 16,
  "author": "OpenClaw Team",
  "relatedSkills": [
    "skill-004",
    "skill-036"
  ],
  "stats": {
    "viewCount": 0
  },
  "createdAt": "2026-02-06T00:00:00Z",
  "featured": false
};

// Tutorial 052: Regex Practical Guide
const tutorial052Content = `# 正则表达式实战指南

正则表达式（Regular Expression，简称 Regex）是文本处理的强大工具。本教程将带你掌握正则表达式的核心概念和实战技巧。

## 什么是正则表达式？

### 正则表达式的作用

- **模式匹配**: 查找符合特定模式的文本
- **文本替换**: 批量替换符合模式的文本
- **数据提取**: 从文本中提取结构化数据
- **数据验证**: 验证输入格式（邮箱、电话等）
- **文本解析**: 分割和解析复杂文本

## 基本语法

### 字符匹配

\`\`\`regex
# 字面字符
hello          # 匹配 "hello"

# 字符类
[abc]          # 匹配 a、b 或 c
[^abc]         # 匹配除了 a、b、c 的字符
[a-z]          # 匹配小写字母
[A-Z]          # 匹配大写字母
[0-9]          # 匹配数字

# 预定义字符类
.              # 匹配任意字符（除换行符）
\\d             # 匹配数字 [0-9]
\\D             # 匹配非数字 [^0-9]
\\w             # 匹配单词字符 [a-zA-Z0-9_]
\\W             # 匹配非单词字符
\\s             # 匹配空白字符（空格、制表符、换行符）
\\S             # 匹配非空白字符
\`\`\`

### 量词

\`\`\`regex
*       # 匹配 0 次或多次
+       # 匹配 1 次或多次
?       # 匹配 0 次或 1 次
{n}     # 匹配恰好 n 次
{n,}    # 匹配 n 次或多次
{n,m}   # 匹配 n 到 m 次

# 示例
a*      # ""、"a"、"aa"、"aaa"...
a+      # "a"、"aa"、"aaa"...
a?      # ""、"a"
a{3}    # "aaa"
a{3,}   # "aaa"、"aaaa"、"aaaaa"...
a{3,5}  # "aaa"、"aaaa"、"aaaaa"
\`\`\`

### 定位符

\`\`\`regex
^       # 字符串开始
$       # 字符串结束
\\b      # 单词边界
\\B      # 非单词边界

# 示例
^hello  # 以 "hello" 开头
world$  # 以 "world" 结尾
\\bcat\\b # 匹配独立单词 "cat"
\`\`\`

## 分组和引用

### 捕获组

\`\`\`regex
# 捕获组
(hello)+   # 匹配 "hello"、"hellohello"...

# 非捕获组
(?:hello)+ # 同上，但不捕获

# 命名组
(?<name>\\w+) # 捕获并命名为 "name"

# 引用组
(\\w+) \\1     # 匹配重复单词，如 "hello hello"
\`\`\`

## 常用模式

### 邮箱验证

\`\`\`regex
# 基本邮箱
[\\w.-]+@[\\w.-]+\\.\\w+

# 更严格的邮箱
[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}
\`\`\`

### URL 匹配

\`\`\`regex
# 基本 URL
https?://[\\w.-]+\\.[a-z]{2,}[^\\s]*

# 更精确的 URL
https?://(?:www\\.)?[\\w.-]+\\.[a-z]{2,}(?:/[\\w./?%&=-]*)?
\`\`\`

### 电话号码

\`\`\`regex
# 中国手机号
1[3-9]\\d{9}

# 美国电话
\\d{3}-\\d{3}-\\d{4}

# 国际号码
\\+\\d{1,3}[-\\s]?\\d{3,4}[-\\s]?\\d{3,4}[-\\s]?\\d{3,4}
\`\`\`

### 日期时间

\`\`\`regex
# 日期 YYYY-MM-DD
\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])

# 时间 HH:MM:SS
([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d
\`\`\`

### IP 地址

\`\`\`regex
# IPv4
\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}

# 更严格的 IPv4
(25[0-5]|2[0-4]\\d|[01]?\\d?\\d)(\\.(25[0-5]|2[0-4]\\d|[01]?\\d?\\d)){3}
\`\`\`

## 编程语言中的正则

### JavaScript

\`\`\`javascript
// 创建正则表达式
const regex1 = /pattern/gi;
const regex2 = new RegExp('pattern', 'gi');

// 测试匹配
regex1.test('text'); // 返回 true/false

// 查找匹配
const text = 'Hello world';
const matches = text.match(/world/); // ['world']

// 查找所有匹配
const allMatches = text.matchAll(/\\w+/g);

// 替换
const replaced = text.replace(/world/, 'everyone');

// 使用函数替换
const result = '1 2 3'.replace(/\\d+/g, (match) => {
    return parseInt(match) * 2;
}); // "2 4 6"
\`\`\`

### Python

\`\`\`python
import re

# 编译正则表达式
pattern = re.compile(r'\\d+')

# 匹配
result = pattern.match('123abc')
print(result.group())  # '123'

# 查找所有
matches = pattern.findall('a1b2c3')
print(matches)  # ['1', '2', '3']

# 替换
replaced = re.sub(r'\\d+', 'X', 'a1b2c3')
print(replaced)  # 'aXbXcX'
\`\`\`

## 实战案例

### 案例 1：提取数据

\`\`\`javascript
// 从日志中提取信息
const log = '2024-02-06 10:30:45 [INFO] User john@example.com logged in from 192.168.1.100';

const pattern = /(\\d{4}-\\d{2}-\\d{2}) (\\d{2}:\\d{2}:\\d{2}) \\[(\\w+)\\] User ([\\w.-]+) logged in from (\\d+\\.\\d+\\.\\d+\\.\\d+)/;

const match = log.match(pattern);
console.log({
  date: match[1],
  time: match[2],
  level: match[3],
  email: match[4],
  ip: match[5]
});
\`\`\`

### 案例 2：HTML 处理

\`\`\`javascript
// 提取链接
const html = '<a href="https://example.com">Example</a>';
const pattern = /href="([^"]+)"/;
const match = html.match(pattern);
console.log(match[1]);  // 'https://example.com'
\`\`\`

### 案例 3：数据验证

\`\`\`javascript
// 验证邮箱
function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

// 验证密码
function validatePassword(password) {
    // 至少 8 位，包含大小写字母、数字和特殊字符
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/;
    return regex.test(password);
}
\`\`\`

## 性能优化

### 避免回溯

\`\`\`regex
# 避免：太多量词
.*.*.*

# 优化：使用更具体的模式
[a-zA-Z]+
\`\`\`

### 预编译正则

\`\`\`javascript
// 推荐：预编译
const DIGIT_REGEX = /\\d+/;
function test(str) {
    return DIGIT_REGEX.test(str);
}
\`\`\`

## 最佳实践

### 1. 使用原始字符串

\`\`\`javascript
// 不推荐
const regex1 = /\\d\\d\\d/;

// 推荐
const regex2 = /\\d{3}/;
\`\`\`

### 2. 使用非捕获组

\`\`\`regex
# 不需要捕获时使用非捕获组
(?:hello)+  # 而不是 (hello)+
\`\`\`

## 在线工具

- **Regex101**: https://regex101.com/
- **RegExr**: https://regexr.com/
- **Debuggex**: https://www.debuggex.com/

## 常见问题

### Q: 为什么我的正则不匹配？

A: 检查是否转义了特殊字符，使用在线工具调试。

### Q: 如何匹配换行符？

A: 使用 \`[\\s\\S]\` 匹配任意字符包括换行符。

### Q: 正则表达式太慢？

A: 避免嵌套量词，使用更具体的模式，预编译正则表达式。

## 相关技能

- [JavaScript](/skills/javascript) - Web 开发
- [Python](/skills/python) - 数据处理
- [文本编辑器](/skills/vscode) - 搜索替换

## 参考资源

- [MDN 正则表达式指南](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions)
- [正则表达式.info](https://www.regular-expressions.info/)
- [RegexOne 交互式教程](https://regexone.com/)`;

const tutorial052 = {
  "id": "tutorial-052",
  "title": "正则表达式实战指南",
  "slug": "regex-practical-guide",
  "description": "掌握正则表达式模式匹配、替换和提取技巧，处理文本和数据验证。",
  "content": tutorial052Content,
  "category": "development",
  "tags": [
    "正则表达式",
    "Regex",
    "文本处理",
    "数据验证"
  ],
  "difficulty": "beginner",
  "readTime": 17,
  "author": "OpenClaw Team",
  "relatedSkills": [
    "skill-004"
  ],
  "stats": {
    "viewCount": 0
  },
  "createdAt": "2026-02-06T00:00:00Z",
  "featured": false
};

// Add all four tutorials
tutorials.push(tutorial049, tutorial050, tutorial051, tutorial052);

// Write back to file
fs.writeFileSync(tutorialsPath, JSON.stringify(tutorials, null, 2) + '\n');

console.log('Added 4 new tutorials:');
console.log('- Tutorial-049: Nginx Web 服务器入门');
console.log('- Tutorial-050: Git 进阶技巧');
console.log('- Tutorial-051: SSH 远程管理入门');
console.log('- Tutorial-052: 正则表达式实战指南');
console.log(`Total tutorials: ${tutorials.length}`);
