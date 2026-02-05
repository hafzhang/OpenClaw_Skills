const fs = require('fs');

// Read current tutorials
const tutorials = JSON.parse(fs.readFileSync('./src/data/tutorials.json', 'utf8'));

console.log(`Current tutorials: ${tutorials.length}`);
console.log(`Adding tutorials 021-025...`);

// Tutorial 021: CI/CD Complete Practice
const tutorial021 = {
  "id": "tutorial-021",
  "title": "CI/CD 完整实践",
  "slug": "ci-cd-complete-practice",
  "description": "构建完整的 CI/CD 流水线，包括测试、构建、部署和监控。",
  "content": `# CI/CD 完整实践

持续集成和持续部署是现代软件开发的核心实践。本教程将教你如何构建完整的 CI/CD 流水线。

## CI/CD 基础概念

### CI (Continuous Integration)
- 频繁集成代码到主干
- 自动化测试和构建
- 快速反馈

### CD (Continuous Deployment)
- 自动化部署
- 环境一致性
- 快速交付

## Jenkins Pipeline

\`\`\`groovy
pipeline {
    agent any
    environment {
        DOCKER_REGISTRY = 'registry.example.com'
        IMAGE_NAME = 'myapp'
    }
    stages {
        stage('Build') {
            steps {
                sh 'docker build -t \${IMAGE_NAME}:\${BUILD_NUMBER} .'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        stage('Deploy') {
            steps {
                sh 'kubectl set image deployment/myapp myapp=\${DOCKER_REGISTRY}/\${IMAGE_NAME}:\${BUILD_NUMBER}'
            }
        }
    }
}
\`\`\`

## 实战案例

\`\`\`yaml
# .github/workflows/ci.yml
name: CI/CD
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Build
      run: docker build -t myapp .
    - name: Test
      run: npm test
\`\`\`

## 最佳实践

1. 快速失败
2. 并行执行
3. 缓存依赖

## 常见问题

**Q: 如何处理 Secrets？**

A: 使用 CI/CD 平台的 Secrets 功能。

## 相关技能

- [Jenkins](/skills/jenkins)
- [GitLab CI](/skills/gitlab-ci)`,
  "category": "devops",
  "tags": ["CI/CD", "Jenkins", "GitLab", "自动化"],
  "difficulty": "intermediate",
  "readTime": 22,
  "author": "OpenClaw Team",
  "relatedSkills": ["skill-036", "skill-037"],
  "stats": {"viewCount": 380},
  "createdAt": "2026-02-05T00:00:00Z",
  "featured": false
};

// Tutorial 022: Infrastructure as Code
const tutorial022 = {
  "id": "tutorial-022",
  "title": "基础设施即代码",
  "slug": "infrastructure-as-code",
  "description": "使用 Terraform 和 Ansible 实现基础设施即代码，实现可重复的部署。",
  "content": `# 基础设施即代码

基础设施即代码 (IaC) 是一种使用代码管理和配置基础设施的方法。

## Terraform 基础

\`\`\`hcl
# main.tf
resource "aws_instance" "example" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  tags = {
    Name = "terraform-example"
  }
}
\`\`\`

## Ansible Playbook

\`\`\`yaml
---
- name: Configure servers
  hosts: webservers
  tasks:
    - name: Install Nginx
      apt:
        name: nginx
        state: present
\`\`\`

## 最佳实践

1. 状态管理
2. 模块化
3. 版本控制

## 相关技能

- [Terraform](/skills/terraform)
- [Ansible](/skills/ansible)`,
  "category": "devops",
  "tags": ["Terraform", "Ansible", "IaC", "自动化"],
  "difficulty": "intermediate",
  "readTime": 20,
  "author": "OpenClaw Team",
  "relatedSkills": ["skill-034", "skill-035"],
  "stats": {"viewCount": 340},
  "createdAt": "2026-02-05T00:00:00Z",
  "featured": false
};

// Tutorial 023: Monitoring and Alerting Systems
const tutorial023 = {
  "id": "tutorial-023",
  "title": "监控和告警系统",
  "slug": "monitoring-alerting-systems",
  "description": "构建完整的监控告警系统，包括指标收集、可视化和智能告警。",
  "content": `# 监控和告警系统

完整的监控体系是生产系统稳定运行的关键保障。

## Prometheus 配置

\`\`\`yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'myapp'
    static_configs:
      - targets: ['localhost:8080']
\`\`\`

## Grafana 仪表板

\`\`\`json
{
  "dashboard": {
    "title": "MyApp Dashboard",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [{
          "expr": "rate(http_requests_total[5m])"
        }]
      }
    ]
  }
}
\`\`\`

## 告警规则

\`\`\`yaml
groups:
  - name: alerts
    rules:
      - alert: HighErrorRate
        expr: rate(errors_total[5m]) > 0.05
        annotations:
          summary: "High error rate detected"
\`\`\`

## 最佳实践

1. 监控四类指标：延迟、流量、错误、饱和度
2. 设置合理阈值
3. 建立告警分级

## 相关技能

- [Prometheus](/skills/prometheus)`,
  "category": "devops",
  "tags": ["监控", "告警", "Prometheus", "Grafana"],
  "difficulty": "intermediate",
  "readTime": 18,
  "author": "OpenClaw Team",
  "relatedSkills": ["skill-036"],
  "stats": {"viewCount": 310},
  "createdAt": "2026-02-05T00:00:00Z",
  "featured": false
};

