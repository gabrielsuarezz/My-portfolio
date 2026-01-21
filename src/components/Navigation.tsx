import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const navItems = [
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "AI Game", href: "#turing-game" },
  { label: "Contact", href: "#contact" },
];

export const Navigation = memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-lg"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Terminal-style Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" })}
              className="group flex items-center gap-0.5 font-mono text-lg hover:scale-105 transition-all duration-300"
            >
              <span className="text-muted-foreground opacity-70 group-hover:opacity-100 transition-opacity">[</span>
              <span className="text-primary font-bold tracking-tight drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)] group-hover:drop-shadow-[0_0_12px_hsl(var(--primary)/0.8)] transition-all">
                GS
              </span>
              <span className="text-muted-foreground opacity-70 group-hover:opacity-100 transition-opacity">]</span>
              <span className="w-2 h-4 bg-primary/80 ml-0.5 animate-pulse" />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/50"
                >
                  {item.label}
                </button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="ml-2"
              >
                <FileText className="h-4 w-4 mr-2" />
                Resume
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-lg md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-6">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="text-2xl font-medium text-foreground hover:text-primary transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.label}
                </motion.button>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.1 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    handlePrint();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Download Resume
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

Navigation.displayName = "Navigation";
