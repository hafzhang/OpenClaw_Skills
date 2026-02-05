import { SkillCard } from '@/components/SkillCard';
import { getVerifiedSkills, getSkillsByCategory } from '@/lib/skills';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Skill categories mapping
const skillCategories = [
  { id: 'development', name: '开发辅助', description: '代码开发、审查、数据库操作' },
  { id: 'productivity', name: '工作效率', description: '搜索、通讯、文档自动化' },
  { id: 'devops', name: 'DevOps', description: '部署、容器、云平台管理' },
  { id: 'ai-llms', name: 'AI & LLMs', description: 'AI 模型、提示工程、语音合成' },
  { id: 'utilities', name: '实用工具', description: 'PDF、视频/音频处理、文件工具' },
  { id: 'system', name: '系统工具', description: '文件系统、系统操作' },
  { id: 'creative', name: '创意工具', description: '图像处理、AI 生成' },
] as const;

export default function SkillsPage() {
  const verifiedSkills = getVerifiedSkills();

  // Group skills by category
  const skillsByCategory = skillCategories.map((category) => ({
    ...category,
    skills: getSkillsByCategory(category.id).filter((skill) => skill.verified),
  }));

  // Filter out categories with no skills
  const categoriesWithSkills = skillsByCategory.filter((cat) => cat.skills.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">技能索引</h1>
          <p className="text-muted-foreground text-lg">
            浏览所有验证过的 OpenClaw 技能，扩展 AI 助手能力
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            共 {verifiedSkills.length} 个已验证技能
          </p>
        </div>

        {/* Skills by category */}
        <div className="space-y-8 md:space-y-12">
          {categoriesWithSkills.map((category) => (
            <div key={category.id}>
              {/* Category header */}
              <div className="mb-4 md:mb-6">
                <h2 className="text-2xl md:text-3xl font-semibold mb-2">{category.name}</h2>
                <p className="text-muted-foreground">{category.description}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {category.skills.length} 个技能
                </p>
              </div>

              {/* Skills grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {category.skills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <Card className="mt-12 md:mt-16 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">提交新技能</CardTitle>
            <CardDescription>
              发现了有用的 OpenClaw 技能？欢迎通过 GitHub Issues 提交，经过验证后将添加到此索引。
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
