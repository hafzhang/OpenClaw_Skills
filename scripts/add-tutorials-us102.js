const fs = require('fs');
const path = require('path');

const tutorialsJsonPath = path.join(__dirname, '..', 'src', 'data', 'tutorials.json');
const tutorials = JSON.parse(fs.readFileSync(tutorialsJsonPath, 'utf8'));

const now = new Date().toISOString();

// Tutorial 089: Large-scale Architecture Design
const tutorial089Content = `# 大规模架构设计实战指南

大规模系统架构设计是处理百万级用户、海量数据的复杂工程。本教程将深入讲解大规模架构的核心原则、设计模式和实战经验。

## 大规模架构的挑战

### 核心问题

- **高并发**: 数百万同时在线用户
- **海量数据**: PB 级数据存储和查询
- **低延迟**: 毫秒级响应要求
- **高可用**: 99.99%+ 可用性目标
- **可扩展性**: 快速响应业务增长

### CAP 定理

在分布式系统中，一致性(Consistency)、可用性(Availability)、分区容错性(Partition Tolerance)三者只能满足其二：

\`\`\`
         Consistency (一致性)
              |
              |
    CP -----+----- AP
              |
              |
         Availability (可用性)

P: Partition Tolerance (分区容错) - 必须满足
\`\`\`

**选择策略**:
- **CP**: 一致性 + 分区容错 (如 HBase、MongoDB)
- **AP**: 可用性 + 分区容错 (如 Cassandra、DynamoDB)
- **CA**: 一致性 + 可用性 (单机系统，无法应对分区)

## 分层架构

### 1. 传统三层架构

\`\`\`
┌─────────────────────────────────────────────┐
│              Presentation Layer             │
│          (API Gateway, Load Balancer)       │
└─────────────────────────────────────────────┘
                       │
┌─────────────────────────────────────────────┐
│               Application Layer             │
│     (Microservices, Business Logic)         │
└─────────────────────────────────────────────┘
                       │
┌─────────────────────────────────────────────┐
│                Data Layer                   │
│  (Databases, Cache, Message Queue)          │
└─────────────────────────────────────────────┘
\`\`\`

### 2. 微服务分层

\`\`\`javascript
// 分层架构示例
const express = require('express');

// API Gateway Layer
class APIGateway {
  constructor() {
    this.services = {
      users: 'http://user-service:3001',
      orders: 'http://order-service:3002',
      products: 'http://product-service:3003',
      payments: 'http://payment-service:3004'
    };
    this.rateLimiter = new RateLimiter();
    this.authMiddleware = new AuthMiddleware();
  }

  async routeRequest(service, path, req) {
    // 认证
    const user = await this.authMiddleware.authenticate(req);

    // 限流
    await this.rateLimiter.checkLimit(user.id);

    // 路由到目标服务
    const serviceUrl = this.services[service];
    return await this.proxyRequest(serviceUrl, path, req);
  }
}

// Service Layer
class UserService {
  constructor() {
    this.db = new Database('users');
    this.cache = new RedisCache('users');
  }

  async getUser(userId) {
    // 先查缓存
    const cached = await this.cache.get(userId);
    if (cached) return cached;

    // 查数据库
    const user = await this.db.findById(userId);
    if (!user) throw new Error('User not found');

    // 写入缓存
    await this.cache.set(userId, user, 3600);

    return user;
  }
}
\`\`\`

## CQRS 模式

### 命令查询职责分离

CQRS 将读写操作分离，使用不同的模型：

\`\`\`
┌─────────────┐     Write      ┌──────────────┐
│   Client    │ ──────────────> │ Command Side │
└─────────────┘                 │  (Write DB)  │
       │                        └──────────────┘
       │                              │
       │ Read                         │ Sync
       │                              │
       ▼                              ▼
┌─────────────┐                 ┌──────────────┐
│ Query Side  │ <─────────────── │  Event Store │
│ (Read DB)   │      Events     └──────────────┘
└─────────────┘
\`\`\`

### 实现 CQRS

\`\`\`javascript
// Command Side (写模型)
class UserCommandHandler {
  constructor(eventStore) {
    this.eventStore = eventStore;
  }

  async CreateUser(command) {
    const { userId, name, email } = command;

    // 验证
    if (await this.userExists(userId)) {
      throw new Error('User already exists');
    }

    // 创建事件
    const event = {
      type: 'UserCreated',
      userId,
      name,
      email,
      timestamp: Date.now()
    };

    // 保存到事件存储
    await this.eventStore.append(event);

    return { userId, status: 'created' };
  }

  async UpdateUserEmail(command) {
    const { userId, newEmail } = command;

    const event = {
      type: 'UserEmailUpdated',
      userId,
      oldEmail: await this.getCurrentEmail(userId),
      newEmail,
      timestamp: Date.now()
    };

    await this.eventStore.append(event);

    return { userId, email: newEmail };
  }
}

// Query Side (读模型)
class UserQueryHandler {
  constructor(readDB) {
    this.readDB = readDB;
  }

  async getUser(userId) {
    // 从读模型查询
    return await this.readDB.users.findById(userId);
  }

  async listUsers(filters) {
    return await this.readDB.users.find(filters);
  }
}

// Event Projection (事件投影)
class UserProjection {
  constructor(readDB) {
    this.readDB = readDB;
  }

  async handle(event) {
    switch (event.type) {
      case 'UserCreated':
        await this.readDB.users.insert({
          id: event.userId,
          name: event.name,
          email: event.email,
          version: 1
        });
        break;

      case 'UserEmailUpdated':
        await this.readDB.users.update(
          { id: event.userId },
          { email: event.newEmail }
        );
        break;
    }
  }
}
\`\`\`

## 事件溯源

### 存储事件而非状态

\`\`\`javascript
// 传统状态存储
{
  "id": "user-123",
  "name": "Alice",
  "email": "alice@example.com",
  "balance": 100
}

// 事件溯源存储
[
  { "type": "UserCreated", "userId": "user-123", "name": "Alice", "timestamp": "2024-01-01T00:00:00Z" },
  { "type": "EmailUpdated", "userId": "user-123", "newEmail": "alice@example.com", "timestamp": "2024-01-02T00:00:00Z" },
  { "type": "BalanceCredited", "userId": "user-123", "amount": 100, "timestamp": "2024-01-03T00:00:00Z" }
]
\`\`\`

### 实现事件溯源

\`\`\`javascript
class EventStore {
  constructor(db) {
    this.db = db;
  }

  async getEvents(aggregateId) {
    return await this.db.events.find({ aggregateId }).sort({ sequence: 1 });
  }

  async append(event) {
    const lastEvent = await this.db.events
      .find({ aggregateId: event.aggregateId })
      .sort({ sequence: -1 })
      .limit(1);

    const sequence = (lastEvent.sequence || 0) + 1;

    await this.db.events.insert({
      ...event,
      sequence,
      timestamp: Date.now()
    });
  }

  async replay(aggregateId) {
    const events = await this.getEvents(aggregateId);

    let state = null;

    for (const event of events) {
      state = this.applyEvent(state, event);
    }

    return state;
  }

  applyEvent(state, event) {
    switch (event.type) {
      case 'UserCreated':
        return {
          id: event.userId,
          name: event.name,
          email: event.email,
          version: event.sequence
        };

      case 'EmailUpdated':
        return {
          ...state,
          email: event.newEmail,
          version: event.sequence
        };

      default:
        return state;
    }
  }
}
\`\`\`

## 数据分片

### 水平分片策略

\`\`\`javascript
// 1. Hash-based Sharding
class HashSharding {
  constructor(shardCount) {
    this.shardCount = shardCount;
  }

  getShard(key) {
    const hash = this.hashCode(key);
    return hash % this.shardCount;
  }

  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}

// 2. Range-based Sharding
class RangeSharding {
  constructor(ranges) {
    // ranges = [{ min: 0, max: 1000, shard: 'shard1' }, ...]
    this.ranges = ranges.sort((a, b) => a.min - b.min);
  }

  getShard(value) {
    for (const range of this.ranges) {
      if (value >= range.min && value < range.max) {
        return range.shard;
      }
    }
    throw new Error('Value out of range');
  }
}

// 3. Directory-based Sharding
class DirectorySharding {
  constructor(lookupTable) {
    // lookupTable = { key1: 'shard1', key2: 'shard2', ... }
    this.lookupTable = lookupTable;
  }

  async getShard(key) {
    const shard = await this.lookupTable.get(key);
    if (!shard) {
      throw new Error('Key not found in lookup table');
    }
    return shard;
  }

  async setShard(key, shard) {
    await this.lookupTable.set(key, shard);
  }
}
\`\`\`

### 分片路由

\`\`\`javascript
class ShardedConnectionPool {
  constructor(shards) {
    // shards = { shard1: connection1, shard2: connection2, ... }
    this.shards = shards;
    this.shardingStrategy = new HashSharding(Object.keys(shards).length);
  }

  async query(key, sql, params) {
    const shardName = this.shardingStrategy.getShard(key);
    const connection = this.shards[shardName];

    return await connection.query(sql, params);
  }

  async broadcast(sql, params) {
    const results = [];

    for (const [shardName, connection] of Object.entries(this.shards)) {
      const result = await connection.query(sql, params);
      results.push({ shard: shardName, result });
    }

    return results;
  }
}

// 使用示例
const pool = new ShardedConnectionPool({
  shard1: createConnection('db1.example.com'),
  shard2: createConnection('db2.example.com'),
  shard3: createConnection('db3.example.com'),
  shard4: createConnection('db4.example.com')
});

// 路由查询
const user = await pool.query('user-123', 'SELECT * FROM users WHERE id = ?', ['user-123']);

// 广播查询
const allUsers = await pool.broadcast('SELECT COUNT(*) as count FROM users');
\`\`\`

## 读写分离

### Master-Slave 复制

\`\`\`javascript
class ReadWriteSplitDB {
  constructor(masterConfig, slaveConfigs) {
    this.master = new DatabaseConnection(masterConfig);
    this.slaves = slaveConfigs.map(config => new DatabaseConnection(config));
    this.slaveIndex = 0;
  }

  // 写操作使用 Master
  async write(sql, params) {
    return await this.master.query(sql, params);
  }

  // 读操作使用 Slave
  async read(sql, params) {
    const slave = this.getNextSlave();
    return await slave.query(sql, params);
  }

  getNextSlave() {
    // 轮询负载均衡
    const slave = this.slaves[this.slaveIndex];
    this.slaveIndex = (this.slaveIndex + 1) % this.slaves.length;
    return slave;
  }

  // 强制从 Master 读取（需要最新数据）
  async readFromMaster(sql, params) {
    return await this.master.query(sql, params);
  }
}
\`\`\`

### 读写分离中间件

\`\`\`javascript
const express = require('express');

class ReadWriteSplitMiddleware {
  constructor(db) {
    this.db = db;
  }

  middleware() {
    return (req, res, next) => {
      const method = req.method;
      const path = req.path;

      // 判断是否为写操作
      const isWrite = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);

      if (isWrite) {
        req.db = this.db.master;
      } else {
        // 可以添加路由规则判断
        const needsFreshData = this.needsFreshData(path);

        if (needsFreshData) {
          req.db = this.db.master;
        } else {
          req.db = this.db.getSlave();
        }
      }

      next();
    };
  }

  needsFreshData(path) {
    // 某些路径需要最新数据
    const freshPaths = ['/api/user/profile', '/api/cart/current'];
    return freshPaths.some(p => path.startsWith(p));
  }
}
\`\`\`

## 缓存策略

### 多级缓存

\`\`\`javascript
class MultiLevelCache {
  constructor() {
    this.l1Cache = new Map(); // 内存缓存
    this.l2Cache = new RedisClient(); // Redis 缓存
    this.database = new DatabaseClient();
  }

  async get(key) {
    // L1: 内存缓存 (最快)
    if (this.l1Cache.has(key)) {
      return this.l1Cache.get(key);
    }

    // L2: Redis 缓存
    const l2Value = await this.l2Cache.get(key);
    if (l2Value) {
      this.l1Cache.set(key, l2Value);
      return l2Value;
    }

    // L3: 数据库
    const dbValue = await this.database.get(key);
    if (dbValue) {
      // 写入缓存
      await this.l2Cache.set(key, dbValue, 3600);
      this.l1Cache.set(key, dbValue);
    }

    return dbValue;
  }

  async set(key, value, ttl = 3600) {
    // 写入所有层级
    this.l1Cache.set(key, value);
    await this.l2Cache.set(key, value, ttl);
    await this.database.set(key, value);
  }

  invalidate(key) {
    this.l1Cache.delete(key);
    this.l2Cache.del(key);
  }
}
\`\`\`

### Cache-Aside 模式

\`\`\`javascript
class CacheAside {
  constructor(cache, database) {
    this.cache = cache;
    this.database = database;
  }

  async get(key) {
    // 1. 尝试从缓存读取
    const cached = await this.cache.get(key);
    if (cached !== null) {
      return cached;
    }

    // 2. 缓存未命中，从数据库读取
    const data = await this.database.get(key);
    if (!data) {
      return null;
    }

    // 3. 将数据写入缓存
    await this.cache.set(key, data, 3600);

    return data;
  }

  async set(key, value) {
    // 更新数据库
    await this.database.set(key, value);

    // 更新缓存
    await this.cache.set(key, value, 3600);
  }

  async delete(key) {
    // 删除数据库
    await this.database.delete(key);

    // 删除缓存
    await this.cache.del(key);
  }
}
\`\`\`

## 消息驱动架构

### 事件驱动

\`\`\`javascript
const { EventEmitter } = require('events');

class EventBus extends EventEmitter {
  constructor() {
    super();
    this.handlers = new Map();
  }

  subscribe(eventType, handler) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }

    this.handlers.get(eventType).push(handler);

    // 返回取消订阅函数
    return () => this.unsubscribe(eventType, handler);
  }

  unsubscribe(eventType, handler) {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  async publish(eventType, event) {
    const handlers = this.handlers.get(eventType) || [];

    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (error) {
        console.error(\`Handler error for \${eventType}:\`, error);
      }
    }
  }
}

// 使用示例
const eventBus = new EventBus();

// 订阅事件
eventBus.subscribe('UserCreated', async (event) => {
  console.log('User created:', event.userId);
  // 发送欢迎邮件
  await sendWelcomeEmail(event.email);
  // 创建用户配置
  await createUserSettings(event.userId);
});

// 发布事件
await eventBus.publish('UserCreated', {
  userId: 'user-123',
  email: 'user@example.com',
  timestamp: Date.now()
});
\`\`\`

### Saga 模式（分布式事务）

\`\`\`javascript
class OrderSaga {
  constructor() {
    this.steps = [
      this.validateInventory.bind(this),
      this.reservePayment.bind(this),
      this.confirmOrder.bind(this),
      this.notifyUser.bind(this)
    ];

    this.compensations = [
      null, // validateInventory 不需要补偿
      this.releasePayment.bind(this),
      this.cancelOrder.bind(this),
      null  // notifyUser 不需要补偿
    ];
  }

  async execute(orderData) {
    const executedSteps = [];

    try {
      // 执行每个步骤
      for (let i = 0; i < this.steps.length; i++) {
        const result = await this.steps[i](orderData);
        executedSteps.push({ step: i, result });
      }

      return { success: true, orderId: orderData.orderId };
    } catch (error) {
      // 执行补偿
      console.error('Saga failed, executing compensations:', error);

      for (let i = executedSteps.length - 1; i >= 0; i--) {
        const compensation = this.compensations[i];
        if (compensation) {
          try {
            await compensation(executedSteps[i].result);
          } catch (compError) {
            console.error(\`Compensation failed for step \${i}:\`, compError);
          }
        }
      }

      throw error;
    }
  }

  async validateInventory(orderData) {
    console.log('Validating inventory...');
    // 检查库存
    const available = await checkInventory(orderData.items);
    if (!available) {
      throw new Error('Insufficient inventory');
    }
    return { items: orderData.items };
  }

  async reservePayment(orderData) {
    console.log('Reserving payment...');
    const paymentId = await createPayment(orderData.amount);
    return { paymentId };
  }

  async releasePayment(executedData) {
    console.log('Releasing payment...');
    await cancelPayment(executedData.paymentId);
  }

  async confirmOrder(orderData) {
    console.log('Confirming order...');
    const order = await createOrder(orderData);
    return { orderId: order.id };
  }

  async cancelOrder(executedData) {
    console.log('Cancelling order...');
    await deleteOrder(executedData.orderId);
  }

  async notifyUser(orderData) {
    console.log('Notifying user...');
    await sendEmail(orderData.userEmail, 'Order confirmed');
    return { notified: true };
  }
}
\`\`\`

## 实战案例：电商订单系统

### 完整架构

\`\`\`javascript
// 主服务类
class ECommerceSystem {
  constructor() {
    this.db = new ShardedConnectionPool({
      shard1: createConnection('orders-db-1'),
      shard2: createConnection('orders-db-2'),
      shard3: createConnection('orders-db-3'),
      shard4: createConnection('orders-db-4')
    });

    this.cache = new MultiLevelCache();
    this.eventBus = new EventBus();
    this.saga = new OrderSaga();

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.eventBus.subscribe('OrderCreated', async (event) => {
      // 更新缓存
      this.cache.invalidate(\`order:\${event.orderId}\`);
      this.cache.invalidate(\`user-orders:\${event.userId}\`);

      // 更新读模型
      await this.updateUserOrderStats(event.userId);
    });

    this.eventBus.subscribe('PaymentCompleted', async (event) => {
      // 扣减库存
      await this.decreaseInventory(event.items);
    });
  }

  async createOrder(orderData) {
    // 使用 Saga 处理分布式事务
    const result = await this.saga.execute(orderData);

    if (result.success) {
      // 发布事件
      await this.eventBus.publish('OrderCreated', {
        orderId: result.orderId,
        userId: orderData.userId,
        items: orderData.items,
        amount: orderData.amount
      });
    }

    return result;
  }

  async getOrder(orderId) {
    // 缓存查询
    const cached = await this.cache.get(\`order:\${orderId}\`);
    if (cached) {
      return cached;
    }

    // 分片查询
    const order = await this.db.query(orderId, 'SELECT * FROM orders WHERE id = ?', [orderId]);

    // 写入缓存
    if (order) {
      await this.cache.set(\`order:\${orderId}\`, order, 300);
    }

    return order;
  }

  async getUserOrders(userId, page = 1, limit = 20) {
    const cacheKey = \`user-orders:\${userId}:\${page}:\${limit}\`;

    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const offset = (page - 1) * limit;
    const orders = await this.db.query(userId, 'SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?', [userId, limit, offset]);

    await this.cache.set(cacheKey, orders, 60);

    return orders;
  }
}
\`\`\`

## 性能优化

### 批量操作

\`\`\`javascript
class BatchOperation {
  constructor(db) {
    this.db = db;
    this.batch = [];
    this.batchSize = 100;
    this.flushInterval = 5000; // 5秒

    this.startFlushTimer();
  }

  async add(operation) {
    this.batch.push(operation);

    if (this.batch.length >= this.batchSize) {
      await this.flush();
    }
  }

  async flush() {
    if (this.batch.length === 0) {
      return;
    }

    const operations = this.batch.splice(0);

    try {
      await this.db.batch(operations);
      console.log(\`Flushed \${operations.length} operations\`);
    } catch (error) {
      console.error('Batch flush failed:', error);
      // 重新入队
      this.batch.unshift(...operations);
    }
  }

  startFlushTimer() {
    setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }
}
\`\`\`

## 最佳实践

### 1. 数据库连接池

\`\`\`javascript
class ConnectionPool {
  constructor(config) {
    this.maxConnections = config.maxConnections || 10;
    this.minConnections = config.minConnections || 2;
    this.connectionFactory = config.connectionFactory;

    this.pool = [];
    this.waiting = [];

    this.initialize();
  }

  async initialize() {
    for (let i = 0; i < this.minConnections; i++) {
      const conn = await this.connectionFactory();
      this.pool.push({ connection: conn, inUse: false });
    }
  }

  async acquire() {
    // 查找空闲连接
    const available = this.pool.find(c => !c.inUse);

    if (available) {
      available.inUse = true;
      return available.connection;
    }

    // 创建新连接（如果未达到最大值）
    if (this.pool.length < this.maxConnections) {
      const conn = await this.connectionFactory();
      this.pool.push({ connection: conn, inUse: true });
      return conn;
    }

    // 等待连接释放
    return new Promise((resolve) => {
      this.waiting.push(resolve);
    });
  }

  release(connection) {
    const item = this.pool.find(c => c.connection === connection);
    if (item) {
      item.inUse = false;

      // 通知等待的请求
      if (this.waiting.length > 0) {
        const next = this.waiting.shift();
        item.inUse = true;
        next(connection);
      }
    }
  }
}
\`\`\`

### 2. 断路器模式

\`\`\`javascript
class CircuitBreaker {
  constructor(options = {}) {
    this.threshold = options.threshold || 0.5;      // 失败率阈值
    this.timeout = options.timeout || 60000;        // 熔断超时
    this.requestCount = options.requestCount || 10; // 最小请求数

    this.state = 'CLOSED';
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
}
\`\`\`

## 常见问题

### Q: 如何选择分片键？

A: 分片键选择原则：
- **数据分布均匀**: 避免热点
- **查询效率**: 减少跨分片查询
- **可扩展性**: 易于添加新分片
- **业务相关性**: 与业务逻辑匹配

### Q: 如何处理数据迁移？

A: 迁移策略：
1. **双写**: 同时写入新旧系统
2. **双读**: 优先读新系统，失败回退到旧系统
3. **数据校验**: 比对数据一致性
4. **逐步切换**: 从 1% 到 100% 流量切换

## 下一步

- 学习 [高可用系统设计](/tutorial/high-availability-design) 了解容错机制
- 探索 [灾难恢复规划](/tutorial/disaster-recovery-planning) 了解备份策略
- 阅读 [微服务治理](/tutorial/microservices-governance) 了解服务管理

## 相关技能

- [System Design](/skills) - 系统设计
- [Distributed Systems](/skills) - 分布式系统
- [Architecture Patterns](/skills) - 架构模式
- [Kubernetes](/skills) - 容器编排
- [Terraform](/skills) - 基础设施即代码`;

