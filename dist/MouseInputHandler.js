"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MouseInputHandler {
    constructor(translator, listener, { container = document.body, events = ['click', 'mousemove'], enabled = true, } = {}) {
        this.translator = translator;
        this.listener = listener;
        this.enabled = enabled;
        const handle = this.handle.bind(this);
        events.forEach((e) => container.addEventListener(e, handle));
    }
    handle(e) {
        if (!this.enabled)
            return;
        const result = this.translator(e);
        if (result) {
            this.listener(result);
            if (e.defaultPrevented)
                return false;
        }
    }
}
exports.default = MouseInputHandler;
