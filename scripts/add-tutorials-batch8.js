const fs = require('fs');
const path = require('path');

const tutorialsJsonPath = path.join(__dirname, '..', 'src', 'data', 'tutorials.json');
const tutorials = JSON.parse(fs.readFileSync(tutorialsJsonPath, 'utf8'));

const now = new Date().toISOString();

// Tutorial 073: MongoDB
const tutorial073Content = `# MongoDB 文档数据库进阶

MongoDB 是最流行的 NoSQL 文档数据库，以其灵活的数据模型、强大的查询能力和水平扩展性而闻名。本教程将深入探讨 MongoDB 的核心概念和高级特性。

## 为什么选择 MongoDB

### 核心优势

- **灵活的文档模型**: JSON 格式存储，支持嵌套和数组
- **强大的查询语言**: 丰富的查询操作符和聚合管道
- **水平扩展**: 内置分片支持，轻松处理大数据量
- **高可用性**: 自动故障转移和副本集
- **Schema 灵活**: 无需预定义表结构，适应快速迭代
- **丰富索引**: 支持文本、地理空间、通配符索引

### 数据模型对比

\`\`\`javascript
// MongoDB 文档
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "addresses": [
    { "street": "123 Main St", "city": "New York", "default": true },
    { "street": "456 Oak Ave", "city": "Boston" }
  ],
  "metadata": {
    "created": ISODate("2025-01-01"),
    "verified": true
  }
}

// 对比关系型数据库（需要多张表）
// users, addresses, user_metadata 表 + JOIN 操作
\`\`\`

## 核心概念

### 1. 数据库和集合

\`\`\`javascript
// 显示所有数据库
show dbs

// 切换/创建数据库
use myapp

// 显示集合
show collections

// 创建集合（显式）
db.createCollection("users")

// 删除集合
db.users.drop()

// 删除数据库
db.dropDatabase()
\`\`\`

### 2. CRUD 操作

#### 插入文档

\`\`\`javascript
// 插入单个文档
db.users.insertOne({
  name: "Alice",
  email: "alice@example.com",
  age: 28,
  createdAt: new Date()
})

// 插入多个文档
db.users.insertMany([
  { name: "Bob", email: "bob@example.com", age: 32 },
  { name: "Charlie", email: "charlie@example.com", age: 25 }
])

// 返回插入的 ID
const result = db.users.insertOne({ name: "David" })
print(result.insertedId)  // ObjectId
\`\`\`

#### 查询文档

\`\`\`javascript
// 查询所有
db.users.find()

// 查询单个
db.users.findOne({ name: "Alice" })

// 条件查询
db.users.find({ age: { \\$gt: 30 } })  // 年龄大于 30
db.users.find({ age: { \\$gte: 18, \\$lte: 65 } })  // 18-65

// 逻辑操作
db.users.find({
  \\$or: [
    { age: { \\$lt: 18 } },
    { role: "admin" }
  ]
})

// 数组查询
db.users.find({ tags: "mongodb" })  // 包含
db.users.find({ tags: { \\$all: ["mongodb", "nodejs"] } })  // 同时包含
db.users.find({ tags: { \\$size: 3 } })  // 数组长度

// 嵌套文档查询
db.users.find({ "address.city": "New York" })

// 正则表达式
db.users.find({ name: /^A/i })  // 名字以 A 开头
\`\`\`

#### 更新文档

\`\`\`javascript
// 更新单个文档
db.users.updateOne(
  { name: "Alice" },
  { \\$set: { age: 29 } }
)

// 更新多个文档
db.users.updateMany(
  { role: "user" },
  { \\$set: { status: "active" } }
)

// 替换文档
db.users.replaceOne(
  { name: "Alice" },
  { name: "Alice Smith", email: "alice@example.com" }
)

// 更新操作符
db.users.updateOne(
  { _id: ObjectId("...") },
  {
    \\$set: { age: 30 },           // 设置字段
    \\$unset: { tempField: 1 },    // 删除字段
    \\$inc: { loginCount: 1 },     // 增加数值
    \\$mul: { score: 2 },          // 乘以数值
    \\$rename: { name: "fullName" } // 重命名字段
  }
)

// 数组操作
db.users.updateOne(
  { _id: ObjectId("...") },
  {
    \\$push: { tags: "mongodb" },     // 添加到数组
    \\$addToSet: { tags: "nodejs" },  // 避免重复
    \\$pull: { tags: "old" },         // 从数组删除
    \\$pop: { tags: 1 }               // 删除首/尾元素
  }
)
\`\`\`

#### 删除文档

\`\`\`javascript
// 删除单个文档
db.users.deleteOne({ name: "Alice" })

// 删除多个文档
db.users.deleteMany({ status: "inactive" })

// 删除所有文档（清空集合）
db.users.deleteMany({})
\`\`\`

### 3. 聚合管道

聚合管道是 MongoDB 最强大的功能之一，用于数据转换和分析。

\`\`\`javascript
// 基础聚合
db.orders.aggregate([
  // \\$match: 过滤文档
  { \\$match: { status: "completed" } },

  // \\$group: 分组聚合
  { \\$group: {
    _id: "\\$userId",
    totalAmount: { \\$sum: "\\$amount" },
    count: { \\$sum: 1 },
    avgAmount: { \\$avg: "\\$amount" }
  }},

  // \\$sort: 排序
  { \\$sort: { totalAmount: -1 } },

  // \\$limit: 限制结果
  { \\$limit: 10 }
])

// 复杂聚合示例
db.sales.aggregate([
  // 展开数组
  { \\$unwind: "\\$items" },

  // 查找关联
  { \\$lookup: {
    from: "products",
    localField: "items.productId",
    foreignField: "_id",
    as: "product"
  }},

  // 过滤
  { \\$match: { "product.category": "electronics" } },

  // 分组统计
  { \\$group: {
    _id: "\\$product.category",
    totalRevenue: { \\$sum: { \\$multiply: ["\\$items.price", "\\$items.quantity"] } },
    avgPrice: { \\$avg: "\\$items.price" }
  }},

  // 投影（选择字段）
  { \\$project: {
    category: "\\$_id",
    revenue: "\\$totalRevenue",
    avgPrice: { \\$round: ["\\$avgPrice", 2] },
    _id: 0
  }}
])
\`\`\`

### 4. 索引

\`\`\`javascript
// 创建索引
db.users.createIndex({ email: 1 })  // 升序
db.users.createIndex({ name: -1 })  // 降序
db.users.createIndex({ age: 1, name: 1 })  // 复合索引

// 唯一索引
db.users.createIndex({ email: 1 }, { unique: true })

// 稀疏索引（只索引包含该字段的文档）
db.users.createIndex({ phone: 1 }, { sparse: true })

// TTL 索引（自动过期）
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 })

// 文本索引
db.articles.createIndex({ title: "text", content: "text" })
db.articles.find({ \\$text: { \\$search: "mongodb tutorial" } })

// 地理空间索引
db.places.createIndex({ location: "2dsphere" })
db.places.find({
  location: {
    \\$near: {
      \\$geometry: { type: "Point", coordinates: [-73.9667, 40.78] },
      \\$maxDistance: 1000
    }
  }
})

// 查看索引
db.users.getIndexes()

// 删除索引
db.users.dropIndex("email_1")
\`\`\`

## Node.js 集成

### 使用 MongoDB Driver

\`\`\`javascript
const { MongoClient } = require('mongodb');

async function main() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('myapp');
    const users = db.collection('users');

    // 查询
    const user = await users.findOne({ email: 'user@example.com' });

    // 聚合
    const stats = await users.aggregate([
      { \\$group: { _id: null, avgAge: { \\$avg: "\\$age" } } }
    ]).toArray();

  } finally {
    await client.close();
  }
}
\`\`\`

### 使用 Mongoose ODM

\`\`\`javascript
const mongoose = require('mongoose');

// 定义 Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2 },
  email: { type: String, required: true, unique: true },
  age: { type: Number, min: 0 },
  tags: [String],
  address: {
    street: String,
    city: String,
    zip: String
  }
}, {
  timestamps: true  // 自动添加 createdAt, updatedAt
});

// 添加方法
userSchema.methods.getInitials = function() {
  return this.name.split(' ').map(n => n[0]).join('');
};

// 添加静态方法
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

// 创建 Model
const User = mongoose.model('User', userSchema);

// 使用
async function usage() {
  await mongoose.connect('mongodb://localhost:27017/myapp');

  // 创建
  const user = await User.create({
    name: 'Alice',
    email: 'alice@example.com',
    age: 28
  });

  // 查询
  const adults = await User.find({ age: { \\$gte: 18 } });

  // 更新
  await User.findByIdAndUpdate(user.id, { age: 29 });

  // 删除
  await User.findByIdAndDelete(user.id);
}
\`\`\`

## 副本集和分片

### 副本集配置

\`\`\`javascript
// 启动副本集（3个节点）
// 节点1
mongod --replSet myReplicaSet --port 27017

// 节点2
mongod --replSet myReplicaSet --port 27018

// 节点3（仲裁节点）
mongod --replSet myReplicaSet --port 27019 --arbiter

// 初始化副本集
rs.initiate({
  _id: "myReplicaSet",
  members: [
    { _id: 0, host: "localhost:27017" },
    { _id: 1, host: "localhost:27018" },
    { _id: 2, host: "localhost:27019", arbiterOnly: true }
  ]
})

// 查看状态
rs.status()
\`\`\`

## 事务处理

\`\`\`javascript
const session = client.startSession();

try {
  session.startTransaction();

  await db.users.updateOne(
    { _id: userId },
    { \\$inc: { balance: -100 } },
    { session }
  );

  await db.orders.insertOne(
    { userId, amount: 100, items: [...] },
    { session }
  );

  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
\`\`\`

## 性能优化

### 查询优化

\`\`\`javascript
// 使用 explain 分析查询
db.users.find({ email: "user@example.com" }).explain("executionStats")

// 覆盖查询（只使用索引）
db.users.createIndex({ email: 1, name: 1 })
db.users.find({ email: "test@example.com" }, { name: 1, _id: 0 })

// 投影减少数据传输
db.users.find({}, { name: 1, email: 1, _id: 0 })
\`\`\`

### 写入优化

\`\`\`javascript
// 批量写入
db.users.insertMany([...documents], { ordered: false })

// 写入关注（性能 vs 可靠性）
db.users.insertOne(doc, { writeConcern: { w: 1, j: false } })
// w: 0 = 不等待确认
// w: 1 = 等待主节点确认
// w: majority = 等待大多数节点确认
// j: true = 等待日志写入
\`\`\`

## 实战案例

### 用户行为分析

\`\`\`javascript
db.events.aggregate([
  // 按日期和用户分组
  {
    \\$group: {
      _id: {
        date: { \\$dateToString: { format: "%Y-%m-%d", date: "\\$createdAt" } },
        userId: "\\$userId"
      },
      actions: { \\$sum: 1 },
      lastAction: { \\$max: "\\$createdAt" }
    }
  },
  // 计算留存
  {
    \\$group: {
      _id: "\\$_id.date",
      dailyActive: { \\$sum: 1 },
      avgActions: { \\$avg: "\\$actions" }
    }
  },
  { \\$sort: { _id: 1 } }
])
\`\`\`

## 最佳实践

1. **设计合适的 Schema**: 根据查询模式设计文档结构
2. **使用索引**: 为常用查询字段创建索引
3. **避免大文档**: 单文档限制 16MB，考虑嵌入 vs 引用
4. **使用投影**: 只查询需要的字段
5. **监控性能**: 使用 Database Profiler 和 explain()
6. **备份数据**: 定期备份，测试恢复流程

## 相关技能

- [Node.js](/skills) - Node.js 开发
- [Redis](/skills) - 缓存层
- [PostgreSQL](/skills) - 关系型数据库对比`;

