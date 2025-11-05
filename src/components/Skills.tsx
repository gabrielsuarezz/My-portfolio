import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Code2, Brain, Cpu, Database } from "lucide-react";

const skillCategories = [
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

export const Skills = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Technical <span className="text-gradient">Expertise</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Full-stack capabilities with a focus on AI, machine learning, and systems that bridge hardware with intelligence
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="p-6 h-full hover-lift border-border/50 backdrop-blur-sm bg-card/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{category.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
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
