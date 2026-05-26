import { useState, useEffect, useCallback, useRef } from 'react';
import { NAV_LINKS, PERSONAL } from '../utils/constants';
import { useTheme } from '../hooks/useTheme';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isHidden, setIsHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // ---- Hide on scroll-down, show on scroll-up ----
  const handleScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;

    requestAnimationFrame(() => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      // Only hide after scrolling past a threshold (avoids flicker at top)
      if (currentY > 80) {
        if (delta > 8) {
          setIsHidden(true);
          setMobileOpen(false);
        } else if (delta < -8) {
          setIsHidden(false);
        }
      } else {
        setIsHidden(false);
      }

      lastScrollY.current = currentY;
      ticking.current = false;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // ---- Active section tracking via IntersectionObserver ----
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.id);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          rootMargin: '-40% 0px -55% 0px',
          threshold: 0,
        },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // ---- Close mobile menu on link click ----
  const handleLinkClick = useCallback(() => {
    setMobileOpen(false);
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const monogram = PERSONAL.firstName.charAt(0);

  return (
    <>
      <nav className={`navbar ${isHidden ? 'navbar--hidden' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="navbar-pill">
          {/* Logo / Monogram */}
          <a href="#hero" className="navbar-logo" onClick={handleLinkClick} aria-label="Go to top">
            {monogram}
          </a>

          {/* Desktop Links */}
          <ul className="navbar-links">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={`navbar-link ${activeSection === link.id ? 'navbar-link--active' : ''}`}
                  onClick={handleLinkClick}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Divider */}
          <span className="navbar-divider" aria-hidden="true" />

          {/* Theme Toggle */}
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

          {/* Hamburger (mobile) */}
          <button
            className={`navbar-hamburger ${mobileOpen ? 'navbar-hamburger--open' : ''}`}
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span className="navbar-hamburger-lines">
              <span className="navbar-hamburger-line" />
              <span className="navbar-hamburger-line" />
              <span className="navbar-hamburger-line" />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <div className={`navbar-mobileMenu ${mobileOpen ? 'navbar-mobileMenu--open' : ''}`} role="menu">
        {NAV_LINKS.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={`navbar-mobileLink ${activeSection === link.id ? 'navbar-mobileLink--active' : ''}`}
            onClick={handleLinkClick}
            role="menuitem"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Backdrop overlay */}
      <div
        className={`navbar-backdrop ${mobileOpen ? 'navbar-backdrop--visible' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />
    </>
  );
}
