import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tutorial } from '@/types';

interface TutorialCardProps {
  tutorial: Tutorial;
}

const difficultyLabels: Record<Tutorial['difficulty'], { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  beginner: { label: '入门', variant: 'default' },
  intermediate: { label: '进阶', variant: 'secondary' },
  advanced: { label: '高级', variant: 'outline' },
};

export function TutorialCard({ tutorial }: TutorialCardProps) {
  const { title, description, difficulty, readTime, relatedSkills, stats, slug } = tutorial;
  const difficultyConfig = difficultyLabels[difficulty];

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl group-hover:text-primary transition-colors">
            <Link href={`/tutorial/${slug}`} className="hover:underline">
              {title}
            </Link>
          </CardTitle>
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Badge variant={difficultyConfig.variant}>{difficultyConfig.label}</Badge>
          <span>{readTime} 分钟阅读</span>
          <span>•</span>
          <span>{stats.viewCount} 次浏览</span>
        </div>

        {relatedSkills && relatedSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {relatedSkills.map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2">
        <Button asChild className="flex-1 min-h-[44px]">
          <Link href={`/tutorial/${slug}`}>开始阅读</Link>
        </Button>
        <Button variant="outline" size="icon" aria-label="收藏教程" className="min-h-[44px] min-w-[44px]">
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
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
          </svg>
        </Button>
      </CardFooter>
    </Card>
  );
}
