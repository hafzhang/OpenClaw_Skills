#!/usr/bin/env node

/**
 * Quality Check for GitHub Repositories (Lite Version)
 *
 * This script performs quality assessment based on existing verification data
 * without making additional API calls. It uses heuristics based on:
 * - HTTP status (200 = valid, 301 = redirected but may be valid, TIMEOUT = large repos)
 * - Repository name patterns
 * - Batch/category information
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  OUTPUT_PATH: path.join(__dirname, '../reports/phase6-quality-check.json'),
  SUMMARY_PATH: path.join(__dirname, '../docs/phase6-quality-check-summary.md'),
  AGGREGATED_REPOS_PATH: path.join(__dirname, '../reports/phase6-valid-repos-aggregated.json'),
  EXCLUSION_REPORT_PATH: path.join(__dirname, '../reports/phase6-exclusion-report.json'),
  BATCH_REPORTS_PATH: path.join(__dirname, '../reports')
};

// Quality categories
const QUALITY = {
  HIGH: 'HIGH_QUALITY',
  MEDIUM: 'MEDIUM_QUALITY',
  LOW: 'LOW_QUALITY',
  EXCLUDE: 'EXCLUDE'
};

/**
 * Parse repository owner/name from URL
 */
function parseGitHubUrl(url) {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
  if (match) {
    return { owner: match[1], repo: match[2].replace('.git', '') };
  }
  return null;
}

/**
 * Check if repository is likely high quality based on known patterns
 */
function isKnownHighQuality(repo) {
  const knownPatterns = [
    /vercel\/next\.js/,
    /facebook\/react/,
    /vuejs\/(vue|core)/,
    /microsoft\/(TypeScript|vscode)/,
    /nodejs\/node/,
    /rust-lang\/rust/,
    /golang\/go/,
    /python\/cpython/,
    /docker\/docker/,
    /kubernetes\/kubernetes/,
    /prometheus\/prometheus/,
    /grafana\/grafana/,
    /elastic\/(elasticsearch|kibana)/,
    /mongodb\/mongo/,
    /postgresql\/postgres/,
    /redis\/redis/,
    /nginx\/nginx/,
    /apache\/(kafka|spark)/,
    /actions\/(checkout|setup-)/,
    /ansible\/ansible/,
    /hashicorp\/(terraform|vault|consul)/,
    /jetbrains\//,
    /vim\/vim/,
    /neovim\/neovim/,
    /emacs-mirror\/emacs/,
    /tmux\/tmux/,
    /ohmyzsh\/ohmyzsh/,
    /starship\/starship/,
    /junegunn\/(fzf|vim-plug)/,
    /burntsushi\/(ripgrep|fd)/,
    /sharkdp\/(bat|exa|fd)/,
    /obsidianmd\/obsidian-/,
    /logseq\/logseq/,
    /notion-enhancer/,
    /openai\//,
    /anthropics\//,
    /langchain-ai/,
    /microsoft\/vscode/
  ];

  const repoPath = repo.repository || repo.url;
  for (const pattern of knownPatterns) {
    if (pattern.test(repoPath)) {
      return true;
    }
  }
  return false;
}

/**
 * Check if repository is likely low quality based on patterns
 */
function isLikelyLowQuality(repo) {
  const lowQualityPatterns = [
    /test.*test/i,
    /demo.*demo/i,
    /example.*example/i,
    /\.test$/,
    /\.demo$/,
    /sample-.*repo/i
  ];

  const repoPath = repo.repository || repo.url;
  for (const pattern of lowQualityPatterns) {
    if (pattern.test(repoPath)) {
      return true;
    }
  }
  return false;
}

/**
 * Determine quality category for a repository based on available data
 */
