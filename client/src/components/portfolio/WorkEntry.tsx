import { ArrowRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { ProjectVisual } from './ProjectVisual'
import type { ProjectRecord } from '../../data/projects'

const cleanCopy = (value: string) => value.replace(/[–—]/g, '-')

/** The address the browser frame displays, trimmed to host + path. */
const frameAddress = (project: ProjectRecord) => {
  const raw = project.liveUrl ?? project.githubUrl
  if (!raw) return `work/${project.slug}`
  try {
    const url = new URL(raw)
    return `${url.host}${url.pathname.replace(/\/$/, '')}`
  } catch {
    return raw
  }
}

type WorkEntryProps = {
  project: ProjectRecord
  index: number
  total: number
}

export function WorkEntry({ project, index, total }: WorkEntryProps) {
  const title = project.title.split(' - ')[0]
  const position = String(index + 1).padStart(2, '0')

  return (
    <article className={`work-entry ${index % 2 === 1 ? 'work-entry--flipped' : ''}`}>
      <p className="work-entry__rail">
        <span>{position} / {String(total).padStart(2, '0')}</span>
        <span>{project.years}</span>
      </p>

      <Link
        className="work-entry__frame"
        to={`/work/${project.slug}`}
        aria-label={`Read ${title} case study`}
      >
        <span className="browser-chrome" aria-hidden="true">
          <span className="browser-chrome__dots">
            <i /><i /><i />
          </span>
          <span className="browser-chrome__address">{frameAddress(project)}</span>
        </span>
        <span className="work-entry__shot">
          <ProjectVisual
            src={project.thumbnails[0]}
            alt={`${title} project interface`}
            eager={index === 0}
          />
        </span>
      </Link>

      <div className="work-entry__meta">
        <p className="work-entry__stack">{project.platforms.slice(0, 3).join(' / ')}</p>
        <h3>{title}</h3>
        <p className="work-entry__summary">{cleanCopy(project.summary)}</p>
        <Link className="text-link" to={`/work/${project.slug}`}>
          View case study
          <ArrowRight size={17} weight="bold" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
