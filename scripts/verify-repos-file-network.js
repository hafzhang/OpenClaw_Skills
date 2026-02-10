/**
 * 验证文件处理和网络工具类技能仓库
 * Phase 6 - File & Network Tools
 */

const https = require('https');
const http = require('http');
const fs = require('fs');

// 研究的技能列表
const skills = [
  // 压缩工具
  {
    id: 1,
    name: 'zip',
    category: 'compression',
    github: 'https://github.com/Info-ZIP/zip',
    altSource: 'ftp://ftp.info-zip.org/pub/infozip/',
    description: 'ZIP compression tool',
    priority: 'medium'
  },
  {
    id: 2,
    name: 'unzip',
    category: 'compression',
    github: 'https://github.com/Info-ZIP/unzip',
    altSource: 'ftp://ftp.info-zip.org/pub/infozip/',
    description: 'ZIP extraction tool',
    priority: 'medium'
  },
  {
    id: 3,
    name: 'tar',
    category: 'archive',
    github: null,
    altSource: 'https://savannah.gnu.org/projects/tar',
    description: 'GNU Tar archive tool',
    priority: 'high',
    standardTool: true
  },
  {
    id: 4,
    name: 'gzip',
    category: 'compression',
    github: null,
    altSource: 'https://git.savannah.gnu.org/cgit/gzip.git',
    description: 'GNU Gzip compression',
    priority: 'high',
    standardTool: true
  },
  {
    id: 5,
    name: 'bzip2',
    category: 'compression',
    github: null,
    altSource: 'https://sourceware.org/bzip2/',
    description: 'Burrows-Wheeler compression',
    priority: 'medium',
    standardTool: true
  },
  {
    id: 6,
    name: 'xz',
    category: 'compression',
    github: null,
    altSource: 'https://tukaani.org/xz/',
    description: 'LZMA compression',
    priority: 'high',
    standardTool: true
  },
  {
    id: 7,
    name: '7zip',
    category: 'compression',
    github: 'https://github.com/jaroslav-vanek/p7zip',
    altSource: 'https://www.7-zip.org/',
    description: '7-Zip compression',
    priority: 'high'
  },
  {
    id: 8,
    name: 'p7zip',
    category: 'compression',
    github: 'https://github.com/jinfeihan57/p7zip',
    stars: 4500,
    description: 'POSIX 7-Zip',
    priority: 'high'
  },
  {
    id: 9,
    name: 'zstd',
    category: 'compression',
    github: 'https://github.com/facebook/zstd',
    stars: 23000,
    description: 'Zstandard compression',
    priority: 'high'
  },
  {
    id: 10,
    name: 'lz4',
    category: 'compression',
    github: 'https://github.com/lz4/lz4',
    stars: 11000,
    description: 'Extremely fast compression',
    priority: 'high'
  },
  {
    id: 11,
    name: 'brotli',
    category: 'compression',
    github: 'https://github.com/google/brotli',
    stars: 13000,
    description: 'Brotli compression',
    priority: 'high'
  },
  {
    id: 12,
    name: 'pigz',
    category: 'compression',
    github: 'https://github.com/madler/pigz',
    stars: 4800,
    description: 'Parallel Gzip',
    priority: 'high'
  },
  // 归档工具
  {
    id: 13,
    name: 'cpio',
    category: 'archive',
    github: null,
    altSource: 'https://savannah.gnu.org/projects/cpio',
    description: 'GNU Cpio archive',
    priority: 'low',
    standardTool: true
  },
  {
    id: 14,
    name: 'ar',
    category: 'archive',
    github: null,
    altSource: 'https://sourceware.org/binutils',
    description: 'GNU Ar archive',
    priority: 'low',
    standardTool: true
  },
  {
    id: 15,
    name: 'shar',
    category: 'archive',
    github: 'https://github.com/ptarjan/shar',
    stars: 100,
    description: 'Shell archive',
    priority: 'low'
  },
  // 文件同步
  {
    id: 16,
    name: 'rsync',
    category: 'sync',
    github: 'https://github.com/WayneD/rsync',
    stars: 3500,
    description: 'Incremental file sync',
    priority: 'high'
  },
  // 下载工具
  {
    id: 17,
    name: 'wget',
    category: 'download',
    github: 'https://github.com/GNUwget/wget',
    stars: 3600,
    description: 'GNU Wget downloader',
    priority: 'high'
  },
  {
    id: 18,
    name: 'curl',
    category: 'network',
    github: 'https://github.com/curl/curl',
    stars: 35000,
    description: 'Multi-protocol transfer',
    priority: 'high'
  },
  {
    id: 19,
    name: 'aria2',
    category: 'download',
    github: 'https://github.com/aria2/aria2',
    stars: 20000,
    description: 'Multi-thread downloader',
    priority: 'high'
  },
  // 网络调试
  {
    id: 20,
    name: 'netcat',
    category: 'network',
    github: null,
    altSource: 'https://sourceforge.net/projects/netcat/',
    description: 'TCP/UDP swiss army knife',
    priority: 'medium',
    standardTool: true
  },
  {
    id: 21,
    name: 'socat',
    category: 'network',
    github: 'https://github.com/saihasa/socat',
    stars: 1200,
    description: 'Enhanced netcat',
    priority: 'medium'
  },
  {
    id: 22,
    name: 'nmap',
    category: 'security',
    github: 'https://github.com/nmap/nmap',
    stars: 9500,
    description: 'Network mapper',
    priority: 'high'
  },
  // 网络监控
  {
    id: 23,
    name: 'tcpdump',
    category: 'network',
    github: 'https://github.com/the-tcpdump-group/tcpdump',
    stars: 3600,
    description: 'Packet capture',
    priority: 'high'
  },
  {
    id: 24,
    name: 'wireshark',
    category: 'network',
    github: 'https://github.com/wireshark/wireshark',
    stars: 7800,
    description: 'Protocol analyzer',
    priority: 'high'
  },
  {
    id: 25,
    name: 'ntopng',
    category: 'monitoring',
    github: 'https://github.com/ntop/ntopng',
    stars: 6500,
    description: 'Traffic monitor',
    priority: 'high'
  },
  // DNS工具
  {
    id: 26,
    name: 'dig',
    category: 'dns',
    github: null,
    altSource: 'https://www.isc.org/downloads/bind',
    description: 'DNS lookup tool',
    priority: 'high',
    standardTool: true
  },
  {
    id: 27,
    name: 'knot-dns',
    category: 'dns',
    github: 'https://github.com/knot-dns/knot',
    stars: 1600,
    description: 'High-performance DNS',
    priority: 'medium'
  },
  // HTTP工具
  {
    id: 28,
    name: 'httpstat',
    category: 'http',
    github: 'https://github.com/b4b4r07/httpstat',
    stars: 18000,
    description: 'HTTP statistics',
    priority: 'high'
  },
  {
    id: 29,
    name: 'curlie',
    category: 'http',
    github: 'https://github.com/curlie/curlie',
    stars: 4000,
    description: 'Curl frontend',
    priority: 'medium'
  }
];

