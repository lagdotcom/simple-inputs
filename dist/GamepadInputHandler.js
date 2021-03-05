"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: repeat presses
class GamepadInputHandler {
    constructor(translator, listener, { container = window, enabled = true, events = ['axis', 'pressed', 'released'], resolution = 100, threshold = 0.9, } = {}) {
        this.translator = translator;
        this.listener = listener;
        container.addEventListener('gamepadconnected', (e) => {
            const pad = e.gamepad;
            const status = { axes: [], buttons: [] };
            for (let i = 0; i < pad.axes.length; i++)
                status.axes.push('neutral');
            for (let i = 0; i < pad.buttons.length; i++)
                status.buttons.push(false);
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
    get enabled() {
        return this.running;
    }
    set enabled(value) {
        if (this.running && !value) {
            this.stop();
        }
        else if (!this.running && value) {
            this.start();
        }
        this.running = value;
    }
    start() {
        this.interval = setInterval(this.tick, this.resolution);
    }
    stop() {
        if (this.interval)
            clearInterval(this.interval);
    }
    tick() {
        if (this.activePads < 1)
            return;
        const pads = navigator.getGamepads();
        for (let pad = 0; pad < pads.length; pad++) {
            const g = pads[pad];
            if (g === null)
                continue;
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
    resolve(position) {
        if (position > this.threshold)
            return 'high';
        if (position < -this.threshold)
            return 'low';
        return 'neutral';
    }
    handle(e) {
        if (this.enabled && this.events.includes(e.type)) {
            const result = this.translator(e);
            if (result)
                this.listener(result);
        }
    }
}
exports.default = GamepadInputHandler;
