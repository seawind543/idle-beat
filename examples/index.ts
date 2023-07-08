import IdleBeat from '../src/index';

const intlNumberFormat = new Intl.NumberFormat("en-US");

const idleBeat = new IdleBeat({
  beat: 10
});

const idleBeat2 = new IdleBeat({
  events: ['keydown'],
});

function getBoardElement(infoBoardId: string, boardContainerId: string) {
  let infoBoard = document.getElementById(infoBoardId);
  
  if (!infoBoard) {
    let boardContainer = document.getElementById(boardContainerId);
    if(!boardContainer) {
      boardContainer = document.createElement('div');
      boardContainer.setAttribute('id', boardContainerId);
      document.getElementById('info')?.append(boardContainer);
    }

    infoBoard = document.createElement('div');
    infoBoard.setAttribute('id', infoBoardId);
    boardContainer.append(infoBoard);
  }

  return infoBoard;
}

function showInfo(
  boardContainerId: string,
  infoBoardId: string,
  ...args: string[]
) {
  let html = '';
  args.forEach(arg => {
    html +=  `<div>${arg}</div>`;
  });
  html += '<br />';

  getBoardElement(infoBoardId, boardContainerId).innerHTML = html;
}

function setInnerText(elmId: string, text: string) {
  const targetEl = document.getElementById(elmId);
  if (targetEl) {
    targetEl.innerText = text;
  }
}

function updateIdleInfo(
  callbackName: string, 
  passedTime: number, // Milliseconds, 
  idleSetting: number, //Seconds
) {
  const { 
    lastActive, 
    lastEvent,
  } = idleBeat.state;
  
  
  showInfo(
    callbackName,
    `${callbackName}_${idleSetting}`, 
    `Callback <strong>${callbackName}</strong> on idle setting: <strong>${intlNumberFormat.format(idleSetting)} Seconds</strong>`,
    `<strong>Lasted active</strong>: ${new Date(lastActive)}; Timestamp: ${lastActive}`,
    `<strong>Lasted event</strong>: ${lastEvent ? lastEvent.type : null}`,
    `<strong>Idle time</strong>: ${intlNumberFormat.format(passedTime)} Milliseconds;`
  );
}

function handleIdleBeat(idleTime: number /* Milliseconds */) {
  const { 
    lastActive, 
    lastEvent,
  } = idleBeat.state;

  setInnerText('beat_lasted_active', `${new Date(lastActive)}; Timestamp: ${lastActive};`);
  setInnerText('beat_lasted_event', `${lastEvent ? lastEvent.type : null}`);
  setInnerText('beat_idle_time',`${intlNumberFormat.format(idleTime)} Milliseconds; onBeat`);
}

function handleIdle(idleTime: number /* Milliseconds */, idleSetting: number /* Seconds */) {
  updateIdleInfo('handleIdle', idleTime, idleSetting);
}

function handleIdle2(idleTime: number /* Milliseconds */, idleSetting: number /* Seconds */) {
  updateIdleInfo('handleIdle2', idleTime, idleSetting);
}

function main() {

  idleBeat.onIdle(10, handleIdle);
  // Set the same handler to the same idle-time will be ignore
  idleBeat.onIdle(10, handleIdle);

  // Set the same handler to another idle-time will be accept
  idleBeat.onIdle(6, handleIdle);

  // Set different handler to the same idle-time will be accept
  idleBeat.onIdle(10, handleIdle2);

  // Set idle beat handler
  idleBeat.onBeat(handleIdleBeat);

  // Set to different idleBeat instance will be accept
  idleBeat2.onIdle(10, handleIdle2);
}

main();