// Tutorial 090: High Availability System Design
const tutorial090Content = `# 高可用系统设计实战指南

高可用系统设计旨在确保服务在面对各种故障时仍能持续运行。本教程将深入讲解高可用架构的核心原则、设计模式和实战经验。

## 高可用的目标

### 可用性等级

| 可用性等级 | 年度停机时间 | 月度停机时间 | 适用场景 |
|----------|------------|------------|---------|
| 99% | 3.65 天 | 7.31 小时 | 内部系统 |
| 99.9% | 8.77 小时 | 43.83 分钟 | 一般业务 |
| 99.95% | 4.38 小时 | 21.92 分钟 | 重要业务 |
| 99.99% | 52.60 分钟 | 4.38 分钟 | 核心业务 |
| 99.999% | 5.26 分钟 | 26.30 秒 | 金融系统 |

### 计算可用性

\`\`\`javascript
// 可用性计算
class AvailabilityCalculator {
  static calculate(uptime, period) {
    return (uptime / period) * 100;
  }

  static getNines(availability) {
    if (availability >= 99.999) return '99.999% (Five Nines)';
    if (availability >= 99.99) return '99.99% (Four Nines)';
    if (availability >= 99.9) return '99.9% (Three Nines)';
    if (availability >= 99) return '99% (Two Nines)';
    return '< 99%';
  }

  static downtimePerYear(availability) {
    const minutesPerYear = 365 * 24 * 60;
    const availableMinutes = (availability / 100) * minutesPerYear;
    return minutesPerYear - availableMinutes;
  }
}

// 示例
const availability = AvailabilityCalculator.calculate(
  365 * 24 * 60 - 5, // 一年只停机 5 分钟
  365 * 24 * 60
);
console.log(AvailabilityCalculator.getNines(availability));
console.log(\`Annual downtime: \${AvailabilityCalculator.downtimePerYear(availability).toFixed(2)} minutes\`);
\`\`\`

## 冗余设计

### 1. 应用层冗余

\`\`\`javascript
// 多实例部署
class ApplicationCluster {
  constructor(instances) {
    this.instances = instances;
    this.healthChecker = new HealthChecker();
    this.loadBalancer = new LoadBalancer();
  }

  async request(req) {
    const healthyInstances = await this.getHealthyInstances();

    if (healthyInstances.length === 0) {
      throw new Error('No healthy instances available');
    }

    const instance = this.loadBalancer.select(healthyInstances);

    try {
      return await instance.request(req);
    } catch (error) {
      // 标记为不健康
      await this.healthChecker.markUnhealthy(instance);

      // 重试其他实例
      return await this.request(req);
    }
  }

  async getHealthyInstances() {
    const results = await Promise.allSettled(
      this.instances.map(instance => this.healthChecker.check(instance))
    );

    return this.instances.filter((_, index) =>
      results[index].status === 'fulfilled' && results[index].value
    );
  }
}
\`\`\`

### 2. 数据库冗余

\`\`\`javascript
// 主从复制配置
class DatabaseReplication {
  constructor(masterConfig, slaveConfigs) {
    this.master = new DatabaseConnection(masterConfig);
    this.slaves = slaveConfigs.map(config => new DatabaseConnection(config));
    this.promotionCandidate = null;
  }

  // 读操作使用从库
  async read(query, params) {
    const healthySlaves = await this.getHealthySlaves();

    if (healthySlaves.length === 0) {
      // 降级到主库
      return await this.master.query(query, params);
    }

    const slave = this.selectSlave(healthySlaves);
    return await slave.query(query, params);
  }

  // 写操作使用主库
  async write(query, params) {
    return await this.master.query(query, params);
  }

  // 主库故障时提升从库
  async promoteSlave() {
    const healthySlaves = await this.getHealthySlaves();

    if (healthySlaves.length === 0) {
      throw new Error('No healthy slaves to promote');
    }

    // 选择最新的从库（最接近主库）
    this.promotionCandidate = healthySlaves[0];

    // 停止复制
    await this.promotionCandidate.execute('STOP SLAVE');

    // 设置为可写
    await this.promotionCandidate.execute('SET GLOBAL read_only = 0');

    // 更新其他从库指向新主库
    for (const slave of healthySlaves.slice(1)) {
      await slave.execute(\`CHANGE MASTER TO master_host = '\${this.promotionCandidate.host}'\`);
    }

    // 更新主库引用
    this.master = this.promotionCandidate;

    console.log('Promoted slave to master:', this.promotionCandidate.host);
  }

  async getHealthySlaves() {
    const results = await Promise.allSettled(
      this.slaves.map(slave => this.checkHealth(slave))
    );

    return this.slaves.filter((_, index) =>
      results[index].status === 'fulfilled' && results[index].value
    );
  }

  async checkHealth(slave) {
    try {
      await slave.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  selectSlave(slaves) {
    // 轮询或随机选择
    return slaves[Math.floor(Math.random() * slaves.length)];
  }
}
\`\`\`

### 3. 多区域部署

\`\`\`javascript
// 跨区域负载均衡
class MultiRegionLoadBalancer {
  constructor(regions) {
    // regions = { 'us-east': [...instances], 'us-west': [...instances] }
    this.regions = regions;
    this.healthChecker = new HealthChecker();
  }

  async routeRequest(req, userRegion) {
    // 优先路由到用户最近的区域
    const nearestRegion = userRegion || this.selectNearestRegion(req);

    const healthyInstances = await this.getHealthyInstances(nearestRegion);

    if (healthyInstances.length > 0) {
      return await this.sendRequest(healthyInstances[0], req);
    }

    // 降级到其他区域
    return await this.failoverToOtherRegions(req, nearestRegion);
  }

  selectNearestRegion(req) {
    // 基于 IP 或地理位置判断
    const userIP = req.ip;

    if (userIP.startsWith('192.168.')) {
      return 'us-east';
    }

    return 'us-west';
  }

  async failoverToOtherRegions(req, failedRegion) {
    const otherRegions = Object.keys(this.regions).filter(r => r !== failedRegion);

    for (const region of otherRegions) {
      const healthyInstances = await this.getHealthyInstances(region);

      if (healthyInstances.length > 0) {
        console.log(\`Failing over to region: \${region}\`);
        return await this.sendRequest(healthyInstances[0], req);
      }
    }

    throw new Error('No healthy instances available');
  }

  async getHealthyInstances(region) {
    const instances = this.regions[region];
    const results = await Promise.allSettled(
      instances.map(instance => this.healthChecker.check(instance))
    );

    return instances.filter((_, index) =>
      results[index].status === 'fulfilled' && results[index].value
    );
  }
}
\`\`\`

## 故障检测与转移

### 健康检查

\`\`\`javascript
class HealthChecker {
  constructor() {
    this.checks = new Map();
  }

  register(name, checkFn, options = {}) {
    this.checks.set(name, {
      fn: checkFn,
      timeout: options.timeout || 5000,
      interval: options.interval || 10000,
      failureThreshold: options.failureThreshold || 3
    });

    this.startMonitoring(name);
  }

  async startMonitoring(name) {
    const check = this.checks.get(name);
    let failures = 0;

    const runCheck = async () => {
      try {
        await Promise.race([
          check.fn(),
          this.timeout(check.timeout)
        ]);

        failures = 0;
        this.setStatus(name, 'healthy');
      } catch (error) {
        failures++;

        if (failures >= check.failureThreshold) {
          this.setStatus(name, 'unhealthy');
        }
      }
    };

    // 立即执行一次
    await runCheck();

    // 定期执行
    setInterval(runCheck, check.interval);
  }

  timeout(ms) {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Health check timeout')), ms)
    );
  }

  setStatus(name, status) {
    console.log(\`Health check [\${name}]: \${status}\`);
    // 可以发送告警或触发故障转移
  }
}

// 使用示例
const healthChecker = new HealthChecker();

// 注册数据库健康检查
healthChecker.register('database', async () => {
  await db.query('SELECT 1');
}, {
  timeout: 3000,
  interval: 5000,
  failureThreshold: 3
});

// 注册 Redis 健康检查
healthChecker.register('redis', async () => {
  await redis.ping();
}, {
  timeout: 2000,
  interval: 10000,
  failureThreshold: 2
});

// 注册 HTTP 服务健康检查
healthChecker.register('api-server', async () => {
  const response = await fetch('http://api-server:3000/health');
  if (!response.ok) {
    throw new Error('Health check failed');
  }
}, {
  timeout: 5000,
  interval: 15000,
  failureThreshold: 3
});
\`\`\`

### 自动故障转移

\`\`\`javascript
class FailoverManager {
  constructor(primary, secondary) {
    this.primary = primary;
    this.secondary = secondary;
    this.current = 'primary';
    this.checkInterval = 5000;
    this.failureThreshold = 3;
    this.failureCount = 0;

    this.startMonitoring();
  }

  startMonitoring() {
    setInterval(async () => {
      const isHealthy = await this.checkHealth(this.current);

      if (!isHealthy) {
        this.failureCount++;

        if (this.failureCount >= this.failureThreshold) {
          console.log('Failure threshold reached, initiating failover...');
          await this.failover();
        }
      } else {
        this.failureCount = 0;
      }
    }, this.checkInterval);
  }

  async checkHealth(target) {
    try {
      const instance = target === 'primary' ? this.primary : this.secondary;
      await this.ping(instance);
      return true;
    } catch {
      return false;
    }
  }

  async failover() {
    const oldCurrent = this.current;

    // 切换到备用
    this.current = this.current === 'primary' ? 'secondary' : 'primary';

    console.log(\`Failed over from \${oldCurrent} to \${this.current}\`);

    // 发送告警
    await this.sendAlert({
      type: 'FAILOVER',
      from: oldCurrent,
      to: this.current,
      timestamp: new Date().toISOString()
    });
  }

  async ping(instance) {
    // 实现具体的健康检查逻辑
    await instance.healthCheck();
  }

  async sendAlert(alert) {
    console.log('ALERT:', JSON.stringify(alert));
    // 发送到监控系统或告警服务
  }

  async getCurrent() {
    return this.current === 'primary' ? this.primary : this.secondary;
  }
}
\`\`\`

## 负载均衡

### 负载均衡策略

\`\`\`javascript
class LoadBalancer {
  constructor(strategy = 'round-robin') {
    this.strategy = strategy;
    this.currentIndex = 0;
    this.weights = new Map(); // 用于加权轮询
  }

  select(instances) {
    switch (this.strategy) {
      case 'round-robin':
        return this.roundRobin(instances);

      case 'random':
        return this.random(instances);

      case 'least-connections':
        return this.leastConnections(instances);

      case 'weighted':
        return this.weighted(instances);

      case 'ip-hash':
        return this.ipHash(instances);

      default:
        return instances[0];
    }
  }

  roundRobin(instances) {
    const instance = instances[this.currentIndex % instances.length];
    this.currentIndex++;
    return instance;
  }

  random(instances) {
    return instances[Math.floor(Math.random() * instances.length)];
  }

  leastConnections(instances) {
    return instances.reduce((min, instance) =>
      instance.connections < min.connections ? instance : min
    );
  }

  weighted(instances) {
    let totalWeight = instances.reduce((sum, i) => sum + (i.weight || 1), 0);
    let random = Math.random() * totalWeight;

    for (const instance of instances) {
      random -= (instance.weight || 1);
      if (random <= 0) {
        return instance;
      }
    }

    return instances[instances.length - 1];
  }

  ipHash(instances, clientIP) {
    const hash = this.hashCode(clientIP);
    return instances[hash % instances.length];
  }

  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}
\`\`\`

### Nginx 负载均衡配置

\`\`\`nginx
# nginx.conf
upstream backend {
    # 负载均衡策略
    least_conn;

    # 后端服务器
    server backend1.example.com:3000 weight=3 max_fails=3 fail_timeout=30s;
    server backend2.example.com:3000 weight=2 max_fails=3 fail_timeout=30s;
    server backend3.example.com:3000 weight=1 max_fails=3 fail_timeout=30s;

    # 备用服务器（正常情况下不接收流量）
    server backup.example.com:3000 backup;

    # 保持连接
    keepalive 32;
}

server {
    listen 80;

    location / {
        proxy_pass http://backend;

        # 健康检查
        proxy_next_upstream error timeout http_500 http_502 http_503 http_504;

        # 超时设置
        proxy_connect_timeout 5s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # 头部设置
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 健康检查端点
    location /health {
        access_log off;
        return 200 "healthy\\n";
        add_header Content-Type text/plain;
    }
}
\`\`\`

## 限流和降级

### 服务限流

\`\`\`javascript
class RateLimiter {
  constructor(options = {}) {
    this.maxRequests = options.maxRequests || 100;
    this.windowMs = options.windowMs || 60000;
    this.requests = new Map();
  }

  isAllowed(key) {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    let data = this.requests.get(key) || { timestamps: [], count: 0 };

    // 清理过期记录
    data.timestamps = data.timestamps.filter(t => t > windowStart);
    data.count = data.timestamps.length;

    if (data.count >= this.maxRequests) {
      return false;
    }

    data.timestamps.push(now);
    data.count++;

    this.requests.set(key, data);

    return true;
  }

  reset(key) {
    this.requests.delete(key);
  }
}

// 令牌桶限流器
class TokenBucket {
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
}
\`\`\`

### 服务降级

\`\`\`javascript
class ServiceDegradation {
  constructor() {
    this.degradedServices = new Set();
    this.fallbackHandlers = new Map();
  }

  register(serviceName, fallbackHandler) {
    this.fallbackHandlers.set(serviceName, fallbackHandler);
  }

  async call(serviceName, originalHandler, ...args) {
    // 检查服务是否已降级
    if (this.degradedServices.has(serviceName)) {
      return await this.executeFallback(serviceName, ...args);
    }

    try {
      // 设置超时
      const result = await Promise.race([
        originalHandler(...args),
        this.timeout(5000)
      ]);

      return result;
    } catch (error) {
      console.error(\`Service \${serviceName} failed:\`, error);

      // 触发降级
      this.degrade(serviceName);

      // 返回降级结果
      return await this.executeFallback(serviceName, ...args);
    }
  }

  degrade(serviceName) {
    if (!this.degradedServices.has(serviceName)) {
      this.degradedServices.add(serviceName);
      console.warn(\`Service \${serviceName} has been degraded\`);

      // 发送告警
      this.sendAlert({
        type: 'SERVICE_DEGRADED',
        service: serviceName,
        timestamp: new Date().toISOString()
      });
    }
  }

  recover(serviceName) {
    this.degradedServices.delete(serviceName);
    console.log(\`Service \${serviceName} has been recovered\`);
  }

  async executeFallback(serviceName, ...args) {
    const handler = this.fallbackHandlers.get(serviceName);

    if (!handler) {
      throw new Error(\`No fallback handler for \${serviceName}\`);
    }

    return await handler(...args);
  }

  timeout(ms) {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    );
  }

  sendAlert(alert) {
    console.log('ALERT:', JSON.stringify(alert));
  }
}

// 使用示例
const degradation = new ServiceDegradation();

// 注册降级处理
degradation.register('recommendation-service', async (userId) => {
  // 返回默认推荐
  return await getPopularProducts();
});

degradation.register('search-service', async (query) => {
  // 返回缓存结果
  return await getCachedSearchResults(query);
});

// 调用服务
const recommendations = await degradation.call(
  'recommendation-service',
  recommendationAPI.getRecommendations,
  userId
);
\`\`\`

## 实战案例：高可用电商系统

### 完整架构

\`\`\`javascript
class HighAvailabilityECommerce {
  constructor(config) {
    // 多区域配置
    this.regions = {
      'us-east': new RegionCluster(config.regions['us-east']),
      'us-west': new RegionCluster(config.regions['us-west']),
      'eu-west': new RegionCluster(config.regions['eu-west'])
    };

    // 全局负载均衡器
    this.globalLoadBalancer = new GlobalLoadBalancer(
      Object.values(this.regions)
    );

    // 健康检查器
    this.healthChecker = new HealthChecker();

    // 故障转移管理器
    this.failoverManager = new FailoverManager(
      this.regions['us-east'],
      this.regions['us-west']
    );

    // 服务降级管理器
    this.degradation = new ServiceDegradation();

    this.setup();
  }

  setup() {
    // 注册健康检查
    this.healthChecker.register('primary-region', async () => {
      return await this.regions['us-east'].healthCheck();
    }, {
      timeout: 5000,
      interval: 10000,
      failureThreshold: 3
    });

    // 注册降级处理
    this.degradation.register('recommendation', async (userId) => {
      return await this.getPopularProducts();
    });
  }

  async handleRequest(req, userContext) {
    const userRegion = userContext.region || 'us-east';

    try {
      // 路由到最近的健康区域
      const region = await this.globalLoadBalancer.route(userRegion);

      // 处理请求
      return await region.handle(req);
    } catch (error) {
      console.error('Request failed:', error);

      // 尝试降级处理
      return await this.handleWithDegradation(req);
    }
  }

  async handleWithDegradation(req) {
    // 根据请求类型返回降级响应
    if (req.path === '/api/recommendations') {
      return await this.degradation.executeFallback('recommendation');
    }

    throw new Error('Service unavailable');
  }
}

class RegionCluster {
  constructor(config) {
    this.instances = config.instances.map(cfg => new ServiceInstance(cfg));
    this.loadBalancer = new LoadBalancer('least-connections');
    this.dataStore = this.setupDataStore(config.dataStore);
  }

  setupDataStore(config) {
    // 主从复制配置
    return new DatabaseReplication(config.master, config.slaves);
  }

  async healthCheck() {
    const results = await Promise.allSettled(
      this.instances.map(instance => instance.ping())
    );

    const healthyCount = results.filter(r =>
      r.status === 'fulfilled' && r.value
    ).length;

    return healthyCount >= this.instances.length / 2;
  }

  async handle(req) {
    const healthyInstances = await this.getHealthyInstances();

    if (healthyInstances.length === 0) {
      throw new Error('No healthy instances');
    }

    const instance = this.loadBalancer.select(healthyInstances);
    return await instance.handle(req);
  }

  async getHealthyInstances() {
    const results = await Promise.allSettled(
      this.instances.map(instance => instance.ping())
    );

    return this.instances.filter((_, index) =>
      results[index].status === 'fulfilled' && results[index].value
    );
  }
}

class ServiceInstance {
  constructor(config) {
    this.host = config.host;
    this.port = config.port;
    this.connections = 0;
  }

  async handle(req) {
    this.connections++;

    try {
      // 处理请求
      return await this.sendRequest(req);
    } finally {
      this.connections--;
    }
  }

  async sendRequest(req) {
    const response = await fetch(\`http://\${this.host}:\${this.port}\${req.path}\`, {
      method: req.method,
      headers: req.headers,
      body: req.body
    });

    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}\`);
    }

    return await response.json();
  }

  async ping() {
    try {
      const response = await fetch(\`http://\${this.host}:\${this.port}/health\`);
      return response.ok;
    } catch {
      return false;
    }
  }
}
\`\`\`

## 监控和告警

### 可观测性

\`\`\`javascript
class ObservabilityStack {
  constructor() {
    this.metrics = new MetricsCollector();
    this.logger = new StructuredLogger();
    this.tracer = new DistributedTracer();
  }

  recordMetric(name, value, tags = {}) {
    this.metrics.record(name, value, tags);
  }

  log(level, message, context = {}) {
    this.logger.log(level, message, {
      ...context,
      timestamp: new Date().toISOString()
    });
  }

  trace(operationName, fn) {
    return this.tracer.trace(operationName, fn);
  }
}

class MetricsCollector {
  constructor() {
    this.counters = new Map();
    this.gauges = new Map();
    this.histograms = new Map();
  }

  increment(name, value = 1, tags = {}) {
    const key = this.getKey(name, tags);
    const current = this.counters.get(key) || 0;
    this.counters.set(key, current + value);
  }

  gauge(name, value, tags = {}) {
    const key = this.getKey(name, tags);
    this.gauges.set(key, value);
  }

  timing(name, value, tags = {}) {
    const key = this.getKey(name, tags);

    if (!this.histograms.has(key)) {
      this.histograms.set(key, []);
    }

    this.histograms.get(key).push(value);
  }

  getKey(name, tags) {
    const tagStr = Object.entries(tags)
      .sort()
      .map(([k, v]) => \`\${k}=\${v}\`)
      .join(',');

    return tagStr ? \`\${name}?\${tagStr}\` : name;
  }

  getMetrics() {
    return {
      counters: Object.fromEntries(this.counters),
      gauges: Object.fromEntries(this.gauges),
      histograms: Object.fromEntries(this.histograms)
    };
  }
}
\`\`\`

## 常见问题

### Q: 如何避免级联故障？

A: 防御措施：
1. **熔断器**: 快速失败，防止雪崩
2. **超时控制**: 避免无限等待
3. **线程池隔离**: 限制资源使用
4. **降级策略**: 保证核心功能

### Q: 如何测试高可用？

A: 测试方法：
1. **混沌工程**: 主动注入故障
2. **故障注入测试**: 关闭服务、模拟延迟
3. **压力测试**: 验证容量规划
4. **灾难演练**: 验证恢复流程

## 下一步

- 学习 [灾难恢复规划](/tutorial/disaster-recovery-planning) 了解备份策略
- 探索 [限流熔断](/tutorial/rate-limiting-circuit-breaker) 了解保护机制
- 阅读 [分布式追踪](/tutorial/distributed-tracing) 了解故障定位

## 相关技能

- [Kubernetes](/skills) - 容器编排和高可用
- [HAProxy](/skills) - 负载均衡器
- [Prometheus](/skills) - 监控系统
- [Chaos Engineering](/skills) - 混沌工程`;