function assessQuality(repo) {
  const reasons = [];
  let category = QUALITY.MEDIUM;

  // Check HTTP status
  const status = repo.status || repo.sourceStatus || 'UNKNOWN';

  if (status === 'HTTP_200' || status === 200) {
    category = QUALITY.MEDIUM;
  } else if (status === 'TIMEOUT' || status === 'TIMEOUT_ERROR') {
    // TIMEOUT often means large repositories, which are usually high quality
    if (isKnownHighQuality(repo)) {
      category = QUALITY.HIGH;
    } else {
      category = QUALITY.MEDIUM;
      reasons.push('Timeout during verification (likely large repo)');
    }
  } else if (status === 301 || status === 'MOVED_PERMANENTLY') {
    category = QUALITY.MEDIUM;
    reasons.push('Repository moved (301 redirect)');
  } else if (status === 404 || status === 'NOT_FOUND') {
    category = QUALITY.EXCLUDE;
    reasons.push('Repository not found (404)');
    return { category, reasons };
  } else if (status === 'ERROR' || status === 'CONNECTION_ERROR') {
    category = QUALITY.EXCLUDE;
    reasons.push('Connection error during verification');
    return { category, reasons };
  }

  // Check if it's a known high-quality repository
  if (isKnownHighQuality(repo)) {
    category = QUALITY.HIGH;
    // Override any previous reasons
    reasons.length = 0;
  } else if (isLikelyLowQuality(repo)) {
    category = QUALITY.LOW;
    reasons.push('Appears to be a test/demo repository');
  }

  // Check for known project indicators
  const parsed = parseGitHubUrl(repo.url);
  if (parsed) {
    // Official organizations tend to have higher quality
    const officialOrgs = [
      'vercel', 'facebook', 'microsoft', 'google', 'amazon', 'apache',
      'nodejs', 'rust-lang', 'golang', 'python', 'docker', 'kubernetes',
      'prometheus', 'grafana', 'elastic', 'mongodb', 'redis', 'nginx',
      'jetbrains', 'vim', 'neovim', 'openai', 'anthropics', 'langchain-ai',
      'github', 'gitlab', 'bitnami', 'hashicorp', 'redhat', 'canonical'
    ];

    if (officialOrgs.includes(parsed.owner)) {
      if (category !== QUALITY.HIGH) {
        category = QUALITY.MEDIUM;
        reasons.push(`Official organization (${parsed.owner})`);
      }
    }

    // Check for org/repo pattern that indicates official projects
    if (parsed.repo.toLowerCase().startsWith(parsed.owner.toLowerCase().replace(/-org$/, ''))) {
      if (category !== QUALITY.HIGH) {
        category = QUALITY.MEDIUM;
      }
    }
  }

  return { category, reasons: reasons.length > 0 ? reasons : undefined };
}

/**
 * Load all repositories to check
 */
function loadRepositories() {
  console.log('📂 Loading repositories from reports...\n');

  const repos = [];
  const aggregatedPath = CONFIG.AGGREGATED_REPOS_PATH;

  // Load HTTP 200 repositories from aggregated file
  if (fs.existsSync(aggregatedPath)) {
    const aggregatedData = JSON.parse(fs.readFileSync(aggregatedPath, 'utf8'));

    // Check if the aggregated file has a repositories array or uses a different format
    if (aggregatedData.repositories && Array.isArray(aggregatedData.repositories)) {
      for (const repo of aggregatedData.repositories) {
        repos.push({
          url: repo.url,
          repository: repo.repository,
          category: repo.category,
          batch: repo.batch,
          sourceStatus: 'HTTP_200'
        });
      }
    } else {
      // The file uses the old format where repos are keys
      for (const key of Object.keys(aggregatedData)) {
        if (key === 'metadata' || key === 'summary') continue;
        const repo = aggregatedData[key];
        if (repo.url && repo.status === 'HTTP_200') {
          repos.push({
            url: repo.url,
            repository: repo.repository || key,
            category: repo.category,
            batch: repo.batch,
            sourceStatus: 'HTTP_200'
          });
        }
      }
    }
  }

  // Load TIMEOUT and 301 redirect repositories from exclusion report
  const exclusionPath = CONFIG.EXCLUSION_REPORT_PATH;
  if (fs.existsSync(exclusionPath)) {
    const exclusionData = JSON.parse(fs.readFileSync(exclusionPath, 'utf8'));

    for (const repo of exclusionData.timeoutRepos || []) {
      const parsed = parseGitHubUrl(repo.url);
      repos.push({
        url: repo.url,
        repository: repo.repository || (parsed ? `${parsed.owner}/${parsed.repo}` : null),
        category: repo.category,
        batch: repo.batch,
        sourceStatus: 'TIMEOUT'
      });
    }

    for (const repo of exclusionData.redirectRepos || []) {
      const parsed = parseGitHubUrl(repo.url);
      repos.push({
        url: repo.url,
        repository: repo.repository || (parsed ? `${parsed.owner}/${parsed.repo}` : null),
        category: repo.category,
        batch: repo.batch,
        sourceStatus: 'MOVED_PERMANENTLY'
      });
    }

    for (const repo of exclusionData.knownProjects || []) {
      const parsed = parseGitHubUrl(repo.url);
      repos.push({
        url: repo.url,
        repository: repo.repository || (parsed ? `${parsed.owner}/${parsed.repo}` : null),
        category: repo.category,
        batch: repo.batch,
        sourceStatus: 'KNOWN_PROJECT'
      });
    }
  }

  console.log(`📋 Loaded ${repos.length} repositories for quality check\n`);
  return repos;
}

