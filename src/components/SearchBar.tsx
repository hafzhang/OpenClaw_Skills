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

export function SearchBar({ className, placeholder = '搜索教程、技能和配置...', onSearchChange }: SearchBarProps) {
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

  const getResultHref = (result: SearchResult): string => {
    switch (result.type) {
      case 'tutorial':
        return `/tutorial/${(result.item as any).slug}`;
      case 'skill':
        return `/skills#${(result.item as any).id}`;
      case 'config':
        return `/configs/${(result.item as any).slug}`;
      default:
        return '#';
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
          className="pr-10 min-h-[44px]"
          aria-label="搜索教程、技能和配置"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 min-h-[32px] min-w-[32px]"
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
                  href={getResultHref(result)}
                  className="block px-3 sm:px-4 py-3 hover:bg-accent transition-colors min-h-[44px] flex items-center"
                  onClick={() => {
                    setShowResults(false);
                    setSearchQuery('');
                  }}
                >
                  <div className="flex items-start justify-between gap-2 w-full">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium truncate text-sm sm:text-base">
                          {(result.item as any).title || (result.item as any).name}
                        </span>
                        <span
                          className={cn(
                            'text-xs px-1.5 py-0.5 rounded shrink-0',
                            getResultTypeColor(result.type)
                          )}
                        >
                          {getResultTypeLabel(result.type)}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate mt-1">
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
