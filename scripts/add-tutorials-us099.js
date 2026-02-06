const fs = require('fs');
const path = require('path');

const tutorialsJsonPath = path.join(__dirname, '..', 'src', 'data', 'tutorials.json');
const tutorials = JSON.parse(fs.readFileSync(tutorialsJsonPath, 'utf8'));

const now = new Date().toISOString();

// Tutorial 073: Kafka (overwriting from batch8)
const tutorial073Content = `# Kafka 流处理实战

Apache Kafka 是一个分布式流处理平台，广泛用于构建实时数据管道和流应用。本教程将带你深入了解 Kafka 的核心概念和流处理实战。

## 什么是 Kafka？

Kafka 是一个高吞吐量、低延迟的分布式消息系统，具有以下特点：

- **高吞吐量**: 每秒可处理数百万条消息
- **低延迟**: 毫秒级的消息传递延迟
- **可扩展性**: 支持水平扩展，无需停机
- **持久化**: 消息持久化到磁盘，支持数据回溯
- **分区**: 支持数据分区和并行处理

## 核心概念

### 1. Topic 和 Partition

Topic 是消息的分类，Partition 是 Topic 的分片：

\`\`\`bash
# 创建一个有 3 个分区的 Topic
kafka-topics.sh --create \\
  --topic orders \\
  --partitions 3 \\
  --replication-factor 2 \\
  --bootstrap-server localhost:9092
\`\`\`

**关键概念**:
- **Partition**: Topic 被分割成多个分区，实现并行处理
- **Replication**: 每个分区可以有多个副本，保证高可用
- **Leader**: 每个分区有一个 Leader 负责处理读写请求
- **Follower**: 副本分区，从 Leader 同步数据

### 2. Producer 生产者

Producer 负责将消息发送到 Kafka：

\`\`\`javascript
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

async function produceOrder(order) {
  await producer.connect();
  await producer.send({
    topic: 'orders',
    messages: [
      {
        key: order.userId,  // 按 userId 分区
        value: JSON.stringify(order),
        timestamp: Date.now()
      }
    ]
  });
  await producer.disconnect();
}

// 示例：发送订单
produceOrder({
  orderId: 'ORD-001',
  userId: 'user-123',
  amount: 99.99,
  items: ['item-1', 'item-2']
});
\`\`\`

### 3. Consumer 消费者

Consumer 从 Topic 读取消息：

\`\`\`javascript
const consumer = kafka.consumer({
  groupId: 'order-processor'
});

async function consumeOrders() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'orders', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const order = JSON.parse(message.value.toString());
      console.log(\`收到订单: \${order.orderId}\`);

      // 处理订单
      await processOrder(order);
    }
  });
}

async function processOrder(order) {
  // 业务逻辑：库存检查、支付处理等
  console.log(\`处理订单 \${order.orderId}, 金额: \${order.amount}\`);
}
\`\`\`

### 4. Consumer Group 和分区分配

Consumer Group 实现负载均衡：

\`\`\`bash
# 启动多个消费者实例（同一 groupId）
node consumer.js &  # 实例 1 - 处理 partition 0, 1
node consumer.js &  # 实例 2 - 处理 partition 2
\`\`\`

## Kafka Streams

Kafka Streams 是一个客户端库，用于构建流处理应用。

\`\`\`javascript
const { KafkaStreams } = require('kafka-streams');

const config = {
  noptions: {
    'metadata.broker.list': 'localhost:9092'
  }
};

const ks = new KafkaStreams(config);

const stream = ks.getKStream('text-topic');

stream
  .mapText(JSON.parse)
  .flatMap(text => text.words)
  .map(word => ({ key: word, value: 1 }))
  .countByKey('key', 'value')
  .to('word-count-topic');

ks.start();
\`\`\`

## 实战案例：实时订单处理系统

### 架构设计

\`\`\`
订单服务 → [orders topic] → 订单处理 → [validated-orders]
                                  ↓
                            [notifications topic] → 通知服务
                                  ↓
                            [analytics topic] → 分析服务
\`\`\`

### Producer 实现

\`\`\`javascript
class OrderProducer {
  constructor() {
    this.producer = kafka.producer({
      acks: 'all',
      retries: 3,
      compression: 'gzip'
    });
  }

  async sendOrder(order) {
    await this.producer.send({
      topic: 'orders',
      messages: [{
        key: order.userId,
        value: JSON.stringify({
          ...order,
          timestamp: Date.now(),
          status: 'pending'
        })
      }]
    });
  }

  async close() {
    await this.producer.disconnect();
  }
}
\`\`\`

## 性能优化

### Producer 优化

\`\`\`javascript
// 批量发送优化
const producer = kafka.producer({
  // 批量配置
  batchSize: 32 * 1024,          // 32KB 批量
  lingerMs: 10,                  // 等待 10ms 收集更多消息
  maxInFlightRequests: 5,        // 并行请求数

  // 缓冲区配置
  bufferMemory: 64 * 1024 * 1024, // 64MB 缓冲区
  compression: 'lz4',             // 更快的压缩

  // 可靠性权衡
  acks: 1,                        // 只等待 leader 确认
  enableIdempotence: false        // 禁用幂等性以提升性能
});
\`\`\`

## 常见问题

### Q: 如何保证消息不丢失？

A: 配置合适的 acks 和副本数：

\`\`\`javascript
const producer = kafka.producer({
  acks: 'all',              // 等待所有副本
  retries: 3,               // 重试 3 次
  enableIdempotence: true   // 启用幂等性
});
\`\`\`

### Q: 如何处理消费者 lag？

A: 增加 Consumer 实例或优化处理逻辑：

\`\`\`bash
# 查看 lag
kafka-consumer-groups.sh --describe --group my-group

# 如果 lag 过大，增加 consumer 实例
\`\`\`

## 下一步

- 阅读 [NestJS 后端开发](/tutorial/nestjs-backend-development) 了解 Kafka 集成
- 学习 [Elasticsearch 搜索引擎](/tutorial/elasticsearch-search-engine) 进行日志搜索
- 探索 [Redis 内存数据库](/tutorial/redis-in-memory-database) 了解实时数据同步

## 相关技能

- [Kafka](/skills) - 分布式消息系统
- [Redis](/skills) - 内存缓存
- [Elasticsearch](/skills) - 日志搜索和分析`;

