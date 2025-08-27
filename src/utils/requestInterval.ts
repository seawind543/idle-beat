import type { Timestamp, Milliseconds } from '../types';

/**
 * Implement setInterval via window.requestAnimationFrame
 *
 * Usage
 * ```ts
 * const stop = requestInterval(() => {
 *   console.log('Hello');
 * }, 1000);
 *
 * // Stop the interval after 5 seconds
 * setTimeout(() => {
 *   stop();
 * }, 5000);
 * ```
 */
function requestInterval(
  callback: (time: Timestamp) => void,
  delay: Milliseconds,
): () => void {
  let start = Date.now();
  let handle: number | null = null;

  const interval = () => {
    const current = Date.now();
    const elapsed = current - start;

    if (elapsed >= delay) {
      callback(current);
      start = Date.now();
    }

    handle = requestAnimationFrame(interval);
  };

  handle = requestAnimationFrame(interval);

  return () => {
    if (handle) {
      cancelAnimationFrame(handle);
    }
  };
}

export default requestInterval;
