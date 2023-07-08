export type Timestamp = number;
export type Milliseconds = number;
export type Seconds = number;
export interface Config {
    events?: Event['type'][];
    beat?: Seconds;
    debounce?: Milliseconds;
}
export interface Callback {
    (idleTime: Milliseconds, idleSetting: Seconds): void;
}
export interface CallbackRecord {
    timeoutId: number;
}
export interface BeatCallback {
    (idleTime: Milliseconds): void;
}
//# sourceMappingURL=types.d.ts.map