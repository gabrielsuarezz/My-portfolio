import { useState, useEffect, useCallback, memo } from 'react';
import { useKonamiCode } from '@/hooks/useKonamiCode';
import { useKeyboardSequence } from '@/hooks/useKeyboardSequence';
import { MatrixRain } from './MatrixRain';
import { CommandPalette } from './CommandPalette';
import { toast } from 'sonner';

export const EasterEggs = memo(() => {
  const [showMatrix, setShowMatrix] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  // Konami Code
  useKonamiCode(() => {
    setShowMatrix(true);
    toast.success('🎮 Konami Code Activated!');
  });

  // Type "resume" to download
  useKeyboardSequence('resume', () => {
    toast.info('📄 Resume download would trigger here!');
    console.log('Resume download triggered!');
  });

  // Command Palette (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      } else if (e.key === 'Escape') {
        setShowCommandPalette(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Time-based messages - only run once
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 23 || hour < 5) {
      const timer = setTimeout(() => {
        toast('🌙 Still browsing at this hour?', {
          description: 'Me too. Let\'s grab coffee and talk code! ☕',
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Console messages - only run once
  useEffect(() => {
    const styles = {
      title: 'font-size: 24px; font-weight: bold; color: #10b981;',
      message: 'font-size: 14px; color: #6b7280;',
      highlight: 'font-size: 14px; font-weight: bold; color: #3b82f6;',
    };

    console.log('%c👋 Hey there, fellow developer!', styles.title);
    console.log('%cThanks for checking out my code!', styles.message);
    console.log('%c\nI see you\'re curious about how things work.', styles.message);
    console.log('%cThat\'s exactly the kind of person I want to work with! 🚀', styles.highlight);
    console.log('%c\nLet\'s connect: gabrielsc0513@gmail.com', styles.highlight);
    
    console.log('%c\n🎨 ASCII Art:', 'font-size: 16px; font-weight: bold;');
    console.log(`
    ╔═══════════════════════════════════════╗
    ║                                       ║
    ║        GABRIEL'S PORTFOLIO            ║
    ║        Built with ❤️ and ☕           ║
    ║                                       ║
    ║   "Code is poetry written in logic"  ║
    ║                                       ║
    ╚═══════════════════════════════════════╝
    `);

    console.log('%c\n🔍 Easter Eggs Available:', 'font-size: 16px; font-weight: bold; color: #f59e0b;');
    console.log('%c• Type "resume" anywhere to download my CV', styles.message);
    console.log('%c• Press Cmd/Ctrl + K for command palette', styles.message);
    console.log('%c• Try the Konami Code (↑↑↓↓←→←→BA)', styles.message);
    console.log('%c• Triple-click my name in the hero', styles.message);
    console.log('%c• Click my photo 7 times', styles.message);
    console.log('%c\nHappy hunting! 🎮', styles.highlight);
  }, []);

  const handleMatrixComplete = useCallback(() => setShowMatrix(false), []);
  const handlePaletteClose = useCallback(() => setShowCommandPalette(false), []);

  return (
    <>
      {showMatrix && (
        <MatrixRain onComplete={handleMatrixComplete} duration={5000} />
      )}
      <CommandPalette isOpen={showCommandPalette} onClose={handlePaletteClose} />
      {/* Hidden message for inspectors */}
      <div style={{ display: 'none' }} data-secret="true">
        🎉 Congratulations! You found the hidden div!
        If you're reading this, you're exactly the kind of detail-oriented
        person I'd love to work with. Reach out and mention "hidden-div" in
        your message for bonus points! 🚀
      </div>
    </>
  );
});

EasterEggs.displayName = 'EasterEggs';
