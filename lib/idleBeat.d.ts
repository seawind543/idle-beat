import type { State, Config } from './types';
type GetConfig = () => Required<Config>;
type SetConfig = (newConfig: Config) => void;
type GetState = () => State;
declare function idleBeat(options?: Config): {
    getState: GetState;
    getConfig: GetConfig;
    setConfig: SetConfig;
    start: () => void;
    stop: () => void;
};
export default idleBeat;
//# sourceMappingURL=idleBeat.d.ts.map