import { notFound } from 'next/navigation';
import React from 'react';
import { getSkillBySlug, getAllSkills } from '@/lib/skills';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skill } from '@/types';

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

  return {
    title: `${skill.name} | OpenClaw 实战指南`,
    description: skill.description,
  };
}

function getCategoryLabel(category: string): string {
  const categoryMap: Record<string, string> = {
    'development': '开发辅助',
    'productivity': '工作效率',
    'devops': '运维工具',
    'ai-llms': 'AI/LLM',
    'utilities': '实用工具',
  };
  return categoryMap[category] || category;
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
        .filter((s): s is Skill => s !== undefined)
    : [];

  return (
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
        {/* Skill Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
            <Badge variant="outline">{getCategoryLabel(skill.category)}</Badge>
            {skill.verified && (
              <Badge variant="default">已验证</Badge>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            {skill.name}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6">
            {skill.description}
          </p>

          {skill.longDescription && (
            <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">
              {skill.longDescription}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-4">
            <span>作者: {skill.author}</span>
            {skill.installCount && (
              <>
                <span>•</span>
                <span>安装 {skill.installCount.toLocaleString()} 次</span>
              </>
            )}
            <span>•</span>
            <span>
              {new Date(skill.createdAt).toLocaleDateString('zh-CN')}
            </span>
          </div>

          {/* Tags */}
          {skill.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
              {skill.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Installation */}
        <Card className="mb-6 sm:mb-8">
          <CardContent className="pt-4 sm:pt-6 px-2 sm:px-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
              安装命令
            </h2>
            <div className="bg-gray-900 text-gray-100 p-3 sm:p-4 rounded-lg overflow-x-auto">
              <code className="text-xs sm:text-sm font-mono break-all">
                {skill.command}
              </code>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              复制命令后在终端中执行即可安装此技能
            </p>
          </CardContent>
        </Card>

        {/* Source Links */}
        <Card className="mb-6 sm:mb-8">
          <CardContent className="pt-4 sm:pt-6 px-2 sm:px-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
              相关链接
            </h2>
            <div className="space-y-2 sm:space-y-3">
              <a
                href={skill.source}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub 仓库
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              {skill.url && skill.url !== skill.source && (
                <a
                  href={skill.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  项目主页
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Related Skills */}
        {relatedSkills.length > 0 && (
          <Card>
            <CardContent className="pt-4 sm:pt-6 px-2 sm:px-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                相关技能
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {relatedSkills.map((relatedSkill) => (
                  <Link
                    key={relatedSkill.id}
                    href={`/skills/${relatedSkill.slug}`}
                    className="block p-3 sm:p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                          {relatedSkill.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                          {relatedSkill.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {relatedSkill.verified && (
                            <Badge variant="default" className="text-xs">已验证</Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {getCategoryLabel(relatedSkill.category)}
                          </Badge>
                        </div>
                      </div>
                      <svg className="w-4 h-4 ml-2 text-gray-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
  );
}
