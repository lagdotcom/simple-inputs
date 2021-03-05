import { SubType } from './utils';
declare type KeyEventName = keyof SubType<WindowEventMap, KeyboardEvent>;
interface KeyInputHandlerOptions {
    container?: HTMLElement;
    enabled?: boolean;
    events?: KeyEventName[];
}
export default class KeyInputHandler<T> {
    translator: (e: KeyboardEvent) => T | undefined;
    listener: (e: T) => void;
    enabled: boolean;
    constructor(translator: (e: KeyboardEvent) => T | undefined, listener: (e: T) => void, { container, events, enabled, }?: KeyInputHandlerOptions);
    handle(e: KeyboardEvent): void | false;
}
export {};
