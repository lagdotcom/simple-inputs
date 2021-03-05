import GamepadInputHandler from './GamepadInputHandler';
import KeyInputHandler from './KeyInputHandler';
import MouseInputHandler from './MouseInputHandler';

type MoveDir = 'left' | 'up' | 'right' | 'down';

type MoveEvent = { type: 'move'; dir: MoveDir };
type PathEvent = { type: 'path'; x: number; y: number };
type ExamineEvent = { type: 'examine'; x: number; y: number };

type AnyEvent = ExamineEvent | MoveEvent | PathEvent;

function addCheckbox(
  label: string,
  handler: (checked: boolean) => void,
  value = true
) {
  const el = document.createElement('input');
  el.type = 'checkbox';
  el.checked = value;
  el.addEventListener('change', () => handler(el.checked));

  const outer = document.createElement('label');
  outer.innerText = label;
  outer.append(el);

  document.body.append(outer);
}

const move = (dir: MoveDir): MoveEvent => ({ type: 'move', dir });

window.addEventListener('load', () => {
  const box = document.getElementById('box');
  if (!box) return;

  const listener = (e: AnyEvent) =>
    (box.innerText = JSON.stringify(e) + '\n' + box.innerText);

  const simple = new KeyInputHandler<AnyEvent>(
    (e) => {
      if (e.code === 'ArrowLeft') return move('left');
      if (e.code === 'ArrowUp') return move('up');
      if (e.code === 'ArrowRight') return move('right');
      if (e.code === 'ArrowDown') return move('down');
    },
    listener,
    { events: ['keydown'] }
  );
  addCheckbox('SimpleKey', (ch) => (simple.enabled = ch), simple.enabled);

  const mouse = new MouseInputHandler<AnyEvent>(
    (e) => {
      const { button, x, y } = e;

      if (button === 0) return { type: 'path', x, y };
      if (button === 2) {
        e.preventDefault();
        return { type: 'examine', x, y };
      }
    },
    listener,
    { events: ['click', 'contextmenu'] }
  );
  addCheckbox('Mouse', (ch) => (mouse.enabled = ch), mouse.enabled);

  const pad = new GamepadInputHandler<AnyEvent>((e) => {
    switch (e.type) {
      case 'axis':
        if (e.axis === 0 && e.position === 'low') return move('left');
        if (e.axis === 0 && e.position === 'high') return move('right');
        if (e.axis === 1 && e.position === 'low') return move('up');
        if (e.axis === 1 && e.position === 'high') return move('down');
        break;

      case 'pressed':
        if (e.button === 12) return move('up');
        if (e.button === 13) return move('down');
        if (e.button === 14) return move('left');
        if (e.button === 15) return move('right');
        break;
    }
  }, listener);
  addCheckbox('Pad', (ch) => (pad.enabled = ch), pad.enabled);
});
