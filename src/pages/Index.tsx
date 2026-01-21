import { lazy, Suspense, memo } from "react";
import { Hero } from "@/components/Hero";
import { LazySection } from "@/components/LazySection";
import { Navigation } from "@/components/Navigation";
import { BackToTop } from "@/components/BackToTop";

// Lazy load below-the-fold components
const Projects = lazy(() => import("@/components/Projects").then(m => ({ default: m.Projects })));
const Skills = lazy(() => import("@/components/Skills").then(m => ({ default: m.Skills })));
const Experience = lazy(() => import("@/components/Experience").then(m => ({ default: m.Experience })));
const TuringGame = lazy(() => import("@/components/TuringGame").then(m => ({ default: m.TuringGame })));
const Contact = lazy(() => import("@/components/Contact").then(m => ({ default: m.Contact })));
const EasterEggHint = lazy(() => import("@/components/EasterEggHint").then(m => ({ default: m.EasterEggHint })));

const Index = memo(() => {
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
      
      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2025 Gabriel Suarez. Built with React, TypeScript, and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
});

Index.displayName = 'Index';

export default Index;
