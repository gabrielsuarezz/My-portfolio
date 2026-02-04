import { useEffect, useCallback } from "react";
import { toast } from "sonner";

const SECTIONS = ['hero', 'projects', 'skills', 'experience', 'github-stats', 'turing-game', 'contact'];

export const useKeyboardNavigation = () => {
  const getCurrentSectionIndex = useCallback(() => {
    const scrollPosition = window.scrollY + window.innerHeight / 3;
    
    for (let i = SECTIONS.length - 1; i >= 0; i--) {
      const sectionId = SECTIONS[i] === 'hero' ? null : SECTIONS[i];
      const element = sectionId 
        ? document.getElementById(sectionId)
        : document.querySelector('section');
      
      if (element && element.offsetTop <= scrollPosition) {
        return i;
      }
    }
    return 0;
  }, []);

  const scrollToSection = useCallback((index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, SECTIONS.length - 1));
    const sectionId = SECTIONS[clampedIndex];
    
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  useEffect(() => {
    let hasShownHint = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const currentIndex = getCurrentSectionIndex();

      switch (e.key) {
        case 'ArrowDown':
        case 'j': // Vim-style
          e.preventDefault();
          if (currentIndex < SECTIONS.length - 1) {
            scrollToSection(currentIndex + 1);
            if (!hasShownHint) {
              toast.info('⌨️ Keyboard Navigation Active', {
                description: 'Use ↑↓ or j/k to navigate sections',
                duration: 2000,
              });
              hasShownHint = true;
            }
          }
          break;

        case 'ArrowUp':
        case 'k': // Vim-style
          e.preventDefault();
          if (currentIndex > 0) {
            scrollToSection(currentIndex - 1);
            if (!hasShownHint) {
              toast.info('⌨️ Keyboard Navigation Active', {
                description: 'Use ↑↓ or j/k to navigate sections',
                duration: 2000,
              });
              hasShownHint = true;
            }
          }
          break;

        case 'Home':
          e.preventDefault();
          scrollToSection(0);
          break;

        case 'End':
          e.preventDefault();
          scrollToSection(SECTIONS.length - 1);
          break;

        case 'g':
          // gg to go to top (Vim-style)
          if (e.repeat) {
            e.preventDefault();
            scrollToSection(0);
          }
          break;

        case 'G':
          // G to go to bottom (Vim-style)
          e.preventDefault();
          scrollToSection(SECTIONS.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [getCurrentSectionIndex, scrollToSection]);
};
