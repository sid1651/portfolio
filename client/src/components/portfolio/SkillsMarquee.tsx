import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../../animation/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { SKILLS } from '../../utils/constants'

/**
 * The rail loops on its own, but scroll velocity bends its speed and direction
 * so the strip feels attached to the page rather than playing beside it.
 */
export function SkillsMarquee() {
  const marquee = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useGSAP(() => {
    const element = track.current
    if (reduced || !element) return

    element.style.animation = 'none'
    const loop = gsap.to(element, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 })

    const speed = ScrollTrigger.create({
      trigger: marquee.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const boost = gsap.utils.clamp(1, 5, 1 + Math.abs(self.getVelocity()) / 900)
        gsap.to(loop, { timeScale: self.direction * boost, duration: 0.6, overwrite: true })
      },
    })

    return () => {
      speed.kill()
      loop.kill()
      element.style.removeProperty('animation')
    }
  }, { dependencies: [reduced] })

  return (
    <div className="skills-marquee" aria-label="Technical skills" ref={marquee}>
      <div className="skills-marquee__track" ref={track}>
        {SKILLS.map((skill) => <span key={`first-${skill.name}`}>{skill.name}</span>)}
        <div aria-hidden="true" className="skills-marquee__duplicate">
          {SKILLS.map((skill) => <span key={`second-${skill.name}`}>{skill.name}</span>)}
        </div>
      </div>
    </div>
  )
}
