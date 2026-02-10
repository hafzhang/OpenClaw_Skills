// Batch 12 Repository Verification Script
// Phase 6 - Productivity 类技能批次 5: 设计和创意工具 (40个)

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// 40个设计和创意工具技能仓库
const repositories = [
  // UI/UX 设计工具 (8个)
  'https://github.com/figma/plugin-samples',
  'https://github.com/penpot/penpot',
  'https://github.com/excalidraw/excalidraw',
  'https://github.com/tldraw/tldraw',
  'https://github.com/loomhq/loom-sdk',
  'https://github.com/miroapp/app-framework',
  'https://github.com/figma/diagrams',
  'https://github.com/affinity-project/affinity-designer-resources',

  // 原型和交互设计工具 (7个)
  'https://github.com/framer/motion',
  'https://github.com/pmndrs/react-spring',
  'https://github.com/greensock/GSAP',
  'https://github.com/juliangarnier/anime',
  'https://github.com/airbnb/lottie-web',
  'https://github.com/LottieFiles/lottie-player',
  'https://github.com/motiondivision/motionone',

  // 图形编辑和矢量工具 (7个)
  'https://github.com/fabricjs/fabric.js',
  'https://github.com/konvajs/konva',
  'https://github.com/paperjs/paper.js',
  'https://github.com/jonobr1/two.js',
  'https://github.com/pixijs/pixi.js',
  'https://github.com/processing/p5.js',
  'https://github.com/google/skia',

  // 3D 建模和渲染工具 (6个)
  'https://github.com/mrdoob/three.js',
  'https://github.com/BabylonJS/Babylon.js',
  'https://github.com/pmndrs/react-three-fiber',
  'https://github.com/pmndrs/drei',
  'https://github.com/splinetool/react-spline',
  'https://github.com/oframe/ogl',

  // 设计系统和组件库 (5个)
  'https://github.com/storybookjs/storybook',
  'https://github.com/chroma-ui/chromatic-cli',
  'https://github.com/figma/figma-api',
  'https://github.com/amzn/style-dictionary',
  'https://github.com/diez/diez',

  // 图标和插画工具 (4个)
  'https://github.com/lucide-icons/lucide',
  'https://github.com/tailwindlabs/heroicons',
  'https://github.com/tabler/tabler-icons',
  'https://github.com/phosphor-icons/phosphor',

  // 色彩和字体工具 (3个)
  'https://github.com/gka/chroma.js',
  'https://github.com/LeaVerou/color.js',
  'https://github.com/foliojs/fontkit',
];

// 验证单个仓库
function checkRepository(url) {
  return new Promise((resolve) => {
    const startTime = Date.now();

    try {
      const urlObj = new URL(url);
      const client = urlObj.protocol === 'https:' ? https : http;

      const options = {
        method: 'HEAD',
        host: urlObj.hostname,
        path: urlObj.pathname,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; OpenClaw-Bot/1.0)',
        },
        timeout: 15000,
      };

      const req = client.request(options, (res) => {
        const responseTime = Date.now() - startTime;
        let finalStatus = res.statusCode;

        // Handle redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          finalStatus = `${res.statusCode} -> ${res.headers.location}`;
        }

        resolve({
          url,
          status: finalStatus,
          success: res.statusCode >= 200 && res.statusCode < 400,
          responseTime,
        });
      });

      req.on('error', (err) => {
        resolve({
          url,
          status: 'ERROR',
          error: err.message,
          success: false,
          responseTime: Date.now() - startTime,
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          url,
          status: 'TIMEOUT',
          success: false,
          responseTime: Date.now() - startTime,
        });
      });

      req.end();
    } catch (err) {
      resolve({
        url,
        status: 'INVALID_URL',
        error: err.message,
        success: false,
        responseTime: Date.now() - startTime,
      });
    }
  });
}

// 主函数
async function main() {
  console.log('开始验证 Batch 12 仓库...\n');

  const results = [];
  let completed = 0;

  for (const repo of repositories) {
    const result = await checkRepository(repo);
    results.push(result);
    completed++;

    const statusIcon = result.success ? '✓' : '✗';
    console.log(`[${completed}/${repositories.length}] ${statusIcon} ${result.url}`);
    console.log(`    Status: ${result.status}${result.error ? ` (${result.error})` : ''}`);
    console.log(`    Time: ${result.responseTime}ms\n`);
  }

  // 生成统计报告
  const successCount = results.filter(r => r.success).length;
  const errorCount = results.filter(r => !r.success && r.status !== 'TIMEOUT' && r.status !== 'ERROR').length;
  const timeoutCount = results.filter(r => r.status === 'TIMEOUT').length;
  const errorOtherCount = results.filter(r => r.status === 'ERROR').length;

  // 按状态分类
  const successRepos = results.filter(r => r.success);
  const redirectRepos = results.filter(r => typeof r.status === 'string' && r.status.includes('30'));
  const failedRepos = results.filter(r => !r.success && typeof r.status === 'number' && r.status >= 400);
  const timeoutRepos = results.filter(r => r.status === 'TIMEOUT');
  const errorRepos = results.filter(r => r.status === 'ERROR');

  console.log('\n=== 验证完成 ===\n');
  console.log(`总计: ${results.length} 个仓库`);
  console.log(`成功 (HTTP 200): ${successCount}`);
  console.log(`重定向 (301/302): ${redirectRepos.length}`);
  console.log(`失败 (4xx/5xx): ${failedRepos.length}`);
  console.log(`超时 (TIMEOUT): ${timeoutCount}`);
  console.log(`错误 (ERROR): ${errorOtherCount}`);
  console.log(`成功率: ${((successCount / results.length) * 100).toFixed(2)}%`);

  // 保存详细报告到 JSON
  const reportDir = path.join(__dirname, '..', 'reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const reportPath = path.join(reportDir, 'batch12-repos-verification.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      total: results.length,
      success: successCount,
      redirect: redirectRepos.length,
      failed: failedRepos.length,
      timeout: timeoutCount,
      error: errorOtherCount,
      successRate: ((successCount / results.length) * 100).toFixed(2) + '%'
    },
    results
  }, null, 2));

  console.log(`\n详细报告已保存到: ${reportPath}`);

  // 如果有失败的重定向，显示详细信息
  if (redirectRepos.length > 0) {
    console.log('\n=== 重定向仓库 ===');
    redirectRepos.forEach(r => {
      console.log(`  ${r.url}`);
      console.log(`    -> ${r.status}`);
    });
  }

  // 如果有失败的仓库，显示详细信息
  if (failedRepos.length > 0) {
    console.log('\n=== 失败仓库 ===');
    failedRepos.forEach(r => {
      console.log(`  ${r.url} - ${r.status}`);
    });
  }

  // 如果有超时的仓库，显示详细信息
  if (timeoutRepos.length > 0) {
    console.log('\n=== 超时仓库 ===');
    timeoutRepos.forEach(r => {
      console.log(`  ${r.url}`);
    });
  }

  if (errorRepos.length > 0) {
    console.log('\n=== 错误仓库 ===');
    errorRepos.forEach(r => {
      console.log(`  ${r.url} - ${r.error}`);
    });
  }
}

main().catch(console.error);
