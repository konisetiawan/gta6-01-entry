export function createRandom(seed = 1) {
  let a = Number(seed) >>> 0;
  if (!a) a = 0x6d2b79f5;
  return {
    next() { a |= 0; a = a + 0x6d2b79f5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t ^= t + Math.imul(t ^ t >>> 7, 61 | t); return ((t ^ t >>> 14) >>> 0) / 4294967296; },
    nextInt(min, max) { return Math.floor(this.next() * (max - min + 1)) + min; },
    pick(array) { return array[Math.floor(this.next() * array.length)]; },
  };
}
