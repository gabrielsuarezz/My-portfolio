import { useEffect, useState } from 'react';

export const useMouseShake = (callback: () => void, threshold = 500) => {
  const [mousePositions, setMousePositions] = useState<{ x: number; y: number; time: number }[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      
      setMousePositions((prev) => {
        const recent = [...prev, { x: e.clientX, y: e.clientY, time: now }].filter(
          (pos) => now - pos.time < 300 // Keep only positions from last 300ms
        );

        // Calculate total distance traveled
        let totalDistance = 0;
        for (let i = 1; i < recent.length; i++) {
          const dx = recent[i].x - recent[i - 1].x;
          const dy = recent[i].y - recent[i - 1].y;
          totalDistance += Math.sqrt(dx * dx + dy * dy);
        }

        // If mouse traveled more than threshold pixels in 300ms, it's a shake!
        if (totalDistance > threshold) {
          callback();
          return [];
        }

        return recent;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [callback, threshold]);
};
