import { SubType } from './utils';

type MouseEventName = keyof SubType<WindowEventMap, MouseEvent>;

interface MouseInputHandlerOptions {
  container?: HTMLElement;
  enabled?: boolean;
  events?: MouseEventName[];
}

export default class MouseInputHandler<T> {
  enabled: boolean;

  constructor(
    public translator: (e: MouseEvent) => T | undefined,
    public listener: (e: T) => void,
    {
      container = document.body,
      events = ['click', 'mousemove'],
      enabled = true,
    }: MouseInputHandlerOptions = {}
  ) {
    this.enabled = enabled;

    const handle = this.handle.bind(this);
    events.forEach((e) => container.addEventListener(e, handle));
  }

  handle(e: MouseEvent): void | false {
    if (!this.enabled) return;

    const result = this.translator(e);
    if (result) {
      this.listener(result);
      if (e.defaultPrevented) return false;
    }
  }
}