/**
 * Process repositories and generate quality report
 */
function processRepositories(repositories) {
  const results = [];
  const summary = {
    totalRepositories: repositories.length,
    highQuality: { count: 0, repositories: [] },
    mediumQuality: { count: 0, repositories: [] },
    lowQuality: { count: 0, repositories: [], reasons: {} },
    excluded: { count: 0, repositories: [], reasons: {} },
    byCategory: {},
    byBatch: {},
    recommendations: []
  };

  console.log('🔍 Analyzing repository quality...\n');

  for (let i = 0; i < repositories.length; i++) {
    const repo = repositories[i];
    const { category, reasons } = assessQuality(repo);

    const result = {
      url: repo.url,
      repository: repo.repository,
      category: repo.category,
      batch: repo.batch,
      sourceStatus: repo.sourceStatus,
      quality: category,
      reasons: reasons
    };

    results.push(result);

    // Update summary
    if (category === QUALITY.HIGH) {
      summary.highQuality.count++;
      summary.highQuality.repositories.push({
        repository: repo.repository,
        url: repo.url,
        sourceStatus: repo.sourceStatus
      });
    } else if (category === QUALITY.MEDIUM) {
      summary.mediumQuality.count++;
      summary.mediumQuality.repositories.push({
        repository: repo.repository,
        url: repo.url,
        sourceStatus: repo.sourceStatus,
        reasons: reasons
      });
    } else if (category === QUALITY.LOW) {
      summary.lowQuality.count++;
      for (const reason of reasons || []) {
        summary.lowQuality.reasons[reason] = (summary.lowQuality.reasons[reason] || 0) + 1;
      }
    } else {
      summary.excluded.count++;
      for (const reason of reasons || []) {
        summary.excluded.reasons[reason] = (summary.excluded.reasons[reason] || 0) + 1;
      }
    }

    // Count by original category
    const cat = repo.category || 'Unknown';
    if (!summary.byCategory[cat]) {
      summary.byCategory[cat] = { total: 0, high: 0, medium: 0, low: 0, excluded: 0 };
    }
    summary.byCategory[cat].total++;
    if (category === QUALITY.HIGH) summary.byCategory[cat].high++;
    else if (category === QUALITY.MEDIUM) summary.byCategory[cat].medium++;
    else if (category === QUALITY.LOW) summary.byCategory[cat].low++;
    else summary.byCategory[cat].excluded++;

    // Count by batch
    const batch = repo.batch || 'Unknown';
    if (!summary.byBatch[batch]) {
      summary.byBatch[batch] = { total: 0, high: 0, medium: 0, low: 0, excluded: 0 };
    }
    summary.byBatch[batch].total++;
    if (category === QUALITY.HIGH) summary.byBatch[batch].high++;
    else if (category === QUALITY.MEDIUM) summary.byBatch[batch].medium++;
    else if (category === QUALITY.LOW) summary.byBatch[batch].low++;
    else summary.byBatch[batch].excluded++;

    // Progress indicator
    if ((i + 1) % 100 === 0) {
      process.stdout.write(`\r📊 Processed ${i + 1}/${repositories.length} repositories`);
    }
  }

  console.log(`\r✅ Processed ${repositories.length} repositories`);

  // Generate recommendations
  const includeRate = ((summary.highQuality.count + summary.mediumQuality.count) / summary.totalRepositories * 100).toFixed(1);

  if (summary.highQuality.count > 100) {
    summary.recommendations.push(`✅ Excellent quality: ${summary.highQuality.count} high-quality repositories found`);
  } else if (summary.highQuality.count > 50) {
    summary.recommendations.push(`✅ Good quality: ${summary.highQuality.count} high-quality repositories found`);
  }

  if (summary.mediumQuality.count > 200) {
    summary.recommendations.push(`📊 ${summary.mediumQuality.count} medium-quality repositories suitable for inclusion`);
  }

  if (summary.excluded.count > 0) {
    const topExclusionReason = Object.entries(summary.excluded.reasons)
      .sort((a, b) => b[1] - a[1])[0];
    if (topExclusionReason) {
      summary.recommendations.push(`⚠️  ${summary.excluded.count} repositories excluded - top reason: "${topExclusionReason[0]}" (${topExclusionReason[1]} repos)`);
    }
  }

  summary.recommendations.push(`🎯 Overall inclusion rate: ${includeRate}% (high + medium quality)`);

  return { results, summary };
}

