const fs = require('fs');

// Read current tutorials
const tutorials = JSON.parse(fs.readFileSync('./src/data/tutorials.json', 'utf8'));

console.log(`Current tutorials: ${tutorials.length}`);
console.log(`Adding tutorial 020...`);

// Tutorial 020: Cloud Native Development
const tutorial020 = {
  "id": "tutorial-020",
  "title": "云原生应用开发",
  "slug": "cloud-native-development",
  "description": "深入云原生应用开发，包括容器化、服务网格和可观测性。",
  "content": `# 云原生应用开发

云原生是一种构建和运行应用程序的方法，充分利用云计算模型的优势。本教程将带你掌握云原生应用开发的核心技能。

## 云原生架构原则

云原生应用应遵循以下原则：

1. **微服务架构**: 拆分为小型、独立的服务
2. **容器化**: 使用容器打包应用和依赖
3. **动态编排**: 自动化部署和扩展
4. **服务发现**: 动态服务注册和发现
5. **配置外部化**: 配置与代码分离
6. **无状态**: 应用不依赖本地状态

## 准备工作

### 安装必要工具

\`\`\`bash
# Docker
# https://docs.docker.com/get-docker/

# kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Minikube (本地 Kubernetes)
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# 启动 Minikube
minikube start
\`\`\`

## 容器化应用

### Dockerfile 最佳实践

\`\`\`dockerfile
# 多阶段构建
FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# 最终镜像
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]
\`\`\`

### 构建和运行

\`\`\`bash
# 构建镜像
docker build -t myapp:1.0 .

# 运行容器
docker run -p 8080:8080 myapp:1.0

# 推送到镜像仓库
docker tag myapp:1.0 registry.example.com/myapp:1.0
docker push registry.example.com/myapp:1.0
\`\`\`

## Kubernetes 部署

### Deployment 配置

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  labels:
    app: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: registry.example.com/myapp:1.0
        ports:
        - containerPort: 8080
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: myapp-secrets
              key: database-url
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
\`\`\`

### Service 配置

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp
spec:
  selector:
    app: myapp
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: LoadBalancer
\`\`\`

## 服务网格 - Istio

### 安装 Istio

\`\`\`bash
# 下载 Istio
curl -L https://istio.io/downloadIstio | sh -

# 安装
cd istio-*
istioctl install --set profile=demo -y

# 启用自动注入
kubectl label namespace default istio-injection=enabled
\`\`\`

### VirtualService 配置

\`\`\`yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: myapp
spec:
  hosts:
  - "myapp.example.com"
  gateways:
  - myapp-gateway
  http:
  - match:
    - uri:
        prefix: /api/v1
    route:
    - destination:
        host: myapp
        subset: v1
      weight: 90
    - destination:
        host: myapp
        subset: v2
      weight: 10
\`\`\`

## 可观测性

### Prometheus 监控

\`\`\`yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
    scrape_configs:
    - job_name: 'kubernetes-pods'
      kubernetes_sd_configs:
      - role: pod
      relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
\`\`\`

## 实战案例

### 完整的 Kubernetes 配置

\`\`\`bash
# 创建命名空间
kubectl create namespace myapp

# 部署 ConfigMap
kubectl apply -f configmap.yaml

# 部署 Secret
kubectl apply -f secret.yaml

# 部署应用
kubectl apply -f deployment.yaml

# 创建 Service
kubectl apply -f service.yaml

# 配置 Ingress
kubectl apply -f ingress.yaml
\`\`\`

## 最佳实践

1. 使用健康检查确保应用可用性
2. 资源限制防止资源耗尽
3. 配置外部化使用 ConfigMap 和 Secret
4. 日志标准化使用结构化日志

## 常见问题

**Q: 如何处理配置更新？**

A: 使用 ConfigMap 和 Secret，通过滚动更新应用新配置。

**Q: 如何实现零停机部署？**

A: 使用滚动更新和就绪探针确保平滑过渡。

## 相关技能

- [Docker](/skills/docker-essentials) - 容器化
- [Kubernetes](/skills/kubernetes) - 容器编排

## 参考资源

- [CNCF Cloud Native Definition](https://github.com/cncf/toc/blob/main/DEFINITION.md)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Istio Documentation](https://istio.io/latest/docs/)`,
  "category": "devops",
  "tags": ["云原生", "Kubernetes", "Docker", "Istio"],
  "difficulty": "intermediate",
  "readTime": 25,
  "author": "OpenClaw Team",
  "relatedSkills": ["skill-012", "skill-020"],
  "stats": {"viewCount": 350},
  "createdAt": "2026-02-05T00:00:00Z",
  "featured": false
};

// Add tutorial
tutorials.push(tutorial020);

// Write back
fs.writeFileSync('./src/data/tutorials.json', JSON.stringify(tutorials, null, 2) + '\n');
console.log('✅ Added tutorial-020: Cloud Native Development');
console.log(`Total tutorials: ${tutorials.length}`);
