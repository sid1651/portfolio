/* ============================================================
   3D CAPABILITIES — Progressive Enhancement Gate
   ------------------------------------------------------------
   The WebGL layer is purely decorative, so it must never be a
   requirement. This module decides how much (if any) 3D a given
   device should render.
   ============================================================ */

export type Quality = 'high' | 'medium' | 'off';

/** Cached WebGL probe — creating a context is not free. */
let webglSupport: boolean | null = null;

function hasWebGL(): boolean {
  if (webglSupport !== null) return webglSupport;

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl');
    webglSupport = Boolean(gl);
  } catch {
    webglSupport = false;
  }

  return webglSupport;
}

interface NavigatorWithHints extends Navigator {
  deviceMemory?: number;
}

/**
 * `high`   — full scene: refractive glass, transmission, dense particles
 * `medium` — same composition, cheaper materials and fewer objects
 * `off`    — no WebGL at all; the CSS fallback shapes stay visible
 */
export function detectQuality(): Quality {
  if (typeof window === 'undefined') return 'off';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'off';
  if (!hasWebGL()) return 'off';

  const nav = navigator as NavigatorWithHints;
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.innerWidth < 900;

  if (coarsePointer || narrow || cores <= 4 || memory <= 4) return 'medium';
  return 'high';
}
