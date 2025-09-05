/* eslint no-console: 0 */

// import styles
import './styles/main.css';
import './styles/switch.css';

import initDefaultIdleBeater from './initDefaultIdleBeater';
import initCustomizeIdleBeater from './initCustomizeIdleBeater';
import initIdleBeaterSwitchWatcher from './initIdleBeaterSwitchWatcher';

import updateStateInfo from './utils/updateStateInfo';

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

  initIdleBeaterSwitchWatcher(idleBeater, customizeIdleBeater);

  updateStateInfo(idleBeater);
  updateStateInfo(customizeIdleBeater);
}

main();
