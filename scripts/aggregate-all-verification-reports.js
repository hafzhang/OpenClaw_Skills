/**
 * Comprehensive Batch Verification Report Aggregator
 * Aggregates all Phase 6 batch verification reports into a single comprehensive report
 */

const fs = require('fs');
const path = require('path');

// Batch information
const batches = [
  { number: 1, file: null, name: 'Development - Programming Languages', count: 50 },
  { number: 2, file: 'batch2-repos-verification.json', name: 'Development - Frontend Ecosystem', count: 50 },
  { number: 3, file: null, name: 'Development - Backend Ecosystem', count: 50 },
  { number: 4, file: 'batch4-repos-verification.json', name: 'Development - Database & Tools', count: 92 },
  { number: 5, file: 'batch5-repos-verification.json', name: 'Productivity - Editors & Notes', count: 115 },
  { number: 6, file: 'batch6-repos-verification.json', name: 'Productivity - Terminals & Utilities', count: 70 },
  { number: 7, file: 'batch7-repos-verification.json', name: 'Development - IDE Plugins', count: 40 },
  { number: 8, file: 'batch8-repos-verification.json', name: 'Productivity - Editors & IDEs', count: 50 },
  { number: 9, file: 'batch9-repos-verification.json', name: 'Productivity - Notes & Knowledge', count: 50 },
  { number: 10, file: 'batch10-repos-verification.json', name: 'Productivity - Terminals & Shells', count: 50 },
  { number: 11, file: 'batch11-repos-verification.json', name: 'Productivity - Efficiency Tools', count: 50 },
  { number: 12, file: 'batch12-repos-verification.json', name: 'Productivity - Design & Creative', count: 40 },
  { number: 13, file: 'batch13-repos-verification.json', name: 'Productivity - Collaboration', count: 39 },
  { number: 14, file: 'batch14-repos-verification.json', name: 'DevOps - Container Tech', count: 41 },
  { number: 15, file: 'batch15-repos-verification.json', name: 'DevOps - CI/CD', count: 55 },
  { number: 16, file: 'batch16-repos-verification.json', name: 'DevOps - Cloud Platforms', count: 55 },
  { number: 17, file: 'batch17-repos-verification.json', name: 'DevOps - Monitoring & Logging', count: 28 },
  { number: 18, file: 'batch18-repos-verification.json', name: 'DevOps - Config Management', count: 30 },
  { number: 19, file: 'batch19-repos-verification.json', name: 'AI/LLMs - AI Tools & Platforms', count: 75 },
  { number: 20, file: 'batch20-repos-verification.json', name: 'AI/LLMs - LLM Libraries', count: 70 },
  { number: 21, file: 'batch21-repos-verification.json', name: 'Utilities - System Tools', count: 30 },
  { number: 22, file: 'batch22-repos-verification.json', name: 'Utilities - File & Network', count: 32 },
  { number: 23, file: 'file-network-tools-verification.json', name: 'Utilities - File Network Tools', count: 29 },
];

/**
 * Load verification report from file
 */
