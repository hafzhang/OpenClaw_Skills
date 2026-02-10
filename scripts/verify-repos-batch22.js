/**
 * Batch 22 - 文件处理和网络工具技能仓库验证脚本
 *
 * Utilities 类技能批次 2 - 文件处理和网络工具 (27个)
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// 待验证的仓库列表
const repos = [
  // 文件下载和传输工具 (12个)
  { name: 'wget', url: 'https://github.com/mirror/wget', category: 'file-downloader' },
  { name: 'curl', url: 'https://github.com/curl/curl', category: 'network-tool' },
  { name: 'aria2', url: 'https://github.com/aria2/aria2', category: 'download-manager' },
  { name: 'axel', url: 'https://github.com/axel-download-accelerator/axel', category: 'download-accelerator' },
  { name: 'you-get', url: 'https://github.com/soimort/you-get', category: 'video-downloader' },
  { name: 'youtube-dl', url: 'https://github.com/ytdl-org/youtube-dl', category: 'video-downloader' },
  { name: 'yt-dlp', url: 'https://github.com/yt-dlp/yt-dlp', category: 'video-downloader' },
  { name: 'gallery-dl', url: 'https://github.com/mikf/gallery-dl', category: 'image-downloader' },
  { name: 'rsync', url: 'https://github.com/WayneD/rsync', category: 'file-synchronization' },
  { name: 'lsyncd', url: 'https://github.com/axkibe/lsyncd', category: 'live-sync' },
  { name: 'syncthing', url: 'https://github.com/syncthing/syncthing', category: 'file-synchronization' },
  { name: 'rclone', url: 'https://github.com/rclone/rclone', category: 'cloud-storage' },

  // 网络诊断和监控工具 (10个)
  { name: 'nmap', url: 'https://github.com/nmap/nmap', category: 'network-scanner' },
  { name: 'masscan', url: 'https://github.com/robertdavidgraham/masscan', category: 'port-scanner' },
  { name: 'rustscan', url: 'https://github.com/RustScan/RustScan', category: 'port-scanner' },
  { name: 'zmap', url: 'https://github.com/zmap/zmap', category: 'network-scanner' },
  { name: 'wireshark', url: 'https://github.com/wireshark/wireshark', category: 'network-analyzer' },
  { name: 'tcpdump', url: 'https://github.com/the-tcpdump-group/tcpdump', category: 'packet-analyzer' },
  { name: 'mtr', url: 'https://github.com/traviscross/mtr', category: 'network-diagnostic' },
  { name: 'openssh', url: 'https://github.com/openssh/openssh-portable', category: 'remote-connect' },
  { name: 'openssl', url: 'https://github.com/openssl/openssl', category: 'cryptography' },

  // 压缩和归档工具 (6个)
  { name: 'p7zip', url: 'https://github.com/jinfeihan/p7zip', category: 'compression' },
  { name: 'zlib', url: 'https://github.com/madler/zlib', category: 'compression-library' },
  { name: 'zstd', url: 'https://github.com/facebook/zstd', category: 'compression' },
  { name: 'lz4', url: 'https://github.com/lz4/lz4', category: 'compression' },
  { name: 'brotli', url: 'https://github.com/google/brotli', category: 'compression' },
  { name: 'pixz', url: 'https://github.com/madler/pixz', category: 'compression' },

  // 磁盘分析和清理工具 (5个)
  { name: 'ncdu', url: 'https://github.com/rofl0r/ncdu', category: 'disk-analyzer' },
  { name: 'dua', url: 'https://github.com/Byron/dua', category: 'disk-analyzer' },
  { name: 'gdu', url: 'https://github.com/dundee/gdu', category: 'disk-analyzer' },
  { name: 'bleachbit', url: 'https://github.com/bleachbit/bleachbit', category: 'disk-cleaner' },
  { name: 'stow', url: 'https://github.com/aspiers/stow', category: 'symlink-manager' }
];

// 验证单个仓库
function verifyRepo(repo) {
  return new Promise((resolve) => {
    const url = new URL(repo.url);
    const options = {
      method: 'HEAD',
      host: url.hostname,
      path: url.pathname,
      headers: {
        'User-Agent': 'OpenClaw-Skills-Verifier/1.0'
      },
      timeout: 15000 // 15秒超时
    };

    const protocol = url.protocol === 'https:' ? https : http;
    const startTime = Date.now();

    const req = protocol.request(options, (res) => {
      const duration = Date.now() - startTime;
      let status = res.statusCode;
      let finalUrl = repo.url;

      // 处理重定向
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        finalUrl = res.headers.location.startsWith('http')
          ? res.headers.location
          : `${url.protocol}//${url.hostname}${res.headers.location}`;
      }

      resolve({
        name: repo.name,
        url: repo.url,
        category: repo.category,
        status: status,
        finalUrl: finalUrl,
        duration: duration,
        success: status === 200 || status === 301 || status === 302
      });
    });

    req.on('error', (err) => {
      const duration = Date.now() - startTime;
      resolve({
        name: repo.name,
        url: repo.url,
        category: repo.category,
        status: 'ERROR',
        error: err.code,
        duration: duration,
        success: false
      });
    });

    req.on('timeout', () => {
      req.destroy();
      const duration = Date.now() - startTime;
      resolve({
        name: repo.name,
        url: repo.url,
        category: repo.category,
        status: 'TIMEOUT',
        duration: duration,
        success: false
      });
    });

    req.end();
  });
}

// 批量验证所有仓库
async function verifyAllRepos() {
  console.log(`开始验证 Batch 22 - 文件处理和网络工具 (${repos.length} 个仓库)\n`);

  const results = [];
  let successCount = 0;
  let failCount = 0;
  let timeoutCount = 0;
  let errorCount = 0;

  // 并发验证，每次5个
  const batchSize = 5;
  for (let i = 0; i < repos.length; i += batchSize) {
    const batch = repos.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(verifyRepo));
    results.push(...batchResults);

    // 显示进度
    batchResults.forEach((result, idx) => {
      const globalIdx = i + idx + 1;
      const statusIcon = result.success ? '✅' : (result.status === 'TIMEOUT' ? '⏱️' : (result.status === 'ERROR' ? '❌' : '❌'));
      console.log(`[${globalIdx}/${repos.length}] ${statusIcon} ${result.name.padEnd(20)} - ${result.status} ${result.duration}ms`);
    });

    // 更新统计
    batchResults.forEach(result => {
      if (result.success) successCount++;
      else if (result.status === 'TIMEOUT') timeoutCount++;
      else if (result.status === 'ERROR') errorCount++;
      else failCount++;
    });

    // 避免请求过快
    if (i + batchSize < repos.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // 生成报告
  const report = {
    batch: 'batch22',
    name: '文件处理和网络工具',
    date: new Date().toISOString(),
    total: repos.length,
    summary: {
      success: successCount,
      fail: failCount,
      timeout: timeoutCount,
      error: errorCount,
      successRate: ((successCount / repos.length) * 100).toFixed(2) + '%'
    },
    results: results
  };

  // 确保报告目录存在
  const reportDir = path.join(__dirname, '..', 'reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  // 保存报告
  const reportPath = path.join(reportDir, 'batch22-repos-verification.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('\n========== 验证结果摘要 ==========');
  console.log(`总计: ${report.summary.total}`);
  console.log(`成功: ${report.summary.success}`);
  console.log(`失败: ${report.summary.fail}`);
  console.log(`超时: ${report.summary.timeout}`);
  console.log(`错误: ${report.summary.error}`);
  console.log(`成功率: ${report.summary.successRate}`);
  console.log(`\n报告已保存到: ${reportPath}`);
}

// 运行验证
verifyAllRepos().catch(console.error);
