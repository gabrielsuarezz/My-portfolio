import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail, Terminal, Code2 } from "lucide-react";
import { useEffect, useState, memo, useMemo } from "react";
import { AsciiArt } from "./AsciiArt";
import headshot from "@/assets/headshot.jpg";
import { useClickCounter } from "@/hooks/useClickCounter";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useDebouncedMousePosition } from "@/hooks/useDebouncedMousePosition";
import { toast } from "sonner";

const TypewriterText = memo(({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Skip animation if reduced motion preferred
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

// Memoized floating orb to prevent unnecessary re-renders
const FloatingOrb = memo(({ 
  position, 
  color, 
  scrollY, 
  scrollOffset,
  animationConfig,
  prefersReducedMotion 
}: {
  position: 'left' | 'right';
  color: string;
  scrollY: any;
  scrollOffset: { x: number; y: number };
  animationConfig: { duration: number; x: number[]; y: number[]; scale: number[] };
  prefersReducedMotion: boolean;
}) => {
  const x = useTransform(scrollY, [0, 1000], [0, scrollOffset.x]);
  const y = useTransform(scrollY, [0, 1000], [0, scrollOffset.y]);

  return (
    <motion.div
      className={`absolute w-96 h-96 rounded-full blur-3xl opacity-20 ${position === 'right' ? 'right-0' : ''}`}
      style={{
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        x,
        y,
        willChange: prefersReducedMotion ? 'auto' : 'transform',
      }}
      animate={prefersReducedMotion ? {} : {
        x: animationConfig.x,
        y: animationConfig.y,
        scale: animationConfig.scale,
      }}
      transition={{
        duration: animationConfig.duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
});

FloatingOrb.displayName = 'FloatingOrb';

// Memoized code snippets - only show on desktop
const FloatingCodeSnippets = memo(({ prefersReducedMotion }: { prefersReducedMotion: boolean }) => {
  const codeSnippets = useMemo(() => [
    "const buildAI = () => intelligence;",
    "while(learning) { innovate(); }",
    "if (problem) solve();",
    "return impact++;",
  ], []);

  // Don't render on reduced motion or mobile
  if (prefersReducedMotion) return null;

  return (
    <>
      {codeSnippets.map((snippet, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/20 font-mono text-sm hidden lg:block"
          initial={{ opacity: 0, y: 100 }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            y: [100, -100],
            x: [0, (i % 2 === 0 ? 50 : -50)],
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            delay: i * 2,
          }}
          style={{
            left: `${20 + i * 20}%`,
            top: `${30 + i * 10}%`,
            willChange: 'transform, opacity',
          }}
        >
          <Code2 className="inline mr-2 h-4 w-4" />
          {snippet}
        </motion.div>
      ))}
    </>
  );
});

FloatingCodeSnippets.displayName = 'FloatingCodeSnippets';

export const Hero = memo(() => {
  const [funMode, setFunMode] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 0.8]);
  const prefersReducedMotion = useReducedMotion();
  
  // Debounced mouse position - disabled on mobile/reduced motion
  const mousePosition = useDebouncedMousePosition(!prefersReducedMotion);

  // Headshot click counter (7 clicks)
  const { handleClick: handleHeadshotClick } = useClickCounter(7, () => {
    setFunMode((prev) => !prev);
    toast.success(funMode ? '✨ Fun Mode Deactivated' : '🎉 Fun Mode Activated!', {
      description: funMode ? 'Back to normal!' : 'Watch the magic happen! ✨',
    });
  });

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  // Triple-click name handler
  const handleNameClick = (e: React.MouseEvent) => {
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
  };

  // Animation variants for reduced motion
  const fadeInVariants = prefersReducedMotion 
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0" style={{ background: 'var(--gradient-mesh)' }} />
      
      {/* Floating orbs with parallax - GPU accelerated */}
      <FloatingOrb
        position="left"
        color="hsl(217 91% 60%)"
        scrollY={scrollY}
        scrollOffset={{ x: -100, y: 100 }}
        animationConfig={{ duration: 20, x: [0, 100, 0], y: [0, -100, 0], scale: [1, 1.2, 1] }}
        prefersReducedMotion={prefersReducedMotion}
      />
      <FloatingOrb
        position="right"
        color="hsl(187 85% 53%)"
        scrollY={scrollY}
        scrollOffset={{ x: 100, y: -100 }}
        animationConfig={{ duration: 15, x: [0, -100, 0], y: [0, 100, 0], scale: [1.2, 1, 1.2] }}
        prefersReducedMotion={prefersReducedMotion}
      />

      {/* Interactive cursor glow - only on desktop with full motion */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute w-64 h-64 rounded-full pointer-events-none hidden md:block"
          style={{
            background: 'radial-gradient(circle, hsl(217 91% 60% / 0.15) 0%, transparent 70%)',
            left: mousePosition.x - 128,
            top: mousePosition.y - 128,
            willChange: 'left, top',
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Floating code snippets - desktop only */}
      <FloatingCodeSnippets prefersReducedMotion={prefersReducedMotion} />

      <motion.div 
        className="container mx-auto px-6 relative z-10"
        style={{ opacity, scale }}
      >
        <div className="text-center max-w-5xl mx-auto">
          {/* Animated terminal-style header */}
          <motion.div
            {...fadeInVariants}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-4 flex flex-col items-center justify-center gap-2"
          >
            <div className="flex items-center gap-2 text-accent font-mono text-sm">
              <Terminal className="h-4 w-4 animate-pulse" />
              <TypewriterText text="gabriel@portfolio:~$ ./introduce.sh" delay={200} />
            </div>
            
            {/* ASCII Art Terminal Visual */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative p-3 md:p-4 rounded-lg bg-secondary/30 backdrop-blur-sm border border-primary/20 shadow-lg max-w-2xl md:max-w-3xl w-full"
              style={{ boxShadow: 'var(--shadow-glow)' }}
            >
              <div className="absolute top-2 left-2 md:top-3 md:left-3 flex gap-1.5 md:gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500/60" />
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-500/60" />
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500/60" />
              </div>
              
              <div 
                className="mt-4 md:mt-6 overflow-hidden flex justify-center cursor-pointer"
                onClick={handleHeadshotClick}
              >
                <motion.div
                  animate={funMode && !prefersReducedMotion ? {
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: funMode ? Infinity : 0,
                  }}
                >
                  <AsciiArt imageSrc={headshot} width={80} fontSize={6} />
                </motion.div>
              </div>
              
              <motion.div
                className="mt-2 text-xs md:text-sm font-mono text-accent/70 text-center"
                animate={prefersReducedMotion ? {} : { opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                &gt; Hover to enhance resolution_
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Main title with staggered animation */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6 leading-tight"
            {...fadeInVariants}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.span
              className="inline-block cursor-pointer select-none"
              whileHover={prefersReducedMotion ? {} : { scale: 1.05, color: "hsl(217 91% 60%)" }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={handleNameClick}
            >
              Gabriel
            </motion.span>
            <br />
            <motion.span
              className="text-gradient inline-block"
              initial={{ backgroundPosition: "0% 50%" }}
              animate={prefersReducedMotion ? {} : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Suarez
            </motion.span>
          </motion.h1>

          {/* Subtitle with typewriter effect */}
          <motion.div
            {...fadeInVariants}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-4 md:mb-6"
          >
            <p className="text-lg sm:text-xl md:text-3xl text-muted-foreground font-light mb-1 md:mb-2">
              Full Stack Software Engineer
            </p>
            <div className="flex items-center justify-center gap-2 text-accent">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <p className="text-sm sm:text-base md:text-lg lg:text-xl">
                CS @ FIU • AI & Software Engineer • 3x Hackathon Winner
              </p>
            </div>
          </motion.div>

          <motion.p
            {...fadeInVariants}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-base md:text-lg lg:text-xl text-muted-foreground/80 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Exploring the edge between AI, creativity, and code.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            {...fadeInVariants}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-wrap gap-3 md:gap-4 justify-center mb-8 md:mb-12"
          >
            <Button
              size="lg"
              onClick={scrollToProjects}
              className="group relative overflow-hidden text-lg px-8 py-6"
            >
              <span className="relative z-10 flex items-center">
                Explore My Work
                <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
              </span>
              {!prefersReducedMotion && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary to-accent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Button>
            <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6 border-2">
              <a href="mailto:gsuarez@fiu.edu">
                <Mail className="mr-2 h-5 w-5" />
                Get In Touch
              </a>
            </Button>
          </motion.div>

          {/* Social Links */}
          <motion.div
            {...fadeInVariants}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="flex gap-6 justify-center"
          >
            {[
              { icon: Github, href: "https://github.com/gabrielsuarezz", label: "GitHub" },
              { icon: Linkedin, href: "https://linkedin.com/in/gabrielsuarezz", label: "LinkedIn" },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={prefersReducedMotion ? {} : { scale: 1.2, rotate: 5 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
                className="p-4 rounded-full bg-secondary/50 backdrop-blur-sm border border-border hover:border-primary transition-colors"
              >
                <Icon className="h-6 w-6" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Animated scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: [0, 10, 0] }}
        transition={{ 
          opacity: { delay: 2 },
          y: { duration: 2, repeat: Infinity }
        }}
      >
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Scroll</span>
        <ArrowDown className="h-5 w-5 text-accent" />
      </motion.div>
    </section>
  );
});

Hero.displayName = 'Hero';
