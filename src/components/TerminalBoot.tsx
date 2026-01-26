import { useState, useEffect, memo } from "react";

interface BootLine {
  text: string;
  delay: number;
  type: 'system' | 'success' | 'info' | 'command';
}

const bootSequence: BootLine[] = [
  { text: "BIOS v3.14.159 - Gabriel Suarez Systems", delay: 0, type: 'system' },
  { text: "Initializing kernel...", delay: 200, type: 'system' },
  { text: "[OK] Memory check: 16GB DDR5", delay: 400, type: 'success' },
  { text: "[OK] Loading AI modules...", delay: 600, type: 'success' },
  { text: "[OK] Mounting /dev/creativity", delay: 800, type: 'success' },
  { text: "[OK] Starting portfolio.service", delay: 1000, type: 'success' },
  { text: "$ ./welcome.sh --visitor", delay: 1200, type: 'command' },
  { text: "Welcome to Gabriel's Terminal Portfolio", delay: 1400, type: 'info' },
  { text: "Loading experience...", delay: 1600, type: 'system' },
];

export const TerminalBoot = memo(({ onComplete }: { onComplete: () => void }) => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Check if user has seen boot before this session
    const hasSeenBoot = sessionStorage.getItem('hasSeenBoot');
    if (hasSeenBoot) {
      onComplete();
      return;
    }

    // Show lines progressively
    const timers: NodeJS.Timeout[] = [];
    
    bootSequence.forEach((_, index) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines(index + 1);
        }, bootSequence[index].delay)
      );
    });

    // Start exit animation after all lines shown
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      sessionStorage.setItem('hasSeenBoot', 'true');
    }, 2000);

    // Complete after exit animation
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Skip on click
  const handleSkip = () => {
    sessionStorage.setItem('hasSeenBoot', 'true');
    setIsExiting(true);
    setTimeout(onComplete, 300);
  };

  const getLineColor = (type: BootLine['type']) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'command': return 'text-accent';
      case 'info': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[100] bg-background flex items-center justify-center transition-opacity duration-500 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleSkip}
    >
      <div className="max-w-2xl w-full mx-6 p-6 bg-card/50 border border-border rounded-lg shadow-2xl">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
          <span className="ml-3 text-sm text-muted-foreground font-mono">terminal — bash</span>
        </div>
        
        <div className="font-mono text-sm space-y-1 min-h-[200px]">
          {bootSequence.slice(0, visibleLines).map((line, index) => (
            <div
              key={index}
              className={`${getLineColor(line.type)} animate-[fadeIn_0.15s_ease-out]`}
            >
              {line.text}
              {index === visibleLines - 1 && (
                <span className="inline-block w-2 h-4 bg-primary/80 ml-1 animate-pulse" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <span className="text-xs text-muted-foreground/50">Click anywhere to skip</span>
        </div>
      </div>

      {/* Scanlines overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--primary) / 0.03) 2px, hsl(var(--primary) / 0.03) 4px)',
        }}
      />
    </div>
  );
});

TerminalBoot.displayName = 'TerminalBoot';
