import { useCallback, useRef } from 'react';

export const useLongPress = (callback: () => void, duration = 3000) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const start = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      callback();
    }, duration);
  }, [callback, duration]);

  const stop = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  };
};
