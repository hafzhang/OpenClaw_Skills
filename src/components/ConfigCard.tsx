'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AgentConfig } from '@/types';

interface ConfigCardProps {
  config: AgentConfig;
}

export function ConfigCard({ config }: ConfigCardProps) {
  const { name, slug, description, author, likesCount, forksCount, category, tags, isOfficial } = config;

  const getCategoryLabel = (cat: string): string => {
    const labels: Record<string, string> = {
      development: '开发辅助',
      productivity: '工作效率',
      learning: '学习教学',
    };
    return labels[cat] || cat;
  };

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">
            <Link
              href={`/configs/${slug}`}
              className="hover:underline hover:text-primary transition-colors"
            >
              {name}
            </Link>
          </CardTitle>
          <div className="flex gap-1">
            {isOfficial && (
              <Badge variant="default" className="text-xs">
                官方
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {getCategoryLabel(category)}
            </Badge>
          </div>
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardFooter className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-3 text-xs md:text-sm">
          <span>作者: {author}</span>
          {(likesCount !== undefined || forksCount !== undefined) && (
            <>
              {likesCount !== undefined && (
                <span className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                  {likesCount}
                </span>
              )}
              {forksCount !== undefined && (
                <span className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="18" r="3" />
                    <circle cx="6" cy="6" r="3" />
                    <path d="M18 6a5 5 0 0 0-5 5c0 2 1 3.5 3 5.5a9 9 0 0 1 2 5.5c0 2 1 3.5 3 5.5" />
                  </svg>
                  {forksCount}
                </span>
              )}
            </>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="min-h-[44px]"
        >
          <Link href={`/configs/${slug}`}>查看配置</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
