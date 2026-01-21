import { useState, useEffect, useRef, ImgHTMLAttributes, memo } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  containerClassName?: string;
}

/**
 * Optimized image component with:
 * - Lazy loading via Intersection Observer
 * - Smooth fade-in on load
 * - Optional blur placeholder
 */
export const OptimizedImage = memo(({
  src,
  alt,
  placeholder,
  className,
  containerClassName,
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0.01,
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      {/* Placeholder */}
      {placeholder && !isLoaded && (
        <img
          src={placeholder}
          alt=""
          className={cn(
            'absolute inset-0 w-full h-full object-cover blur-lg scale-110',
            className
          )}
          aria-hidden="true"
        />
      )}
      
      {/* Main image */}
      <img
        ref={imgRef}
        src={isInView ? src : undefined}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={cn(
          'transition-opacity duration-500',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        {...props}
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';
