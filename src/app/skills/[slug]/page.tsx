import { notFound } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import { getSkillBySlug, getAllSkills } from '@/lib/skills';
import { getTutorialsBySkill } from '@/lib/tutorials';
import { SkillDetail } from '@/components/SkillDetail';
import { Button } from '@/components/ui/button';
import {
  generateSkillStructuredData,
  generateBreadcrumbStructuredData,
} from '@/lib/structured-data';

interface SkillPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all skills at build time
export async function generateStaticParams() {
  const skills = getAllSkills();
  return skills.map((skill) => ({
    slug: skill.slug,
  }));
}

// Disable dynamic params since we generate all routes at build time
export const dynamicParams = false;

// Generate metadata for the page
export async function generateMetadata({ params }: SkillPageProps) {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);

  if (!skill) {
    return {
      title: 'Skill Not Found',
    };
  }

  const baseUrl = 'https://www.clawtools.dev';
  const canonicalUrl = `${baseUrl}/skills/${slug}`;

  return {
    title: `${skill.name} - OpenClaw 技能 | OpenClaw 实战指南`,
    description: skill.longDescription || skill.description,
    keywords: [
      ...skill.tags,
      'OpenClaw',
      'OpenClaw 技能',
      'Claude Code',
      'AI 助手',
      skill.name,
      skill.category,
    ].join(', '),
    authors: [{ name: skill.author }],
    creator: skill.author,
    openGraph: {
      type: 'website',
      locale: 'zh_CN',
      url: canonicalUrl,
      title: `${skill.name} - OpenClaw 技能`,
      description: skill.longDescription || skill.description,
      siteName: 'OpenClaw 实战指南',
      images: [
        {
          url: `/og-skills/${slug}.png`,
          width: 1200,
          height: 630,
          alt: skill.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${skill.name} - OpenClaw 技能`,
      description: skill.longDescription || skill.description,
      images: [`/og-skills/${slug}.png`],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default function SkillPage({ params }: SkillPageProps) {
  // Unwrap params Promise using React.use()
  const { slug } = React.use(params);
  const skill = getSkillBySlug(slug);

  if (!skill) {
    notFound();
  }

  // Get related skills
  const allSkills = getAllSkills();
  const relatedSkills = skill.relatedSkills
    ? skill.relatedSkills
        .map((relatedId) => allSkills.find((s) => s.id === relatedId))
        .filter((s): s is Exclude<typeof s, undefined> => s !== undefined)
    : [];

  // Get related tutorials (tutorials that reference this skill)
  const relatedTutorials = getTutorialsBySkill(skill.id);

  // Generate structured data
  const skillStructuredData = generateSkillStructuredData(skill);
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: '首页', url: 'https://www.clawtools.dev' },
    { name: '技能索引', url: 'https://www.clawtools.dev/skills' },
    { name: skill.name, url: `https://www.clawtools.dev/skills/${skill.slug}` },
  ]);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(skillStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <Link href="/skills" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 min-h-[44px]">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回技能索引
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <SkillDetail
          skill={skill}
          relatedSkills={relatedSkills}
          relatedTutorials={relatedTutorials}
        />

        {/* Back to Skills Button */}
        <div className="mt-6 sm:mt-8">
          <Link href="/skills">
            <Button variant="outline" className="min-h-[44px]">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回技能索引
            </Button>
          </Link>
        </div>
      </main>
    </div>
    </>
  );
}
