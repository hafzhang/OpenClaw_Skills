'use client';

import * as React from 'react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { TutorialCard } from '@/components/TutorialCard';
import { SkillCard } from '@/components/SkillCard';
import { CategoryFilter, CategorySlug } from '@/components/CategoryFilter';
import { getAllTutorials, getFeaturedTutorials } from '@/lib/tutorials';
import { getAllSkills } from '@/lib/skills';
import { Tutorial, Skill } from '@/types';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = React.useState<CategorySlug>('all');
  const [filteredTutorials, setFilteredTutorials] = React.useState<Tutorial[]>([]);
  const [displayedSkills, setDisplayedSkills] = React.useState<Skill[]>([]);

  // Load initial data
  React.useEffect(() => {
    const allTutorials = getAllTutorials();
    const featured = getFeaturedTutorials();
    const allSkills = getAllSkills();

    // Set filtered tutorials based on selected category
    if (selectedCategory === 'all') {
      setFilteredTutorials(featured);
    } else {
      setFilteredTutorials(allTutorials.filter(t => t.category === selectedCategory));
    }

    // Display first 6 skills as auxiliary section
    setDisplayedSkills(allSkills.slice(0, 6));
  }, [selectedCategory]);

  const quickStartTutorials = React.useMemo(() => {
    const allTutorials = getAllTutorials();
    return allTutorials.filter(t => t.category === 'quick-start').slice(0, 3);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            OpenClaw 实战指南
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            30 个真实案例，让 AI 助手真正帮你工作
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </section>

        {/* Quick Start Section */}
        <section className="py-8 md:py-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">快速入门</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickStartTutorials.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>
        </section>

        {/* Featured Tutorials Section */}
        <section className="py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h2 className="text-2xl md:text-3xl font-bold">精选教程</h2>
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              className="flex-wrap"
            />
          </div>

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
        </section>

        {/* Skills Index Section (Auxiliary) */}
        <section className="py-8 md:py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">技能索引</h2>
            <a
              href="/skills"
              className="text-sm text-primary hover:underline"
            >
              查看全部 →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 OpenClaw 实战指南. 教程为主，技能索引为辅。</p>
        </div>
      </footer>
    </div>
  );
}
