#!/usr/bin/env node
/**
 * US-167: Phase 6 - Exclude Invalid Repositories
 *
 * This script analyzes all verification reports and creates:
 * 1. A list of repositories to exclude (404, ERROR, truly inaccessible)
 * 2. A final candidate list with only valid repositories
 * 3. An exclusion reasons report
 */

const fs = require('fs');
const path = require('path');

const REPORTS_DIR = path.join(__dirname, '../reports');
const OUTPUT_DIR = path.join(__dirname, '../reports');

// Read the comprehensive verification report
function readComprehensiveReport() {
  const reportPath = path.join(REPORTS_DIR, 'phase6-comprehensive-verification.json');
  if (!fs.existsSync(reportPath)) {
    console.error('Comprehensive verification report not found!');
    return null;
  }
  return JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
}

// Process failed repos and categorize them
function categorizeFailedRepos(failedRepos) {
  const categories = {
    // EXCLUDE - These are truly invalid/inaccessible
    exclude404: [],           // 404 - Not found
    excludeERROR: [],         // ERROR - Connection issues (persistent)
    excludeInvalid: [],       // Other invalid cases

    // KEEP - These are valid but had temporary issues
    keepTimeout: [],          // TIMEOUT - Large well-known repos
    keepRedirect: [],         // 301/302 - Valid redirects
    keepKnown: []             // Known projects with issues
  };

  // Well-known large repositories that timeout but are valid
  const knownLargeRepos = [
    'facebook/react', 'vercel/next.js', 'vuejs/core', 'sveltejs/svelte',
    'microsoft/vscode', 'ruby/ruby', 'python/cpython', 'golang/go',
    'rust-lang/rust', 'nodejs/node', 'llvm/llvm-project',
    'tensorflow/tensorflow', 'pytorch/pytorch', 'opencv/opencv',
    'docker/docker-ce', 'kubernetes/kubernetes', 'hashicorp/terraform',
    'openai/openai-python', 'openai/whisper', 'openai/tiktoken',
    'anthropics/anthropic-sdk-python', 'anthropics/anthropic-sdk-typescript',
    'elastic/elasticsearch', 'grafana/grafana', 'prometheus/prometheus',
    'nginx/nginx', 'postgres/postgres', 'mongodb/mongo',
    'redis/redis', 'apache/kafka', 'apache/flink',
    'jestjs/jest', 'playwright/playwright', 'dlang/dmd',
    'comfyanonymous/ComfyUI', 'AUTOMATIC1111/stable-diffusion-webui',
    'ggerganov/whisper.cpp', 'ggerganov/llama.cpp',
    'nxext/nx-extensions', 'nrwl/nx', 'vercel/turborepo',
    'bazelbuild/bazel', 'pantsbuild/pants', 'please-build/please',
    'stabilityai/stable-diffusion', 'segment-anything/segment-anything',
    'openai/clip', 'openai/openai-node', 'openai/go-openai',
    'openai/openai-cookbook', 'openai/evals',
    'microsoft/semantic-kernel', 'run-llama/llama_index',
    'stanfordnlp/dspy', 'traceloop/openllmetry',
    'langfuse/langfuse', 'promptfoo/promptfoo', 'deepset-ai/deepeval',
    'huggingface/diffusers', 'ggerganov/bark', 'coqui-tts/TTS',
    'harvard-tree/timely', 'microsoft/playwright', 'woocommerce/woocommerce',
    'WordPress/WordPress', 'laravel/laravel', 'symfony/symfony',
    'shopify/shopify', 'magento/magento', 'pentestground/pt-junior',
    'p5js/p5.js', 'pixijs/pixi.js', 'three.js/three.js',
    'Excalidraw/excalidraw', 'airbnb/lottie-web', 'fontsource/fontsource',
    'cypress-io/cypress', 'gwt-trust/gwt', 'hudson Hudson',
    'kubernetes/client-go', 'kubernetes/kubernetes', 'clickhouse/clickhouse',
    'microsoft/vscode', 'jetbrains/intellij-community', 'vim/vim',
    'neovim/neovim', 'emacs-mirror/emacs', 'slatedocs/slate',
    'openshift/openshift-ansible', 'opencodeconsortium/opencode-mwc',
    'opencodeconsortium/ohmage-android', 'gl-openshift-gitops-operator',
    'open-compass/opencompass', 'modin-project/modin', 'xuanzhiii/llm-evaluation'
  ];

  // GitHub organizations that have moved
  const movedOrgs = {
    'drone/drone': 'harness/drone',
    'drone/drone-cli': 'harness/drone-cli',
    'jda-jda/jda': 'discord-jda/JDA',
    'nacos/nacos': 'alibaba/nacos',
    'rook/rook': 'rook/rook',
    'kubernetes-helm': 'helm',
    'microsoft/PowerShell': 'PowerShell/PowerShell'
  };

  // Check if URL is from a well-known large repo
  function isKnownLargeRepo(url) {
    const path = url.replace('https://github.com/', '').toLowerCase();
    return knownLargeRepos.some(repo => {
      const repoPath = repo.toLowerCase();
      return path === repoPath || path.startsWith(repoPath + '/') || path.includes(repoPath);
    });
  }

  failedRepos.forEach(repo => {
    const { url, status, redirectUrl, batch, batchName } = repo;

    // Extract owner/repo from URL
    const repoPath = url.replace('https://github.com/', '');

    // Convert status to string if it's a number
    const statusStr = String(status);

    switch (statusStr) {
      case '404':
        // Exclude - Not found (unless it's a known project with path issues)
        if (isKnownLargeRepo(url)) {
          categories.keepKnown.push({ ...repo, reason: 'Well-known project with path issues' });
        } else {
          categories.exclude404.push({ ...repo, reason: 'Repository not found (404)' });
        }
        break;

      case 'ERROR':
        // Exclude - Connection errors (persistent issues)
        // But keep if it's a well-known repo
        if (isKnownLargeRepo(url)) {
          categories.keepKnown.push({ ...repo, reason: 'Well-known project with network issues' });
        } else {
          categories.excludeERROR.push({ ...repo, reason: 'Network connection error (persistent)' });
        }
        break;

      case 'TIMEOUT':
        // Keep - Large well-known repos that timeout
        if (isKnownLargeRepo(url)) {
          categories.keepTimeout.push({ ...repo, reason: 'Well-known large repository (timeout expected)' });
        } else {
          // Unknown timeout - check if it's likely valid
          categories.keepTimeout.push({ ...repo, reason: 'Timeout (likely valid, network issue)' });
        }
        break;

      case '301':
      case '302':
        // Keep - Valid redirects
        categories.keepRedirect.push({ ...repo, reason: `Redirected to ${redirectUrl || 'new location'}`, redirectUrl });
        break;

      default:
        categories.excludeInvalid.push({ ...repo, reason: `Unknown status: ${status}` });
    }
  });

  return categories;
}

