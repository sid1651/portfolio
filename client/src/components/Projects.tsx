import { useState, useCallback, useRef } from 'react';
import {
  DESIGN_PROJECTS,
  PROJECTS,
  type DesignProject,
  type Project,
} from '../utils/constants';
import { useScrollRevealMultiple } from '../hooks/useScrollReveal';
import './Projects.css';

// ── Filter Categories ──────────────────────────────────────────
const FILTER_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'web', label: 'Web' },
  { id: 'design', label: 'Design' },
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

const FigmaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 2a4 4 0 1 0 0 8h4V2H8zm0 10a4 4 0 1 0 0 8 4 4 0 0 0 4-4v-4H8zm8-10h-4v8h4a4 4 0 1 0 0-8zm0 10h-4v4a4 4 0 1 0 4-4zm-4 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
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

interface DesignCarouselProps {
  projects: readonly DesignProject[];
}

function DesignCarousel({ projects }: DesignCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  }, [projects.length]);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  }, [projects.length]);

  if (projects.length === 0) return null;

  const activeProject = projects[activeIndex];

  return (
    <div className="projects-design reveal delay-2">
      <div className="projects-design__header">
        <div>
          <span className="projects-design__eyebrow">Design Showcase</span>
          <h3 className="projects-design__title">Figma explorations and interface concepts</h3>
        </div>
        <div className="projects-design__controls">
          <button
            type="button"
            className="projects-design__nav"
            onClick={goToPrev}
            aria-label="Show previous design project"
          >
            ‹
          </button>
          <button
            type="button"
            className="projects-design__nav"
            onClick={goToNext}
            aria-label="Show next design project"
          >
            ›
          </button>
        </div>
      </div>

      <article className="projects-design__card">
        <div className="projects-design__visual">
          <div className={`projects-card-image-bg projects-card-image-bg--${activeIndex % 6}`} />
          <div className="projects-card-image-pattern" />
          <div className="projects-card-image-shimmer" />
          <div className="projects-design__visualInner">
            <div className="projects-design__iconWrap">
              <FigmaIcon />
            </div>
            <span className="projects-design__visualLabel">Figma Project</span>
          </div>
        </div>

        <div className="projects-design__content">
          <div className="projects-design__meta">
            {activeProject.featured && <span className="projects-design__badge">Featured Design</span>}
            <span className="projects-design__count">
              {String(activeIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </span>
          </div>

          <h4 className="projects-design__projectTitle">{activeProject.title}</h4>
          <p className="projects-design__description">{activeProject.description}</p>

          <ul className="projects-design__highlights">
            {activeProject.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>

          <div className="projects-design__tags">
            {activeProject.tags.map((tag) => (
              <span key={tag} className="projects-card-tag">{tag}</span>
            ))}
          </div>

          <div className="projects-design__footer">
            <a
              href={activeProject.figmaUrl}
              className="projects-card-cta projects-card-cta--primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Figma
              <ExternalLinkIcon />
            </a>

            <div className="projects-design__dots" aria-label="Select a design project">
              {projects.map((project, index) => (
                <button
                  key={project.id}
                  type="button"
                  className={`projects-design__dot${index === activeIndex ? ' projects-design__dot--active' : ''}`}
                  aria-label={`Show ${project.title}`}
                  aria-pressed={index === activeIndex}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

// ── Main Projects Section ──────────────────────────────────────
export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const containerRef = useScrollRevealMultiple();
  const showWebProjects = activeFilter === 'all' || activeFilter === 'web';
  const showDesignProjects = activeFilter === 'all' || activeFilter === 'design';
  const webProjects = PROJECTS.filter((p) => p.category === 'web');

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

        {showWebProjects && (
          <div className="projects-grid">
            {webProjects.map((project, index) => (
              <div
                key={project.id}
                className={`projects-card-wrapper reveal delay-${Math.min((index % 4) + 1, 6)}`}
              >
                <ProjectCard project={project} index={index} />
              </div>
            ))}
          </div>
        )}

        {showDesignProjects && (
          <DesignCarousel projects={DESIGN_PROJECTS} />
        )}
      </div>
    </section>
  );
}
