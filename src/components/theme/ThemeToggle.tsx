'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from './ThemeProvider';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { theme, resolvedTheme, toggleTheme, setTheme } = useTheme();

  const themeIcons: Record<string, string> = {
    light: '☀️',
    dark: '🌙',
    system: '🖥️',
  };

  const themeLabels: Record<string, string> = {
    light: '浅色',
    dark: '深色',
    system: '跟随系统',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="gap-2"
        aria-label={`当前主题: ${themeLabels[theme]}，点击切换`}
      >
        <span className="text-lg">{themeIcons[theme]}</span>
        {showLabel && <span>{themeLabels[theme]}</span>}
      </Button>

      {/* Quick theme selector */}
      <div className="flex items-center gap-1 border rounded-md p-1">
        {(['light', 'dark', 'system'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={cn(
              'px-2 py-1 rounded text-sm transition-colors',
              theme === t
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            )}
            aria-label={themeLabels[t]}
            title={themeLabels[t]}
          >
            {themeIcons[t]}
          </button>
        ))}
      </div>
    </div>
  );
}

// High contrast toggle
export function HighContrastToggle({ className }: { className?: string }) {
  const { highContrast, setHighContrast } = useTheme();

  return (
    <Button
      variant={highContrast ? 'default' : 'outline'}
      size="sm"
      onClick={() => setHighContrast(!highContrast)}
      className={cn('gap-2', className)}
    >
      <span>🔲</span>
      {highContrast ? '高对比度: 开启' : '高对比度: 关闭'}
    </Button>
  );
}

// Reduced motion toggle
export function ReducedMotionToggle({ className }: { className?: string }) {
  const { reducedMotion, setReducedMotion } = useTheme();

  return (
    <Button
      variant={reducedMotion ? 'default' : 'outline'}
      size="sm"
      onClick={() => setReducedMotion(!reducedMotion)}
      className={cn('gap-2', className)}
    >
      <span>{reducedMotion ? '⏹️' : '▶️'}</span>
      {reducedMotion ? '减少动画: 开启' : '减少动画: 关闭'}
    </Button>
  );
}