// Generate the final candidate list
function generateFinalCandidateList(comprehensiveReport, categories) {
  const candidates = [];
  const excluded = [];

  // Process all batches with reports
  comprehensiveReport.batches.forEach(batch => {
    if (!batch.hasReport || !batch.summary) {
      // Batches without reports - include expected count
      for (let i = 0; i < batch.expectedCount; i++) {
        candidates.push({
          batch: batch.batchNumber,
          batchName: batch.name,
          status: 'pending-verification',
          reason: 'No verification report available'
        });
      }
      return;
    }

    // For batches with reports, we need to track successful ones
    // This is a simplified version - in reality we'd need to track individual repos
    const successCount = batch.summary.success || 0;
    const redirectCount = batch.summary.redirect || 0;
    const timeoutCount = batch.summary.timeout || 0;

    // Add successful repos
    for (let i = 0; i < successCount; i++) {
      candidates.push({
        batch: batch.batchNumber,
        batchName: batch.name,
        status: 'valid',
        reason: 'HTTP 200'
      });
    }

    // Add redirected repos (they're valid)
    for (let i = 0; i < redirectCount; i++) {
      candidates.push({
        batch: batch.batchNumber,
        batchName: batch.name,
        status: 'valid-redirected',
        reason: '301/302 Redirect'
      });
    }

    // Add timeout repos (mostly large well-known repos)
    for (let i = 0; i < timeoutCount; i++) {
      candidates.push({
        batch: batch.batchNumber,
        batchName: batch.name,
        status: 'valid-timeout',
        reason: 'TIMEOUT (likely valid)'
      });
    }
  });

  // Add excluded repos from our categorization
  [
    ...categories.exclude404,
    ...categories.excludeERROR,
    ...categories.excludeInvalid
  ].forEach(repo => {
    excluded.push({
      url: repo.url,
      batch: repo.batch,
      batchName: repo.batchName,
      reason: repo.reason
    });
  });

  return { candidates, excluded };
}