// Tutorial 074: AWS Lambda
const tutorial074Content = `# AWS Lambda 无服务器开发

AWS Lambda 是一个事件驱动的无服务器计算服务，让你无需管理服务器即可运行代码。本教程将深入讲解 Lambda 的核心概念和实战应用。

## 什么是 AWS Lambda？

Lambda 让你能够在不配置和管理服务器的情况下运行代码。你只需上传代码，Lambda 会处理运行代码所需的一切，包括：

- **自动扩展**: 根据请求量自动扩展
- **高可用性**: 内置冗余和容错
- **按使用付费**: 只为实际计算时间付费
- **零管理**: 无需管理底层基础设施

## Lambda 函数基础

### 1. 创建第一个 Lambda 函数

\`\`\`javascript
// handler.js
exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello from Lambda!',
      input: event
    })
  };

  return response;
};
\`\`\`

### 2. 事件对象结构

\`\`\`javascript
// API Gateway 事件
{
  "httpMethod": "POST",
  "path": "/users",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "{\\"name\\": \\"John\\"}",
  "queryStringParameters": {
    "debug": "true"
  }
}

// S3 事件
{
  "Records": [{
    "eventVersion": "2.1",
    "eventSource": "aws:s3",
    "eventName": "ObjectCreated:Put",
    "s3": {
      "bucket": {
        "name": "my-bucket"
      },
      "object": {
        "key": "uploads/image.jpg",
        "size": 1024
      }
    }
  }]
}
\`\`\`

## 常用触发器

### 1. API Gateway

\`\`\`javascript
// REST API 处理
exports.handler = async (event) => {
  const { httpMethod, path, body } = event;

  if (httpMethod === 'GET' && path === '/users') {
    return {
      statusCode: 200,
      body: JSON.stringify([{ id: 1, name: 'John' }])
    };
  }

  if (httpMethod === 'POST' && path === '/users') {
    const user = JSON.parse(body);
    await createUser(user);
    return {
      statusCode: 201,
      body: JSON.stringify({ id: user.id, ...user })
    };
  }

  return {
    statusCode: 404,
    body: JSON.stringify({ error: 'Not Found' })
  };
};
\`\`\`

### 2. S3 事件

\`\`\`javascript
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\\+/g, ' '));

    console.log(\`Processing file: \${bucket}/\${key}\`);

    // 读取文件
    const params = { Bucket: bucket, Key: key };
    const data = await s3.getObject(params).promise();

    // 处理文件内容
    const result = await processFile(data.Body);

    // 保存结果
    await s3.putObject({
      Bucket: bucket,
      Key: \`processed/\${key}\`,
      Body: JSON.stringify(result)
    }).promise();
  }

  return { status: 'success' };
};
\`\`\`

### 3. DynamoDB Streams

\`\`\`javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  for (const record of event.Records) {
    const oldImage = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.OldImage || {});
    const newImage = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage || {});

    if (record.eventName === 'INSERT') {
      console.log('New item:', newImage);
      await processNewItem(newImage);
    } else if (record.eventName === 'MODIFY') {
      console.log('Modified:', { old: oldImage, new: newImage });
      await processModification(oldImage, newImage);
    }
  }

  return { recordsProcessed: event.Records.length };
};
\`\`\`

## Lambda 层

### 1. 创建共享层

\`\`\`bash
# 层目录结构
layer/
├── nodejs/
│   └── package.json
└── schema.zip

# package.json
{
  "dependencies": {
    "lodash": "^4.17.21",
    "moment": "^2.29.4",
    "axios": "^1.4.0"
  }
}

# 打包层
cd layer/nodejs
npm install
cd ../..
zip -r schema.zip nodejs

# 发布层
aws lambda publish-layer-version \\
  --layer-name my-shared-layer \\
  --zip-file fileb://schema.zip \\
  --compatible-runtimes nodejs18.x
\`\`\`

## 实战案例：RESTful API

### 用户 API

\`\`\`javascript
// handlers/users.js
const { getUser, listUsers, createUser } = require('../utils/db');

exports.list = async (event) => {
  try {
    const users = await listUsers();
    return {
      statusCode: 200,
      body: JSON.stringify(users)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to list users' })
    };
  }
};

exports.get = async (event) => {
  try {
    const user = await getUser(event.pathParameters.id);
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(user)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get user' })
    };
  }
};

exports.create = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const user = await createUser(data);
    return {
      statusCode: 201,
      body: JSON.stringify(user)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create user' })
    };
  }
};
\`\`\`

## 最佳实践

### 1. 错误处理

\`\`\`javascript
exports.handler = async (event) => {
  try {
    const result = await processEvent(event);
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Error:', error);

    const statusCode = error.name === 'ValidationError' ? 400 : 500;

    return {
      statusCode,
      body: JSON.stringify({
        error: error.message,
        requestId: event.requestContext.requestId
      })
    };
  }
};
\`\`\`

### 2. 幂等性

\`\`\`javascript
const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const ddb = new DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const eventId = event.headers['X-Request-ID'];

  // 检查是否已处理
  const existing = await ddb.get({
    TableName: 'ProcessedEvents',
    Key: { eventId }
  }).promise();

  if (existing.Item) {
    console.log('Event already processed, returning cached result');
    return existing.Item.response;
  }

  // 处理事件
  const result = await processEvent(event);

  // 保存结果
  await ddb.put({
    TableName: 'ProcessedEvents',
    Item: { eventId, response: result }
  }).promise();

  return result;
};
\`\`\`

## 常见问题

### Q: 如何减少冷启动时间？

A: 优化策略：
1. 减小部署包大小（使用层）
2. 在全局作用域初始化连接
3. 预热函数（定时触发）
4. 增加内存分配

### Q: Lambda 函数如何访问 VPC 资源？

A: 配置 VPC 设置：

\`\`\`yaml
functions:
  dbFunction:
    handler: handlers/db.query
    vpc:
      securityGroupIds:
        - sg-123456
      subnetIds:
        - subnet-12345
        - subnet-67890
\`\`\`

## 下一步

- 学习 [Terraform 基础设施](/tutorial/terraform-infrastructure) 管理 AWS 资源
- 探索 [Google Cloud Platform](/tutorial/gcp-development) 了解其他云平台
- 阅读 [可观测性实现](/tutorial/observability-implementation) 了解分布式追踪

## 相关技能

- [AWS Lambda](/skills) - 无服务器计算
- [Terraform](/skills) - 基础设施即代码
- [Serverless Framework](/skills) - Serverless 应用开发`;

