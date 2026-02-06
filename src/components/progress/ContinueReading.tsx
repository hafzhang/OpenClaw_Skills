'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from './ProgressBar';
import { getContinueReading } from '@/lib/progress';
import { Tutorial, Skill, ReadingProgress } from '@/types';
import { cn } from '@/lib/utils';

interface ContinueReadingProps {
  className?: string;
  limit?: number;
}

const TYPE_LABELS: Record<string, string> = {
  tutorial: '教程',
  skill: '技能',
};

const TYPE_COLORS: Record<string, string> = {
  tutorial: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  skill: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
};

export function ContinueReading({ className, limit = 3 }: ContinueReadingProps) {
  const [items, setItems] = React.useState<(ReadingProgress & { item: Tutorial | Skill })[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setItems(getContinueReading(limit));
  }, [limit]);

  const getHref = (progress: ReadingProgress): string => {
    switch (progress.type) {
      case 'tutorial':
        return `/tutorials/${progress.id}`;
      case 'skill':
        return `/skills#${progress.id}`;
      default:
        return '#';
    }
  };

  if (!mounted) {
    return null;
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">继续阅读</h2>
        <Link href="/progress">
          <Button variant="ghost" size="sm">查看全部</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const title = (item.item as Tutorial).title || (item.item as Skill).name || '未知';

          return (
            <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
              <Link href={getHref(item)} className="block">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={cn('text-xs', TYPE_COLORS[item.type])}>
                    {TYPE_LABELS[item.type]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(item.percentComplete)}% 完成
                  </span>
                </div>

                <h3 className="font-medium mb-2 line-clamp-1">{title}</h3>

                <ProgressBar percent={item.percentComplete} size="sm" />

                <p className="text-xs text-muted-foreground mt-2">
                  上次阅读: {new Date(item.lastReadAt).toLocaleDateString()}
                </p>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
