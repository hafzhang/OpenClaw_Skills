'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { validateConfig, type ConfigValidationResult } from '@/lib/config-validation';
import { generateGitHubPRUrl } from '@/lib/github-pr';

// Config categories for dropdown
const CONFIG_CATEGORIES = [
  { value: 'productivity', label: '工作效率' },
  { value: 'development', label: '开发辅助' },
  { value: 'devops', label: 'DevOps' },
  { value: 'ai-llms', label: 'AI/LLMs' },
  { value: 'utilities', label: '实用工具' },
] as const;

export interface ConfigFormData {
  name: string;
  description: string;
  author: string;
  githubUsername: string;
  category: string;
  tags: string;
  configJson: string;
}

interface ConfigSubmissionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ConfigSubmissionForm({ onSuccess, onCancel }: ConfigSubmissionFormProps) {
  const [formData, setFormData] = React.useState<ConfigFormData>({
    name: '',
    description: '',
    author: '',
    githubUsername: '',
    category: '',
    tags: '',
    configJson: '',
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [jsonError, setJsonError] = React.useState<string>('');

  const handleInputChange = (field: keyof ConfigFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleConfigJsonChange = (value: string) => {
    handleInputChange('configJson', value);
    setJsonError('');

    // Try to parse JSON to validate
    if (value.trim()) {
      try {
        JSON.parse(value);
      } catch (e) {
        setJsonError('JSON 格式无效: ' + (e as Error).message);
      }
    }
  };

  const formatJson = () => {
    if (!formData.configJson.trim()) return;
    try {
      const parsed = JSON.parse(formData.configJson);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormData((prev) => ({ ...prev, configJson: formatted }));
      setJsonError('');
    } catch (e) {
      setJsonError('无法格式化: JSON 格式无效');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Validate form
    const validation: ConfigValidationResult = validateConfig(formData);

    if (!validation.valid) {
      const newErrors: Record<string, string> = {};
      validation.errors.forEach((error) => {
        // Map error fields to form fields
        const fieldMap: Record<string, string> = {
          name: 'name',
          description: 'description',
          author: 'author',
          category: 'category',
          config: 'configJson',
        };
        const field = fieldMap[error.field] || error.field;
        newErrors[field] = error.message;
      });
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    // Generate GitHub PR URL
    const prUrl = generateGitHubPRUrl(formData);

    // Open in new tab
    window.open(prUrl, '_blank', 'noopener,noreferrer');

    setIsSubmitting(false);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Config Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          配置名称 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="例如：智能代码审查助手"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          描述 <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="简要描述这个配置的功能和用途..."
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
      </div>

      {/* Author & GitHub Username */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="author" className="text-sm font-medium">
            作者名 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="author"
            type="text"
            placeholder="你的名称"
            value={formData.author}
            onChange={(e) => handleInputChange('author', e.target.value)}
            className={errors.author ? 'border-red-500' : ''}
          />
          {errors.author && <p className="text-sm text-red-500">{errors.author}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="githubUsername" className="text-sm font-medium">
            GitHub 用户名
          </Label>
          <Input
            id="githubUsername"
            type="text"
            placeholder="例如：octocat"
            value={formData.githubUsername}
            onChange={(e) => handleInputChange('githubUsername', e.target.value)}
          />
        </div>
      </div>

      {/* Category & Tags */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium">
            分类 <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleInputChange('category', value)}
          >
            <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              {CONFIG_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags" className="text-sm font-medium">
            标签
          </Label>
          <Input
            id="tags"
            type="text"
            placeholder="用逗号分隔，如：AI, 代码审查, 自动化"
            value={formData.tags}
            onChange={(e) => handleInputChange('tags', e.target.value)}
          />
        </div>
      </div>

      {/* Config JSON */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="configJson" className="text-sm font-medium">
            配置内容 (JSON) <span className="text-red-500">*</span>
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={formatJson}
            disabled={!formData.configJson.trim()}
          >
            格式化 JSON
          </Button>
        </div>
        <Textarea
          id="configJson"
          placeholder={`{\n  "systemPrompt": "你是一个代码审查助手...",\n  "temperature": 0.7,\n  "maxTokens": 2000\n}`}
          value={formData.configJson}
          onChange={(e) => handleConfigJsonChange(e.target.value)}
          rows={10}
          className={`font-mono text-sm ${errors.configJson || jsonError ? 'border-red-500' : ''}`}
        />
        {(errors.configJson || jsonError) && (
          <p className="text-sm text-red-500">{errors.configJson || jsonError}</p>
        )}
        <p className="text-xs text-muted-foreground">
          输入有效的 JSON 格式配置内容。点击"格式化 JSON"按钮可以美化格式。
        </p>
      </div>

      {/* Submit Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          取消
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !!jsonError}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? '生成中...' : '生成 PR 链接'}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center sm:text-left">
        点击"生成 PR 链接"将打开 GitHub 页面，你需要在 GitHub 上完成 PR 提交。
      </p>
    </form>
  );
}
