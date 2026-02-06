const fs = require('fs');
const path = require('path');

const tutorialsJsonPath = path.join(__dirname, '..', 'src', 'data', 'tutorials.json');
const tutorials = JSON.parse(fs.readFileSync(tutorialsJsonPath, 'utf8'));

const now = new Date().toISOString();

// Tutorial 082: 分布式追踪
const tutorial082Content = `# 分布式追踪实战指南

分布式追踪是一种用于分析和监控微服务架构中请求流动的技术。本教程将带你深入了解分布式追踪的核心概念和实战应用。

## 什么是分布式追踪？

分布式追踪通过跟踪请求在多个服务间的传播路径，帮助开发者：
- **可视化请求流程**: 查看请求如何经过各个服务
- **定位性能瓶颈**: 识别慢服务和延迟来源
- **错误诊断**: 快速找到导致失败的根因
- **依赖分析**: 理解服务间的依赖关系

### 核心概念

### 1. Trace 和 Span

- **Trace**: 一个完整的请求轨迹，包含多个 Span
- **Span**: 追踪中的单个工作单元，表示服务中的一个操作

\`\`\`javascript
// Trace 示例
Trace: get-user-orders
  ├── Span: API Gateway (1ms)
  ├── Span: Auth Service (5ms)
  │   └── Span: DB Query (3ms)
  ├── Span: Order Service (50ms)
  │   ├── Span: Product Service (20ms)
  │   └── Span: Database (25ms)
  └── Span: Response (2ms)

// 总时间: ~50ms (最慢的 Span)
\`\`\`

### 2. Span 属性

每个 Span 包含以下信息：

\`\`\`javascript
{
  traceId: "abc123",        // 关联到同一个 Trace
  spanId: "def456",         // 当前 Span 的唯一 ID
  parentSpanId: "ghi789",   // 父 Span ID（根 Span 没有）
  operationName: "http.request",
  startTime: 1640000000000,
  duration: 5000,           // 微秒
  tags: {
    "http.method": "GET",
    "http.url": "/api/users",
    "http.status_code": "200"
  },
  logs: [
    {
      timestamp: 1640000001000,
      fields: { "event": "error", "message": "Database timeout" }
    }
  ]
}
\`\`\`

## OpenTelemetry 实战

### 1. 初始化 OpenTelemetry

\`\`\`javascript
// tracing.js
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { JaegerExporter } = require('@opentelemetry/exporter-trace-jaeger');

// 创建资源（服务信息）
const resource = Resource.default().merge(
  new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'order-service',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: 'production'
  })
);

// 创建 Provider
const provider = new NodeTracerProvider({ resource });

// 配置 Jaeger Exporter
const exporter = new JaegerExporter({
  endpoint: 'http://jaeger:14268/api/traces',
});

// 添加 Span Processor
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

// 注册全局 Provider
provider.register();

console.log('OpenTelemetry initialized');
\`\`\`

### 2. HTTP 服务器追踪

\`\`\`javascript
// server.js
const express = require('express');
const { trace } = require('@opentelemetry/api');

const app = express();
const tracer = trace.getTracer('order-service');

// 中间件：自动创建 Span
app.use((req, res, next) => {
  const span = tracer.startSpan(\`http.\${req.method.toLowerCase()}\`, {
    attributes: {
      'http.method': req.method,
      'http.url': req.url,
      'http.target': req.path
    }
  });

  // 将 Span 绑定到上下文
  const ctx = trace.setSpan(context.active(), span);

  // 处理请求
  context.with(ctx, () => {
    res.on('finish', () => {
      span.setAttribute('http.status_code', res.statusCode);
      span.end();
    });
    next();
  });
});

app.get('/api/orders/:userId', async (req, res) => {
  const span = trace.getActiveSpan();

  try {
    const orders = await getOrders(req.params.userId);
    res.json(orders);
  } catch (error) {
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});
\`\`\`

### 3. 数据库查询追踪

\`\`\`javascript
// database.js
const { trace, context } = require('@opentelemetry/api');
const tracer = trace.getTracer('database');

async function queryOrders(userId) {
  return tracer.startActiveSpan('db.query', async (span) => {
    span.setAttribute('db.system', 'postgresql');
    span.setAttribute('db.name', 'orders_db');
    span.setAttribute('db.statement', 'SELECT * FROM orders WHERE user_id = $1');

    try {
      const result = await pool.query(
        'SELECT * FROM orders WHERE user_id = $1',
        [userId]
      );

      span.setAttribute('db.rows_affected', result.rowCount);
      return result.rows;
    } catch (error) {
      span.recordException(error);
      throw error;
    } finally {
      span.end();
    }
  });
}
\`\`\`

### 4. HTTP 客户端追踪

\`\`\`javascript
// http-client.js
const { trace } = require('@opentelemetry/api');
const axios = require('axios');
const tracer = trace.getTracer('http-client');

async function fetchProduct(productId) {
  return tracer.startActiveSpan('http.client', async (span) => {
    span.setAttribute('http.method', 'GET');
    span.setAttribute('http.url', \`http://product-service/api/products/\${productId}\`);

    try {
      const response = await axios.get(
        \`http://product-service/api/products/\${productId}\`,
      {
        headers: {
          // 自动传播 Trace Context
          'traceparent': formatTraceParent(trace.getActiveSpan())
        }
      }
      );

      span.setAttribute('http.status_code', response.status);
      return response.data;
    } catch (error) {
      span.recordException(error);
      throw error;
    } finally {
      span.end();
    }
  });
}

// 注入 Trace Context
function formatTraceParent(span) {
  const traceId = span.spanContext().traceId;
  const spanId = span.spanContext().spanId;
  return \`00-\${traceId}-\${spanId}-01\`;
}
\`\`\`

## Jaeger 部署和使用

### 1. 部署 Jaeger All-in-One

\`\`\`bash
# 使用 Docker 快速启动
docker run -d \\
  --name jaeger \\
  -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \\
  -p 5775:5775/udp \\
  -p 6831:6831/udp \\
  -p 6832:6832/udp \\
  -p 5778:5778 \\
  -p 16686:16686 \\
  -p 14268:14268 \\
  -p 14250:14250 \\
  -p 9411:9411 \\
  jaegertracing/all-in-one:latest
\`\`\`

### 2. Kubernetes 部署

\`\`\`yaml
# jaeger-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jaeger
spec:
  replicas: 1
  selector:
    matchLabels:
      app: jaeger
  template:
    metadata:
      labels:
        app: jaeger
    spec:
      containers:
      - name: jaeger
        image: jaegertracing/all-in-one:latest
        ports:
        - containerPort: 5775
          protocol: UDP
        - containerPort: 6831
          protocol: UDP
        - containerPort: 6832
          protocol: UDP
        - containerPort: 5778
        - containerPort: 16686
        - containerPort: 14268
---
apiVersion: v1
kind: Service
metadata:
  name: jaeger
spec:
  selector:
    app: jaeger
  ports:
  - name: ui
    port: 16686
    targetPort: 16686
  - name: collector
    port: 14268
    targetPort: 14268
\`\`\`

### 3. 查询追踪数据

访问 Jaeger UI: http://localhost:16686

- **Search**: 通过 Service Name、Operation Name、Tags 搜索
- **Trace Timeline**: 可视化请求的时间线
- **Trace Details**: 查看 Span 的详细信息和日志

## 实战案例：电商订单系统

### 架构

\`\`\`
用户请求
  ↓
API Gateway
  ↓
Auth Service (验证用户)
  ↓
Order Service (创建订单)
  ├── Product Service (检查库存)
  ├── Inventory Service (扣减库存)
  └── Payment Service (处理支付)
  ↓
返回订单结果
\`\`\`

### 端到端追踪实现

\`\`\`javascript
// order-service.js
const { trace } = require('@opentelemetry/api');
const tracer = trace.getTracer('order-service');

class OrderService {
  async createOrder(userId, items) {
    // 创建根 Span
    return tracer.startActiveSpan('createOrder', async (rootSpan) => {
      rootSpan.setAttribute('user.id', userId);
      rootSpan.setAttribute('order.items_count', items.length);

      try {
        // 并行处理：验证库存和支付
        const [inventoryResult, paymentResult] = await Promise.all([
          this.checkInventory(items, rootSpan),
          this.processPayment(userId, items, rootSpan)
        ]);

        // 创建订单
        const order = await this.saveOrder(userId, items, rootSpan);

        rootSpan.setAttribute('order.id', order.id);
        rootSpan.setStatus({ code: SpanStatusCode.OK });

        return order;
      } catch (error) {
        rootSpan.recordException(error);
        rootSpan.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
        throw error;
      } finally {
        rootSpan.end();
      }
    });
  }

  async checkInventory(items, parentSpan) {
    // 创建子 Span
    return tracer.startActiveSpan('checkInventory', { parent: parentSpan }, async (span) => {
      span.setAttribute('inventory.service', 'inventory-api');

      try {
        const results = await Promise.all(
          items.map(item =>
            this.callInventoryService(item.productId, item.quantity, span)
          )
        );

        const allAvailable = results.every(r => r.available);
        span.setAttribute('inventory.all_available', allAvailable);

        if (!allAvailable) {
          throw new Error('Some items are out of stock');
        }

        return results;
      } finally {
        span.end();
      }
    });
  }

  async callInventoryService(productId, quantity, parentSpan) {
    return tracer.startActiveSpan('http.request', { parent: parentSpan }, async (span) => {
      span.setAttribute('http.method', 'POST');
      span.setAttribute('http.url', \`http://inventory-service/api/check\`);

      try {
        const response = await axios.post('http://inventory-service/api/check', {
          productId,
          quantity
        }, {
          headers: {
            'traceparent': this.getTraceParent()
          }
        });

        span.setAttribute('http.status_code', response.status);
        return response.data;
      } finally {
        span.end();
      }
    });
  }

  getTraceParent() {
    const span = trace.getActiveSpan();
    const ctx = span?.spanContext();
    if (!ctx) return '';

    const traceId = ctx.traceId;
    const spanId = ctx.spanId;
    return \`00-\${traceId}-\${spanId}-01\`;
  }

  async processPayment(userId, items, parentSpan) {
    return tracer.startActiveSpan('processPayment', { parent: parentSpan }, async (span) => {
      span.setAttribute('payment.service', 'payment-api');

      const total = items.reduce((sum, item) => sum + item.price, 0);
      span.setAttribute('payment.amount', total);

      try {
        const result = await axios.post('http://payment-service/api/charge', {
          userId,
          amount: total
        }, {
          headers: {
            'traceparent': this.getTraceParent()
          }
        });

        span.setAttribute('payment.transaction_id', result.data.transactionId);
        return result.data;
      } finally {
        span.end();
      }
    });
  }

  async saveOrder(userId, items, parentSpan) {
    return tracer.startActiveSpan('saveOrder', { parent: parentSpan }, async (span) => {
      span.setAttribute('db.system', 'postgresql');

      try {
        const order = await db.orders.create({
          userId,
          items,
          status: 'completed',
          createdAt: new Date()
        });

        span.setAttribute('order.id', order.id);
        return order;
      } finally {
        span.end();
      }
    });
  }
}
\`\`\`

## 性能优化

### 1. 采样策略

\`\`\`javascript
const { ParentBasedSampler, TraceIdRatioBased } = require('@opentelemetry/sdk-trace-base');

// 生产环境：10% 采样
const sampler = new ParentBasedSampler({
  root: new TraceIdRatioBased(0.1)
});

const provider = new NodeTracerProvider({
  resource,
  sampler
});
\`\`\`

### 2. 批量处理

\`\`\`javascript
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');

const provider = new NodeTracerProvider({ resource });

// 使用 Batch Processor 减少 API 调用
provider.addSpanProcessor(new BatchSpanProcessor(exporter, {
  maxQueueSize: 2048,
  maxExportBatchSize: 512,
  scheduledDelayMillis: 5000
}));
\`\`\`

## 常见问题

### Q: 如何选择采样率？

A: 采样建议：
- 开发环境：100%
- 测试环境：50%
- 生产环境：10-20%
- 高流量服务：1-5%

### Q: 追踪数据保留多久？

A: 根据需求设置：
- 开发：7 天
- 测试：30 天
- 生产：7-30 天（依赖 SLA）

### Q: 如何处理敏感信息？

A: 避免在 Span 中记录：
- 用户 PII（身份证、地址）
- 认证凭证
- 密码和 token

## 下一步

- 学习 [可观测性实现](/tutorial/observability-implementation) 了解监控完整方案
- 探索 [Kafka 流处理](/tutorial/kafka-stream-processing) 了解异步追踪
- 阅读 [高可用系统设计](/tutorial/high-availability-design) 了解可靠性

## 相关技能

- [OpenTelemetry](/skills) - 开放追踪标准
- [Jaeger](/skills) - 追踪后端
- [Zipkin](/skills) - 追踪后端替代方案`;

