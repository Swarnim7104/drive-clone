"use client";

import { useEffect, useState } from 'react';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'
];

export function useKonamiCode() {
  const [sequence, setSequence] = useState<string[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    // Check localStorage on mount - but only for development/testing
    // Comment out the next 5 lines to reset the unlock state
    /*
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('navi-unlocked');
      if (saved === 'true') {
        setIsUnlocked(true);
      }
    }
    */
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only listen for arrow keys
      if (!KONAMI_CODE.includes(event.key)) {
        setSequence([]);
        return;
      }

      setSequence(prev => {
        const newSequence = [...prev, event.key];
        
        // Check if we completed the sequence
        if (newSequence.length === KONAMI_CODE.length) {
          const isMatch = newSequence.every((key, index) => key === KONAMI_CODE[index]);
          if (isMatch) {
            setIsUnlocked(true);
            if (typeof window !== 'undefined') {
              localStorage.setItem('navi-unlocked', 'true');
            }
            // Add visual feedback
            document.body.style.animation = 'flash 0.3s ease-in-out';
            setTimeout(() => {
              document.body.style.animation = '';
            }, 300);
            return [];
          }
        }
        
        // Keep only the last 8 keys to prevent memory issues
        return newSequence.slice(-8);
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  return isUnlocked;
}
