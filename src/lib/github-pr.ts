import type { ConfigFormData } from '@/components/configs/ConfigSubmissionForm';
import { parseTags } from './config-validation';

// GitHub repository information for PR creation
const GITHUB_REPO_OWNER = 'openclaw-tools';
const GITHUB_REPO_NAME = 'openclaw-hub';
const GITHUB_BASE_BRANCH = 'main';

/**
 * Generates a GitHub PR URL with pre-filled form data
 * @param formData - The config form data
 * @returns GitHub PR URL
 */
export function generateGitHubPRUrl(formData: ConfigFormData): string {
  const title = encodeURIComponent(`[Config Submission] ${formData.name}`);

  const body = generatePRBody(formData);

  // Generate compare URL with pre-filled title and body
  const params = new URLSearchParams({
    title,
    body,
  });

  return `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/compare/${GITHUB_BASE_BRANCH}...${formData.githubUsername || 'user'}:config-submission-${Date.now()}?${params.toString()}`;
}

/**
 * Generates the PR body markdown from form data
 * @param formData - The config form data
 * @returns PR body as markdown string
 */
function generatePRBody(formData: ConfigFormData): string {
  const tags = parseTags(formData.tags);
  const tagsFormatted = tags.length > 0 ? tags.join(', ') : '无';

  // Try to parse and format the JSON
  let formattedConfig = formData.configJson;
  try {
    const parsed = JSON.parse(formData.configJson);
    formattedConfig = JSON.stringify(parsed, null, 2);
  } catch {
    // If parsing fails, use as-is
  }

  const body = `## 配置提交

### 基本信息

- **配置名称**: ${formData.name}
- **作者**: ${formData.author}${formData.githubUsername ? ` (@${formData.githubUsername})` : ''}
- **分类**: ${getCategoryLabel(formData.category)}
- **标签**: ${tagsFormatted}

### 描述

${formData.description}

### 配置内容 (JSON)

\`\`\`json
${formattedConfig}
\`\`\`

---

### 提交前检查清单

- [x] 配置名称清晰明确
- [x] 描述详细说明用途
- [x] JSON 格式有效
- [x] 已选择合适的分类
- [x] 标签准确描述配置特性

### 审核说明

此 PR 通过 OpenClaw Hub 的配置分享功能自动生成。
`;

  return encodeURIComponent(body);
}

/**
 * Gets the display label for a category value
 * @param category - Category value
 * @returns Display label
 */
function getCategoryLabel(category: string): string {
  const categoryMap: Record<string, string> = {
    productivity: '工作效率',
    development: '开发辅助',
    devops: 'DevOps',
    'ai-llms': 'AI/LLMs',
    utilities: '实用工具',
  };

  return categoryMap[category] || category;
}

/**
 * Generates a direct link to create a new file in the GitHub repository
 * This is an alternative approach that creates a file directly
 * @param formData - The config form data
 * @returns GitHub new file URL
 */
export function generateGitHubNewFileUrl(formData: ConfigFormData): string {
  const slug = generateSlug(formData.name);
  const filePath = `src/data/configs/${slug}.json`;

  const configObject = {
    id: `config-${Date.now()}`,
    name: formData.name,
    slug,
    description: formData.description,
    author: formData.author,
    authorUrl: formData.githubUsername
      ? `https://github.com/${formData.githubUsername}`
      : undefined,
    category: formData.category,
    tags: parseTags(formData.tags),
    config: JSON.parse(formData.configJson),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const fileContent = JSON.stringify(configObject, null, 2);
  const encodedContent = encodeURIComponent(fileContent);

  const commitMessage = encodeURIComponent(`Add config: ${formData.name}`);

  return `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/new/${GITHUB_BASE_BRANCH}?filename=${encodeURIComponent(filePath)}&value=${encodedContent}&message=${commitMessage}`;
}

/**
 * Generates a URL-encoded string for use in PR templates
 * @param formData - The config form data
 * @returns URL-encoded PR body
 */
export function generateEncodedPRBody(formData: ConfigFormData): string {
  return generatePRBody(formData);
}

/**
 * Generates a kebab-case slug from a name
 * @param name - The config name
 * @returns Kebab-case slug
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generates GitHub issue URL for config submission (alternative to PR)
 * @param formData - The config form data
 * @returns GitHub issue URL
 */
export function generateGitHubIssueUrl(formData: ConfigFormData): string {
  const title = encodeURIComponent(`[Config Submission] ${formData.name}`);

  const tags = parseTags(formData.tags);
  const tagsFormatted = tags.length > 0 ? tags.join(', ') : '无';

  let formattedConfig = formData.configJson;
  try {
    const parsed = JSON.parse(formData.configJson);
    formattedConfig = JSON.stringify(parsed, null, 2);
  } catch {
    // If parsing fails, use as-is
  }

  const body = encodeURIComponent(`## 配置提交

### 基本信息

- **配置名称**: ${formData.name}
- **作者**: ${formData.author}${formData.githubUsername ? ` (@${formData.githubUsername})` : ''}
- **分类**: ${getCategoryLabel(formData.category)}
- **标签**: ${tagsFormatted}

### 描述

${formData.description}

### 配置内容 (JSON)

\`\`\`json
${formattedConfig}
\`\`\`

---

请审核此配置提交，谢谢！
`);

  return `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues/new?title=${title}&body=${body}&labels=config-submission`;
}
