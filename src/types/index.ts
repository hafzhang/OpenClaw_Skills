export interface Tutorial {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: number;
  author: string;
  relatedSkills: string[];
  stats: {
    viewCount: number;
  };
  createdAt: string;
  featured: boolean;
}

export interface TutorialCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  category: string;
  tags: string[];
  author: string;
  command: string;
  source: string;
  verified: boolean;
  url: string;
  installCount?: number;
  relatedSkills?: string[];
  createdAt: string;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface SearchResult {
  type: 'tutorial' | 'skill';
  item: Tutorial | Skill;
}
