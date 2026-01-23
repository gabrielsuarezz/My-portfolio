import { memo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Code2, Brain, Cpu, Database, LucideIcon } from "lucide-react";
import { TerminalBackground } from "./TerminalBackground";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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

const SkillCard = memo(({ category, index, prefersReducedMotion }: { 
  category: SkillCategory; 
  index: number;
  prefersReducedMotion: boolean;
}) => {
  const Icon = category.icon;
  
  const cardVariants = prefersReducedMotion 
    ? { initial: { opacity: 1 }, whileInView: { opacity: 1 } }
    : { 
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 }
      };

  return (
    <motion.div
      {...cardVariants}
      viewport={{ once: true }}
      transition={{ delay: prefersReducedMotion ? 0 : index * 0.1, duration: 0.5 }}
    >
      <Card className="p-4 sm:p-6 h-full hover-lift border-border/50 backdrop-blur-sm bg-card/50">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="terminal-icon flex-shrink-0">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <h3 className="font-mono font-semibold text-base sm:text-lg text-foreground">{category.title}</h3>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {category.skills.map((skill) => (
            <span
              key={skill}
              className="text-xs sm:text-sm text-muted-foreground bg-secondary/50 border border-border/50 px-2 sm:px-3 py-1 rounded-sm font-mono hover:border-primary/40 hover:text-primary transition-colors duration-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </Card>
    </motion.div>
  );
});

SkillCard.displayName = 'SkillCard';

export const Skills = memo(() => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="skills" className="py-24 bg-muted/30 relative overflow-hidden">
      <TerminalBackground density="light" speed="slow" />
      <div className="container mx-auto px-6">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 font-mono">
            <span className="text-muted-foreground opacity-60">// </span>
            Technical <span className="text-gradient">Expertise</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-mono opacity-80">
            Full-stack capabilities with a focus on AI, machine learning, and systems that bridge hardware with intelligence
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {skillCategories.map((category, index) => (
            <SkillCard 
              key={category.title}
              category={category} 
              index={index}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

Skills.displayName = 'Skills';
