/* eslint-disable import/prefer-default-export */

import type { Config } from './types';

export const DEFAULT_CONFIG: Required<Config> = {
  events: [
    'mousedown',
    'mousemove',
    'mouseup',

    'scroll',

    'touchstart',
    'touchmove',
    'touchend',

    'keydown',
    'keypress',

    'change',
    'orientationchange',
    'resize',
    'visibilitychange',
  ],

  beat: 5,

  debounce: 500,
};
