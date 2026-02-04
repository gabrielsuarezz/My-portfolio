import { useEffect, useState } from 'react';

export const useKeyboardSequence = (sequence: string, callback: () => void) => {
  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      setKeys((prevKeys) => {
        const newKeys = [...prevKeys, e.key.toLowerCase()];
        const recentKeys = newKeys.slice(-sequence.length).join('');

        if (recentKeys === sequence.toLowerCase()) {
          callback();
          return [];
        }

        // Keep only last 20 keys to prevent memory issues
        return newKeys.slice(-20);
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sequence, callback]);
};

