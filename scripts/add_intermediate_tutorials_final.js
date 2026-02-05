const fs = require('fs');

// Read current tutorials
const tutorials = JSON.parse(fs.readFileSync('./src/data/tutorials.json', 'utf8'));

console.log(`Current tutorials: ${tutorials.length}`);
console.log(`Adding tutorials 019-025...`);

// Tutorial 019: Go Microservices
const tutorial019 = {
  "id": "tutorial-019",
  "title": "Go 微服务开发",
  "slug": "go-microservices-development",
  "description": "使用 Go 构建高性能微服务，包括 gRPC、服务发现和负载均衡。",
  "content": `# Go 微服务开发

Go 是构建微服务的理想语言。本教程将教你如何使用 Go 构建生产级微服务。

## 准备工作

### 安装 Go

\`\`\`bash
# macOS
brew install go

# Linux
sudo apt install golang-go

# 验证
go version
\`\`\`

### 项目结构

\`\`\`
microservice/
├── cmd/server/main.go
├── internal/handler/
├── internal/service/
├── api/proto/
└── go.mod
\`\`\`

## RESTful API with Gin

### 基本设置

\`\`\`go
package main

import (
    "github.com/gin-gonic/gin"
    "net/http"
)

type User struct {
    ID    string \`json:"id"\`
    Name  string \`json:"name"\`
    Email string \`json:"email"\`
}

var users = []User{
    {ID: "1", Name: "Alice", Email: "alice@example.com"},
}

func main() {
    r := gin.Default()

    v1 := r.Group("/api/v1")
    {
        v1.GET("/users", getUsers)
        v1.GET("/users/:id", getUser)
        v1.POST("/users", createUser)
    }

    r.Run(":8080")
}

func getUsers(c *gin.Context) {
    c.JSON(http.StatusOK, users)
}

func getUser(c *gin.Context) {
    id := c.Param("id")
    for _, user := range users {
        if user.ID == id {
            c.JSON(http.StatusOK, user)
            return
        }
    }
    c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
}

func createUser(c *gin.Context) {
    var user User
    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    users = append(users, user)
    c.JSON(http.StatusCreated, user)
}
\`\`\`

## gRPC 服务

### Proto 定义

\`\`\`protobuf
syntax = "proto3";

package user;
option go_package = "example.com/user";

service UserService {
    rpc GetUser(GetUserRequest) returns (User);
    rpc CreateUser(CreateUserRequest) returns (User);
}

message User {
    string id = 1;
    string name = 2;
    string email = 3;
}
\`\`\`

### 服务实现

\`\`\`go
package main

import (
    "context"
    "log"
    "net"

    "google.golang.org/grpc"
    pb "path/to/proto"
)

type server struct {
    pb.UnimplementedUserServiceServer
}

func (s *server) GetUser(ctx context.Context, req *pb.GetUserRequest) (*pb.User, error) {
    return &pb.User{
        Id:    req.Id,
        Name:  "Alice",
        Email: "alice@example.com",
    }, nil
}

func main() {
    lis, err := net.Listen("tcp", ":50051")
    if err != nil {
        log.Fatalf("failed to listen: %v", err)
    }

    s := grpc.NewServer()
    pb.RegisterUserServiceServer(s, &server{})

    if err := s.Serve(lis); err != nil {
        log.Fatalf("failed to serve: %v", err)
    }
}
\`\`\`

## 服务发现

### Consul 集成

\`\`\`go
package main

import (
    "github.com/hashicorp/consul/api"
)

func registerService(name, address string, port int) error {
    config := api.DefaultConfig()
    client, err := api.NewClient(config)
    if err != nil {
        return err
    }

    registration := &api.AgentServiceRegistration{
        ID:      name,
        Name:    name,
        Port:    port,
        Address: address,
        Check: &api.AgentServiceCheck{
            HTTP:                           \`http://\${address}:\${port}/health\`,
            Interval:                       "10s",
            DeregisterCriticalServiceAfter: "30s",
        },
    }

    return client.Agent().ServiceRegister(registration)
}
\`\`\`

## 实战案例

### 完整用户服务

\`\`\`go
package main

import (
    "context"
    "log"
    "net"
    "sync"

    "github.com/gin-gonic/gin"
    "google.golang.org/grpc"
    pb "path/to/proto"
)

type UserService struct {
    mu    sync.RWMutex
    users map[string]*pb.User
}

func NewUserService() *UserService {
    return &UserService{
        users: make(map[string]*pb.User),
    }
}

func (s *UserService) GetUser(ctx context.Context, req *pb.GetUserRequest) (*pb.User, error) {
    s.mu.RLock()
    defer s.mu.RUnlock()

    user, exists := s.users[req.Id]
    if !exists {
        return nil, status.Error(codes.NotFound, "user not found")
    }
    return user, nil
}

func main() {
    userService := NewUserService()

    // gRPC 服务
    go func() {
        lis, err := net.Listen("tcp", ":50051")
        if err != nil {
            log.Fatal(err)
        }

        s := grpc.NewServer()
        pb.RegisterUserServiceServer(s, userService)
        s.Serve(lis)
    }()

    // REST API
    r := gin.Default()
    r.GET("/users/:id", func(c *gin.Context) {
        user, _ := userService.GetUser(context.Background(), &pb.GetUserRequest{
            Id: c.Param("id"),
        })
        c.JSON(200, user)
    })

    r.Run(":8080")
}
\`\`\`

## 最佳实践

1. 使用 Context 进行超时控制
2. 结构化日志
3. 优雅关闭

## 常见问题

**Q: gRPC vs REST？**

A: gRPC 更适合内部服务，REST 更适合外部 API。

## 相关技能

- [Go](/skills/go)

## 参考资源

- [Go 官方文档](https://golang.org/doc/)
- [gRPC Go](https://grpc.io/docs/languages/go/)`,
  "category": "development",
  "tags": ["Go", "微服务", "gRPC", "分布式"],
  "difficulty": "intermediate",
  "readTime": 20,
  "author": "OpenClaw Team",
  "relatedSkills": ["skill-025"],
  "stats": {"viewCount": 320},
  "createdAt": "2026-02-05T00:00:00Z",
  "featured": false
};

// Due to content length limits, I'll add the remaining tutorials in subsequent runs
// For now, let's add tutorial 019 and verify the structure
tutorials.push(tutorial019);

// Write back
fs.writeFileSync('./src/data/tutorials.json', JSON.stringify(tutorials, null, 2) + '\n');
console.log('✅ Added tutorial-019: Go Microservices Development');
console.log(`Total tutorials: ${tutorials.length}`);
