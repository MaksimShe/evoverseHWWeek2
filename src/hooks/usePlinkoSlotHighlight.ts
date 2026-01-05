import { useState, useCallback } from 'react';
import { useTimeoutManager } from './useTimeoutManager';

interface UsePlinkoSlotHighlightReturn {
  highlightedSlots: Set<number>;
  highlightSlot: (slotIndex: number) => void;
}

export function usePlinkoSlotHighlight(): UsePlinkoSlotHighlightReturn {
  const [highlightedSlots, setHighlightedSlots] = useState<Set<number>>(new Set());
  const timeouts = useTimeoutManager();

  const highlightSlot = useCallback(
    (slotIndex: number) => {
      setHighlightedSlots((prev) => new Set(prev).add(slotIndex));

      timeouts.addTimeout(() => {
        setHighlightedSlots((prev) => {
          const newSet = new Set(prev);
          newSet.delete(slotIndex);
          return newSet;
        });
      }, 1000);
    },
    [timeouts]
  );

  return { highlightedSlots, highlightSlot };
}
