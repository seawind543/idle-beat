/* eslint no-console: 0 */
import idleBeat, { type IdleBeatEvent } from '../src/index';

import writeToTextarea from './utils/writeToTextarea';
import updateStateInfo from './utils/updateStateInfo';
import updateConfigInfo from './utils/updateConfigInfo';

import { DEFAULT_BACKGROUND_COLOR, IDLE_BACKGROUND_COLOR } from './constants';

const IDLE_TIMEOUT = 0; // seconds

/**
 * Initialize a customized idleBeater instance
 * This will create a idleBeater with custom settings.
 * The custom settings will override the default settings and be used to create a new idleBeater instance.
 * The custom settings will not affect the default idleBeater instance.
 *
 * @returns {IdleBeatType} - The customized idleBeater instance
 */
function initCustomizeIdleBeater() {
  const monitorTarget = document.querySelector(
    '#customized-monitor-area',
  ) as HTMLElement;

  const CUSTOMIZE_EVENT_NAMES = {
    ACTIVE: 'myActive', // Custom event name for active
    IDLE: 'myIdle', // Custom event name for idle
  };
  const customizeIdleBeater = idleBeat({
    id: 'customized', // For identify the instance purpose

    beat: 4, // seconds
    target: monitorTarget || document, // Monitor a specific area or the whole document
    idleEventName: CUSTOMIZE_EVENT_NAMES.IDLE, // Custom event name for idle
    activeEventName: CUSTOMIZE_EVENT_NAMES.ACTIVE, // Custom event name for active
    events: [
      'mousemove',
      'click',
      'scroll',
      'keydown',
      'resize',
      'visibilitychange',
    ],
  });

  /**
   * Print the state and settings of the customizeIdleBeater
   */
  updateStateInfo(customizeIdleBeater);
  updateConfigInfo(customizeIdleBeater);

  const customizedConfig = customizeIdleBeater.getConfig();

  /**
   * Bind event listeners to the customizeIdleBeater events
   * These events are CustomEvents that are dispatched by the customizeIdleBeater
   * when the user becomes active or idle.
   * The event names are customized to 'active2' and 'idle2' in the settings.
   * This allows you to have multiple idleBeater instances with different event names.
   * The customizeIdleBeater instance will not affect the default idleBeater instance.
   */
  const customerActiveHandler = (e: IdleBeatEvent) => {
    updateStateInfo(customizeIdleBeater);

    console.log('customizeIdleBeater active', e.detail); // Mapping to the detail of the new CustomEvent(eventName, { detail }
    writeToTextarea(
      'customized-events-info',
      `Last active ${e.detail.state.lastActive}, ${e.detail.state.lastEventType}\n`,
    );

    monitorTarget.style.backgroundColor = DEFAULT_BACKGROUND_COLOR;
  };
  // @ts-expect-error addEventListener handle CustomEvent
  document.addEventListener(
    customizedConfig.activeEventName,
    customerActiveHandler,
  );

  // @ts-expect-error addEventListener handle CustomEvent
  document.addEventListener(
    customizedConfig.idleEventName,
    (e: IdleBeatEvent) => {
      console.log('customizeIdleBeater idle2', e.detail); // Mapping to the detail of the new CustomEvent(eventName, { detail }
      updateStateInfo(customizeIdleBeater);

      const elapsedDate = (Date.now() - e.detail.state.lastActive) / 1e3;
      const isIdleTimeoutExceed = elapsedDate >= IDLE_TIMEOUT;

      writeToTextarea(
        'customized-events-info',
        `\nisIdle ${e.detail.state.isIdle}\n Elapsed Idle time: ${elapsedDate}\n since ${e.detail.state.lastActive}\n >= IDLE_TIMEOUT? ${isIdleTimeoutExceed}\n`,
      );

      monitorTarget.style.backgroundColor = isIdleTimeoutExceed
        ? IDLE_BACKGROUND_COLOR
        : DEFAULT_BACKGROUND_COLOR;
    },
  );

  return customizeIdleBeater;
}

export default initCustomizeIdleBeater;
