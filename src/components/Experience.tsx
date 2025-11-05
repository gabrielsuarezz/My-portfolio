import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Briefcase, GraduationCap, Users } from "lucide-react";
import { TerminalBackground } from "./TerminalBackground";

const experiences = [
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
    icon: GraduationCap,
    title: "CS Student",
    company: "Florida International University",
    period: "Expected 2026",
    description: "Bachelor of Science in Computer Science with focus on Artificial Intelligence and Software Engineering. Active in hackathons and technical communities."
  }
];

export const Experience = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <TerminalBackground density="light" speed="medium" />
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            Experience & <span className="text-gradient">Education</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            From internships to leadership roles, building impact through code and community
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {experiences.map((exp, index) => {
            const Icon = exp.icon;
            return (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="p-4 sm:p-6 hover-lift border-border/50 backdrop-blur-sm bg-card/50">
                  <div className="flex gap-3 sm:gap-4">
                    <div className="flex-shrink-0">
                      <div className="p-2 sm:p-3 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 sm:mb-2 gap-1">
                        <h3 className="text-lg sm:text-xl font-bold">{exp.title}</h3>
                        <span className="text-xs sm:text-sm text-muted-foreground flex-shrink-0">{exp.period}</span>
                      </div>
                      <p className="text-primary font-medium mb-2 sm:mb-3 text-sm sm:text-base">{exp.company}</p>
                      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{exp.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
