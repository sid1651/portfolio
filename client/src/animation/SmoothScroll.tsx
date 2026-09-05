import { useEffect, useRef, type ReactNode } from 'react'
import { ScrollSmoother, ScrollTrigger, gsap, useGSAP } from './gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * In-page links travel a constant 0.8s no matter how far the target is. Easing
 * the raw distance instead makes "Contact" — nine screens down — crawl for
 * several seconds, which reads as a broken link rather than a considered move.
 */
const ANCHOR_DURATION = 0.8
const ANCHOR_EASE = 'power2.inOut'

/**
 * Height of whichever fixed header is mounted, measured rather than hardcoded:
 * the site and case-study headers share `--header-height`, which drops from
 * 70px to 64px under the mobile breakpoint.
 */
const headerOffset = () => {
  const header = document.querySelector('.site-header, .case-header')
  if (header) return header.getBoundingClientRect().height
  const declared = getComputedStyle(document.documentElement).getPropertyValue('--header-height')
  return Number.parseFloat(declared) || 0
}

type SmoothScrollProps = {
  children: ReactNode
}

/**
 * Wraps the routed view in the ScrollSmoother rig. Fixed-position chrome (the
 * headers, the skip link) stays outside `#smooth-content`, because everything
 * inside it rides on a transform.
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  const wrapper = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useGSAP(() => {
    if (reduced || !wrapper.current || !content.current) return

    const smoother = ScrollSmoother.create({
      wrapper: wrapper.current,
      content: content.current,
      smooth: 1.15,
      smoothTouch: 0,
      effects: true,
      normalizeScroll: true,
      ignoreMobileResize: true,
    })

    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    // Escape hatch for visual QA: transforms make stitched full-page
    // screenshots meaningless, so tooling can drop back to native scrolling.
    const globals = window as typeof window & {
      __smoother?: ScrollSmoother
      __disableSmoothScroll?: () => void
    }
    globals.__smoother = smoother
    globals.__disableSmoothScroll = () => {
      smoother.kill()
      ScrollTrigger.refresh()
    }

    return () => {
      delete globals.__smoother
      delete globals.__disableSmoothScroll
      smoother.kill()
    }
  }, { dependencies: [reduced] })

  // Anchor navigation is handled here rather than inside the smoother effect so
  // that it still works under reduced motion, where no smoother is created.
  useEffect(() => {
    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return
      if (event.shiftKey || event.altKey) return

      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href^="#"]')
      const href = anchor?.getAttribute('href')
      if (!href || href === '#') return

      const isTop = href === '#top'
      const target = isTop ? null : document.querySelector(href)
      if (!isTop && !target) return
      event.preventDefault()

      const offset = headerOffset()
      const smoother = ScrollSmoother.get()

      if (reduced) {
        // ScrollToPlugin resolves the element position for us; `set` lands it
        // in a single frame, which is what reduce-motion asks for.
        gsap.set(window, { scrollTo: isTop ? 0 : { y: target as Element, offsetY: offset } })
      } else if (smoother) {
        // Nav links live inside the mobile menu, which pauses the smoother
        // while it is open. Release it here rather than waiting for the menu's
        // own effect, or the tween runs against a frozen scroller.
        if (smoother.paused()) smoother.paused(false)

        // Tweening the smoother's own scrollTop keeps ScrollTrigger in sync —
        // animating `window` instead would fight the smoother's transform.
        gsap.to(smoother, {
          scrollTop: isTop ? 0 : smoother.offset(target as Element, `top ${offset}px`),
          duration: ANCHOR_DURATION,
          ease: ANCHOR_EASE,
          overwrite: true,
          // Reveals firing along the way resize their sections, so the offset
          // measured at click time drifts by a few pixels. Re-measure on
          // arrival and close the gap; at rest the correction is invisible.
          onComplete: () => {
            if (isTop) return
            const settled = smoother.offset(target as Element, `top ${headerOffset()}px`)
            if (Math.abs(settled - smoother.scrollTop()) > 1) smoother.scrollTop(settled)
          },
        })
      } else {
        gsap.to(window, {
          scrollTo: isTop ? 0 : { y: target as Element, offsetY: offset },
          duration: ANCHOR_DURATION,
          ease: ANCHOR_EASE,
          overwrite: true,
        })
      }

      // Keep the URL shareable without letting the browser jump to the hash.
      if (window.location.hash !== href) window.history.pushState(null, '', href)
    }

    document.addEventListener('click', onAnchorClick)
    return () => document.removeEventListener('click', onAnchorClick)
  }, [reduced])

  return (
    <div id="smooth-wrapper" ref={wrapper}>
      <div id="smooth-content" ref={content}>
        {children}
      </div>
    </div>
  )
}
