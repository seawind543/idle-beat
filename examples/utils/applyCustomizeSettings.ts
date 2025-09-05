/* eslint no-console: 0 */

import type { IdleBeatType } from '../types';

function applyCustomizeSettings(customizeIdleBeater: IdleBeatType) {
  const beatInput = document.getElementById('cfg-beat') as HTMLInputElement;
  const eventsInput = document.getElementById(
    'cfg-events',
  ) as HTMLTextAreaElement;

  const newConfig = customizeIdleBeater.getConfig();

  newConfig.beat = parseInt(beatInput.value, 10) ?? newConfig.beat;

  if (eventsInput.value) {
    try {
      const parsed = JSON.parse(eventsInput.value);
      if (Array.isArray(parsed)) {
        newConfig.events = parsed;
      }
    } catch (e) {
      console.warn('Events input not valid JSON', e);
    }
  }

  customizeIdleBeater.setConfig(newConfig);
}

export default applyCustomizeSettings;
