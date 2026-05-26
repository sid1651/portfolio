import React, { useCallback } from 'react';
import './About.css';
import { PERSONAL, STATS } from '../utils/constants';
import { useScrollRevealMultiple } from '../hooks/useScrollReveal';
import { useCountUp } from '../hooks/useCountUp';

/* ──────────────────────────────────────
   Stat Card sub-component
   ────────────────────────────────────── */
interface StatCardProps {
  value: number;
  suffix: string;
  label: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ value, suffix, label, delay }) => {
  const { ref, display } = useCountUp({ end: value, suffix });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = '';
  }, []);

  return (
    <div
      className={`about-card about-card--stat glass-card reveal delay-${delay}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="about-card-inner">
        <span ref={ref} className="about-stat-number">
          {display}
        </span>
        <span className="about-stat-label">{label}</span>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────
   Tilt handler factory (reused by non-stat cards)
   ────────────────────────────────────── */
function handleTiltMove(e: React.MouseEvent<HTMLDivElement>) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = ((y - centerY) / centerY) * -6;
  const rotateY = ((x - centerX) / centerX) * 6;

  card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
  card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
  card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
}

function handleTiltLeave(e: React.MouseEvent<HTMLDivElement>) {
  e.currentTarget.style.transform = '';
}

/* ──────────────────────────────────────
   Location Pin SVG
   ────────────────────────────────────── */
const LocationPin = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

/* ──────────────────────────────────────
   About Component
   ────────────────────────────────────── */
const About: React.FC = () => {
  const containerRef = useScrollRevealMultiple();

  return (
    <section id="about" className="section">
      <div className="section-inner" ref={containerRef}>
        {/* Header */}
        <header className="about-header reveal">
          <span className="section-label">// About Me</span>
          <h2 className="section-title">Get To Know Me</h2>
          <p className="section-subtitle">
            A glimpse into who I am, where I&rsquo;m based, and the impact
            I&rsquo;ve made throughout my career.
          </p>
        </header>

        {/* Bento Grid */}
        <div className="about-bento">
          {/* Bio Card — 2 cols × 2 rows */}
          <div
            className="about-card about-card--bio glass-card reveal delay-1"
            onMouseMove={handleTiltMove}
            onMouseLeave={handleTiltLeave}
          >
            <div className="about-bio-accent" aria-hidden="true" />
            <div className="about-card-inner">
              <span className="about-bio-label">Who I Am</span>
              <h3 className="about-bio-title">
                I build things for the&nbsp;
                <span className="gradient-text">web</span>
              </h3>
              <p className="about-bio-text">{PERSONAL.bio}</p>
            </div>
          </div>

          {/* Location Card */}
          <div
            className="about-card about-card--location glass-card reveal delay-2"
            onMouseMove={handleTiltMove}
            onMouseLeave={handleTiltLeave}
          >
            <div className="about-location-bg" aria-hidden="true" />
            <div className="about-card-inner">
              <div className="about-location-icon">
                <LocationPin />
              </div>
              <div>
                <span className="about-location-label">Location</span>
                <p className="about-location-value">{PERSONAL.location}</p>
              </div>
            </div>
          </div>

          {/* Availability Card */}
          <div
            className="about-card about-card--availability glass-card reveal delay-3"
            onMouseMove={handleTiltMove}
            onMouseLeave={handleTiltLeave}
          >
            <div className="about-card-inner">
              <div className="about-availability-badge">
                <span className="about-availability-dot" aria-hidden="true" />
                <span className="about-availability-text">Available</span>
              </div>
              <div>
                <span className="about-availability-label">Status</span>
                <p className="about-availability-value">
                  {PERSONAL.availability}
                </p>
              </div>
            </div>
          </div>

          {/* Stat Cards — 4 individual cards */}
          {STATS.map((stat, i) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={Math.min(i + 4, 6)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
