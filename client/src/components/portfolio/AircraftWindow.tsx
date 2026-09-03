import { useRef } from 'react'
import { gsap, useGSAP } from '../../animation/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import type { Theme } from '../../hooks/useTheme'

type AircraftWindowProps = {
  theme: Theme
  onToggle: () => void
}

export function AircraftWindow({ theme, onToggle }: AircraftWindowProps) {
  const scene = useRef<HTMLDivElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const shade = useRef<HTMLSpanElement>(null)
  const sky = useRef<HTMLVideoElement>(null)
  const sea = useRef<HTMLVideoElement>(null)
  const submerged = useRef(false)
  const settled = useRef(false)
  const reduced = useReducedMotion()
  const isDark = theme === 'dark'
  const action = isDark
    ? 'Open window shade for light mode'
    : 'Close window shade for dark mode'

  useGSAP(() => {
    if (!shade.current) return
    const yPercent = isDark ? 0 : -86

    if (reduced || !settled.current) {
      settled.current = true
      gsap.set(shade.current, { yPercent })
      return
    }

    gsap.to(shade.current, { yPercent, duration: 0.85, ease: 'power3.inOut', overwrite: true })
  }, { dependencies: [isDark, reduced] })

  // Nothing to decode behind a closed shade.
  useGSAP(() => {
    if (reduced) return
    const play = (video: HTMLVideoElement | null, wanted: boolean) => {
      if (!video) return
      if (wanted && !isDark) void video.play().catch(() => undefined)
      else video.pause()
    }
    play(sky.current, true)
    play(sea.current, submerged.current)
  }, { dependencies: [isDark, reduced] })

  useGSAP(() => {
    if (reduced || !frame.current || !scene.current) return

    // The porthole descends: the sea dissolves in over the sky as the hero
    // scrolls away, so the two clips read as one continuous view.
    const hero = scene.current.closest('.hero')
    if (sea.current && hero) {
      gsap.fromTo(
        sea.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: '32% top',
            scrub: 0.6,
            onUpdate: (self) => {
              const active = self.progress > 0.01
              if (active === submerged.current) return
              submerged.current = active
              if (active && !isDark) void sea.current?.play().catch(() => undefined)
              if (!active) sea.current?.pause()
            },
          },
        },
      )
    }

    // Pointer tilt, so the porthole reads as a physical object in the cabin.
    const rotateX = gsap.quickTo(frame.current, 'rotationX', { duration: 0.7, ease: 'power3.out' })
    const rotateY = gsap.quickTo(frame.current, 'rotationY', { duration: 0.7, ease: 'power3.out' })
    gsap.set(frame.current, { transformPerspective: 1000, transformOrigin: 'center' })

    const onMove = (event: PointerEvent) => {
      const bounds = scene.current!.getBoundingClientRect()
      const x = (event.clientX - bounds.left) / bounds.width - 0.5
      const y = (event.clientY - bounds.top) / bounds.height - 0.5
      rotateY(x * 13)
      rotateX(-y * 10)
    }
    const onLeave = () => {
      rotateY(0)
      rotateX(0)
    }

    const node = scene.current
    node.addEventListener('pointermove', onMove)
    node.addEventListener('pointerleave', onLeave)

    return () => {
      node.removeEventListener('pointermove', onMove)
      node.removeEventListener('pointerleave', onLeave)
    }
  }, { dependencies: [reduced] })

  return (
    <div className="window-scene" ref={scene}>
      <div className="window-cabin-line window-cabin-line--top" aria-hidden="true" />
      <div className="aircraft-window-frame" ref={frame}>
        <button
          className="aircraft-window"
          type="button"
          aria-label={action}
          aria-pressed={isDark}
          aria-describedby="window-instruction"
          onClick={onToggle}
        >
          <img
            className="aircraft-window__image"
            src="/media/cloudscape.avif"
            alt="Cloudscape seen through an airplane window"
            width="1536"
            height="1024"
            fetchPriority="high"
          />
          {!reduced && (
            <>
              <video
                className="aircraft-window__video"
                ref={sky}
                src="/media/sky.mp4"
                aria-hidden="true"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              />
              <video
                className="aircraft-window__video aircraft-window__video--sea"
                ref={sea}
                src="/media/undersea.mp4"
                aria-hidden="true"
                loop
                muted
                playsInline
                preload="auto"
              />
            </>
          )}
          <span className="aircraft-window__glass" aria-hidden="true" />
          <span className="aircraft-window__shade" aria-hidden="true" ref={shade}>
            <span className="aircraft-window__shade-ribs" />
            <span className="aircraft-window__handle" />
          </span>
        </button>
      </div>
      <p className="window-instruction" id="window-instruction">
        {isDark ? 'Open the shade for daylight' : 'Close the shade for night mode'}
      </p>
      <div className="window-cabin-line window-cabin-line--bottom" aria-hidden="true" />
    </div>
  )
}
