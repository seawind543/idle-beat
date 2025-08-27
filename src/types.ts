export type Timestamp = number; // milliseconds
export type Milliseconds = number;
export type Seconds = number;

/**
 * The state of the idle beat instance.
 * This state will be updated when the idle beat instance is active or idle.
 * It will also be used to emit the idle and active events.
 */
export interface State {
  /**
   * The timestamp of the latest active event
   */
  lastActive: Timestamp;

  /**
   * The latest active event
   */
  lastEventType: Event['type'] | null;

  isIdle: boolean;

  isBeating: boolean;
}

/**
 * The configuration for the idle beat instance.
 * This configuration will be used to create the idle beat instance.
 * It will also be used to emit the idle and active events.
 */
export interface Config {
  id?: string; // Instance id. For identify the instance purpose

  /**
   * The default event names to emit when idle or active
   * If not set, will use the default event names
   * If set, will use the custom event names
   */
  idleEventName?: string;
  activeEventName?: string;

  /**
   * The interval for beating idle time in seconds
   * If not set, will use the default beat time
   */
  beat?: Seconds;

  /**
   * The target element to monitor
   * If not set, will use the default target
   */
  target?: EventTarget;

  /**
   * Monitor on what event types (Set active when event been trigger)
   * If not set, will use the default events
   */
  events?: Event['type'][];
}

/**
 * Custom event type for active/idle events.
 * This will be dispatched when the user becomes active/idle.
 */
export type IdleBeatEvent = CustomEvent<{
  state: State;
  config: Required<Config>;
}>;
