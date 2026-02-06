const fs = require('fs');
const path = require('path');

const tutorialsPath = path.join(__dirname, '../src/data/tutorials.json');
const data = JSON.parse(fs.readFileSync(tutorialsPath, 'utf8'));

// New Intermediate tutorials (Batch 7 - US-096)
const newTutorials = [
  {
    id: 'tutorial-065',
    title: 'NestJS 后端开发进阶',
    slug: 'nestjs-backend-development',
    description: '深入学习 NestJS 框架，掌握模块化架构、依赖注入、装饰器、中间件、守卫、拦截器等企业级后端开发核心概念，构建可维护、可测试的 Node.js 应用。',
    content: `# NestJS 后端开发进阶

NestJS 是一个渐进式 Node.js 框架，用于构建高效、可扩展的企业级服务端应用。它结合了 OOP、FP 和 FRP 的元素，使用 TypeScript 构建，完全支持 React 生态系统。

## 为什么选择 NestJS

### 核心优势

- **模块化架构**: 清晰的代码组织，易于维护和扩展
- **依赖注入**: 降低耦合度，提高可测试性
- **TypeScript 原生支持**: 强类型、更好的 IDE 支持
- **完整的企业级功能**: 守卫、拦截器、管道、中间件
- **微服务支持**: 内置微服务通信传输层
- **测试友好**: 内置测试工具和最佳实践

### 架构概览

\`\`\`
src/
├── app.module.ts          # 根模块
├── main.ts                # 应用入口
├── users/
│   ├── users.module.ts    # 用户模块
│   ├── users.controller.ts # 控制器
│   ├── users.service.ts   # 服务
│   ├── users.repository.ts # 数据访问
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   └── entities/
│       └── user.entity.ts
└── common/
    ├── guards/
    ├── interceptors/
    ├── pipes/
    └── filters/
\`\`\`

## 核心概念

### 1. 模块 (Modules)

模块是 NestJS 应用的基本组织单元，每个应用至少有一个根模块。

#### 创建模块

\`\`\`typescript
// users.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // 导出服务供其他模块使用
})
export class UsersModule {}
\`\`\`

#### 全局模块

\`\`\`typescript
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
// 全局模块无需重复导入
\`\`\`

#### 动态模块

\`\`\`typescript
@Module({})
export class ConfigModule {
  static register(options: ConfigOptions): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}

// 使用
@Module({
  imports: [ConfigModule.register({ apiKey: 'xxx' })],
})
export class AppModule {}
\`\`\`

### 2. 控制器 (Controllers)

控制器负责处理传入请求并返回响应。

#### 基础控制器

\`\`\`typescript
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
\`\`\`

#### 请求装饰器

\`\`\`typescript
import {
  Controller, Get, Post, Body, Param, Query,
  Req, Res, Headers, Ip, Session,
  HttpCode, Header, Redirect,
} from '@nestjs/common';

@Controller('demo')
export class DemoController {

  @Get('request')
  handleRequest(
    @Req() req: Request,        // 请求对象
    @Res() res: Response,       // 响应对象
    @Headers('authorization') auth: string,
    @Ip() ip: string,
    @Session() session: Record<string, any>,
  ) {
    console.log('Auth:', auth);
    console.log('IP:', ip);
    return { ip };
  }

  @Get('query')
  handleQuery(@Query('page') page: number = 1) {
    return { page };
  }

  @Post('create')
  @HttpCode(201)              // 自定义状态码
  @Header('X-Custom', 'Value') // 自定义响应头
  create(@Body() dto: CreateDto) {
    return this.demoService.create(dto);
  }

  @Get('redirect')
  @Redirect('https://nestjs.com', 301)
  redirect() {}
}
\`\`\`

#### 路由通配符

\`\`\`typescript
@Controller('users')
export class UsersController {

  @Get('profile/*')
  wildcard(@Param('0') path: string) {
    // 匹配 /users/profile/任意路径
    return { path };
  }
}
\`\`\`

### 3. 提供者 (Providers)

提供者是服务的核心概念，处理业务逻辑。

#### 服务类

\`\`\`typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(\`User \${id} not found\`);
    }
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(dto);
    return this.usersRepository.save(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    this.usersRepository.merge(user, dto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
\`\`\`

#### 自定义提供者

\`\`\`typescript
import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: 'CONNECTION',
      useValue: { connect: () => Promise.resolve() },
    },
    {
      provide: 'ASYNC_CONNECTION',
      useFactory: async () => {
        const connection = await createConnection();
        return connection;
      },
    },
    {
      provide: 'CONFIGURED_CONNECTION',
      useFactory: (options: ConfigOptions) => {
        return createConnection(options);
      },
      inject: ['CONFIG_OPTIONS'],
    },
    {
      provide: 'ALIAS_CONNECTION',
      useClass: ConnectionService,
    },
    {
      provide: ConnectionService,
      useExisting: 'ALIAS_CONNECTION',
    },
  ],
})
export class DatabaseModule {}
\`\`\`

### 4. 依赖注入 (DI)

#### 构造器注入

\`\`\`typescript
@Injectable()
export class UsersService {
  constructor(
    private readonly emailService: EmailService,
    private readonly logger: LoggerService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.usersRepository.save(dto);
    await this.emailService.sendWelcome(user.email);
    this.logger.log('User created:', user.id);
    return user;
  }
}
\`\`\`

#### 作用域

\`\`\`typescript
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class TransientService {
  // 每次注入都创建新实例
}

@Injectable({ scope: Scope.REQUEST })
export class RequestService {
  // 每个请求创建新实例
  constructor(@Inject(REQUEST) private request: Request) {}
}

@Injectable({ scope: Scope.DEFAULT })
export class DefaultService {
  // 单例（默认）
}
\`\`\`

### 5. 中间件 (Middleware)

中间件在路由处理器之前执行。

#### 函数式中间件

\`\`\`typescript
import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(\`\${req.method} \${req.url} - \${new Date().toISOString()}\`);
  next();
}
\`\`\`

#### 类中间件

\`\`\`typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(\`Request...\`);
    next();
  }
}
\`\`\`

#### 应用中间件

\`\`\`typescript
// module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';

@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude('cats') // 排除路径
      .forRoutes('*'); // 应用到所有路由
  }
}
\`\`\`

### 6. 守卫 (Guards)

守卫负责认证和授权。

#### 认证守卫

\`\`\`typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return requiredRoles.some(role => user.roles?.includes(role));
  }
}

// 使用
@Controller('users')
export class UsersController {
  @Get('admin')
  @UseGuards(AuthGuard)
  @Roles('admin')
  adminPanel() {
    return 'Admin panel';
  }
}
\`\`\`

#### JWT 认证

\`\`\`typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}

// app.module.ts
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
})
export class AppModule {}
\`\`\`

### 7. 拦截器 (Interceptors)

拦截器在方法执行前后添加额外逻辑。

#### 日志拦截器

\`\`\`typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => console.log(\`After... \${Date.now() - now}ms\`)),
      );
  }
}

// 全局应用
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
\`\`\`

#### 响应转换

\`\`\`typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
\`\`\`

### 8. 管道 (Pipes)

管道负责数据验证和转换。

#### 验证管道

\`\`\`typescript
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }
}

// 使用 class-validator
import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

// 全局启用
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,    // 移除未定义的属性
    forbidNonWhitelisted: true, // 抛出错误
    transform: true,    // 自动转换类型
  }));
  await app.listen(3000);
}
\`\`\`

#### 参数转换

\`\`\`typescript
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}

// 使用
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.usersService.findOne(id);
}
\`\`\`

## 数据库集成

### TypeORM 集成

\`\`\`typescript
// app.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'pass',
      database: 'db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // 生产环境应设为 false
    }),
  ],
})
export class AppModule {}

// entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}

// module.ts
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  // ...
})
\`\`\`

### Mongoose 集成

\`\`\`typescript
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
  ],
})
export class AppModule {}

// schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// module.ts
@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
})
\`\`\`

## 高级功能

### 任务调度

\`\`\`typescript
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  @Cron(CronExpression.EVERY_HOUR)
  handleCron() {
    console.log('Task executed every hour');
  }

  @Cron('0 0 * * *') // 每天午夜
  handleMidnightTask() {
    console.log('Midnight task');
  }

  @Timeout(5000) // 启动后 5 秒执行
  handleTimeout() {
    console.log('One-time task');
  }
}

// app.module.ts
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
})
export class AppModule {}
\`\`\`

### 队列处理

\`\`\`typescript
import { BullModule } from '@nestjs/bull';
import { Processor, Process } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
})
export class AppModule {}

@Processor('email')
export class EmailProcessor {
  @Process('send')
  async handleSend(job: Job) {
    console.log('Sending email:', job.data);
    // 发送邮件逻辑
  }
}
\`\`\`

### WebSocket

\`\`\`typescript
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): void {
    this.server.emit('message', data);
  }

  broadcastToAll(event: string, data: any) {
    this.server.emit(event, data);
  }
}
\`\`\`

## 测试

### 单元测试

\`\`\`typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({ id: '1' }),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return users array', async () => {
    expect(await controller.findAll()).toEqual([]);
  });
});
\`\`\`

### E2E 测试

\`\`\`typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect([]);
  });

  afterAll(async () => {
    await app.close();
  });
});
\`\`\`

## 部署

### 生产配置

\`\`\`typescript
// main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局前缀
  app.setGlobalPrefix('api/v1');

  // 验证管道
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL,
  });

  // Swagger 文档
  const config = new DocumentBuilder()
    .setTitle('API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
\`\`\`

## 最佳实践

1. **使用 DTO 验证**: 所有输入数据都应经过验证
2. **关注点分离**: 控制器处理请求，服务处理业务逻辑
3. **使用模块组织代码**: 按功能模块划分代码
4. **依赖注入**: 通过构造器注入依赖
5. **错误处理**: 使用内置异常或创建自定义异常
6. **编写测试**: 单元测试和 E2E 测试
7. **使用环境变量**: 配置敏感信息

## 相关技能

- [TypeScript](/skills) - TypeScript 核心
- [Node.js](/skills) - Node.js 开发
- [Docker](/skills) - 容器化部署
- [PostgreSQL](/skills) - 数据库

## 参考资源

- [NestJS 官方文档](https://docs.nestjs.com/)
- [NestJS GitHub](https://github.com/nestjs/nest)
- [TypeORM 文档](https://typeorm.io/)
- [Passport.js 认证](https://passportjs.org/)
`,
    category: 'development',
    tags: ['nestjs', 'typescript', 'backend', 'nodejs', 'architecture'],
    difficulty: 'intermediate',
    readTime: 20,
    author: 'OpenClaw Team',
    relatedSkills: ['skill-020', 'skill-021', 'skill-047'],
    stats: { viewCount: 0 },
    createdAt: '2026-02-06T00:00:00Z',
    featured: false
  },
  {
    id: 'tutorial-066',
    title: 'Next.js 全栈开发实战',
    slug: 'nextjs-fullstack-development',
    description: '掌握 Next.js 14+ 的 App Router、服务端组件、服务端操作、路由处理、数据获取策略等全栈开发技术，构建高性能的 Web 应用。',
    content: `# Next.js 全栈开发实战

Next.js 是一个功能强大的 React 框架，提供了开箱即用的服务端渲染、静态生成、API 路由等功能，让全栈开发变得简单高效。

## Next.js 14+ 核心特性

### App Router vs Pages Router

Next.js 13+ 引入了新的 **App Router**（基于 React Server Components），与传统的 **Pages Router** 相比：

| 特性 | App Router | Pages Router |
|------|-----------|--------------|
| 文件位置 | app/ | pages/ |
| 默认组件类型 | 服务端组件 | 客户端组件 |
| 布局 | 嵌套布局 | 单一 _app.js |
| 数据获取 | async/await | getServerSideProps |
| 特殊文件 | loading.tsx, error.tsx, not-found.tsx | _error.js, _document.js |

### 项目结构

\`\`\`
app/
├── layout.tsx           # 根布局
├── page.tsx             # 首页
├── loading.tsx          # 加载状态
├── error.tsx            # 错误处理
├── not-found.tsx        # 404 页面
├── globals.css          # 全局样式
├── api/                 # API 路由
│   └── users/
│       └── route.ts
├── blog/                # 路由组
│   ├── layout.tsx
│   ├── page.tsx
│   └── [slug]/         # 动态路由
│       └── page.tsx
├── (marketing)/        # 路由组（不影响 URL）
│   └── about/
│       └── page.tsx
└── auth/               # 路由组
    └── login/
        └── page.tsx
\`\`\`

## 服务端组件

### 默认行为

在 App Router 中，所有组件默认都是**服务端组件**：

\`\`\`typescript
// app/users/page.tsx
async function getUsers() {
  const res = await fetch('https://api.example.com/users');
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
\`\`\`

### 服务端组件限制

服务端组件无法使用：
- React hooks（useState, useEffect 等）
- 事件处理器（onClick, onChange 等）
- 浏览器 API（window, document 等）

### 客户端组件

需要交互时使用 \`'use client'\` 指令：

\`\`\`typescript
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
\`\`\`

### 组合使用

将组件拆分为服务端和客户端部分：

\`\`\`typescript
// app/users/page.tsx (服务端组件)
import { UserList } from './user-list';
import { UserFilters } from './user-filters';

export default async function UsersPage() {
  const users = await fetchUsers();

  return (
    <div>
      <UserFilters /> {/* 客户端组件 */}
      <UserList users={users} /> {/* 客户端组件，接收 props */}
    </div>
  );
}

// components/user-list.tsx ('use client')
'use client';

export function UserList({ users }: { users: User[] }) {
  return <ul>{users.map(...)}</ul>;
}
\`\`\`

## 路由和导航

### 动态路由

\`\`\`typescript
// app/blog/[slug]/page.tsx
export default async function BlogPost({ params }: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug);

  return <article>{post.content}</article>;
}
\`\`\`

### 捕获所有路由

\`\`\`typescript
// app/docs/[...slug]/page.tsx
// 匹配 /docs/a, /docs/a/b, /docs/a/b/c 等
export default async function DocsPage({ params }: {
  params: { slug: string[] }
}) {
  return <div>Path: {params.slug.join('/')}</div>;
}
\`\`\`

### 路由组

使用括号 \`()\` 创建不影响 URL 的路由组：

\`\`\`
app/
├── (marketing)/
│   ├── about/page.tsx     -> /about
│   └── contact/page.tsx   -> /contact
├── (dashboard)/
│   ├── layout.tsx         # 共享布局
│   ├── analytics/page.tsx -> /dashboard/analytics
│   └── settings/page.tsx  -> /dashboard/settings
\`\`\`

### 并行路由

\`\`\`typescript
// app/@dashboard/page.tsx
// app/@analytics/page.tsx
// 两个插槽独立渲染
\`\`\`

### 导航

\`\`\`typescript
'use client';

import { useRouter, usePathname } from 'next/navigation';

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <button onClick={() => router.push('/about')}>
        About
      </button>
      <button onClick={() => router.replace('/about')}>
        Replace (不添加历史记录)
      </button>
      <button onClick={() => router.back()}>
        Back
      </button>
      <button onClick={() => router.refresh()}>
        Refresh (刷新服务器数据)
      </button>
    </>
  );
}
\`\`\`

## 数据获取

### 服务端数据获取

\`\`\`typescript
// app/users/page.tsx
async function getUsers() {
  const res = await fetch('https://api.example.com/users', {
    cache: 'no-store', // 禁用缓存
    // next: { revalidate: 60 } // 60秒重新验证
  });
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();
  return <div>{/* ... */}</div>;
}
\`\`\`

### 静态生成

\`\`\`typescript
// 默认是静态生成
export default async function StaticPage() {
  const data = await fetchData();
  return <div>{data}</div>;
}
\`\`\`

### 增量静态再生成 (ISR)

\`\`\`typescript
export const revalidate = 60; // 每 60 秒重新生成

export default async function ISRPage() {
  const data = await fetchData();
  return <div>{data}</div>;
}
\`\`\`

### 按需再生成

\`\`\`typescript
import { revalidatePath } from 'next/cache';

// API 路由
export async function POST() {
  await updateData();
  revalidatePath('/blog'); // 立即重新生成
  return Response.json({ success: true });
}
\`\`\`

### 动态参数生成

\`\`\`typescript
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);
  return <article>{post.content}</article>;
}
\`\`\`

## 特殊文件

### layout.tsx - 布局

\`\`\`typescript
// app/layout.tsx
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

// app/dashboard/layout.tsx (嵌套布局)
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
\`\`\`

### loading.tsx - 加载状态

\`\`\`typescript
// app/users/loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 w-1/2"></div>
    </div>
  );
}
\`\`\`

### error.tsx - 错误处理

\`\`\`typescript
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
\`\`\`

### not-found.tsx - 404 页面

\`\`\`typescript
// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>Page not found</h2>
      <a href="/">Go home</a>
    </div>
  );
}
\`\`\`

## API 路由

### 路由处理器

\`\`\`typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  const users = await getUsers(query);
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const user = await createUser(body);
  return NextResponse.json(user, { status: 201 });
}
\`\`\`

### 动态 API 路由

\`\`\`typescript
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser(params.id);
  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(user);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const user = await updateUser(params.id, body);
  return NextResponse.json(user);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await deleteUser(params.id);
  return new NextResponse(null, { status: 204 });
}
\`\`\`

### 请求体

\`\`\`typescript
export async function POST(request: NextRequest) {
  // JSON
  const json = await request.json();

  // 文本
  const text = await request.text();

  // 表单
  const formData = await request.formData();
  const name = formData.get('name');

  // Array Buffer
  const buffer = await request.arrayBuffer();
}
\`\`\`

## 服务端操作

### 定义操作

\`\`\`typescript
// app/actions/users.ts
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const UserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
});

export async function createUser(formData: FormData) {
  const validated = UserSchema.parse({
    name: formData.get('name'),
    email: formData.get('email'),
  });

  await db.users.create({ data: validated });
  revalidatePath('/users');
}
\`\`\`

### 使用操作

\`\`\`typescript
'use client';

import { createUser } from '@/app/actions/users';

export function CreateUserForm() {
  return (
    <form action={createUser}>
      <input name="name" type="text" required />
      <input name="email" type="email" required />
      <button type="submit">Create</button>
    </form>
  );
}
\`\`\`

### 带状态的操作

\`\`\`typescript
'use client';

import { useFormState } from 'react-dom';
import { createUser } from '@/app/actions/users';

const initialState = {
  message: '',
};

export function CreateUserForm() {
  const [state, formAction] = useFormState(createUser, initialState);

  return (
    <form action={formAction}>
      <input name="name" type="text" required />
      <p>{state.message}</p>
      <button type="submit">Create</button>
    </form>
  );
}
\`\`\`

## 认证和授权

### NextAuth.js

\`\`\`typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
\`\`\`

### 使用会话

\`\`\`typescript
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (session) {
    return (
      <>
        <p>Signed in as {session.user?.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return <button onClick={() => signIn()}>Sign in</button>;
}
\`\`\`

### 中间件保护

\`\`\`typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: ['/dashboard/:path*'],
};
\`\`\`

## 性能优化

### 图片优化

\`\`\`typescript
import Image from 'next/image';

export function ProfileImage() {
  return (
    <Image
      src="/profile.jpg"
      alt="Profile"
      width={500}
      height={500}
      priority // 首屏图片优先加载
      placeholder="blur" // 模糊占位符
    />
  );
}
\`\`\`

### 字体优化

\`\`\`typescript
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
\`\`\`

### 代码分割

\`\`\`typescript
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(
  () => import('@/components/heavy-component'),
  {
    loading: () => <p>Loading...</p>,
    ssr: false, // 仅客户端渲染
  }
);

export default function Page() {
  return <DynamicComponent />;
}
\`\`\`

## 部署

### Vercel 部署

\`\`\`bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel

# 生产环境
vercel --prod
\`\`\`

### 环境变量

\`\`\`
# .env.local
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
\`\`\`

## 最佳实践

1. **使用服务端组件**: 默认使用服务端组件，减少客户端 JavaScript
2. **合理使用缓存**: 利用 \`cache\` 选项和 \`revalidate\`
3. **流式渲染**: 使用 \`loading.tsx\` 提供即时反馈
4. **类型安全**: 使用 TypeScript，为 API 路由定义类型
5. **错误处理**: 实现 \`error.tsx\` 处理错误
6. **图片优化**: 始终使用 Next.js Image 组件
7. **SEO 优化**: 使用 \`metadata\` API

## 相关技能

- [React](/skills) - React 框架
- [TypeScript](/skills) - TypeScript
- [Tailwind CSS](/skills) - 样式
- [Vercel](/skills) - 部署

## 参考资源

- [Next.js 官方文档](https://nextjs.org/docs)
- [Next.js GitHub](https://github.com/vercel/next.js)
- [Next.js Learn](https://nextjs.org/learn)
`,
    category: 'development',
    tags: ['nextjs', 'react', 'fullstack', 'ssr', 'frontend'],
    difficulty: 'intermediate',
    readTime: 18,
    author: 'OpenClaw Team',
    relatedSkills: ['skill-022', 'skill-047', 'skill-048'],
    stats: { viewCount: 0 },
    createdAt: '2026-02-06T00:00:00Z',
    featured: false
  },
  {
    id: 'tutorial-067',
    title: 'React 性能优化深入',
    slug: 'react-performance-optimization',
    description: '深入学习 React 性能优化技术，掌握组件重渲染优化、memo、useMemo、useCallback、代码分割、虚拟列表等核心技术。',
    content: `# React 性能优化深入

React 应用性能优化是构建高质量用户体验的关键。本教程将系统性地介绍 React 性能优化的各种技术和最佳实践。

## 理解 React 渲染

### 渲染过程

React 的渲染分为两个阶段：

1. **Render (渲染)**: 计算组件树的变化
2. **Commit (提交)**: 将变化应用到 DOM

\`\`\`typescript
// 默认行为：父组件渲染，所有子组件都会重新渲染
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ExpensiveChild /> {/* 每次都会重新渲染 */}
    </div>
  );
}
\`\`\`

### 检测不必要的渲染

使用 React DevTools Profiler：

1. 安装 React DevTools 浏览器扩展
2. 点击 "Profiler" 标签
3. 点击 "Record" 开始录制
4. 执行操作
5. 停止录制，查看渲染图

### 手动检测渲染

\`\`\`typescript
function MyComponent() {
  console.log('Rendering: MyComponent');

  const [state, setState] = useState(0);

  return <div onClick={() => setState(state + 1)}>{state}</div>;
}
\`\`\`

## 组件优化

### React.memo

使用 \`React.memo\` 跳过不必要的重渲染：

\`\`\`typescript
import { memo } from 'react';

// 没有优化
function ExpensiveComponent({ data }: { data: DataType }) {
  console.log('ExpensiveComponent rendered');
  return <div>{/* 复杂渲染 */}</div>;
}

// 使用 memo
const MemoizedComponent = memo(function ExpensiveComponent({ data }: { data: DataType }) {
  console.log('ExpensiveComponent rendered');
  return <div>{/* 复杂渲染 */}</div>;
});

// 自定义比较函数
const CustomMemoComponent = memo(
  function ExpensiveComponent({ data }: { data: DataType }) {
    return <div>{/* 复杂渲染 */}</div>;
  },
  (prevProps, nextProps) => {
    // 返回 true 表示 props 相等，不需要重新渲染
    return prevProps.data.id === nextProps.data.id;
  }
);
\`\`\`

### 注意事项

\`\`\`typescript
// ❌ 错误：每次都创建新函数
function Parent() {
  const handleClick = () => console.log('clicked');
  return <Child onClick={handleClick} />;
}

// ✅ 正确：使用 useCallback 或 useMemo
function Parent() {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []); // 依赖为空，函数只创建一次

  const handleClick2 = useMemo(() => {
    return () => console.log('clicked');
  }, []);

  return <Child onClick={handleClick} />;
}

// ✅ 如果函数依赖 props
function Parent({ userId }: { userId: string }) {
  const handleClick = useCallback(() => {
    console.log('User:', userId);
  }, [userId]); // userId 变化时重新创建函数

  return <Child onClick={handleClick} />;
}
\`\`\`

## Hook 优化

### useMemo

缓存计算结果：

\`\`\`typescript
import { useMemo } from 'react';

function ProductList({ products, filter }: { products: Product[], filter: string }) {
  // ❌ 每次渲染都重新计算
  // const filtered = products.filter(p => p.name.includes(filter));

  // ✅ 只在 products 或 filter 变化时重新计算
  const filtered = useMemo(() => {
    console.log('Filtering products...');
    return products.filter(p => p.name.includes(filter));
  }, [products, filter]);

  return (
    <ul>
      {filtered.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}
\`\`\`

### 何时使用 useMemo

1. **计算成本高**: 过滤、排序大型数组
2. **引用稳定性**: 作为其他 Hook 的依赖

\`\`\`typescript
// 引用稳定性示例
function DataTable({ data }: { data: DataType[] }) {
  const sortedData = useMemo(() => {
    return data.sort((a, b) => a.value - b.value);
  }, [data]);

  // 因为 sortedData 引用稳定，这个 useEffect 只在 sortedData 真正变化时执行
  useEffect(() => {
    console.log('Data sorted:', sortedData);
  }, [sortedData]);

  return <Table data={sortedData} />;
}
\`\`\`

### useCallback

缓存函数引用：

\`\`\`typescript
import { useCallback } from 'react';

function Parent() {
  const [count, setCount] = useState(0);

  // ❌ 每次渲染都创建新函数
  // const handleClick = () => setCount(count + 1);

  // ✅ 函数引用稳定
  const handleClick = useCallback(() => {
    setCount(c => c + 1); // 使用函数式更新，不依赖 count
  }, []);

  // ❌ 依赖 count，每次 count 变化都创建新函数
  // const handleClick = useCallback(() => {
  //   setCount(count + 1);
  // }, [count]);

  return <Child onClick={handleClick} />;
}
\`\`\`

### 实际应用场景

\`\`\`typescript
// 表单提交
function UserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = useCallback(() => {
    api.createUser({ name, email });
  }, [name, email]);

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}

// 事件处理器优化
function TodoList({ todos, onToggle }: { todos: Todo[], onToggle: (id: number) => void }) {
  const handleToggle = useCallback((id: number) => {
    onToggle(id);
  }, [onToggle]);

  return (
    <ul>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
        />
      ))}
    </ul>
  );
}

const TodoItem = memo(function TodoItem({
  todo,
  onToggle
}: {
  todo: Todo;
  onToggle: (id: number) => void;
}) {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
      />
      {todo.text}
    </li>
  );
});
\`\`\`

## 代码分割

### 动态导入

使用 \`React.lazy\` 和 \`Suspense\` 实现代码分割：

\`\`\`typescript
import { lazy, Suspense } from 'react';

// 懒加载组件
const HeavyComponent = lazy(() => import('./HeavyComponent'));
const Dashboard = lazy(() => import('./Dashboard'));
const AdminPanel = lazy(() => import('./AdminPanel'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Suspense>
  );
}

// 条件加载
function UserProfile({ hasPremium }: { hasPremium: boolean }) {
  return (
    <div>
      <h1>Profile</h1>
      <Suspense fallback={<div>Loading premium features...</div>}>
        {hasPremium && <PremiumFeatures />}
      </Suspense>
    </div>
  );
}

const PremiumFeatures = lazy(() => import('./PremiumFeatures'));
\`\`\`

### 基于路由的分割

\`\`\`typescript
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}
\`\`\`

### 错误边界

\`\`\`typescript
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}

// 使用
function App() {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <Suspense fallback={<Loading />}>
        <LazyComponent />
      </Suspense>
    </ErrorBoundary>
  );
}
\`\`\`

## 列表优化

### 虚拟列表

对于长列表，使用虚拟滚动只渲染可见项：

\`\`\`bash
npm install react-window react-window-infinite-loader
\`\`\`

\`\`\`typescript
import { FixedSizeList } from 'react-window';

function VirtualList({ items }: { items: Item[] }) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
\`\`\`

### 无限滚动

\`\`\`typescript
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

function InfiniteList({ hasNextPage, loadMoreItems, items }: InfiniteListProps) {
  const isItemLoaded = (index: number) => !!items[index];

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={hasNextPage ? items.length + 1 : items.length}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeList
          ref={ref}
          height={600}
          itemCount={items.length}
          itemSize={50}
          onItemsRendered={onItemsRendered}
          width="100%"
        >
          {({ index, style }) => (
            <div style={style}>
              {items[index]?.name || 'Loading...'}
            </div>
          )}
        </FixedSizeList>
      )}
    </InfiniteLoader>
  );
}
\`\`\`

### 列表渲染优化

\`\`\`typescript
// ❌ 避免：使用 index 作为 key（列表会重排时）
function List({ items }: { items: Item[] }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item.name}</li> // 不稳定的 key
      ))}
    </ul>
  );
}

// ✅ 正确：使用稳定的唯一标识
function List({ items }: { items: Item[] }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li> // 稳定的 key
      ))}
    </ul>
  );
}

// ✅ 复杂项使用 memo
const ListItem = memo(function ListItem({ item }: { item: Item }) {
  return (
    <li>
      <span>{item.name}</span>
      <button onClick={() => onToggle(item.id)}>Toggle</button>
    </li>
  );
});
\`\`\`

## 状态管理优化

### Context 优化

\`\`\`typescript
// ❌ 问题：任何状态变化都会导致所有消费者重新渲染
const AppContext = createContext<AppContextType | null>(null);

function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);

  return (
    <AppContext.Provider value={{ user, setUser, theme, setTheme, notifications, setNotifications }}>
      {children}
    </AppContext.Provider>
  );
}

// ✅ 解决：拆分 Context
const UserContext = createContext<UserContextType | null>(null);
const ThemeContext = createContext<ThemeContextType | null>(null);
const NotificationContext = createContext<NotificationContextType | null>(null);

function AppProviders({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <ThemeProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </ThemeProvider>
    </UserProvider>
  );
}

// 组件只订阅需要的 Context
function ThemeButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  // 只有主题变化时才重新渲染
  return <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
    Toggle Theme
  </button>;
}
\`\`\`

### 状态派生

\`\`\`typescript
// ❌ 冗余状态
function UserProfile() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.name);
      setIsAdmin(user.role === 'admin');
    }
  }, [user]);

  return <div>{displayName} {isAdmin && '(Admin)'}</div>;
}

// ✅ 派生状态
function UserProfile() {
  const [user, setUser] = useState(null);

  const displayName = user?.name || '';
  const isAdmin = user?.role === 'admin';

  return <div>{displayName} {isAdmin && '(Admin)'}</div>;
}
\`\`\`

## 其他优化技术

### 防抖和节流

\`\`\`typescript
import { useCallback, useState } from 'react';
import { debounce } from 'lodash';

function SearchInput() {
  const [query, setQuery] = useState('');

  // 防抖：延迟执行
  const debouncedSearch = useCallback(
    debounce((q: string) => {
      searchAPI(q);
    }, 500),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return <input type="text" value={query} onChange={handleChange} />;
}

// 节流：限制执行频率
import { throttle } from 'lodash';

function ScrollComponent() {
  const handleScroll = useCallback(
    throttle(() => {
      console.log('Scroll position:', window.scrollY);
    }, 100),
    []
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return <div>{/* 内容 */}</div>;
}
\`\`\`

### CSS-in-JS 优化

\`\`\`typescript
// styled-components
import styled, { CSSProp } from 'styled-components';

// ❌ 每次渲染创建新样式对象
function Button({ variant }: { variant: 'primary' | 'secondary' }) {
  const style: CSSProp = {
    padding: variant === 'primary' ? '10px' : '8px',
  };
  return <StyledButton style={style}>Click</StyledButton>;
}

// ✅ 使用 styled 组件避免动态样式
const PrimaryButton = styled(StyledButton)\`
  padding: 10px;
\`;

const SecondaryButton = styled(StyledButton)\`
  padding: 8px;
\`;

function Button({ variant }: { variant: 'primary' | 'secondary' }) {
  return variant === 'primary' ? <PrimaryButton /> : <SecondaryButton />;
}
\`\`\`

## 性能监测

### React DevTools Profiler

\`\`\`typescript
// 标记性能分析区域
import { Profiler, ProfilerOnRenderCallback } from 'react';

const onRenderCallback: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) => {
  console.log({
    id,
    phase,
    actualDuration,
    baseDuration,
  });
};

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Navigation />
      <MainContent />
    </Profiler>
  );
}
\`\`\`

### 自定义性能监测

\`\`\`typescript
import { useEffect, useRef } from 'react';

function useRenderCount(componentName: string) {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    console.log(\`\${componentName} rendered \${renderCount.current} times\`);
  });
}

function MyComponent() {
  useRenderCount('MyComponent');
  return <div>Content</div>;
}
\`\`\`

## 优化检查清单

### 组件层面
- [ ] 使用 \`React.memo\` 包装纯展示组件
- [ ] 使用 \`useCallback\` 缓存传递给子组件的函数
- [ ] 使用 \`useMemo\` 缓存昂贵计算
- [ ] 确保列表使用稳定的 key
- [ ] 避免在 JSX 中创建对象/函数

### 应用层面
- [ ] 实现代码分割（路由、组件）
- [ ] 使用虚拟列表处理长列表
- [ ] 优化 Context 拆分
- [ ] 使用防抖/节流处理频繁事件
- [ ] 实现图片懒加载

### 开发实践
- [ ] 使用 React DevTools Profiler 分析性能
- [ ] 避免过早优化
- [ ] 测量真实用户性能
- [ ] 定期审查依赖项

## 相关技能

- [React](/skills) - React 核心
- [TypeScript](/skills) - TypeScript
- [Vite](/skills) - 构建工具

## 参考资源

- [React Profiler API](https://react.dev/reference/react/Profiler)
- [React 性能优化](https://react.dev/learn/render-and-commit)
- [react-window 文档](https://github.com/bvaughn/react-window)
`,
    category: 'development',
    tags: ['react', 'performance', 'optimization', 'frontend'],
    difficulty: 'intermediate',
    readTime: 16,
    author: 'OpenClaw Team',
    relatedSkills: ['skill-022', 'skill-047', 'skill-048'],
    stats: { viewCount: 0 },
    createdAt: '2026-02-06T00:00:00Z',
    featured: false
  },
  {
    id: 'tutorial-068',
    title: 'Vue.js 组件开发实战',
    slug: 'vuejs-component-development',
    description: '深入学习 Vue.js 3 的 Composition API、响应式系统、组件通信、状态管理、生命周期等核心技术，构建可维护的 Vue 应用。',
    content: `# Vue.js 组件开发实战

Vue.js 3 带来了全新的 Composition API、更好的 TypeScript 支持、更小的包体积和更高的性能。本教程将深入学习 Vue.js 组件开发的核心技术。

## Vue 3 核心特性

### Composition API vs Options API

Vue 3 提供了两种组件编写方式：

\`\`\`typescript
// Options API (Vue 2 风格)
export default {
  data() {
    return {
      count: 0,
      message: 'Hello'
    };
  },
  computed: {
    doubled() {
      return this.count * 2;
    }
  },
  methods: {
    increment() {
      this.count++;
    }
  },
  mounted() {
    console.log('Component mounted');
  }
}

// Composition API (Vue 3 推荐)
import { ref, computed, onMounted } from 'vue';

export default {
  setup() {
    const count = ref(0);
    const message = ref('Hello');

    const doubled = computed(() => count.value * 2);

    const increment = () => {
      count.value++;
    };

    onMounted(() => {
      console.log('Component mounted');
    });

    return {
      count,
      message,
      doubled,
      increment
    };
  }
}

// \`<script setup>\` 语法糖（最简洁）
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const count = ref(0);
const message = ref('Hello');

const doubled = computed(() => count.value * 2);

const increment = () => {
  count.value++;
};

onMounted(() => {
  console.log('Component mounted');
});
</script>
\`\`\`

## 响应式系统

### ref vs reactive

\`\`\`typescript
import { ref, reactive } from 'vue';

// ref: 用于基本类型，需要 .value 访问
const count = ref(0);
console.log(count.value); // 0
count.value++;

// reactive: 用于对象，直接访问
const state = reactive({
  count: 0,
  message: 'Hello'
});
console.log(state.count); // 0
state.count++;

// ref 解包（在模板中自动）
<template>
  <div>{{ count }}</div> <!-- 不需要 .value -->
  <button @click="count++">Increment</button>
</template>

// reactive 的限制
const state = reactive({ count: 0 });
let count = state.count; // 失去响应性
count++; // 不会触发更新

// 解决：使用 toRefs
import { toRefs } from 'vue';

function useFeature() {
  const state = reactive({
    count: 0,
    message: 'Hello'
  });

  return toRefs(state); // 保持响应性
}

const { count, message } = useFeature();
count.value++; // 保持响应性
\`\`\`

### computed 计算属性

\`\`\`typescript
import { ref, computed } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

// 只读计算属性
const fullName = computed(() => \`\${firstName.value} \${lastName.value}\`);

// 可写计算属性
const fullName = computed({
  get() {
    return \`\${firstName.value} \${lastName.value}\`;
  },
  set(value) {
    [firstName.value, lastName.value] = value.split(' ');
  }
});

fullName.value = 'Jane Smith';
console.log(firstName.value); // Jane
console.log(lastName.value); // Smith
\`\`\`

### watch 和 watchEffect

\`\`\`typescript
import { ref, watch, watchEffect } from 'vue';

const count = ref(0);
const message = ref('Hello');

// watch: 明确指定依赖
watch(count, (newValue, oldValue) => {
  console.log(\`count changed from \${oldValue} to \${newValue}\`);
});

// 监听多个源
watch([count, message], ([newCount, newMessage], [oldCount, oldMessage]) => {
  console.log('count or message changed');
});

// 深度监听对象
const state = reactive({ user: { name: 'John' } });
watch(
  () => state.user,
  (newValue) => {
    console.log('user changed:', newValue);
  },
  { deep: true } // 深度监听
);

// watchEffect: 自动追踪依赖
watchEffect(() => {
  console.log(\`Count is \${count.value} and message is \${message.value}\`);
});

// watchPostEffect: DOM 更新后执行
watchPostEffect(() => {
  console.log('DOM updated');
});

// watchSyncEffect: 同步执行
watchSyncEffect(() => {
  console.log('Sync effect');
});

// 立即执行
watch(count, (val) => {
  console.log(val);
}, { immediate: true });

// 一次性监听
watch(count, (val) => {
  console.log(val);
}, { once: true });
\`\`\`

## 组件通信

### Props 和 Emits

\`\`\`typescript
// 父组件
<script setup lang="ts">
import ChildComponent from './ChildComponent.vue';

const message = ref('Hello from parent');
const count = ref(0);

const handleChildEvent = (data: string) => {
  console.log('Received from child:', data);
};
</script>

<template>
  <ChildComponent
    :message="message"
    :count="count"
    @update="handleChildEvent"
  />
</template>

// 子组件 ChildComponent.vue
<script setup lang="ts">
// 定义 props
interface Props {
  message: string;
  count?: number; // 可选
}

const props = withDefaults(defineProps<Props>(), {
  count: 0 // 默认值
});

// 定义 emits
interface Emits {
  (e: 'update', data: string): void;
  (e: 'delete', id: number): void;
}

const emit = defineEmits<Emits>();

// 发送事件
const sendToParent = () => {
  emit('update', 'Hello from child');
};
</script>

<template>
  <div>
    <p>{{ message }}</p>
    <p>Count: {{ count }}</p>
    <button @click="sendToParent">Send to Parent</button>
  </div>
</template>
\`\`\`

### v-model 双向绑定

\`\`\`typescript
// 父组件
<script setup lang="ts">
import ChildComponent from './ChildComponent.vue';

const message = ref('Hello');
const count = ref(0);
</script>

<template>
  <ChildComponent v-model:message="message" v-model:count="count" />
  <p>Parent: {{ message }}</p>
</template>

// 子组件
<script setup lang="ts">
interface Props {
  message: string;
  count: number;
}

interface Emits {
  (e: 'update:message', value: string): void;
  (e: 'update:count', value: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 使用计算属性实现双向绑定
const messageValue = computed({
  get() {
    return props.message;
  },
  set(value) {
    emit('update:message', value);
  }
});
</script>

<template>
  <input v-model="messageValue" />
  <input :value="count" @input="emit('update:count', Number($event.target.value))" />
</template>
\`\`\`

### Provide / Inject

\`\`\`typescript
// 祖先组件
<script setup lang="ts">
import { provide, ref, readonly } from 'vue';

const theme = ref('light');
const user = ref({ name: 'John' });

// 提供数据
provide('theme', readonly(theme)); // 只读，防止子组件修改
provide('user', readonly(user));

// 提供更新方法
provide('updateTheme', (newTheme: string) => {
  theme.value = newTheme;
});
</script>

// 后代组件
<script setup lang="ts">
import { inject } from 'vue';

// 注入数据
const theme = inject<string>('theme', 'light'); // 默认值
const user = inject<{ name: string }>('user');

// 注入方法
const updateTheme = inject<(theme: string) => void>('updateTheme');
</script>

<template>
  <div :class="theme">
    <p>{{ user?.name }}</p>
    <button @click="updateTheme?.('dark')">Toggle Theme</button>
  </div>
</template>

// 使用 Symbol 作为 key（推荐）
import { provide, inject } from 'vue';

const ThemeKey = Symbol('theme');

// 祖先
provide(ThemeKey, ref('light'));

// 后代
const theme = inject<Ref<string>>(ThemeKey)!;
\`\`\`

### 插槽

\`\`\`vue
// 基础插槽
<!-- BaseLayout.vue -->
<template>
  <div class="layout">
    <header>
      <slot name="header">
        <h1>Default Header</h1>
      </slot>
    </header>
    <main>
      <slot>
        <p>Default content</p>
      </slot>
    </main>
    <footer>
      <slot name="footer" />
    </footer>
  </div>
</template>

<!-- 使用 -->
<BaseLayout>
  <template #header>
    <h1>Custom Header</h1>
  </template>

  <p>Custom main content</p>

  <template #footer>
    <p>Custom footer</p>
  </template>
</BaseLayout>

// 作用域插槽
<!-- UserList.vue -->
<script setup lang="ts">
interface User {
  id: number;
  name: string;
  email: string;
}

const users = ref<User[]>([
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' }
]);
</script>

<template>
  <ul>
    <li v-for="user in users" :key="user.id">
      <slot :user="user">
        {{ user.name }} <!-- 默认内容 -->
      </slot>
    </li>
  </ul>
</template>

<!-- 使用 -->
<UserList>
  <template #default="{ user }">
    <span>{{ user.name }} ({{ user.email }})</span>
  </template>
</UserList>
\`\`\`

## 组合式函数

### 创建可复用逻辑

\`\`\`typescript
// composables/useCounter.ts
import { ref, computed } from 'vue';

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);

  const doubled = computed(() => count.value * 2);

  const increment = () => {
    count.value++;
  };

  const decrement = () => {
    count.value--;
  };

  const reset = () => {
    count.value = initialValue;
  };

  return {
    count,
    doubled,
    increment,
    decrement,
    reset
  };
}

// 使用
<script setup lang="ts">
import { useCounter } from '@/composables/useCounter';

const { count, doubled, increment, decrement, reset } = useCounter(10);
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Doubled: {{ doubled }}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="reset">Reset</button>
  </div>
</template>
\`\`\`

### 实用组合式函数

\`\`\`typescript
// composables/useFetch.ts
import { ref, onMounted } from 'vue';

export function useFetch<T>(url: string) {
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const loading = ref(false);

  const fetch = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(url);
      data.value = await response.json();
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetch();
  });

  return { data, error, loading, refetch: fetch };
}

// composables/useLocalStorage.ts
import { ref, watch } from 'vue';

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const stored = localStorage.getItem(key);
  const value = ref<T>(stored ? JSON.parse(stored) : defaultValue);

  watch(
    value,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    { deep: true }
  );

  return value;
}

// 使用
const theme = useLocalStorage<string>('theme', 'light');
\`\`\`

## 生命周期钩子

\`\`\`typescript
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
  onErrorCaptured
} from 'vue';

export default {
  setup() {
    onBeforeMount(() => {
      console.log('Before mount');
    });

    onMounted(() => {
      console.log('Mounted');
      // DOM 已挂载，可以访问 ref
    });

    onBeforeUpdate(() => {
      console.log('Before update');
    });

    onUpdated(() => {
      console.log('Updated');
    });

    onBeforeUnmount(() => {
      console.log('Before unmount');
      // 清理定时器、事件监听器等
    });

    onUnmounted(() => {
      console.log('Unmounted');
    });

    // Keep-alive 组件专用
    onActivated(() => {
      console.log('Activated');
    });

    onDeactivated(() => {
      console.log('Deactivated');
    });

    // 错误捕获
    onErrorCaptured((err, instance, info) => {
      console.error('Error:', err);
      console.error('Info:', info);
      return false; // 阻止错误继续传播
    });
  }
}
\`\`\`

## 组件引用

### Template Refs

\`\`\`vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';

// DOM 元素引用
const inputRef = ref<HTMLInputElement>();

// 组件引用
const childComponentRef = ref<InstanceType<typeof ChildComponent>>();

onMounted(() => {
  // 聚焦输入框
  inputRef.value?.focus();

  // 调用子组件方法
  childComponentRef.value?.childMethod();
});

const handleClick = () => {
  console.log(inputRef.value?.value); // 访问 DOM
};
</script>

<template>
  <input ref="inputRef" type="text" />
  <ChildComponent ref="childComponentRef" />
  <button @click="handleClick">Log Input Value</button>
</template>

// 子组件暴露方法
<script setup lang="ts">
// 定义暴露给父组件的方法
defineExpose({
  childMethod() {
    console.log('Called from parent');
  }
});
</script>
\`\`\`

## TypeScript 集成

### 类型定义

\`\`\`typescript
// 为 props 定义类型
<script setup lang="ts">
interface Props {
  title: string;
  count?: number;
  items: string[];
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  items: () => []
});
</script>

// 为 emits 定义类型
<script setup lang="ts">
interface Emits {
  (e: 'update', value: string): void;
  (e: 'delete', id: number): void;
}

const emit = defineEmits<Emits>();
</script>

// 为 ref 定义类型
const count = ref<number>(0);
const user = ref<User | null>(null);

// 为 computed 定义类型
const doubled = computed<number>(() => count.value * 2);

// 为 reactive 定义类型
interface State {
  count: number;
  message: string;
}

const state = reactive<State>({
  count: 0,
  message: 'Hello'
});
\`\`\`

## 状态管理

### Pinia (官方推荐)

\`\`\`typescript
// stores/counter.ts
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'Eduardo'
  }),

  getters: {
    doubleCount: (state) => state.count * 2,

    // 传递参数的 getter
    getUserById: (state) => {
      return (userId: number) => state.users.find((user) => user.id === userId);
    }
  },

  actions: {
    increment() {
      this.count++;
    },

    async fetchUser(userId: number) {
      const response = await fetch(\`/api/users/\${userId}\`);
      this.user = await response.json();
    }
  }
});

// 使用 Setup Store 风格
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0);
  const name = ref('Eduardo');

  const doubleCount = computed(() => count.value * 2);

  function increment() {
    count.value++;
  }

  return { count, name, doubleCount, increment };
});

// 在组件中使用
<script setup lang="ts">
import { useCounterStore } from '@/stores/counter';

const counterStore = useCounterStore();

// 直接访问 state 和 actions
counterStore.count++;
counterStore.increment();

// 使用 getter
console.log(counterStore.doubleCount);
</script>

// 解构时保持响应性
import { storeToRefs } from 'pinia';

const { count, doubleCount } = storeToRefs(counterStore);
const { increment } = counterStore; // actions 不需要 storeToRefs
\`\`\`

## 性能优化

### v-once 和 v-memo

\`\`\`vue
<template>
  <!-- 只渲染一次 -->
  <h1 v-once>{{ title }}</h1>

  <!-- 记忆子树 -->
  <div v-memo="[valueA, valueB]">
    ...
  </div>

  <!-- 列表优化 -->
  <div v-for="item in list" :key="item.id" v-memo="[item.id === selected]">
    <p>{{ item.text }}</p>
  </div>
</template>
\`\`\`

### 异步组件

\`\`\`typescript
import { defineAsyncComponent } from 'vue';

// 基础异步组件
const AsyncComponent = defineAsyncComponent(() =>
  import('./components/AsyncComponent.vue')
);

// 带选项的异步组件
const AsyncComponent = defineAsyncComponent({
  loader: () => import('./components/HeavyComponent.vue'),
  loadingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  delay: 200, // 延迟显示加载组件
  timeout: 3000 // 超时时间
});
\`\`\`

## 最佳实践

1. **优先使用 Composition API**: 更好的类型推断和逻辑复用
2. **使用 \`<script setup>\`**: 更简洁的语法
3. **创建可复用的 composables**: 将逻辑提取到组合式函数中
4. **使用 TypeScript**: 利用类型系统提高代码质量
5. **组件单一职责**: 保持组件小而专注
6. **合理使用 provide/inject**: 避免过度使用
7. **使用 Pinia 进行状态管理**: 比 Vuex 更简单、更类型友好

## 相关技能

- [Vue.js](/skills) - Vue.js 核心
- [TypeScript](/skills) - TypeScript
- [Pinia](/skills) - 状态管理
- [Vite](/skills) - 构建工具

## 参考资源

- [Vue.js 官方文档](https://vuejs.org/)
- [Vue.js GitHub](https://github.com/vuejs/core)
- [Composition API RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)
- [Pinia 文档](https://pinia.vuejs.org/)
`,
    category: 'development',
    tags: ['vue', 'vuejs', 'composition-api', 'frontend', 'typescript'],
    difficulty: 'intermediate',
    readTime: 18,
    author: 'OpenClaw Team',
    relatedSkills: ['skill-023', 'skill-047', 'skill-048'],
    stats: { viewCount: 0 },
    createdAt: '2026-02-06T00:00:00Z',
    featured: false
  }
];

// Append new tutorials to existing data
const updatedData = [...data, ...newTutorials];

// Write back to file
fs.writeFileSync(tutorialsPath, JSON.stringify(updatedData, null, 2));

console.log('Added 4 new Intermediate tutorials (Batch 7):');
newTutorials.forEach(t => console.log('  - ' + t.id + ': ' + t.title));
console.log('Total tutorials: ' + updatedData.length);
