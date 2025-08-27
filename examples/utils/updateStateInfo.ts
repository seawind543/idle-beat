import type { IdleBeatType } from '../types';

function updateStateInfo(idleBeater: IdleBeatType) {
  const state = idleBeater.getState();
  const { id: instanceId } = idleBeater.getConfig();

  const output = document.getElementById(
    `${instanceId}-state`,
  ) as HTMLPreElement;
  output.textContent = JSON.stringify(state, null, 2);
}

export default updateStateInfo;
