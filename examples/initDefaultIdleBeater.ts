/* eslint no-console: 0 */
import idleBeat, { DEFAULT_CONFIG, type IdleBeatEvent } from '../src/index';

import writeToTextarea from './utils/writeToTextarea';
import updateStateInfo from './utils/updateStateInfo';
import updateConfigInfo from './utils/updateConfigInfo';

import { DEFAULT_BACKGROUND_COLOR, IDLE_BACKGROUND_COLOR } from './constants';

const IDLE_TIMEOUT = 20; // seconds

/**
 * Initialize the default idleBeater instance
 * This will create and start a idleBeater with the default settings.
 * The idleBeater will monitor the user activity and dispatch custom events
 * when the user becomes active or idle.
 *
 * @returns {IdleBeatType} - The default idleBeater instance
 */
function initDefaultIdleBeater() {
  /**
   * Create and start a idleBeater with the default settings
   */
  const idleBeater = idleBeat();

  /**
   * Print the state and settings of the idleBeater
   */
  updateStateInfo(idleBeater);
  updateConfigInfo(idleBeater);

  /**
   * Bind event listeners to the idleBeater events
   * These events are CustomEvents that are dispatched by the idleBeater
   * when the user becomes active or idle.
   */
  const activeHandler = (event: Event) => {
    const e = event as IdleBeatEvent;
    updateStateInfo(idleBeater);
    console.log('idleBeater active', e.detail); // Mapping to the detail of the new CustomEvent(eventName, { detail }

    writeToTextarea(
      'default-events-info',
      `Last active ${e.detail.state.lastActive}, ${e.detail.state.lastEventType}\n`,
    );

    document.body.style.backgroundColor = DEFAULT_BACKGROUND_COLOR;
  };
  document.addEventListener(DEFAULT_CONFIG.activeEventName, activeHandler);

  document.addEventListener(DEFAULT_CONFIG.idleEventName, (event: Event) => {
    const e = event as IdleBeatEvent;
    updateStateInfo(idleBeater);
    console.log('idleBeater idle', e.detail); // Mapping to the detail of the new CustomEvent(eventName, { detail }

    const elapsedDate = (Date.now() - e.detail.state.lastActive) / 1e3;
    const isIdleTimeoutExceed = elapsedDate >= IDLE_TIMEOUT;

    writeToTextarea(
      'default-events-info',
      `\nisIdle ${e.detail.state.isIdle}\n Elapsed Idle time: ${elapsedDate}\n since ${e.detail.state.lastActive}\n >= IDLE_TIMEOUT? ${isIdleTimeoutExceed}\n`,
    );

    document.body.style.backgroundColor = isIdleTimeoutExceed
      ? IDLE_BACKGROUND_COLOR
      : DEFAULT_BACKGROUND_COLOR;

    // console.log('End idleBeater idle');
  });

  return idleBeater;
}

export default initDefaultIdleBeater;
