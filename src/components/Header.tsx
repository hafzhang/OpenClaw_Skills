'use client';

import { cn } from '@/lib/utils';
import { SearchBar } from '@/components/SearchBar';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn('border-b bg-background', className)}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Title and tagline */}
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              OpenClaw 实战指南
            </h1>
            <p className="text-sm text-muted-foreground">
              让 AI 助手真正帮你工作
            </p>
          </div>

          {/* Unified search box */}
          <SearchBar className="w-full md:w-96" />
        </div>
      </div>
    </header>
  );
}