// Tutorial 083: 限流熔断
const tutorial083Content = `# 限流和熔断实战指南

限流和熔断是保护微服务免受过载影响的关键技术。本教程将深入讲解限流和熔断的核心概念及实战应用。

## 为什么需要限流和熔断？

### 问题场景

- **流量突增**: 营销活动导致请求量激增
- **慢下游**: 依赖服务响应变慢拖垮整个系统
- **雪崩效应**: 一个服务故障导致级联失败
- **资源耗尽**: 数据库连接池、线程池耗尽

### 解决方案

| 技术 | 目的 | 触发条件 | 恢复策略 |
|------|------|----------|----------|
| 限流 | 保护系统不被压垮 | 超过请求阈值 | 拒绝或排队 |
| 熔断 | 快速失败，防止雪崩 | 错误率过高 | 半开试探 |
| 降级 | 保证核心功能 | 资源不足 | 返回默认值 |
| 超时 | 避免无限等待 | 超过时间限制 | 抛出超时异常 |

## 限流实现

### 1. 固定窗口限流

\`\`\`javascript
// 限制：每分钟 100 次请求
class FixedWindowRateLimiter {
  constructor(limit, interval) {
    this.limit = limit;
    this.interval = interval;
    this.requests = new Map();
  }

  isAllowed(key) {
    const now = Date.now();
    const windowStart = Math.floor(now / this.interval) * this.interval;
    const count = this.requests.get(key) || { count: 0, windowStart };

    if (count.windowStart !== windowStart) {
      // 新窗口
      this.requests.set(key, { count: 1, windowStart });
      return true;
    }

    if (count.count >= this.limit) {
      return false;
    }

    count.count++;
    return true;
  }
}

// 使用
const limiter = new FixedWindowRateLimiter(100, 60 * 1000);

app.use((req, res, next) => {
  const key = req.ip;

  if (!limiter.isAllowed(key)) {
    return res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.ceil(limiter.interval / 1000)
    });
  }

  next();
});
\`\`\`

### 2. 滑动窗口限流

\`\`\`javascript
class SlidingWindowRateLimiter {
  constructor(limit, windowMs) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(key) {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    let timestamps = this.requests.get(key) || [];

    // 移除窗口外的旧请求
    timestamps = timestamps.filter(t => t > windowStart);

    if (timestamps.length >= this.limit) {
      return false;
    }

    timestamps.push(now);
    this.requests.set(key, timestamps);

    return true;
  }

  getRemainingRequests(key) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const timestamps = (this.requests.get(key) || []).filter(t => t > windowStart);
    return Math.max(0, this.limit - timestamps.length);
  }
}

// 使用
const limiter = new SlidingWindowRateLimiter(100, 60000);

app.use((req, res, next) => {
  if (!limiter.isAllowed(req.ip)) {
    res.setHeader('X-RateLimit-Limit', '100');
    res.setHeader('X-RateLimit-Remaining', '0');
    res.setHeader('Retry-After', '60');
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }

  const remaining = limiter.getRemainingRequests(req.ip);
  res.setHeader('X-RateLimit-Remaining', remaining.toString());
  next();
});
\`\`\`

### 3. 令牌桶算法

\`\`\`javascript
class TokenBucketRateLimiter {
  constructor(capacity, refillRate) {
    this.capacity = capacity;      // 桶容量
    this.refillRate = refillRate;  // 每秒添加的令牌数
    this.buckets = new Map();
  }

  isAllowed(key, tokens = 1) {
    const now = Date.now() / 1000;
    let bucket = this.buckets.get(key);

    if (!bucket) {
      bucket = { tokens: this.capacity, lastRefill: now };
      this.buckets.set(key, bucket);
    }

    // 计算应添加的令牌数
    const elapsed = now - bucket.lastRefill;
    const newTokens = elapsed * this.refillRate;

    bucket.tokens = Math.min(this.capacity, bucket.tokens + newTokens);
    bucket.lastRefill = now;

    if (bucket.tokens >= tokens) {
      bucket.tokens -= tokens;
      return true;
    }

    return false;
  }

  getAvailableTokens(key) {
    const bucket = this.buckets.get(key);
    if (!bucket) return this.capacity;

    const now = Date.now() / 1000;
    const elapsed = now - bucket.lastRefill;
    const newTokens = elapsed * this.refillRate;
    return Math.min(this.capacity, bucket.tokens + newTokens);
  }
}

// 使用
const limiter = new TokenBucketRateLimiter(100, 10); // 100 容量，每秒 10 令牌
\`\`\`

### 4. Redis 分布式限流

\`\`\`javascript
const Redis = require('ioredis');
const redis = new Redis();

class RedisRateLimiter {
  constructor(limit, windowMs) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  async isAllowed(key) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const pipe = redis.pipeline();

    // 移除窗口外的记录
    pipe.zremrangebyscore(key, 0, windowStart);
    // 计数
    pipe.zcard(key);
    // 添加当前请求
    pipe.zadd(key, now, now.toString());
    // 设置过期时间
    pipe.pexpire(key, this.windowMs);

    const results = await pipe.exec();
    const count = results[1][1];

    return count <= this.limit;
  }
}
\`\`\`

## 熔断器实现

### 1. 状态机

\`\`\`
      ┌─────────┐
      │  CLOSED │ (正常)
      └────┬────┘
           │ 错误率 > 阈值
           ▼
      ┌─────────┐
      │  OPEN   │ (熔断)
      └────┬────┘
           │ 超时后
           ▼
      ┌─────────┐
      │HALF_OPEN│ (试探)
      └────┬────┘
           │ 成功 → CLOSED
           │ 失败 → OPEN
           ▼
\`\`\`

### 2. 熔断器实现

\`\`\`javascript
class CircuitBreaker {
  constructor(options = {}) {
    this.threshold = options.threshold || 0.5;      // 错误率阈值
    this.timeout = options.timeout || 60000;        // 熔断超时（ms）
    this.requestCount = options.requestCount || 10; // 最小请求数

    this.state = 'CLOSED';          // CLOSED | OPEN | HALF_OPEN
    this.failureCount = 0;
    this.successCount = 0;
    this.nextAttempt = 0;
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
      this.successCount = 0;
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;

    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= 2) {
        this.state = 'CLOSED';
      }
    }
  }

  onFailure() {
    this.failureCount++;

    if (this.shouldTrip()) {
      this.trip();
    }
  }

  shouldTrip() {
    if (this.state === 'HALF_OPEN') {
      return true;
    }

    const totalRequests = this.failureCount + this.successCount;
    if (totalRequests >= this.requestCount) {
      const errorRate = this.failureCount / totalRequests;
      return errorRate >= this.threshold;
    }

    return false;
  }

  trip() {
    this.state = 'OPEN';
    this.nextAttempt = Date.now() + this.timeout;
    this.successCount = 0;
  }

  getState() {
    return this.state;
  }
}
\`\`\`

### 3. 使用熔断器

\`\`\`javascript
const circuitBreakers = new Map();

function getCircuitBreaker(serviceName) {
  if (!circuitBreakers.has(serviceName)) {
    circuitBreakers.set(serviceName, new CircuitBreaker({
      threshold: 0.5,
      timeout: 30000,
      requestCount: 10
    }));
  }
  return circuitBreakers.get(serviceName);
}

async function callService(url, serviceName) {
  const cb = getCircuitBreaker(serviceName);

  return cb.execute(async () => {
    const response = await axios.get(url, { timeout: 5000 });
    return response.data;
  });
}

// 使用示例
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await callService(
      'http://order-service/api/orders',
      'order-service'
    );
    res.json(orders);
  } catch (error) {
    if (error.message.includes('Circuit breaker is OPEN')) {
      // 返回降级数据
      res.json({ orders: [], cached: true });
    } else {
      res.status(503).json({ error: 'Service unavailable' });
    }
  }
});
\`\`\`

## 超时控制

### 1. Promise 超时

\`\`\`javascript
function withTimeout(promise, timeoutMs, errorMessage = 'Operation timed out') {
  let timeoutHandle;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(errorMessage));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise])
    .finally(() => {
      clearTimeout(timeoutHandle);
    });
}

// 使用
async function fetchWithTimeout(url) {
  return withTimeout(
    axios.get(url),
    5000,
    'Request timeout after 5s'
  );
}
\`\`\`

### 2. Axios 超时

\`\`\`javascript
// 连接超时 + 响应超时
axios.get('/api/data', {
  timeout: 5000,
  // 或分别设置
  // timeout: 3000,  // 连接超时
  // responseType: 'json'
});
\`\`\`

### 3. Express 请求超时

\`\`\`javascript
const express = require('express');
const timeout = require('connect-timeout');

app.use(timeout('5s'));
app.use(haltOnTimedout);

function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}

app.get('/api/slow', (req, res) => {
  // 慢操作
  setTimeout(() => {
    if (!req.timedout) {
      res.send('Done');
    }
  }, 10000);
});
\`\`\`

## 降级策略

### 1. 返回默认值

\`\`\`javascript
async function getProductRecommendations(userId) {
  try {
    return await recommendationService.getRecommendations(userId);
  } catch (error) {
    console.error('Recommendation service failed:', error);
    // 返回默认推荐
    return getPopularProducts();
  }
}
\`\`\`

### 2. 使用缓存

\`\`\`javascript
async function getProductDetails(productId) {
  try {
    return await productService.getProduct(productId);
  } catch (error) {
    // 从缓存返回
    const cached = await cache.get(\`product:\${productId}\`);
    if (cached) {
      return { ...cached, cached: true };
    }
    throw error;
  }
}
\`\`\`

### 3. 异步队列

\`\`\`javascript
async function processOrder(order) {
  try {
    await emailService.sendConfirmation(order);
  } catch (error) {
    // 加入队列稍后重试
    await queue.add('send-email', { order, attempts: 0 });
  }
}
\`\`\`

## 实战案例：电商系统保护

### 完整配置

\`\`\`javascript
// rate-limit.js
const rateLimit = require('express-rate-limit');

// API 限流
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.ceil(60 * 1000 / 1000)
    });
  }
});

// 严格限流（登录、支付）
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true
});

app.use('/api/', apiLimiter);
app.use('/api/login', strictLimiter);
app.use('/api/payment', strictLimiter);

// circuit-breaker.js
const { CircuitBreaker } = require('opossum');

const paymentBreaker = new CircuitBreaker(callPaymentAPI, {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000
});

paymentBreaker.on('open', () => {
  console.warn('Payment circuit breaker opened!');
});

paymentBreaker.fallback(() => {
  return { status: 'pending', message: 'Payment processing delayed' };
});
\`\`\`

## 最佳实践

### 1. 分级限流

\`\`\`
用户级: 每用户 100/分钟
  ↓
IP 级: 每IP 1000/分钟
  ↓
服务级: 全局 10000/分钟
\`\`\`

### 2. 限流响应

\`\`\`json
{
  "error": "Rate limit exceeded",
  "limit": 100,
  "remaining": 0,
  "reset": 1640000100,
  "retryAfter": 60
}
\`\`\`

### 3. 监控告警

\`\`\`javascript
// 限流触发告警
limiter.on('limit_exceeded', (key) => {
  alerting.send({
    severity: 'warning',
    message: \`Rate limit exceeded for \${key}\`,
    metric: 'rate_limit_exceeded'
  });
});
\`\`\`

## 常见问题

### Q: 限流和熔断如何配合？

A: 策略：
1. 限流保护入口（防止过载）
2. 熔断保护调用链（防止雪崩）
3. 限流在熔断前生效

### Q: 如何选择限流算法？

A: 选择指南：
- **固定窗口**: 简单，边界有突发
- **滑动窗口**: 平滑，内存消耗大
- **令牌桶**: 允许突发，实现复杂
- **漏桶**: 恒定速率，不适合突发

## 下一步

- 学习 [API 网关](/tutorial/api-gateway-patterns) 了解集中式限流
- 探索 [分布式追踪](/tutorial/distributed-tracing) 了解故障定位
- 阅读 [可观测性实现](/tutorial/observability-implementation) 了解监控

## 相关技能

- [Redis](/skills) - 分布式限流
- [Hystrix](/skills) - 熔断器库
- [Sentinel](/skills) - 流量控制组件`;

