/**
 * 批量验证所有技能的 GitHub 链接
 * US-170: Phase 6 - 测试所有技能链接和功能
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// 读取 skills.json
const skillsPath = path.join(__dirname, '../src/data/skills.json');
const skills = JSON.parse(fs.readFileSync(skillsPath, 'utf-8'));

console.log(`📋 Total skills to verify: ${skills.length}`);

// 验证结果
const results = {
  total: skills.length,
  success: 0,
  timeout: 0,
  error: 0,
  notGitHub: 0,
  details: []
};

// 并发控制
const MAX_CONCURRENT = 10;
let completed = 0;
let index = 0;

/**
 * 执行 HEAD 请求验证 URL
 */
function checkUrl(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;

    const options = {
      method: 'HEAD',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OpenClaw-Hub-Verifier/1.0)'
      }
    };

    const req = client.request(url, options, (res) => {
      const status = res.statusCode;

      // 处理重定向
      if (status >= 300 && status < 400 && res.headers.location) {
        // 如果是重定向，验证重定向后的URL
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = new URL(redirectUrl, url).href;
        }
        resolve(checkUrl(redirectUrl));
        return;
      }

      resolve({
        status,
        success: status === 200,
        redirect: status >= 300 && status < 400
      });
    });

    req.on('error', (err) => {
      resolve({
        status: 'ERROR',
        success: false,
        error: err.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        status: 'TIMEOUT',
        success: false
      });
    });

    req.end();
  });
}

/**
 * 批量处理验证
 */
async function processBatch() {
  while (index < skills.length) {
    const skill = skills[index++];
    const url = skill.url || skill.source;

    console.log(`[${index}/${skills.length}] Checking ${skill.id}: ${skill.name}`);

    try {
      // 检查是否是 GitHub URL
      if (!url.includes('github.com')) {
        results.notGitHub++;
        results.details.push({
          id: skill.id,
          name: skill.name,
          slug: skill.slug,
          url,
          status: 'NOT_GITHUB',
          success: false
        });
        completed++;
        continue;
      }

      const result = await checkUrl(url);

      if (result.success) {
        results.success++;
      } else if (result.status === 'TIMEOUT') {
        results.timeout++;
      } else if (result.status === 'ERROR') {
        results.error++;
      } else {
        results.error++;
      }

      results.details.push({
        id: skill.id,
        name: skill.name,
        slug: skill.slug,
        url,
        status: result.status,
        success: result.success,
        redirect: result.redirect
      });

      completed++;
    } catch (err) {
      results.error++;
      results.details.push({
        id: skill.id,
        name: skill.name,
        slug: skill.slug,
        url,
        status: 'EXCEPTION',
        success: false,
        error: err.message
      });
      completed++;
    }

    // 每处理50个输出一次进度
    if (completed % 50 === 0) {
      console.log(`\n📊 Progress: ${completed}/${skills.length}`);
      console.log(`   ✓ Success: ${results.success}`);
      console.log(`   ⏱ Timeout: ${results.timeout}`);
      console.log(`   ✗ Error: ${results.error}`);
      console.log(`   ⊝ Not GitHub: ${results.notGitHub}\n`);
    }
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 Starting batch verification...\n');

  // 创建并发队列
  const workers = [];
  for (let i = 0; i < MAX_CONCURRENT; i++) {
    workers.push(processBatch());
  }

  await Promise.all(workers);

  console.log('\n📊 Final Results:');
  console.log(`   Total: ${results.total}`);
  console.log(`   ✓ Success (HTTP 200): ${results.success} (${((results.success / results.total) * 100).toFixed(2)}%)`);
  console.log(`   ⏱ Timeout: ${results.timeout} (${((results.timeout / results.total) * 100).toFixed(2)}%)`);
  console.log(`   ✗ Error: ${results.error} (${((results.error / results.total) * 100).toFixed(2)}%)`);
  console.log(`   ⊝ Not GitHub: ${results.notGitHub} (${((results.notGitHub / results.total) * 100).toFixed(2)}%)`);

  // 保存详细报告
  const reportsDir = path.join(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const reportPath = path.join(reportsDir, `all-skills-verification-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);

  // 生成汇总报告
  const summaryPath = path.join(reportsDir, 'all-skills-verification-latest.json');
  fs.writeFileSync(summaryPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      total: results.total,
      success: results.success,
      timeout: results.timeout,
      error: results.error,
      notGitHub: results.notGitHub,
      successRate: ((results.success / results.total) * 100).toFixed(2) + '%'
    },
    failures: results.details.filter(d => !d.success),
    successes: results.details.filter(d => d.success).slice(0, 100) // 只保存前100个成功的示例
  }, null, 2));
  console.log(`📄 Summary report saved to: ${summaryPath}`);
}

main().catch(console.error);
