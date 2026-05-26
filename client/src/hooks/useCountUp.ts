import { useState, useEffect, useRef, useCallback } from 'react';

interface CountUpOptions {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export function useCountUp({ end, duration = 2000, suffix = '', prefix = '' }: CountUpOptions) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const startCounting = useCallback(() => {
    if (hasStarted) return;
    setHasStarted(true);

    const startTime = performance.now();
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out quart
      const eased = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.round(eased * end);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [end, duration, hasStarted]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startCounting();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [startCounting]);

  const display = `${prefix}${count}${suffix}`;

  return { ref, count, display };
}
