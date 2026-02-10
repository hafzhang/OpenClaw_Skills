/**
 * Repository Verification Script for Phase 6 Batch 18
 * Configuration Management and Orchestration Tools (30 repositories)
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Repositories to verify
const repos = [
  // Ansible (10)
  'https://github.com/ansible/ansible',
  'https://github.com/ansible-community/ansible-build-data',
  'https://github.com/ansible/galaxy',
  'https://github.com/ansible/ansible-lint',
  'https://github.com/ansible-community/molecule',
  'https://github.com/ansible/ansible-navigator',
  'https://github.com/ansible/ansible-builder',
  'https://github.com/ansible/ansible-test',
  'https://github.com/ansible/awx',
  'https://github.com/ansible-semaphore/semaphore',

  // Terraform (8)
  'https://github.com/hashicorp/terraform',
  'https://github.com/hashicorp/terraform-plugin-sdk',
  'https://github.com/hashicorp/terraform-provider',
  'https://github.com/terraform-docs/terraform-docs',
  'https://github.com/hashicorp/terraform-json',
  'https://github.com/hashicorp/hcl',
  'https://github.com/hashicorp/terraform-svchost',
  'https://github.com/bridgecrewio/checkov',

  // Helm and Kubernetes (7)
  'https://github.com/helm/helm',
  'https://github.com/helm/chartmuseum',
  'https://github.com/helm/helm-file',
  'https://github.com/helm/helm-diff',
  'https://github.com/folkerts/helm-secrets',
  'https://github.com/helm/helm-2to3',
  'https://github.com/kubernetes-sigs/kustomize',

  // Other Configuration Management (5)
  'https://github.com/saltstack/salt',
  'https://github.com/puppetlabs/puppet',
  'https://github.com/chef/chef',
  'https://github.com/cfengine/core',
  'https://github.com/NixOS/nix'
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
  console.log('Phase 6 Batch 18 - Repository Verification');
  console.log('Configuration Management and Orchestration Tools');
  console.log('(Ansible/Terraform/Helm/SaltStack/Puppet/Chef)');
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
  const reportPath = path.join(__dirname, '..', 'reports', 'batch18-repos-verification.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    batch: 18,
    category: 'Configuration Management and Orchestration Tools',
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
