import type { State, Config } from './types';

export const DEFAULT_STATE: State = {
  lastActive: 0,
  lastEventType: null,
  isIdle: false,
  isBeating: false,
} as const;

/**
 * The default configuration for the idle beat instance.
 * This configuration will be used if no custom configuration is provided.
 */
export const DEFAULT_CONFIG: Required<Config> = {
  id: 'default', // Instance id.

  /**
   * The default event names to emit when idle or active
   * If not set, will use the default event names
   * If set, will use the custom event names
   */
  idleEventName: 'idle',
  activeEventName: 'active',

  /**
   * The interval for beating idle time in seconds
   * If not set, will use the default beat time
   */
  beat: 10, // seconds

  /**
   * The target element to monitor
   * If not set, will use the default target
   */
  target: document,

  /**
   * Monitor on what event types (Set active when event been trigger)
   * If not set, will use the default events
   */
  events: [
    // Mouse events
    'mousedown',
    'mousemove',
    'mouseup',
    'click',

    // Wheel events
    'scroll',

    // Touch events
    'touchstart',
    'touchmove',
    'touchend',

    // Keyboard events
    'keydown',
    'keypress',

    'change',

    // Page visibility events
    'visibilitychange',

    // Window events
    'resize',
    'orientationchange',
  ],
} as const;
