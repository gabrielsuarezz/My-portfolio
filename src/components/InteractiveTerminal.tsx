import { useState, useRef, useEffect, memo, useCallback } from 'react';
import { toast } from 'sonner';

interface Command {
  name: string;
  description: string;
  action: () => string | string[];
}

const COMMANDS: Record<string, Command> = {
  help: {
    name: 'help',
    description: 'Show available commands',
    action: () => [
      '┌─────────────────────────────────────┐',
      '│  Available Commands                 │',
      '├─────────────────────────────────────┤',
      '│  help     - Show this message       │',
      '│  whoami   - About Gabriel           │',
      '│  skills   - Technical skills        │',
      '│  projects - Featured projects       │',
      '│  contact  - Get in touch            │',
      '│  links    - Social links            │',
      '│  clear    - Clear terminal          │',
      '│  secret   - ???                     │',
      '└─────────────────────────────────────┘',
    ],
  },
  whoami: {
    name: 'whoami',
    description: 'About Gabriel',
    action: () => [
      '> Gabriel Suarez',
      '  CS @ FIU • AI & Software Engineer',
      '  3x Hackathon Winner 🏆',
      '',
      '  "Exploring the edge between AI,',
      '   creativity, and code."',
    ],
  },
  skills: {
    name: 'skills',
    description: 'Technical skills',
    action: () => [
      '> Technical Stack:',
      '  Languages: Python, TypeScript, Java, C++',
      '  AI/ML: TensorFlow, PyTorch, OpenCV, LLMs',
      '  Web: React, Next.js, FastAPI, Flask',
      '  IoT: Arduino, Raspberry Pi, Sensors',
    ],
  },
  projects: {
    name: 'projects',
    description: 'Featured projects',
    action: () => [
      '> Featured Projects:',
      '  🏆 Voxtant - AI Interview Platform',
      '  🏆 HeliosAI - Educational IoT System',
      '  🔒 ViewGuard - AI Security Command Center',
      '',
      '  [Scroll down to see all projects]',
    ],
  },
  contact: {
    name: 'contact',
    description: 'Contact info',
    action: () => [
      '> Contact:',
      '  Email: gsuarez@fiu.edu',
      '  LinkedIn: /in/gabrielsuarezz',
      '  GitHub: /gabrielsuarezz',
    ],
  },
  links: {
    name: 'links',
    description: 'Social links',
    action: () => [
      '> Links:',
      '  github.com/gabrielsuarezz',
      '  linkedin.com/in/gabrielsuarezz',
    ],
  },
  secret: {
    name: 'secret',
    description: 'Hidden command',
    action: () => {
      return [
        '> 🎮 You found a secret!',
        '  Try the Konami Code: ↑↑↓↓←→←→BA',
        '  Or click my photo 7 times...',
      ];
    },
  },
  clear: {
    name: 'clear',
    description: 'Clear terminal',
    action: () => 'CLEAR',
  },
};

export const InteractiveTerminal = memo(() => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Array<{ type: 'input' | 'output'; content: string | string[] }>>([]);
  const [showHint, setShowHint] = useState(true);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const executeCommand = useCallback((cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    setShowHint(false);
    
    if (!trimmedCmd) return;
    
    setCommandHistory(prev => [...prev, trimmedCmd]);
    setHistoryIndex(-1);
    
    // Add input to history
    setHistory(prev => [...prev, { type: 'input', content: `$ ${trimmedCmd}` }]);
    
    if (trimmedCmd === 'clear') {
      setHistory([]);
      return;
    }
    
    const command = COMMANDS[trimmedCmd];
    if (command) {
      const result = command.action();
      setHistory(prev => [...prev, { type: 'output', content: result }]);
      
      if (trimmedCmd === 'secret') {
        toast.success('🎮 Secret unlocked!', {
          description: 'Check out the terminal for hidden tips',
        });
      }
    } else {
      setHistory(prev => [...prev, { 
        type: 'output', 
        content: `Command not found: ${trimmedCmd}. Type 'help' for available commands.` 
      }]);
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  }, [input, executeCommand, commandHistory, historyIndex]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  // Focus on click
  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div 
      ref={containerRef}
      onClick={handleContainerClick}
      className="font-mono text-xs sm:text-sm max-h-32 overflow-y-auto cursor-text"
    >
      {/* Command history */}
      {history.map((entry, i) => (
        <div key={i} className={entry.type === 'input' ? 'text-accent' : 'text-muted-foreground'}>
          {Array.isArray(entry.content) 
            ? entry.content.map((line, j) => <div key={j}>{line}</div>)
            : entry.content
          }
        </div>
      ))}
      
      {/* Input line */}
      <div className="flex items-center gap-1">
        <span className="text-accent">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-foreground caret-accent"
          placeholder={showHint ? "type 'help' to start..." : ""}
          autoComplete="off"
          spellCheck={false}
        />
        <span className="w-2 h-4 bg-accent/80 animate-pulse" />
      </div>
    </div>
  );
});

InteractiveTerminal.displayName = 'InteractiveTerminal';
