import { useRef, useCallback } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface TiltConfig {
  maxTilt?: number;
  scale?: number;
  perspective?: number;
}

export const useTiltEffect = ({ 
  maxTilt = 10, 
  scale = 1.02,
  perspective = 1000 
}: TiltConfig = {}) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;
    
    ref.current.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
  }, [maxTilt, scale, perspective, prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  }, []);

  return {
    ref,
    handlers: prefersReducedMotion ? {} : {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    }
  };
};
