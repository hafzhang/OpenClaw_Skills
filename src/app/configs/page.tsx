'use client';

import * as React from 'react';
import { ConfigCard } from '@/components/ConfigCard';
import { getAllConfigs, getConfigsByCategory } from '@/lib/configs';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AgentConfig } from '@/types';

// Config categories mapping
const configCategories = [
  { id: 'development', name: '开发辅助', description: '代码审查、调试、开发工具' },
  { id: 'productivity', name: '工作效率', description: '通用助手、文档写作、任务管理' },
  { id: 'learning', name: '学习教学', description: '编程导师、学习辅助、概念讲解' },
] as const;

type CategorySlug = 'all' | 'development' | 'productivity' | 'learning';

const categories = [
  { id: 'all', label: '全部' },
  { id: 'development', label: '开发辅助' },
  { id: 'productivity', label: '工作效率' },
  { id: 'learning', label: '学习教学' },
] as const;

export default function ConfigsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState<CategorySlug>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const allConfigs = getAllConfigs();

  // Filter configs by category
  const categoryFiltered = React.useMemo(() => {
    if (selectedCategory === 'all') {
      return allConfigs;
    }
    return getConfigsByCategory(selectedCategory);
  }, [selectedCategory, allConfigs]);

  // Filter by search query
  const filteredConfigs = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return categoryFiltered;
    }
    const query = searchQuery.toLowerCase();
    return categoryFiltered.filter((config) => {
      return (
        config.name.toLowerCase().includes(query) ||
        config.description.toLowerCase().includes(query) ||
        config.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }, [categoryFiltered, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Agent 配置分享</h1>
          <p className="text-muted-foreground text-lg">
            发现和使用社区创建的 OpenClaw Agent 配置，快速定制你的 AI 助手
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            共 {allConfigs.length} 个配置
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            type="search"
            placeholder="搜索配置名称、描述或标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md min-h-[44px]"
          />
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id as CategorySlug)}
              className="min-h-[44px]"
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Empty state */}
        {filteredConfigs.length === 0 ? (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">未找到匹配的配置</CardTitle>
              <CardDescription>
                {searchQuery ? '尝试调整搜索关键词' : '该分类下暂无配置'}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <>
            {/* Configs by category */}
            {selectedCategory === 'all' ? (
              <div className="space-y-8 md:space-y-12">
                {configCategories.map((category) => {
                  const categoryConfigs = getConfigsByCategory(category.id);
                  if (categoryConfigs.length === 0) return null;

                  return (
                    <div key={category.id}>
                      {/* Category header */}
                      <div className="mb-4 md:mb-6">
                        <h2 className="text-2xl md:text-3xl font-semibold mb-2">{category.name}</h2>
                        <p className="text-muted-foreground">{category.description}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {categoryConfigs.length} 个配置
                        </p>
                      </div>

                      {/* Configs grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {categoryConfigs
                          .filter((config) => {
                            if (!searchQuery.trim()) return true;
                            const query = searchQuery.toLowerCase();
                            return (
                              config.name.toLowerCase().includes(query) ||
                              config.description.toLowerCase().includes(query) ||
                              config.tags.some((tag) => tag.toLowerCase().includes(query))
                            );
                          })
                          .map((config) => (
                            <ConfigCard key={config.id} config={config} />
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredConfigs.map((config) => (
                  <ConfigCard key={config.id} config={config} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Footer note */}
        <Card className="mt-12 md:mt-16 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">分享你的配置</CardTitle>
            <CardDescription>
              创建了有用的 Agent 配置？欢迎通过 GitHub PR 提交，经过审核后将添加到此分享站。
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
