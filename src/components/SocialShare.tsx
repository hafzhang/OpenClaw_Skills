'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';

interface SocialShareProps {
  title: string;
  description: string;
  url: string;
}

export function SocialShare({ title, description, url }: SocialShareProps) {
  const [copied, setCopied] = React.useState(false);

  // Get current URL if not provided
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(description)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
  };

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <span className="text-sm text-gray-600 font-medium">分享:</span>

      {/* Twitter/X */}
      <a
        href={shareUrls.twitter}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X (Twitter)"
        className="inline-flex"
      >
        <Button
          variant="outline"
          size="sm"
          className="min-h-[36px] hover:bg-gray-100"
        >
          <svg
            className="w-4 h-4 mr-1.5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="hidden sm:inline">分享到 X</span>
        </Button>
      </a>

      {/* LinkedIn */}
      <a
        href={shareUrls.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="inline-flex"
      >
        <Button
          variant="outline"
          size="sm"
          className="min-h-[36px] hover:bg-gray-100"
        >
          <svg
            className="w-4 h-4 mr-1.5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          <span className="hidden sm:inline">分享到 LinkedIn</span>
        </Button>
      </a>

      {/* Copy Link */}
      <Button
        variant={copied ? 'default' : 'outline'}
        size="sm"
        onClick={handleCopyLink}
        className="min-h-[36px]"
      >
        {copied ? (
          <>
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            已复制
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            复制链接
          </>
        )}
      </Button>
    </div>
  );
}
