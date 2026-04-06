'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  thumbnail?: string;
  displayLink?: string;
}

interface GoogleSearchProps {
  onResults?: (results: SearchResult[]) => void;
  className?: string;
}

export function GoogleSearch({ onResults, className = '' }: GoogleSearchProps) {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>('');
  const [totalResults, setTotalResults] = React.useState<number>(0);
  const [startIndex, setStartIndex] = React.useState(1);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_SEARCH_API_KEY;
  const cx = process.env.NEXT_PUBLIC_GOOGLE_SEARCH_CX;

  const performSearch = async (searchQuery: string, start = 1) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');

    try {
      if (!apiKey || !cx) {
        // 演示模式：返回模拟数据
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const mockResults: SearchResult[] = [
          {
            title: `演示结果 1: ${searchQuery}`,
            link: 'https://example.com/1',
            snippet: '这是一个演示搜索结果。请配置 Google Custom Search API Key 来获取真实搜索结果。',
            displayLink: 'example.com',
          },
          {
            title: `演示结果 2: ${searchQuery}`,
            link: 'https://example.com/2',
            snippet: '配置 NEXT_PUBLIC_GOOGLE_SEARCH_API_KEY 和 NEXT_PUBLIC_GOOGLE_SEARCH_CX 后即可使用。',
            displayLink: 'example.com',
          },
        ];
        setResults(mockResults);
        setTotalResults(2);
        onResults?.(mockResults);
        return;
      }

      // 使用 Google Custom Search API
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(searchQuery)}&start=${start}`
      );

      if (!response.ok) {
        throw new Error('搜索请求失败');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const searchResults: SearchResult[] = (data.items || []).map((item: any) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
        thumbnail: item.pagemap?.cse_thumbnail?.[0]?.src || item.pagemap?.cse_image?.[0]?.src,
        displayLink: item.displayLink,
      }));

      setResults(searchResults);
      setTotalResults(data.searchInformation?.totalResults || 0);
      setStartIndex(start);
      onResults?.(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : '搜索失败');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query, 1);
  };

  const handleNextPage = () => {
    performSearch(query, startIndex + 10);
  };

  const handlePrevPage = () => {
    performSearch(query, Math.max(1, startIndex - 10));
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Google 搜索</CardTitle>
          <CardDescription>
            {!apiKey || !cx ? (
              <span className="text-amber-600">配置 API Key 后可用，当前为演示模式</span>
            ) : (
              '搜索网络获取相关信息'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="输入搜索关键词..."
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !query.trim()}>
              {loading ? '搜索中...' : '搜索'}
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md">
              <p className="font-semibold">搜索错误</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  找到约 {totalResults.toLocaleString()} 条结果
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={startIndex <= 1}
                  >
                    上一页
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={startIndex + 10 > totalResults}
                  >
                    下一页
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {results.map((result, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        {result.thumbnail && (
                          <div className="flex-shrink-0">
                            <img
                              src={result.thumbnail}
                              alt=""
                              className="w-24 h-24 object-cover rounded"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <a
                            href={result.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <h3 className="text-lg font-semibold text-primary hover:underline mb-1">
                              {result.title}
                            </h3>
                          </a>
                          <p className="text-xs text-green-700 mb-2">{result.displayLink || result.link}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{result.snippet}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// 快速搜索按钮组件
interface QuickSearchProps {
  queries: string[];
  onSelect: (query: string) => void;
  className?: string;
}

export function QuickSearch({ queries, onSelect, className = '' }: QuickSearchProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {queries.map((query, index) => (
        <Badge
          key={index}
          variant="outline"
          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={() => onSelect(query)}
        >
          {query}
        </Badge>
      ))}
    </div>
  );
}

// 搜索建议组件
interface SearchSuggestionsProps {
  query: string;
  onSelect: (suggestion: string) => void;
  apiKey?: string;
  className?: string;
}

export function SearchSuggestions({ query, onSelect, className = '' }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  React.useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    // 使用 Google Autocomplete API（需要额外配置）
    // 这里使用模拟数据
    const mockSuggestions = [
      `${query} 教程`,
      `${query} 示例`,
      `${query} 最佳实践`,
      `${query} 文档`,
      `${query} 工具`,
    ].filter((s) => s.toLowerCase().includes(query.toLowerCase()));

    setSuggestions(mockSuggestions.slice(0, 5));
    setShowSuggestions(true);
  }, [query]);

  if (!showSuggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className={`absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg ${className}`}>
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          className="w-full text-left px-4 py-2 hover:bg-muted transition-colors"
          onClick={() => {
            onSelect(suggestion);
            setShowSuggestions(false);
          }}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
