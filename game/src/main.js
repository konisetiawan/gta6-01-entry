import { CONFIG } from './config.js';
import { createRandom } from './random.js';
import { createGameState, updateGame, loadGame } from './game.js';
import { renderGame } from './render.js';
import { createInput } from './input.js';
import { createAudio } from './audio.js';
import { stageShot } from './shots.js';

const canvas = document.querySelector('#game'); const ctx = canvas.getContext('2d'); const input = createInput(canvas); const audio = createAudio();
const url = new URL(location.href), shot = url.searchParams.get('shot'), seed = Number(url.searchParams.get('seed') || 7);
const state = createGameState(createRandom(seed));
let running = true;
function resize() { const ratio = Math.min(window.devicePixelRatio || 1, 2); canvas.width = CONFIG.width * ratio; canvas.height = CONFIG.height * ratio; canvas.style.width = `${Math.min(innerWidth, innerHeight * 16 / 9)}px`; canvas.style.height = `${Math.min(innerHeight, innerWidth * 9 / 16)}px`; ctx.setTransform(ratio, 0, 0, ratio, 0, 0); }
window.addEventListener('resize', resize); resize();
if (shot) { stageShot(state, shot, seed); for (let i = 0; i < 3; i++) updateGame(state, { justPressed: () => false, down: () => false }, 1 / 60); renderGame(ctx, state); }
else {
  loadGame(state);
  let last = performance.now(), accumulator = 0; const step = 1 / 60;
  function frame(now) { if (!running) return; accumulator += Math.min(.1, (now - last) / 1000); last = now; while (accumulator >= step) { updateGame(state, input, step); audio.setMuted(state.muted); audio.update(state); input.endFrame(); accumulator -= step; } renderGame(ctx, state); requestAnimationFrame(frame); }
  requestAnimationFrame(frame);
}
window.addEventListener('pagehide', () => { running = false; input.dispose(); });
