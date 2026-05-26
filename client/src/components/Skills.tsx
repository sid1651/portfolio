import { useState, useEffect, useRef, useCallback } from 'react';
import { SKILLS, SKILL_CATEGORIES } from '../utils/constants';
import type { Skill } from '../utils/constants';
import { useScrollRevealMultiple } from '../hooks/useScrollReveal';
import './Skills.css';

type CategoryFilter = 'all' | Skill['category'];

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [visibleCategory, setVisibleCategory] = useState<CategoryFilter>('all');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [barsRevealed, setBarsRevealed] = useState(false);
  const sectionRef = useScrollRevealMultiple();
  const progressRef = useRef<HTMLDivElement>(null);

  // Observe when the skills grid enters viewport to trigger progress bars
  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setBarsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBarsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Handle category switching with a fade-out / fade-in transition
  const handleCategoryChange = useCallback(
    (cat: CategoryFilter) => {
      if (cat === activeCategory || isTransitioning) return;
      setIsTransitioning(true);

      // After fade-out completes, swap the actual filter and fade back in
      const timeout = setTimeout(() => {
        setActiveCategory(cat);
        setVisibleCategory(cat);
        // Small rAF delay so the DOM updates before we remove the transitioning class
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setIsTransitioning(false));
        });
      }, 280); // matches CSS transition duration

      return () => clearTimeout(timeout);
    },
    [activeCategory, isTransitioning],
  );

  const filteredSkills =
    visibleCategory === 'all'
      ? SKILLS
      : SKILLS.filter((s) => s.category === visibleCategory);

  return (
    <section id="skills" className="section skills" ref={sectionRef}>
      <div className="section-inner">
        {/* ── Header ── */}
        <header className="skills-header reveal">
          <span className="section-label">// Skills &amp; Expertise</span>
          <h2 className="section-title">
            My <span className="gradient-text">Tech Arsenal</span>
          </h2>
          <p className="section-subtitle">
            A curated collection of technologies, frameworks, and tools I wield
            to turn ideas into polished digital products.
          </p>
        </header>

        {/* ── Category Tabs ── */}
        <nav className="skills-tabs reveal delay-1" aria-label="Filter skills by category">
          <button
            className={`skills-tab ${activeCategory === 'all' ? 'skills-tab--active' : ''}`}
            onClick={() => handleCategoryChange('all')}
            aria-pressed={activeCategory === 'all'}
          >
            All
          </button>
          {SKILL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`skills-tab ${activeCategory === cat.id ? 'skills-tab--active' : ''}`}
              onClick={() => handleCategoryChange(cat.id as CategoryFilter)}
              aria-pressed={activeCategory === cat.id}
            >
              {cat.label}
            </button>
          ))}
        </nav>

        {/* ── Grid ── */}
        <div
          className={`skills-grid ${isTransitioning ? 'skills-grid--transitioning' : ''}`}
          ref={progressRef}
        >
          {filteredSkills.map((skill, i) => (
            <article
              key={skill.name}
              className="skills-card glass-card gradient-border reveal"
              style={{ '--card-index': i } as React.CSSProperties}
            >
              {/* Glow blob on hover */}
              <div className="skills-card__glow" aria-hidden="true" />

              <span className="skills-card__icon" aria-hidden="true">
                {skill.icon}
              </span>

              <h3 className="skills-card__name">{skill.name}</h3>

              <div className="skills-card__bar-track" aria-hidden="true">
                <div
                  className="skills-card__bar-fill"
                  style={
                    {
                      '--fill-width': `${skill.level}%`,
                      '--bar-delay': `${i * 60}ms`,
                      width: barsRevealed ? `${skill.level}%` : '0%',
                    } as React.CSSProperties
                  }
                />
              </div>
              <span className="skills-card__level">
                {skill.level}<small>%</small>
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
