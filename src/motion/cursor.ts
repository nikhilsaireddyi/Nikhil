import { CursorState } from '@/types';

export type CursorListener = (state: CursorState, label?: string) => void;

class CursorDispatcher {
  private listeners = new Set<CursorListener>();
  private currentState: CursorState = 'default';
  private currentLabel: string | undefined = undefined;

  public subscribe(listener: CursorListener): () => void {
    this.listeners.add(listener);
    listener(this.currentState, this.currentLabel);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public set(state: CursorState, label?: string): void {
    this.currentState = state;
    this.currentLabel = label;
    for (const listener of this.listeners) {
      listener(state, label);
    }
  }

  public reset(): void {
    this.set('default', undefined);
  }
}

export const cursorBus = new CursorDispatcher();
