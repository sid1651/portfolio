import { useRef } from 'react'
import { ArrowRight, ArrowUpRight, GithubLogo } from '@phosphor-icons/react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { EASE, gsap, useGSAP } from '../animation/gsap'
import { ProjectVisual } from '../components/portfolio/ProjectVisual'
import { Reveal } from '../components/portfolio/Reveal'
import { projectBySlug, projects } from '../data/projects'
import { useReducedMotion } from '../hooks/useReducedMotion'

const cleanCopy = (value: string) => value.replace(/[–—]/g, '-')

export default function CaseStudyPage() {
  const { slug } = useParams()
  const project = projectBySlug(slug)
  const reduced = useReducedMotion()
  const frame = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (reduced || !frame.current) return
    const q = gsap.utils.selector(frame.current)

    gsap.timeline({ defaults: { ease: EASE } })
      .from(q('.case-hero__copy > *'), { opacity: 0, y: 26, duration: 0.9, stagger: 0.08 })
      .from(q('.case-facts > div'), { opacity: 0, y: 20, duration: 0.8, stagger: 0.07 }, '-=0.6')

    const cover = q('.case-cover .project-visual img')[0]
    if (cover) {
      gsap.set(cover, { scale: 1.1 })
      gsap.fromTo(
        cover,
        { yPercent: -2.4 },
        {
          yPercent: 2.4,
          ease: 'none',
          scrollTrigger: { trigger: q('.case-cover')[0], start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    }

    const next = q('.case-next a')[0]
    if (next) {
      gsap.from(next, {
        opacity: 0,
        y: 30,
        duration: 1,
        scrollTrigger: { trigger: q('.case-next')[0], start: 'top 88%', once: true },
      })
    }
  }, { scope: frame, dependencies: [reduced, slug] })

  if (!project) return <Navigate to="/" replace />

  const shortTitle = project.title.split(' - ')[0]
  const projectType = project.title.split(' - ').slice(1).join(' - ')
  const projectIndex = projects.findIndex((item) => item.slug === project.slug)
  const nextProject = projects[(projectIndex + 1) % projects.length]
  const narrativeSections = project.sections.filter((section) => section.type === 'overview' || section.type === 'text')

  return (
    <div className="site-frame case-page" ref={frame}>
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

        <Reveal className="case-cover page-shell" y={44}>
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
