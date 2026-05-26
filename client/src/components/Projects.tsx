import { useState, useCallback, useRef } from 'react';
import { PROJECTS, type Project } from '../utils/constants';
import { useScrollRevealMultiple } from '../hooks/useScrollReveal';
import './Projects.css';

// ── Filter Categories ──────────────────────────────────────────
const FILTER_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'web', label: 'Web' },
] as const;

// ── Placeholder icons per project index ────────────────────────
const PROJECT_ICONS = ['🚀', '📱', '🎨', '📊', '💬', '✨'];

// ── SVG Icons ──────────────────────────────────────────────────
const StarIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0l2.5 5.3L16 6.2l-4 3.8 1 5.5L8 12.8l-5 2.7 1-5.5-4-3.8 5.5-.9z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

// ── Project Card Component ─────────────────────────────────────
interface ProjectCardProps {
  project: Project;
  index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const inner = innerRef.current;
    if (!card || !inner) return;

    // Cancel any pending frame
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle 3D tilt — max ±6deg
      const rotateY = ((x - centerX) / centerX) * 6;
      const rotateX = ((centerY - y) / centerY) * 6;

      inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const inner = innerRef.current;
    if (!inner) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
  }, []);

  const gradientIdx = index % 6;

  return (
    <article
      ref={cardRef}
      className="projects-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={innerRef} className="projects-card-inner">
        {/* Image Area */}
        <div className="projects-card-image">
          <div className={`projects-card-image-bg projects-card-image-bg--${gradientIdx}`} />
          <div className="projects-card-image-pattern" />
          <div className="projects-card-image-shimmer" />
          <div className="projects-card-image-icon">
            {PROJECT_ICONS[gradientIdx]}
          </div>

          {/* Featured Badge */}
          {project.featured && (
            <div className="projects-card-featured">
              <StarIcon />
              Featured
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="projects-card-content">
          <h3 className="projects-card-title">{project.title}</h3>
          <p className="projects-card-description">{project.description}</p>
          {project.highlights && project.highlights.length > 0 && (
            <ul style={{ margin: '1rem 0', paddingLeft: '1.25rem', listStyleType: 'disc', fontSize: '0.9rem', color: 'var(--text-2)' }}>
              {project.highlights.map((highlight, idx) => (
                <li key={idx} style={{ marginBottom: '0.35rem' }}>{highlight}</li>
              ))}
            </ul>
          )}
          <div className="projects-card-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="projects-card-tag">{tag}</span>
            ))}
          </div>
        </div>

        {/* CTA Overlay */}
        <div className="projects-card-overlay">
          <div className="projects-card-overlay-buttons">
            <a
              href={project.liveUrl}
              className="projects-card-cta projects-card-cta--primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Project
              <ArrowRightIcon />
            </a>
            <a
              href={project.githubUrl}
              className="projects-card-cta projects-card-cta--secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source Code
              <ExternalLinkIcon />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

// ── Main Projects Section ──────────────────────────────────────
export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const containerRef = useScrollRevealMultiple();

  const filteredProjects = activeFilter === 'all'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="section projects" ref={containerRef}>
      <div className="section-inner">
        {/* Header */}
        <div className="projects-header reveal">
          <span className="section-label">// Featured Work</span>
          <h2 className="section-title">
            Projects That <span className="gradient-text">Define Me</span>
          </h2>
          <p className="section-subtitle">
            A curated collection of projects that showcase my passion for building beautiful, performant, and impactful digital experiences.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="projects-filters reveal delay-1">
          {FILTER_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`projects-filter-btn${activeFilter === cat.id ? ' projects-filter-btn--active' : ''}`}
              onClick={() => setActiveFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="projects-grid">
          {PROJECTS.map((project, index) => {
            const isVisible = activeFilter === 'all' || project.category === activeFilter;
            return (
              <div
                key={project.id}
                className={`projects-card-wrapper reveal delay-${Math.min((filteredProjects.indexOf(project) % 4) + 1, 6)} ${
                  isVisible ? 'projects-card-wrapper--visible' : 'projects-card-wrapper--hidden'
                }`}
              >
                <ProjectCard project={project} index={index} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
