import { EASE, gsap, ScrollTrigger, splitLines } from './gsap'

type Cleanup = () => void

/**
 * Reveals an element line by line behind a mask, then puts the original markup
 * back so the copy stays fully responsive once it has played.
 */
const revealLines = (element: Element, vars: gsap.TweenVars = {}) => {
  const split = splitLines(element)
  const tween = gsap.from(split.lines, {
    yPercent: 118,
    duration: 1.1,
    stagger: 0.09,
    ease: EASE,
    ...vars,
    onComplete: () => split.revert(),
  })
  return { split, tween }
}

export function createHomeAnimations(root: HTMLElement): Cleanup {
  const q = gsap.utils.selector(root)
  const disposers: Cleanup[] = []
  const registered = <T extends { revert: () => void }>(item: T) => {
    disposers.push(() => item.revert())
    return item
  }

  const heroCopy = q('.hero__copy')[0]
  const heroTargets = [
    q('.hero__eyebrow')[0],
    q('.hero h1')[0],
    q('.hero__statement')[0],
    q('.hero__intro')[0],
  ].filter(Boolean)

  // Hold the hero until webfonts resolve, otherwise the line boxes are measured
  // against fallback metrics and the mask reveal clips at the wrong height.
  gsap.set([...heroTargets, ...q('.hero__actions > *'), q('.hero__window')[0]].filter(Boolean), { opacity: 0 })

  let cancelled = false
  const startHero = () => {
    if (cancelled) return
    const intro = gsap.timeline({ defaults: { ease: EASE } })
    disposers.push(() => intro.kill())

    // Reset the pre-hide before the `from` tweens read their end values.
    gsap.set([...heroTargets, ...q('.hero__actions > *')], { opacity: 1 })

    intro
      .from(q('.hero__eyebrow'), { opacity: 0, y: 16, duration: 0.7 })

    for (const [index, selector] of ['.hero h1', '.hero__statement', '.hero__intro'].entries()) {
      const element = q(selector)[0]
      if (!element) continue
      const { split, tween } = revealLines(element, {
        duration: index === 1 ? 1.25 : 1,
        stagger: 0.085,
      })
      registered(split)
      intro.add(tween, index === 0 ? '-=0.35' : '-=0.85')
    }

    intro
      .from(q('.hero__actions > *'), { opacity: 0, y: 22, duration: 0.8, stagger: 0.09 }, '-=0.7')
      .fromTo(
        q('.hero__window'),
        { opacity: 0, scale: 0.94, rotate: 2.5 },
        { opacity: 1, scale: 1, rotate: 0, duration: 1.4 },
        0.25,
      )
      .set(q('.hero__actions > *'), { clearProps: 'transform' })
  }

  const fontsReady = document.fonts?.ready
  if (fontsReady) {
    // Never let a stalled font load strand the hero in its hidden state.
    Promise.race([fontsReady, new Promise((resolve) => setTimeout(resolve, 1500))]).then(startHero)
  } else {
    startHero()
  }
  disposers.push(() => { cancelled = true })

  // --- Hero drifts away as the page takes over -----------------------------
  if (heroCopy) {
    registered(
      gsap.to(heroCopy, {
        yPercent: -14,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: {
          trigger: q('.hero')[0],
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      }),
    )
  }

  // --- Stat strip ----------------------------------------------------------
  const signals = q('.signal')
  if (signals.length) {
    registered(
      gsap.from(signals, {
        opacity: 0,
        y: 26,
        duration: 0.9,
        stagger: 0.09,
        ease: EASE,
        scrollTrigger: { trigger: q('.signal-strip')[0], start: 'top 88%', once: true },
      }),
    )
  }

  // --- Headline copy, revealed on approach ---------------------------------
  for (const heading of q('[data-reveal-lines]')) {
    const { split, tween } = revealLines(heading, {
      duration: 1.15,
      stagger: 0.1,
      scrollTrigger: { trigger: heading, start: 'top 85%', once: true },
    })
    registered(split)
    registered(tween)
  }

  // --- Work showcase -------------------------------------------------------
  for (const [index, entry] of q('.work-entry').entries()) {
    const frame = entry.querySelector<HTMLElement>('.work-entry__frame')
    const meta = entry.querySelector<HTMLElement>('.work-entry__meta')
    const rail = entry.querySelector<HTMLElement>('.work-entry__rail')
    if (!frame || !meta) continue

    // Frames arrive slightly off-square and settle, like prints laid on a desk.
    const tilt = index % 2 === 0 ? -1.4 : 1.4
    registered(
      gsap.timeline({
        defaults: { ease: EASE },
        scrollTrigger: { trigger: entry, start: 'top 82%', once: true },
      })
        .from(rail, { opacity: 0, duration: 0.7 })
        .from(frame, { opacity: 0, y: 64, rotate: tilt, duration: 1.2 }, '-=0.45')
        .from(meta.children, { opacity: 0, y: 24, duration: 0.85, stagger: 0.08 }, '-=0.85'),
    )

    // The screenshots are shown whole, so nothing is overscaled to parallax
    // against. The depth comes from the frame drifting past the meta column.
    registered(
      gsap.fromTo(
        frame,
        { yPercent: 2.6 },
        {
          yPercent: -2.6,
          ease: 'none',
          scrollTrigger: { trigger: entry, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        },
      ),
    )
  }

  // --- Experience ledger ---------------------------------------------------
  const rows = q('.experience-row')
  if (rows.length) {
    registered(
      gsap.from(rows, {
        opacity: 0,
        y: 34,
        duration: 0.95,
        stagger: 0.08,
        ease: EASE,
        scrollTrigger: { trigger: q('.experience-list')[0], start: 'top 82%', once: true },
      }),
    )
  }

  // --- Contact call to action ---------------------------------------------
  const email = q('.contact-email')[0]
  if (email) {
    registered(
      gsap.from(email, {
        opacity: 0,
        y: 26,
        duration: 0.9,
        ease: EASE,
        scrollTrigger: { trigger: email, start: 'top 92%', once: true },
      }),
    )
  }

  ScrollTrigger.refresh()

  return () => {
    for (const dispose of disposers.splice(0)) dispose()
  }
}
