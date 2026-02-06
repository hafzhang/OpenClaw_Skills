'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark } from '@/types';
import { isBookmarked, toggleBookmark } from '@/lib/bookmarks';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  id: string;
  type: Bookmark['type'];
  title: string;
  slug: string;
  description: string;
  category?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function BookmarkButton({
  id,
  type,
  title,
  slug,
  description,
  category,
  className,
  size = 'md',
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setBookmarked(isBookmarked(id));
  }, [id]);

  const handleToggle = () => {
    const success = toggleBookmark({
      id,
      type,
      title,
      slug,
      description,
      category,
    });

    if (success) {
      setBookmarked(!bookmarked);
    }
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
        className={cn('opacity-50', className)}
        disabled
      >
        <span className="mr-1">☆</span>
        收藏
      </Button>
    );
  }

  return (
    <Button
      variant={bookmarked ? 'default' : 'outline'}
      size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
      onClick={handleToggle}
      className={cn(
        'transition-all duration-200',
        bookmarked && 'bg-yellow-500 hover:bg-yellow-600 text-white',
        className
      )}
    >
      <span className="mr-1">{bookmarked ? '★' : '☆'}</span>
      {bookmarked ? '已收藏' : '收藏'}
    </Button>
  );
}
