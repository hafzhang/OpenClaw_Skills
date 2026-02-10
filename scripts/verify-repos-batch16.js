/**
 * Repository Verification Script for Phase 6 Batch 16
 * Cloud Platform Tools (57 repositories)
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Repositories to verify
const repos = [
  // AWS (15)
  'https://github.com/aws/aws-cli',
  'https://github.com/boto/boto3',
  'https://github.com/aws/aws-sdk-js',
  'https://github.com/aws/aws-sdk-go',
  'https://github.com/aws/aws-sdk-java',
  'https://github.com/aws/aws-cdk',
  'https://github.com/aws/aws-sam-cli',
  'https://github.com/aws/copilot-cli',
  'https://github.com/aws/aws-elastic-beanstalk-cli',
  'https://github.com/localstack/localstack',
  'https://github.com/awslabs/aws-lambda-adapter',
  'https://github.com/aws-observability/aws-otel-collector',
  'https://github.com/aws/aws-encryption-sdk-python',
  'https://github.com/aws/aws-sdk-ruby',

  // Google Cloud Platform (12)
  'https://github.com/googleapis/google-cloud-sdk',
  'https://github.com/googleapis/python-api-core',
  'https://github.com/googleapis/google-api-go-client',
  'https://github.com/googleapis/google-api-nodejs-client',
  'https://github.com/googleapis/google-api-java-client',
  'https://github.com/hashicorp/terraform-provider-google',
  'https://github.com/hashicorp/terraform-provider-google-beta',
  'https://github.com/GoogleCloudPlatform/cloud-foundation-toolkit',
  'https://github.com/GoogleCloudPlatform/functions-framework',
  'https://github.com/GoogleCloudPlatform/cloud-sql-proxy',
  'https://github.com/GoogleContainerTools/kaniko',
  'https://github.com/GoogleContainerTools/skaffold',

  // Microsoft Azure (12)
  'https://github.com/Azure/azure-cli',
  'https://github.com/Azure/azure-powershell',
  'https://github.com/Azure/azure-sdk-for-python',
  'https://github.com/Azure/azure-sdk-for-go',
  'https://github.com/Azure/azure-sdk-for-js',
  'https://github.com/Azure/azure-sdk-for-java',
  'https://github.com/Azure/azure-functions-core-tools',
  'https://github.com/Azure/AzureStorageExplorer',
  'https://github.com/hashicorp/terraform-provider-azurerm',
  'https://github.com/Azure/bicep',
  'https://github.com/Azure/azure-container-apps',
  'https://github.com/Azure/azure-dev',

  // DigitalOcean (8)
  'https://github.com/digitalocean/doctl',
  'https://github.com/digitalocean/terraform-provider-digitalocean',
  'https://github.com/digitalocean/api-go',
  'https://github.com/digitalocean/csi-digitalocean',
  'https://github.com/digitalocean/digitalocean-cloud-controller-manager',
  'https://github.com/digitalocean/droplet-agent',
  'https://github.com/digitalocean/community-tools',

  // Multi-cloud / HashiCorp (10)
  'https://github.com/hashicorp/terraform',
  'https://github.com/hashicorp/packer',
  'https://github.com/hashicorp/vault',
  'https://github.com/hashicorp/nomad',
  'https://github.com/hashicorp/consul',
  'https://github.com/hashicorp/boundary',
  'https://github.com/hashicorp/waypoint',
  'https://github.com/crossplane/crossplane',
  'https://github.com/kubernetes-sigs/cluster-api',
  'https://github.com/spinnaker/spinnaker'
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
  console.log('Phase 6 Batch 16 - Repository Verification');
  console.log('Cloud Platform Tools (AWS/GCP/Azure/DigitalOcean/Multi-cloud)');
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
  const reportPath = path.join(__dirname, '..', 'reports', 'batch16-repos-verification.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    batch: 16,
    category: 'Cloud Platform Tools',
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