// Tutorial 074: Redis
const tutorial074Content = `# Redis 内存数据库进阶

Redis 是一个高性能的键值存储系统，以其极速的读写速度、丰富的数据结构和多功能用途而著称。本教程将深入探讨 Redis 的核心概念和高级用法。

## 为什么选择 Redis

### 核心优势

- **极速性能**: 内存存储，单节点可达 10万+ QPS
- **丰富数据结构**: String、Hash、List、Set、ZSet、Bitmap 等
- **持久化选项**: RDB 快照和 AOF 日志
- **功能多样**: 缓存、消息队列、分布式锁、排行榜
- **复制和集群**: 主从复制、哨兵模式、集群模式
- **原子操作**: 所有单命令都是原子的

### 使用场景

- **缓存**: 数据库查询、API 响应、页面渲染
- **会话存储**: 用户登录状态、购物车
- **排行榜**: 游戏分数、热门文章
- **计数器**: 页面浏览、点赞数、限流
- **消息队列**: 发布订阅、流处理
- **分布式锁**: 防止重复处理、资源竞争

## 核心数据类型

### 1. String（字符串）

\`\`\`bash
# 设置和获取
SET user:1000:name "Alice"
GET user:1000:name

# 设置过期时间（秒）
SET session:abc "data" EX 3600

# 设置不存在时（NX）
SET lock:resource "1" NX EX 10

# 批量操作
MSET key1 val1 key2 val2
MGET key1 key2

# 数值操作
INCR counter        # 自增 1
INCRBY counter 10   # 自增 10
DECR counter        # 自减 1
DECRBY counter 5    # 自减 5

# 浮点数
INCRBYFLOAT balance 100.50
\`\`\`

### 2. Hash（哈希）

\`\`\`bash
# 设置字段
HSET user:1000 name "Alice" age 28 email "alice@example.com"

# 获取字段
HGET user:1000 name
HMGET user:1000 name age email
HGETALL user:1000

# 字段操作
HINCRBY user:1000 age 1
HEXISTS user:1000 email
HDEL user:1000 email

# 所有键和值
HKEYS user:1000
HVALS user:1000
HLEN user:1000
\`\`\`

### 3. List（列表）

\`\`\`bash
# 左侧操作（头部）
LPUSH queue task1 task2 task3
LPOP queue

# 右侧操作（尾部）
RPUSH queue task4
RPOP queue

# 范围查询
LRANGE queue 0 -1  # 所有元素
LRANGE queue 0 2   # 前 3 个

# 阻塞操作（消息队列）
BLPOP queue 30     # 阻塞 30 秒
BRPOP queue 30

# 列表长度
LLEN queue

# 按索引操作
LINDEX queue 0
LSET queue 0 newvalue
\`\`\`

### 4. Set（集合）

\`\`\`bash
# 添加成员
SADD tags nodejs redis mongodb

# 成员操作
SISMEMBER tags nodejs
SMEMBERS tags
SCARD tags

# 随机操作
SRANDMEMBER tags 2
SPOP tags

# 集合运算
SADD set1 a b c
SADD set2 b c d
SINTER set1 set2    # 交集: b, c
SUNION set1 set2    # 并集: a, b, c, d
SDIFF set1 set2     # 差集: a

# 移动
SMOVE set1 set2 a
\`\`\`

### 5. Sorted Set（有序集合）

\`\`\`bash
# 添加成员（分数）
ZADD leaderboard 100 "player1" 95 "player2" 105 "player3"

# 范围查询
ZRANGE leaderboard 0 -1
ZREVRANGE leaderboard 0 -1  # 降序
ZRANGE leaderboard 0 2 WITHSCORES

# 按分数范围
ZRANGEBYSCORE leaderboard 90 100
ZCOUNT leaderboard 90 100

# 分数操作
ZINCRBY leaderboard 5 "player1"
ZSCORE leaderboard "player1"

# 排名
ZRANK leaderboard "player1"
ZREVRANK leaderboard "player1"

# 移除
ZREM leaderboard "player1"
ZREMRANGEBYRANK leaderboard 0 0  # 删除第一名
\`\`\`

### 6. 其他高级类型

\`\`\`bash
# Bitmap（位图）
SETBIT user:1000:followers 1001 1
GETBIT user:1000:followers 1001
BITCOUNT user:1000:followers

# HyperLogLog（基数统计）
PFADD pageviews:2025-01-01 user1 user2 user3
PFCOUNT pageviews:2025-01-01

# Geo（地理空间）
GEOADD locations -122.4194 37.7749 "San Francisco"
GEODIST locations "San Francisco" "New York" km
GEORADIUS locations -122.4194 37.7749 100 km

# Stream（流）
XADD stream * sensor temperature 22.5
XREAD COUNT 2 STREAMS stream 0
XGROUP CREATE stream group1 $
XREADGROUP GROUP group1 consumer1 STREAMS stream >
\`\`\`

## Node.js 集成

### 使用 ioredis

\`\`\`javascript
const Redis = require('ioredis');

const redis = new Redis({
  host: 'localhost',
  port: 6379,
  password: process.env.REDIS_PASSWORD,
  db: 0
});

// 基础操作
await redis.set('key', 'value');
const value = await redis.get('key');

// 设置过期
await redis.set('session', 'data', 'EX', 3600);

// 哈希操作
await redis.hset('user:1000', 'name', 'Alice', 'age', 28);
const user = await redis.hgetall('user:1000');

// 列表操作（队列）
await redis.rpush('queue', 'task1', 'task2');
const task = await redis.blpop('queue', 10);

// 有序集合（排行榜）
await redis.zadd('leaderboard', [
  { score: 100, value: 'player1' },
  { score: 95, value: 'player2' }
]);
const top10 = await redis.zrevrange('leaderboard', 0, 9, 'WITHSCORES');

// 事务
const multi = redis.multi();
multi.set('key1', 'value1');
multi.incr('counter');
const results = await multi.exec();

// Pub/Sub
const subscriber = new Redis();
const publisher = new Redis();

subscriber.subscribe('channel', (err) => {
  if (err) console.error(err);
});

subscriber.on('message', (channel, message) => {
  console.log(\`Received \${message} from \${channel}\`);
});

await publisher.publish('channel', 'Hello Redis!');
\`\`\`

## 持久化

### RDB（快照）

\`\`\`bash
# 配置
save 900 1      # 900秒内至少1次写入
save 300 10     # 300秒内至少10次写入
save 60 10000   # 60秒内至少10000次写入

# 手动触发
BGSAVE          # 后台保存
SAVE            # 同步保存
\`\`\`

### AOF（追加日志）

\`\`\`bash
# 配置
appendonly yes
appendfsync everysec  # always, everysec, no

# AOF 重写
BGREWRITEAOF
\`\`\`

## 高级功能

### 分布式锁

\`\`\`javascript
const RedLock = require('redlock');
const lock = await redlock.acquire([resource], 10000);

try {
  // 执行临界区代码
} finally {
  await lock.release();
}
\`\`\`

### 限流

\`\`\`javascript
// 令牌桶算法
async function rateLimit(userId, limit, window) {
  const key = \`ratelimit:\${userId}\`;
  const now = Date.now();
  const windowStart = now - window;

  const pipeline = redis.multi();
  pipeline.zremrangebyscore(key, 0, windowStart);
  pipeline.zadd(key, now, \`\${now}-\${Math.random()}\`);
  pipeline.zcard(key);
  pipeline.pexpire(key, window);

  const results = await pipeline.exec();
  const count = results[2][1];

  return count <= limit;
}
\`\`\`

### 缓存策略

\`\`\`javascript
// Cache-Aside 模式
async function getUser(id) {
  const cacheKey = \`user:\${id}\`;

  // 先查缓存
  let user = await redis.get(cacheKey);
  if (user) {
    return JSON.parse(user);
  }

  // 查数据库
  user = await db.users.findOne({ id });

  // 写入缓存
  await redis.set(cacheKey, JSON.stringify(user), 'EX', 3600);

  return user;
}

// 缓存穿透防护（缓存空值）
async function getProduct(id) {
  const cacheKey = \`product:\${id}\`;
  let product = await redis.get(cacheKey);

  if (product === null) {
    product = await db.products.findOne({ id });

    if (!product) {
      // 缓存空值，短过期时间
      await redis.set(cacheKey, '', 'EX', 60);
      return null;
    }

    await redis.set(cacheKey, JSON.stringify(product), 'EX', 3600);
  }

  return product === '' ? null : JSON.parse(product);
}
\`\`\`

## 主从复制和集群

### 主从复制

\`\`\`bash
# 从节点配置
replicaof <masterip> <masterport>
masterauth <password>
\`\`\`

### 哨兵模式

\`\`\`bash
# sentinel.conf
port 26379
sentinel monitor mymaster 127.0.0.1 6379 2
sentinel down-after-milliseconds mymaster 5000
sentinel parallel-syncs mymaster 1
sentinel failover-timeout mymaster 10000
\`\`\`

## 性能优化

### 内存优化

\`\`\`bash
# 最大内存
maxmemory 2gb
maxmemory-policy allkeys-lru  # LRU 淘汰策略

# 淘汰策略
# volatile-lru: 删除设置了TTL的LRU键
# allkeys-lru: 删除任何LRU键
# volatile-random: 删除设置了TTL的随机键
# allkeys-random: 删除任何随机键
# volatile-ttl: 删除即将过期的键
# noeviction: 不删除，返回错误
\`\`\`

### Pipeline（管道）

\`\`\`javascript
// 批量操作减少网络往返
const pipeline = redis.pipeline();
for (let i = 0; i < 1000; i++) {
  pipeline.set(\`key:\${i}\`, \`value:\${i}\`);
}
await pipeline.exec();
\`\`\`

## 监控和调试

\`\`\`bash
# 实时监控
MONITOR

# 慢查询
SLOWLOG GET 10

# 信息
INFO
INFO memory
INFO stats
INFO replication

# 客户端列表
CLIENT LIST

# 键空间
SCAN 0 MATCH user:* COUNT 100
\`\`\`

## 实战案例

### 排行榜系统

\`\`\`javascript
// 添加分数
await redis.zadd('game:scores', score, userId);

// 获取排名
const rank = await redis.zrevrank('game:scores', userId);
const score = await redis.zscore('game:scores', userId);

// 获取前 N 名
const topPlayers = await redis.zrevrange(
  'game:scores', 0, 9,
  'WITHSCORES'
);
\`\`\`

## 最佳实践

1. **控制 key 大小**: key 避免过长，使用简洁命名
2. **设置过期时间**: 防止内存泄漏
3. **使用连接池**: 复用连接，提高性能
4. **选择合适数据类型**: 根据场景选择
5. **监控内存使用**: 设置 maxmemory 和淘汰策略
6. **使用 Pipeline**: 批量操作减少网络开销

## 相关技能

- [Node.js](/skills) - Node.js 开发
- [MongoDB](/skills) - NoSQL 数据库
- [PostgreSQL](/skills) - 关系型数据库`;

