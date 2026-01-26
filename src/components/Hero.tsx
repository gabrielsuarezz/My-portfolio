import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail, Terminal } from "lucide-react";
import { useEffect, useState, memo, useCallback } from "react";
import { AsciiArt } from "./AsciiArt";
import { InteractiveTerminal } from "./InteractiveTerminal";
import { MagneticButton } from "./MagneticButton";
import headshot from "@/assets/headshot.jpg";
import { useClickCounter } from "@/hooks/useClickCounter";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { toast } from "sonner";

const TypewriterText = memo(({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayedText(text);
      return;
    }

    const timeout = setTimeout(() => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [prefersReducedMotion]);

  return (
    <span>
      {displayedText}
      <span className={showCursor ? "opacity-100" : "opacity-0"}>_</span>
    </span>
  );
});

TypewriterText.displayName = 'TypewriterText';

// CSS-only floating orbs
const FloatingOrb = memo(({ position, color }: { position: 'left' | 'right'; color: string }) => (
  <div
    className={`absolute w-96 h-96 rounded-full blur-3xl ${position === 'right' ? 'right-0' : ''}`}
    style={{ 
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      animation: 'gentlePulse 8s ease-in-out infinite',
      transform: 'translateZ(0)',
    }}
  />
));

FloatingOrb.displayName = 'FloatingOrb';

// CSS-only floating code snippets
const FloatingCodeSnippets = memo(() => {
  const codeSnippets = [
    "const buildAI = () => intelligence;",
    "while(learning) { innovate(); }",
  ];

  return (
    <>
      {codeSnippets.map((snippet, i) => (
        <div
          key={i}
          className="absolute text-primary/30 font-mono text-sm hidden lg:block"
          style={{
            left: `${15 + i * 35}%`,
            top: `${30 + i * 20}%`,
            animation: `floatCode ${10 + i * 3}s ease-in-out infinite`,
            animationDelay: `${i * 2}s`,
            transform: 'translateZ(0)',
            textShadow: '0 0 20px hsl(var(--primary) / 0.3)',
          }}
        >
          {snippet}
        </div>
      ))}
    </>
  );
});

FloatingCodeSnippets.displayName = 'FloatingCodeSnippets';

