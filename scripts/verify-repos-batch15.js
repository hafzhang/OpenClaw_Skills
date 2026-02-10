/**
 * Repository Verification Script for Phase 6 Batch 15
 * CI/CD Tools (60 repositories)
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Repositories to verify
const repos = [
  // GitHub Actions Core (12)
  'https://github.com/actions/runner',
  'https://github.com/actions/toolkit',
  'https://github.com/actions/core',
  'https://github.com/actions/exec',
  'https://github.com/actions/github',
  'https://github.com/actions/glob',
  'https://github.com/actions/io',
  'https://github.com/actions/http-client',
  'https://github.com/actions/cache',
  'https://github.com/actions/upload-artifact',
  'https://github.com/actions/download-artifact',

  // GitHub Actions Community (10)
  'https://github.com/actions/checkout',
  'https://github.com/actions/setup-node',
  'https://github.com/actions/setup-python',
  'https://github.com/actions/setup-go',
  'https://github.com/actions/setup-java',
  'https://github.com/docker/setup-buildx-action',
  'https://github.com/docker/login-action',
  'https://github.com/docker/build-push-action',
  'https://github.com/actions/github-script',
  'https://github.com/actions/labeler',

  // GitLab CI/CD (10)
  'https://github.com/gitlab-org/gitlab-runner',
  'https://github.com/gitlab-org/gitlab-ci-templates',
  'https://github.com/gitlab-org/fleet',
  'https://github.com/gitlab-org/gl-openshift-gitops-operator',
  'https://github.com/gitlab-org/container-registry',
  'https://github.com/gitlab-org/gitlab-shell',
  'https://github.com/gitlab-org/gitaly',
  'https://github.com/gitlab-org/gitlab-pages',
  'https://github.com/gitlab-org/cluster-integration',

  // Jenkins (8)
  'https://github.com/jenkinsci/jenkins',
  'https://github.com/jenkinsci/pipeline-model-definition',
  'https://github.com/jenkinsci/docker-agent',
  'https://github.com/jenkinsci/kubernetes-plugin',
  'https://github.com/jenkinsci/git-plugin',
  'https://github.com/jenkinsci/credentials-plugin',
  'https://github.com/jenkinsci/remoting',

  // Drone CI (5)
  'https://github.com/drone/drone',
  'https://github.com/drone/drone-cli',
  'https://github.com/drone/go-scm',
  'https://github.com/drone/drone-docker',
  'https://github.com/drone/drone-exec',

  // Other CI/CD Tools (15)
  'https://github.com/buildbot/buildbot',
  'https://github.com/concourse/concourse',
  'https://github.com/gocd/gocd',
  'https://github.com/zuul/zuul',
  'https://github.com/GoogleChrome/lighthouse-ci',
  'https://github.com/dagger/dagger',
  'https://github.com/earthly/earthly',
  'https://github.com/nrwl/nx',
  'https://github.com/vercel/turborepo',
  'https://github.com/bazelbuild/bazel',
  'https://github.com/pantsbuild/pants',
  'https://github.com/thought-machine/please',
  'https://github.com/wolfi-dev/wolfi'
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
  console.log('Phase 6 Batch 15 - Repository Verification');
  console.log('CI/CD Tools (GitHub Actions/GitLab/Jenkins/Drone/Others)');
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
  const reportPath = path.join(__dirname, '..', 'reports', 'batch15-repos-verification.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    batch: 15,
    category: 'CI/CD Tools',
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
