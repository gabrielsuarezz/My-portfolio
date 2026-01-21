import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Trophy, Shield, Palette, Cpu, Sparkles, GraduationCap, LucideIcon } from "lucide-react";
import { useLongPress } from "@/hooks/useLongPress";

const getAwardIcon = (award: string): LucideIcon => {
  if (award.includes("1st Place")) return Trophy;
  if (award.includes("SharkByte")) return Shield;
  if (award.includes("Creative")) return Palette;
  if (award.includes("ARM")) return Cpu;
  if (award.includes("INIT")) return Sparkles;
  if (award.includes("University")) return GraduationCap;
  return Trophy;
};

const stripEmoji = (text: string): string => {
  return text.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
};

interface ProjectLinks {
  demo?: string;
  github?: string;
  devpost?: string;
}

interface Project {
  title: string;
  description: string;
  tags: string[];
  award?: string;
  links: ProjectLinks;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  isRevealed: boolean;
  onLongPress: (title: string) => void;
}

export const ProjectCard = ({ project, index, isRevealed, onLongPress }: ProjectCardProps) => {
  const longPressHandlers = useLongPress(() => onLongPress(project.title));

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.15, duration: 0.8, type: "spring" }}
      whileHover={{ y: -10 }}
      {...longPressHandlers}
    >
      <Card className="p-8 h-full border-border/50 backdrop-blur-sm bg-card/30 relative overflow-hidden group select-none">
        {/* Animated background gradient on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'radial-gradient(circle at center, hsl(217 91% 60% / 0.1) 0%, transparent 70%)',
          }}
        />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <motion.h3 
              className="text-2xl font-bold group-hover:text-primary transition-colors"
              whileHover={{ x: 5 }}
            >
              {project.title}
            </motion.h3>
            {project.award && (
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                {(() => {
                  const AwardIcon = getAwardIcon(project.award);
                  return <AwardIcon className="h-5 w-5 text-accent flex-shrink-0 ml-2" />;
                })()}
              </motion.div>
            )}
          </div>

          {project.award && (
            <Badge variant="secondary" className="mb-4 bg-accent/20 text-accent border-accent/30">
              {stripEmoji(project.award)}
            </Badge>
          )}

          <p className="text-muted-foreground mb-6 leading-relaxed">
            {project.description}
          </p>

          {isRevealed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3 bg-accent/10 border border-accent/30 rounded text-sm text-accent"
            >
              <strong>Dev Note:</strong> {
                project.title === "Voxtant" ? "Built the entire backend in 8 hours with zero sleep. The LLM integration was a nightmare but so worth it." :
                project.title === "Shadow Vision" ? "Creating the dataset was tedious - I spent 6 hours making hand gestures in front of a camera. My hand was sore for days!" :
                project.title === "HeliosAI" ? "The servo motor kept breaking. We went through 3 different motors before finding one that could handle the solar panel weight." :
                "Leading a team remotely while building ML models was challenging but incredibly rewarding. We had late-night debugging sessions that turned into great learning moments."
              }
            </motion.div>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag, tagIndex) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.15 + tagIndex * 0.05 }}
              >
                <Badge variant="outline" className="text-xs border-primary/30 hover:border-primary hover:bg-primary/10 transition-all">
                  {tag}
                </Badge>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-3">
            {project.links.demo && (
              <Button variant="default" size="sm" asChild className="group/btn">
                <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4 group-hover/btn:rotate-45 transition-transform" />
                  Live Demo
                </a>
              </Button>
            )}
            {project.links.github && (
              <Button variant="outline" size="sm" asChild className="group/btn">
                <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                  Code
                </a>
              </Button>
            )}
            {project.links.devpost && (
              <Button variant="outline" size="sm" asChild className="group/btn">
                <a href={project.links.devpost} target="_blank" rel="noopener noreferrer">
                  Devpost
                </a>
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
