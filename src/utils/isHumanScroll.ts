const SCROLL_ATTENDANCE_TIMEOUT = 200;

let lastHumanScroll = 0;

['wheel', 'touchstart', 'keydown'].forEach((e) => {
  window.addEventListener(
    e,
    () => {
      lastHumanScroll = Date.now();
    },
    true,
  );
});

const isHumanScroll = (event?: Event) => {
  return (
    event?.type === 'scroll' &&
    Date.now() - lastHumanScroll < SCROLL_ATTENDANCE_TIMEOUT
  );
};

export default isHumanScroll;