// Tutorial 075: Elasticsearch
const tutorial075Content = `# Elasticsearch 搜索引擎进阶

Elasticsearch 是一个基于 Lucene 的分布式搜索和分析引擎，专门用于处理大量数据的实时搜索、日志分析和数据可视化。本教程将深入探讨 Elasticsearch 的核心概念和高级用法。

## 为什么选择 Elasticsearch

### 核心优势

- **全文搜索**: 基于 Lucene 的强大全文检索能力
- **分布式架构**: 水平扩展，自动分片和复制
- **实时性**: 近实时搜索（秒级延迟）
- **分析能力**: 聚合、复杂的分析查询
- **Schema 灵活**: 动态映射，无需预定义结构
- **生态丰富**: Kibana、Logstash、Beats 完整栈

### 使用场景

- **网站搜索**: 电商商品搜索、内容搜索
- **日志分析**: ELK Stack 日志收集和分析
- **指标监控**: 应用性能监控、基础设施监控
- **安全分析**: 威胁检测、安全事件分析
- **地理搜索**: 位置搜索、地理聚合

## 核心概念

### 架构组件

\`\`\`text
Index（索引）
  ↓
Shard（分片）
  ↓
Segment（段文件）
  ↓
Document（文档）
  ↓
Field（字段）
\`\`\`

- **Index**: 类似数据库的表
- **Document**: JSON 格式的记录
- **Field**: 文档中的字段
- **Mapping**: 定义字段类型和配置
- **Shard**: 索引的水平分片
- **Replica**: 分片的副本，用于高可用

### 基本操作

\`\`\`bash
# 创建索引
PUT /products
{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 2
  },
  "mappings": {
    "properties": {
      "name": { "type": "text" },
      "description": { "type": "text" },
      "price": { "type": "double" },
      "category": { "type": "keyword" },
      "in_stock": { "type": "boolean" },
      "created_at": { "type": "date" }
    }
  }
}

# 添加文档
PUT /products/_doc/1
{
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "category": "electronics",
  "in_stock": true,
  "created_at": "2025-01-01"
}

# 批量添加
POST /products/_bulk
{ "index": { "_id": "2" } }
{ "name": "Mouse", "price": 29.99, "category": "electronics" }
{ "index": { "_id": "3" } }
{ "name": "Desk", "price": 299.99, "category": "furniture" }

# 查询文档
GET /products/_doc/1

# 更新文档
POST /products/_update/1
{
  "doc": {
    "price": 899.99
  }
}

# 删除文档
DELETE /products/_doc/1

# 删除索引
DELETE /products
\`\`\`

## 搜索查询

### 基础查询

\`\`\`bash
# 匹配所有
GET /products/_search
{
  "query": {
    "match_all": {}
  }
}

# 全文搜索
GET /products/_search
{
  "query": {
    "match": {
      "description": "laptop computer"
    }
  }
}

# 短语搜索
GET /products/_search
{
  "query": {
    "match_phrase": {
      "description": "high performance"
    }
  }
}

# 精确匹配
GET /products/_search
{
  "query": {
    "term": {
      "category": "electronics"
    }
  }
}

# 多值匹配
GET /products/_search
{
  "query": {
    "terms": {
      "category": ["electronics", "computers"]
    }
  }
}

# 范围查询
GET /products/_search
{
  "query": {
    "range": {
      "price": {
        "gte": 100,
        "lte": 1000
      }
    }
  }
}

# 布尔查询
GET /products/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "description": "laptop" } }
      ],
      "should": [
        { "match": { "category": "electronics" } }
      ],
      "must_not": [
        { "term": { "in_stock": false } }
      ],
      "filter": [
        { "range": { "price": { "lte": 1000 } } }
      ]
    }
  }
}
\`\`\`

### 高级查询

\`\`\`bash
# 多字段搜索
GET /products/_search
{
  "query": {
    "multi_match": {
      "query": "laptop",
      "fields": ["name^2", "description"],
      "type": "best_fields"
    }
  }
}

# 嵌套对象
GET /products/_search
{
  "query": {
    "nested": {
      "path": "reviews",
      "query": {
        "bool": {
          "must": [
            { "match": { "reviews.comment": "excellent" } },
            { "range": { "reviews.rating": { "gte": 4 } } }
          ]
        }
      }
    }
  }
}

# 前缀查询
GET /products/_search
{
  "query": {
    "prefix": {
      "name": "lap"
    }
  }
}

# 通配符查询
GET /products/_search
{
  "query": {
    "wildcard": {
      "name": "lap*"
    }
  }
}

# 模糊查询
GET /products/_search
{
  "query": {
    "fuzzy": {
      "name": {
        "value": "lptop",
        "fuzziness": "AUTO"
      }
    }
  }
}
\`\`\`

## 聚合分析

### 基础聚合

\`\`\`bash
# 指标聚合
GET /products/_search
{
  "size": 0,
  "aggs": {
    "avg_price": {
      "avg": { "field": "price" }
    },
    "max_price": {
      "max": { "field": "price" }
    },
    "stats": {
      "stats": { "field": "price" }
    }
  }
}

# 分桶聚合
GET /products/_search
{
  "size": 0,
  "aggs": {
    "by_category": {
      "terms": {
        "field": "category",
        "size": 10
      },
      "aggs": {
        "avg_price": {
          "avg": { "field": "price" }
        }
      }
    }
  }
}

# 范围聚合
GET /products/_search
{
  "size": 0,
  "aggs": {
    "price_ranges": {
      "range": {
        "field": "price",
        "ranges": [
          { "to": 100 },
          { "from": 100, "to": 500 },
          { "from": 500 }
        ]
      }
    }
  }
}

# 日期直方图
GET /orders/_search
{
  "size": 0,
  "aggs": {
    "orders_over_time": {
      "date_histogram": {
        "field": "created_at",
        "calendar_interval": "month"
      }
    }
  }
}
\`\`\`

### 高级聚合

\`\`\`bash
# 嵌套聚合
GET /products/_search
{
  "size": 0,
  "aggs": {
    "by_category": {
      "terms": { "field": "category" },
      "aggs": {
        "by_price_range": {
          "range": {
            "field": "price",
            "ranges": [
              { "to": 100 },
              { "from": 100 }
            ]
          },
          "aggs": {
            "avg_rating": {
              "avg": { "field": "rating" }
            }
          }
        }
      }
    }
  }
}

# 过滤聚合
GET /products/_search
{
  "size": 0,
  "aggs": {
    "in_stock_products": {
      "filter": { "term": { "in_stock": true } },
      "aggs": {
        "avg_price": {
          "avg": { "field": "price" }
        }
      }
    }
  }
}

# 百分位数聚合
GET /response_times/_search
{
  "size": 0,
  "aggs": {
    "load_time_percentiles": {
      "percentiles": {
        "field": "load_time",
        "percents": [1, 5, 25, 50, 75, 95, 99]
      }
    }
  }
}
\`\`\`

## Node.js 集成

### 使用 @elastic/elasticsearch

\`\`\`javascript
const { Client } = require('@elastic/elasticsearch');

const client = new Client({
  node: 'http://localhost:9200'
});

// 索引文档
await client.index({
  index: 'products',
  id: '1',
  document: {
    name: 'Laptop',
    description: 'High-performance laptop',
    price: 999.99,
    category: 'electronics'
  }
});

// 搜索
const response = await client.search({
  index: 'products',
  body: {
    query: {
      match: {
        description: 'laptop'
      }
    }
  }
});

// 聚合
const aggResponse = await client.search({
  index: 'products',
  body: {
    size: 0,
    aggs: {
      by_category: {
        terms: {
          field: 'category',
          size: 10
        }
      }
    }
  }
});

// 更新
await client.update({
  index: 'products',
  id: '1',
  body: {
    doc: {
      price: 899.99
    }
  }
});

// 删除
await client.delete({
  index: 'products',
  id: '1'
});
\`\`\`

## 文本分析

### 分析器

\`\`\`bash
# 自定义分析器
PUT /products
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": ["lowercase", "stop", "snowball"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "description": {
        "type": "text",
        "analyzer": "my_analyzer"
      }
    }
  }
}

# 测试分析器
POST /products/_analyze
{
  "analyzer": "my_analyzer",
  "text": "The Quick Brown Fox"
}
\`\`\`

### 分词器

\`\`\`bash
# Standard 分词器
POST /_analyze
{
  "tokenizer": "standard",
  "text": "The 2 QUICK Brown-Foxes jumped"
}

# Whitespace 分词器
POST /_analyze
{
  "tokenizer": "whitespace",
  "text": "The 2 QUICK Brown-Foxes jumped"
}

# Pattern 分词器
POST /_analyze
{
  "tokenizer": {
    "type": "pattern",
    "pattern": "[, .]+"
  },
  "text": "comma,separated,values"
}
\`\`\`

## 性能优化

### 索引优化

\`\`\`bash
# 刷新间隔
PUT /products/_settings
{
  "index": {
    "refresh_interval": "30s"
  }
}

# 禁用刷新（批量导入）
PUT /products/_settings
{
  "index": {
    "refresh_interval": "-1"
  }
}

# 合并段文件
POST /products/_forcemerge?max_num_segments=1
\`\`\`

### 查询优化

\`\`\`bash
# 使用 filter 上下文（不计算分数）
GET /products/_search
{
  "query": {
    "bool": {
      "filter": [
        { "term": { "category": "electronics" } },
        { "range": { "price": { "lte": 1000 } } }
      ]
    }
  }
}

# 限制返回字段
GET /products/_search
{
  "_source": ["name", "price"],
  "query": {
    "match": { "description": "laptop" }
  }
}

# 分页优化（使用 search_after）
GET /products/_search
{
  "size": 100,
  "query": { "match_all": {} },
  "sort": [
    { "_id": "desc" }
  ],
  "search_after": ["last_doc_id"]
}
\`\`\`

## 实战案例

### 电商商品搜索

\`\`\`bash
GET /products/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "multi_match": {
            "query": "laptop",
            "fields": ["name^3", "description^2", "brand"],
            "type": "best_fields"
          }
        }
      ],
      "filter": [
        { "term": { "in_stock": true } },
        { "range": { "price": { "lte": 1000 } } }
      ]
    }
  },
  "aggs": {
    "categories": {
      "terms": { "field": "category" }
    },
    "brands": {
      "terms": { "field": "brand" }
    },
    "price_ranges": {
      "range": {
        "field": "price",
        "ranges": [
          { "to": 100 },
          { "from": 100, "to": 500 },
          { "from": 500, "to": 1000 },
          { "from": 1000 }
        ]
      }
    }
  },
  "sort": [
    { "popularity": "desc" },
    { "price": "asc" }
  ]
}
\`\`\`

## 最佳实践

1. **设计合理的 Mapping**: 根据查询需求设置字段类型
2. **使用 Filter 上下文**: 不需要评分的查询使用 filter
3. **控制索引大小**: 定期删除旧数据，使用 ILM
4. **合理设置分片**: 每个分片 10-50GB
5. **使用 Bulk API**: 批量操作提高性能
6. **监控集群健康**: 使用 Kibana 或 API 监控

## 相关技能

- [Kibana](/skills) - 数据可视化
- [Logstash](/skills) - 数据处理管道
- [Redis](/skills) - 缓存层
- [MongoDB](/skills) - NoSQL 数据库`;

