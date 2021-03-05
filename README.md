# Simple Inputs

An input handling library aimed at HTML/JS games.

## Installation

```sh
npm i git+https://github.com/lagdotcom/simple-inputs.git
```

## Use

All three input handling classes follow the same pattern:

```ts
type Event = { ... };

new GamepadInputHandler<Event>(translator, listener, options);
new KeyInputHandler<Event>(translator, listener, options);
new MouseInputHandler<Event>(translator, listener, options);
```

For more information, see `src/demo.ts`.
