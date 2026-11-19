import {CONFIG} from './config.js';
const R=CONFIG.ROAD, S=CONFIG.BLOCK, W=CONFIG.WORLD;
export const districts=[{name:'Marina',x:0,y:2900,w:4096,h:1196},{name:'Downtown',x:1100,y:1100,w:1800,h:1500},{name:'Old Town',x:0,y:900,w:1100,h:1900},{name:'North Hills',x:700,y:0,w:3000,h:1000},{name:'Solmar Beach',x:0,y:3400,w:2100,h:696}];
export function isRoad(x,y){return ((x%S+S)%S)<R||((y%S+S)%S)<R}
export function isWater(x,y){return y>3860&&x>1750}
export function nearestRoad(x,y){const snap=v=>Math.round(v/S)*S+R/2;return{x:snap(x),y:snap(y)}}
export function randomRoadPoint(r){const vertical=r.next()<.5;return vertical?{x:r.nextInt(0,15)*S+R/2,y:r.nextInt(0,15)*S+R/2}:{x:r.nextInt(0,15)*S+R/2,y:r.nextInt(0,15)*S+R/2}}
export function buildCity(random){const buildings=[],parks=[],docks=[];const palettes=['#df9f72','#d6bd91','#b77763','#e3c88f','#a7b08a','#c9d3c4'];for(let gx=0;gx<16;gx++)for(let gy=0;gy<16;gy++){let x=gx*S+R+12,y=gy*S+R+12,w=S-R-24,h=S-R-24;if(gy>13&&gx>5){if(random.next()<.8)docks.push({x:gx*S+R,y:gy*S+R,w:S-R,h:random.nextInt(20,44)});continue}if(random.next()<.11){parks.push({x,y,w,h,trees:Array.from({length:random.nextInt(4,10)},()=>({x:x+random.nextInt(14,w-14),y:y+random.nextInt(14,h-14),r:random.nextInt(7,13)}))});continue}const n=random.nextInt(1,3);for(let i=0;i<n;i++){const bw=Math.floor(w/n)-12,bh=random.nextInt(88,h-12),bx=x+i*(w/n)+6,by=y+random.nextInt(0,h-bh);buildings.push({x:bx,y:by,w:bw,h:bh,color:random.pick(palettes),roof:random.pick(['flat','tank','garden']),height:random.nextInt(1,9)})}}return{buildings,parks,docks,districts}}
