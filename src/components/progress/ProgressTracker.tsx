'use client';

import * as React from 'react';
import { Section, ReadingProgress } from '@/types';
import {
  initProgress,
  saveProgress,
  markSectionCompleted,
  calculateProgressFromScroll,
  extractSectionsFromContent
} from '@/lib/progress';
import { cn } from '@/lib/utils';

interface ProgressTrackerProps {
  id: string;
  type: 'tutorial' | 'skill';
  content?: string;
  children?: React.ReactNode;
}

export function ProgressTracker({ id, type, content, children }: ProgressTrackerProps) {
  const [progress, setProgress] = React.useState<ReadingProgress | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollHandlerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setMounted(true);

    // Extract sections from content if provided
    const sections = content ? extractSectionsFromContent(content) : [];
    const initialProgress = initProgress(id, type, sections);
    setProgress(initialProgress);

    // Restore scroll position
    if (initialProgress.scrollPosition > 0 && containerRef.current) {
      window.scrollTo({ top: initialProgress.scrollPosition, behavior: 'smooth' });
    }
  }, [id, type, content]);

  // Track scroll position
  React.useEffect(() => {
    if (!mounted || !progress) return;

    const handleScroll = () => {
      if (scrollHandlerRef.current) {
        cancelAnimationFrame(scrollHandlerRef.current);
      }

      scrollHandlerRef.current = requestAnimationFrame(() => {
        const scrollPosition = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percentComplete = calculateProgressFromScroll(scrollPosition, scrollHeight);

        // Save progress every 10% change or 5 seconds
        if (Math.abs(percentComplete - progress.percentComplete) >= 10) {
          const updatedProgress = {
            ...progress,
            scrollPosition,
            percentComplete,
          };
          saveProgress(updatedProgress);
          setProgress(updatedProgress);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollHandlerRef.current) {
        cancelAnimationFrame(scrollHandlerRef.current);
      }
      // Save final position on unmount
      if (progress) {
        saveProgress({
          ...progress,
          scrollPosition: window.scrollY,
        });
      }
    };
  }, [mounted, progress, id]);

  // Track section completion via intersection observer
  React.useEffect(() => {
    if (!mounted || !progress?.sections?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section-id');
            if (sectionId && !progress.completedSections.includes(sectionId)) {
              markSectionCompleted(id, sectionId);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe section headers
    progress.sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        element.setAttribute('data-section-id', section.id);
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [mounted, progress, id]);

  return (
    <div ref={containerRef} className="relative">
      {children}
    </div>
  );
}
