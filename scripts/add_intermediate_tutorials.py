#!/usr/bin/env python3
"""Add 8 Intermediate tutorials to tutorials.json"""

import json
from datetime import datetime

# Read current tutorials
with open('src/data/tutorials.json', 'r', encoding='utf-8') as f:
    tutorials = json.load(f)

print(f"Current tutorial count: {len(tutorials)}")
print(f"Last tutorial ID: {tutorials[-1]['id']}")

# Tutorial 018: Rust System Programming
tutorial_018 = {
    "id": "tutorial-018",
    "title": "Rust 系统编程入门",
    "slug": "rust-system-programming",
    "description": "深入学习 Rust 系统编程，包括内存安全、并发编程和性能优化技巧。",
    "content": """# Rust 系统编程入门

Rust 是一门系统编程语言，专注于安全、并发和性能。本教程将带你深入了解 Rust 的核心概念和高级特性。

## 为什么选择 Rust？

Rust 提供了独特的优势：

- **内存安全**: 编译时保证，无需垃圾回收
- **零成本抽象**: 高级特性不影响性能
- **并发安全**: 编译器防止数据竞争
- **现代工具链**: Cargo 包管理器和构建系统
- **跨平台**: 支持 Windows、Linux、macOS

## 准备工作

### 安装 Rust

```bash
# 使用 rustup 安装 Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Windows (下载并运行 rustup-init.exe)
# https://rustup.rs/

# 验证安装
rustc --version
cargo --version
```

### 创建新项目

```bash
# 创建新项目
cargo new rust_system --bin

# 进入项目目录
cd rust_system

# 运行项目
cargo run
```

## 核心概念

### 所有权和借用

```rust
// 所有权示例
fn main() {
    let s1 = String::from("hello");
    let s2 = s1;  // s1 的所有权移动到 s2
    // println!("{}", s1);  // 编译错误：s1 不再有效
    println!("{}", s2);  // 正确
}

// 借用示例
fn calculate_length(s: &String) -> usize {  // 借用，不获取所有权
    s.len()
}  // s 离开作用域，但不释放内存

fn main() {
    let s1 = String::from("hello");
    let len = calculate_length(&s1);  // 传递引用
    println!("Length of '{}' is {}.", s1, len);  // s1 仍然有效
}

// 可变借用
fn append_world(s: &mut String) {
    s.push_str(" world");
}

fn main() {
    let mut s1 = String::from("hello");
    append_world(&mut s1);
    println!("{}", s1);  // "hello world"
}
```

### 结构体和方法

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn new(width: u32, height: u32) -> Self {
        Rectangle { width, height }
    }

    fn area(&self) -> u32 {
        self.width * self.height
    }

    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}

fn main() {
    let rect = Rectangle::new(30, 50);
    println!("Rectangle area: {}", rect.area());
}
```

### 枚举和模式匹配

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

impl Message {
    fn process(&self) {
        match self {
            Message::Quit => println!("Quit"),
            Message::Move { x, y } => println!("Move to ({}, {})", x, y),
            Message::Write(text) => println!("Write: {}", text),
            Message::ChangeColor(r, g, b) => println!("Color: {}, {}, {}", r, g, b),
        }
    }
}

fn main() {
    let msg = Message::Move { x: 10, y: 20 };
    msg.process();
}
```

## 并发编程

### 线程

```rust
use std::thread;
use std::time::Duration;

fn main() {
    // 创建线程
    thread::spawn(|| {
        for i in 1..10 {
            println!("hi number {} from the spawned thread", i);
            thread::sleep(Duration::from_millis(1));
        }
    });

    // 主线程
    for i in 1..5 {
        println!("hi number {} from the main thread", i);
        thread::sleep(Duration::from_millis(1));
    }
}
```

### 消息传递

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let val = String::from("hi");
        tx.send(val).unwrap();
    });

    let received = rx.recv().unwrap();
    println!("Got: {}", received);
}
```

### 共享状态

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap());
}
```

## 错误处理

### Result 和 Option

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let username_file_result = File::open("hello.txt");

    let mut username_file = match username_file_result {
        Ok(file) => file,
        Err(e) => return Err(e),
    };

    let mut username = String::new();

    match username_file.read_to_string(&mut username) {
        Ok(_) => Ok(username),
        Err(e) => Err(e),
    }
}

// 使用 ? 运算符简化
fn read_username_from_file_simple() -> Result<String, io::Error> {
    let mut username_file = File::open("hello.txt")?;
    let mut username = String::new();
    username_file.read_to_string(&mut username)?;
    Ok(username)
}

// Option 示例
fn divide(numerator: f64, denominator: f64) -> Option<f64> {
    if denominator == 0.0 {
        None
    } else {
        Some(numerator / denominator)
    }
}

fn main() {
    let result = divide(10.0, 2.0);
    match result {
        Some(x) => println!("Result: {}", x),
        None => println!("Cannot divide by zero"),
    }
}
```

## 性能优化

### 零成本抽象

```rust
// 迭代器链（零成本抽象）
fn process_numbers(numbers: &[i32]) -> Vec<i32> {
    numbers.iter()
        .filter(|&x| x > 0)
        .map(|&x| x * 2)
        .collect()
}

// 等价的手写循环（性能相同）
fn process_numbers_manual(numbers: &[i32]) -> Vec<i32> {
    let mut result = Vec::new();
    for &x in numbers {
        if x > 0 {
            result.push(x * 2);
        }
    }
    result
}
```

### 内存优化

```rust
// 使用栈分配的小字符串
use smallvec::SmallVec;

fn process_strings() {
    let mut vec = SmallVec::<[String; 4]>::new();
    vec.push(String::from("hello"));
    vec.push(String::from("world"));
    // 如果元素 <= 4，不会堆分配
}

// 使用 Cow 避免不必要的克隆
use std::borrow::Cow;

fn process_text(s: Cow<str>) {
    if s.contains("world") {
        println!("Found world!");
    }
}

fn main() {
    // 借用数据
    let borrowed = "hello world";
    process_text(Cow::Borrowed(borrowed));

    // 拥有数据
    let owned = String::from("hello world");
    process_text(Cow::Owned(owned));
}
```

## 实战案例

### 案例 1：高性能日志系统

```rust
use std::fs::{File, OpenOptions};
use std::io::Write;
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::{SystemTime, UNIX_EPOCH};

struct Logger {
    file: Arc<Mutex<File>>,
}

impl Logger {
    fn new(filename: &str) -> std::io::Result<Self> {
        let file = OpenOptions::new()
            .create(true)
            .append(true)
            .open(filename)?;
        Ok(Logger {
            file: Arc::new(Mutex::new(file)),
        })
    }

    fn log(&self, message: &str) {
        let timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();

        let log_entry = format!("[{}] {}\\n", timestamp, message);

        let file = self.file.lock().unwrap();
        writeln!(&*file, "{}", log_entry).unwrap();
    }
}

fn main() -> std::io::Result<()> {
    let logger = Logger::new("app.log")?;
    let mut handles = vec![];

    // 多线程写入日志
    for i in 0..5 {
        let logger_clone = Logger {
            file: Arc::clone(&logger.file),
        };
        let handle = thread::spawn(move || {
            for j in 0..10 {
                logger_clone.log(&format!("Thread {} - Message {}", i, j));
            }
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    Ok(())
}
```

### 案例 2：并发 Web 爬虫

```rust
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;
use std::collections::HashSet;

struct Crawler {
    visited: Arc<Mutex<HashSet<String>>>,
    to_visit: Arc<Mutex<Vec<String>>>,
}

impl Crawler {
    fn new(urls: Vec<String>) -> Self {
        Crawler {
            visited: Arc::new(Mutex::new(HashSet::new())),
            to_visit: Arc::new(Mutex::new(urls)),
        }
    }

    fn crawl(&self) {
        loop {
            // 获取下一个 URL
            let url = {
                let mut to_visit = self.to_visit.lock().unwrap();
                if to_visit.is_empty() {
                    break;
                }
                to_visit.pop().unwrap()
            };

            // 检查是否已访问
            {
                let visited = self.visited.lock().unwrap();
                if visited.contains(&url) {
                    continue;
                }
            }

            // 模拟爬取
            println!("Crawling: {}", url);
            thread::sleep(Duration::from_millis(100));

            // 标记为已访问
            self.visited.lock().unwrap().insert(url.clone());
        }
    }
}

fn main() {
    let urls = vec![
        "https://example.com".to_string(),
        "https://example.org".to_string(),
        "https://example.net".to_string(),
    ];

    let crawler = Crawler::new(urls);
    let mut handles = vec![];

    // 创建 3 个爬虫线程
    for _ in 0..3 {
        let crawler_clone = Crawler {
            visited: Arc::clone(&crawler.visited),
            to_visit: Arc::clone(&crawler.to_visit),
        };
        let handle = thread::spawn(move || {
            crawler_clone.crawl();
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }
}
```

## 最佳实践

### 1. 使用迭代器

```rust
// 好的做法
fn sum_sq(nums: &[i32]) -> i32 {
    nums.iter().map(|&x| x * x).sum()
}

// 避免
fn sum_sq_bad(nums: &[i32]) -> i32 {
    let mut sum = 0;
    for &x in nums {
        sum += x * x;
    }
    sum
}
```

### 2. 错误处理

```rust
// 使用 ? 运算符
fn process_file() -> std::io::Result<()> {
    let content = std::fs::read_to_string("config.txt")?;
    // 处理内容
    Ok(())
}
```

### 3. 避免不必要的克隆

```rust
// 借用而不是克隆
fn process(s: &str) {
    println!("{}", s);
}
```

## 常见问题

### Q: 什么时候使用 Arc vs Rc？

A: Arc 用于多线程，Rc 用于单线程。Arc 有额外的同步开销。

### Q: 如何避免数据竞争？

A: Rust 编译器会在编译时检测数据竞争。使用 Send 和 Sync trait 确保线程安全。

### Q: 什么时候使用 unsafe？

A: 仅在必要时使用 unsafe，例如：调用 FFI、实现自定义智能指针、性能关键路径。

## 相关技能

- [Rust](/skills/rust) - Rust 编程语言
- [Git](/skills/git) - 版本控制

## 参考资源

- [Rust 官方文档](https://doc.rust-lang.org/)
- [Rust 程序设计语言](https://kaisery.github.io/trpl-zh-cn/)
- [Rust by Example](https://rustwiki.org/zh-CN/rust-by-example/)""",
    "category": "development",
    "tags": ["Rust", "系统编程", "性能", "并发"],
    "difficulty": "intermediate",
    "readTime": 18,
    "author": "OpenClaw Team",
    "relatedSkills": ["skill-024"],
    "stats": {"viewCount": 280},
    "createdAt": "2026-02-05T00:00:00Z",
    "featured": False
}

# Add all tutorials
new_tutorials = [tutorial_018]

# Extend the tutorials list
tutorials.extend(new_tutorials)

# Write back to file
with open('src/data/tutorials.json', 'w', encoding='utf-8') as f:
    json.dump(tutorials, f, ensure_ascii=False, indent=2)

print(f"\nAdded {len(new_tutorials)} tutorials")
print(f"Total tutorials: {len(tutorials)}")
print(f"New tutorial IDs: {[t['id'] for t in new_tutorials]}")
