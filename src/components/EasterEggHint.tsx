import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

export const EasterEggHint = () => {
  const [isOpen, setIsOpen] = useState(false);

  const hints = [
    { emoji: '⌨️', text: 'Try pressing Cmd/Ctrl + K' },
    { emoji: '👆', text: 'Triple-click my name' },
    { emoji: '📸', text: 'Click my photo 7 times' },
    { emoji: '🎮', text: 'The Konami Code still works' },
    { emoji: '📄', text: 'Type "resume" anywhere' },
    { emoji: '⏱️', text: 'Hold project cards for 3 seconds' },
    { emoji: '🔍', text: 'Check the browser console' },
  ];

  return (
    <>
      {/* Floating hint button with enhanced pulse */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-accent/10 border border-accent/30 backdrop-blur-sm hover:bg-accent/20 transition-colors group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3 }}
      >
        <div className="relative">
          <Sparkles className="h-5 w-5 text-accent" />
          {/* Multiple pulse rings for attention */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-accent/50"
            animate={{
              scale: [1, 2, 2],
              opacity: [0.6, 0.2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border border-accent/30"
            animate={{
              scale: [1, 2.5, 2.5],
              opacity: [0.4, 0.1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.3,
            }}
          />
        </div>
        {/* Tooltip hint on first load */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 4 }}
          className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-card/90 backdrop-blur-sm border border-border px-3 py-1.5 rounded-lg text-xs font-mono hidden sm:block"
        >
          <span className="text-accent">✨</span> Secrets await...
        </motion.div>
      </motion.button>

      {/* Hints modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md z-50 max-h-[90vh]"
            >
              <div className="bg-background border border-border rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-accent" />
                    <h3 className="text-lg font-semibold">Hidden Features</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                  <p className="text-sm text-muted-foreground mb-4">
                    This portfolio has some interactive surprises. Try these:
                  </p>
                  
                  <div className="space-y-2 sm:space-y-3">
                    {hints.map((hint, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-3 p-2 sm:p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
                      >
                        <span className="text-xl sm:text-2xl flex-shrink-0">{hint.emoji}</span>
                        <span className="text-sm pt-0.5 sm:pt-1">{hint.text}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <p className="text-xs text-muted-foreground/60 mt-4 text-center">
                    There might be more hidden around the site... 👀
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
