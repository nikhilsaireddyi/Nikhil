'use client';

import { useCallback } from 'react';
import { cursorBus } from '@/motion/cursor';
import { CursorState } from '@/types';

export function useCursorHover(state: CursorState = 'link', text?: string) {
  const onMouseEnter = useCallback(() => {
    cursorBus.set(state, text);
  }, [state, text]);

  const onMouseLeave = useCallback(() => {
    cursorBus.reset();
  }, []);

  return {
    onMouseEnter,
    onMouseLeave,
  };
}
