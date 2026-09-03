import { useState } from 'react'
import { ArrowUpRight, List, X } from '@phosphor-icons/react'

const navigation = [
  { href: '#work', label: 'Work' },
  { href: '#story', label: 'Story' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
]

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header">
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
    </header>
  )
}
