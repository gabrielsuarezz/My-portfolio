import { memo, useRef, useCallback, ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export const MagneticButton = memo(({ children, className = '', strength = 0.3 }: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const rafIdRef = useRef<number>();

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (prefersReducedMotion || !ref.current) return;

    // Throttle with requestAnimationFrame - skip if frame already pending
    if (rafIdRef.current) return;

    rafIdRef.current = requestAnimationFrame(() => {
      if (!ref.current) {
        rafIdRef.current = undefined;
        return;
      }

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;

      const pullX = distX * strength;
      const pullY = distY * strength;

      ref.current.style.transform = `translate(${pullX}px, ${pullY}px)`;

      rafIdRef.current = undefined;
    });
  }, [strength, prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    // Cancel any pending RAF
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = undefined;
    }
    if (!ref.current) return;
    ref.current.style.transform = 'translate(0px, 0px)';
  }, []);

  return (
    <div
      ref={ref}
      className={`inline-block transition-transform duration-200 ease-out ${className}`}
      onMouseMove={prefersReducedMotion ? undefined : handleMouseMove}
      onMouseLeave={prefersReducedMotion ? undefined : handleMouseLeave}
    >
      {children}
    </div>
  );
});

MagneticButton.displayName = 'MagneticButton';
