import { useRef, useCallback } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface MagneticConfig {
  strength?: number;
  radius?: number;
}

export const useMagneticEffect = ({ 
  strength = 0.3,
  radius = 100 
}: MagneticConfig = {}) => {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (prefersReducedMotion || !ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);
    
    if (distance < radius) {
      const pullX = distX * strength;
      const pullY = distY * strength;
      ref.current.style.transform = `translate(${pullX}px, ${pullY}px)`;
    }
  }, [strength, radius, prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'translate(0px, 0px)';
  }, []);

  return {
    ref,
    handlers: prefersReducedMotion ? {} : {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    }
  };
};
