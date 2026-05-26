import { useEffect, useRef, useState, useCallback } from 'react';
import { EXPERIENCES } from '../utils/constants';
import './Experience.css';

const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeDots, setActiveDots] = useState<Set<number>>(new Set());
  const [revealedItems, setRevealedItems] = useState<Set<number>>(new Set());
  const [progressActive, setProgressActive] = useState(false);

  // -------- Timeline scroll-fill progress --------
  const handleScroll = useCallback(() => {
    const timeline = timelineRef.current;
    const progress = progressRef.current;
    if (!timeline || !progress) return;

    const rect = timeline.getBoundingClientRect();
    const windowH = window.innerHeight;

    // How far the viewport center has traveled through the timeline
    const timelineTop = rect.top;
    const timelineHeight = rect.height;

    // Start filling when the timeline's top hits 80% of the viewport
    // Finish when the timeline's bottom hits 20% of the viewport
    const startOffset = windowH * 0.8;
    const endOffset = windowH * 0.2;

    const totalScrollRange = timelineHeight - endOffset + startOffset;
    const scrolled = startOffset - timelineTop;

    const pct = Math.min(Math.max(scrolled / totalScrollRange, 0), 1);
    progress.style.height = `${pct * 100}%`;
    setProgressActive(pct > 0 && pct < 1);

    // Activate dots when the progress line reaches them
    const newActive = new Set<number>();
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const dotTop = el.getBoundingClientRect().top + 24; // dot offset from top of item
      const progressBottom = rect.top + timelineHeight * pct;
      if (dotTop <= progressBottom + 10) {
        newActive.add(i);
      }
    });
    setActiveDots(newActive);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll(); // initial
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  // -------- Card reveal via IntersectionObserver --------
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setRevealedItems(new Set(EXPERIENCES.map((_, i) => i)));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.getAttribute('data-index'));
          if (entry.isIntersecting) {
            setRevealedItems((prev) => new Set(prev).add(idx));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // -------- Section header reveal --------
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerRevealed, setHeaderRevealed] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setHeaderRevealed(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="experience" className="section experience" ref={sectionRef}>
      <div className="section-inner">
        {/* --- Header --- */}
        <div
          ref={headerRef}
          className={`experience-header reveal ${headerRevealed ? 'revealed' : ''}`}
        >
          <span className="section-label">// Experience</span>
          <h2 className="section-title">My Professional Journey</h2>
          <p className="section-subtitle">
            A timeline of growth, impact, and the pursuit of engineering excellence.
          </p>
        </div>

        {/* --- Timeline --- */}
        <div className="experience-timeline" ref={timelineRef}>
          {/* Scroll-progress fill line */}
          <div
            ref={progressRef}
            className={`experience-timeline-progress ${progressActive ? 'experience-progress-active' : ''}`}
          />

          {EXPERIENCES.map((exp, index) => {
            const side = index % 2 === 0 ? 'left' : 'right';
            const isRevealed = revealedItems.has(index);
            const isDotActive = activeDots.has(index);

            return (
              <div
                key={exp.id}
                ref={(el) => { itemRefs.current[index] = el; }}
                data-index={index}
                className={`experience-item experience-item--${side} ${isRevealed ? 'experience-item--revealed' : ''}`}
              >
                {/* Dot on the timeline */}
                <div
                  className={`experience-dot ${isDotActive ? 'experience-dot--active' : ''}`}
                />

                {/* Connector line */}
                <div className="experience-connector" />

                {/* Card */}
                <article className="experience-card">
                  <h3 className="experience-company">{exp.company}</h3>
                  <p className="experience-role">{exp.role}</p>
                  <span className="experience-period">{exp.period}</span>
                  <p className="experience-description">{exp.description}</p>

                  {/* Achievements */}
                  <ul className="experience-achievements">
                    {exp.achievements.map((ach, i) => (
                      <li key={i} className="experience-achievement">
                        <span className="experience-achievement-icon" aria-hidden="true">
                          ✓
                        </span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech tags */}
                  <div className="experience-tags">
                    {exp.technologies.map((tech) => (
                      <span key={tech} className="experience-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;
