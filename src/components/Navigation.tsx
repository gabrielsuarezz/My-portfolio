import { useState, useEffect, memo, useCallback } from "react";
import { Menu, X, FileText, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { ResumePreviewModal } from "@/components/ResumePreviewModal";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const navItems = [
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "GitHub", href: "#github-stats" },
  { label: "AI Game", href: "#turing-game" },
  { label: "Contact", href: "#contact" },
];

export const Navigation = memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = useCallback((href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
    setIsMobileMenuOpen(false);
  }, [prefersReducedMotion]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }, [prefersReducedMotion]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const openResumeModal = useCallback(() => {
    setIsResumeModalOpen(true);
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 opacity-0 animate-[fadeSlideUp_0.5s_ease-out_0.2s_forwards] ${
          isScrolled
            ? "bg-background/95 border-b border-border/50 shadow-lg"
            : "bg-transparent"
        }`}
        style={{ transform: 'translateZ(0)' }}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-0.5 font-mono text-lg hover:scale-105 transition-transform duration-200"
            >
              <span className="text-muted-foreground opacity-70 group-hover:opacity-100 transition-opacity">[</span>
              <span className="text-primary font-bold tracking-tight terminal-glow">
                GS
              </span>
              <span className="text-muted-foreground opacity-70 group-hover:opacity-100 transition-opacity">]</span>
              <span className="terminal-cursor" />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-md hover:bg-secondary/50"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex items-center gap-2 ml-2">
                <ThemeSwitcher />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="hidden xl:flex"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  title="Preview & Download Resume"
                  onClick={openResumeModal}
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  <span>Resume</span>
                </Button>
              </div>
            </div>

            {/* Tablet Navigation - Compact */}
            <div className="hidden md:flex lg:hidden items-center gap-1">
              {navItems.slice(0, 4).map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="px-2 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-md hover:bg-secondary/50"
                >
                  {item.label}
                </button>
              ))}
              <ThemeSwitcher />
              <Button
                variant="default"
                size="sm"
                title="Preview & Download Resume"
                onClick={openResumeModal}
              >
                <FileDown className="h-4 w-4 mr-1" />
                <span className="text-xs">CV</span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/98 md:hidden animate-[fadeIn_0.2s_ease-out]"
        >
          <div className="flex flex-col items-center justify-center h-full gap-6">
            {navItems.map((item, index) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-2xl font-medium text-foreground hover:text-primary transition-colors duration-200 opacity-0 animate-[fadeSlideUp_0.3s_ease-out_forwards]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.label}
              </button>
            ))}
            <div
              className="flex flex-col gap-3 opacity-0 animate-[fadeSlideUp_0.3s_ease-out_forwards]"
              style={{ animationDelay: `${navItems.length * 0.1}s` }}
            >
              <Button
                variant="default"
                size="lg"
                onClick={openResumeModal}
              >
                <FileDown className="h-5 w-5 mr-2" />
                Preview Resume
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  handlePrint();
                  setIsMobileMenuOpen(false);
                }}
              >
                <FileText className="h-5 w-5 mr-2" />
                Print Resume
              </Button>
            </div>
          </div>
        </div>
      )}
      <ResumePreviewModal 
        open={isResumeModalOpen} 
        onOpenChange={setIsResumeModalOpen} 
      />
    </>
  );
});

Navigation.displayName = "Navigation";
