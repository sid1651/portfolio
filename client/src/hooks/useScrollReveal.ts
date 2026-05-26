import { useEffect, useRef, useCallback } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px', once = true } = options;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.classList.add('revealed');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove('revealed');
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return ref;
}

export function useScrollRevealMultiple(options: ScrollRevealOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px', once = true } = options;
  const containerRef = useRef<HTMLDivElement>(null);

  const setupObserver = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const elements = container.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    if (reducedMotion) {
      elements.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove('revealed');
          }
        });
      },
      { threshold, rootMargin }
    );

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  useEffect(() => {
    const cleanup = setupObserver();
    return cleanup;
  }, [setupObserver]);

  return containerRef;
}