// Tutorial 075: GCP
const tutorial075Content = `# Google Cloud Platform 开发实战

Google Cloud Platform (GCP) 是 Google 提供的云计算平台，提供了一系列强大的云服务。本教程将带你了解 GCP 的核心服务和开发实战。

## GCP 概述

### 核心服务

- **Compute Engine**: 虚拟机服务
- **Cloud Functions**: 无服务器函数计算
- **Cloud Run**: 容器化应用部署
- **Firestore**: NoSQL 文档数据库
- **Cloud Storage**: 对象存储服务
- **Pub/Sub**: 消息队列服务

### 设置开发环境

\`\`\`bash
# 安装 Google Cloud SDK
curl https://sdk.cloud.google.com | bash

# 初始化配置
gcloud init

# 设置默认项目
gcloud config set project my-project-id

# 设置默认区域
gcloud config set compute/region us-central1
\`\`\`

## Compute Engine

### 1. 创建虚拟机实例

\`\`\`bash
# 创建实例
gcloud compute instances create my-instance \\
  --zone=us-central1-a \\
  --machine-type=e2-medium \\
  --image-family=ubuntu-2004-lts \\
  --image-project=ubuntu-os-cloud \\
  --boot-disk-size=20GB \\
  --tags=http-server,https-server

# 创建防火墙规则
gcloud compute firewall-rules create allow-http \\
  --allow tcp:80 \\
  --source-ranges 0.0.0.0/0 \\
  --target-tags http-server
\`\`\`

### 2. 使用启动脚本

\`\`\`bash
gcloud compute instances create web-server \\
  --zone=us-central1-a \\
  --image-family=ubuntu-2004-lts \\
  --image-project=ubuntu-os-cloud \\
  --metadata-from-file startup-script=./setup.sh
\`\`\`

\`\`\`bash
# setup.sh
#!/bin/bash
apt-get update
apt-get install -y nginx
ufw allow 'Nginx HTTP'
systemctl start nginx
\`\`\`

## Cloud Functions

### 1. 创建 HTTP 函数

\`\`\`javascript
// index.js
const { escape } = require('querystring');

exports.helloHttp = (req, res) => {
  const name = req.query.name || 'World';

  res.status(200).send(\`Hello \${escape(name)}!\`);
};
\`\`\`

\`\`\`bash
# 部署函数
gcloud functions deploy hello-http \\
  --runtime nodejs18 \\
  --trigger-http \\
  --allow-unauthenticated \\
  --region us-central1
\`\`\`

### 2. 创建事件触发函数

\`\`\`javascript
// Cloud Storage 触发器
exports.processFile = async (event, context) => {
  const file = event;

  console.log(\`Processing file: \${file.name}\`);

  // 读取文件
  const fileBuffer = await downloadFile(file.bucket, file.name);

  // 处理文件
  const result = await processContent(fileBuffer);

  // 保存结果
  await uploadFile(file.bucket, \`processed/\${file.name}\`, result);

  console.log(\`File processed: \${file.name}\`);
};
\`\`\`

## Cloud Run

### 1. 容器化应用

\`\`\`dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

CMD ["node", "server.js"]
\`\`\`

\`\`\`javascript
// server.js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Cloud Run!' });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});
\`\`\`

### 2. 部署到 Cloud Run

\`\`\`bash
# 构建并部署
gcloud run deploy my-service \\
  --source . \\
  --platform managed \\
  --region us-central1 \\
  --allow-unauthenticated

# 设置环境变量
gcloud run services update my-service \\
  --region us-central1 \\
  --set-env-vars DB_HOST=localhost,DB_NAME=mydb
\`\`\`

## Firestore

### 1. 基本操作

\`\`\`javascript
const { Firestore } = require('@google-cloud/firestore');

const db = new Firestore({
  projectId: 'my-project-id'
});

// 添加文档
async function addUser(userData) {
  const docRef = await db.collection('users').add(userData);
  console.log(\`Added document with id: \${docRef.id}\`);
  return docRef.id;
}

// 获取文档
async function getUser(userId) {
  const doc = await db.collection('users').doc(userId).get();

  if (!doc.exists) {
    console.log('No such document!');
    return null;
  }

  return { id: doc.id, ...doc.data() };
}
\`\`\`

### 2. 查询操作

\`\`\`javascript
// 简单查询
async function queryUsersByStatus(status) {
  const snapshot = await db.collection('users')
    .where('status', '==', status)
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// 分页查询
async function queryUsersPaginated(lastDoc, pageSize = 10) {
  let query = db.collection('users')
    .orderBy('name')
    .limit(pageSize);

  if (lastDoc) {
    query = query.startAfter(lastDoc);
  }

  const snapshot = await query.get();
  return {
    users: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    lastDoc: snapshot.docs[snapshot.docs.length - 1]
  };
}
\`\`\`

## Cloud Storage

### 1. 文件操作

\`\`\`javascript
const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: 'my-project-id'
});

const bucket = storage.bucket('my-bucket');

// 上传文件
async function uploadFile(filePath, destination) {
  await bucket.upload(filePath, {
    destination: destination,
    metadata: {
      contentType: 'image/jpeg'
    }
  });
  console.log(\`Uploaded \${filePath} to \${destination}\`);
}

// 下载文件
async function downloadFile(source, destination) {
  await bucket.file(source).download({ destination: destination });
  console.log(\`Downloaded \${source} to \${destination}\`);
}
\`\`\`

## 实战案例：图片处理服务

### 架构

\`\`\`
用户上传 → Cloud Storage → Cloud Functions (thumbnail) → Cloud Storage (thumbnails)
\`\`\`

### 实现代码

\`\`\`javascript
// functions/thumbnail.js
const { Storage } = require('@google-cloud/storage');
const sharp = require('sharp');

const storage = new Storage();
const bucket = storage.bucket('my-bucket');

exports.generateThumbnail = async (event, context) => {
  const file = event;

  if (file.name.startsWith('thumbnails/')) {
    console.log('Skipping thumbnail file');
    return;
  }

  console.log(\`Processing file: \${file.name}\`);

  try {
    // 下载原始文件
    const [fileBuffer] = await bucket.file(file.name).download();

    // 生成缩略图
    const thumbnail = await sharp(fileBuffer)
      .resize(200, 200, { fit: 'cover' })
      .toBuffer();

    // 上传缩略图
    const thumbnailName = \`thumbnails/\${file.name}\`;
    await bucket.file(thumbnailName).save(thumbnail, {
      contentType: 'image/jpeg'
    });

    console.log(\`Thumbnail created: \${thumbnailName}\`);
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    throw error;
  }
};
\`\`\`

## 最佳实践

### 1. 错误处理

\`\`\`javascript
exports.main = async (req, res) => {
  try {
    const result = await processRequest(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error:', error);

    if (error.code === 'NOT_FOUND') {
      res.status(404).json({ error: 'Resource not found' });
    } else if (error.code === 'PERMISSION_DENIED') {
      res.status(403).json({ error: 'Permission denied' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
\`\`\`

### 2. 日志和监控

\`\`\`javascript
const { Logging } = require('@google-cloud/logging');

const logging = new Logging();
const logger = logging.log('my-function');

async function logWithMetadata(message, metadata = {}) {
  const entry = Object.assign({
    severity: 'INFO',
    message: message,
    timestamp: new Date().toISOString()
  }, metadata);

  await logger.write(entry);
}
\`\`\`

## 常见问题

### Q: Cloud Functions 和 Cloud Run 如何选择？

A: 选择指南：
- **Cloud Functions**: 事件驱动、轻量级、快速响应
- **Cloud Run**: 长运行服务、容器化、需要更多控制

### Q: Firestore 和 Realtime Database 如何选择？

A: 选择指南：
- **Firestore**: 新项目、需要复杂查询、自动扩展
- **Realtime Database**: 实时同步、低延迟、简单数据结构

## 下一步

- 学习 [Terraform 基础设施](/tutorial/terraform-infrastructure) 管理云资源
- 探索 [AWS Lambda](/tutorial/aws-lambda-serverless) 对比 AWS 服务
- 阅读 [可观测性实现](/tutorial/observability-implementation) 了解监控实践

## 相关技能

- [GCP](/skills) - Google Cloud Platform
- [Terraform](/skills) - 基础设施即代码
- [Docker](/skills) - 容器化技术`;

