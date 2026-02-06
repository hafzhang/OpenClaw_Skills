'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchFilters, SearchResults } from './';
import { SearchFilters as SearchFiltersType } from '@/types';
import { advancedSearch, defaultSearchFilters } from '@/lib/advanced-search';
import { cn } from '@/lib/utils';

interface AdvancedSearchProps {
  className?: string;
}

export function AdvancedSearch({ className }: AdvancedSearchProps) {
  const [filters, setFilters] = React.useState<SearchFiltersType>(defaultSearchFilters);
  const [results, setResults] = React.useState(advancedSearch(defaultSearchFilters));
  const [searchInput, setSearchInput] = React.useState('');

  const handleSearch = (query: string) => {
    setSearchInput(query);
    const newFilters = { ...filters, query };
    setFilters(newFilters);
    setResults(advancedSearch(newFilters));
  };

  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters);
    setResults(advancedSearch(newFilters));
  };

  const handleReset = () => {
    const resetFilters = { ...defaultSearchFilters, query: searchInput };
    setFilters(resetFilters);
    setResults(advancedSearch(resetFilters));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResults(advancedSearch(filters));
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search input */}
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="search"
          placeholder="搜索教程、技能和配置..."
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
          className="pr-24 min-h-[44px]"
          aria-label="搜索"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
          {searchInput && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleSearch('')}
              className="h-8"
            >
              清除
            </Button>
          )}
          <Button type="submit" size="sm" className="h-8">
            搜索
          </Button>
        </div>
      </form>

      {/* Filters */}
      <SearchFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleReset}
        resultCount={results.length}
      />

      {/* Results */}
      <SearchResults results={results} query={filters.query} />
    </div>
  );
}
