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
  type: 'tutorial' | 'skill' | 'config';
  item: Tutorial | Skill | AgentConfig;
}

export interface AgentConfig {
  id: string;
  name: string;
  slug: string;
  description: string;
  author: string;
  config: Record<string, unknown>;
  category: string;
  tags: string[];
  longDescription?: string;
  authorUrl?: string;
  relatedConfigs?: string[];
  likesCount?: number;
  forksCount?: number;
  isOfficial?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Phase 4: Advanced Search Types
export interface SearchFilters {
  query: string;
  types: SearchType[];
  categories: string[];
  difficulties: DifficultyLevel[];
  tags: string[];
  sortBy: SortOption;
  rating?: number;
}

export type SearchType = 'tutorial' | 'skill' | 'config' | 'all';

export type SortOption =
  | 'relevance'
  | 'title-asc'
  | 'title-desc'
  | 'date-asc'
  | 'date-desc'
  | 'rating-asc'
  | 'rating-desc'
  | 'popular';

export interface AdvancedSearchResult extends SearchResult {
  score: number;
  highlights?: {
    title?: string;
    description?: string;
  };
}

// Phase 4: Bookmark Types
export interface Bookmark {
  id: string;
  type: 'tutorial' | 'skill' | 'config';
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  createdAt: string;
  category?: string;
}

export interface BookmarkFolder {
  id: string;
  name: string;
  bookmarks: string[];
  createdAt: string;
  updatedAt: string;
}

// Phase 4: Progress Types
export interface ReadingProgress {
  id: string; // tutorial or skill slug
  type: 'tutorial' | 'skill';
  scrollPosition: number;
  lastReadAt: string;
  percentComplete: number;
  completedSections: string[];
  totalTime: number; // in seconds
  sections?: Section[];
}

export interface Section {
  id: string;
  title: string;
  completed: boolean;
}

// Phase 4: Rating Types
export interface Rating {
  id: string;
  itemId: string;
  itemType: 'tutorial' | 'skill' | 'config';
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AverageRating {
  itemId: string;
  average: number;
  count: number;
  distribution: [number, number, number, number, number]; // 1-5 stars
}

// Phase 4: Theme Types
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeSettings {
  mode: ThemeMode;
  highContrast: boolean;
  reducedMotion: boolean;
}

// Phase 4: Installation Types
export interface InstalledSkill {
  id: string;
  slug: string;
  name: string;
  command: string;
  installedAt: string;
  notes?: string;
  version?: string;
}

export interface InstallationExport {
  skills: InstalledSkill[];
  exportDate: string;
  format: 'shell' | 'json';
}

// Phase 4: TOC Types
export interface TableOfContents {
  id: string;
  title: string;
  level: number;
  children?: TableOfContents[];
}

export interface ActiveSection {
  id: string;
  title: string;
  progress: number;
}
