import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface MatrixRainProps {
  onComplete?: () => void;
  duration?: number;
}

export const MatrixRain = ({ onComplete, duration = 5000 }: MatrixRainProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ01';
    const fontSize = 16;

    // Cap columns at 60 for performance on large screens
    const maxColumns = Math.min(Math.floor(canvas.width / fontSize), 60);
    const drops: number[] = Array(maxColumns).fill(1);

    // Target 30 FPS for better performance on low-end devices
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;
    let lastFrameTime = 0;
    let animationId: number;

    const draw = (currentTime: number) => {
      // Throttle to target FPS
      if (currentTime - lastFrameTime < frameInterval) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      lastFrameTime = currentTime;

      // Increased fade alpha for less compositing (0.05 -> 0.1)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    const timer = setTimeout(() => {
      cancelAnimationFrame(animationId);
      onComplete?.();
    }, duration);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(timer);
    };
  }, [duration, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 pointer-events-none"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-black/90 border-2 border-green-500 p-8 rounded-lg text-green-500 font-mono"
        >
          <h2 className="text-3xl mb-4">ACCESS GRANTED</h2>
          <p className="text-lg">You've unlocked the matrix.</p>
          <p className="text-sm mt-2">Here's a secret: I coded this entire portfolio in a caffeine-fueled weekend.</p>
        </motion.div>
      </div>
    </motion.div>
  );
};
