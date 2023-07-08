export type Timestamp = number; // milliseconds
export type Milliseconds = number;
export type Seconds = number;

export interface Config {
  /**
   * Monitor on the event types (Set active when event been trigger)
   */
  events?: Event['type'][];

  /**
   * In seconds
   */
  beat?: Seconds;

  /**
   * In milliseconds
   */
  debounce?: Milliseconds;
}

export interface Callback {
  (idleTime: Milliseconds, idleSetting: Seconds): void;
}

export interface CallbackRecord {
  // FIXME: should be `ReturnType<typeof window.setTimeout>`
  timeoutId: number;
}

export interface BeatCallback {
  (idleTime: Milliseconds): void;
}
