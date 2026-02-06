'use client';

import * as React from 'react';
import { Header } from '@/components/Header';
import { TutorialCard } from '@/components/TutorialCard';
import { getAllTutorials, getTutorialsByCategory } from '@/lib/tutorials';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

// Tutorial categories
const tutorialCategories = [
  { id: 'quick-start', name: '快速入门', description: '5分钟上手，快速了解 OpenClaw' },
  { id: 'development', name: '开发实战', description: 'GitHub、CLI、代码审查等实战教程' },
  { id: 'devops', name: 'DevOps', description: 'Docker、Kubernetes、AWS 部署' },
  { id: 'productivity', name: '工作效率', description: '时间管理、团队协作、自动化工具' },
  { id: 'ai-llms', name: 'AI与大模型', description: 'AI 工具集成、大模型应用' },
  { id: 'utilities', name: '实用工具', description: '系统工具、命令行技巧' },
] as const;

type CategorySlug = 'all' | typeof tutorialCategories[number]['id'];

export default function TutorialsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState<CategorySlug>('all');

  // Filter tutorials by category
  const filteredTutorials = React.useMemo(() => {
    if (selectedCategory === 'all') {
      return getAllTutorials();
    }
    return getTutorialsByCategory(selectedCategory);
  }, [selectedCategory]);

  // Get tutorial counts per category
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    tutorialCategories.forEach((cat) => {
      counts[cat.id] = getTutorialsByCategory(cat.id).length;
    });
    return counts;
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">全部教程</h1>
          <p className="text-muted-foreground text-lg">
            探索完整的 OpenClaw 教程库，从入门到精通
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            共 {getAllTutorials().length} 个教程
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              全部 ({getAllTutorials().length})
            </button>
            {tutorialCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {category.name} ({categoryCounts[category.id] || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Current Category Description */}
        {selectedCategory !== 'all' && (
          <Card className="mb-8 p-6 bg-muted/50">
            <h2 className="text-xl font-semibold mb-2">
              {tutorialCategories.find((c) => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-muted-foreground">
              {tutorialCategories.find((c) => c.id === selectedCategory)?.description}
            </p>
          </Card>
        )}

        {/* Tutorials Grid */}
        {filteredTutorials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutorials.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            该分类下暂无教程
          </div>
        )}

        {/* Footer Note */}
        {selectedCategory === 'all' && (
          <Card className="mt-12 bg-muted/50">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">学习建议</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 新手建议从<strong>快速入门</strong>开始，了解 OpenClaw 基础</li>
                <li>• 有一定基础后，可以学习<strong>开发实战</strong>和<strong>DevOps</strong></li>
                <li>• 提升工作效率可参考<strong>工作效率</strong>分类教程</li>
                <li>• 对 AI 感兴趣的用户可以探索<strong>AI与大模型</strong></li>
                <li>• 高级用户可以学习<strong>实用工具</strong>中的技巧</li>
              </ul>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
