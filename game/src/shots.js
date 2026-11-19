import { createRandom } from './random.js';
import { createGameState } from './game.js';
import { createCar } from './entities.js';
import { MISSIONS } from './missions.js';
export function stageShot(state, name, seed = 7) {
  const r = createRandom(seed); const fresh = createGameState(r); Object.assign(state, fresh); state.random = r; state.phase = name === 'start' ? 'title' : 'playing'; state.money = name === 'chase' ? 1250 : 875; state.wanted = name === 'chase' ? 3 : name === 'street' ? 1 : 0;
  state.player.health = 100; state.player.inCar = false; state.player.car = null; state.player.carKind = null; state.police = []; state.mission.active = false; state.toast = ''; state.toastTime = 0;
  if (name === 'start') { state.player.x = 2048; state.player.y = 1780; state.camera.x = 1408; state.camera.y = 1420; }
  if (name === 'chase') { state.player.x = 2040; state.player.y = 1880; const car = createCar('sport'); Object.assign(car, { x: state.player.x, y: state.player.y, angle: -.1, velocity: 315, stolen: true }); state.player.car = car; state.player.inCar = true; state.player.carKind = 'sport'; state.cars = state.cars.slice(0, 22); state.cars.push(car); state.police = []; for (let i = 0; i < 2; i++) { const c = createCar('police'); Object.assign(c, { x: 1780 - i * 95, y: 1960 + i * 25, angle: -.1, velocity: 220, siren: i + .4 }); state.police.push(c); } state.mission = { id: 5, stage: 1, waypoint: { x: 2220, y: 3900 }, active: true, distance: Math.round(Math.hypot(180, 2020)), timer: 0 }; state.completedMissions = 4; state.camera.x = state.player.x - 640; state.camera.y = state.player.y - 360; }
  if (name === 'street') { state.player.x = 2020; state.player.y = 3670; state.cars = state.cars.slice(0, 28); state.pedestrians = state.pedestrians.slice(0, 58); state.camera.x = state.player.x - 640; state.camera.y = state.player.y - 360; state.police = []; }
  if (name === 'mission') { state.player.x = 960; state.player.y = 2670; const car = createCar('sport'); Object.assign(car, { x: 1038, y: 2670, angle: .03, velocity: 0, parked: true }); state.cars = state.cars.slice(0, 26); state.cars.push(car); state.mission = { id: 2, stage: 0, waypoint: { x: 1038, y: 2670 }, active: true, distance: Math.round(Math.hypot(78, 0)), timer: 0 }; state.camera.x = state.player.x - 640; state.camera.y = state.player.y - 360; }
  return state;
}
