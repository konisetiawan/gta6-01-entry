import { CONFIG } from './config.js';

const palette = ['#df9b62', '#e2ba78', '#d98267', '#d8c58a', '#a6b995', '#c89576', '#b9a67d'];
export function buildCity(random) {
  const { worldWidth: w, worldHeight: h, grid: g, roadWidth: rw, sidewalk: sw } = CONFIG;
  const buildings = [], parks = [], trees = [], roads = [], sidewalks = [], docks = [];
  for (let x = 0; x <= w; x += g) roads.push({ x: x - rw / 2, y: 0, w: rw, h });
  for (let y = 0; y <= h; y += g) roads.push({ x: 0, y: y - rw / 2, w, h: rw });
  for (let x = 0; x < w; x += g) for (let y = 0; y < h; y += g) {
    const bx = x + rw / 2 + sw, by = y + rw / 2 + sw, bw = g - rw - sw * 2, bh = bw;
    sidewalks.push({ x: x + rw / 2, y: by - sw, w: bw, h: sw }, { x: x + rw / 2, y: by + bh, w: bw, h: sw }, { x: bx - sw, y: y + rw / 2, w: sw, h: bh }, { x: bx + bw, y: y + rw / 2, w: sw, h: bh });
    const beachZone = y > 3500 && x < 1400;
    const marinaZone = y > 3500 && x >= 1400 && x < 2800;
    if (random.next() < (beachZone || marinaZone ? .15 : .14)) {
      parks.push({ x: bx + 4, y: by + 4, w: bw - 8, h: bh - 8 });
      for (let i = 0; i < 7; i++) trees.push({ x: bx + 20 + random.next() * (bw - 40), y: by + 20 + random.next() * (bh - 40), r: 8 + random.next() * 8 });
      continue;
    }
    const count = random.nextInt(1, 3);
    for (let i = 0; i < count; i++) {
      const cols = count === 1 ? 1 : 2, rows = count === 3 ? 2 : 1;
      const cw = (bw - 22) / cols, ch = (bh - 22) / rows;
      const cx = bx + 11 + (i % cols) * cw, cy = by + 11 + Math.floor(i / cols) * ch;
      const inset = random.nextInt(0, 12);
      buildings.push({ x: cx + inset, y: cy + inset, w: cw - 10 - inset, h: ch - 10 - inset, color: random.pick(palette), height: random.nextInt(1, 5), roof: random.nextInt(0, 3), seed: random.next() });
    }
  }
  for (let i = 0; i < 8; i++) docks.push({ x: 1500 + i * 150, y: 3730 + (i % 2) * 42, w: 110, h: 300 });
  const districts = [
    { name: 'MARINA', x: 1400, y: 3350, w: 1400, h: 746 }, { name: 'DOWNTOWN', x: 1200, y: 600, w: 1700, h: 1300 },
    { name: 'OLD TOWN', x: 100, y: 1600, w: 1300, h: 1400 }, { name: 'NORTH HILLS', x: 600, y: 0, w: 2600, h: 800 }, { name: 'SOLMAR BEACH', x: 0, y: 3500, w: 1450, h: 596 },
  ];
  return { width: w, height: h, roads, sidewalks, buildings, parks, trees, docks, districts, beach: { x: 0, y: 3500, w: 1450, h: 596 }, water: { x: 1450, y: 3650, w: 2646, h: 446 } };
}
export function isRoad(x, y) { const r = CONFIG.roadWidth / 2; return Math.abs(((x + 128) % 256 + 256) % 256 - 128) < r || Math.abs(((y + 128) % 256 + 256) % 256 - 128) < r; }
export function isWater(x, y) { return y > 3650 && x > 1450; }
export function nearestRoad(x, y) { const g = CONFIG.grid; const rx = Math.round(x / g) * g, ry = Math.round(y / g) * g; return Math.abs(x - rx) < Math.abs(y - ry) ? { x: rx, y } : { x, y: ry }; }
export function randomRoadPoint(random) { const vertical = random.next() < .5, lane = random.nextInt(0, 16) * CONFIG.grid; return vertical ? { x: lane + (random.next() < .5 ? -18 : 18), y: random.next() * CONFIG.worldHeight } : { x: random.next() * CONFIG.worldWidth, y: lane + (random.next() < .5 ? -18 : 18) }; }
