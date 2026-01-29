import { lazy, Suspense, memo, useState, useCallback } from "react";
import { Hero } from "@/components/Hero";
import { LazySection } from "@/components/LazySection";
import { Navigation } from "@/components/Navigation";
import { BackToTop } from "@/components/BackToTop";
import { TerminalBoot } from "@/components/TerminalBoot";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Lazy load below-the-fold components
const Projects = lazy(() => import("@/components/Projects").then(m => ({ default: m.Projects })));
const Skills = lazy(() => import("@/components/Skills").then(m => ({ default: m.Skills })));
const SkillConstellation = lazy(() => import("@/components/SkillConstellation").then(m => ({ default: m.SkillConstellation })));
const Experience = lazy(() => import("@/components/Experience").then(m => ({ default: m.Experience })));
const GitHubStats = lazy(() => import("@/components/GitHubStats").then(m => ({ default: m.GitHubStats })));
const GitHubActivity = lazy(() => import("@/components/GitHubActivity").then(m => ({ default: m.GitHubActivity })));
const TuringGame = lazy(() => import("@/components/TuringGame").then(m => ({ default: m.TuringGame })));
const Contact = lazy(() => import("@/components/Contact").then(m => ({ default: m.Contact })));
const EasterEggHint = lazy(() => import("@/components/EasterEggHint").then(m => ({ default: m.EasterEggHint })));

const Index = memo(() => {
  const prefersReducedMotion = useReducedMotion();
  const [isBootComplete, setIsBootComplete] = useState(prefersReducedMotion);
  
  // Enable keyboard navigation
  useKeyboardNavigation();

  const handleBootComplete = useCallback(() => {
    setIsBootComplete(true);
  }, []);

  // Show boot animation first (unless reduced motion)
  if (!isBootComplete) {
    return <TerminalBoot onComplete={handleBootComplete} />;
  }

  return (
    <div className="min-h-screen">
      {/* Skip to content for accessibility */}
      <a href="#projects" className="skip-to-content">
        Skip to main content
      </a>
      
      {/* Navigation */}
      <Navigation />
      
      {/* Hero loads immediately - critical above-fold content */}
      <Hero />
      
      {/* Below-fold sections are lazy loaded */}
      <LazySection>
        <Projects />
      </LazySection>
      
      <LazySection>
        <Skills />
      </LazySection>
      
      <LazySection>
        <Experience />
      </LazySection>

      <LazySection>
        <GitHubStats />
      </LazySection>

      {/* GitHub Activity + Skill Network Section */}
      <LazySection>
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-10 opacity-0 animate-[fadeSlideUp_0.5s_ease-out_forwards]">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 font-mono">
                <span className="text-muted-foreground opacity-60">// </span>
                Live <span className="text-gradient">Activity</span>
              </h2>
              <p className="text-sm text-muted-foreground font-mono opacity-80">
                Real-time GitHub contributions
              </p>
            </div>
            <GitHubActivity />
          </div>
        </section>
      </LazySection>

      {/* Skill Network Visualization */}
      <LazySection>
        <SkillConstellation />
      </LazySection>
      
      <LazySection>
        <TuringGame />
      </LazySection>
      
      <LazySection>
        <Contact />
      </LazySection>
      
      <Suspense fallback={null}>
        <EasterEggHint />
      </Suspense>
      
      {/* Back to top button */}
      <BackToTop />
      
      {/* Footer with easter egg teaser */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Gabriel Suarez. Built with React, TypeScript, and Tailwind CSS.</p>
          <p className="mt-1 text-xs opacity-60">Use ↑↓ or j/k keys to navigate sections</p>
          <p className="mt-3 text-xs font-mono text-accent/40 hover:text-accent/70 transition-colors cursor-default">
            // secrets.hidden = true; // explore to discover
          </p>
        </div>
      </footer>
    </div>
  );
});

Index.displayName = 'Index';

export default Index;
