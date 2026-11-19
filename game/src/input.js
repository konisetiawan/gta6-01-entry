export function createInput(canvas = document.querySelector('canvas')) {
  const keys = new Set(), pressed = new Set(); let mouse = { x: 0, y: 0, clicked: false };
  const map = k => k === ' ' ? 'space' : k.toLowerCase();
  const down = e => { const k = map(e.key); if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault(); if (!keys.has(k)) pressed.add(k); keys.add(k); };
  const up = e => keys.delete(map(e.key));
  window.addEventListener('keydown', down, { passive: false }); window.addEventListener('keyup', up); window.addEventListener('blur', () => keys.clear());
  if (canvas) { canvas.addEventListener('pointermove', e => { const r = canvas.getBoundingClientRect(); mouse = { ...mouse, x: (e.clientX - r.left) * 1280 / r.width, y: (e.clientY - r.top) * 720 / r.height }; }); canvas.addEventListener('pointerdown', () => { mouse.clicked = true; }); }
  return { down: k => keys.has(k), justPressed: k => { const had = pressed.has(k); pressed.delete(k); return had; }, endFrame() { pressed.clear(); mouse.clicked = false; }, get mouse() { return mouse; }, dispose() { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); } };
}
