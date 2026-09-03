import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText)

gsap.defaults({ ease: 'power3.out', duration: 0.9 })

/** Matches the `--ease` custom property used across the stylesheet. */
export const EASE = 'power3.out'
export const EASE_SOFT = 'power2.out'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Splits an element into masked lines once webfonts are ready, so the line
 * boxes are measured against the final metrics rather than the fallback face.
 */
export const splitLines = (element: Element) =>
  SplitText.create(element, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'split-line',
    autoSplit: true,
  })

export { gsap, useGSAP, ScrollTrigger, ScrollSmoother, SplitText }
