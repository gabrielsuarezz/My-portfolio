import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TerminalLine {
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

export const TerminalBackground = ({ 
  density = "medium",
  speed = "slow" 
}: { 
  density?: "light" | "medium" | "heavy";
  speed?: "slow" | "medium" | "fast";
}) => {
  const [lines, setLines] = useState<TerminalLine[]>([]);

  const densityMap = {
    light: 8,
    medium: 12,
    heavy: 18,
  };

  const speedMap = {
    slow: 40,
    medium: 25,
    fast: 15,
  };

  const lineCount = densityMap[density];
  const animationSpeed = speedMap[speed];

  useEffect(() => {
    const generatedLines: TerminalLine[] = [];
    for (let i = 0; i < lineCount; i++) {
      generatedLines.push({
        text: terminalSnippets[Math.floor(Math.random() * terminalSnippets.length)],
        delay: Math.random() * 20,
        x: Math.random() * 100,
      });
    }
    setLines(generatedLines);
  }, [lineCount]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.15]">
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ y: -100, opacity: 0 }}
          animate={{
            y: ["0vh", "110vh"],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: animationSpeed,
            delay: line.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute whitespace-nowrap font-mono text-xs md:text-sm text-primary"
          style={{
            left: `${line.x}%`,
            filter: "blur(0.5px)",
          }}
        >
          {line.text}
        </motion.div>
      ))}
    </div>
  );
};
