import { memo, useMemo } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TerminalLine {
  id: number;
  text: string;
  delay: number;
  x: number;
}

const terminalSnippets = [
  "$ git commit -m 'implement neural network'",
  ">>> import tensorflow as tf",
  "$ npm run build --production",
  "const model = await tf.loadLayersModel()",
];

const densityMap = {
  light: 4,
  medium: 6,
  heavy: 8,
} as const;

const speedMap = {
  slow: 50,
  medium: 35,
  fast: 25,
} as const;

interface TerminalBackgroundProps {
  density?: "light" | "medium" | "heavy";
  speed?: "slow" | "medium" | "fast";
}

// Pure CSS animation - zero JS overhead during scroll
export const TerminalBackground = memo(({ 
  density = "medium",
  speed = "slow" 
}: TerminalBackgroundProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  const lineCount = densityMap[density];
  const animationDuration = speedMap[speed];

  // Generate lines only once
  const lines = useMemo(() => {
    const generatedLines: TerminalLine[] = [];
    for (let i = 0; i < lineCount; i++) {
      generatedLines.push({
        id: i,
        text: terminalSnippets[i % terminalSnippets.length],
        delay: (i / lineCount) * animationDuration,
        x: 5 + (i * (90 / lineCount)),
      });
    }
    return generatedLines;
  }, [lineCount, animationDuration]);

  // Skip rendering entirely if reduced motion is preferred
  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        {lines.slice(0, 2).map((line) => (
          <div
            key={line.id}
            className="absolute whitespace-nowrap font-mono text-xs text-primary/50"
            style={{ left: `${line.x}%`, top: `${line.id * 30}%` }}
          >
            {line.text}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
      <style>{`
        @keyframes terminalFloat {
          0% { transform: translateY(-100px) translateZ(0); opacity: 0; }
          10% { opacity: 0; }
          15% { opacity: 0.5; }
          85% { opacity: 0.5; }
          95% { opacity: 0; }
          100% { transform: translateY(105vh) translateZ(0); opacity: 0; }
        }
      `}</style>
      {lines.map((line) => (
        <div
          key={line.id}
          className="absolute whitespace-nowrap font-mono text-xs text-primary/80"
          style={{
            left: `${line.x}%`,
            animation: `terminalFloat ${animationDuration}s linear infinite`,
            animationDelay: `${line.delay}s`,
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            textShadow: '0 0 10px hsl(var(--primary) / 0.4)',
          }}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
});

TerminalBackground.displayName = 'TerminalBackground';
