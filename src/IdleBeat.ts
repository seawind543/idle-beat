import _debounce from 'lodash/debounce';
import { DEFAULT_CONFIG } from './constants';
import type {
  Timestamp,
  Milliseconds,
  Seconds,
  Config,
  Callback,
  CallbackRecord,
  BeatCallback,
  ActiveCallback,
} from './types';

type State = {
  /**
   * Timestamp of the last happened active event
   */
  lastActive: Timestamp;

  /**
   * The last happened active event
   */
  lastEvent: Event | null;
};

class IdleBeat {
  #state: State;

  #settings: Required<Config>;

  #idleCallbackMaps: {
    [idleSetting: string]: Map<Callback, CallbackRecord>;
  };

  #beatTimeoutId: number;

  #beatCallbacks: Set<BeatCallback>;

  #activeCallbacks: Set<ActiveCallback>;

  constructor(options?: Config) {
    this.#settings = { ...DEFAULT_CONFIG, ...options };

    this.#state = IdleBeat.#getInitState();

    this.#idleCallbackMaps = {};

    this.#beatTimeoutId = -1;
    this.#beatCallbacks = new Set();

    this.#activeCallbacks = new Set();

    this.#debounceHandleActive = _debounce(
      this.#handleActive.bind(this),
      this.#settings.debounce,
      {
        leading: true,
      }
    );

    this.restart();
  }

  /** ****************
   * External methods
   **************** */

  restart() {
    // Reset the lastActive to now
    this.#state = IdleBeat.#getInitState();

    this.#resetTimers();

    this.#settings.events.forEach((eventType) => {
      document.removeEventListener(eventType, this.#debounceHandleActive, true);
      document.addEventListener(eventType, this.#debounceHandleActive, true);
    });
  }

  /**
   *
   * @param idleSetting Seconds
   * @param callback
   */
  onIdle(idleSetting: Seconds, callback: Callback) {
    // console.log('onIdle', idleSetting, callback);

    const timeoutString = `${idleSetting}`;
    this.#idleCallbackMaps[timeoutString] =
      this.#idleCallbackMaps[timeoutString] ?? new Map();

    // Return when the callback handler already been set
    if (this.#idleCallbackMaps[timeoutString].has(callback)) {
      return;
    }

    const calculatedTimeout = this.#getCalculatedTimeout(idleSetting);
    this.#idleCallbackMaps[timeoutString].set(callback, {
      timeoutId: this.#setTimeout(callback, calculatedTimeout, idleSetting),
    });
  }

  //
  /**
   * Remove the specific onIdle handler from the specific idleSetting
   * @param idleSetting
   * @param callback
   */
  offIdle(idleSetting: Seconds, callback: Callback) {
    // console.log('offIdle', idleSetting, callback);
    const callbackRecord = this.#idleCallbackMaps[idleSetting]?.get(callback);
    // clear previous timeout
    if (callbackRecord) {
      clearTimeout(callbackRecord?.timeoutId);
      this.#idleCallbackMaps[idleSetting]?.delete(callback);
    }

    // Remove idleSetting specific map for idleSetting that no
    // one is subscribed to avoid memory leak.
    if (this.#idleCallbackMaps[idleSetting]?.size === 0) {
      delete this.#idleCallbackMaps[idleSetting];
    }
  }

  onBeat(callback: BeatCallback) {
    if (this.#beatCallbacks.has(callback)) {
      return;
    }

    this.#beatCallbacks.add(callback);
  }

  offBeat(callback: BeatCallback) {
    this.#beatCallbacks.delete(callback);
  }

  onActive(callback: ActiveCallback) {
    if (this.#activeCallbacks.has(callback)) {
      return;
    }

    this.#activeCallbacks.add(callback);
  }

  offActive(callback: ActiveCallback) {
    this.#activeCallbacks.delete(callback);
  }

  /** **************
   * External Getters
   *************** */

  /**
   * This function returns a copy of the private state object to avoid mutation.
   * @returns A copy of the private state object using the spread operator to avoid mutation.
   */
  get state() {
    // Take spread (...) to avoid mutate
    return { ...this.#state };
  }

  /**
   * This function returns the amount of time in milliseconds since the last activity.
   * @returns The `idleTime` method is returning the number of milliseconds that have elapsed since the
   * last time the user was active. It does this by subtracting the `lastActive` timestamp (stored in the
   * `state` object) from the current timestamp (obtained using `new Date()`).
   */
  get idleTime(): Milliseconds {
    return +new Date() - this.#state.lastActive;
  }

  /** ****************
   * Internal utils
   **************** */
  static #getInitState(): State {
    return {
      lastActive: +new Date(),
      lastEvent: null,
    };
  }

  #handleActive(e: Event) {
    // update the lastActive
    this.#state = {
      // The `timeStamp` in `e` is not what we want in Chrome
      // https://developer.chrome.com/blog/high-res-timestamps/
      lastActive: +new Date(),
      lastEvent: e,
    };
    this.#resetTimers();

    this.#activeCallbacks.forEach((callback) => callback(e));
  }

  #debounceHandleActive: (e: Event) => void;

  #handleOnIdle(callback: Callback, idleSetting: Seconds) {
    // console.log('handleOnIdle');

    callback(this.idleTime, idleSetting);
  }

  #setTimeout(
    callback: Callback,
    calculatedTimeout: Milliseconds,
    idleSetting: Seconds
  ): number {
    return window.setTimeout(
      () => this.#handleOnIdle(callback, idleSetting),
      calculatedTimeout
    );
  }

  #handleBeat(lastActive: Timestamp) {
    this.#beatCallbacks.forEach((callback) => {
      if (lastActive !== this.#state.lastActive) {
        // Has active before timeout!
        return;
      }

      callback(this.idleTime);
    });
  }

  #getCalculatedTimeout(idleSetting: Seconds): Milliseconds {
    const calculatedTimeout = idleSetting * 1e3 - this.idleTime;
    return calculatedTimeout;
  }

  #resetTimers() {
    Object.keys(this.#idleCallbackMaps).forEach((timeoutString) => {
      const timeoutCallbackMap = this.#idleCallbackMaps[timeoutString] as Map<
        Callback,
        CallbackRecord
      >;

      const idleSetting = +timeoutString;
      timeoutCallbackMap.forEach((callbackRecord, callback) => {
        clearTimeout(callbackRecord.timeoutId);
        const calculatedTimeout = this.#getCalculatedTimeout(idleSetting);
        timeoutCallbackMap.set(callback, {
          timeoutId: this.#setTimeout(callback, calculatedTimeout, idleSetting),
        });
      });
    });

    // Handle beat
    clearInterval(this.#beatTimeoutId);
    this.#beatTimeoutId = window.setInterval(
      () => this.#handleBeat(this.#state.lastActive),
      this.#settings.beat * 1e3
    );
  }
}

export default IdleBeat;