// Tutorial 076: RabbitMQ
const tutorial076Content = `# RabbitMQ 消息队列进阶

RabbitMQ 是一个功能强大的开源消息代理，实现了 AMQP（高级消息队列协议）协议。本教程将深入探讨 RabbitMQ 的核心概念、消息模式和最佳实践。

## 为什么选择 RabbitMQ

### 核心优势

- **协议支持**: AMQP 0-9-1、MQTT、STOMP
- **灵活路由**: Exchange 和 Binding 机制
- **可靠性**: 消息确认、持久化、高可用
- **集群支持**: 镜像队列、联邦插件
- **多语言支持**: 官方客户端覆盖主流语言
- **管理界面**: Web UI 监控和管理

### 使用场景

- **异步处理**: 邮件发送、图像处理
- **应用解耦**: 微服务间通信
- **流量削峰**: 限时活动、秒杀
- **日志收集**: 分布式日志聚合
- **定时任务**: 延迟队列、调度任务

## 核心概念

### 架构组件

\`\`\`text
Producer（生产者）
  ↓
Exchange（交换机）
  ↓
Binding（绑定）
  ↓
Queue（队列）
  ↓
Consumer（消费者）
\`\`\`

### Exchange 类型

1. **Direct（直连）**: 根据精确 routing key 路由
2. **Fanout（扇出）**: 广播到所有绑定的队列
3. **Topic（主题）**: 根据模式匹配 routing key
4. **Headers（头）**: 根据消息头属性路由

## 基础操作

### 管理命令

\`\`\`bash
# 启动 RabbitMQ
rabbitmq-server

# 状态检查
rabbitmqctl status
rabbitmqctl list_connections
rabbitmqctl list_queues
rabbitmqctl list_exchanges
rabbitmqctl list_bindings

# 用户管理
rabbitmqctl add_user admin password123
rabbitmqctl set_user_tags admin administrator
rabbitmqctl set_permissions admin ".*" ".*" ".*"

# 启用管理插件
rabbitmq-plugins enable rabbitmq_management

# 访问管理界面
http://localhost:15672
\`\`\`

## Node.js 集成

### 使用 amqplib

\`\`\`javascript
const amqp = require('amqplib');

async function connect() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  return { connection, channel };
}
\`\`\`

### 消息模式

#### 1. Work Queue（工作队列）

\`\`\`javascript
// 生产者
async function sendTask() {
  const { connection, channel } = await connect();

  const queue = 'task_queue';
  await channel.assertQueue(queue, { durable: true });

  const message = 'Hello RabbitMQ!';
  channel.sendToQueue(
    queue,
    Buffer.from(message),
    { persistent: true }
  );

  console.log('Sent:', message);

  await channel.close();
  await connection.close();
}

// 消费者
async function worker() {
  const { connection, channel } = await connect();

  const queue = 'task_queue';
  await channel.assertQueue(queue, { durable: true });

  // 公平分发（预取计数）
  channel.prefetch(1);

  channel.consume(queue, (msg) => {
    const content = msg.content.toString();
    console.log('Received:', content);

    // 模拟处理
    setTimeout(() => {
      console.log('Done');
      channel.ack(msg);
    }, 1000);
  }, { noAck: false });
}
\`\`\`

#### 2. Publish/Subscribe（发布订阅）

\`\`\`javascript
// 生产者（发送日志）
async function emitLog() {
  const { connection, channel } = await connect();

  const exchange = 'logs';
  await channel.assertExchange(exchange, 'fanout', { durable: false });

  const message = 'Info: Hello World!';
  channel.publish(exchange, '', Buffer.from(message));

  console.log('Sent:', message);

  await channel.close();
  await connection.close();
}

// 消费者（接收日志）
async function receiveLog() {
  const { connection, channel } = await connect();

  const exchange = 'logs';
  await channel.assertExchange(exchange, 'fanout', { durable: false });

  // 临时队列
  const q = await channel.assertQueue('', { exclusive: true });

  // 绑定到交换机
  await channel.bindQueue(q.queue, exchange, '');

  channel.consume(q.queue, (msg) => {
    const content = msg.content.toString();
    console.log('Received:', content);
  }, { noAck: true });
}
\`\`\`

#### 3. Routing（路由）

\`\`\`javascript
// 生产者
async function emitLogDirect() {
  const { connection, channel } = await connect();

  const exchange = 'direct_logs';
  await channel.assertExchange(exchange, 'direct', { durable: false });

  const severity = process.argv[2] || 'info';
  const message = 'Hello World!';

  channel.publish(exchange, severity, Buffer.from(message));

  console.log('Sent %s: %s', severity, message);

  await channel.close();
  await connection.close();
}

// 消费者
async function receiveLogDirect() {
  const { connection, channel } = await connect();

  const exchange = 'direct_logs';
  await channel.assertExchange(exchange, 'direct', { durable: false });

  const q = await channel.assertQueue('', { exclusive: true });

  const severities = process.argv.slice(2);
  severities.forEach((severity) => {
    channel.bindQueue(q.queue, exchange, severity);
  });

  channel.consume(q.queue, (msg) => {
    const severity = msg.fields.routingKey;
    const content = msg.content.toString();
    console.log('Received %s: %s', severity, content);
  }, { noAck: true });
}
\`\`\`

#### 4. Topic（主题）

\`\`\`javascript
// 生产者
async function emitLogTopic() {
  const { connection, channel } = await connect();

  const exchange = 'topic_logs';
  await channel.assertExchange(exchange, 'topic', { durable: false });

  const args = process.argv.slice(2);
  const key = args.length > 0 ? args[0] : 'anonymous.info';
  const message = args.slice(1).join(' ') || 'Hello World';

  channel.publish(exchange, key, Buffer.from(message));

  console.log('Sent %s: %s', key, message);

  await channel.close();
  await connection.close();
}

// 消费者
async function receiveLogTopic() {
  const { connection, channel } = await connect();

  const exchange = 'topic_logs';
  await channel.assertExchange(exchange, 'topic', { durable: false });

  const q = await channel.assertQueue('', { exclusive: true });

  const args = process.argv.slice(2);
  args.forEach((key) => {
    channel.bindQueue(q.queue, exchange, key);
  });

  channel.consume(q.queue, (msg) => {
    const key = msg.fields.routingKey;
    const content = msg.content.toString();
    console.log('Received %s: %s', key, content);
  }, { noAck: true });
}

// Topic 模式示例
// *.orange.*  匹配 3 个词，中间是 orange
// *.*.rabbit  匹配 3 个词，最后是 rabbit
// lazy.#       匹配以 lazy 开头的所有
\`\`\`

#### 5. RPC（远程调用）

\`\`\`javascript
// RPC 服务器
async function rpcServer() {
  const { connection, channel } = await connect();

  const q = 'rpc_queue';
  await channel.assertQueue(q, { durable: false });

  channel.prefetch(1);

  channel.consume(q, (msg) => {
    const n = parseInt(msg.content.toString());
    console.log('Fib(%d)', n);

    const response = fib(n);

    channel.sendToQueue(
      msg.properties.replyTo,
      Buffer.from(response.toString()),
      { correlationId: msg.properties.correlationId }
    );

    channel.ack(msg);
  });
}

function fib(n) {
  if (n === 0 || n === 1) return n;
  return fib(n - 1) + fib(n - 2);
}

// RPC 客户端
class RPCClient {
  async send(n) {
    const { connection, channel } = await connect();

    const q = await channel.assertQueue('', { exclusive: true });

    const correlationId = generateUuid();

    channel.consume(q.queue, (msg) => {
      if (msg.properties.correlationId === correlationId) {
        const response = parseInt(msg.content.toString());
        console.log('Got reply:', response);
        channel.close();
        connection.close();
      }
    }, { noAck: true });

    channel.sendToQueue(
      'rpc_queue',
      Buffer.from(n.toString()),
      {
        correlationId,
        replyTo: q.queue
      }
    );
  }
}
\`\`\`

## 高级功能

### 消息确认

\`\`\`javascript
// 手动确认
channel.consume(queue, (msg) => {
  try {
    // 处理消息
    processMessage(msg);

    // 确认成功
    channel.ack(msg);
  } catch (error) {
    // 拒绝并重新入队
    channel.nack(msg, false, true);

    // 或拒绝不重新入队
    // channel.reject(msg, false);
  }
}, { noAck: false });

// 批量确认
channel.ack(msg, true);  // 确认此消息及之前所有消息
\`\`\`

### 消息持久化

\`\`\`javascript
// 持久化队列
await channel.assertQueue(queue, {
  durable: true  // 队列持久化
});

// 持久化消息
channel.sendToQueue(
  queue,
  Buffer.from(message),
  {
    deliveryMode: 2,  // 1: 非持久化, 2: 持久化
    persistent: true  // 同 deliveryMode: 2
  }
);
\`\`\`

### 死信队列

\`\`\`javascript
// 声明死信交换机
const dlx = 'dlx_exchange';
await channel.assertExchange(dlx, 'direct', { durable: true });

// 声明死信队列
const dlq = 'dlq_queue';
await channel.assertQueue(dlq, { durable: true });
await channel.bindQueue(dlq, dlx, dlq);

// 声明主队列，设置死信参数
await channel.assertQueue('main_queue', {
  durable: true,
  arguments: {
    'x-dead-letter-exchange': dlx,
    'x-dead-letter-routing-key': dlq
  }
});
\`\`\`

### 延迟队列

\`\`\`javascript
// 使用 rabbitmq_delayed_message_exchange 插件
// rabbitmq-plugins enable rabbitmq_delayed_message_exchange

// 生产者
async function sendDelayed() {
  const { connection, channel } = await connect();

  const exchange = 'delayed_exchange';
  await channel.assertExchange(exchange, 'x-delayed-message', {
    durable: true,
    arguments: {
      'x-delayed-type': 'direct'
    }
  });

  const message = 'Delayed message';
  channel.publish(exchange, '', Buffer.from(message), {
    headers: {
      'x-delay': 5000  // 延迟 5 秒
    }
  });
}
\`\`\`

### 优先级队列

\`\`\`javascript
await channel.assertQueue(queue, {
  durable: true,
  arguments: {
    'x-max-priority': 10  // 优先级 0-10
  }
});

// 发送消息时设置优先级
channel.sendToQueue(
  queue,
  Buffer.from(message),
  { priority: 5 }  // 优先级 0-10
);
\`\`\`

## 集群和高可用

### 镜像队列

\`\`\`bash
# 设置策略（所有队列镜像到所有节点）
rabbitmqctl set_policy ha-all "^" '{"ha-mode":"all"}'

# 镜像到指定数量的节点
rabbitmqctl set_policy ha-two "^" '{"ha-mode":"exactly","ha-params":2}'

# 镜像到特定节点
rabbitmqctl set_policy ha-nodes "^" '{"ha-mode":"nodes","ha-params":["node1","node2"]}'
\`\`\`

### 集群配置

\`\`\`bash
# 节点1
rabbitmq-server -n rabbit@node1

# 节点2（加入集群）
rabbitmq-server -n rabbit@node2
rabbitmqctl stop_app
rabbitmqctl reset
rabbitmqctl join_cluster rabbit@node1
rabbitmqctl start_app

# 查看集群状态
rabbitmqctl cluster_status
\`\`\`

## 监控和管理

### 管理界面

访问 http://localhost:15672，可以：
- 查看连接、通道、队列
- 查看消息速率
- 管理用户和权限
- 发布和测试消息

### 命令行监控

\`\`\`bash
# 队列状态
rabbitmqctl list_queues name messages consumers

# 交换机状态
rabbitmqctl list_exchanges name type messages

# 连接状态
rabbitmqctl list_connections

# 通道状态
rabbitmqctl list_channels

# 内存使用
rabbitmqctl status | grep memory
\`\`\`

## 实战案例

### 订单处理系统

\`\`\`javascript
// 订单服务（生产者）
async function createOrder(order) {
  const { connection, channel } = await connect();

  const exchange = 'orders';
  await channel.assertExchange(exchange, 'topic', { durable: true });

  const message = JSON.stringify(order);
  channel.publish(exchange, 'order.created', Buffer.from(message), {
    contentType: 'application/json',
    deliveryMode: 2
  });

  await channel.close();
  await connection.close();
}

// 库存服务（消费者）
async function consumeOrderEvents() {
  const { connection, channel } = await connect();

  const exchange = 'orders';
  await channel.assertExchange(exchange, 'topic', { durable: true });

  const q = await channel.assertQueue('inventory_service', { durable: true });
  await channel.bindQueue(q.queue, exchange, 'order.created');

  channel.consume(q.queue, async (msg) => {
    const order = JSON.parse(msg.content.toString());
    await reserveInventory(order);
    channel.ack(msg);
  });
}

// 通知服务（消费者）
async function consumeNotificationEvents() {
  const { connection, channel } = await connect();

  const exchange = 'orders';
  await channel.assertExchange(exchange, 'topic', { durable: true });

  const q = await channel.assertQueue('notification_service', { durable: true });
  await channel.bindQueue(q.queue, exchange, 'order.#');

  channel.consume(q.queue, async (msg) => {
    const event = msg.fields.routingKey;
    const order = JSON.parse(msg.content.toString());
    await sendNotification(event, order);
    channel.ack(msg);
  });
}
\`\`\`

## 最佳实践

1. **使用确认机制**: 确保消息不丢失
2. **设置持久化**: 关键消息和队列持久化
3. **合理设置预取**: 避免消费者负载不均
4. **使用死信队列**: 处理失败消息
5. **监控队列深度**: 避免消息积压
6. **优雅关闭**: 处理完消息后再关闭连接
7. **消息幂等性**: 消费者应该能处理重复消息

## 相关技能

- [Redis](/skills) - 内存数据库和 Pub/Sub
- [Kafka](/skills) - 分布式流处理平台
- [Node.js](/skills) - Node.js 开发
- [Docker](/skills) - 容器化部署`;

