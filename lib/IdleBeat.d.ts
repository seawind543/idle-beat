import type { Milliseconds, Seconds, Config, Callback, BeatCallback } from './types';
declare class IdleBeat {
    #private;
    constructor(options?: Config);
    restart(): void;
    onIdle(idleSetting: Seconds, callback: Callback): void;
    offIdle(idleSetting: Seconds, callback: Callback): void;
    onBeat(callback: BeatCallback): void;
    offBeat(callback: BeatCallback): void;
    get state(): {
        lastActive: number;
        lastEvent: Event | null;
    };
    get idleTime(): Milliseconds;
}
export default IdleBeat;
//# sourceMappingURL=IdleBeat.d.ts.map