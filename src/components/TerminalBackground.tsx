import { motion } from "framer-motion";
import { useEffect, useState, memo, useMemo } from "react";
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
  "$ python train_model.py --epochs 100",
  ">>> accuracy: 0.94 | loss: 0.12",
  "$ docker-compose up -d",
  "SELECT * FROM solar_panels WHERE status='active'",
  "$ curl https://api.openai.com/v1/chat",
  "def predict(image): return knn_model.classify()",
  "$ ssh deployment@server -p 2222",
  ">>> Training KNN classifier...",
  "$ terraform apply --auto-approve",
  "console.log('AI response:', data.choices[0])",
  "$ pytest tests/ --coverage",
  ">>> Model saved to ./shadow_vision/model.h5",
  "$ kubectl get pods --all-namespaces",
  "import { supabase } from '@/integrations'",
  "$ cargo build --release",
  ">>> Processing solar panel telemetry...",
];

const densityMap = {
  light: 8,
  medium: 12,
  heavy: 18,
} as const;

const speedMap = {
  slow: 35,
  medium: 22,
  fast: 14,
} as const;

interface TerminalBackgroundProps {
  density?: "light" | "medium" | "heavy";
  speed?: "slow" | "medium" | "fast";
}

// Memoized individual line component to prevent re-renders
const TerminalLine = memo(({ 
  line, 
  animationSpeed 
}: { 
  line: TerminalLine; 
  animationSpeed: number;
}) => (
  <motion.div
    initial={{ y: -100, opacity: 0 }}
    animate={{
      y: ["0vh", "110vh"],
      opacity: [0, 0.5, 0.5, 0],
    }}
    transition={{
      duration: animationSpeed,
      delay: line.delay,
      repeat: Infinity,
      ease: "linear",
    }}
    className="absolute whitespace-nowrap font-mono text-xs text-primary/70"
    style={{
      left: `${line.x}%`,
      willChange: 'transform',
    }}
  >
    {line.text}
  </motion.div>
));

TerminalLine.displayName = 'TerminalLine';

export const TerminalBackground = memo(({ 
  density = "medium",
  speed = "slow" 
}: TerminalBackgroundProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  const lineCount = densityMap[density];
  const animationSpeed = speedMap[speed];

  // Generate lines only once on mount
  const lines = useMemo(() => {
    const generatedLines: TerminalLine[] = [];
    for (let i = 0; i < lineCount; i++) {
      generatedLines.push({
        id: i,
        text: terminalSnippets[Math.floor(Math.random() * terminalSnippets.length)],
        delay: Math.random() * 15,
        x: Math.random() * 90 + 5,
      });
    }
    return generatedLines;
  }, [lineCount]);

  // Skip rendering entirely if reduced motion is preferred
  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        {lines.slice(0, 5).map((line) => (
          <div
            key={line.id}
            className="absolute whitespace-nowrap font-mono text-xs text-primary/50"
            style={{ left: `${line.x}%`, top: `${line.id * 20}%` }}
          >
            {line.text}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {lines.map((line) => (
        <TerminalLine 
          key={line.id} 
          line={line} 
          animationSpeed={animationSpeed} 
        />
      ))}
    </div>
  );
});

TerminalBackground.displayName = 'TerminalBackground';
