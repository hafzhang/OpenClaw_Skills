import { notFound } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import { getConfigBySlug, getAllConfigs } from '@/lib/configs';
import { ConfigDetail } from '@/components/ConfigDetail';
import { Button } from '@/components/ui/button';

interface ConfigPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all configs at build time
export async function generateStaticParams() {
  const configs = getAllConfigs();
  return configs.map((config) => ({
    slug: config.slug,
  }));
}

// Disable dynamic params since we generate all routes at build time
export const dynamicParams = false;

// Generate metadata for the page
export async function generateMetadata({ params }: ConfigPageProps) {
  const { slug } = await params;
  const config = getConfigBySlug(slug);

  if (!config) {
    return {
      title: 'Config Not Found',
    };
  }

  return {
    title: `${config.name} | OpenClaw 实战指南`,
    description: config.description,
  };
}

export default function ConfigPage({ params }: ConfigPageProps) {
  // Unwrap params Promise using React.use()
  const { slug } = React.use(params);
  const config = getConfigBySlug(slug);

  if (!config) {
    notFound();
  }

  // Get related configs
  const allConfigs = getAllConfigs();
  const relatedConfigs = config.relatedConfigs
    ? config.relatedConfigs
        .map((relatedId) => allConfigs.find((c) => c.id === relatedId))
        .filter((c): c is Exclude<typeof c, undefined> => c !== undefined)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <Link href="/configs" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 min-h-[44px]">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回配置分享
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <ConfigDetail
          config={config}
          relatedConfigs={relatedConfigs}
        />

        {/* Back to Configs Button */}
        <div className="mt-6 sm:mt-8">
          <Link href="/configs">
            <Button variant="outline" className="min-h-[44px]">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回配置分享
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
