/* eslint no-console: 0 */

import updateStateInfo from './utils/updateStateInfo';
import applyCustomizeSettings from './utils/applyCustomizeSettings';
import type { IdleBeatType } from './types';

/**
 * Initialize the idleBeater switch watch
 * This will bind the event listeners to the toggle switches
 * to start or stop the idleBeater instances.
 *
 * @param idleBeater - The default idleBeater instance
 * @param customizeIdleBeater - The customized idleBeater instance
 */
function initIdleBeaterSwitchWatcher(
  idleBeater: IdleBeatType,
  customizeIdleBeater: IdleBeatType,
) {
  const defaultIdleBeaterSwitch = document.getElementById(
    'default--idle-beat-toggle',
  ) as HTMLInputElement;
  defaultIdleBeaterSwitch.checked = idleBeater.getState().isBeating;

  // Bind the toggle switch for the default idleBeater
  // This will start or stop the idleBeater instance based on the toggle state
  defaultIdleBeaterSwitch.addEventListener('change', (e) => {
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

  const customizedIdleBeaterSwitch = document.getElementById(
    'customized--idle-beat-toggle',
  ) as HTMLInputElement;
  customizedIdleBeaterSwitch.checked = customizeIdleBeater.getState().isBeating;

  // Bind the toggle switch for the customized idleBeater
  // This will start or stop the customizeIdleBeater instance based on the toggle state
  customizedIdleBeaterSwitch?.addEventListener('change', (e) => {
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

export default initIdleBeaterSwitchWatcher;
