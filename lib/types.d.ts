type Timestamp = number;
type Seconds = number;
export interface State {
    lastActive: Timestamp;
    lastEventType: Event['type'] | null;
    isIdle: boolean;
    isBeating: boolean;
}
export interface Config {
    id?: string;
    idleEventName?: string;
    activeEventName?: string;
    beat?: Seconds;
    target?: EventTarget;
    events?: Event['type'][];
}
export type IdleBeatEvent = CustomEvent<{
    state: State;
    config: Required<Config>;
}>;
export {};
//# sourceMappingURL=types.d.ts.map