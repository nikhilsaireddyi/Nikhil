'use client';

import { useEffect, useState } from 'react';
import { centralScroll, ScrollPayload } from '@/motion/scroll';

export function useLenisScroll(callback?: (payload: ScrollPayload) => void): ScrollPayload {
  const [scrollState, setScrollState] = useState<ScrollPayload>(() => centralScroll.getPayload());

  useEffect(() => {
    const unsubscribe = centralScroll.subscribe((payload) => {
      setScrollState(payload);
      if (callback) {
        callback(payload);
      }
    });

    return unsubscribe;
  }, [callback]);

  return scrollState;
}
