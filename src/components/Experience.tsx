import { memo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Briefcase, GraduationCap, Users, Shield, LucideIcon } from "lucide-react";
import { TerminalBackground } from "./TerminalBackground";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Experience {
  icon: LucideIcon;
  title: string;
  company: string;
  period: string;
  description: string;
}

const experiences: Experience[] = [
  {
    icon: Briefcase,
    title: "Software Engineering Intern",
    company: "Koombea",
    period: "2024",
    description: "Contributed to full-stack product development, collaborating across design and backend teams to implement production-grade features in agile environments."
  },
  {
    icon: Users,
    title: "Build Lead",
    company: "INIT FIU",
    period: "2024 - Present",
    description: "Lead and mentor student teams through Advanced AI/ML Build Track. Guide peers on architecture decisions, debugging, and model optimization while fostering collaborative learning."
  },
  {
    icon: Shield,
    title: "2nd Place - FlagOps CTF",
    company: "INIT FIU Cybersecurity",
    period: "2024",
    description: "Placed 2nd in competitive cybersecurity CTF, improving from previous 3rd place. Earned Microsoft Azure Security Engineer course access and hands-on training with Microsoft engineers."
  },
  {
    icon: GraduationCap,
    title: "CS Student",
    company: "Florida International University",
    period: "Expected 2026",
    description: "Bachelor of Science in Computer Science with focus on Artificial Intelligence and Software Engineering. Active in hackathons and technical communities."
  }
];

const ExperienceCard = memo(({ exp, index, prefersReducedMotion }: { 
  exp: Experience; 
  index: number;
  prefersReducedMotion: boolean;
}) => {
  const Icon = exp.icon;
  
  const cardVariants = prefersReducedMotion 
    ? { initial: { opacity: 1 }, whileInView: { opacity: 1 } }
    : { 
        initial: { opacity: 0, x: -20 },
        whileInView: { opacity: 1, x: 0 }
      };

  return (
    <motion.div
      {...cardVariants}
      viewport={{ once: true }}
      transition={{ delay: prefersReducedMotion ? 0 : index * 0.1, duration: 0.5 }}
    >
      <Card className="p-4 sm:p-6 hover-lift border-border/50 backdrop-blur-sm bg-card/50">
        <div className="flex gap-3 sm:gap-4">
          <div className="flex-shrink-0">
            <div className="terminal-icon">
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 sm:mb-2 gap-1">
              <h3 className="text-lg sm:text-xl font-bold font-mono">{exp.title}</h3>
              <span className="text-xs sm:text-sm text-primary font-mono flex-shrink-0 opacity-80">{exp.period}</span>
            </div>
            <p className="text-primary font-medium mb-2 sm:mb-3 text-sm sm:text-base font-mono">{exp.company}</p>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{exp.description}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
});

ExperienceCard.displayName = 'ExperienceCard';

export const Experience = memo(() => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
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
            Experience & <span className="text-gradient">Education</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-mono opacity-80">
            From internships to leadership roles, building impact through code and community
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {experiences.map((exp, index) => (
            <ExperienceCard 
              key={exp.title}
              exp={exp} 
              index={index}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

Experience.displayName = 'Experience';
