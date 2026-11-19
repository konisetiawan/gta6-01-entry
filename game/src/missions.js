import { CONFIG } from './config.js';
export const MISSIONS = [
  { id: 1, title: 'First Fare', giver: 'Mama Rosa', briefing: 'Take Rosa’s sealed package down to the marina. Keep the car clean and the route quiet.', objectives: ['Drive the package to the marina waypoint'], waypoint: { x: 1950, y: 3870 }, reward: 300 },
  { id: 2, title: 'Hot Wheels', giver: 'Mama Rosa', briefing: 'A red sport coupe is parked in Old Town. Bring it back to the garage in one piece.', objectives: ['Steal a sport car', 'Deliver it to the garage'], waypoint: { x: 1050, y: 2400 }, garage: { x: 560, y: 2740 }, reward: 550 },
  { id: 3, title: 'Payback Time', giver: 'Mama Rosa', briefing: 'The crew is watching. Shake the patrols at two stars, then get home to the safehouse.', objectives: ['Lose a 2-star wanted level', 'Reach the safehouse'], waypoint: { x: 3180, y: 900 }, reward: 750 },
  { id: 4, title: 'Beach Run', giver: 'Mama Rosa', briefing: 'A cooler needs to cross the city before the ice melts. The clock is already running.', objectives: ['Make the timed delivery at Solmar Beach'], waypoint: { x: 580, y: 3710 }, reward: 950, time: 100 },
  { id: 5, title: 'The Big Score', giver: 'Mama Rosa', briefing: 'Crack the Downtown vault, then outrun a three-star response to the marina boat.', objectives: ['Rob the Downtown bank vault', 'Escape at the marina boat'], waypoint: { x: 2300, y: 1550 }, boat: { x: 2220, y: 3900 }, reward: 1800 },
];
export function updateMissions(state, dt) {
  const m = state.mission; if (!m || m.complete || state.phase !== 'playing') return;
  const def = MISSIONS[m.id - 1]; const p = state.player;
  if (def.time && m.stage === 0) { m.timer -= dt; if (m.timer <= 0) { m.failed = true; state.toast = 'DELIVERY MISSED'; m.active = false; return; } }
  const d = Math.hypot(p.x - m.waypoint.x, p.y - m.waypoint.y); m.distance = Math.round(d);
  if (m.id === 2 && m.stage === 0 && p.inCar && p.carKind === 'sport') { m.stage = 1; m.waypoint = { ...def.garage }; state.toast = 'SPORT CAR SECURED — TAKE IT TO THE GARAGE'; }
  if (m.id === 3 && m.stage === 0 && state.wanted === 0) { m.stage = 1; state.toast = 'PATROLS LOST — SAFEHOUSE'; }
  if (m.id === 5 && m.stage === 0 && d < 100) { m.stage = 1; state.wanted = Math.max(3, state.wanted); m.waypoint = { ...def.boat }; state.toast = 'VAULT HIT — GET TO THE BOAT'; }
  if (m.id === 5 && m.stage === 1) state.wanted = Math.max(3, state.wanted);
  if (d < 92 && (m.id !== 2 || m.stage === 1) && (m.id !== 3 || m.stage === 1) && (m.id !== 5 || m.stage === 1)) {
    if (m.id === 3 && state.wanted > 0) return; if (m.id === 5 && state.wanted < 3) return;
    m.complete = true; m.active = false; state.money += def.reward; state.toast = `${def.title.toUpperCase()} COMPLETE  +${def.reward} SOL`; state.completedMissions = Math.max(state.completedMissions, m.id);
    if (m.id === MISSIONS.length) { state.money += 1500; state.phase = 'complete'; state.toast = 'SOLMAR STORY COMPLETE  +1500 SOL'; }
    else { const next = MISSIONS[m.id]; state.mission = { id: m.id + 1, stage: 0, waypoint: { ...next.waypoint }, active: true, distance: 0, timer: next.time || 0 }; if (next.id === 3) state.wanted = Math.max(2, state.wanted); }
  }
}
export function startMission(state) { if (!state.mission || state.mission.active || state.mission.complete) return; const def = MISSIONS[state.mission.id - 1]; state.mission.active = true; state.mission.timer = def.time || 0; state.toast = `${def.title.toUpperCase()} — ${def.objectives[0].toUpperCase()}`; if (state.mission.id === 3) state.wanted = Math.max(2, state.wanted); }
