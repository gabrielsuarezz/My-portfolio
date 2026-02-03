import { Suspense, ReactNode, memo } from 'react';

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Generic content skeleton that matches most sections
 */
const SectionSkeleton = memo(() => (
  <section className="py-24 relative overflow-hidden">
    <div className="container mx-auto px-6">
      {/* Header skeleton */}
      <div className="text-center mb-16 space-y-3">
        <div className="h-12 w-64 mx-auto bg-muted/30 rounded-sm animate-pulse" />
        <div className="h-6 w-96 mx-auto bg-muted/20 rounded-sm animate-pulse" />
      </div>

      {/* Content skeleton - 3 card grid */}
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-64 bg-card/30 border border-border/50 rounded-lg animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  </section>
));

SectionSkeleton.displayName = 'SectionSkeleton';

/**
 * Lightweight wrapper for lazy-loaded sections
 * Uses CSS-only loading state for minimal overhead during scroll
 */
export const LazySection = memo(({ children, fallback }: LazySectionProps) => {
  return (
    <Suspense fallback={fallback || <SectionSkeleton />}>
      {children}
    </Suspense>
  );
});

LazySection.displayName = 'LazySection';
