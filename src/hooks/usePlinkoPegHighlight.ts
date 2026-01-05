import { useState, useCallback } from 'react';
import { useTimeoutManager } from './useTimeoutManager';

interface UsePlinkoPegHighlightReturn {
  hitPegs: Set<string>;
  highlightPeg: (pegId: string) => void;
}

export function usePlinkoPegHighlight(): UsePlinkoPegHighlightReturn {
  const [hitPegs, setHitPegs] = useState<Set<string>>(new Set());
  const timeouts = useTimeoutManager();

  const highlightPeg = useCallback(
    (pegId: string) => {
      setHitPegs((prev) => new Set(prev).add(pegId));

      timeouts.addKeyedTimeout(
        pegId,
        () => {
          setHitPegs((prev) => {
            const newSet = new Set(prev);
            newSet.delete(pegId);
            return newSet;
          });
        },
        300
      );
    },
    [timeouts]
  );

  return { hitPegs, highlightPeg };
}