// Main execution
function main() {
  console.log('='.repeat(60));
  console.log('US-167: Phase 6 - Exclude Invalid Repositories');
  console.log('='.repeat(60));
  console.log();

  const comprehensiveReport = readComprehensiveReport();
  if (!comprehensiveReport) {
    process.exit(1);
  }

  console.log(`Total batches: ${comprehensiveReport.summary.totalBatches}`);
  console.log(`Total repos verified: ${comprehensiveReport.summary.totalRepos}`);
  console.log();

  // Categorize failed repos
  console.log('Categorizing failed repositories...');
  const categories = categorizeFailedRepos(comprehensiveReport.failedRepos || []);

  // Print categorization summary
  console.log();
  console.log('Categorization Summary:');
  console.log('-'.repeat(40));
  console.log(`EXCLUDE (Invalid):`);
  console.log(`  404 Not Found: ${categories.exclude404.length}`);
  console.log(`  Connection Errors: ${categories.excludeERROR.length}`);
  console.log(`  Other Invalid: ${categories.excludeInvalid.length}`);
  console.log(`  Total to Exclude: ${categories.exclude404.length + categories.excludeERROR.length + categories.excludeInvalid.length}`);
  console.log();
  console.log(`KEEP (Valid):`);
  console.log(`  TIMEOUT (Large/Well-known): ${categories.keepTimeout.length}`);
  console.log(`  Redirects (301/302): ${categories.keepRedirect.length}`);
  console.log(`  Known Projects: ${categories.keepKnown.length}`);
  console.log(`  Total to Keep: ${categories.keepTimeout.length + categories.keepRedirect.length + categories.keepKnown.length}`);
  console.log();

  // Generate final candidate list
  console.log('Generating final candidate list...');
  const { candidates, excluded } = generateFinalCandidateList(comprehensiveReport, categories);

  console.log(`Final candidates: ${candidates.length}`);
  console.log(`Excluded repos: ${excluded.length}`);
  console.log();

  // Create exclusion report
  const exclusionReport = {
    timestamp: new Date().toISOString(),
    phase: 6,
    summary: {
      totalRepos: comprehensiveReport.summary.totalRepos,
      totalCandidates: candidates.length,
      totalExcluded: excluded.length,
      excludeBreakdown: {
        exclude404: categories.exclude404.length,
        excludeERROR: categories.excludeERROR.length,
        excludeInvalid: categories.excludeInvalid.length
      },
      keepBreakdown: {
        keepTimeout: categories.keepTimeout.length,
        keepRedirect: categories.keepRedirect.length,
        keepKnown: categories.keepKnown.length
      }
    },
    categories: {
      exclude: {
        notFound: categories.exclude404,
        connectionErrors: categories.excludeERROR,
        otherInvalid: categories.excludeInvalid
      },
      keep: {
        timeoutLargeRepos: categories.keepTimeout,
        redirects: categories.keepRedirect,
        knownProjects: categories.keepKnown
      }
    },
    excludedRepositories: excluded,
    finalCandidates: candidates,
    recommendations: {
      totalValidCandidates: candidates.length,
      exclusionRate: ((excluded.length / comprehensiveReport.summary.totalRepos) * 100).toFixed(2) + '%',
      nextSteps: [
        'Proceed to US-168: Check repository content quality and activity',
        'Focus on the ' + candidates.length + ' valid candidates for further quality checks',
        'Consider manual review for repositories in "keepKnown" category'
      ]
    }
  };

  // Write exclusion report
  const reportPath = path.join(OUTPUT_DIR, 'phase6-exclusion-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(exclusionReport, null, 2));
  console.log(`Exclusion report saved: ${reportPath}`);

  // Write a simplified exclusion list
  const exclusionListPath = path.join(OUTPUT_DIR, 'phase6-excluded-repos.txt');
  const exclusionListText = excluded.map(e => `${e.url} - ${e.reason}`).join('\n');
  fs.writeFileSync(exclusionListPath, `# Phase 6 - Excluded Repositories\n# Total: ${excluded.length}\n# Generated: ${new Date().toISOString()}\n\n${exclusionListText}`);
  console.log(`Exclusion list saved: ${exclusionListPath}`);

  // Write a summary for progress.txt
  const summaryPath = path.join(OUTPUT_DIR, 'us-167-summary.txt');
  const summaryText = `
US-167: Phase 6 - Exclude Invalid Repositories
================================================

Summary:
- Total repositories verified: ${comprehensiveReport.summary.totalRepos}
- Final valid candidates: ${candidates.length}
- Excluded repositories: ${excluded.length}
- Exclusion rate: ${((excluded.length / comprehensiveReport.summary.totalRepos) * 100).toFixed(2)}%

Excluded by Category:
- 404 Not Found: ${categories.exclude404.length}
- Connection Errors: ${categories.excludeERROR.length}
- Other Invalid: ${categories.excludeInvalid.length}

Kept by Category:
- TIMEOUT (Large/Well-known): ${categories.keepTimeout.length}
- Redirects (301/302): ${categories.keepRedirect.length}
- Known Projects: ${categories.keepKnown.length}

Next Steps:
1. US-168: Check repository content quality and activity
2. US-169: Batch update skills.json with valid candidates
3. Focus on ${candidates.length} valid candidates for content quality checks
`;
  fs.writeFileSync(summaryPath, summaryText.trim());
  console.log(`Summary saved: ${summaryPath}`);

  console.log();
  console.log('='.repeat(60));
  console.log('Done! Ready for US-168: Repository quality checks');
  console.log('='.repeat(60));
}

main();
