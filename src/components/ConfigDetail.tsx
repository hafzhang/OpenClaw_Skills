'use client';

import * as React from 'react';
import Link from 'next/link';
import { AgentConfig } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface ConfigDetailProps {
  config: AgentConfig;
  relatedConfigs: AgentConfig[];
}

export function ConfigDetail({ config, relatedConfigs }: ConfigDetailProps) {
  const {
    name,
    description,
    longDescription,
    author,
    authorUrl,
    category,
    tags,
    likesCount,
    forksCount,
    isOfficial,
    config: agentConfig,
    createdAt,
    updatedAt,
  } = config;

  const [copied, setCopied] = React.useState(false);

  const handleCopyConfig = async () => {
    const configJson = JSON.stringify(agentConfig, null, 2);
    await navigator.clipboard.writeText(configJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryLabel = (cat: string): string => {
    const labels: Record<string, string> = {
      development: '开发辅助',
      productivity: '工作效率',
      learning: '学习教学',
    };
    return labels[cat] || cat;
  };

  const configJson = JSON.stringify(agentConfig, null, 2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{name}</h1>
          <div className="flex gap-2">
            {isOfficial && (
              <Badge variant="default" className="text-xs">
                官方认证
              </Badge>
            )}
            <Badge variant="outline">{getCategoryLabel(category)}</Badge>
          </div>
        </div>
        <p className="text-muted-foreground text-lg mt-3">{description}</p>
        {longDescription && (
          <p className="text-muted-foreground mt-4 leading-relaxed">{longDescription}</p>
        )}
      </div>

      {/* Meta Info */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>作者:</span>
          {authorUrl ? (
            <a
              href={authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {author}
            </a>
          ) : (
            <span>{author}</span>
          )}
        </div>
        {likesCount !== undefined && (
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
            <span>{likesCount}</span>
          </div>
        )}
        {forksCount !== undefined && (
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
            <span>{forksCount}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Config JSON */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Agent 配置 JSON</CardTitle>
            <Button
              variant={copied ? 'default' : 'outline'}
              size="sm"
              onClick={handleCopyConfig}
              className="gap-1.5 min-h-[44px]"
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
                  <span className="hidden sm:inline">已复制</span>
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
                  <span className="hidden sm:inline">复制配置</span>
                </>
              )}
            </Button>
          </div>
          <CardDescription>
            将此配置复制到你的 openclaw.json 文件中
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs sm:text-sm">
            <code>{configJson}</code>
          </pre>
        </CardContent>
      </Card>

      {/* Related Configs */}
      {relatedConfigs.length > 0 && (
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">相关配置</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedConfigs.map((relatedConfig) => (
              <Card key={relatedConfig.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link
                      href={`/configs/${relatedConfig.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {relatedConfig.name}
                    </Link>
                  </CardTitle>
                  <CardDescription>{relatedConfig.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
