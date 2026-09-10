export interface ScrollPayload {
  scroll: number;
  limit: number;
  velocity: number;
  direction: number;
  progress: number;
}

export type ScrollSubscriber = (payload: ScrollPayload) => void;

class CentralScrollManager {
  private subscribers = new Set<ScrollSubscriber>();
  private currentPayload: ScrollPayload = {
    scroll: 0,
    limit: 0,
    velocity: 0,
    direction: 1,
    progress: 0,
  };

  public subscribe(subscriber: ScrollSubscriber): () => void {
    this.subscribers.add(subscriber);
    subscriber(this.currentPayload);
    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  public notify(payload: ScrollPayload): void {
    this.currentPayload = payload;
    for (const sub of this.subscribers) {
      sub(payload);
    }
  }

  public getPayload(): ScrollPayload {
    return this.currentPayload;
  }
}

export const centralScroll = new CentralScrollManager();
