import { useEffect, useRef, useCallback } from 'react';
import './ScrollProgress.css';

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>(0);
  const scrollTimeoutId = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /* ============================================================
     Calculate scroll percentage
     ============================================================ */
  const getScrollPercent = useCallback((): number => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight <= 0) return 0;
    return Math.min(scrollTop / docHeight, 1);
  }, []);

  /* ============================================================
     Update progress bar via rAF for GPU-accelerated performance
     ============================================================ */
  useEffect(() => {
    const bar = barRef.current;
    const glow = glowRef.current;
    const container = containerRef.current;
    if (!bar || !glow || !container) return;

    let ticking = false;

    const updateProgress = () => {
      const progress = getScrollPercent();

      // GPU-accelerated scaleX transform
      bar.style.transform = `scaleX(${progress})`;

      // Position the glow at the leading edge
      // The glow is inside the bar, so we position it at 100% (right edge of scaled bar)
      // But since bar is scaled, we need the glow in the wrapper
      glow.style.transform = `translateX(${progress * 100}vw)`;

      ticking = false;
    };

    const onScroll = () => {
      // Add scrolling class for glow visibility
      container.classList.add('scroll-progress--scrolling');

      // Clear any pending removal
      if (scrollTimeoutId.current) {
        clearTimeout(scrollTimeoutId.current);
      }

      // Remove scrolling class after scroll ends
      scrollTimeoutId.current = setTimeout(() => {
        container.classList.remove('scroll-progress--scrolling');
      }, 150);

      if (!ticking) {
        rafId.current = requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    // Set initial state
    updateProgress();

    // Passive scroll listener for maximum performance
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateProgress);
      cancelAnimationFrame(rafId.current);
      if (scrollTimeoutId.current) {
        clearTimeout(scrollTimeoutId.current);
      }
    };
  }, [getScrollPercent]);

  return (
    <div ref={containerRef} className="scroll-progress" aria-hidden="true">
      <div ref={barRef} className="scroll-progress__bar" />
      <div ref={glowRef} className="scroll-progress__glow" />
    </div>
  );
}
