import type { ConfigFormData } from '@/components/configs/ConfigSubmissionForm';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ConfigValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// Allowed config categories
const ALLOWED_CATEGORIES = [
  'productivity',
  'development',
  'devops',
  'ai-llms',
  'utilities',
] as const;

/**
 * Validates the config form data
 * @param formData - The form data to validate
 * @returns Validation result with errors if any
 */
export function validateConfig(formData: ConfigFormData): ConfigValidationResult {
  const errors: ValidationError[] = [];

  // Validate name (required, 2-100 characters)
  if (!formData.name || formData.name.trim().length === 0) {
    errors.push({ field: 'name', message: '配置名称不能为空' });
  } else if (formData.name.trim().length < 2) {
    errors.push({ field: 'name', message: '配置名称至少需要 2 个字符' });
  } else if (formData.name.trim().length > 100) {
    errors.push({ field: 'name', message: '配置名称不能超过 100 个字符' });
  }

  // Validate description (required, 10-500 characters)
  if (!formData.description || formData.description.trim().length === 0) {
    errors.push({ field: 'description', message: '描述不能为空' });
  } else if (formData.description.trim().length < 10) {
    errors.push({ field: 'description', message: '描述至少需要 10 个字符' });
  } else if (formData.description.trim().length > 500) {
    errors.push({ field: 'description', message: '描述不能超过 500 个字符' });
  }

  // Validate author (required, 1-50 characters)
  if (!formData.author || formData.author.trim().length === 0) {
    errors.push({ field: 'author', message: '作者名不能为空' });
  } else if (formData.author.trim().length > 50) {
    errors.push({ field: 'author', message: '作者名不能超过 50 个字符' });
  }

  // Validate category (required, must be in allowed list)
  if (!formData.category || formData.category.trim().length === 0) {
    errors.push({ field: 'category', message: '请选择分类' });
  } else if (!ALLOWED_CATEGORIES.includes(formData.category as typeof ALLOWED_CATEGORIES[number])) {
    errors.push({ field: 'category', message: '无效的分类选择' });
  }

  // Validate config JSON (required, must be valid JSON)
  if (!formData.configJson || formData.configJson.trim().length === 0) {
    errors.push({ field: 'config', message: '配置内容不能为空' });
  } else {
    try {
      const parsed = JSON.parse(formData.configJson);

      // Validate that it's an object
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        errors.push({ field: 'config', message: '配置内容必须是 JSON 对象' });
      }
    } catch (e) {
      errors.push({ field: 'config', message: 'JSON 格式无效: ' + (e as Error).message });
    }
  }

  // Validate tags (optional, but if provided, must be valid)
  if (formData.tags && formData.tags.trim().length > 0) {
    const tagList = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    if (tagList.length > 10) {
      errors.push({ field: 'tags', message: '标签数量不能超过 10 个' });
    }
    for (const tag of tagList) {
      if (tag.length > 20) {
        errors.push({ field: 'tags', message: `标签 "${tag}" 过长（最多 20 个字符）` });
        break;
      }
    }
  }

  // Validate GitHub username (optional, but if provided, must be valid format)
  if (formData.githubUsername && formData.githubUsername.trim().length > 0) {
    const githubUsernameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
    if (!githubUsernameRegex.test(formData.githubUsername.trim())) {
      errors.push({ field: 'githubUsername', message: 'GitHub 用户名格式无效' });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Parses tags from comma-separated string to array
 * @param tagsString - Comma-separated tags string
 * @returns Array of tag strings
 */
export function parseTags(tagsString: string): string[] {
  if (!tagsString || tagsString.trim().length === 0) {
    return [];
  }
  return tagsString
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
}

/**
 * Formats tags array to comma-separated string
 * @param tags - Array of tag strings
 * @returns Comma-separated string
 */
export function formatTags(tags: string[]): string {
  return tags.join(', ');
}

/**
 * Validates if a string is valid JSON
 * @param jsonString - String to validate
 * @returns boolean indicating if valid JSON
 */
export function isValidJson(jsonString: string): boolean {
  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
}

/**
 * Formats JSON string with proper indentation
 * @param jsonString - JSON string to format
 * @returns Formatted JSON string or null if invalid
 */
export function formatJson(jsonString: string): string | null {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return null;
  }
}
