/**
 * Repository Verification Script for Phase 6 Batch 20
 * LLM Libraries and Tools (75 repositories)
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Repositories to verify
const repos = [
  // OpenAI Ecosystem (15)
  'https://github.com/openai/openai-python',
  'https://github.com/openai/openai-node',
  'https://github.com/sashabaranov/go-openai',
  'https://github.com/detroz/openai-api',
  'https://github.com/openai/tiktoken',
  'https://github.com/openai/openai-cookbook',
  'https://github.com/openai/openai-quickstart-python',
  'https://github.com/openai/whisper',
  'https://github.com/ggerganov/whisper.cpp',
  'https://github.com/openai/clip',
  'https://github.com/openai/point-e',
  'https://github.com/openai/glide-image-editing',
  'https://github.com/openai/jukebox',
  'https://github.com/openai/micrograd',
  'https://github.com/openai/spinningup',

  // Anthropic Claude Ecosystem (10)
  'https://github.com/anthropic/anthropic-sdk-python',
  'https://github.com/anthropic/anthropic-sdk-typescript',
  'https://github.com/anthropic/anthropic-quickstarts',
  'https://github.com/GoogleCloudPlatform/vertex-ai-samples',
  'https://github.com/aws-samples/amazon-bedrock-workshop',
  'https://github.com/AlexAti/claude-api',
  'https://github.com/ycwait/anthropic-go',
  'https://github.com/noe/claude-proxy',

  // LLM Application Frameworks (10)
  'https://github.com/run-llama/llama_index',
  'https://github.com/microsoft/semantic-kernel',
  'https://github.com/microsoft/guidance',
  'https://github.com/stanfordnlp/dspy',
  'https://github.com/outlines-dev/outlines',
  'https://github.com/jxnl/instructor',
  'https://github.com/mirascope/mirascope',
  'https://github.com/promptlayer/promptlayer',
  'https://github.com/helicone/helicone',
  'https://github.com/portkey-ai/portkey',

  // Prompt Engineering Tools (10)
  'https://github.com/signatrix/prompt-engine',
  'https://github.com/signatrix/promptable',
  'https://github.com/langfuse/langfuse',
  'https://github.com/promptfoo/promptfoo',
  'https://github.com/graylan/promptimize',
  'https://github.com/microsoft/promptist',
  'https://github.com/OpenPrompt-Camp/OpenPrompt',
  'https://github.com/mzGerald/stable-diffusion-prompt-generator',

  // LLM Evaluation Tools (10)
  'https://github.com/evalplus/evalplus',
  'https://github.com/openai/evals',
  'https://github.com/explodeai/ragas',
  'https://github.com/truera/trulens',
  'https://github.com/giskard-ai/giskard',
  'https://github.com/confident-ai/deepeval',
  'https://github.com/braintrustdev/braintrust-sdk',
  'https://github.com/kaist-ai/judge-lm',
  'https://github.com/lmsys/mt-bench',

  // Multimodal Model Tools (10)
  'https://github.com/haotian-liu/LLaVA',
  'https://github.com/salesforce/BLIP',
  'https://github.com/facebookresearch/segment-anything',
  'https://github.com/openai/clip',
  'https://github.com/timothybrooks/instruct-pix2pix',
  'https://github.com/lllyasviel/ControlNet',
  'https://github.com/stabilityai/stablediffusion',
  'https://github.com/huggingface/diffusers',
  'https://github.com/comfyanonymous/ComfyUI',
  'https://github.com/AUTOMATIC1111/stable-diffusion-webui',

  // Speech and Audio AI (10)
  'https://github.com/openai/whisper',
  'https://github.com/ggerganov/whisper.cpp',
  'https://github.com/sanchit-gandhi/whisper-jax',
  'https://github.com/SYSTRAN/faster-whisper',
  'https://github.com/m-bain/whisperX',
  'https://github.com/coqui-ai/TTS',
  'https://github.com/neoncbb/tortoise-tts',
  'https://github.com/suno-ai/bark',
  'https://github.com/plz61/vallex',
  'https://github.com/MycroftAI/mimic3'
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
  console.log('Phase 6 Batch 20 - Repository Verification');
  console.log('LLM Libraries and Tools');
  console.log('(OpenAI/Claude/Frameworks/Prompt/Eval/Multimodal/Audio)');
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
  const reportPath = path.join(__dirname, '..', 'reports', 'batch20-repos-verification.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    batch: 20,
    category: 'LLM Libraries and Tools',
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