// Create the 4 new tutorials
const newTutorials = [
  {
    id: "tutorial-073",
    title: "MongoDB 文档数据库进阶",
    slug: "mongodb-document-database",
    description: "深入学习 MongoDB 文档数据库，掌握灵活的数据模型、强大的聚合管道、索引优化、副本集配置和事务处理等核心功能。",
    content: tutorial073Content,
    category: "database",
    tags: ["MongoDB", "NoSQL", "文档数据库", "聚合", "副本集"],
    difficulty: "intermediate",
    readTime: 25,
    author: "OpenClaw Team",
    relatedSkills: ["skill-063"],
    stats: { viewCount: 0 },
    createdAt: now,
    featured: false
  },
  {
    id: "tutorial-074",
    title: "Redis 内存数据库进阶",
    slug: "redis-in-memory-database",
    description: "深入学习 Redis 内存数据库，掌握丰富的数据结构、持久化机制、发布订阅、分布式锁、缓存策略和集群配置。",
    content: tutorial074Content,
    category: "database",
    tags: ["Redis", "内存数据库", "缓存", "发布订阅", "分布式锁"],
    difficulty: "intermediate",
    readTime: 25,
    author: "OpenClaw Team",
    relatedSkills: ["skill-064"],
    stats: { viewCount: 0 },
    createdAt: now,
    featured: false
  },
  {
    id: "tutorial-075",
    title: "Elasticsearch 搜索引擎进阶",
    slug: "elasticsearch-search-engine",
    description: "深入学习 Elasticsearch 搜索引擎，掌握全文搜索、聚合分析、索引优化、文本分析和 ELK Stack 集成。",
    content: tutorial075Content,
    category: "database",
    tags: ["Elasticsearch", "搜索引擎", "全文搜索", "聚合", "ELK"],
    difficulty: "intermediate",
    readTime: 25,
    author: "OpenClaw Team",
    relatedSkills: ["skill-107"],
    stats: { viewCount: 0 },
    createdAt: now,
    featured: false
  },
  {
    id: "tutorial-076",
    title: "RabbitMQ 消息队列进阶",
    slug: "rabbitmq-message-queue",
    description: "深入学习 RabbitMQ 消息队列，掌握 AMQP 协议、Exchange 路由、消息确认、死信队列、RPC 模式和集群配置。",
    content: tutorial076Content,
    category: "database",
    tags: ["RabbitMQ", "消息队列", "AMQP", "异步处理", "微服务"],
    difficulty: "intermediate",
    readTime: 25,
    author: "OpenClaw Team",
    relatedSkills: [],
    stats: { viewCount: 0 },
    createdAt: now,
    featured: false
  }
];

// Append new tutorials
tutorials.push(...newTutorials);

// Write back to file
fs.writeFileSync(tutorialsJsonPath, JSON.stringify(tutorials, null, 2), 'utf8');

console.log(`Added ${newTutorials.length} new Intermediate tutorials:`);
newTutorials.forEach(t => {
  console.log(`  - ${t.id}: ${t.title}`);
});
console.log(`Total tutorials: ${tutorials.length}`);