/**
 * 验证URL可访问性
 */
function checkUrl(url) {
  return new Promise((resolve) => {
    if (!url) {
      resolve({ accessible: false, error: 'No URL provided' });
      return;
    }

    const client = url.startsWith('https') ? https : http;
    const urlObj = new URL(url);

    const options = {
      method: 'HEAD',
      host: urlObj.hostname,
      port: urlObj.port || (url.startsWith('https') ? 443 : 80),
      path: urlObj.pathname,
      timeout: 10000,
      headers: {
        'User-Agent': 'OpenClaw-Skills-Verifier/1.0'
      }
    };

    const req = client.request(options, (res) => {
      resolve({
        accessible: res.statusCode >= 200 && res.statusCode < 400,
        statusCode: res.statusCode
      });
    });

    req.on('error', (error) => {
      resolve({ accessible: false, error: error.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ accessible: false, error: 'Timeout' });
    });

    req.end();
  });
}

/**
 * 验证所有技能
 */
async function verifySkills() {
  console.log('开始验证文件处理和网络工具技能...\n');

  const results = [];
  let accessibleCount = 0;
  let githubAccessible = 0;
  let altSourceAccessible = 0;

  for (const skill of skills) {
    process.stdout.write(`验证 ${skill.name}... `);

    const result = {
      id: skill.id,
      name: skill.name,
      category: skill.category,
      github: skill.github,
      altSource: skill.altSource,
      stars: skill.stars || 0,
      description: skill.description,
      priority: skill.priority,
      standardTool: skill.standardTool || false,
      githubAccessible: false,
      altSourceAccessible: false,
      recommended: false
    };

    // 验证GitHub
    if (skill.github) {
      const ghResult = await checkUrl(skill.github);
      result.githubAccessible = ghResult.accessible;
      if (ghResult.accessible) githubAccessible++;
    }

    // 验证备用源
    if (skill.altSource) {
      const altResult = await checkUrl(skill.altSource);
      result.altSourceAccessible = altResult.accessible;
      if (altResult.accessible) altSourceAccessible++;
    }

    // 判断推荐
    result.recommended = result.githubAccessible ||
                       (result.standardTool && result.altSourceAccessible) ||
                       result.stars >= 1000;

    if (result.recommended) {
      accessibleCount++;
      console.log('✓ 推荐');
    } else {
      console.log('✗ 跳过');
    }

    results.push(result);
  }

  // 统计
  console.log('\n=== 验证统计 ===');
  console.log(`总计: ${skills.length}`);
  console.log(`推荐收录: ${accessibleCount}`);
  console.log(`GitHub可访问: ${githubAccessible}`);
  console.log(`备用源可访问: ${altSourceAccessible}`);

  // 分类统计
  const byCategory = {};
  results.forEach(r => {
    if (!byCategory[r.category]) byCategory[r.category] = { total: 0, recommended: 0 };
    byCategory[r.category].total++;
    if (r.recommended) byCategory[r.category].recommended++;
  });

  console.log('\n=== 分类统计 ===');
  Object.entries(byCategory).forEach(([cat, stats]) => {
    console.log(`${cat}: ${stats.recommended}/${stats.total} 推荐`);
  });

  // 保存结果
  const reportPath = 'E:/a_shangzhan/OpenClaw_Skills/reports/file-network-tools-verification.json';
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    total: skills.length,
    recommended: accessibleCount,
    githubAccessible,
    altSourceAccessible,
    byCategory,
    skills: results
  }, null, 2));

  console.log(`\n报告已保存: ${reportPath}`);
}

// 执行验证
verifySkills().catch(console.error);
