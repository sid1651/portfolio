import {
  ArrowRight,
  ArrowUpRight,
  Code,
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
} from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { AircraftWindow } from '../components/portfolio/AircraftWindow'
import { ProjectVisual } from '../components/portfolio/ProjectVisual'
import { Reveal } from '../components/portfolio/Reveal'
import { SiteHeader } from '../components/portfolio/SiteHeader'
import { careerEntries, portfolioIdentity } from '../data/portfolio'
import { projects, type ProjectRecord } from '../data/projects'
import { useTheme } from '../hooks/useTheme'
import {
  CURRENTLY_BUILDING,
  CURRENTLY_LEARNING,
  ENGINEERING_WINS,
  SKILLS,
  STATS,
} from '../utils/constants'

const cleanCopy = (value: string) => value.replace(/[\u2013\u2014]/g, '-')

const socialIcons = {
  GitHub: GithubLogo,
  LinkedIn: LinkedinLogo,
  LeetCode: Code,
}

function ProjectCard({ project, index }: { project: ProjectRecord; index: number }) {
  const title = project.title.split(' - ')[0]

  return (
    <Reveal className={`project-card project-card--${index + 1}`} delay={(index % 2) * 0.07}>
      <article>
        <Link className="project-card__media" to={`/work/${project.slug}`} aria-label={`Read ${title} case study`}>
          <ProjectVisual src={project.thumbnails[0]} alt={`${title} project interface`} eager={index === 0} />
        </Link>
        <div className="project-card__body">
          <div className="project-card__heading">
            <div>
              <p>{project.platforms.slice(0, 3).join(' / ')}</p>
              <h3>{title}</h3>
            </div>
            <span>{project.years}</span>
          </div>
          <p className="project-card__summary">{cleanCopy(project.summary)}</p>
          <Link className="text-link" to={`/work/${project.slug}`}>
            View case study
            <ArrowRight size={17} weight="bold" aria-hidden="true" />
          </Link>
        </div>
      </article>
    </Reveal>
  )
}

export default function HomePage() {
  const { theme, toggleTheme } = useTheme()
  const reduceMotion = useReducedMotion()
  const experience = [...careerEntries].reverse()

  return (
    <div className="site-frame">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />

      <main id="main-content" aria-label="Flight plan">
        <section className="hero page-shell" id="top">
          <motion.div
            className="hero__copy"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
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
          </motion.div>

          <motion.div
            className="hero__window"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96, rotate: 1.5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <AircraftWindow theme={theme} onToggle={toggleTheme} />
          </motion.div>
        </section>

        <section className="signal-strip" aria-label="Career highlights">
          <div className="page-shell signal-strip__inner">
            {STATS.map((stat) => (
              <div className="signal" key={stat.label}>
                <strong>{stat.value}{stat.suffix}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section section--work page-shell" id="work">
          <Reveal className="section-heading">
            <h2>Selected work</h2>
            <p>Products built across collaboration, commerce, creative tools, and realtime 3D.</p>
          </Reveal>
          <div className="project-grid">
            {projects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </div>
        </section>

        <section className="section section--story page-shell" id="story">
          <Reveal className="story-intro">
            <h2>I care about the part after it works.</h2>
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

          <Reveal className="now-grid">
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
          <div className="page-shell skills-rail__heading">
            <h2 id="skills-title">Tools I reach for</h2>
            <p>A practical stack chosen around the product, never around novelty.</p>
          </div>
          <div className="skills-marquee" aria-label="Technical skills">
            <div className="skills-marquee__track">
              {SKILLS.map((skill) => <span key={`first-${skill.name}`}>{skill.name}</span>)}
              <div aria-hidden="true" className="skills-marquee__duplicate">
                {SKILLS.map((skill) => <span key={`second-${skill.name}`}>{skill.name}</span>)}
              </div>
            </div>
          </div>
        </section>

        <section className="section section--experience page-shell" id="experience">
          <Reveal className="section-heading section-heading--experience">
            <h2>Experience shaped by shipping</h2>
            <p>From core computer science to production web, mobile, streaming, and SaaS systems.</p>
          </Reveal>
          <div className="experience-list">
            {experience.map((entry, index) => (
              <Reveal className="experience-row" delay={index * 0.04} key={`${entry.company}-${entry.role}`}>
                <p className="experience-row__period">{entry.year}</p>
                <div className="experience-row__title">
                  <h3>{entry.role}</h3>
                  <p>{entry.company}</p>
                </div>
                <div className="experience-row__detail">
                  <p>{cleanCopy(entry.description)}</p>
                  <span>{entry.technologies.join(', ')}</span>
                </div>
              </Reveal>
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
            <Reveal className="contact-section__main">
              <p>Have a product that deserves care?</p>
              <h2>Let&apos;s make it sturdy, useful, and memorable.</h2>
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
