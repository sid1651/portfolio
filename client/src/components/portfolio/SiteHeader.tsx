import { useRef, useState } from 'react'
import { ArrowUpRight, List, X } from '@phosphor-icons/react'
import { gsap, ScrollTrigger, useGSAP } from '../../animation/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const navigation = [
  { href: '#work', label: 'Work' },
  { href: '#story', label: 'Story' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
]

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const header = useRef<HTMLElement>(null)
  const progress = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  useGSAP(() => {
    if (reduced || !header.current) return

    gsap.from(header.current, { yPercent: -100, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.1 })
    gsap.from('.site-nav__links a, .site-nav__resume', {
      y: -12,
      opacity: 0,
      duration: 0.7,
      stagger: 0.06,
      delay: 0.45,
      ease: 'power2.out',
    })

    // Reading progress, scrubbed against total document scroll.
    const progressTween = gsap.fromTo(
      progress.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.4 },
      },
    )

    const shift = gsap.quickTo(header.current, 'yPercent', { duration: 0.5, ease: 'power3.out' })
    let hidden = false

    const chrome = ScrollTrigger.create({
      start: 40,
      end: 'max',
      onUpdate: (self) => {
        const goingDown = self.direction === 1
        const deepEnough = self.scroll() > 420
        if (goingDown && deepEnough && !hidden) {
          hidden = true
          shift(-100)
        } else if ((!goingDown || !deepEnough) && hidden) {
          hidden = false
          shift(0)
        }
      },
      onToggle: (self) => header.current?.classList.toggle('site-header--scrolled', self.isActive),
    })

    return () => {
      progressTween.scrollTrigger?.kill()
      chrome.kill()
    }
  }, { scope: header, dependencies: [reduced] })

  useGSAP(() => {
    if (reduced || !menuOpen) return
    gsap.from('.site-nav__links--open a', {
      y: 18,
      opacity: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: 'power2.out',
    })
  }, { scope: header, dependencies: [menuOpen, reduced] })

  return (
    <header className="site-header" ref={header}>
      <nav className="site-nav page-shell" aria-label="Main navigation">
        <a className="site-mark" href="#top" aria-label="Narava Venkat Siddharth, back to top">
          <span>SN</span>
        </a>

        <div className={`site-nav__links ${menuOpen ? 'site-nav__links--open' : ''}`}>
          {navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
        </div>

        <a
          className="site-nav__resume"
          href="/siddharth-resume.pdf"
          target="_blank"
          rel="noreferrer"
        >
          View résumé
          <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
        </a>

        <button
          className="site-nav__menu"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <List size={22} />}
        </button>
      </nav>
      <span className="site-header__progress" ref={progress} aria-hidden="true" />
    </header>
  )
}
