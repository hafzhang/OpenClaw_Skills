'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchFilters as SearchFiltersType, DifficultyLevel, SortOption } from '@/types';
import { getAllCategories, getAllTags } from '@/lib/advanced-search';
import { cn } from '@/lib/utils';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  onReset: () => void;
  resultCount: number;
}

const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级',
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: '相关性' },
  { value: 'title-asc', label: '标题 (A-Z)' },
  { value: 'title-desc', label: '标题 (Z-A)' },
  { value: 'date-desc', label: '最新' },
  { value: 'date-asc', label: '最早' },
  { value: 'rating-desc', label: '评分 (高到低)' },
  { value: 'rating-asc', label: '评分 (低到高)' },
  { value: 'popular', label: '热门' },
];

const TYPE_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'tutorial', label: '教程' },
  { value: 'skill', label: '技能' },
  { value: 'config', label: '配置' },
] as const;

export function SearchFilters({
  filters,
  onFiltersChange,
  onReset,
  resultCount,
}: SearchFiltersProps) {
  const [categories, setCategories] = React.useState<string[]>([]);
  const [tags, setTags] = React.useState<string[]>([]);
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    setCategories(getAllCategories());
    setTags(getAllTags());
  }, []);

  const toggleType = (type: string) => {
    const newTypes = filters.types.includes(type as any)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type as any];

    onFiltersChange({ ...filters, types: newTypes.length > 0 ? newTypes : ['all'] });
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];

    onFiltersChange({ ...filters, categories: newCategories });
  };

  const toggleDifficulty = (difficulty: DifficultyLevel) => {
    const newDifficulties = filters.difficulties.includes(difficulty)
      ? filters.difficulties.filter(d => d !== difficulty)
      : [...filters.difficulties, difficulty];

    onFiltersChange({ ...filters, difficulties: newDifficulties });
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];

    onFiltersChange({ ...filters, tags: newTags });
  };

  const activeFilterCount =
    (filters.types.includes('all') ? 0 : filters.types.length) +
    filters.categories.length +
    filters.difficulties.length +
    filters.tags.length +
    (filters.rating ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Filter toggle and result count */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="gap-2"
        >
          <span>筛选</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="min-w-[20px] justify-center">
              {activeFilterCount}
            </Badge>
          )}
          <span className="text-muted-foreground">
            {expanded ? '▼' : '▶'}
          </span>
        </Button>

        <span className="text-sm text-muted-foreground">
          找到 {resultCount} 个结果
        </span>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-muted-foreground"
          >
            清除筛选
          </Button>
        )}
      </div>

      {/* Expanded filters */}
      {expanded && (
        <div className="space-y-4 p-4 border rounded-lg bg-card">
          {/* Type filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">类型</label>
            <div className="flex flex-wrap gap-2">
              {TYPE_OPTIONS.map(option => (
                <Badge
                  key={option.value}
                  variant={filters.types.includes(option.value as any) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleType(option.value)}
                >
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Category filter */}
          {categories.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">分类</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Badge
                    key={category}
                    variant={filters.categories.includes(category) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Difficulty filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">难度</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(DIFFICULTY_LABELS).map(([value, label]) => (
                <Badge
                  key={value}
                  variant={filters.difficulties.includes(value as DifficultyLevel) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleDifficulty(value as DifficultyLevel)}
                >
                  {label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tags filter */}
          {tags.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">标签</label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {tags.map(tag => (
                  <Badge
                    key={tag}
                    variant={filters.tags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Rating filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">最低评分</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <Badge
                  key={rating}
                  variant={(filters.rating || 0) >= rating ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => onFiltersChange({ ...filters, rating })}
                >
                  {rating}+ ★
                </Badge>
              ))}
              {filters.rating && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFiltersChange({ ...filters, rating: undefined })}
                >
                  清除
                </Button>
              )}
            </div>
          </div>

          {/* Sort options */}
          <div>
            <label className="text-sm font-medium mb-2 block">排序</label>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map(option => (
                <Badge
                  key={option.value}
                  variant={filters.sortBy === option.value ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => onFiltersChange({ ...filters, sortBy: option.value })}
                >
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
