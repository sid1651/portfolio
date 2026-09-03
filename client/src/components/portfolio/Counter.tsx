import { useRef } from 'react'
import { gsap, useGSAP } from '../../animation/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type CounterProps = {
  value: number
  suffix?: string
}

export function Counter({ value, suffix = '' }: CounterProps) {
  const output = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  useGSAP(() => {
    const element = output.current
    if (reduced || !element) return

    const counter = { current: 0 }
    element.textContent = '0'
    gsap.to(counter, {
      current: value,
      duration: 1.6,
      ease: 'power2.out',
      snap: { current: 1 },
      onUpdate: () => {
        element.textContent = `${Math.round(counter.current)}`
      },
      scrollTrigger: { trigger: element, start: 'top 92%', once: true },
    })
  }, { dependencies: [reduced, value] })

  return (
    <>
      <span ref={output}>{value}</span>
      {suffix}
    </>
  )
}
