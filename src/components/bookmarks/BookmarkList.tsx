'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bookmark } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAllBookmarks, removeBookmark } from '@/lib/bookmarks';
import { cn } from '@/lib/utils';

interface BookmarkListProps {
  className?: string;
  filterType?: Bookmark['type'];
  limit?: number;
  onRemove?: () => void;
}

const TYPE_LABELS: Record<Bookmark['type'], string> = {
  tutorial: '教程',
  skill: '技能',
  config: '配置',
};

const TYPE_COLORS: Record<Bookmark['type'], string> = {
  tutorial: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  skill: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  config: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
};

export function BookmarkList({
  className,
  filterType,
  limit,
  onRemove,
}: BookmarkListProps) {
  const [bookmarks, setBookmarks] = React.useState<Bookmark[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setBookmarks(getAllBookmarks());
  }, []);

  const handleRemove = (id: string) => {
    if (removeBookmark(id)) {
      setBookmarks(getAllBookmarks());
      onRemove?.();
    }
  };

  const filteredBookmarks = filterType
    ? bookmarks.filter(b => b.type === filterType)
    : bookmarks;

  const displayBookmarks = limit
    ? filteredBookmarks.slice(0, limit)
    : filteredBookmarks;

  const getHref = (bookmark: Bookmark): string => {
    switch (bookmark.type) {
      case 'tutorial':
        return `/tutorials/${bookmark.slug}`;
      case 'skill':
        return `/skills#${bookmark.id}`;
      case 'config':
        return `/configs/${bookmark.slug}`;
      default:
        return '#';
    }
  };

  if (!mounted) {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2" />
            <div className="h-3 bg-muted rounded w-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-lg mb-2">📚</p>
        <p>还没有收藏任何内容</p>
        <p className="text-sm mt-1">浏览教程、技能或配置并添加收藏</p>
      </div>
    );
  }

  if (filteredBookmarks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>没有找到匹配的收藏</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {displayBookmarks.map(bookmark => (
        <Card
          key={bookmark.id}
          className="p-4 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-start justify-between gap-4">
            <Link href={getHref(bookmark)} className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h4 className="font-medium truncate">{bookmark.title}</h4>
                <Badge className={cn('text-xs', TYPE_COLORS[bookmark.type])}>
                  {TYPE_LABELS[bookmark.type]}
                </Badge>
                {bookmark.category && (
                  <Badge variant="secondary" className="text-xs">
                    {bookmark.category}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {bookmark.description}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                收藏于 {new Date(bookmark.createdAt).toLocaleDateString()}
              </p>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemove(bookmark.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            >
              移除
            </Button>
          </div>
        </Card>
      ))}

      {limit && filteredBookmarks.length > limit && (
        <div className="text-center">
          <Link href="/bookmarks">
            <Button variant="ghost">查看全部 ({filteredBookmarks.length})</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