// Tutorial 024: AI-Powered Code Review
const tutorial024 = {
  "id": "tutorial-024",
  "title": "AI 驱动的代码审查",
  "slug": "ai-powered-code-review",
  "description": "使用 AI 技术进行自动化代码审查，提高代码质量和团队效率。",
  "content": `# AI 驱动的代码审查

AI 技术可以显著提高代码审查的效率和质量。

## Claude API 集成

\`\`\`python
import anthropic

client = anthropic.Anthropic(api_key="your-api-key")

def review_code(code, language):
    message = client.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=2000,
        messages=[{
            "role": "user",
            "content": f"Review this {language} code:\\n{code}"
        }]
    )
    return message.content
\`\`\`

## 自定义审查规则

\`\`\`python
rules = {
    "security": ["check for sql injection", "validate inputs"],
    "performance": ["avoid n+1 queries", "use indexes"],
    "style": ["follow naming conventions", "add comments"]
}
\`\`\`

## 实战案例

\`\`\`python
def automated_review(pr):
    for file in pr.files:
        issues = []
        code = file.content

        # 安全检查
        if "SELECT *" in code:
            issues.append("Avoid SELECT *")

        # 性能检查
        if len(re.findall(r"db.query", code)) > 10:
            issues.append("Too many database queries")

        return issues
\`\`\`

## 最佳实践

1. 定义明确的审查标准
2. 结合人工审查
3. 持续学习改进

## 相关技能

- [Claude](/skills/claude)
- [Prompt Engineering Expert](/skills/prompt-engineering-expert)`,
  "category": "development",
  "tags": ["AI", "代码审查", "Claude"],
  "difficulty": "intermediate",
  "readTime": 15,
  "author": "OpenClaw Team",
  "relatedSkills": ["skill-038", "skill-008"],
  "stats": {"viewCount": 290},
  "createdAt": "2026-02-05T00:00:00Z",
  "featured": false
};

// Tutorial 025: LLM Application Development
const tutorial025 = {
  "id": "tutorial-025",
  "title": "大语言模型应用开发",
  "slug": "llm-application-development",
  "description": "学习构建基于大语言模型的应用，包括 RAG、Agent 和 Function Calling。",
  "content": `# 大语言模型应用开发

学习如何构建基于 LLM 的现代应用。

## RAG 架构

\`\`\`python
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma

# 创建向量数据库
vectorstore = Chroma.from_documents(
    documents=docs,
    embedding=OpenAIEmbeddings()
)

# 检索相关内容
retriever = vectorstore.as_retriever()
docs = retriever.get_relevant_documents("query")
\`\`\`

## Agent 开发

\`\`\`python
from langchain.agents import initialize_agent, Tool
from langchain.llms import OpenAI

tools = [
    Tool(
        name="Search",
        func=search_func,
        description="Search the web"
    )
]

agent = initialize_agent(
    tools,
    OpenAI(temperature=0),
    agent_type="zero-shot-react-description"
)
\`\`\`

## Function Calling

\`\`\`python
import openai

response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "What's the weather?"}
    ],
    functions=[
        {
            "name": "get_weather",
            "description": "Get weather information",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"}
                }
            }
        }
    ]
)
\`\`\`

## 实战案例

\`\`\`python
class RAGApplication:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings()
        self.vectorstore = Chroma(
            embedding_function=self.embeddings
        )
        self.llm = ChatOpenAI(model="gpt-4")

    def query(self, question):
        # 检索
        docs = self.vectorstore.similarity_search(question)
        context = "\\n".join([d.page_content for d in docs])

        # 生成
        prompt = f"Context: {context}\\nQuestion: {question}"
        return self.llm.predict(prompt)
\`\`\`

## 最佳实践

1. 优化提示词
2. 处理长上下文
3. 实现缓存

## 相关技能

- [Claude](/skills/claude)
- [Brave Search](/skills/brave-search)`,
  "category": "ai-llms",
  "tags": ["LLM", "RAG", "AI应用", "Agent"],
  "difficulty": "intermediate",
  "readTime": 25,
  "author": "OpenClaw Team",
  "relatedSkills": ["skill-038", "skill-007", "skill-002"],
  "stats": {"viewCount": 360},
  "createdAt": "2026-02-05T00:00:00Z",
  "featured": false
};

// Add all tutorials
tutorials.push(tutorial021, tutorial022, tutorial023, tutorial024, tutorial025);

// Write back
fs.writeFileSync('./src/data/tutorials.json', JSON.stringify(tutorials, null, 2) + '\n');
console.log('✅ Added tutorials 021-025:');
console.log('  - Tutorial 021: CI/CD Complete Practice');
console.log('  - Tutorial 022: Infrastructure as Code');
console.log('  - Tutorial 023: Monitoring and Alerting Systems');
console.log('  - Tutorial 024: AI-Powered Code Review');
console.log('  - Tutorial 025: LLM Application Development');
console.log(`Total tutorials: ${tutorials.length}`);
