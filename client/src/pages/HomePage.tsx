import { useRef } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Code,
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
} from '@phosphor-icons/react'
import { useGSAP } from '../animation/gsap'
import { createHomeAnimations } from '../animation/homeTimeline'
import { AircraftWindow } from '../components/portfolio/AircraftWindow'
import { Counter } from '../components/portfolio/Counter'
import { Reveal } from '../components/portfolio/Reveal'
import { SkillsMarquee } from '../components/portfolio/SkillsMarquee'
import { WorkEntry } from '../components/portfolio/WorkEntry'
import { careerEntries, portfolioIdentity } from '../data/portfolio'
import { projects } from '../data/projects'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useTheme } from '../hooks/useTheme'
import {
  CURRENTLY_BUILDING,
  CURRENTLY_LEARNING,
  ENGINEERING_WINS,
  STATS,
} from '../utils/constants'

const cleanCopy = (value: string) => value.replace(/[–—]/g, '-')

const socialIcons = {
  GitHub: GithubLogo,
  LinkedIn: LinkedinLogo,
  LeetCode: Code,
}

export default function HomePage() {
  const { theme, toggleTheme } = useTheme()
  const reduced = useReducedMotion()
  const frame = useRef<HTMLDivElement>(null)
  const experience = [...careerEntries].reverse()

  useGSAP(() => {
    if (reduced || !frame.current) return
    return createHomeAnimations(frame.current)
  }, { scope: frame, dependencies: [reduced] })

  return (
    <div className="site-frame" ref={frame}>
      <main id="main-content" aria-label="Flight plan">
        <section className="hero page-shell" id="top">
          <div className="hero__copy">
            <p className="hero__eyebrow">Full-stack developer</p>
            <h1>{portfolioIdentity.name}</h1>
            <p className="hero__statement">Digital products, built with care.</p>
            <p className="hero__intro">
              I turn complex ideas into fast, reliable web experiences with thoughtful interfaces and production-minded engineering.
            </p>
            <div className="hero__actions">
              <a className="button button--primary" href="#work">
                View work
                <ArrowRight size={18} weight="bold" aria-hidden="true" />
              </a>
              <a className="button button--quiet" href="/siddharth-resume.pdf" target="_blank" rel="noreferrer">
                View résumé
                <ArrowUpRight size={17} weight="bold" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="hero__window" data-lag="0.14">
            <AircraftWindow theme={theme} onToggle={toggleTheme} />
          </div>
        </section>

        <section className="signal-strip" aria-label="Career highlights">
          <div className="page-shell signal-strip__inner">
            {STATS.map((stat) => (
              <div className="signal" key={stat.label}>
                <strong><Counter value={stat.value} suffix={stat.suffix} /></strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section section--work page-shell" id="work">
          <Reveal className="section-heading" y={0}>
            <h2 data-reveal-lines>Selected work</h2>
            <p>Products built across collaboration, commerce, creative tools, and realtime 3D.</p>
          </Reveal>
          <div className="work-showcase">
            {projects.map((project, index) => (
              <WorkEntry key={project.slug} project={project} index={index} total={projects.length} />
            ))}
          </div>
        </section>

        <section className="section section--story page-shell" id="story">
          <Reveal className="story-intro" y={0}>
            <h2 data-reveal-lines>I care about the part after it works.</h2>
            <div>
              <p>{cleanCopy(portfolioIdentity.statement)}</p>
              <p>
                My work connects clear product thinking, expressive interfaces, and backend systems that stay understandable as they grow.
              </p>
            </div>
          </Reveal>

          <div className="principles-grid">
            {ENGINEERING_WINS.map((item, index) => (
              <Reveal className={`principle principle--${index + 1}`} delay={index * 0.06} key={item.title}>
                <h3>{item.title}</h3>
                <p>{cleanCopy(item.description)}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="now-grid" stagger={0.12}>
            <div>
              <h3>Building now</h3>
              <p>{cleanCopy(CURRENTLY_BUILDING[0])}</p>
            </div>
            <div>
              <h3>Learning now</h3>
              <p>{cleanCopy(CURRENTLY_LEARNING[0])}</p>
            </div>
          </Reveal>
        </section>

        <section className="skills-rail" aria-labelledby="skills-title">
          <Reveal className="page-shell skills-rail__heading" y={0}>
            <h2 id="skills-title" data-reveal-lines>Tools I reach for</h2>
            <p>A practical stack chosen around the product, never around novelty.</p>
          </Reveal>
          <SkillsMarquee />
        </section>

        <section className="section section--experience page-shell" id="experience">
          <Reveal className="section-heading section-heading--experience" y={0}>
            <h2 data-reveal-lines>Experience shaped by shipping</h2>
            <p>From core computer science to production web, mobile, streaming, and SaaS systems.</p>
          </Reveal>
          <div className="experience-list">
            {experience.map((entry) => (
              <div className="experience-row" key={`${entry.company}-${entry.role}`}>
                <p className="experience-row__period">{entry.year}</p>
                <div className="experience-row__title">
                  <h3>{entry.role}</h3>
                  <p>{entry.company}</p>
                </div>
                <div className="experience-row__detail">
                  <p>{cleanCopy(entry.description)}</p>
                  <span>{entry.technologies.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section page-shell" id="resume">
          <Reveal className="resume-panel">
            <div>
              <p className="resume-panel__label">One-page overview</p>
              <h2>The details, ready when you are.</h2>
            </div>
            <a className="button button--ink" href="/siddharth-resume.pdf" target="_blank" rel="noreferrer">
              View résumé
              <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
            </a>
          </Reveal>
        </section>

        <section className="contact-section" id="contact">
          <div className="page-shell">
            <Reveal className="contact-section__main" y={0}>
              <p>Have a product that deserves care?</p>
              <h2 data-reveal-lines>Let&apos;s make it sturdy, useful, and memorable.</h2>
              <a className="contact-email" href={`mailto:${portfolioIdentity.email}`}>
                <EnvelopeSimple size={24} weight="light" aria-hidden="true" />
                Email Siddharth
                <ArrowUpRight size={20} weight="bold" aria-hidden="true" />
              </a>
            </Reveal>

            <footer className="site-footer">
              <p>{portfolioIdentity.shortName} © {new Date().getFullYear()}</p>
              <div className="site-footer__links">
                {portfolioIdentity.socials.map((social) => {
                  const Icon = socialIcons[social.name as keyof typeof socialIcons] ?? Code
                  return (
                    <a key={social.name} href={social.url} target="_blank" rel="noreferrer" aria-label={social.name}>
                      <Icon size={20} weight="regular" aria-hidden="true" />
                      <span>{social.name}</span>
                    </a>
                  )
                })}
              </div>
            </footer>
          </div>
        </section>
      </main>
    </div>
  )
}
