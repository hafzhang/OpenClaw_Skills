'use client';

import * as React from 'react';
import Link from 'next/link';
import { AdvancedSearchResult } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SearchResultsProps {
  results: AdvancedSearchResult[];
  query: string;
}

export function SearchResults({ results, query }: SearchResultsProps) {
  const getResultTypeLabel = (type: string): string => {
    switch (type) {
      case 'tutorial':
        return '教程';
      case 'skill':
        return '技能';
      case 'config':
        return '配置';
      default:
        return type;
    }
  };

  const getResultTypeColor = (type: string): string => {
    switch (type) {
      case 'tutorial':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'skill':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'config':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getResultHref = (result: AdvancedSearchResult): string => {
    switch (result.type) {
      case 'tutorial':
        return `/tutorials/${(result.item as any).slug}`;
      case 'skill':
        return `/skills#${(result.item as any).id}`;
      case 'config':
        return `/configs/${(result.item as any).slug}`;
      default:
        return '#';
    }
  };

  const getTitle = (result: AdvancedSearchResult): string => {
    return (result.item as any).title || (result.item as any).name || '';
  };

  const getDifficultyBadge = (result: AdvancedSearchResult) => {
    const difficulty = (result.item as any).difficulty;
    if (!difficulty) return null;

    const colors: Record<string, string> = {
      beginner: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      advanced: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    };

    const labels: Record<string, string> = {
      beginner: '初级',
      intermediate: '中级',
      advanced: '高级',
    };

    return (
      <Badge className={cn('text-xs', colors[difficulty])}>
        {labels[difficulty]}
      </Badge>
    );
  };

  const getVerifiedBadge = (result: AdvancedSearchResult) => {
    if ((result.item as any).verified || (result.item as any).isOfficial) {
      return (
        <Badge variant="outline" className="text-xs">
          ✓ 认证
        </Badge>
      );
    }
    return null;
  };

  const getFeaturedBadge = (result: AdvancedSearchResult) => {
    if ((result.item as any).featured) {
      return (
        <Badge variant="outline" className="text-xs">
          ⭐ 精选
        </Badge>
      );
    }
    return null;
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground mb-2">
          {query ? '没有找到匹配的结果' : '输入搜索词开始搜索'}
        </p>
        {query && (
          <p className="text-sm text-muted-foreground">
            尝试调整筛选条件或使用不同的关键词
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <Card key={`${result.type}-${index}`} className="p-4 hover:shadow-md transition-shadow">
          <Link href={getResultHref(result)} className="block">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Title and badges */}
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h3 className="text-lg font-semibold truncate">
                    {getTitle(result)}
                  </h3>
                  <Badge className={cn('text-xs', getResultTypeColor(result.type))}>
                    {getResultTypeLabel(result.type)}
                  </Badge>
                  {getDifficultyBadge(result)}
                  {getVerifiedBadge(result)}
                  {getFeaturedBadge(result)}
                  {result.score > 0 && (
                    <span className="text-xs text-muted-foreground">
                      相关度: {Math.round(result.score)}%
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {result.item.description}
                </p>

                {/* Meta info */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  <span>分类: {result.item.category}</span>
                  {(result.item as any).author && (
                    <span>作者: {(result.item as any).author}</span>
                  )}
                  {(result.item as any).readTime && (
                    <span>阅读时间: {(result.item as any).readTime} 分钟</span>
                  )}
                  {(result.item as any).stats?.viewCount && (
                    <span>浏览: {(result.item as any).stats.viewCount}</span>
                  )}
                </div>

                {/* Tags */}
                {result.item.tags && result.item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {result.item.tags.slice(0, 5).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {result.item.tags.length > 5 && (
                      <Badge variant="secondary" className="text-xs">
                        +{result.item.tags.length - 5}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Link>
        </Card>
      ))}
    </div>
  );
}
