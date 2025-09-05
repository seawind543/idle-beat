[![NPM](https://nodei.co/npm/idle-beat.png?downloads=true&stars=true)](https://www.npmjs.com/package/idle-beat/)

# idle-beat

`idle-beat` is a lightweight, highly configurable browser idle detection library that monitors user activity with a configurable beating interval and dispatches custom active and idle events. Easily integrated into web applications, it supports custom event names, target elements, and flexible idle timing to enhance security and user interaction.

## Features

- Detect user inactivity with customizable idle intervals  
- Dispatch custom active/idle events with detailed state info  
- Monitor specific DOM targets or the whole document  
- Support multiple independent instances simultaneously  
- Zero dependencies, lightweight and efficient  
- Full TypeScript support out of the box  

## Installation

Install the latest version of [idle-beat](https://github.com/seawind543/idle-beat) via Yarn or npm:

```sh
yarn add idle-beat
# or
npm install idle-beat
```

## Basic Usage Example (With Default Configuration)

```ts
import idleBeat, { DEFAULT_CONFIG, type IdleBeatEvent } from 'idleBeat';

// Create an instance with the default configuration
const idleBeater = idleBeat();

// Start monitoring user activity
idleBeater.start();

// Listen for active and idle events
document.addEventListener(DEFAULT_CONFIG.activeEventName, (event: Event) => {
  const e = event as IdleBeatEvent;
  console.log('User active:', e.detail);
});
document.addEventListener(DEFAULT_CONFIG.idleEventName, (event: Event) => {
  const e = event as IdleBeatEvent;
  console.log('User idle:', e.detail);
});

// Stop monitoring when no longer needed
idleBeater.stop();
```

## Usage Example with Customized Configuration

```ts
import idleBeat, { type IdleBeatEvent } from 'idleBeat';

const ACTIVE_EVENT_NAME = 'panelActive';
const IDLE_EVENT_NAME = 'panelIdle';

// Create an instance with customized settings
// Specify only the properties you want to customize; others use default values
const customized = idleBeat({
  id: 'myPanelMonitor',
  beat: 15,
  target: document.getElementById('myPanel') || document,
  activeEventName: ACTIVE_EVENT_NAME,
  idleEventName: IDLE_EVENT_NAME,
  events: ['mousemove', 'click', 'scroll'],
});

document.addEventListener(ACTIVE_EVENT_NAME, (event: Event) => {
  const e = event as IdleBeatEvent;
  console.log('Panel active:', e.detail.state);
});
document.addEventListener(IDLE_EVENT_NAME, (event: Event) => {
  const e = event as IdleBeatEvent;
  console.log('Panel idle:', e.detail.state);
});

// Start monitoring
customized.start();
```

## Get State Example

Retrieve the current user activity state anytime:

```ts
const state = idleBeater.getState();
console.log('Current state:', state);
/*
{
  lastActive: <timestamp>,
  lastEventType: 'mousemove',
  isIdle: false,
  isBeating: true
}
*/
```

## Get Config Example

Inspect the current configuration:

```ts
const config = idleBeater.getConfig();
console.log('Current config:', config);
```

## Set Config Example

Update the configuration (Note: You must stop monitoring before updating):

```ts
idleBeater.stop();
idleBeater.setConfig({
  beat: 20, // Adjust idle check interval to 20 seconds
  // Other properties remain unchanged
});
idleBeater.start();
```

## Advanced Example: Detect Both 30s and 40s Idle Using a Single Instance

Trigger actions at both 30 and 40 seconds of inactivity with one instance using a 10-second beat interval:

```ts
import idleBeat, { type IdleBeatEvent } from 'idle-beat';

const TOLERANCE = 1;
const IDLE_THRESHOLD_30_SECONDS = 30;
const IDLE_THRESHOLD_40_SECONDS = 40;
const idleBeater = idleBeat({
  beat: 10, // Check user activity every 10 seconds
});

// Start monitoring
idleBeater.start();

// Respond to idle events, trigger logic at 30 and 40 seconds of inactivity
document.addEventListener('idle', (event: Event) => {
  const e = event as IdleBeatEvent;
  const { state } = e.detail;
  const idleElapsed = (Date.now() - state.lastActive) / 1000; // seconds

  if (
    idleElapsed >= IDLE_THRESHOLD_30_SECONDS &&
    idleElapsed < IDLE_THRESHOLD_30_SECONDS + TOLERANCE
  ) {
    alert('User has been idle for 30 seconds!');
  } else if (
    idleElapsed >= IDLE_THRESHOLD_40_SECONDS &&
    idleElapsed < IDLE_THRESHOLD_40_SECONDS + TOLERANCE
  ) {
    alert('User has been idle for 40 seconds!');
  }
});
```

## API Reference

### idleBeat(config?)

| Method    | Type             | Description                         |
|-----------|------------------|-----------------------------------|
| start     | () => void       | Starts monitoring for idle events |
| stop      | () => void       | Stops monitoring                  |
| getState  | () => State      | Returns the current state         |
| getConfig | () => Config     | Returns the current configuration |
| setConfig | (Config) => void | Updates settings (must stop first)|

### Config

Defines the behavior and scope of each idleBeat instance:

```ts
interface Config {
  id?: string;              // Instance identifier (e.g., for multiple monitors)
  idleEventName?: string;   // Custom event name for idle state
  activeEventName?: string; // Custom event name for active state
  beat?: number;            // Idle timeout in seconds
  target?: EventTarget;     // DOM element to monitor (defaults to document)
  events?: string[];        // Event types to listen for (e.g., 'mousemove', 'click')
}
```

- **id**: Useful for distinguishing instances.
- **idleEventName / activeEventName**: Allows separate handling of events per instance.
- **beat**: Time in seconds before marking the user idle.
- **target**: DOM element to watch for user activity.
- **events**: User interactions that reset the idle timer.

## Default Config

If no config is provided, the following defaults apply (also available via the `DEFAULT_CONFIG` object):

```js
{
  id: 'default',
  idleEventName: 'idle',
  activeEventName: 'active',
  beat: 10,
  target: document,
  events: [
    'mousedown', 'mousemove', 'mouseup', 'click',
    'scroll',
    'touchstart', 'touchmove', 'touchend',
    'keydown', 'keypress',
    'change',
    'visibilitychange',
    'resize', 'orientationchange',
  ]
}
```

### State

Represents the current activity status:

```ts
interface State {
  lastActive: number;           // Timestamp of last activity (milliseconds)
  lastEventType: string | null; // Last event type (e.g., 'mousemove')
  isIdle: boolean;              // Whether currently idle
  isBeating: boolean;           // Whether monitoring is active
}
```

- **lastActive**: Timestamp of the most recent user activity.
- **lastEventType**: The event type that last updated the state.
- **isIdle**: `true` if the idle period has exceeded the threshold.
- **isBeating**: `true` when monitoring is active.

### IdleBeatEvent

Events dispatched are `CustomEvent` objects containing:

```ts
type IdleBeatEvent = CustomEvent<{
  state: State;
  config: Required<Config>;
}>
```

## Getting Help

If you have questions, issues, or suggestions, please open an issue on the [GitHub repository](https://github.com/seawind543/idle-beat/issues).

## Environment Compatibility

idleBeat works in modern browsers. It monitors standard user interaction events, so ensure your environment supports event listeners on the intended targets.

## License

Licensed under the [MIT License](./LICENSE).