function loadReport(filename) {
  const reportPath = path.join(__dirname, '..', 'reports', filename);
  if (!fs.existsSync(reportPath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  } catch (err) {
    console.error(`Error loading ${filename}: ${err.message}`);
    return null;
  }
}

/**
 * Main aggregation function
 */
function aggregateReports() {
  console.log('='.repeat(80));
  console.log('Phase 6 - Comprehensive Batch Verification Report Aggregator');
  console.log('Aggregating all batch verification reports...');
  console.log('='.repeat(80));

  const aggregated = {
    timestamp: new Date().toISOString(),
    phase: 6,
    batches: [],
    summary: {
      totalBatches: batches.length,
      totalRepos: 0,
      totalSuccess: 0,
      totalTimeout: 0,
      totalError: 0,
      totalFail: 0,
      totalRedirect: 0,
      batchesWithReports: 0,
      batchesWithoutReports: []
    },
    failedRepos: [],
    redirectedRepos: [],
    timeoutRepos: [],
    categoryBreakdown: {}
  };

  for (const batch of batches) {
    let report = null;

    if (batch.file) {
      report = loadReport(batch.file);
    }

    let summaryStats = null;
    if (report && report.summary) {
      // Handle different summary formats
      // Format 1: { success, timeout, error, fail, redirect }
      // Format 2: { total, success, notFound, timeout, redirect, error }
      summaryStats = {
        total: report.summary.total || report.total || 0,
        success: report.summary.success || 0,
        timeout: report.summary.timeout || 0,
        error: report.summary.error || 0,
        fail: (report.summary.fail || report.summary.notFound || 0),
        redirect: report.summary.redirect || 0
      };

      // For format 2, calculate success from results
      if (report.results && !report.summary.success) {
        const successCount = report.results.filter(r => {
          const status = r.status;
          return status === 200 || (r.success === true);
        }).length;
        summaryStats.success = successCount;
        summaryStats.fail = report.results.length - successCount;
      }
    }

    const batchResult = {
      batchNumber: batch.number,
      name: batch.name,
      expectedCount: batch.count,
      hasReport: !!report,
      summary: summaryStats
    };

    if (report) {
      aggregated.summary.batchesWithReports++;
      const summary = batchResult.summary;
      if (summary) {
        aggregated.summary.totalRepos += summary.total;
        aggregated.summary.totalSuccess += summary.success;
        aggregated.summary.totalTimeout += summary.timeout;
        aggregated.summary.totalError += summary.error;
        aggregated.summary.totalFail += summary.fail;
        aggregated.summary.totalRedirect += summary.redirect;
      }

      // Collect failed repos
      if (report.results) {
        for (const result of report.results) {
          // Handle different report formats
          // Format 1: { url, status, redirectUrl, success }
          // Format 2: { repo, status } - needs URL construction
          const url = result.url || (result.repo ? `https://github.com/${result.repo}` : null);
          const status = result.status;
          const isSuccess = result.success !== undefined ? result.success : (status === 200);
          const redirectUrl = result.redirectUrl || null;

          if (!isSuccess && url) {
            aggregated.failedRepos.push({
              url,
              status,
              redirectUrl,
              batch: batch.number,
              batchName: batch.name
            });

            if (status === 'TIMEOUT' || status === 'TIMEOUT') {
              aggregated.timeoutRepos.push({
                url,
                batch: batch.number,
                batchName: batch.name
              });
            }

            if (redirectUrl) {
              aggregated.redirectedRepos.push({
                url,
                redirectUrl,
                batch: batch.number,
                batchName: batch.name
              });
            }
          }
        }
      }
    } else {
      aggregated.summary.batchesWithoutReports.push({
        batch: batch.number,
        name: batch.name,
        expectedCount: batch.count
      });
    }

    aggregated.batches.push(batchResult);
  }

  // Calculate category breakdown
  const categories = {};
  for (const batch of aggregated.batches) {
    if (!batch.hasReport || !batch.summary) continue;

    const category = batch.name.split(' - ')[0] || 'Other';
    if (!categories[category]) {
      categories[category] = { batches: 0, total: 0, success: 0, fail: 0 };
    }
    categories[category].batches++;
    categories[category].total += batch.summary.total;
    categories[category].success += batch.summary.success;
    categories[category].fail += (batch.summary.total - batch.summary.success);
  }
  aggregated.categoryBreakdown = categories;

  // Print report
  console.log('\n' + '='.repeat(80));
  console.log('COMPREHENSIVE VERIFICATION REPORT SUMMARY');
  console.log('='.repeat(80));

  console.log('\nOverall Statistics:');
  console.log(`  Total Batches: ${aggregated.summary.totalBatches}`);
  console.log(`  Batches with Reports: ${aggregated.summary.batchesWithReports}`);
  console.log(`  Batches without Reports: ${aggregated.summary.batchesWithoutReports.length}`);

  if (aggregated.summary.totalRepos > 0) {
    const successRate = ((aggregated.summary.totalSuccess / aggregated.summary.totalRepos) * 100).toFixed(1);
    console.log(`\n  Total Repositories: ${aggregated.summary.totalRepos}`);
    console.log(`  Success (HTTP 200): ${aggregated.summary.totalSuccess} (${successRate}%)`);
    console.log(`  Timeout: ${aggregated.summary.totalTimeout} (${((aggregated.summary.totalTimeout / aggregated.summary.totalRepos) * 100).toFixed(1)}%)`);
    console.log(`  Error: ${aggregated.summary.totalError} (${((aggregated.summary.totalError / aggregated.summary.totalRepos) * 100).toFixed(1)}%)`);
    console.log(`  Other Failures: ${aggregated.summary.totalFail} (${((aggregated.summary.totalFail / aggregated.summary.totalRepos) * 100).toFixed(1)}%)`);
    console.log(`  Redirects: ${aggregated.summary.totalRedirect}`);
  }

  console.log('\n' + '-'.repeat(80));
  console.log('Batches without Verification Reports:');
  console.log('-'.repeat(80));
  for (const missing of aggregated.summary.batchesWithoutReports) {
    console.log(`  Batch ${missing.batch}: ${missing.name} (${missing.expectedCount} repos)`);
  }

  console.log('\n' + '-'.repeat(80));
  console.log('Category Breakdown:');
  console.log('-'.repeat(80));
  for (const [category, stats] of Object.entries(aggregated.categoryBreakdown)) {
    const rate = ((stats.success / stats.total) * 100).toFixed(1);
    console.log(`  ${category}:`);
    console.log(`    Batches: ${stats.batches}`);
    console.log(`    Repos: ${stats.total} | Success: ${stats.success} (${rate}%) | Fail: ${stats.fail}`);
  }

  console.log('\n' + '-'.repeat(80));
  console.log(`Total Failed Repositories: ${aggregated.failedRepos.length}`);
  console.log('-'.repeat(80));

  // Group failed repos by status
  const failByStatus = {};
  for (const repo of aggregated.failedRepos) {
    const status = repo.status;
    if (!failByStatus[status]) {
      failByStatus[status] = [];
    }
    failByStatus[status].push(repo);
  }

  for (const [status, repos] of Object.entries(failByStatus)) {
    console.log(`\n  [${status}] ${repos.length} repositories:`);
    for (const repo of repos.slice(0, 10)) { // Show first 10
      const batchInfo = `[B${repo.batch}]`;
      console.log(`    ${batchInfo} ${repo.url}`);
      if (repo.redirectUrl) {
        console.log(`       -> ${repo.redirectUrl}`);
      }
    }
    if (repos.length > 10) {
      console.log(`    ... and ${repos.length - 10} more`);
    }
  }

  console.log('\n' + '-'.repeat(80));
  console.log(`Total Redirected Repositories: ${aggregated.redirectedRepos.length}`);
  console.log('-'.repeat(80));
  for (const repo of aggregated.redirectedRepos.slice(0, 20)) { // Show first 20
    console.log(`  [B${repo.batch}] ${repo.url}`);
    console.log(`    -> ${repo.redirectUrl}`);
  }
  if (aggregated.redirectedRepos.length > 20) {
    console.log(`  ... and ${aggregated.redirectedRepos.length - 20} more`);
  }

  // Save aggregated report
  const outputPath = path.join(__dirname, '..', 'reports', 'phase6-comprehensive-verification.json');
  fs.writeFileSync(outputPath, JSON.stringify(aggregated, null, 2));

  console.log('\n' + '='.repeat(80));
  console.log(`Aggregated report saved to: ${outputPath}`);
  console.log('='.repeat(80));

  return aggregated;
}

// Run aggregation
aggregateReports();
