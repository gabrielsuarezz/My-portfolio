import { Suspense, lazy, ComponentType, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Wrapper for lazy-loaded sections with a smooth loading state
 */
export const LazySection = ({ children, fallback }: LazySectionProps) => {
  const defaultFallback = (
    <div className="min-h-[400px] flex items-center justify-center">
      <motion.div
        className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};

/**
 * Creates a lazy-loaded component with built-in suspense
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  return lazy(importFn);
}
