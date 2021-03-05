import { SubType } from './utils';

type KeyEventName = keyof SubType<WindowEventMap, KeyboardEvent>;

interface KeyInputHandlerOptions {
  container?: HTMLElement;
  enabled?: boolean;
  events?: KeyEventName[];
}

export default class KeyInputHandler<T> {
  enabled: boolean;

  constructor(
    public translator: (e: KeyboardEvent) => T | undefined,
    public listener: (e: T) => void,
    {
      container = document.body,
      events = ['keydown', 'keypress', 'keyup'],
      enabled = true,
    }: KeyInputHandlerOptions = {}
  ) {
    this.enabled = enabled;

    const handle = this.handle.bind(this);
    events.forEach((e) => container.addEventListener(e, handle));
  }

  handle(e: KeyboardEvent): void | false {
    if (!this.enabled) return;

    const result = this.translator(e);
    if (result) {
      this.listener(result);
      if (e.defaultPrevented) return false;
    }
  }
}
