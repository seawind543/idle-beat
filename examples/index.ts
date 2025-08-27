/* eslint no-console: 0 */

// import styles
import './styles/main.css';
import './styles/switch.css';

import idleBeat, { DEFAULT_CONFIG, type IdleBeatEvent } from '../src/index';

import writeToTextarea from './utils/writeToTextarea';
import updateStateInfo from './utils/updateStateInfo';
import updateConfigInfo from './utils/updateConfigInfo';
import applyCustomizeSettings from './utils/applyCustomizeSettings';
import type { IdleBeatType } from './types';

const IDLE_TIMEOUT = 30; // 30 seconds

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
  const activeHandler = (e: IdleBeatEvent) => {
    updateStateInfo(idleBeater);
    console.log('idleBeater active', e.detail); // Mapping to the detail of the new CustomEvent(eventName, { detail }

    writeToTextarea(
      'default-events-info',
      `Last active ${e.detail.state.lastActive}, ${e.detail.state.lastEventType}\n`,
    );
  };
  // @ts-expect-error addEventListener handle CustomEvent
  document.addEventListener(DEFAULT_CONFIG.activeEventName, activeHandler);

  // @ts-expect-error addEventListener handle CustomEvent
  document.addEventListener(
    DEFAULT_CONFIG.idleEventName,
    (e: IdleBeatEvent) => {
      updateStateInfo(idleBeater);
      console.log('idleBeater idle', e.detail); // Mapping to the detail of the new CustomEvent(eventName, { detail }

      const elapsedDate = (Date.now() - e.detail.state.lastActive) / 1e3;
      writeToTextarea(
        'default-events-info',
        `\nisIdle ${e.detail.state.isIdle}\n Elapsed Idle time: ${elapsedDate}\n since ${e.detail.state.lastActive}\n >= IDLE_TIMEOUT? ${elapsedDate >= IDLE_TIMEOUT}\n`,
      );
      // console.log('End idleBeater idle');
    },
  );

  return idleBeater;
}

/**
 * Initialize a customized idleBeater instance
 * This will create a idleBeater with custom settings.
 * The custom settings will override the default settings and be used to create a new idleBeater instance.
 * The custom settings will not affect the default idleBeater instance.
 *
 * @returns {IdleBeatType} - The customized idleBeater instance
 */
function initCustomizeIdleBeater() {
  const CUSTOMIZE_EVENT_NAMES = {
    ACTIVE: 'myActive', // Custom event name for active
    IDLE: 'myIdle', // Custom event name for idle
  };
  const customizeIdleBeater = idleBeat({
    id: 'customized', // For identify the instance purpose

    beat: 15, // 15 seconds
    target: document.querySelector('#customized-monitor-area') || document, // Monitor a specific area or the whole document
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
      writeToTextarea(
        'customized-events-info',
        `\nisIdle ${e.detail.state.isIdle}\n Elapsed Idle time: ${elapsedDate}\n since ${e.detail.state.lastActive}\n >= IDLE_TIMEOUT? ${elapsedDate >= IDLE_TIMEOUT}\n`,
      );
    },
  );

  return customizeIdleBeater;
}

/**
 * Initialize the idleBeater switch watch
 * This will bind the event listeners to the toggle switches
 * to start or stop the idleBeater instances.
 *
 * @param idleBeater - The default idleBeater instance
 * @param customizeIdleBeater - The customized idleBeater instance
 */
function initIdleBeaterSwitchWatch(
  idleBeater: IdleBeatType,
  customizeIdleBeater: IdleBeatType,
) {
  // Bind the toggle switch for the default idleBeater
  // This will start or stop the idleBeater instance based on the toggle state
  document
    .getElementById('default--idle-beat-toggle')
    ?.addEventListener('change', (e) => {
      const isChecked = (e.target as HTMLInputElement).checked;

      console.log('Toggle idleBeater', isChecked);

      if (isChecked) {
        idleBeater.start();
      } else {
        idleBeater.stop();
        console.log('idleBeater.stop()');
      }

      updateStateInfo(idleBeater);
    });

  // Bind the toggle switch for the customized idleBeater
  // This will start or stop the customizeIdleBeater instance based on the toggle state
  document
    .getElementById('customized--idle-beat-toggle')
    ?.addEventListener('change', (e) => {
      const isChecked = (e.target as HTMLInputElement).checked;

      const fields = document.querySelectorAll(
        '.config-group .updatable-in-example',
      );
      fields.forEach((field) => {
        // Disable the input fields when the toggle is on
        // This prevents the user from changing the settings while the idleBeater is running
        // eslint-disable-next-line no-param-reassign
        (field as HTMLInputElement | HTMLTextAreaElement).disabled = isChecked;
      });

      if (isChecked) {
        applyCustomizeSettings(customizeIdleBeater);

        console.log(
          'Applied new settings to customizeIdleBeater',
          customizeIdleBeater.getConfig(),
        );

        customizeIdleBeater.start();
      } else {
        customizeIdleBeater.stop();
      }

      updateStateInfo(customizeIdleBeater);
    });
}

function main() {
  const idleBeater = initDefaultIdleBeater();
  idleBeater.start();

  const customizeIdleBeater = initCustomizeIdleBeater();

  console.log(
    'customizeIdleBeater State',
    customizeIdleBeater.getState(),
    'Config',
    customizeIdleBeater.getConfig(),
  );

  console.warn('Try to start idleBeater again without stopping it first');
  idleBeater.start(); // This should be a no-op since idleBeater is already running

  console.log(
    'idleBeat State',
    idleBeater.getState(),
    'Config',
    idleBeater.getConfig(),
  );

  initIdleBeaterSwitchWatch(idleBeater, customizeIdleBeater);

  updateStateInfo(idleBeater);
  updateStateInfo(customizeIdleBeater);
}

main();
