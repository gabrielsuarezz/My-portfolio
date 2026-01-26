import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink, 
  Github, 
  Mic, 
  Sun, 
  Camera, 
  Hand, 
  Heart, 
  Code2,
  Bug,
  Eye
} from "lucide-react";
import { useLongPress } from "@/hooks/useLongPress";
import { memo, useMemo } from "react";

// Project-specific icon configurations
const PROJECT_ICONS: Record<string, { icon: typeof Mic; color: string; glow: string }> = {
  "Voxtant": { icon: Mic, color: "text-cyan-400", glow: "cyan" },
  "HeliosAI": { icon: Sun, color: "text-yellow-400", glow: "yellow" },
  "ViewGuard": { icon: Camera, color: "text-red-400", glow: "red" },
  "Shadow Vision": { icon: Hand, color: "text-purple-400", glow: "purple" },
  "Butterfly Detector": { icon: Bug, color: "text-green-400", glow: "green" },
  "FrontalFriend": { icon: Heart, color: "text-pink-400", glow: "pink" },
  "SHE<Codes/>": { icon: Code2, color: "text-orange-400", glow: "orange" },
};

const DEFAULT_ICON = { icon: Eye, color: "text-primary", glow: "cyan" };

const stripEmoji = (text: string): string => {
  return text.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
};

// Check if project is a winner (1st place or hackathon winner)
const isWinningProject = (award?: string): boolean => {
  if (!award) return false;
  const lowerAward = award.toLowerCase();
  return lowerAward.includes("1st place") || 
         lowerAward.includes("winner") || 
         lowerAward.includes("knight hacks") ||
         lowerAward.includes("mlh");
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

// Terminal-styled project icon component
const ProjectIcon = memo(({ title }: { title: string }) => {
  const config = PROJECT_ICONS[title] || DEFAULT_ICON;
  const Icon = config.icon;
  
  return (
    <div className="relative group/icon">
      {/* Glow effect */}
      <div 
        className="absolute inset-0 blur-md opacity-50 transition-opacity duration-300 group-hover/icon:opacity-80"
        style={{ 
          background: `radial-gradient(circle, var(--tw-shadow-color) 0%, transparent 70%)`,
          ['--tw-shadow-color' as string]: `hsl(var(--primary) / 0.5)`,
        }}
      />
      {/* Icon with terminal bracket wrapper */}
      <div className="relative flex items-center gap-0.5 font-mono text-sm bg-secondary/50 border border-border/50 rounded px-2 py-1.5">
        <span className="text-muted-foreground/60">[</span>
        <Icon 
          className={`h-5 w-5 ${config.color} transition-all duration-300`} 
          style={{ filter: `drop-shadow(0 0 6px currentColor)` }}
        />
        <span className="text-muted-foreground/60">]</span>
      </div>
    </div>
  );
});

ProjectIcon.displayName = 'ProjectIcon';

// Lightweight CSS confetti for winners
const WinnerConfetti = memo(() => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* Animated confetti particles using CSS */}
    <style>{`
      @keyframes confetti-fall-1 {
        0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100%) rotate(720deg); opacity: 0; }
      }
      @keyframes confetti-fall-2 {
        0% { transform: translateY(-10px) rotate(45deg); opacity: 1; }
        100% { transform: translateY(100%) rotate(405deg); opacity: 0; }
      }
      @keyframes confetti-fall-3 {
        0% { transform: translateY(-10px) rotate(-45deg); opacity: 1; }
        100% { transform: translateY(100%) rotate(315deg); opacity: 0; }
      }
    `}</style>
    {/* Confetti pieces */}
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2"
        style={{
          left: `${10 + i * 12}%`,
          top: '-10px',
          background: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#fd79a8'][i],
          animation: `confetti-fall-${(i % 3) + 1} ${3 + (i * 0.5)}s ease-in-out infinite`,
          animationDelay: `${i * 0.3}s`,
          borderRadius: i % 2 === 0 ? '50%' : '2px',
          transform: 'translateZ(0)',
        }}
      />
    ))}
  </div>
));

WinnerConfetti.displayName = 'WinnerConfetti';

// Winner badge with glow
const WinnerBadge = memo(({ award }: { award: string }) => (
  <Badge 
    variant="secondary" 
    className="relative bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-yellow-500/20 border border-yellow-500/50 text-yellow-300 font-mono text-xs px-3 py-1 overflow-hidden"
  >
    {/* Shimmer effect */}
    <div 
      className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent"
      style={{
        animation: 'shimmer 2s ease-in-out infinite',
      }}
    />
    <style>{`
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `}</style>
    <span className="relative z-10">
      <span className="mr-1">🏆</span>
      {stripEmoji(award)}
    </span>
  </Badge>
));

WinnerBadge.displayName = 'WinnerBadge';

// Regular award badge
const AwardBadge = memo(({ award }: { award: string }) => (
  <Badge 
    variant="secondary" 
    className="bg-transparent border border-accent/40 text-accent font-mono text-xs px-2 py-1"
    style={{ textShadow: '0 0 10px hsl(var(--accent) / 0.5)' }}
  >
    <span className="opacity-60 mr-1">&gt;</span>
    {stripEmoji(award)}
  </Badge>
));

AwardBadge.displayName = 'AwardBadge';

export const ProjectCard = memo(({ project, index, isRevealed, onLongPress }: ProjectCardProps) => {
  const longPressHandlers = useLongPress(() => onLongPress(project.title));
  
  const devNote = useMemo(() => 
    DEV_NOTES[project.title] || DEFAULT_DEV_NOTE,
    [project.title]
  );

  const isWinner = useMemo(() => isWinningProject(project.award), [project.award]);

  return (
    <div
      className="opacity-0 animate-[fadeSlideUp_0.6s_ease-out_forwards]"
      style={{ 
        animationDelay: `${index * 0.1}s`,
        transform: 'translateZ(0)',
      }}
      {...longPressHandlers}
    >
      <Card className={`p-4 sm:p-6 md:p-8 h-full border-border/50 backdrop-blur-sm bg-card/30 relative overflow-hidden group select-none transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-15px_hsl(var(--primary)/0.3)] ${
        isWinner ? 'border-yellow-500/30 hover:border-yellow-500/50' : ''
      }`}>
        {/* Winner confetti overlay */}
        {isWinner && <WinnerConfetti />}

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
            background: isWinner 
              ? 'radial-gradient(circle at center, hsl(45 100% 50% / 0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle at center, hsl(217 91% 60% / 0.08) 0%, transparent 70%)',
          }}
        />

        {/* Winner glow bar at top */}
        {isWinner && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500/50 via-amber-400/80 to-yellow-500/50" />
        )}

        {/* Terminal header bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isWinner ? 'hidden' : ''}`} />
        
        <div className="relative z-10">
          {/* Header with title and icon */}
          <div className="flex items-start justify-between mb-3 gap-3">
            <div className="flex-1 min-w-0">
              {/* Terminal-style title prefix */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-primary/60 font-mono text-xs">$</span>
                <span className="text-muted-foreground/60 font-mono text-xs">./</span>
              </div>
              <h3 className={`text-xl sm:text-2xl font-bold font-mono transition-colors duration-200 truncate ${
                isWinner ? 'group-hover:text-yellow-400' : 'group-hover:text-primary'
              }`}>
                {project.title}
              </h3>
            </div>
            <ProjectIcon title={project.title} />
          </div>

          {/* Award badge */}
          {project.award && (
            <div className="mb-4">
              {isWinner ? (
                <WinnerBadge award={project.award} />
              ) : (
                <AwardBadge award={project.award} />
              )}
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