// Tutorial 091: Disaster Recovery and Backup Strategy
const tutorial091Content = `# 灾难恢复与备份策略实战指南

灾难恢复计划是保障业务连续性的关键措施。本教程将深入讲解灾难恢复的核心概念、备份策略、恢复流程和实战经验。

## 灾难恢复等级

### RTO 和 RPO

| 指标 | 说明 | 示例 |
|------|------|------|
| **RTO** (Recovery Time Objective) | 恢复时间目标 | 从灾难发生到服务恢复的最大时间 |
| **RPO** (Recovery Point Objective) | 恢复点目标 | 可接受的数据丢失时间窗口 |

### 灾难恢复等级

| 等级 | 描述 | RTO | RPO | 适用场景 |
|------|------|-----|-----|---------|
| Tier 1 | 冷备份 | 72h+ | 24h+ | 非关键系统 |
| Tier 2 | 热备份 | 24-72h | 12-24h | 一般业务 |
| Tier 3 | 温备份 | 12-24h | 4-12h | 重要业务 |
| Tier 4 | 热备份 | 4-12h | 1-4h | 核心业务 |
| Tier 5 | 实时复制 | 分钟级 | 秒级 | 金融系统 |

## 备份策略

### 1. 完整备份

\`\`\`javascript
class FullBackup {
  constructor(source, destination) {
    this.source = source;
    this.destination = destination;
  }

  async perform() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = \`backup-full-\${timestamp}.tar.gz\`;

    console.log(\`Starting full backup to \${backupFile}...\`);

    try {
      // 创建完整备份
      await this.createBackup(backupFile);

      // 验证备份
      await this.verifyBackup(backupFile);

      // 上传到远程
      await this.uploadToRemote(backupFile);

      // 清理旧备份
      await this.cleanupOldBackups();

      console.log(\`Full backup completed: \${backupFile}\`);

      return {
        type: 'full',
        file: backupFile,
        timestamp: new Date().toISOString(),
        size: await this.getFileSize(backupFile)
      };
    } catch (error) {
      console.error('Backup failed:', error);
      throw error;
    }
  }

  async createBackup(backupFile) {
    const { spawn } = require('child_process');

    return new Promise((resolve, reject) => {
      const tar = spawn('tar', [
        '-czf',
        backupFile,
        this.source
      ]);

      tar.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(\`tar exited with code \${code}\`));
        }
      });
    });
  }

  async verifyBackup(backupFile) {
    const { spawn } = require('child_process');

    return new Promise((resolve, reject) => {
      const tar = spawn('tar', ['-tzf', backupFile]);

      tar.on('close', (code) => {
        if (code === 0) {
          console.log('Backup verified successfully');
          resolve();
        } else {
          reject(new Error('Backup verification failed'));
        }
      });
    });
  }

  async uploadToRemote(backupFile) {
    // 上传到 S3
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3();

    const fileStream = require('fs').createReadStream(backupFile);

    await s3.upload({
      Bucket: 'my-backup-bucket',
      Key: \`backups/\${backupFile}\`,
      Body: fileStream
    }).promise();

    console.log(\`Uploaded \${backupFile} to S3\`);
  }

  async cleanupOldBackups() {
    const retentionDays = 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    // 删除超过保留期的备份
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3();

    const objects = await s3.listObjectsV2({
      Bucket: 'my-backup-bucket',
      Prefix: 'backups/backup-full-'
    }).promise();

    for (const object of objects.Contents) {
      const lastModified = new Date(object.LastModified);

      if (lastModified < cutoffDate) {
        await s3.deleteObject({
          Bucket: 'my-backup-bucket',
          Key: object.Key
        }).promise();

        console.log(\`Deleted old backup: \${object.Key}\`);
      }
    }
  }

  async getFileSize(file) {
    const fs = require('fs');
    const stats = await fs.promises.stat(file);
    return stats.size;
  }
}
\`\`\`

### 2. 增量备份

\`\`\`javascript
class IncrementalBackup extends FullBackup {
  constructor(source, destination) {
    super(source, destination);
    this.lastBackupFile = '.last-backup-time';
  }

  async perform() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = \`backup-incremental-\${timestamp}.tar.gz\`;

    console.log(\`Starting incremental backup to \${backupFile}...\`);

    const lastBackupTime = await this.getLastBackupTime();
    const filesChanged = await this.getFilesChangedSince(lastBackupTime);

    if (filesChanged.length === 0) {
      console.log('No files changed since last backup');
      return null;
    }

    console.log(\`Found \${filesChanged.length} changed files\`);

    try {
      // 创建增量备份
      await this.createBackup(filesChanged, backupFile);

      // 更新最后备份时间
      await this.updateLastBackupTime();

      return {
        type: 'incremental',
        file: backupFile,
        filesCount: filesChanged.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Incremental backup failed:', error);
      throw error;
    }
  }

  async getLastBackupTime() {
    const fs = require('fs');

    try {
      const content = await fs.promises.readFile(this.lastBackupFile, 'utf8');
      return new Date(content.trim());
    } catch {
      // 首次备份，使用很早的时间
      return new Date(0);
    }
  }

  async updateLastBackupTime() {
    const fs = require('fs');
    await fs.promises.writeFile(
      this.lastBackupFile,
      new Date().toISOString()
    );
  }

  async getFilesChangedSince(since) {
    const fs = require('fs');
    const path = require('path');
    const files = [];

    const walk = async (dir) => {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          await walk(fullPath);
        } else {
          const stats = await fs.promises.stat(fullPath);

          if (stats.mtime > since) {
            files.push(fullPath);
          }
        }
      }
    };

    await walk(this.source);
    return files;
  }

  async createBackup(files, backupFile) {
    const { spawn } = require('child_process');
    const fs = require('fs');

    // 创建文件列表
    const fileList = '.files-to-backup.txt';
    await fs.promises.writeFile(fileList, files.join('\\n'));

    return new Promise((resolve, reject) => {
      const tar = spawn('tar', [
        '-czf',
        backupFile,
        '-T',
        fileList
      ]);

      tar.on('close', (code) => {
        // 清理临时文件
        fs.promises.unlink(fileList).catch(() => {});

        if (code === 0) {
          resolve();
        } else {
          reject(new Error(\`tar exited with code \${code}\`));
        }
      });
    });
  }
}
\`\`\`

### 3. 数据库备份

\`\`\`javascript
class DatabaseBackup {
  constructor(config) {
    this.host = config.host;
    this.port = config.port;
    this.database = config.database;
    this.username = config.username;
    this.password = config.password;
  }

  async performFullBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = \`db-backup-full-\${timestamp}.sql.gz\`;

    console.log(\`Starting full database backup to \${backupFile}...\`);

    const { spawn } = require('child_process');

    return new Promise((resolve, reject) => {
      const mysqldump = spawn('mysqldump', [
        \`-h\${this.host}\`,
        \`-P\${this.port}\`,
        \`-u\${this.username}\`,
        \`-p\${this.password}\`,
        this.database,
        '--single-transaction',
        '--quick',
        '--lock-tables=false'
      ]);

      const gzip = spawn('gzip', ['-c']);

      const output = require('fs').createWriteStream(backupFile);

      mysqldump.stdout.pipe(gzip).pipe(output);

      mysqldump.stderr.on('data', (data) => {
        console.error('mysqldump error:', data.toString());
      });

      gzip.on('close', (code) => {
        if (code === 0) {
          console.log(\`Database backup completed: \${backupFile}\`);
          resolve({
            file: backupFile,
            timestamp: new Date().toISOString()
          });
        } else {
          reject(new Error(\`gzip exited with code \${code}\`));
        }
      });
    });
  }

  async restoreBackup(backupFile) {
    console.log(\`Restoring database from \${backupFile}...\`);

    const { spawn } = require('child_process');

    return new Promise((resolve, reject) => {
      const gunzip = spawn('gzip', ['-dc', backupFile]);
      const mysql = spawn('mysql', [
        \`-h\${this.host}\`,
        \`-P\${this.port}\`,
        \`-u\${this.username}\`,
        \`-p\${this.password}\`,
        this.database
      ]);

      gunzip.stdout.pipe(mysql.stdin);

      mysql.stderr.on('data', (data) => {
        console.error('mysql error:', data.toString());
      });

      mysql.on('close', (code) => {
        if (code === 0) {
          console.log('Database restore completed');
          resolve();
        } else {
          reject(new Error(\`mysql exited with code \${code}\`));
        }
      });
    });
  }
}
\`\`\`

## 恢复策略

### 1. 数据恢复

\`\`\`javascript
class DisasterRecovery {
  constructor(config) {
    this.backupLocation = config.backupLocation;
    this.restoreLocation = config.restoreLocation;
  }

  async restore(backupPoint) {
    console.log(\`Starting disaster recovery to point: \${backupPoint}\`);

    try {
      // 1. 获取需要的备份文件
      const backupFiles = await this.getBackupFiles(backupPoint);

      console.log(\`Found \${backupFiles.length} backup files\`);

      // 2. 下载备份文件
      await this.downloadBackups(backupFiles);

      // 3. 验证备份完整性
      await this.verifyBackups(backupFiles);

      // 4. 停止服务
      await this.stopServices();

      // 5. 恢复数据
      await this.restoreData(backupFiles);

      // 6. 验证恢复
      await this.verifyRecovery();

      // 7. 启动服务
      await this.startServices();

      console.log('Disaster recovery completed successfully');

      return {
        success: true,
        restoredToPoint: backupPoint,
        completedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Disaster recovery failed:', error);

      // 尝试回滚
      await this.rollback();

      throw error;
    }
  }

  async getBackupFiles(backupPoint) {
    // 根据恢复点确定需要的备份文件
    const backups = [];

    // 添加最近的完整备份
    const lastFullBackup = await this.findLastFullBackup(backupPoint);
    backups.push(lastFullBackup);

    // 添加后续的增量备份
    const incrementalBackups = await this.findIncrementalBackups(
      lastFullBackup.timestamp,
      backupPoint
    );
    backups.push(...incrementalBackups);

    return backups;
  }

  async findLastFullBackup(beforePoint) {
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3();

    const objects = await s3.listObjectsV2({
      Bucket: 'my-backup-bucket',
      Prefix: 'backups/backup-full-'
    }).promise();

    const fullBackups = objects.Contents
      .filter(obj => new Date(obj.LastModified) <= new Date(beforePoint))
      .sort((a, b) => new Date(b.LastModified) - new Date(a.LastModified));

    return fullBackups[0];
  }

  async findIncrementalBackups(afterPoint, beforePoint) {
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3();

    const objects = await s3.listObjectsV2({
      Bucket: 'my-backup-bucket',
      Prefix: 'backups/backup-incremental-'
    }).promise();

    return objects.Contents
      .filter(obj => {
        const modified = new Date(obj.LastModified);
        return modified > new Date(afterPoint) && modified <= new Date(beforePoint);
      })
      .sort((a, b) => new Date(a.LastModified) - new Date(b.LastModified));
  }

  async downloadBackups(backupFiles) {
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3();

    for (const backup of backupFiles) {
      const localFile = \`/tmp/\${backup.Key.split('/').pop()}\`;

      const fileStream = require('fs').createWriteStream(localFile);

      await s3.getObject({
        Bucket: backup.Bucket,
        Key: backup.Key
      }).createReadStream().pipe(fileStream);

      console.log(\`Downloaded \${backup.Key} to \${localFile}\`);
    }
  }

  async verifyBackups(backupFiles) {
    for (const backup of backupFiles) {
      const localFile = \`/tmp/\${backup.Key.split('/').pop()}\`;

      // 验证文件完整性
      const { spawn } = require('child_process');

      await new Promise((resolve, reject) => {
        const tar = spawn('tar', ['-tzf', localFile]);

        tar.on('close', (code) => {
          if (code === 0) {
            console.log(\`Verified \${localFile}\`);
            resolve();
          } else {
            reject(new Error(\`Backup verification failed: \${localFile}\`));
          }
        });
      });
    }
  }

  async stopServices() {
    console.log('Stopping services...');
    // 实现停止服务的逻辑
  }

  async restoreData(backupFiles) {
    console.log('Restoring data...');

    // 按顺序恢复备份
    for (const backup of backupFiles) {
      const localFile = \`/tmp/\${backup.Key.split('/').pop()}\`;

      await this.extractBackup(localFile);
    }
  }

  async extractBackup(backupFile) {
    const { spawn } = require('child_process');

    return new Promise((resolve, reject) => {
      const tar = spawn('tar', ['-xzf', backupFile, '-C', this.restoreLocation]);

      tar.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(\`Failed to extract \${backupFile}\`));
        }
      });
    });
  }

  async verifyRecovery() {
    console.log('Verifying recovery...');

    // 检查关键文件
    const keyFiles = [
      '/etc/passwd',
      '/var/www/html/config.php',
      '/var/lib/mysql/db_name/users.frm'
    ];

    for (const file of keyFiles) {
      const fs = require('fs');

      try {
        await fs.promises.access(file);
        console.log(\`✓ \${file} exists\`);
      } catch {
        console.error(\`✗ \${file} missing\`);
        throw new Error(\`Key file missing: \${file}\`);
      }
    }
  }

  async startServices() {
    console.log('Starting services...');
    // 实现启动服务的逻辑
  }

  async rollback() {
    console.log('Rolling back changes...');
    // 实现回滚逻辑
  }
}
\`\`\`

### 2. 时间点恢复 (PITR)

\`\`\`javascript
class PointInTimeRecovery {
  constructor(config) {
    this.db = new DatabaseConnection(config.database);
    this.walLocation = config.walLocation;
  }

  async recoverToPoint(targetTime) {
    console.log(\`Recovering database to point: \${targetTime}\`);

    try {
      // 1. 恢复基础备份
      const baseBackup = await this.findBaseBackup(targetTime);
      await this.restoreBaseBackup(baseBackup);

      // 2. 找到需要的 WAL 文件
      const walFiles = await this.findWALFiles(baseBackup.timestamp, targetTime);

      console.log(\`Found \${walFiles.length} WAL files to replay\`);

      // 3. 重放 WAL 到目标时间点
      await this.replayWAL(walFiles, targetTime);

      console.log(\`Recovery to \${targetTime} completed\`);

      return {
        success: true,
        recoveredToPoint: targetTime
      };
    } catch (error) {
      console.error('Point-in-time recovery failed:', error);
      throw error;
    }
  }

  async findBaseBackup(targetTime) {
    const backups = await this.listBackups();

    return backups
      .filter(b => new Date(b.timestamp) <= new Date(targetTime))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
  }

  async listBackups() {
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3();

    const objects = await s3.listObjectsV2({
      Bucket: 'my-backup-bucket',
      Prefix: 'backups/db-base-'
    }).promise();

    return objects.Contents.map(obj => ({
      key: obj.Key,
      timestamp: obj.Key.match(/db-base-(.+?)\\.sql\.gz/)[1]
    }));
  }

  async restoreBaseBackup(backup) {
    console.log(\`Restoring base backup: \${backup.timestamp}\`);

    const localFile = await this.downloadBackup(backup.key);

    await this.db.restore(localFile);
  }

  async findWALFiles(fromTime, toTime) {
    const fs = require('fs');
    const path = require('path');

    const walFiles = [];
    const files = await fs.promises.readdir(this.walLocation);

    for (const file of files) {
      if (!file.endsWith('.wal')) {
        continue;
      }

      const filePath = path.join(this.walLocation, file);
      const stats = await fs.promises.stat(filePath);
      const fileTime = new Date(stats.mtime);

      if (fileTime > fromTime && fileTime <= toTime) {
        walFiles.push({ file, time: fileTime });
      }
    }

    return walFiles.sort((a, b) => a.time - b.time);
  }

  async replayWAL(walFiles, targetTime) {
    for (const { file } of walFiles) {
      console.log(\`Replaying WAL: \${file}\`);

      const filePath = path.join(this.walLocation, file);
      await this.db.replayWAL(filePath, targetTime);
    }
  }
}
\`\`\`

## 灾难恢复演练

### 演练流程

\`\`\`javascript
class DisasterRecoveryDrill {
  constructor(config) {
    this.drConfig = config.drill;
    this.notificationService = new NotificationService();
    this.logger = new DrillLogger();
  }

  async execute() {
    const drillId = \`drill-\${Date.now()}\`;

    this.logger.log(drillId, 'DRILL_STARTED', {
      timestamp: new Date().toISOString()
    });

    try {
      // 1. 通知相关人员
      await this.notifyTeam('DRILL_START');

      // 2. 创建演练环境
      await this.setupDrillEnvironment();

      // 3. 模拟灾难场景
      const scenario = await this.selectScenario();
      await this.simulateDisaster(scenario);

      // 4. 执行恢复流程
      const recoveryResult = await this.executeRecovery();

      // 5. 验证恢复结果
      const validationResult = await this.validateRecovery();

      // 6. 清理演练环境
      await this.cleanup();

      // 7. 生成报告
      const report = await this.generateReport({
        scenario,
        recoveryResult,
        validationResult
      });

      // 8. 发送报告
      await this.sendReport(report);

      this.logger.log(drillId, 'DRILL_COMPLETED', {
        success: true,
        reportId: report.id
      });

      return report;
    } catch (error) {
      this.logger.log(drillId, 'DRILL_FAILED', {
        error: error.message
      });

      throw error;
    }
  }

  async selectScenario() {
    const scenarios = [
      {
        id: 'database-corruption',
        name: '数据库损坏',
        type: 'data-loss',
        severity: 'critical'
      },
      {
        id: 'region-failure',
        name: '整个区域故障',
        type: 'infrastructure',
        severity: 'critical'
      },
      {
        id: 'ransomware',
        name: '勒索软件攻击',
        type: 'security',
        severity: 'critical'
      }
    ];

    // 随机选择或根据计划选择
    return scenarios[Math.floor(Math.random() * scenarios.length)];
  }

  async simulateDisaster(scenario) {
    console.log(\`Simulating disaster scenario: \${scenario.name}\`);

    switch (scenario.id) {
      case 'database-corruption':
        await this.simulateDatabaseCorruption();
        break;

      case 'region-failure':
        await this.simulateRegionFailure();
        break;

      case 'ransomware':
        await this.simulateRansomwareAttack();
        break;
    }
  }

  async simulateDatabaseCorruption() {
    // 在演练环境中模拟数据库损坏
    const db = new DatabaseConnection(this.drConfig.drillDatabase);

    // 删除关键表（仅在演练环境）
    await db.query('DROP TABLE IF EXISTS users');
    await db.query('DROP TABLE IF EXISTS orders');

    console.log('Database corruption simulated');
  }

  async executeRecovery() {
    const startTime = Date.now();

    const recovery = new DisasterRecovery({
      backupLocation: this.drConfig.backupLocation,
      restoreLocation: this.drConfig.restoreLocation
    });

    const result = await recovery.restore(new Date().toISOString());

    const duration = Date.now() - startTime;

    return {
      ...result,
      duration,
      rtoMet: duration <= this.drConfig.maxRTO * 60 * 1000
    };
  }

  async validateRecovery() {
    const validations = [];

    // 验证数据完整性
    const dataIntegrity = await this.validateDataIntegrity();
    validations.push({
      type: 'data-integrity',
      result: dataIntegrity
    });

    // 验证服务可用性
    const serviceAvailability = await this.validateServiceAvailability();
    validations.push({
      type: 'service-availability',
      result: serviceAvailability
    });

    // 验证功能正常
    const functionality = await this.validateFunctionality();
    validations.push({
      type: 'functionality',
      result: functionality
    });

    return {
      allPassed: validations.every(v => v.result.passed),
      validations
    };
  }

  async validateDataIntegrity() {
    const db = new DatabaseConnection(this.drConfig.drillDatabase);

    // 检查关键表
    const tables = await db.query('SHOW TABLES');

    const expectedTables = ['users', 'orders', 'products'];
    const missingTables = expectedTables.filter(
      table => !tables.some(t => t.Tables_in_db === table)
    );

    if (missingTables.length > 0) {
      return {
        passed: false,
        message: \`Missing tables: \${missingTables.join(', ')}\`
      };
    }

    // 检查数据量
    const userCount = await db.query('SELECT COUNT(*) as count FROM users');

    return {
      passed: userCount[0].count > 0,
      message: \`Database has \${userCount[0].count} users\`
    };
  }

  async validateServiceAvailability() {
    const services = ['api', 'web', 'database'];
    const results = {};

    for (const service of services) {
      try {
        const response = await fetch(\`http://\${service}:\${this.drConfig.ports[service]}/health\`);
        results[service] = response.ok;
      } catch {
        results[service] = false;
      }
    }

    const allAvailable = Object.values(results).every(r => r);

    return {
      passed: allAvailable,
      message: allAvailable ? 'All services available' : results
    };
  }

  async validateFunctionality() {
    const tests = [
      {
        name: 'User login',
        test: async () => {
          const response = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({ username: 'test', password: 'test' })
          });
          return response.ok;
        }
      },
      {
        name: 'Place order',
        test: async () => {
          const response = await fetch('/api/orders', {
            method: 'POST',
            body: JSON.stringify({ items: [{ id: 1, quantity: 1 }] })
          });
          return response.ok;
        }
      }
    ];

    const results = [];

    for (const test of tests) {
      try {
        const passed = await test.test();
        results.push({ name: test.name, passed });
      } catch {
        results.push({ name: test.name, passed: false });
      }
    }

    const allPassed = results.every(r => r.passed);

    return {
      passed: allPassed,
      tests: results
    };
  }

  async generateReport(data) {
    const report = {
      id: \`report-\${Date.now()}\`,
      timestamp: new Date().toISOString(),
      scenario: data.scenario,
      recovery: {
        duration: data.recoveryResult.duration,
        rtoMet: data.recoveryResult.rtoMet,
        rpoMet: true // 根据实际情况计算
      },
      validation: data.validationResult,
      recommendations: this.generateRecommendations(data)
    };

    return report;
  }

  generateRecommendations(data) {
    const recommendations = [];

    if (!data.recoveryResult.rtoMet) {
      recommendations.push({
        type: 'improvement',
        priority: 'high',
        message: 'RTO 目标未满足，需要优化恢复流程'
      });
    }

    if (!data.validationResult.allPassed) {
      recommendations.push({
        type: 'fix',
        priority: 'critical',
        message: '恢复验证失败，需要检查备份和恢复流程'
      });
    }

    return recommendations;
  }
}
\`\`\`

## 备份自动化

### 定时备份

\`\`\`javascript
const cron = require('node-cron');

class BackupScheduler {
  constructor(config) {
    this.config = config;
    this.backupManager = new BackupManager(config.backup);
  }

  schedule() {
    // 每天凌晨 2 点完整备份
    cron.schedule('0 2 * * *', async () => {
      console.log('Starting scheduled full backup...');

      try {
        await this.backupManager.fullBackup();

        // 发送通知
        await this.sendNotification({
          type: 'backup_completed',
          backupType: 'full'
        });
      } catch (error) {
        console.error('Scheduled backup failed:', error);

        // 发送告警
        await this.sendAlert({
          type: 'backup_failed',
          error: error.message
        });
      }
    });

    // 每 6 小时增量备份
    cron.schedule('0 */6 * * *', async () => {
      console.log('Starting scheduled incremental backup...');

      try {
        await this.backupManager.incrementalBackup();
      } catch (error) {
        console.error('Incremental backup failed:', error);
      }
    });

    // 每周验证备份
    cron.schedule('0 3 * * 0', async () => {
      console.log('Starting backup verification...');

      try {
        const result = await this.backupManager.verifyBackups();

        if (!result.allValid) {
          await this.sendAlert({
            type: 'backup_verification_failed',
            invalidBackups: result.invalidBackups
          });
        }
      } catch (error) {
        console.error('Backup verification failed:', error);
      }
    });
  }

  async sendNotification(notification) {
    // 发送到 Slack、Email 等
    console.log('Notification:', notification);
  }

  async sendAlert(alert) {
    // 发送到 PagerDuty、钉钉等
    console.log('Alert:', alert);
  }
}
\`\`\`

## 最佳实践

### 1. 3-2-1 备份原则

- **3 份副本**: 原始数据 + 2 份备份
- **2 种介质**: 本地 + 远程（如云存储）
- **1 份异地**: 至少一份在异地存储

### 2. 备份验证

\`\`\`javascript
class BackupValidator {
  async validate(backup) {
    const results = [];

    // 1. 文件完整性检查
    results.push(await this.checkIntegrity(backup));

    // 2. 可恢复性测试
    results.push(await this.testRestore(backup));

    // 3. 数据一致性检查
    results.push(await this.checkConsistency(backup));

    return {
      backup: backup.id,
      valid: results.every(r => r.passed),
      checks: results
    };
  }

  async checkIntegrity(backup) {
    // 计算文件哈希
    const crypto = require('crypto');
    const fs = require('fs');

    const hash = crypto.createHash('sha256');

    const stream = fs.createReadStream(backup.file);
    stream.on('data', data => hash.update(data));

    await new Promise(resolve => stream.on('end', resolve));

    const calculatedHash = hash.digest('hex');

    return {
      name: 'integrity',
      passed: calculatedHash === backup.checksum,
      hash: calculatedHash
    };
  }

  async testRestore(backup) {
    // 在测试环境中恢复
    const testEnv = await this.createTestEnvironment();

    try {
      await this.restoreToTest(backup, testEnv);

      // 验证关键文件
      const exists = await this.checkKeyFiles(testEnv);

      return {
        name: 'restore',
        passed: exists
      };
    } finally {
      await this.cleanupTestEnvironment(testEnv);
    }
  }
}
\`\`\`

## 常见问题

### Q: 如何确定 RTO 和 RPO？

A: 考虑因素：
1. **业务影响分析**: 评估停机损失
2. **技术能力**: 当前技术能实现的水平
3. **成本预算**: 高可用需要更多投入
4. **合规要求**: 某些行业有明确要求

### Q: 备份应该加密吗？

A: 强烈建议加密：
- **传输加密**: 使用 SSL/TLS
- **存储加密**: 使用 AES-256
- **密钥管理**: 使用 KMS 管理密钥
- **访问控制**: 限制备份访问权限

## 下一步

- 学习 [大规模架构设计](/tutorial/large-scale-architecture) 了解架构扩展
- 探索 [高可用系统设计](/tutorial/high-availability-design) 了解容错机制
- 阅读 [安全架构设计](/tutorial/security-architecture) 了解数据保护

## 相关技能

- [AWS Backup](/skills) - AWS 备份服务
- [Veeam](/skills) - 企业备份解决方案
- [Restic](/skills) - 现代备份工具
- [MinIO](/skills) - 对象存储`;

