import { useState, useEffect, useRef, useCallback } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

/**
 * Debounced mouse position hook for performance
 * Uses requestAnimationFrame for smooth updates without blocking
 */
export const useDebouncedMousePosition = (enabled: boolean = true): MousePosition => {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });
  const frameRef = useRef<number>();
  const latestPosition = useRef<MousePosition>({ x: 0, y: 0 });

  const updatePosition = useCallback(() => {
    setPosition(latestPosition.current);
    frameRef.current = undefined;
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      latestPosition.current = { x: e.clientX, y: e.clientY };
      
      // Only schedule update if not already scheduled
      if (!frameRef.current) {
        frameRef.current = requestAnimationFrame(updatePosition);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [enabled, updatePosition]);

  return position;
};
