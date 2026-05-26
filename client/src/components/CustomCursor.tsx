import { useEffect, useRef, useState, useCallback } from 'react';
import './CustomCursor.css';

/* ============================================================
   Interactive selectors for cursor state detection
   ============================================================ */
const INTERACTIVE_SELECTORS = 'a, button, [role="button"], input, textarea, select, label, .cursor-hover';
const TEXT_SELECTORS = 'p, span, h1, h2, h3, h4, h5, h6, li, td, th, blockquote, figcaption, em, strong, code';

/* ============================================================
   Lerp utility — linear interpolation for silky movement
   ============================================================ */
function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  // Actual mouse position (target)
  const mousePos = useRef({ x: -100, y: -100 });
  // Lerped ring position (delayed / smooth)
  const ringPos = useRef({ x: -100, y: -100 });

  const [cursorState, setCursorState] = useState<'default' | 'hovering' | 'text' | 'clicking' | 'hidden'>('default');
  const [isPointerFine, setIsPointerFine] = useState(false);

  const animFrameId = useRef<number>(0);
  const isClickingRef = useRef(false);
  const hoverStateRef = useRef<'default' | 'hovering' | 'text'>('default');

  /* ============================================================
     Pointer capability detection
     ============================================================ */
  useEffect(() => {
    const mql = window.matchMedia('(pointer: fine)');
    setIsPointerFine(mql.matches);

    const handler = (e: MediaQueryListEvent) => setIsPointerFine(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  /* ============================================================
     Add/remove global cursor:none class
     ============================================================ */
  useEffect(() => {
    if (isPointerFine) {
      document.documentElement.classList.add('cursor-active');
    } else {
      document.documentElement.classList.remove('cursor-active');
    }
    return () => {
      document.documentElement.classList.remove('cursor-active');
    };
  }, [isPointerFine]);

  /* ============================================================
     Determine hover state from a target element
     ============================================================ */
  const getHoverState = useCallback((target: EventTarget | null): 'default' | 'hovering' | 'text' => {
    if (!target || !(target instanceof HTMLElement)) return 'default';

    // Check if element or any ancestor matches interactive selectors
    if (target.closest(INTERACTIVE_SELECTORS)) {
      return 'hovering';
    }

    // Check if element matches text selectors (only direct text nodes)
    if (target.closest(TEXT_SELECTORS)) {
      // Make sure it's actual text content, not just wrapper elements
      const el = target.closest(TEXT_SELECTORS);
      if (el && el.textContent && el.textContent.trim().length > 0) {
        return 'text';
      }
    }

    return 'default';
  }, []);

  /* ============================================================
     Main animation loop + event listeners
     ============================================================ */
  useEffect(() => {
    if (!isPointerFine) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    /* --- Mouse move handler --- */
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      // Detect hover state via event delegation
      const state = getHoverState(e.target);
      if (state !== hoverStateRef.current) {
        hoverStateRef.current = state;
        if (!isClickingRef.current) {
          setCursorState(state);
        }
      }
    };

    /* --- Mouse over/out for delegation-based state tracking --- */
    const onMouseOver = (e: MouseEvent) => {
      const state = getHoverState(e.target);
      if (state !== hoverStateRef.current) {
        hoverStateRef.current = state;
        if (!isClickingRef.current) {
          setCursorState(state);
        }
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      // Only reset if moving to a non-matching element
      const state = getHoverState(e.relatedTarget);
      if (state !== hoverStateRef.current) {
        hoverStateRef.current = state;
        if (!isClickingRef.current) {
          setCursorState(state);
        }
      }
    };

    /* --- Click handlers --- */
    const onMouseDown = () => {
      isClickingRef.current = true;
      setCursorState('clicking');
    };

    const onMouseUp = () => {
      isClickingRef.current = false;
      setCursorState(hoverStateRef.current);
    };

    /* --- Mouse leave viewport --- */
    const onMouseLeave = () => {
      setCursorState('hidden');
    };

    const onMouseEnter = () => {
      setCursorState(hoverStateRef.current);
    };

    /* --- rAF animation loop --- */
    const animate = () => {
      // Lerp factor: lower = smoother/laggier, higher = snappier
      const lerpFactor = 0.15;

      ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, lerpFactor);
      ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, lerpFactor);

      // Apply positions via GPU-accelerated transforms
      ring.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      dot.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;

      animFrameId.current = requestAnimationFrame(animate);
    };

    // Start animation loop
    animFrameId.current = requestAnimationFrame(animate);

    // Attach event listeners
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    document.documentElement.addEventListener('mouseenter', onMouseEnter);

    return () => {
      cancelAnimationFrame(animFrameId.current);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isPointerFine, getHoverState]);

  /* ============================================================
     Don't render on non-fine-pointer devices
     ============================================================ */
  if (!isPointerFine) return null;

  /* ============================================================
     Build class names based on cursor state
     ============================================================ */
  const ringClasses = [
    'custom-cursor__ring',
    cursorState === 'hovering' && 'custom-cursor__ring--hovering',
    cursorState === 'text' && 'custom-cursor__ring--text',
    cursorState === 'clicking' && 'custom-cursor__ring--clicking',
    cursorState === 'hidden' && 'custom-cursor__ring--hidden',
  ].filter(Boolean).join(' ');

  const dotClasses = [
    'custom-cursor__dot',
    cursorState === 'hovering' && 'custom-cursor__dot--hovering',
    cursorState === 'text' && 'custom-cursor__dot--text',
    cursorState === 'clicking' && 'custom-cursor__dot--clicking',
    cursorState === 'hidden' && 'custom-cursor__dot--hidden',
  ].filter(Boolean).join(' ');

  return (
    <div className="custom-cursor" aria-hidden="true">
      <div ref={ringRef} className={ringClasses} />
      <div ref={dotRef} className={dotClasses} />
    </div>
  );
}
