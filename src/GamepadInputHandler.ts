type AxisPosition = 'high' | 'low' | 'neutral';

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
type PadEvent = AxisEvent | ButtonEvent;
type PadEventName = PadEvent['type'];

interface PadStatus {
  axes: AxisPosition[];
  buttons: boolean[];
}

interface GamepadInputHandlerArgs {
  container?: Window;
  enabled?: boolean;
  events?: PadEventName[];
  resolution?: number;
  threshold?: number;
}

// TODO: repeat presses
export default class GamepadInputHandler<T> {
  private activePads: number;
  private interval?: ReturnType<typeof setInterval>;
  private running: boolean;
  private statuses: Record<number, PadStatus>;

  events: PadEventName[];
  resolution: number;
  threshold: number;

  constructor(
    public translator: (e: PadEvent) => T | undefined,
    public listener: (e: T) => void,
    {
      container = window,
      enabled = true,
      events = ['axis', 'pressed', 'released'],
      resolution = 100,
      threshold = 0.9,
    }: GamepadInputHandlerArgs = {}
  ) {
    container.addEventListener('gamepadconnected', (e) => {
      const pad = e.gamepad;
      const status: PadStatus = { axes: [], buttons: [] };
      for (let i = 0; i < pad.axes.length; i++) status.axes.push('neutral');
      for (let i = 0; i < pad.buttons.length; i++) status.buttons.push(false);

      this.statuses[pad.index] = status;
      this.activePads++;
    });
    container.addEventListener('gamepaddisconnected', (e) => {
      delete this.statuses[e.gamepad.index];
      this.activePads--;
    });

    this.tick = this.tick.bind(this);
    this.activePads = 0;
    this.statuses = {};
    this.events = events;
    this.resolution = resolution;
    this.threshold = threshold;
    this.running = false;
    this.enabled = enabled;
  }

  get enabled(): boolean {
    return this.running;
  }

  set enabled(value: boolean) {
    if (this.running && !value) {
      this.stop();
    } else if (!this.running && value) {
      this.start();
    }

    this.running = value;
  }

  private start() {
    this.interval = setInterval(this.tick, this.resolution);
  }

  private stop() {
    if (this.interval) clearInterval(this.interval);
  }

  private tick() {
    if (this.activePads < 1) return;

    const pads = navigator.getGamepads();
    for (let pad = 0; pad < pads.length; pad++) {
      const g = pads[pad];
      if (g === null) continue;

      const status = this.statuses[pad];

      for (let axis = 0; axis < g.axes.length; axis++) {
        const position = this.resolve(g.axes[axis]);
        if (status.axes[axis] !== position) {
          this.handle({ type: 'axis', pad, axis, position });
          status.axes[axis] = position;
        }
      }

      for (let button = 0; button < g.buttons.length; button++) {
        const pressed = g.buttons[button].pressed;
        if (status.buttons[button] !== pressed) {
          const type = pressed ? 'pressed' : 'released';
          this.handle({ type, pad, button });
          status.buttons[button] = pressed;
        }
      }
    }
  }

  private resolve(position: number): AxisPosition {
    if (position > this.threshold) return 'high';
    if (position < -this.threshold) return 'low';
    return 'neutral';
  }

  handle(e: PadEvent): void {
    if (this.enabled && this.events.includes(e.type)) {
      const result = this.translator(e);
      if (result) this.listener(result);
    }
  }
}
