import { DESIGN_PROJECTS, PROJECTS } from '../utils/constants'

const cleanCopy = (value: string) => value.replace(/[\u2013\u2014]/g, '-')

export type Media = {
  src?: string
  poster?: string
  hoverToPlay?: boolean
  label?: string
  before?: string
  after?: string
  bare?: boolean
  alt: string
}

export type CaseSection =
  | { type: 'overview'; label: string; body: string }
  | { type: 'text'; title: string; body: string }
  | { type: 'figure'; media: Media; caption?: string; aspect?: number; wide?: boolean }
  | { type: 'phones'; rows: Media[][] }

export type ProjectRecord = {
  slug: string
  title: string
  years: string
  platforms: string[]
  blurb: string
  summary: string
  liveUrl?: string
  githubUrl?: string
  thumbnails: [string, string, string]
  sections: CaseSection[]
}

const sourceProjects = [
  { slug: 'kodikos', source: PROJECTS[0], image: '/projects/kodikos.avif', years: '2025-2026' },
  { slug: 'estia-stay', source: PROJECTS[1], image: '/projects/estia-stay.avif', years: '2025' },
  { slug: 'lumaloop', source: PROJECTS[2], image: '/projects/lumaloop.avif', years: '2026' },
  { slug: 'sphere-point', source: PROJECTS[3], image: '/projects/sphere-point.avif', years: '2026' },
  { slug: 'settlers-3d', source: PROJECTS[4], image: '/projects/settlers-3d.avif', years: '2026' },
]

export const projects: ProjectRecord[] = sourceProjects.map(({ slug, source, image, years }) => ({
  slug,
  title: cleanCopy(source.title),
  years,
  platforms: source.tags,
  blurb: cleanCopy(source.description),
  summary: cleanCopy(source.highlights[0]),
  liveUrl: source.liveUrl || undefined,
  githubUrl: source.githubUrl || undefined,
  thumbnails: [image, image, image],
  sections: [
    { type: 'overview', label: 'Role', body: cleanCopy(source.highlights[0]) },
    { type: 'figure', media: { src: image, alt: `${source.title} project overview` }, aspect: 1.5, wide: true },
    { type: 'text', title: 'System', body: cleanCopy(source.highlights[1]) },
    { type: 'figure', media: { before: image, after: image, alt: `${source.title} before and after comparison` }, aspect: 1.5 },
    { type: 'text', title: 'Outcome', body: cleanCopy(source.highlights[2]) },
  ],
}))

const designSource = DESIGN_PROJECTS[0]
projects.push({
  slug: 'design-lab',
  title: 'Interface Design Lab',
  years: '2025-2026',
  platforms: ['Figma', 'Motion', 'Mobile UI'],
  blurb: cleanCopy(designSource.description),
  summary: cleanCopy(designSource.highlights[0]),
  liveUrl: designSource.figmaUrl,
  thumbnails: ['/projects/design-lab.avif', '/projects/design-lab.avif', '/projects/design-lab.avif'],
  sections: [
    { type: 'overview', label: 'Practice', body: cleanCopy(designSource.highlights[0]) },
    { type: 'figure', media: { src: '/projects/design-lab.avif', alt: 'Interface Design Lab visual study' }, aspect: 1.5, wide: true },
    { type: 'text', title: 'Motion', body: cleanCopy(designSource.highlights[1]) },
    { type: 'phones', rows: [[
      { src: '/projects/design-lab.avif', alt: 'Mobile interface study one' },
      { src: '/projects/design-lab.avif', alt: 'Mobile interface study two' },
      { src: '/projects/design-lab.avif', alt: 'Mobile interface study three' },
    ]] },
    { type: 'text', title: 'System', body: cleanCopy(designSource.highlights[2]) },
  ],
})

export const projectBySlug = (slug: string | undefined) => projects.find((project) => project.slug === slug)
