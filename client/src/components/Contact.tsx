import React, { useState, useCallback, useRef } from 'react';
import type { FormEvent } from 'react';
import { PERSONAL, SOCIAL_LINKS } from '../utils/constants';
import { useScrollRevealMultiple } from '../hooks/useScrollReveal';
import './Contact.css';

/* ── tiny SVG icon map ── */
const SOCIAL_ICONS: Record<string, React.JSX.Element> = {
  github: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  leetcode: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  ),
};

const Contact = () => {
  const sectionRef = useScrollRevealMultiple();

  /* ── form state ── */
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    [],
  );

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      successTimerRef.current = setTimeout(() => {
        setSubmitted(false);
        setForm({ name: '', email: '', message: '' });
      }, 3000);
    },
    [],
  );

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText(PERSONAL.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const scrollToTop = useCallback(() => {
    document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      <section id="contact" className="section contact" ref={sectionRef}>
        {/* ── background dot grid ── */}
        <div className="contact-bg" aria-hidden="true">
          <div className="contact-dots" />
          <div className="contact-glow contact-glow--1" />
          <div className="contact-glow contact-glow--2" />
        </div>

        <div className="section-inner">
          {/* ── header ── */}
          <header className="contact-header reveal">
            <span className="section-label">// Get In Touch</span>
            <h2 className="section-title">
              Let's <span className="gradient-text">Work Together</span>
            </h2>
            <p className="section-subtitle">
              Have a project in mind or just want to say hi? I'd love to hear
              from you. Let's create something extraordinary together.
            </p>
          </header>

          {/* ── two-column layout ── */}
          <div className="contact-grid">
            {/* ─── left: info ─── */}
            <div className="contact-info reveal-left delay-1">
              <p className="contact-info__text">
                I'm always open to discussing new projects, creative ideas, or
                opportunities to be part of your vision. Whether it's a
                full-time role, freelance project, or just a friendly chat —
                don't hesitate to reach out.
              </p>

              {/* email */}
              <div className="contact-detail">
                <div className="contact-detail__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 4l-10 8L2 4" />
                  </svg>
                </div>
                <div className="contact-detail__body">
                  <span className="contact-detail__label">Email</span>
                  <a href={`mailto:${PERSONAL.email}`} className="contact-detail__value">
                    {PERSONAL.email}
                  </a>
                </div>
                <button
                  className="contact-copy"
                  onClick={copyEmail}
                  aria-label="Copy email address"
                  type="button"
                >
                  {copied ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                  <span className={`contact-copy__tooltip ${copied ? 'contact-copy__tooltip--visible' : ''}`}>
                    Copied!
                  </span>
                </button>
              </div>

              {/* location */}
              <div className="contact-detail">
                <div className="contact-detail__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="contact-detail__body">
                  <span className="contact-detail__label">Location</span>
                  <span className="contact-detail__value">{PERSONAL.location}</span>
                </div>
              </div>

              {/* availability */}
              <div className="contact-detail">
                <div className="contact-detail__icon contact-detail__icon--pulse">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="contact-detail__body">
                  <span className="contact-detail__label">Status</span>
                  <span className="contact-detail__value contact-detail__value--status">
                    <span className="contact-status-dot" />
                    {PERSONAL.availability}
                  </span>
                </div>
              </div>

              {/* social links */}
              <div className="contact-socials">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-social"
                    aria-label={link.name}
                  >
                    {SOCIAL_ICONS[link.icon] ?? null}
                  </a>
                ))}
              </div>
            </div>

            {/* ─── right: form ─── */}
            <div className="contact-form-wrapper glass-card reveal-right delay-2">
              {submitted ? (
                <div className="contact-success">
                  <div className="contact-success__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h3 className="contact-success__title">Message Sent!</h3>
                  <p className="contact-success__text">
                    Thanks for reaching out. I'll get back to you shortly.
                  </p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  {/* Name */}
                  <div className={`contact-field ${form.name ? 'contact-field--filled' : ''}`}>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      className="contact-field__input"
                    />
                    <label htmlFor="contact-name" className="contact-field__label">
                      Your Name
                    </label>
                    <span className="contact-field__bar" />
                  </div>

                  {/* Email */}
                  <div className={`contact-field ${form.email ? 'contact-field--filled' : ''}`}>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      className="contact-field__input"
                    />
                    <label htmlFor="contact-email" className="contact-field__label">
                      Your Email
                    </label>
                    <span className="contact-field__bar" />
                  </div>

                  {/* Message */}
                  <div className={`contact-field ${form.message ? 'contact-field--filled' : ''}`}>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="contact-field__input contact-field__textarea"
                    />
                    <label htmlFor="contact-message" className="contact-field__label">
                      Your Message
                    </label>
                    <span className="contact-field__bar" />
                  </div>

                  <button type="submit" className="contact-submit">
                    <span>Send Message</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer className="contact-footer">
        <div className="contact-footer__inner">
          <p className="contact-footer__copy">
            © 2026 {PERSONAL.name}. Crafted with ❤️ and lots of ☕
          </p>
          <button
            type="button"
            className="contact-footer__top"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
            <span>Back to top</span>
          </button>
        </div>
      </footer>
    </>
  );
};

export default Contact;
