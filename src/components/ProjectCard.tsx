import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { useLongPress } from "@/hooks/useLongPress";
import { memo, useMemo } from "react";

// Terminal-style ASCII icons for different award types
const TERMINAL_ICONS: Record<string, { symbol: string; color: string }> = {
  "1st": { symbol: ">>", color: "text-yellow-400" },
  "winner": { symbol: "★", color: "text-yellow-400" },
  "security": { symbol: "◈", color: "text-red-400" },
  "creative": { symbol: "◎", color: "text-purple-400" },
  "hardware": { symbol: "⚙", color: "text-orange-400" },
  "build": { symbol: "λ", color: "text-cyan-400" },
  "mobile": { symbol: "▣", color: "text-green-400" },
  "design": { symbol: "◇", color: "text-pink-400" },
  "default": { symbol: "►", color: "text-primary" },
};

const getTerminalIcon = (award: string): { symbol: string; color: string } => {
  const lowerAward = award.toLowerCase();
  if (lowerAward.includes("1st place")) return TERMINAL_ICONS["1st"];
  if (lowerAward.includes("winner") || lowerAward.includes("knight") || lowerAward.includes("mlh")) return TERMINAL_ICONS["winner"];
  if (lowerAward.includes("sharkbyte") || lowerAward.includes("security")) return TERMINAL_ICONS["security"];
  if (lowerAward.includes("creative")) return TERMINAL_ICONS["creative"];
  if (lowerAward.includes("arm") || lowerAward.includes("hardware")) return TERMINAL_ICONS["hardware"];
  if (lowerAward.includes("init") || lowerAward.includes("build")) return TERMINAL_ICONS["build"];
  if (lowerAward.includes("mobile")) return TERMINAL_ICONS["mobile"];
  if (lowerAward.includes("design") || lowerAward.includes("showcase")) return TERMINAL_ICONS["design"];
  return TERMINAL_ICONS["default"];
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

// Dev notes map
const DEV_NOTES: Record<string, string> = {
  "Voxtant": "Built the entire backend in 8 hours with zero sleep. The LLM integration was a nightmare but so worth it.",
  "Shadow Vision": "Creating the dataset was tedious - I spent 6 hours making hand gestures in front of a camera. My hand was sore for days!",
  "HeliosAI": "The servo motor kept breaking. We went through 3 different motors before finding one that could handle the solar panel weight.",
  "FrontalFriend": "First mobile app! Learned React Native and Expo from scratch. The media playback cleanup patterns were tricky to get right.",
  "SHE<Codes/>": "Senior design capstone - teaching Python through history. Blockly + Skulpt integration was surprisingly smooth once I figured out the bridge.",
};

const DEFAULT_DEV_NOTE = "Leading a team remotely while building ML models was challenging but incredibly rewarding. We had late-night debugging sessions that turned into great learning moments.";

// Terminal-styled icon component
const TerminalAwardIcon = memo(({ award }: { award: string }) => {
  const { symbol, color } = getTerminalIcon(award);
  
  return (
    <div className="relative">
      {/* Bracket wrapper */}
      <div className="flex items-center gap-0.5 font-mono text-sm">
        <span className="text-muted-foreground/60">[</span>
        <span className={`${color} font-bold text-base leading-none`} style={{ textShadow: `0 0 8px currentColor` }}>
          {symbol}
        </span>
        <span className="text-muted-foreground/60">]</span>
      </div>
    </div>
  );
});

TerminalAwardIcon.displayName = 'TerminalAwardIcon';

export const ProjectCard = memo(({ project, index, isRevealed, onLongPress }: ProjectCardProps) => {
  const longPressHandlers = useLongPress(() => onLongPress(project.title));
  
  const devNote = useMemo(() => 
    DEV_NOTES[project.title] || DEFAULT_DEV_NOTE,
    [project.title]
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
        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-300"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--primary) / 0.03) 2px, hsl(var(--primary) / 0.03) 4px)',
          }}
        />
        
        {/* Background gradient on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle at center, hsl(217 91% 60% / 0.08) 0%, transparent 70%)',
          }}
        />

        {/* Terminal header bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10">
          {/* Header with title and icon */}
          <div className="flex items-start justify-between mb-3 gap-3">
            <div className="flex-1 min-w-0">
              {/* Terminal-style title prefix */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-primary/60 font-mono text-xs">$</span>
                <span className="text-muted-foreground/60 font-mono text-xs">./</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-mono group-hover:text-primary transition-colors duration-200 truncate">
                {project.title}
              </h3>
            </div>
            {project.award && <TerminalAwardIcon award={project.award} />}
          </div>

          {/* Award badge with terminal styling */}
          {project.award && (
            <div className="mb-4">
              <Badge 
                variant="secondary" 
                className="bg-transparent border border-accent/40 text-accent font-mono text-xs px-2 py-1"
                style={{ textShadow: '0 0 10px hsl(var(--accent) / 0.5)' }}
              >
                <span className="opacity-60 mr-1">&gt;</span>
                {stripEmoji(project.award)}
              </Badge>
            </div>
          )}

          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
            {project.description}
          </p>

          {isRevealed && (
            <div className="mb-4 p-3 bg-accent/10 border border-accent/30 rounded font-mono text-sm text-accent animate-[fadeIn_0.3s_ease-out]">
              <span className="opacity-60">// </span>
              <strong>dev_note:</strong> {devNote}
            </div>
          )}

          {/* Tech stack with terminal styling */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
            {project.tags.map((tag, i) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs border-primary/30 hover:border-primary hover:bg-primary/10 transition-colors duration-200 font-mono"
              >
                <span className="text-primary/40 mr-1">{i === 0 ? '{' : ','}</span>
                {tag}
                {i === project.tags.length - 1 && <span className="text-primary/40 ml-1">{'}'}</span>}
              </Badge>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {project.links.demo && (
              <Button variant="default" size="sm" asChild className="group/btn font-mono">
                <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4 group-hover/btn:rotate-45 transition-transform duration-200" />
                  <span className="opacity-60 mr-1">&gt;</span>run
                </a>
              </Button>
            )}
            {project.links.github && (
              <Button variant="outline" size="sm" asChild className="group/btn font-mono">
                <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform duration-200" />
                  <span className="opacity-60 mr-1">$</span>git
                </a>
              </Button>
            )}
            {project.links.devpost && (
              <Button variant="outline" size="sm" asChild className="font-mono">
                <a href={project.links.devpost} target="_blank" rel="noopener noreferrer">
                  <span className="opacity-60 mr-1">::</span>devpost
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