// Create the 3 new Advanced tutorials for US-102
const newTutorials = [
  {
    id: "tutorial-089",
    title: "大规模架构设计实战指南",
    slug: "large-scale-architecture",
    description: "深入学习大规模系统架构设计，包括分层架构、CQRS、事件溯源、数据分片、读写分离和缓存策略等核心模式。",
    content: tutorial089Content,
    category: "development",
    tags: ["架构设计", "大规模", "分布式系统", "微服务", "CQRS", "事件溯源"],
    difficulty: "advanced",
    readTime: 45,
    author: "OpenClaw Team",
    relatedSkills: ["skill-020", "skill-021", "skill-022"],
    stats: { viewCount: 120 },
    createdAt: now,
    featured: false
  },
  {
    id: "tutorial-090",
    title: "高可用系统设计实战指南",
    slug: "high-availability-design",
    description: "掌握高可用系统设计的核心原则，包括冗余设计、故障检测、负载均衡、限流降级和监控告警等关键实践。",
    content: tutorial090Content,
    category: "development",
    tags: ["高可用", "故障转移", "负载均衡", "容错", "监控"],
    difficulty: "advanced",
    readTime: 42,
    author: "OpenClaw Team",
    relatedSkills: ["skill-008", "skill-023", "skill-030"],
    stats: { viewCount: 115 },
    createdAt: now,
    featured: false
  },
  {
    id: "tutorial-091",
    title: "灾难恢复与备份策略实战指南",
    slug: "disaster-recovery-planning",
    description: "全面了解灾难恢复和备份策略，包括完整备份、增量备份、时间点恢复、灾难恢复演练和备份自动化等实践。",
    content: tutorial091Content,
    category: "development",
    tags: ["灾难恢复", "备份策略", "RTO/RPO", "数据恢复", "业务连续性"],
    difficulty: "advanced",
    readTime: 38,
    author: "OpenClaw Team",
    relatedSkills: ["skill-027", "skill-030", "skill-039"],
    stats: { viewCount: 108 },
    createdAt: now,
    featured: false
  }
];

// Append new tutorials
tutorials.push(...newTutorials);

// Write back to file
fs.writeFileSync(tutorialsJsonPath, JSON.stringify(tutorials, null, 2), 'utf8');

console.log(`Added ${newTutorials.length} new Advanced tutorials for US-102:`);
newTutorials.forEach(t => {
  console.log(`  - ${t.id}: ${t.title}`);
});
console.log(`Total tutorials: ${tutorials.length}`);
