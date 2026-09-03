import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  GithubLogo,
  Moon,
  Sun,
} from '@phosphor-icons/react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ProjectVisual } from '../components/portfolio/ProjectVisual'
import { Reveal } from '../components/portfolio/Reveal'
import { projectBySlug, projects } from '../data/projects'
import { useTheme } from '../hooks/useTheme'

const cleanCopy = (value: string) => value.replace(/[\u2013\u2014]/g, '-')

export default function CaseStudyPage() {
  const { slug } = useParams()
  const project = projectBySlug(slug)
  const { theme, toggleTheme } = useTheme()

  if (!project) return <Navigate to="/" replace />

  const shortTitle = project.title.split(' - ')[0]
  const projectType = project.title.split(' - ').slice(1).join(' - ')
  const projectIndex = projects.findIndex((item) => item.slug === project.slug)
  const nextProject = projects[(projectIndex + 1) % projects.length]
  const narrativeSections = project.sections.filter((section) => section.type === 'overview' || section.type === 'text')

  return (
    <div className="site-frame case-page">
      <a className="skip-link" href="#case-content">Skip to content</a>
      <header className="case-header">
        <div className="page-shell case-header__inner">
          <Link className="case-header__back" to="/">
            <ArrowLeft size={18} weight="bold" aria-hidden="true" />
            All work
          </Link>
          <Link className="site-mark" to="/" aria-label="Narava Venkat Siddharth home">
            <span>SN</span>
          </Link>
          <button
            className="case-header__theme"
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </div>
      </header>

      <main id="case-content" className="case-main" aria-label={`${shortTitle} case study`}>
        <section className="case-hero page-shell">
          <div className="case-hero__copy">
            <p>{project.years}</p>
            <h1>{shortTitle}</h1>
            {projectType && <p className="case-hero__type">{projectType}</p>}
            <p className="case-hero__blurb">{cleanCopy(project.blurb)}</p>
            <div className="case-hero__actions">
              {project.liveUrl && (
                <a className="button button--primary" href={project.liveUrl} target="_blank" rel="noreferrer">
                  View live project
                  <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
                </a>
              )}
              {project.githubUrl && (
                <a className="button button--quiet" href={project.githubUrl} target="_blank" rel="noreferrer">
                  <GithubLogo size={18} weight="regular" aria-hidden="true" />
                  View source
                </a>
              )}
            </div>
          </div>
          <dl className="case-facts">
            <div>
              <dt>Role</dt>
              <dd>Design and engineering</dd>
            </div>
            <div>
              <dt>Built with</dt>
              <dd>{project.platforms.join(', ')}</dd>
            </div>
            <div>
              <dt>Focus</dt>
              <dd>{cleanCopy(project.summary)}</dd>
            </div>
          </dl>
        </section>

        <Reveal className="case-cover page-shell">
          <ProjectVisual src={project.thumbnails[0]} alt={`${shortTitle} product interface`} eager />
        </Reveal>

        <section className="case-narrative page-shell">
          {narrativeSections.map((section, index) => (
            <Reveal className="case-narrative__row" key={`${section.type}-${index}`}>
              <h2>{section.type === 'overview' ? section.label : section.title}</h2>
              <p>{cleanCopy(section.body)}</p>
            </Reveal>
          ))}
        </section>

        <section className="case-next">
          <div className="page-shell case-next__inner">
            <p>Next project</p>
            <Link to={`/work/${nextProject.slug}`}>
              <span>{nextProject.title.split(' - ')[0]}</span>
              <ArrowRight size={28} weight="light" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