export const Hero = memo(() => {
  const [funMode, setFunMode] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const { handleClick: handleHeadshotClick } = useClickCounter(7, () => {
    setFunMode((prev) => !prev);
    toast.success(funMode ? '✨ Fun Mode Deactivated' : '🎉 Fun Mode Activated!', {
      description: funMode ? 'Back to normal!' : 'Watch the magic happen! ✨',
    });
  });

  const scrollToProjects = useCallback(() => {
    document.getElementById("projects")?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  }, [prefersReducedMotion]);

  const handleNameClick = useCallback((e: React.MouseEvent) => {
    if (e.detail === 3) {
      const themes = ['matrix', 'retro', 'minimal', 'default'];
      const currentTheme = document.body.dataset.theme || 'default';
      const currentIndex = themes.indexOf(currentTheme);
      const nextTheme = themes[(currentIndex + 1) % themes.length];
      document.body.dataset.theme = nextTheme;
      toast.success(`🎨 Theme switched to: ${nextTheme}`, {
        description: 'Triple-click again to cycle themes!',
      });
    }
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0" style={{ background: 'var(--gradient-mesh)' }} />
      
      {/* CSS-only floating orbs */}
      {!prefersReducedMotion && (
        <>
          <FloatingOrb position="left" color="hsl(217 91% 60% / 0.1)" />
          <FloatingOrb position="right" color="hsl(187 85% 53% / 0.1)" />
          <FloatingCodeSnippets />
        </>
      )}

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Terminal header */}
          <div className="mb-4 flex flex-col items-center justify-center gap-2 opacity-0 animate-[fadeSlideUp_0.8s_ease-out_0.2s_forwards]">
            <div className="flex items-center gap-2 text-accent font-mono text-sm">
              <Terminal className="h-4 w-4 terminal-cursor" />
              <TypewriterText text="gabriel@portfolio:~$ ./introduce.sh" delay={200} />
            </div>
            
            {/* ASCII Art Terminal */}
            <div
              className="relative p-3 md:p-4 rounded-lg bg-secondary/30 backdrop-blur-sm border border-primary/20 shadow-lg max-w-2xl md:max-w-3xl w-full opacity-0 animate-[fadeSlideUp_0.8s_ease-out_0.5s_forwards]"
              style={{ boxShadow: 'var(--shadow-glow)' }}
            >
              <div className="absolute top-2 left-2 md:top-3 md:left-3 flex gap-1.5 md:gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500/60" />
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-500/60" />
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500/60" />
              </div>
              
              <div 
                className={`mt-4 md:mt-6 overflow-hidden flex justify-center cursor-pointer transition-transform duration-500 ${funMode ? 'animate-spin' : ''}`}
                onClick={handleHeadshotClick}
                style={{ transform: 'translateZ(0)' }}
              >
                <AsciiArt imageSrc={headshot} width={120} fontSize={5} />
              </div>
              
              {/* Interactive terminal */}
              <div className="mt-3 border-t border-primary/20 pt-3">
                <InteractiveTerminal />
              </div>
            </div>
          </div>

          {/* Main title */}
          <h1 
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6 leading-tight opacity-0 animate-[fadeSlideUp_0.8s_ease-out_0.4s_forwards]"
          >
            <span
              className="inline-block cursor-pointer select-none transition-all duration-300 hover:scale-105 hover:text-primary"
              onClick={handleNameClick}
            >
              Gabriel
            </span>
            <br />
            <span className="text-gradient inline-block">
              Suarez
            </span>
          </h1>

          {/* Subtitle */}
          <div className="mb-4 md:mb-6 opacity-0 animate-[fadeSlideUp_0.8s_ease-out_0.6s_forwards]">
            <p className="text-lg sm:text-xl md:text-3xl text-muted-foreground font-light mb-1 md:mb-2">
              Full Stack Software Engineer
            </p>
            <div className="flex items-center justify-center gap-2 text-accent">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <p className="text-sm sm:text-base md:text-lg lg:text-xl">
                CS @ FIU • AI & Software Engineer • 3x Hackathon Winner
              </p>
            </div>
          </div>

          <p className="text-base md:text-lg lg:text-xl text-muted-foreground/80 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed opacity-0 animate-[fadeSlideUp_0.8s_ease-out_0.8s_forwards]">
            Exploring the edge between AI, creativity, and code.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 md:gap-4 justify-center mb-8 md:mb-12 opacity-0 animate-[fadeSlideUp_0.8s_ease-out_1s_forwards]">
            <MagneticButton strength={0.25}>
              <Button
                size="lg"
                onClick={scrollToProjects}
                className="group relative overflow-hidden text-lg px-8 py-6"
              >
                <span className="relative z-10 flex items-center">
                  Explore My Work
                  <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform duration-200" />
                </span>
              </Button>
            </MagneticButton>
            <MagneticButton strength={0.25}>
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6 border-2">
                <a href="mailto:gsuarez@fiu.edu">
                  <Mail className="mr-2 h-5 w-5" />
                  Get In Touch
                </a>
              </Button>
            </MagneticButton>
          </div>

          {/* Social Links */}
          <div className="flex gap-6 justify-center opacity-0 animate-[fadeSlideUp_0.8s_ease-out_1.2s_forwards]">
            {[
              { icon: Github, href: "https://github.com/gabrielsuarezz", label: "GitHub" },
              { icon: Linkedin, href: "https://linkedin.com/in/gabrielsuarezz", label: "LinkedIn" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-full bg-secondary/50 backdrop-blur-sm border border-border hover:border-primary hover:scale-110 transition-all duration-200"
                style={{ transform: 'translateZ(0)' }}
              >
                <Icon className="h-6 w-6" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-[fadeSlideUp_0.8s_ease-out_2s_forwards]"
      >
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Scroll</span>
        <ArrowDown className="h-5 w-5 text-accent animate-bounce" />
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';
