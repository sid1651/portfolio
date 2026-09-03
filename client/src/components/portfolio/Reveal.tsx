import { useRef, type ReactNode } from 'react'
import { EASE, gsap, useGSAP } from '../../animation/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  /** Animate the direct children in sequence instead of the block as a whole. */
  stagger?: number
}

export function Reveal({ children, className, delay = 0, y = 30, stagger }: RevealProps) {
  const container = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useGSAP(() => {
    const element = container.current
    if (reduced || !element) return

    const targets = stagger ? Array.from(element.children) : element
    if (Array.isArray(targets) && targets.length === 0) return

    gsap.from(targets, {
      opacity: 0,
      y,
      duration: 1,
      delay,
      stagger,
      ease: EASE,
      scrollTrigger: { trigger: element, start: 'top 88%', once: true },
    })
  }, { dependencies: [reduced] })

  return (
    <div className={className} ref={container}>
      {children}
    </div>
  )
}
