import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { mkdir, stat, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire('/home/hatch/workspace/makefun/shot-tools/package.json');
const { chromium } = require('playwright-core');
const server = spawn('node', ['serve.ts', '--port', '8901'], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
let browser;
try {
  let ready = false;
  for (let i = 0; i < 50; i++) { try { const r = await fetch('http://localhost:8901/'); if (r.ok) { ready = true; break; } } catch {} await delay(100); }
  if (!ready) throw new Error('Local game server did not start');
  const shots = JSON.parse(await readFile(path.join(root, 'shots.json'), 'utf8'));
  await mkdir(path.join(root, 'screenshots'), { recursive: true });
  browser = await chromium.launch({ headless: true, executablePath: '/home/hatch/workspace/makefun/shot-tools/chrome-linux64/chrome', args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => { throw e; });
  for (const shot of shots) { const file = path.join(root, 'screenshots', shot.name); await page.goto(`http://localhost:8901/${shot.query}`, { waitUntil: 'networkidle' }); await page.waitForTimeout(1200); await page.screenshot({ path: file, type: 'jpeg', quality: 80 }); const bytes = (await stat(file)).size; console.log(`${shot.name}: ${bytes} bytes`); if (bytes > 256 * 1024) throw new Error(`${shot.name} exceeds 256 KiB`); }
} finally { await browser?.close(); server.kill('SIGTERM'); }
