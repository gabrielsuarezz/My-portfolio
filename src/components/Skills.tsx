import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Code2, Brain, Cpu, Database, LucideIcon } from "lucide-react";
import { TerminalBackground } from "./TerminalBackground";

interface SkillCategory {
  icon: LucideIcon;
  title: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    icon: Code2,
    title: "Languages & Frameworks",
    skills: ["Python", "Java", "C++", "JavaScript", "TypeScript", "SQL", "React", "Next.js", "Flask", "FastAPI"]
  },
  {
    icon: Brain,
    title: "AI & Machine Learning",
    skills: ["TensorFlow", "PyTorch", "OpenCV", "MediaPipe", "NLP", "LLMs", "Computer Vision", "Agent SDKs"]
  },
  {
    icon: Cpu,
    title: "Hardware & IoT",
    skills: ["Arduino", "TouchDesigner", "Embedded Systems", "Sensor Integration", "Hardware-Software Integration"]
  },
  {
    icon: Database,
    title: "Data & Infrastructure",
    skills: ["PostgreSQL", "SQLite", "Data Pipelines", "API Integration", "System Architecture", "Cloud Deployment"]
  }
];

const SkillCard = memo(({ category, index }: { 
  category: SkillCategory; 
  index: number;
}) => {
  const Icon = category.icon;

  return (
    <div 
      className="opacity-0 animate-[fadeSlideUp_0.5s_ease-out_forwards]"
      style={{ 
        animationDelay: `${index * 0.1}s`,
        transform: 'translateZ(0)',
      }}
    >
      <Card className="p-4 sm:p-6 h-full border-border/50 backdrop-blur-sm bg-card/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_-15px_hsl(var(--primary)/0.3)]">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="terminal-icon flex-shrink-0">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <h3 className="font-mono font-semibold text-base sm:text-lg text-foreground">{category.title}</h3>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {category.skills.map((skill, skillIndex) => (
            <span
              key={skill}
              className="text-xs sm:text-sm text-muted-foreground bg-secondary/50 border border-border/50 px-2 sm:px-3 py-1 rounded-sm font-mono hover:border-primary/40 hover:text-primary transition-all duration-200 opacity-0 animate-[fadeSlideUp_0.3s_ease-out_forwards]"
              style={{ animationDelay: `${(index * 0.1) + (skillIndex * 0.05)}s` }}
            >
              {skill}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
});

SkillCard.displayName = 'SkillCard';

export const Skills = memo(() => {
  return (
    <section id="skills" className="py-24 bg-muted/30 relative overflow-hidden">
      <TerminalBackground density="light" speed="slow" />
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 opacity-0 animate-[fadeSlideUp_0.5s_ease-out_forwards]">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 font-mono">
            <span className="text-muted-foreground opacity-60">// </span>
            Technical <span className="text-gradient">Expertise</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-mono opacity-80">
            Full-stack capabilities with a focus on AI, machine learning, and systems that bridge hardware with intelligence
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {skillCategories.map((category, index) => (
            <SkillCard 
              key={category.title}
              category={category} 
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

Skills.displayName = 'Skills';
