import { useEffect, useRef } from 'react';
import { PERSONAL } from '../utils/constants';
import './Hero.css';

/* ============================================================
   GRADIENT MESH — Canvas Renderer
   ============================================================ */

interface GradientBlob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

function createBlobs(w: number, h: number): GradientBlob[] {
  // 5 large blobs with accent-palette colours at very low opacity
  return [
    { x: w * 0.3, y: h * 0.3, vx: 0.25, vy: 0.18, radius: Math.max(w, h) * 0.35, color: 'rgba(108, 92, 231, 0.12)' },  // purple
    { x: w * 0.7, y: h * 0.6, vx: -0.2, vy: 0.22, radius: Math.max(w, h) * 0.3, color: 'rgba(0, 206, 201, 0.10)' },     // teal
    { x: w * 0.5, y: h * 0.8, vx: 0.18, vy: -0.15, radius: Math.max(w, h) * 0.28, color: 'rgba(253, 121, 168, 0.10)' },  // pink
    { x: w * 0.2, y: h * 0.6, vx: -0.12, vy: -0.2, radius: Math.max(w, h) * 0.32, color: 'rgba(108, 92, 231, 0.08)' },   // purple (dim)
    { x: w * 0.8, y: h * 0.2, vx: 0.15, vy: 0.12, radius: Math.max(w, h) * 0.25, color: 'rgba(0, 206, 201, 0.08)' },     // teal (dim)
  ];
}

function animateBlobs(
  ctx: CanvasRenderingContext2D,
  blobs: GradientBlob[],
  w: number,
  h: number,
) {
  ctx.clearRect(0, 0, w, h);

  for (const blob of blobs) {
    // Move
    blob.x += blob.vx;
    blob.y += blob.vy;

    // Bounce off edges (with padding so blobs stay partially visible)
    const pad = blob.radius * 0.3;
    if (blob.x < -pad || blob.x > w + pad) blob.vx *= -1;
    if (blob.y < -pad || blob.y > h + pad) blob.vy *= -1;

    // Draw radial gradient circle
    const gradient = ctx.createRadialGradient(
      blob.x, blob.y, 0,
      blob.x, blob.y, blob.radius,
    );
    gradient.addColorStop(0, blob.color);
    gradient.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ============================================================
   HERO COMPONENT
   ============================================================ */

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* ---- Canvas animation loop ---- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let blobs: GradientBlob[] = [];
    let raf: number;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      blobs = createBlobs(w, h);
    };

    resize();
    window.addEventListener('resize', resize);

    if (!prefersReducedMotion) {
      const loop = () => {
        animateBlobs(ctx, blobs, w, h);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    } else {
      // Static render for reduced motion
      animateBlobs(ctx, blobs, w, h);
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* ---- Split name into individual characters ---- */
  const nameWords = PERSONAL.name.split(' ');

  const renderName = () =>
    nameWords.map((word, wi) => (
      <span key={wi} aria-hidden="true">
        {word.split('').map((char, ci) => {
          // Stagger: each character gets a progressively larger delay
          const totalIndex =
            nameWords.slice(0, wi).reduce((a, w) => a + w.length, 0) + ci;
          const delay = 0.6 + totalIndex * 0.06; // starts at 0.6s
          return (
            <span
              key={ci}
              className="hero__char"
              style={{ animationDelay: `${delay}s` }}
            >
              {char}
            </span>
          );
        })}
        {wi < nameWords.length - 1 && (
          <span className="hero__name-space" />
        )}
      </span>
    ));

  /* ---- Smooth scroll handler ---- */
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="hero">
      {/* Background layers */}
      <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />
      <div className="hero__grain" aria-hidden="true" />
      <div className="hero__vignette" aria-hidden="true" />

      {/* Floating geometric shapes */}
      <div className="hero__shapes" aria-hidden="true">
        <div className="hero__shape hero__shape--cube" />
        <div className="hero__shape hero__shape--ring" />
        <div className="hero__shape hero__shape--circle" />
        <div className="hero__shape hero__shape--diamond" />
        <div className="hero__shape hero__shape--cross" />
      </div>

      {/* Main content */}
      <div className="hero__content">
        {/* Availability badge */}
        <div className="hero__status">
          <span className="hero__status-dot" />
          {PERSONAL.availability}
        </div>

        {/* Name with character-level stagger */}
        <h1 className="hero__name">
          {/* Screen-reader friendly full name */}
          <span className="sr-only">{PERSONAL.name}</span>
          {renderName()}
        </h1>

        {/* Title with gradient */}
        <p className="hero__title gradient-text">{PERSONAL.title}</p>

        {/* Tagline */}
        <p className="hero__tagline">{PERSONAL.tagline}</p>

        {/* CTA Buttons */}
        <div className="hero__ctas">
          <button
            className="hero__btn hero__btn--primary"
            onClick={() => scrollToSection('projects')}
            type="button"
          >
            View My Work
            <span className="hero__btn-arrow" aria-hidden="true">→</span>
          </button>
          <button
            className="hero__btn hero__btn--secondary"
            onClick={() => scrollToSection('contact')}
            type="button"
          >
            Get In Touch
          </button>
          <a
            className="hero__btn hero__btn--ghost"
            href={PERSONAL.resumeUrl}
            target="_blank"
            rel="noreferrer"
            download
          >
            Download Resume
          </a>
        </div>

      </div>

      {/* Scroll indicator */}
      <button
        className="hero__scroll"
        onClick={() => scrollToSection('about')}
        aria-label="Scroll to next section"
        type="button"
      >
        <span className="hero__scroll-text">Scroll</span>
        <span className="hero__scroll-line" />
        <span className="hero__scroll-chevron">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
    </section>
  );
};

export default Hero;