// Tutorial 084: API Gateway
const tutorial084Content = `# API 网关实战指南

API 网关是微服务架构的统一入口，处理路由、认证、限流、监控等横切关注点。本教程将深入讲解 API 网关的核心概念和实战应用。

## 为什么需要 API 网关？

### 核心作用

- **统一入口**: 客户端只需知道网关地址
- **路由转发**: 将请求路由到正确的后端服务
- **协议转换**: HTTP/WebSocket/gRPC 互转
- **安全防护**: 认证授权、防 DDoS
- **流量控制**: 限流、熔断、缓存
- **可观测性**: 日志、监控、追踪集中处理

### 网关 vs 服务直接访问

\`\`\`
┌──────────────────────────────────────────────────────────────┐
│                       API Gateway                            │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐   │
│  │ 认证     │ 限流     │ 路由     │ 监控     │ 缓存     │   │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘   │
└──────────────────────────────────────────────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
    ┌──────────┐      ┌──────────┐      ┌──────────┐
    │ Service 1│      │ Service 2│      │ Service 3│
    └──────────┘      └──────────┘      └──────────┘
\`\`\`

## 网关核心功能

### 1. 路由和负载均衡

#### Express Gateway 配置

\`\`\`yaml
# gateway.config.yml
http:
  port: 8080

apiEndpoints:
  api:
    host: localhost
    paths:
      - /api/v1/*
      - /api/v2/*

serviceEndpoints:
  user-service:
    url: 'http://user-service:3001'
  order-service:
    url: 'http://order-service:3002'
  product-service:
    url: 'http://product-service:3003'

policies:
  - proxy
  - log
  - rate-limit
  - jwt

pipelines:
  user-pipeline:
    apiEndpoints:
      - api
    policies:
      - jwt:
          - action:
              secretOrKey: secret
      - rate-limit:
          - action:
              max: 100
              windowMs: 60000
      - log:
          - action:
              message: '\${req.method} \${req.originalUrl}'
      - proxy:
          - action:
              serviceEndpoint: user-service
              changeOrigin: true
\`\`\`

#### Nginx 配置

\`\`\`nginx
# nginx.conf
upstream user_service {
    least_conn;
    server user-service-1:3001;
    server user-service-2:3001;
    server user-service-3:3001;
}

upstream order_service {
    least_conn;
    server order-service-1:3002;
    server order-service-2:3002;
}

server {
    listen 80;

    # 用户服务路由
    location /api/users {
        proxy_pass http://user_service;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Request-ID \$request_id;
    }

    # 订单服务路由
    location /api/orders {
        proxy_pass http://order_service;
        proxy_set_header Host \$host;
        proxy_connect_timeout 5s;
        proxy_send_timeout 10s;
        proxy_read_timeout 30s;
    }

    # 健康检查
    location /health {
        access_log off;
        return 200 "healthy\\n";
        add_header Content-Type text/plain;
    }
}
\`\`\`

### 2. 认证和授权

#### JWT 认证

\`\`\`javascript
// express-auth.js
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user.permissions?.includes(permission)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// 公开端点
app.post('/api/login', loginHandler);

// 受保护端点
app.get('/api/users', authenticateJWT, requirePermission('users:read'), getUsersHandler);
app.post('/api/users', authenticateJWT, requirePermission('users:write'), createUserHandler);
\`\`\`

#### OAuth 2.0 集成

\`\`\`javascript
const oauth = require('oauth2-server');

app.oauth = new oauth({
  model: require('./oauth-model'),
  accessTokenLifetime: 3600,
  allowBearerTokensInQueryString: true
});

app.post('/oauth/token', async (req, res) => {
  try {
    const token = await app.oauth.token(req, res);
    res.json(token);
  } catch (error) {
    res.status(error.code || 500).json({ error: error.message });
  }
});

app.get('/api/protected', app.oauth.authenticate(), (req, res) => {
  res.json({ user: req.user });
});
\`\`\`

### 3. 限流

#### 基于用户的限流

\`\`\`javascript
const rateLimit = require('express-rate-limit');

const userLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: 60
    });
  }
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true
});

app.use('/api/', userLimiter);
app.use('/api/payment/', strictLimiter);
\`\`\`

#### Redis 限流

\`\`\`javascript
const Redis = require('ioredis');
const redis = new Redis();

async function checkRateLimit(userId, limit, windowMs) {
  const key = \`ratelimit:\${userId}\`;
  const now = Date.now();
  const windowStart = now - windowMs;

  const pipeline = redis.pipeline();
  pipeline.zremrangebyscore(key, 0, windowStart);
  pipeline.zcard(key);
  pipeline.zadd(key, now, now);
  pipeline.pexpire(key, windowMs);

  const results = await pipeline.exec();
  const count = results[1][1];

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    reset: now + windowMs
  };
}

// 使用
app.use('/api/', async (req, res, next) => {
  const userId = req.user?.id || req.ip;
  const result = await checkRateLimit(userId, 100, 60000);

  res.setHeader('X-RateLimit-Limit', '100');
  res.setHeader('X-RateLimit-Remaining', result.remaining.toString());

  if (!result.allowed) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }

  next();
});
\`\`\`

### 4. 熔断器

\`\`\`javascript
const { CircuitBreaker } = require('opossum');

const userServiceOptions = {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000
};

const userServiceBreaker = new CircuitBreaker(
  async (userId) => {
    const response = await axios.get(\`http://user-service/users/\${userId}\`);
    return response.data;
  },
  userServiceOptions
);

userServiceBreaker.on('open', () => {
  console.error('User service circuit breaker opened!');
});

userServiceBreaker.fallback((userId) => {
  return { id: userId, name: 'Unknown', cached: true };
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await userServiceBreaker.fire(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(503).json({ error: 'Service temporarily unavailable' });
  }
});
\`\`\`

### 5. 请求/响应转换

#### API 版本控制

\`\`\`javascript
const { body } = require('express-validator');

// v1 到 v2 转换
function transformV1ToV2(req, res, next) {
  if (req.apiVersion === 'v1') {
    // v1 格式: { username, email }
    // v2 格式: { name, email_address }
    req.body = {
      name: req.body.username,
      email_address: req.body.email
    };
  }
  next();
}

// v2 到 v1 转换
function transformV2ToV1(data) {
  return {
    username: data.name,
    email: data.email_address
  };
}

app.post('/api/users',
  transformV1ToV2,
  async (req, res, next) => {
    const user = await createUser(req.body);
    if (req.apiVersion === 'v1') {
      res.json(transformV2ToV1(user));
    } else {
      res.json(user);
    }
  }
);
\`\`\`

### 6. 缓存

\`\`\`javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 });

function cacheMiddleware(ttl = 300) {
  return (req, res, next) => {
    const key = \`cache:\${req.method}:\${req.originalUrl}\`;
    const cached = cache.get(key);

    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached);
    }

    res.setHeader('X-Cache', 'MISS');

    // 劫持 res.json
    const originalJson = res.json.bind(res);
    res.json = function(data) {
      cache.set(key, data, ttl);
      return originalJson(data);
    };

    next();
  };
}

// 缓存 GET 请求
app.get('/api/products', cacheMiddleware(60), getProducts);
\`\`\`

### 7. 日志和监控

\`\`\`javascript
const { v4: uuidv4 } = require('uuid');

app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] || uuidv4();
  req.id = requestId;
  res.setHeader('X-Request-ID', requestId);

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    };

    logger.info('API request', logData);

    // 发送到监控系统
    metrics.record('api.request', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration
    });
  });

  next();
});
\`\`\`

## Kong 网关实战

### 1. 安装和配置

\`\`\`bash
# Docker 安装
docker run -d \\
  --name kong \\
  --network=kong-net \\
  -e "KONG_DATABASE=off" \\
  -e "KONG_PROXY_ACCESS_LOG=/dev/stdout" \\
  -e "KONG_ADMIN_ACCESS_LOG=/dev/stdout" \\
  -e "KONG_ADMIN_LISTEN=0.0.0.0:8001" \\
  -p 8000:8000 \\
  -p 8443:8443 \\
  -p 8001:8001 \\
  kong/kong-gateway:latest
\`\`\`

### 2. 添加服务

\`\`\`bash
# 添加用户服务
curl -i -X POST \\
  --url http://localhost:8001/services \\
  --data 'name=user-service' \\
  --data 'url=http://user-service:3001'

# 添加路由
curl -i -X POST \\
  --url http://localhost:8001/services/user-service/routes \\
  --data 'paths[]=/api/users' \\
  --data 'methods[]=GET' \\
  --data 'methods[]=POST'
\`\`\`

### 3. 添加插件

\`\`\`bash
# 启用限流
curl -i -X POST \\
  --url http://localhost:8001/services/user-service/plugins \\
  --data 'name=rate-limiting' \\
  --data 'config.minute=100' \\
  --data 'config.policy=local'

# 启用 JWT 认证
curl -i -X POST \\
  --url http://localhost:8001/services/user-service/plugins \\
  --data 'name=jwt'

# 启用 CORS
curl -i -X POST \\
  --url http://localhost:8001/plugins \\
  --data 'name=cors' \\
  --data 'config.origins=http://localhost:3000' \\
  --data 'config.methods=GET,POST,PUT,DELETE' \\
  --data 'config.credentials=true'
\`\`\`

## 实战案例：电商 API 网关

### 完整配置

\`\`\`javascript
// gateway/index.js
const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { CircuitBreaker } = require('opossum');

const app = express();

// 服务映射
const services = {
  users: 'http://user-service:3001',
  orders: 'http://order-service:3002',
  products: 'http://product-service:3003',
  payments: 'http://payment-service:3004'
};

// 熔断器
const breakers = {};

function getBreaker(serviceName) {
  if (!breakers[serviceName]) {
    breakers[serviceName] = new CircuitBreaker(
      async (url, config) => (await axios(url, config)).data,
      {
        timeout: 5000,
        errorThresholdPercentage: 50,
        resetTimeout: 30000
      }
    );
  }
  return breakers[serviceName];
}

// 路由处理
async function proxyRequest(serviceName, path, req) {
  const serviceUrl = services[serviceName];
  const url = \`\${serviceUrl}\${path}\`;
  const breaker = getBreaker(serviceName);

  const config = {
    method: req.method,
    headers: {
      ...req.headers,
      'x-request-id': req.id,
      'x-forwarded-for': req.ip
    },
    params: req.query
  };

  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    config.data = req.body;
  }

  return breaker.fire(url, config);
}

// 路由
app.post('/api/auth/login', async (req, res) => {
  try {
    const result = await proxyRequest('users', '/auth/login', req);
    res.json(result);
  } catch (error) {
    res.status(503).json({ error: 'Service unavailable' });
  }
});

// 认证中间件
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// 受保护路由
app.use('/api/*', authenticate);

app.get('/api/users/*', async (req, res) => {
  try {
    const result = await proxyRequest('users', req.path.replace('/api/users', ''), req);
    res.json(result);
  } catch (error) {
    res.status(503).json({ error: 'Service unavailable' });
  }
});

app.get('/api/orders/*', async (req, res) => {
  try {
    const result = await proxyRequest('orders', req.path.replace('/api/orders', ''), req);
    res.json(result);
  } catch (error) {
    res.status(503).json({ error: 'Service unavailable' });
  }
});

app.get('/api/products/*', async (req, res) => {
  try {
    const result = await proxyRequest('products', req.path.replace('/api/products', ''), req);
    res.json(result);
  } catch (error) {
    res.status(503).json({ error: 'Service unavailable' });
  }
});

app.listen(8080, () => {
  console.log('API Gateway running on port 8080');
});
\`\`\`

## 最佳实践

### 1. 配置管理

\`\`\`yaml
# gateway-config.yaml
routes:
  - path: /api/users/*
    service: user-service
    timeout: 5000
    policies:
      - jwt
      - rate-limit:100
      - cache:300

  - path: /api/orders/*
    service: order-service
    timeout: 10000
    policies:
      - jwt
      - rate-limit:50
\`\`\`

### 2. 灰度发布

\`\`\`javascript
function canaryDeployment(req, res, next) {
  const canaryRatio = 0.1; // 10% 流量到新版本

  if (Math.random() < canaryRatio) {
    req.serviceUrl = 'http://user-service-v2:3001';
  } else {
    req.serviceUrl = 'http://user-service-v1:3001';
  }

  next();
}
\`\`\`

### 3. 监控和告警

\`\`\`javascript
// Prometheus metrics
const promClient = require('prom-client');

const requestDuration = new promClient.Histogram({
  name: 'gateway_request_duration_seconds',
  help: 'Request duration in seconds',
  labelNames: ['method', 'path', 'status']
});

const requestTotal = new promClient.Counter({
  name: 'gateway_requests_total',
  help: 'Total requests',
  labelNames: ['method', 'path', 'status']
});

app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    requestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
    requestTotal
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .inc();
  });

  next();
});
\`\`\`

## 常见问题

### Q: 如何避免网关成为瓶颈？

A: 优化策略：
1. 使用高性能网关（Nginx、Envoy）
2. 水平扩展网关实例
3. 启用缓存减少后端调用
4. 使用连接池复用连接

### Q: 如何处理大文件上传？

A: 解决方案：
1. 使用预签名 URL 直传对象存储
2. 网关只处理元数据
3. 使用分片上传

## 下一步

- 学习 [限流熔断](/tutorial/rate-limiting-circuit-breaker) 了解流量控制
- 探索 [分布式追踪](/tutorial/distributed-tracing) 了解请求追踪
- 阅读 [可观测性实现](/tutorial/observability-implementation) 了解监控

## 相关技能

- [Kong](/skills) - API 网关
- [Nginx](/skills) - 反向代理
- [Envoy](/skills) - 服务代理`;

