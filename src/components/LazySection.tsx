import { Suspense, ReactNode, memo } from 'react';

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Lightweight wrapper for lazy-loaded sections
 * Uses CSS-only loading state for zero JS overhead during scroll
 */
export const LazySection = memo(({ children, fallback }: LazySectionProps) => {
  const defaultFallback = (
    <div className="min-h-[400px] flex items-center justify-center">
      <div 
        className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"
        style={{ willChange: 'transform' }}
      />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
});

LazySection.displayName = 'LazySection';
