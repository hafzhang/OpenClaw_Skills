/**
 * Repository Verification Script for Phase 6 Batch 14
 * Container Technology (50 repositories)
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Repositories to verify
const repos = [
  // Docker Core Tools (12)
  'https://github.com/docker/engine-ce',
  'https://github.com/docker/cli',
  'https://github.com/moby/buildkit',
  'https://github.com/docker/compose',
  'https://github.com/docker/machine',
  'https://github.com/distribution/distribution',
  'https://github.com/docker/swarmkit',
  'https://github.com/docker/app',
  'https://github.com/moby/moby',
  'https://github.com/linuxkit/linuxkit',

  // Podman Ecosystem (8)
  'https://github.com/containers/podman',
  'https://github.com/containers/podman-compose',
  'https://github.com/containers/buildah',
  'https://github.com/containers/skopeo',
  'https://github.com/cri-o/cri-o',
  'https://github.com/containers/podman-desktop',

  // LXD/LXC Containers (6)
  'https://github.com/lxc/lxd',
  'https://github.com/lxc/lxc',
  'https://github.com/lxc/lxcfs',
  'https://github.com/lxc/incus',
  'https://github.com/lxc/distrobuilder',
  'https://github.com/lxc/lxd-ui',

  // Kubernetes Core (10)
  'https://github.com/kubernetes/kubernetes',
  'https://github.com/kubernetes/kubectl',
  'https://github.com/etcd-io/etcd',
  'https://github.com/containerd/containerd',
  'https://github.com/opencontainers/runc',
  'https://github.com/containernetworking/plugins',

  // Kubernetes Tools Ecosystem (8)
  'https://github.com/helm/helm',
  'https://github.com/kubernetes-sigs/kustomize',
  'https://github.com/argoproj/argo-cd',
  'https://github.com/kubernetes/minikube',
  'https://github.com/kubernetes-sigs/kind',
  'https://github.com/k3s-io/k3s',
  'https://github.com/kubernetes/kops',

  // Container Security (6)
  'https://github.com/aquasecurity/trivy',
  'https://github.com/quay/clair',
  'https://github.com/falcosecurity/falco',
  'https://github.com/notaryproject/notary',
  'https://github.com/anchore/grype',
  'https://github.com/kata-containers/kata-containers'
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
  console.log('Phase 6 Batch 14 - Repository Verification');
  console.log('Container Technology (Docker/Podman/LXD/Kubernetes)');
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
  const reportPath = path.join(__dirname, '..', 'reports', 'batch14-repos-verification.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    batch: 14,
    category: 'Container Technology',
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
