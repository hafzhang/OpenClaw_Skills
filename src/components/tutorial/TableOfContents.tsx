'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  content?: string;
  className?: string;
  sticky?: boolean;
}

export function TableOfContents({ content, className, sticky = true }: TableOfContentsProps) {
  const [items, setItems] = React.useState<TOCItem[]>([]);
  const [activeId, setActiveId] = React.useState<string>('');

  // Extract headings from content or DOM
  React.useEffect(() => {
    if (typeof document === 'undefined') return;

    const extractHeadings = () => {
      const headings = document.querySelectorAll('h2, h3, h4');
      const tocItems: TOCItem[] = [];

      headings.forEach((heading) => {
        const id = heading.id || heading.textContent?.toLowerCase().replace(/[^\w]+/g, '-');
        if (id) {
          heading.id = id;
          tocItems.push({
            id,
            title: heading.textContent || '',
            level: parseInt(heading.tagName[1]),
          });
        }
      });

      setItems(tocItems);
    };

    // Delay to ensure content is rendered
    const timer = setTimeout(extractHeadings, 100);
    return () => clearTimeout(timer);
  }, [content]);

  // Track active section
  React.useEffect(() => {
    if (typeof window === 'undefined' || items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -80% 0%' }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      className={cn(
        'rounded-lg border bg-card p-4',
        sticky && 'sticky top-20',
        className
      )}
    >
      <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
        目录
      </h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(
              'text-sm transition-colors',
              item.level === 2 && 'font-medium',
              item.level === 3 && 'pl-3',
              item.level === 4 && 'pl-6'
            )}
          >
            <button
              onClick={() => handleClick(item.id)}
              className={cn(
                'block w-full text-left py-1 px-2 rounded transition-colors',
                activeId === item.id
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Print button component
export function PrintButton({ className }: { className?: string }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border hover:bg-muted transition-colors',
        'print:hidden',
        className
      )}
    >
      <span>🖨️</span>
      打印
    </button>
  );
}

// Code copy button
export function CodeCopyButton({ code, className }: { code: string; className?: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'absolute top-2 right-2 px-2 py-1 text-xs rounded bg-muted/80 hover:bg-muted transition-colors',
        className
      )}
      aria-label={copied ? '已复制' : '复制代码'}
    >
      {copied ? '✓ 已复制' : '📋 复制'}
    </button>
  );
}
