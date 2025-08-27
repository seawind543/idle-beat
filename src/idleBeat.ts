import requestInterval from './utils/requestInterval';
import isHumanScroll from './utils/isHumanScroll';

import { DEFAULT_STATE, DEFAULT_CONFIG } from './constants';
import type { State, Config, IdleBeatEvent } from './types';

type GetConfig = () => Required<Config>;
type SetConfig = (newConfig: Config) => void;
type GetState = () => State;
type SetState = (newState: State) => void;

// Dispatch the active/idle event
function dispatchEvent(
  type: 'active' | 'idle',
  getConfig: GetConfig,
  getState: GetState,
) {
  const config = getConfig();
  const { target, activeEventName, idleEventName } = config;
  const customEventType = type === 'active' ? activeEventName : idleEventName;
  const idleEvent: IdleBeatEvent = new CustomEvent(customEventType, {
    detail: {
      state: getState(),
      config,
    },
    bubbles: true,
  });
  target.dispatchEvent(idleEvent);
}

function idleHandlerFactory(
  getConfig: GetConfig,
  getState: GetState,
  setState: SetState,
) {
  return () => {
    const newState = { ...getState(), isIdle: true };
    setState(newState);

    // Dispatch the idle event
    dispatchEvent('idle', getConfig, getState);
  };
}

function activeHandlerFactory(
  getConfig: GetConfig,
  getState: GetState,
  setState: SetState,
  beatIdle: () => void,
) {
  return (event?: Event) => {
    const lastEventType = event?.type ?? null;
    if (lastEventType === 'scroll' && !isHumanScroll(event)) {
      // Ignore scroll events that are not initiated by user interaction
      // console.warn('Ignored scroll event due to momentum scrolling');
      return;
    }

    const newState: State = {
      ...getState(),
      isIdle: false, // Set the state to active
      lastActive: Date.now(), // Reset the lastActive to now
      lastEventType, // Reset the lastEvent to the current event
    };
    setState(newState);

    // Dispatch the active event
    dispatchEvent('active', getConfig, getState);

    beatIdle();
  };
}

function getMonitorTarget(eventType: string, target: EventTarget) {
  const WINDOWS_EVENTS = [
    'resize',
    'orientationchange',
    // 'focus',
    // 'blur',
  ] as const;

  const monitorTarget = WINDOWS_EVENTS.includes(
    eventType as (typeof WINDOWS_EVENTS)[number],
  )
    ? window
    : target;

  return monitorTarget;
}

function idleBeat(options?: Config) {
  let state: State = structuredClone(DEFAULT_STATE);
  const getState: GetState = () => structuredClone(state);
  const setState: SetState = (newState: State) => {
    state = structuredClone(newState);
  };

  const config = { ...DEFAULT_CONFIG, ...options };
  const getConfig: GetConfig = () => config;
  const setConfig: SetConfig = (newConfig: Config) => {
    if (getState().isBeating) {
      // If idleBeat is already running, do not change the config of the idleBeat instance
      return;
    }
    Object.assign(getConfig(), newConfig);
  };

  let activeHandler: null | ReturnType<typeof activeHandlerFactory> = null;
  let cancelInterval: undefined | ReturnType<typeof requestInterval>;

  /*  Reset the idle timer and start a new interval */
  const beatIdle = () => {
    const { beat } = getConfig();
    cancelInterval?.();
    cancelInterval = requestInterval(
      idleHandlerFactory(getConfig, getState, setState),
      beat * 1e3,
    );
  };

  const stop = () => {
    const { target, events: activeEvents } = getConfig();

    // Reset STATE
    setState({ ...getState(), isBeating: false, isIdle: false });

    cancelInterval?.();

    if (activeHandler) {
      activeEvents.forEach((eventType) => {
        const monitorTarget = getMonitorTarget(eventType, target);
        monitorTarget.removeEventListener(eventType, activeHandler, true);
      });
    }

    // Clean up previous scroll event handlers if any
    // scrollHandler.destroy();
  };

  const start = () => {
    if (getState().isBeating) {
      // If idleBeat is already running, do not start again
      // This prevents multiple intervals from being set
      // and multiple event listeners from being added.
      // It is a no-op if idleBeat is already running.
      // You can call stop() to reset the idleBeat instance.
      // This is useful if you want to change the config of the idleBeat instance
      // without creating a new instance.
      return;
    }

    const { target, events: activeEvents } = getConfig();

    setState({
      ...getState(),
      lastActive: Date.now(),
      lastEventType: null,
      isIdle: false,
      isBeating: true,
    });

    activeHandler = activeHandlerFactory(
      getConfig,
      getState,
      setState,
      beatIdle,
    );
    activeEvents.forEach((eventType) => {
      const monitorTarget = getMonitorTarget(eventType, target);
      monitorTarget.addEventListener(eventType, activeHandler, true);
    });

    beatIdle();
  };

  return {
    getState,
    getConfig,
    setConfig,
    start,
    stop,
  };
}

export default idleBeat;
