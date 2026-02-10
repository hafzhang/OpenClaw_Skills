/**
 * Repository Verification Script for Phase 6 Batch 17
 * Monitoring and Logging Tools (30 repositories)
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Repositories to verify
const repos = [
  // Prometheus (8)
  'https://github.com/prometheus/prometheus',
  'https://github.com/prometheus/alertmanager',
  'https://github.com/prometheus/pushgateway',
  'https://github.com/prometheus/node_exporter',
  'https://github.com/prometheus/blackbox_exporter',
  'https://github.com/prometheus-community/postgres_exporter',
  'https://github.com/prometheus/mysqld_exporter',
  'https://github.com/oliver006/redis_exporter',

  // Grafana (8)
  'https://github.com/grafana/grafana',
  'https://github.com/grafana/loki',
  'https://github.com/grafana/tempo',
  'https://github.com/grafana/pyroscope',
  'https://github.com/grafana/mimir',
  'https://github.com/grafana/agent',
  'https://github.com/grafana/k6',
  'https://github.com/grafana/beyla',

  // ELK Stack (8)
  'https://github.com/elastic/elasticsearch',
  'https://github.com/elastic/logstash',
  'https://github.com/elastic/kibana',
  'https://github.com/elastic/beats',
  'https://github.com/elastic/apm-server',
  'https://github.com/elastic/elastic-agent',

  // Other Monitoring Tools (6)
  'https://github.com/influxdata/influxdb',
  'https://github.com/influxdata/telegraf',
  'https://github.com/VictoriaMetrics/VictoriaMetrics',
  'https://github.com/thanos-io/thanos',
  'https://github.com/cortexproject/cortex',
  'https://github.com/zabbix/zabbix'
];

// Results storage
const results = [];
let successCount = 0;
let failCount = 0;
let timeoutCount = 0;
let errorCount = 0;
let redirectCount = 0;

/**
 * Perform HTTP HEAD request to check repository accessibility
 */
function checkRepo(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;

    const options = {
      method: 'HEAD',
      host: urlObj.hostname,
      path: urlObj.pathname,
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OpenClaw-Hub/1.0)'
      }
    };

    const req = client.request(options, (res) => {
      let redirectUrl = null;
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        redirectUrl = res.headers.location;
      }

      resolve({
        url,
        status: res.statusCode,
        redirectUrl,
        success: res.statusCode === 200
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        redirectUrl: null,
        success: false
      });
    });

    req.on('error', (err) => {
      resolve({
        url,
        status: `ERROR: ${err.message}`,
        redirectUrl: null,
        success: false
      });
    });

    req.end();
  });
}

/**
 * Main verification function
 */
async function verifyRepos() {
  console.log('='.repeat(60));
  console.log('Phase 6 Batch 17 - Repository Verification');
  console.log('Monitoring and Logging Tools (Prometheus/Grafana/ELK/Other)');
  console.log(`Total repositories: ${repos.length}`);
  console.log('='.repeat(60));

  const total = repos.length;

  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i];
    const repoName = repo.split('/').pop();

    process.stdout.write(`\r[${i + 1}/${total}] Checking ${repoName}...`);

    const result = await checkRepo(repo);
    results.push(result);

    if (result.success) {
      successCount++;
    } else if (result.status === 'TIMEOUT') {
      timeoutCount++;
    } else if (typeof result.status === 'string' && result.status.startsWith('ERROR')) {
      errorCount++;
    } else {
      failCount++;
    }

    if (result.redirectUrl) {
      redirectCount++;
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('\n\n' + '='.repeat(60));
  console.log('Verification Complete');
  console.log('='.repeat(60));

  // Print summary
  console.log(`\nSummary:`);
  console.log(`  Total: ${total}`);
  console.log(`  Success (HTTP 200): ${successCount} (${((successCount / total) * 100).toFixed(1)}%)`);
  console.log(`  Timeout: ${timeoutCount} (${((timeoutCount / total) * 100).toFixed(1)}%)`);
  console.log(`  Error: ${errorCount} (${((errorCount / total) * 100).toFixed(1)}%)`);
  console.log(`  Other Failures: ${failCount} (${((failCount / total) * 100).toFixed(1)}%)`);
  console.log(`  Redirects (301/302): ${redirectCount}`);

  // Print failed repositories
  console.log('\n' + '-'.repeat(60));
  console.log('Failed Repositories:');
  console.log('-'.repeat(60));

  const failed = results.filter(r => !r.success);
  failed.forEach(r => {
    console.log(`  [${r.status}] ${r.url}`);
    if (r.redirectUrl) {
      console.log(`    -> Redirects to: ${r.redirectUrl}`);
    }
  });

  // Save results to JSON
  const reportPath = path.join(__dirname, '..', 'reports', 'batch17-repos-verification.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    batch: 17,
    category: 'Monitoring and Logging Tools',
    total: total,
    summary: {
      success: successCount,
      timeout: timeoutCount,
      error: errorCount,
      fail: failCount,
      redirect: redirectCount
    },
    results: results
  }, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log(`Report saved to: ${reportPath}`);
  console.log('='.repeat(60));
}

// Run verification
verifyRepos().catch(console.error);