/**
 * Generate markdown summary report
 */
function generateMarkdownReport(summary) {
  const lines = [];

  lines.push('# Phase 6 - Repository Quality Check Summary (Lite)');
  lines.push('');
  lines.push('**Generated:** ' + new Date().toISOString());
  lines.push('');
  lines.push('> **Note:** This is a lite quality check based on existing verification data.');
  lines.push('> Full quality assessment with GitHub API would provide more accurate results');
  lines.push('> but requires API authentication to avoid rate limits.');
  lines.push('');

  // Overview
  lines.push('## Overview');
  lines.push('');
  lines.push('| Metric | Count | Percentage |');
  lines.push('|--------|-------|------------|');
  lines.push(`| **Total Repositories** | **${summary.totalRepositories}** | **100%** |`);
  lines.push(`| High Quality | ${summary.highQuality.count} | ${((summary.highQuality.count / summary.totalRepositories) * 100).toFixed(1)}% |`);
  lines.push(`| Medium Quality | ${summary.mediumQuality.count} | ${((summary.mediumQuality.count / summary.totalRepositories) * 100).toFixed(1)}% |`);
  lines.push(`| Low Quality | ${summary.lowQuality.count} | ${((summary.lowQuality.count / summary.totalRepositories) * 100).toFixed(1)}% |`);
  lines.push(`| Excluded | ${summary.excluded.count} | ${((summary.excluded.count / summary.totalRepositories) * 100).toFixed(1)}% |`);
  lines.push('');

  // Quality Definitions
  lines.push('## Quality Criteria (Lite Version)');
  lines.push('');
  lines.push('### High Quality');
  lines.push('- Known official repositories (verified organizations)');
  lines.push('- Popular frameworks and tools');
  lines.push('- HTTP 200 verified with high confidence');
  lines.push('');
  lines.push('### Medium Quality');
  lines.push('- HTTP 200 verified repositories');
  lines.push('- TIMEOUT repositories (likely large, popular repos)');
  lines.push('- 301 redirects (moved but still valid)');
  lines.push('- Official organization repositories');
  lines.push('');
  lines.push('### Low Quality');
  lines.push('- Test/demo repositories (based on naming patterns)');
  lines.push('- Other quality concerns');
  lines.push('');
  lines.push('### Excluded');
  lines.push('- 404 - Repository not found');
  lines.push('- Connection errors');
  lines.push('');

  // Top High Quality Repositories
  if (summary.highQuality.repositories.length > 0) {
    lines.push('## High Quality Repositories');
    lines.push('');

    const sortedRepos = [...summary.highQuality.repositories].sort((a, b) =>
      (a.repository || '').localeCompare(b.repository || '')
    );

    for (const repo of sortedRepos) {
      const name = repo.repository.replace('/', ' / ');
      lines.push(`- [${name}](${repo.url})`);
    }
    lines.push('');
  }

  // By Category
  lines.push('## Quality by Category');
  lines.push('');
  lines.push('| Category | Total | High | Medium | Low | Excluded |');
  lines.push('|----------|-------|------|--------|-----|----------|');

  for (const [cat, stats] of Object.entries(summary.byCategory).sort((a, b) => b[1].total - a[1].total)) {
    lines.push(`| ${cat} | ${stats.total} | ${stats.high} | ${stats.medium} | ${stats.low} | ${stats.excluded} |`);
  }
  lines.push('');

  // By Batch
  lines.push('## Quality by Batch');
  lines.push('');
  lines.push('| Batch | Total | High | Medium | Low | Excluded |');
  lines.push('|-------|-------|------|--------|-----|----------|');

  for (const [batch, stats] of Object.entries(summary.byBatch).sort((a, b) => a[0].localeCompare(b[0]))) {
    lines.push(`| ${batch} | ${stats.total} | ${stats.high} | ${stats.medium} | ${stats.low} | ${stats.excluded} |`);
  }
  lines.push('');

  // Recommendations
  lines.push('## Recommendations');
  lines.push('');
  for (const rec of summary.recommendations) {
    lines.push(`- ${rec}`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('*This report was generated by the OpenClaw Hub quality check script (lite version)*');

  return lines.join('\n');
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 OpenClaw Hub - Repository Quality Check (Lite Version)');
  console.log('='.repeat(60));
  console.log('');

  // Load repositories
  const repositories = loadRepositories();

  if (repositories.length === 0) {
    console.error('❌ No repositories found to check');
    process.exit(1);
  }

  // Process repositories
  const { results, summary } = processRepositories(repositories);

  // Prepare output
  const output = {
    metadata: {
      title: 'Phase 6 - Repository Quality Check (Lite)',
      generatedAt: new Date().toISOString(),
      totalRepositories: repositories.length,
      note: 'Lite version based on existing verification data'
    },
    summary: summary,
    results: results
  };

  // Save JSON report
  console.log(`\n💾 Saving JSON report to ${CONFIG.OUTPUT_PATH}...`);
  fs.mkdirSync(path.dirname(CONFIG.OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(CONFIG.OUTPUT_PATH, JSON.stringify(output, null, 2));

  // Save markdown report
  console.log(`📝 Saving markdown report to ${CONFIG.SUMMARY_PATH}...`);
  fs.mkdirSync(path.dirname(CONFIG.SUMMARY_PATH), { recursive: true });
  fs.writeFileSync(CONFIG.SUMMARY_PATH, generateMarkdownReport(summary));

  console.log('\n✨ Quality check complete!');
  console.log('');
  console.log('Results Summary:');
  console.log(`  🌟 High Quality: ${summary.highQuality.count}`);
  console.log(`  📊 Medium Quality: ${summary.mediumQuality.count}`);
  console.log(`  ⚠️  Low Quality: ${summary.lowQuality.count}`);
  console.log(`  ❌ Excluded: ${summary.excluded.count}`);
  console.log('');
  console.log(`📄 Full report: ${CONFIG.OUTPUT_PATH}`);
  console.log(`📄 Summary: ${CONFIG.SUMMARY_PATH}`);
}

// Run
main().catch(console.error);
