import { useCallback, useRef, useState } from 'react';

export const useClickCounter = (targetCount: number, callback: () => void, resetDelay = 2000) => {
  const [count, setCount] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleClick = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setCount((prev) => {
      const newCount = prev + 1;
      
      if (newCount === targetCount) {
        callback();
        return 0;
      }

      return newCount;
    });

    // Reset counter after delay
    timeoutRef.current = setTimeout(() => {
      setCount(0);
    }, resetDelay);
  }, [callback, targetCount, resetDelay]);

  return { count, handleClick };
};
