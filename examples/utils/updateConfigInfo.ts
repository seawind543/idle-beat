import type { IdleBeatType } from '../types';

function updateCustomizeConfigInfo(customizeIdleBeater: IdleBeatType) {
  const config = customizeIdleBeater.getConfig();

  const instanceIdInput = document.getElementById('cfg-id') as HTMLInputElement;
  instanceIdInput.value = config.id;

  const idleEventNameInput = document.getElementById(
    'cfg-idle-event-name',
  ) as HTMLInputElement;
  idleEventNameInput.value = config.idleEventName;

  const activeEventNameInput = document.getElementById(
    'cfg-active-event-name',
  ) as HTMLInputElement;
  activeEventNameInput.value = config.activeEventName;

  const beatInput = document.getElementById('cfg-beat') as HTMLInputElement;
  beatInput.value = config.beat.toString();

  const eventsInput = document.getElementById(
    'cfg-events',
  ) as HTMLTextAreaElement;
  eventsInput.value = JSON.stringify(config.events, null, 2);
}

function updateConfigInfo(idleBeater: IdleBeatType) {
  const config = idleBeater.getConfig();
  const { id: instanceId } = idleBeater.getConfig();

  if (instanceId === 'default') {
    const output = document.getElementById(
      `${instanceId}-config`,
    ) as HTMLPreElement;
    output.textContent = JSON.stringify(config, null, 2);
  } else if (instanceId === 'customized') {
    updateCustomizeConfigInfo(idleBeater);
  }
}

export default updateConfigInfo;
