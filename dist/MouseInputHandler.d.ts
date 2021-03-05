import { SubType } from './utils';
declare type MouseEventName = keyof SubType<WindowEventMap, MouseEvent>;
interface MouseInputHandlerOptions {
    container?: HTMLElement;
    enabled?: boolean;
    events?: MouseEventName[];
}
export default class MouseInputHandler<T> {
    translator: (e: MouseEvent) => T | undefined;
    listener: (e: T) => void;
    enabled: boolean;
    constructor(translator: (e: MouseEvent) => T | undefined, listener: (e: T) => void, { container, events, enabled, }?: MouseInputHandlerOptions);
    handle(e: MouseEvent): void | false;
}
export {};