// Tutorial 085: GraphQL Federation (replacing duplicate)
const tutorial085Content = `# GraphQL Federation 实战指南

GraphQL Federation 是一种将多个 GraphQL API 组合成统一图谱的架构模式。本教程将深入讲解 Federation 的核心概念和实战应用。

## 为什么需要 Federation？

### 传统 GraphQL API 的问题

- **单一 Schema**: 所有团队维护一个大型 Schema
- **部署耦合**: 一个服务的变更影响整个 API
- **性能瓶颈**: 单点解析所有查询
- **团队冲突**: 多团队协作困难

### Federation 解决方案

\`\`\`
                    ┌─────────────────┐
                    │   GraphQL      │
                    │   Gateway      │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
    ┌──────────┐      ┌──────────┐      ┌──────────┐
    │  Users   │      │ Products │      │  Orders  │
    │ Subgraph │      │ Subgraph │      │ Subgraph │
    └──────────┘      └──────────┘      └──────────┘
\`\`\`

## 核心概念

### 1. Subgraph（子图）

每个服务维护自己的 GraphQL Schema：

\`\`\`graphql
# users/subgraph.graphql
type User @key(fields: "id") {
  id: ID!
  name: String!
  email: String!
}

extend type Query {
  user(id: ID!): User
}

extend type Order @key(fields: "userId") {
  userId: ID! @external
  user: User
}
\`\`\`

\`\`\`graphql
# products/subgraph.graphql
type Product @key(fields: "id") {
  id: ID!
  name: String!
  price: Float!
  description: String
}

extend type Query {
  product(id: ID!): Product
  products: [Product!]!
}
\`\`\`

\`\`\`graphql
# orders/subgraph.graphql
type Order @key(fields: "id") {
  id: ID!
  userId: ID!
  items: [OrderItem!]!
  total: Float!
  createdAt: String!
}

type OrderItem {
  productId: ID!
  quantity: Int!
  price: Float!
}

extend type Query {
  orders(userId: ID!): [Order!]!
}

# 引用其他 Subgraph 的类型
extend type User @key(fields: "id") {
  id: ID! @external
  orders: [Order!]!
}

extend type Product @key(fields: "id") {
  id: ID! @external
}
\`\`\`

### 2. @key 指令

定义实体的唯一标识：

\`\`\`graphql
type User @key(fields: "id") {
  id: ID!
  name: String!
}

# 复合键
type OrderItem @key(fields: "orderId productId") {
  orderId: ID!
  productId: ID!
  quantity: Int!
}
\`\`\`

### 3. @external 指令

标记字段来自其他 Subgraph：

\`\`\`graphql
extend type Order @key(fields: "id") {
  id: ID! @external
  user: User      # 本地字段，引用外部类型
}
\`\`\`

### 4. @requires 指令

声明需要外部字段才能计算本地字段：

\`\`\`graphql
extend type Order @key(fields: "id") {
  id: ID! @external
  userId: ID! @external
  # 需要 userId 才能计算 user
  user: User
  # 需要 items 中的 productId 才能计算 products
  products: [Product!]!
    @requires(fields: "items { productId }")
}
\`\`\`

### 5. @provides 指令

声明查询返回时包含的外部字段：

\`\`\`graphql
extend type Query {
  # 返回 Order 时包含 userId 的 User 信息
  orders(userId: ID!): [Order!]!
    @provides(fields: "userId user { id }")
}
\`\`\`

## 实现 Subgraph

### 1. Users Subgraph (Apollo Server)

\`\`\`javascript
// users/index.js
const { ApolloServer } = require('@apollo/server');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { readFileSync } = require('fs');
const gql = require('graphql-tag');

const typeDefs = gql\`
  type User @key(fields: "id") {
    id: ID!
    name: String!
    email: String!
    addresses: [Address!]!
  }

  type Address {
    street: String!
    city: String!
    country: String!
    zipCode: String!
  }

  extend type Query {
    user(id: ID!): User
    users: [User!]!
  }

  extend type Order @key(fields: "userId") {
    userId: ID! @external
    user: User
  }
\`;

const resolvers = {
  Query: {
    user: (_, { id }) => ({
      id,
      name: 'John Doe',
      email: 'john@example.com',
      addresses: []
    }),
    users: () => [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        addresses: []
      }
    ]
  },
  Order: {
    user: (order) => ({
      __typename: 'User',
      id: order.userId
    })
  }
  // User.__resolveReference 用于处理其他 Subgraph 的引用
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }])
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(\`Users Subgraph ready at \${url}\`);
});
\`\`\`

### 2. Products Subgraph

\`\`\`javascript
// products/index.js
const typeDefs = gql\`
  type Product @key(fields: "id") {
    id: ID!
    name: String!
    price: Float!
    description: String
    inStock: Boolean!
  }

  extend type Query {
    product(id: ID!): Product
    products: [Product!]!
  }

  extend type OrderItem @key(fields: "orderId productId") {
    orderId: ID! @external
    productId: ID! @external
    product: Product
  }
\`;

const resolvers = {
  Query: {
    product: (_, { id }) => ({
      id,
      name: 'Product Name',
      price: 99.99,
      description: 'Description',
      inStock: true
    }),
    products: () => []
  },
  OrderItem: {
    product: (orderItem) => ({
      __typename: 'Product',
      id: orderItem.productId
    })
  }
};
\`\`\`

### 3. Orders Subgraph

\`\`\`javascript
// orders/index.js
const typeDefs = gql\`
  type Order @key(fields: "id") {
    id: ID!
    userId: ID!
    items: [OrderItem!]!
    total: Float!
    status: OrderStatus!
    createdAt: String!
    # 需要从 Users Subgraph 获取
    user: User
    # 需要外部字段计算
    products: [Product!]!
      @requires(fields: "items { productId }")
  }

  enum OrderStatus {
    PENDING
    PROCESSING
    SHIPPED
    DELIVERED
    CANCELLED
  }

  type OrderItem {
    productId: ID!
    quantity: Int!
    price: Float!
    # 引用 Products Subgraph
    product: Product
  }

  extend type Query {
    orders(userId: ID!): [Order!]!
    order(id: ID!): Order
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    orders: [Order!]!
  }

  extend type Product @key(fields: "id") {
    id: ID! @external
  }
\`;

const resolvers = {
  Query: {
    orders: (_, { userId }) => [
      {
        id: '1',
        userId,
        items: [
          { productId: 'p1', quantity: 2, price: 99.99 }
        ],
        total: 199.98,
        status: 'PROCESSING',
        createdAt: '2024-01-01T00:00:00Z'
      }
    ],
    order: (_, { id }) => ({
      id,
      userId: '1',
      items: [],
      total: 0,
      status: 'PENDING',
      createdAt: '2024-01-01T00:00:00Z'
    })
  },
  User: {
    orders: (user) => [
      {
        id: '1',
        userId: user.id,
        items: [],
        total: 0,
        status: 'PENDING',
        createdAt: '2024-01-01T00:00:00Z'
      }
    ]
  },
  Order: {
    user: (order) => ({
      __typename: 'User',
      id: order.userId
    }),
    products: (order) =>
      order.items.map((item) => ({
        __typename: 'Product',
        id: item.productId
      }))
  }
};
\`\`\`

## Gateway 配置

### 1. Apollo Router

\`\`\`bash
# 安装 Rover CLI
curl -sSL https://rover.apollo.dev/rover/v0/rover-linux-amd64.tar.gz | tar xz
sudo mv rover /usr/local/bin/

# 发布 Subgraph
rover subgraph publish my-graph@prod \\
  --name users \\
  --routing-url http://users:4001 \\
  --schema users/subgraph.graphql

rover subgraph publish my-graph@prod \\
  --name products \\
  --routing-url http://products:4002 \\
  --schema products/subgraph.graphql
\`\`\`

\`\`\`yaml
# router.yaml
supergraph:
  listen: 0.0.0.0:4000

headers:
  all:
    - propagate:
        named: "x-request-id"

sandbox:
  enabled: true

# 缓存配置
cache:
  redis:
    url: redis://redis:6379
\`\`\`

\`\`\`bash
# 启动 Router
docker run -d \\
  --name router \\
  -p 4000:4000 \\
  -v ./router.yaml:/etc/router/config.yaml \\
  -e APOLLO_KEY=your-key \\
  -e APOLLO_GRAPH_REF=my-graph@prod \\
  ghcr.io/apollo/router:latest
\`\`\`

## 实战案例：电商 Federation

### 完整架构

\`\`\`
Gateway (port 4000)
    │
    ├── Users Subgraph (port 4001)
    │   └── 用户信息、地址
    │
    ├── Products Subgraph (port 4002)
    │   └── 产品信息、库存
    │
    ├── Orders Subgraph (port 4003)
    │   └── 订单、引用 User 和 Product
    │
    └── Reviews Subgraph (port 4004)
        └── 评价、引用 Product 和 User
\`\`\`

### 联合查询

\`\`\`graphql
query GetUserOrdersWithProducts($userId: ID!) {
  user(id: $userId) {
    id
    name
    email
    orders {
      id
      total
      status
      items {
        quantity
        price
        product {
          id
          name
          description
          inStock
        }
      }
    }
  }
}
\`\`\`

## 最佳实践

### 1. 实体边界

- **按业务域划分**: Users、Products、Orders
- **避免循环依赖**: A 引用 B，B 不要引用 A
- **最小化跨服务调用**: 只在需要时引用外部实体

### 2. 错误处理

\`\`\`javascript
const resolvers = {
  User: {
    orders: async (user, _, { dataSources }) => {
      try {
        return await dataSources.ordersAPI.getOrdersByUser(user.id);
      } catch (error) {
        // 返回部分结果，不是整个查询失败
        console.error('Failed to fetch orders:', error);
        return [];
      }
    }
  }
};
\`\`\`

### 3. 性能优化

\`\`\`graphql
# 使用 @inSkip 跳过不需要的字段
query GetUsers($withOrders: Boolean!) {
  users {
    id
    name
    orders @include(if: $withOrders) {
      id
    }
  }
}
\`\`\`

## 常见问题

### Q: 如何处理认证？

A: 在 Gateway 层处理：

\`\`\`javascript
const context = async ({ req }) => {
  const token = req.headers.authorization?.split(' ')[1];
  const user = await authenticateToken(token);
  return { user, dataSources };
};
\`\`\`

### Q: 如何处理文件上传？

A: 使用单独的 REST 端点：

\`\`\`javascript
app.post('/upload', upload.single('file'), async (req, res) => {
  const url = await uploadToS3(req.file);
  res.json({ url });
});
\`\`\`

## 下一步

- 学习 [GraphQL API 开发](/tutorial/graphql-api-development) 了解基础
- 探索 [API 网关](/tutorial/api-gateway-patterns) 了解网关模式
- 阅读 [分布式追踪](/tutorial/distributed-tracing) 了解性能监控

## 相关技能

- [Apollo Federation](/skills) - GraphQL 联合
- [GraphQL](/skills) - 查询语言
- [Apollo Router](/skills) - Federation 网关`;

