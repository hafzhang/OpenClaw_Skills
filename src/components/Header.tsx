'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { searchAll } from '@/lib/search';
import { SearchResult } from '@/types';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
  const [showResults, setShowResults] = React.useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      const results = searchAll(query);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <header className={cn('border-b bg-background', className)}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Title and tagline */}
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              OpenClaw 实战指南
            </h1>
            <p className="text-sm text-muted-foreground">
              让 AI 助手真正帮你工作
            </p>
          </div>

          {/* Unified search box */}
          <div className="relative w-full md:w-96">
            <div className="relative">
              <Input
                type="search"
                placeholder="搜索教程和技能..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pr-10"
                aria-label="搜索教程和技能"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={handleClearSearch}
                  aria-label="清除搜索"
                >
                  ✕
                </Button>
              )}
            </div>

            {/* Search results dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-96 overflow-y-auto">
                <ul className="py-1">
                  {searchResults.map((result, index) => (
                    <li key={`${result.type}-${index}`}>
                      <a
                        href={
                          result.type === 'tutorial'
                            ? `/tutorial/${(result.item as any).slug}`
                            : `/skills#${(result.item as any).id}`
                        }
                        className="block px-4 py-2 hover:bg-accent transition-colors"
                        onClick={() => {
                          setShowResults(false);
                          setSearchQuery('');
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium truncate">
                                {(result.item as any).title || (result.item as any).name}
                              </span>
                              <span
                                className={cn(
                                  'text-xs px-1.5 py-0.5 rounded',
                                  result.type === 'tutorial'
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                    : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                )}
                              >
                                {result.type === 'tutorial' ? '教程' : '技能'}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {(result.item as any).description}
                            </p>
                          </div>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* No results message */}
            {showResults && searchQuery && searchResults.length === 0 && (
              <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg p-4">
                <p className="text-sm text-muted-foreground">
                  没有找到匹配的结果
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