// Tutorial 076: Azure
const tutorial076Content = `# Azure 云服务开发实战

Microsoft Azure 是微软提供的云计算平台，提供了一系列强大的云服务。本教程将带你深入了解 Azure 的核心服务和开发实战。

## Azure 概述

### 核心服务

- **App Service**: 托管 Web 应用和 API
- **Azure Functions**: 无服务器计算
- **Cosmos DB**: 全球分布式多模型数据库
- **Blob Storage**: 可扩展的对象存储
- **Service Bus**: 企业消息传递
- **Key Vault**: 安全的密钥管理

### 设置开发环境

\`\`\`bash
# 安装 Azure CLI
# macOS
brew install azure-cli

# Windows
winget install Microsoft.AzureCLI

# 登录 Azure
az login

# 设置默认订阅
az account set --subscription "My Subscription"
\`\`\`

## App Service

### 1. 创建 Web 应用

\`\`\`bash
# 创建 App Service 计划
az appservice plan create \\
  --name my-appservice-plan \\
  --resource-group my-resource-group \\
  --sku B1 \\
  --is-linux

# 创建 Web 应用
az webapp create \\
  --name my-web-app \\
  --resource-group my-resource-group \\
  --plan my-appservice-plan \\
  --runtime "NODE|18-lts"
\`\`\`

### 2. 部署应用

\`\`\`bash
# 使用 ZIP 部署
az webapp deployment source config-zip \\
  --name my-web-app \\
  --resource-group my-resource-group \\
  --src my-app.zip
\`\`\`

### 3. 配置应用设置

\`\`\`bash
# 设置环境变量
az webapp config appsettings set \\
  --name my-web-app \\
  --resource-group my-resource-group \\
  --settings \\
    DB_HOST=localhost \\
    DB_NAME=mydb \\
    NODE_ENV=production
\`\`\`

## Azure Functions

### 1. 创建函数应用

\`\`\`bash
# 创建存储账户
az storage account create \\
  --name mystorageaccount \\
  --location eastus \\
  --resource-group my-resource-group \\
  --sku Standard_LRS

# 创建 Functions 应用
az functionapp create \\
  --name my-function-app \\
  --storage-account mystorageaccount \\
  --resource-group my-resource-group \\
  --consumption-plan-location eastus \\
  --runtime node \\
  --runtime-version 18 \\
  --functions-version 4
\`\`\`

### 2. 创建 HTTP 触发函数

\`\`\`javascript
// src/functions/httpTrigger.js
module.exports = async function (context, req) {
  context.log('HTTP trigger function processed a request.');

  const name = req.query.name || (req.body && req.body.name);

  if (name) {
    context.res = {
      status: 200,
      body: \`Hello \${name}!\`
    };
  } else {
    context.res = {
      status: 400,
      body: "Please pass a name on the query string or in the request body"
    };
  }
};
\`\`\`

### 3. Blob Storage 触发器

\`\`\`javascript
// src/functions/blobTrigger.js
module.exports = async function (context, myBlob) {
  context.log(\`Processing blob: \${context.bindingData.name}\`);

  try {
    // 处理图片
    const processed = await processImage(myBlob);

    // 保存到另一个容器
    const storage = require('@azure/storage-blob');
    const blobServiceClient = storage.BlobServiceClient.fromConnectionString(
      process.env.AzureWebJobsStorage
    );
    const containerClient = blobServiceClient.getContainerClient('processed');
    const blockBlobClient = containerClient.getBlockBlobClient(context.bindingData.name);

    await blockBlobClient.uploadData(processed);

    context.log('Blob processed successfully');
  } catch (error) {
    context.log.error('Error processing blob:', error);
    throw error;
  }
};
\`\`\`

## Cosmos DB

### 1. 基本操作

\`\`\`javascript
const { CosmosClient } = require('@azure/cosmos');

const client = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY
});

const database = client.database('myDatabase');
const container = database.container('myContainer');

// 创建项目
async function createItem(item) {
  const { resource } = await container.items.create(item);
  console.log(\`Created item with id: \${resource.id}\`);
  return resource;
}

// 读取项目
async function getItem(id) {
  const { resource } = await container.item(id).read();
  return resource;
}

// 更新项目
async function updateItem(id, updates) {
  const { resource } = await container.item(id).replace(updates);
  return resource;
}
\`\`\`

### 2. 查询操作

\`\`\`javascript
// 简单查询
async function queryItemsByStatus(status) {
  const querySpec = {
    query: 'SELECT * FROM c WHERE c.status = @status',
    parameters: [
      { name: '@status', value: status }
    ]
  };

  const { resources } = await container.items.query(querySpec).fetchAll();
  return resources;
}

// 复杂查询
async function queryActiveUsers(minAge, lastLogin) {
  const querySpec = {
    query: \`
      SELECT * FROM c
      WHERE c.age >= @minAge
      AND c.lastLogin > @lastLogin
      AND c.status = 'active'
      ORDER BY c.lastLogin DESC
    \`,
    parameters: [
      { name: '@minAge', value: minAge },
      { name: '@lastLogin', value: lastLogin }
    ]
  };

  const { resources } = await container.items.query(querySpec).fetchAll();
  return resources;
}
\`\`\`

## Blob Storage

### 1. 基本操作

\`\`\`javascript
const { BlobServiceClient } = require('@azure/storage-blob');

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

const containerClient = blobServiceClient.getContainerClient('my-container');

// 创建容器
await containerClient.createIfNotExists();

// 上传 Blob
async function uploadBlob(blobName, content) {
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.upload(content, content.length);
  console.log(\`Uploaded blob: \${blobName}\`);
}

// 下载 Blob
async function downloadBlob(blobName) {
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const downloadResponse = await blockBlobClient.download();
  const content = await streamToBuffer(downloadResponse.readableStreamBody);
  return content;
}
\`\`\`

## Service Bus

### 1. 发送消息

\`\`\`javascript
const { ServiceBusClient } = require('@azure/service-bus');

const sbClient = new ServiceBusClient(
  process.env.SERVICE_BUS_CONNECTION_STRING
);

async function sendMessage(queueName, message) {
  const sender = sbClient.createSender(queueName);

  try {
    await sender.sendMessages({
      body: message
    });
    console.log(\`Message sent to \${queueName}\`);
  } finally {
    await sender.close();
  }
}
\`\`\`

### 2. 接收消息

\`\`\`javascript
async function receiveMessages(queueName) {
  const receiver = sbClient.createReceiver(queueName);

  const messageHandler = async (messageReceived) => {
    try {
      const message = messageReceived.body;
      console.log('Received message:', message);

      // 处理消息
      await processMessage(message);

      // 完成消息
      await messageReceived.complete();
    } catch (error) {
      console.error('Error processing message:', error);
      // 放弃消息（将重新投递）
      await messageReceived.abandon();
    }
  };

  // 订阅消息
  const subscription = receiver.subscribeMessages({
    processMessage: messageHandler
  });

  // 等待一段时间后取消订阅
  await new Promise(resolve => setTimeout(resolve, 60000));
  await subscription.close();
  await receiver.close();
}
\`\`\`

## Key Vault

### 1. 存储和读取密钥

\`\`\`javascript
const { SecretClient } = require('@azure/keyvault-secrets');
const { DefaultAzureCredential } = require('@azure/identity');

const credential = new DefaultAzureCredential();
const client = new SecretClient(
  \`https://\${process.env.KEY_VAULT_NAME}.vault.azure.net\`,
  credential
);

// 设置密钥
async function setSecret(secretName, secretValue) {
  await client.setSecret(secretName, secretValue);
  console.log(\`Secret \${secretName} set successfully\`);
}

// 获取密钥
async function getSecret(secretName) {
  const { value } = await client.getSecret(secretName);
  return value;
}
\`\`\`

## 实战案例：API 网关和微服务

### 架构

\`\`\`API Management → Functions (auth) → Functions (business logic)
                              ↓
                        Cosmos DB (数据存储)
\`\`\`

### 实现

\`\`\`javascript
// functions/api/users.js
const { CosmosClient } = require('@azure/cosmos');

const client = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY
});

const container = client.database('myDatabase').container('users');

module.exports = async function (context, req) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return await getUsers(req);
    case 'POST':
      return await createUser(req);
    default:
      return {
        status: 405,
        body: 'Method not allowed'
      };
  }
};

async function getUsers(req) {
  const { id } = req.params;

  if (id) {
    const { resource } = await container.item(id).read();
    return {
      status: 200,
      body: resource || { error: 'User not found' }
    };
  }

  const { resources } = await container.items.readAll().fetchAll();
  return {
    status: 200,
    body: resources
  };
}

async function createUser(req) {
  const user = req.body;
  user.createdAt = new Date().toISOString();

  const { resource } = await container.items.create(user);
  return {
    status: 201,
    body: resource
  };
}
\`\`\`

## 最佳实践

### 1. 配置管理

\`\`\`javascript
// 使用环境变量和 Key Vault
async function getConfig() {
  const credential = new DefaultAzureCredential();
  const client = new SecretClient(
    \`https://\${process.env.KEY_VAULT_NAME}.vault.azure.net\`,
    credential
  );

  const [dbSecret, apiSecret] = await Promise.all([
    client.getSecret('database-connection'),
    client.getSecret('api-key')
  ]);

  return {
    database: dbSecret.value,
    apiKey: apiSecret.value
  };
}
\`\`\`

### 2. 错误处理

\`\`\`javascript
module.exports = async function (context, req) {
  try {
    const result = await processRequest(req);
    return {
      status: 200,
      body: result
    };
  } catch (error) {
    context.log.error('Error:', error);

    return {
      status: error.status || 500,
      body: {
        error: error.message,
        code: error.code
      }
    };
  }
};

class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.status = statusCode;
    this.code = code;
  }
}

// 使用示例
throw new AppError('User not found', 404, 'USER_NOT_FOUND');
\`\`\`

## 常见问题

### Q: App Service 和 Functions 如何选择？

A: 选择指南：
- **App Service**: 长运行 HTTP 服务、需要更多控制
- **Functions**: 事件驱动、短暂任务、按需扩展

### Q: Cosmos DB 选择哪个 API？

A: API 选择指南：
- **Core (SQL)**: 最灵活，类似 MongoDB
- **MongoDB**: MongoDB 兼容层
- **Table**: 键值存储
- **Gremlin**: 图数据库

## 下一步

- 学习 [Terraform 基础设施](/tutorial/terraform-infrastructure) 管理 Azure 资源
- 探索 [AWS Lambda](/tutorial/aws-lambda-serverless) 对比 AWS 服务
- 阅读 [可观测性实现](/tutorial/observability-implementation) 了解监控

## 相关技能

- [Azure CLI](/skills) - Azure 命令行工具
- [Terraform](/skills) - 基础设施即代码
- [Docker](/skills) - 容器化技术`;

