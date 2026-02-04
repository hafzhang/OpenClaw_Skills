'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SearchResult } from '@/types';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onSearchChange?: (query: string) => void;
}

export function SearchBar({ className, placeholder = '搜索教程和技能...', onSearchChange }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
  const [showResults, setShowResults] = React.useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Notify parent component of search query change
    if (onSearchChange) {
      onSearchChange(query);
    }

    if (query.trim()) {
      // Import searchAll dynamically to avoid server-side issues
      import('@/lib/search').then(({ searchAll }) => {
        const results = searchAll(query);
        setSearchResults(results);
        setShowResults(true);
      });
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    // Notify parent component of search clear
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  return (
    <div className={cn('relative w-full', className)}>
      <div className="relative">
        <Input
          type="search"
          placeholder={placeholder}
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
  );
}
