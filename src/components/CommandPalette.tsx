import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command } from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  action: () => void;
  icon?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette = ({ isOpen, onClose }: CommandPaletteProps) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = [
    {
      id: 'experience',
      label: 'Jump to Experience',
      icon: '💼',
      action: () => {
        document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
    },
    {
      id: 'projects',
      label: 'View Projects',
      icon: '🚀',
      action: () => {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
    },
    {
      id: 'skills',
      label: 'Check Skills',
      icon: '⚡',
      action: () => {
        document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
    },
    {
      id: 'contact',
      label: 'Get in Touch',
      icon: '📧',
      action: () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
    },
    {
      id: 'top',
      label: 'Back to Top',
      icon: '⬆️',
      action: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onClose();
      },
    },
    {
      id: 'secret',
      label: 'View Console Secrets',
      icon: '🔍',
      action: () => {
        console.log('%cYou found the secret command! 🎉', 'font-size: 20px; color: #10b981;');
        onClose();
      },
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (!isOpen) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        filteredCommands[selectedIndex]?.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 mx-4"
          >
            <div className="bg-background border border-border rounded-lg shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Command className="w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Type a command or search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                  autoFocus
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono bg-muted rounded">
                  ESC
                </kbd>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {filteredCommands.map((cmd, index) => (
                  <button
                    key={cmd.id}
                    onClick={cmd.action}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      index === selectedIndex
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent/50'
                    }`}
                  >
                    <span className="text-2xl">{cmd.icon}</span>
                    <span className="flex-1">{cmd.label}</span>
                  </button>
                ))}
                {filteredCommands.length === 0 && (
                  <div className="px-4 py-8 text-center text-muted-foreground">
                    No commands found
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