// Create the 4 new tutorials for US-099
const newTutorials = [
  {
    id: "tutorial-073",
    title: "Kafka 流处理实战",
    slug: "kafka-stream-processing",
    description: "深入学习 Apache Kafka 的流处理能力，包括 Producer、Consumer、Topic、Partition 以及 Kafka Streams 的实际应用。",
    content: tutorial073Content,
    category: "development",
    tags: ["Kafka", "流处理", "消息队列", "实时数据", "大数据"],
    difficulty: "intermediate",
    readTime: 22,
    author: "OpenClaw Team",
    relatedSkills: ["skill-001", "skill-064", "skill-065"],
    stats: { viewCount: 125 },
    createdAt: now,
    featured: false
  },
  {
    id: "tutorial-074",
    title: "AWS Lambda 无服务器开发",
    slug: "aws-lambda-serverless",
    description: "掌握 AWS Lambda 函数式编程，学习事件驱动架构、触发器配置、层管理和最佳实践。",
    content: tutorial074Content,
    category: "development",
    tags: ["AWS", "Lambda", "Serverless", "云计算", "事件驱动"],
    difficulty: "intermediate",
    readTime: 24,
    author: "OpenClaw Team",
    relatedSkills: ["skill-007", "skill-269", "skill-244"],
    stats: { viewCount: 98 },
    createdAt: now,
    featured: false
  },
  {
    id: "tutorial-075",
    title: "Google Cloud Platform 开发实战",
    slug: "gcp-development",
    description: "学习 Google Cloud Platform 的核心服务，包括 Compute Engine、Cloud Functions、Cloud Run 和 Firestore。",
    content: tutorial075Content,
    category: "development",
    tags: ["GCP", "Google Cloud", "云平台", "Compute Engine", "Cloud Run"],
    difficulty: "intermediate",
    readTime: 26,
    author: "OpenClaw Team",
    relatedSkills: ["skill-127", "skill-129", "skill-269"],
    stats: { viewCount: 85 },
    createdAt: now,
    featured: false
  },
  {
    id: "tutorial-076",
    title: "Azure 云服务开发实战",
    slug: "azure-cloud-services",
    description: "掌握 Microsoft Azure 的核心服务，包括 App Service、Functions、Cosmos DB 和 Blob Storage。",
    content: tutorial076Content,
    category: "development",
    tags: ["Azure", "Microsoft", "云平台", "App Service", "Cosmos DB"],
    difficulty: "intermediate",
    readTime: 25,
    author: "OpenClaw Team",
    relatedSkills: ["skill-136", "skill-269", "skill-012"],
    stats: { viewCount: 92 },
    createdAt: now,
    featured: false
  }
];

// Append new tutorials
tutorials.push(...newTutorials);

// Write back to file
fs.writeFileSync(tutorialsJsonPath, JSON.stringify(tutorials, null, 2), 'utf8');

console.log(`Added ${newTutorials.length} new Intermediate tutorials for US-099:`);
newTutorials.forEach(t => {
  console.log(`  - ${t.id}: ${t.title}`);
});
console.log(`Total tutorials: ${tutorials.length}`);
