import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Trophy, Shield, Palette, Cpu, Sparkles, GraduationCap, LucideIcon } from "lucide-react";
import { useLongPress } from "@/hooks/useLongPress";
import { memo, useMemo } from "react";

const getAwardIcon = (award: string): LucideIcon => {
  if (award.includes("1st Place")) return Trophy;
  if (award.includes("Knight Hacks") || award.includes("MLH")) return Trophy;
  if (award.includes("SharkByte")) return Shield;
  if (award.includes("Creative")) return Palette;
  if (award.includes("ARM")) return Cpu;
  if (award.includes("INIT") || award.includes("Mobile")) return Sparkles;
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

// Dev notes map - memoized outside component
const DEV_NOTES: Record<string, string> = {
  "Voxtant": "Built the entire backend in 8 hours with zero sleep. The LLM integration was a nightmare but so worth it.",
  "Shadow Vision": "Creating the dataset was tedious - I spent 6 hours making hand gestures in front of a camera. My hand was sore for days!",
  "HeliosAI": "The servo motor kept breaking. We went through 3 different motors before finding one that could handle the solar panel weight.",
  "FrontalFriend": "First mobile app! Learned React Native and Expo from scratch. The media playback cleanup patterns were tricky to get right.",
  "SHE<Codes/>": "Senior design capstone - teaching Python through history. Blockly + Skulpt integration was surprisingly smooth once I figured out the bridge.",
};

const DEFAULT_DEV_NOTE = "Leading a team remotely while building ML models was challenging but incredibly rewarding. We had late-night debugging sessions that turned into great learning moments.";

export const ProjectCard = memo(({ project, index, isRevealed, onLongPress }: ProjectCardProps) => {
  const longPressHandlers = useLongPress(() => onLongPress(project.title));
  
  const devNote = useMemo(() => 
    DEV_NOTES[project.title] || DEFAULT_DEV_NOTE,
    [project.title]
  );

  const AwardIcon = useMemo(() => 
    project.award ? getAwardIcon(project.award) : null,
    [project.award]
  );

  return (
    <div
      className="opacity-0 animate-[fadeSlideUp_0.6s_ease-out_forwards]"
      style={{ 
        animationDelay: `${index * 0.1}s`,
        transform: 'translateZ(0)',
      }}
      {...longPressHandlers}
    >
      <Card className="p-4 sm:p-6 md:p-8 h-full border-border/50 backdrop-blur-sm bg-card/30 relative overflow-hidden group select-none transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-15px_hsl(var(--primary)/0.3)]">
        {/* Background gradient on hover - CSS only */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle at center, hsl(217 91% 60% / 0.08) 0%, transparent 70%)',
          }}
        />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl sm:text-2xl font-bold font-mono group-hover:text-primary transition-colors duration-200">
              {project.title}
            </h3>
            {AwardIcon && (
              <div className="terminal-icon !p-1.5">
                <AwardIcon className="h-4 w-4" />
              </div>
            )}
          </div>

          {project.award && (
            <Badge variant="secondary" className="mb-4 bg-accent/20 text-accent border-accent/30">
              {stripEmoji(project.award)}
            </Badge>
          )}

          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
            {project.description}
          </p>

          {isRevealed && (
            <div className="mb-4 p-3 bg-accent/10 border border-accent/30 rounded text-sm text-accent animate-[fadeIn_0.3s_ease-out]">
              <strong>Dev Note:</strong> {devNote}
            </div>
          )}

          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
            {project.tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs border-primary/30 hover:border-primary hover:bg-primary/10 transition-colors duration-200"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            {project.links.demo && (
              <Button variant="default" size="sm" asChild className="group/btn">
                <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4 group-hover/btn:rotate-45 transition-transform duration-200" />
                  Live Demo
                </a>
              </Button>
            )}
            {project.links.github && (
              <Button variant="outline" size="sm" asChild className="group/btn">
                <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform duration-200" />
                  Code
                </a>
              </Button>
            )}
            {project.links.devpost && (
              <Button variant="outline" size="sm" asChild>
                <a href={project.links.devpost} target="_blank" rel="noopener noreferrer">
                  Devpost
                </a>
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
});

ProjectCard.displayName = 'ProjectCard';
