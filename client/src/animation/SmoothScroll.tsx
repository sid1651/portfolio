import { useRef, type ReactNode } from 'react'
import { ScrollSmoother, ScrollTrigger, useGSAP } from './gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'

const HEADER_OFFSET = 88

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

    // Native `scroll-behavior: smooth` fights the smoother, and in-page anchors
    // need the smoother's own scroller so they land under the fixed header.
    const root = document.documentElement
    const previousBehavior = root.style.scrollBehavior
    root.style.scrollBehavior = 'auto'

    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return
      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href^="#"]')
      const href = anchor?.getAttribute('href')
      if (!href || href === '#') return
      const target = document.querySelector(href)
      if (!target) return
      event.preventDefault()
      smoother.scrollTo(target, true, `top ${HEADER_OFFSET}px`)
    }

    document.addEventListener('click', onAnchorClick)
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
      document.removeEventListener('click', onAnchorClick)
      root.style.scrollBehavior = previousBehavior
      delete globals.__smoother
      delete globals.__disableSmoothScroll
      smoother.kill()
    }
  }, { dependencies: [reduced] })

  return (
    <div id="smooth-wrapper" ref={wrapper}>
      <div id="smooth-content" ref={content}>
        {children}
      </div>
    </div>
  )
}
