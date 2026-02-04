import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import type { Components } from 'react-markdown';
import { getTutorialBySlug, getAllTutorials } from '@/lib/tutorials';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import 'highlight.js/styles/github-dark.css';

interface TutorialPageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all tutorials at build time
export async function generateStaticParams() {
  const tutorials = getAllTutorials();
  return tutorials.map((tutorial) => ({
    slug: tutorial.slug,
  }));
}

// Disable dynamic params since we generate all routes at build time
export const dynamicParams = false;

// Generate metadata for the page
export async function generateMetadata({ params }: TutorialPageProps) {
  const tutorial = getTutorialBySlug(params.slug);

  if (!tutorial) {
    return {
      title: 'Tutorial Not Found',
    };
  }

  return {
    title: `${tutorial.title} | OpenClaw 实战指南`,
    description: tutorial.description,
  };
}

function getDifficultyLabel(difficulty: string): string {
  switch (difficulty) {
    case 'beginner':
      return '入门';
    case 'intermediate':
      return '进阶';
    case 'advanced':
      return '高级';
    default:
      return difficulty;
  }
}

function getDifficultyVariant(difficulty: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (difficulty) {
    case 'beginner':
      return 'default';
    case 'intermediate':
      return 'secondary';
    case 'advanced':
      return 'destructive';
    default:
      return 'outline';
  }
}

export default function TutorialPage({ params }: TutorialPageProps) {
  const tutorial = getTutorialBySlug(params.slug);

  if (!tutorial) {
    notFound();
  }

  const relatedSkillsData = tutorial.relatedSkills.map(skillId => ({
    id: skillId,
    name: skillId,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 min-h-[44px]">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* Tutorial Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
            <Badge variant={getDifficultyVariant(tutorial.difficulty)}>
              {getDifficultyLabel(tutorial.difficulty)}
            </Badge>
            <Badge variant="outline">{tutorial.readTime} 分钟阅读</Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            {tutorial.title}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6">
            {tutorial.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
            <span>作者: {tutorial.author}</span>
            <span>•</span>
            <span>浏览 {tutorial.stats.viewCount} 次</span>
            <span>•</span>
            <span>
              {new Date(tutorial.createdAt).toLocaleDateString('zh-CN')}
            </span>
          </div>

          {/* Tags */}
          {tutorial.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
              {tutorial.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Tutorial Content */}
        <Card>
          <CardContent className="pt-4 sm:pt-6 px-2 sm:px-6">
            <div className="prose prose-gray max-w-none prose-sm sm:prose-base">
              <ReactMarkdown
                rehypePlugins={[rehypeHighlight]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl sm:text-3xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4 first:mt-0">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl sm:text-2xl font-semibold mt-6 sm:mt-8 mb-2 sm:mb-3">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg sm:text-xl font-semibold mt-4 sm:mt-6 mb-2 sm:mb-3">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-3 sm:mb-4 leading-6 sm:leading-7 text-sm sm:text-base">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-3 sm:mb-4 space-y-1 sm:space-y-2 text-sm sm:text-base">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-3 sm:mb-4 space-y-1 sm:space-y-2 text-sm sm:text-base">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-700 text-sm sm:text-base">{children}</li>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-blue-600 hover:text-blue-800 underline break-words"
                      target={href?.startsWith('http') ? '_blank' : undefined}
                      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {children}
                    </a>
                  ),
                  code: (props: any) => {
                    const { children, className, node, ...rest } = props;
                    const isInline = !className;
                    return (
                      <code
                        className={isInline ? 'bg-gray-100 px-1 py-0.5 rounded text-xs sm:text-sm font-mono text-pink-600 break-words' : className}
                        {...rest}
                      >
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre className="bg-gray-900 text-gray-100 p-3 sm:p-4 rounded-lg overflow-x-auto mb-3 sm:mb-4 text-xs sm:text-sm">
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-300 pl-3 sm:pl-4 italic text-gray-600 my-3 sm:my-4 text-sm sm:text-base">
                      {children}
                    </blockquote>
                  ),
                } as Components}
              >
                {tutorial.content}
              </ReactMarkdown>
            </div>
          </CardContent>

          {/* Related Skills */}
          {tutorial.relatedSkills.length > 0 && (
            <CardFooter className="border-t bg-gray-50 px-2 sm:px-6">
              <div className="w-full">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  相关技能
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tutorial.relatedSkills.map((skillId) => (
                    <Link key={skillId} href="/skills">
                      <Badge variant="secondary" className="hover:bg-gray-200 cursor-pointer">
                        {skillId}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </CardFooter>
          )}
        </Card>

        {/* Back to Home Button */}
        <div className="mt-6 sm:mt-8">
          <Link href="/">
            <Button variant="outline" className="min-h-[44px]">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回教程列表
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
