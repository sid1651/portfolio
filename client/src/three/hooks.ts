import { useEffect, useRef, useState } from 'react';
import { detectQuality } from './capabilities';
import type { Quality } from './capabilities';
import type { ThemeMode } from './palette';

/* ------------------------------------------------------------
   Theme — reads the `data-theme` attribute the ThemeToggle sets
   on <html>, so the 3D layer re-colours with the rest of the UI.
   ------------------------------------------------------------ */
export function useThemeMode(): ThemeMode {
  const [mode, setMode] = useState<ThemeMode>(
    () => (document.documentElement.getAttribute('data-theme') as ThemeMode) || 'dark',
  );

  useEffect(() => {
    const root = document.documentElement;
    const read = () =>
      setMode((root.getAttribute('data-theme') as ThemeMode) || 'dark');

    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return mode;
}

/* ------------------------------------------------------------
   Quality — re-evaluated on resize so rotating a tablet or
   dragging a window between displays picks the right tier.
   ------------------------------------------------------------ */
export function useQuality(): Quality {
  const [quality, setQuality] = useState<Quality>(() => detectQuality());

  useEffect(() => {
    let timer: number;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setQuality(detectQuality()), 250);
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return quality;
}

/* ------------------------------------------------------------
   Pointer — normalised (-1…1) cursor position kept in a ref so
   parallax never triggers a React render.
   ------------------------------------------------------------ */
export interface Pointer {
  x: number;
  y: number;
}

export function usePointer() {
  const pointer = useRef<Pointer>({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return pointer;
}

/* ------------------------------------------------------------
   Near-viewport gate — used by sections to defer downloading and
   instantiating a scene (and its three.js chunk) until the user
   is about to reach it. Latches on: scenes never unmount.
   ------------------------------------------------------------ */
export function useNearViewport<T extends HTMLElement>(rootMargin = 300) {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;

    // Synchronous first check — anything already on screen (the hero,
    // typically) starts loading immediately instead of waiting for the
    // observer's first delivery.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + rootMargin && rect.bottom > -rootMargin) {
      setNear(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: `${rootMargin}px` },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [near, rootMargin]);

  return { ref, near };
}

/* ------------------------------------------------------------
   Render-loop gate — freezes a canvas while it is scrolled out
   of view, so idle scenes cost zero GPU time. Backgrounded tabs
   need no handling here: the browser already suspends rAF.
   ------------------------------------------------------------ */
export function useCanvasActive<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, active };
}
