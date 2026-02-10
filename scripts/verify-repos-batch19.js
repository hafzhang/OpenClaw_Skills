/**
 * Repository Verification Script for Phase 6 Batch 19
 * AI Tools and Platforms (75 repositories)
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Repositories to verify
const repos = [
  // LangChain (15)
  'https://github.com/langchain-ai/langchain',
  'https://github.com/langchain-ai/langchainjs',
  'https://github.com/langchain-ai/langsmith',
  'https://github.com/langchain-ai/langserve',
  'https://github.com/langchain-ai/langgraph',
  'https://github.com/langchain-ai/langchain-templates',
  'https://github.com/langchain-ai/langchain-cli',
  'https://github.com/langchain-ai/langchain-community',
  'https://github.com/langchain-ai/langchain-experimental',
  'https://github.com/langchain-ai/langservejs',
  'https://github.com/langchain-ai/langgraphjs',
  'https://github.com/langchain-ai/langchainjs-templates',
  'https://github.com/langchain-ai/langchaingo',
  'https://github.com/langchain-ai/langgraph-rs',
  'https://github.com/langchain-ai/langchain-hub',

  // LLM Frameworks (15)
  'https://github.com/run-llama/llama_index',
  'https://github.com/huggingface/transformers',
  'https://github.com/huggingface/diffusers',
  'https://github.com/huggingface/accelerate',
  'https://github.com/huggingface/peft',
  'https://github.com/huggingface/datasets',
  'https://github.com/huggingface/evaluate',
  'https://github.com/huggingface/optimum',
  'https://github.com/huggingface/huggingface_hub',
  'https://github.com/huggingface/text-generation-inference',
  'https://github.com/bitsandbytes-foundation/bitsandbytes',
  'https://github.com/AutoGPTQ/AutoGPTQ',
  'https://github.com/qwopqwop200/GPTQ-for-LLaMA',
  'https://github.com/ggerganov/llama.cpp',
  'https://github.com/ollama/ollama',

  // AI Agents (10)
  'https://github.com/microsoft/autogen',
  'https://github.com/joaomdmoura/crewAI',
  'https://github.com/geekan/MetaGPT',
  'https://github.com/reworkd/AgentGPT',
  'https://github.com/Significant-Gravitas/AutoGPT',
  'https://github.com/yoheinakajima/babyagi',
  'https://github.com/cognitivetech/devin',
  'https://github.com/OpenInterpreter/open-interpreter',
  'https://github.com/Phind-ai/Phind',
  'https://github.com/shroominic/codeinterpreter-api',

  // Vector DBs (10)
  'https://github.com/chroma-core/chroma',
  'https://github.com/qdrant/qdrant',
  'https://github.com/weaviate/weaviate',
  'https://github.com/milvus-io/milvus',
  'https://github.com/pinecone-io/pinecone-ts',
  'https://github.com/facebookresearch/faiss',
  'https://github.com/pgvector/pgvector',
  'https://github.com/lancedb/lancedb',
  'https://github.com/vespa-engine/vespa',
  'https://github.com/elastic/elasticsearch',

  // RAG Tools (10)
  'https://github.com/zylon-ai/private-gpt',
  'https://github.com/nomic-ai/gpt4all',
  'https://github.com/Mozilla-Ocho/llamafile',
  'https://github.com/mintplex-labs/anything-llm',
  'https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web',
  'https://github.com/chatpdf/chatpdf-api',
  'https://github.com/infiniflow/ragflow',
  'https://github.com/deepset-ai/FastRAG',
  'https://github.com/deepset-ai/haystack',
  'https://github.com/quiver-ai/quiver',

  // AI Programming (15)
  'https://github.com/continue-development/continue',
  'https://github.com/paul-gauthier/aider',
  'https://github.com/cursor-editor/cursor',
  'https://github.com/github/copilot.vim',
  'https://github.com/TabbyML/tabby',
  'https://github.com/Exafunction/codeium',
  'https://github.com/sweepai/sweep',
  'https://github.com/codebrush-brush/codebrush',
  'https://github.com/bloopai/bloop',
  'https://github.com/greptile/greptile',
  'https://github.com/smallcloud/refact',
  'https://github.com/mistralai/codestral',
  'https://github.com/bigcode/starcoder2',
  'https://github.com/meta-llama/codellama',
  'https://github.com/stabilityai/stable-code'
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
  console.log('Phase 6 Batch 19 - Repository Verification');
  console.log('AI Tools and Platforms');
  console.log('(LangChain/LLM/Agents/Vector DBs/RAG/AI Programming)');
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
  const reportPath = path.join(__dirname, '..', 'reports', 'batch19-repos-verification.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    batch: 19,
    category: 'AI Tools and Platforms',
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
