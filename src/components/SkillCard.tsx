'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skill } from '@/types';

interface SkillCardProps {
  skill: Skill;
}

export function SkillCard({ skill }: SkillCardProps) {
  const { name, description, verified, author, command, url } = skill;
  const [copied, setCopied] = React.useState(false);

  const handleCopyCommand = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-primary transition-colors"
            >
              {name}
            </a>
          </CardTitle>
          <Badge variant={verified ? 'default' : 'secondary'}>
            {verified ? '已验证' : '待验证'}
          </Badge>
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>

      <CardFooter className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>作者: {author}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyCommand}
          className="gap-1.5"
        >
          {copied ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              已复制
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
              复制命令
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
