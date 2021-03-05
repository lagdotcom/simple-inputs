declare type AxisPosition = 'high' | 'low' | 'neutral';
interface ButtonEvent {
    type: 'pressed' | 'released';
    pad: number;
    button: number;
}
interface AxisEvent {
    type: 'axis';
    pad: number;
    axis: number;
    position: AxisPosition;
}
declare type PadEvent = AxisEvent | ButtonEvent;
declare type PadEventName = PadEvent['type'];
interface GamepadInputHandlerArgs {
    container?: Window;
    enabled?: boolean;
    events?: PadEventName[];
    resolution?: number;
    threshold?: number;
}
export default class GamepadInputHandler<T> {
    translator: (e: PadEvent) => T | undefined;
    listener: (e: T) => void;
    private activePads;
    private interval?;
    private running;
    private statuses;
    events: PadEventName[];
    resolution: number;
    threshold: number;
    constructor(translator: (e: PadEvent) => T | undefined, listener: (e: T) => void, { container, enabled, events, resolution, threshold, }?: GamepadInputHandlerArgs);
    get enabled(): boolean;
    set enabled(value: boolean);
    private start;
    private stop;
    private tick;
    private resolve;
    handle(e: PadEvent): void;
}
export {};