// Create the 4 new tutorials for US-101
const newTutorials = [
  {
    id: "tutorial-082",
    title: "分布式追踪实战指南",
    slug: "distributed-tracing",
    description: "掌握分布式追踪技术，使用 OpenTelemetry 和 Jaeger 追踪微服务请求链路，定位性能瓶颈和故障。",
    content: tutorial082Content,
    category: "development",
    tags: ["分布式追踪", "OpenTelemetry", "Jaeger", "微服务", "可观测性"],
    difficulty: "intermediate",
    readTime: 28,
    author: "OpenClaw Team",
    relatedSkills: [],
    stats: { viewCount: 75 },
    createdAt: now,
    featured: false
  },
  {
    id: "tutorial-083",
    title: "限流和熔断实战指南",
    slug: "rate-limiting-circuit-breaker",
    description: "深入学习限流和熔断技术，保护微服务免受过载影响，实现高可用系统架构。",
    content: tutorial083Content,
    category: "development",
    tags: ["限流", "熔断", "微服务", "高可用", "保护机制"],
    difficulty: "intermediate",
    readTime: 30,
    author: "OpenClaw Team",
    relatedSkills: [],
    stats: { viewCount: 88 },
    createdAt: now,
    featured: false
  },
  {
    id: "tutorial-084",
    title: "API 网关实战指南",
    slug: "api-gateway-patterns",
    description: "掌握 API 网关的核心功能，包括路由、认证、限流、熔断、缓存等，构建微服务统一入口。",
    content: tutorial084Content,
    category: "development",
    tags: ["API Gateway", "Kong", "Nginx", "微服务", "网关"],
    difficulty: "intermediate",
    readTime: 32,
    author: "OpenClaw Team",
    relatedSkills: ["skill-106"],
    stats: { viewCount: 95 },
    createdAt: now,
    featured: false
  },
  {
    id: "tutorial-085",
    title: "GraphQL Federation 实战指南",
    slug: "graphql-federation",
    description: "深入学习 GraphQL Federation 架构，实现跨服务的 GraphQL 联合查询和微服务协同。",
    content: tutorial085Content,
    category: "development",
    tags: ["GraphQL", "Federation", "Apollo", "微服务", "分布式"],
    difficulty: "intermediate",
    readTime: 26,
    author: "OpenClaw Team",
    relatedSkills: ["skill-065"],
    stats: { viewCount: 82 },
    createdAt: now,
    featured: false
  }
];

// Append new tutorials
tutorials.push(...newTutorials);

// Write back to file
fs.writeFileSync(tutorialsJsonPath, JSON.stringify(tutorials, null, 2), 'utf8');

console.log(`Added ${newTutorials.length} new Intermediate tutorials for US-101:`);
newTutorials.forEach(t => {
  console.log(`  - ${t.id}: ${t.title}`);
});
console.log(`Total tutorials: ${tutorials.length}`);
