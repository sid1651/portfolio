/**
 * Seeded PRNG (mulberry32).
 *
 * Scattered geometry — particle fields, node placement — has to be
 * identical on every render: `Math.random` would reshuffle the whole
 * field whenever a component happens to re-render (a theme switch, a
 * resize), which reads as a glitch.
 */
export function createRng(seed: number) {
  let t = seed >>> 0;

  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
