type Milliseconds = number;
type Timestamp = number;
declare function requestInterval(callback: (time: Timestamp) => void, delay: Milliseconds): () => void;
export default requestInterval;
//# sourceMappingURL=requestInterval.d.ts.map