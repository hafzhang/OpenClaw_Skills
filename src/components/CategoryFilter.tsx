'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type CategorySlug = 'all' | 'quick-start' | 'productivity' | 'development' | 'content' | 'creative';

export interface Category {
  slug: CategorySlug;
  name: string;
}

export const categories: Category[] = [
  { slug: 'all', name: '全部' },
  { slug: 'quick-start', name: '快速入门' },
  { slug: 'productivity', name: '工作效率' },
  { slug: 'development', name: '开发辅助' },
  { slug: 'content', name: '内容创作' },
  { slug: 'creative', name: '创意玩法' },
];

interface CategoryFilterProps {
  selectedCategory: CategorySlug;
  onCategoryChange: (category: CategorySlug) => void;
  className?: string;
}

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  className,
}: CategoryFilterProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {categories.map((category) => (
        <Button
          key={category.slug}
          variant={selectedCategory === category.slug ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(category.slug)}
          className={cn(
            'transition-all',
            selectedCategory === category.slug && 'ring-2 ring-ring ring-offset-2'
          )}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
