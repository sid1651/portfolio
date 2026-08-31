import { DESIGN_PROJECTS, PROJECTS } from '../utils/constants'

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
  { slug: 'kodikos', source: PROJECTS[0], image: '/projects/kodikos.svg', years: '2025-2026' },
  { slug: 'estia-stay', source: PROJECTS[1], image: '/projects/estia-stay.svg', years: '2025' },
  { slug: 'lumaloop', source: PROJECTS[2], image: '/projects/lumaloop.svg', years: '2026' },
  { slug: 'sphere-point', source: PROJECTS[3], image: '/projects/sphere-point.svg', years: '2026' },
  { slug: 'settlers-3d', source: PROJECTS[4], image: '/projects/settlers-3d.svg', years: '2026' },
]

export const projects: ProjectRecord[] = sourceProjects.map(({ slug, source, image, years }) => ({
  slug,
  title: source.title.replaceAll('—', '-').replaceAll('–', '-'),
  years,
  platforms: source.tags,
  blurb: source.description.replaceAll('—', '-').replaceAll('–', '-'),
  summary: source.highlights[0].replaceAll('—', '-').replaceAll('–', '-'),
  liveUrl: source.liveUrl || undefined,
  githubUrl: source.githubUrl || undefined,
  thumbnails: [image, image, image],
  sections: [
    { type: 'overview', label: 'Role', body: source.highlights[0].replaceAll('—', '-').replaceAll('–', '-') },
    { type: 'figure', media: { src: image, alt: `${source.title} project overview` }, aspect: 1.5, wide: true },
    { type: 'text', title: 'System', body: source.highlights[1].replaceAll('—', '-').replaceAll('–', '-') },
    { type: 'figure', media: { before: image, after: image, alt: `${source.title} before and after comparison` }, aspect: 1.5 },
    { type: 'text', title: 'Outcome', body: source.highlights[2].replaceAll('—', '-').replaceAll('–', '-') },
  ],
}))

const designSource = DESIGN_PROJECTS[0]
projects.push({
  slug: 'design-lab',
  title: 'Interface Design Lab',
  years: '2025-2026',
  platforms: ['Figma', 'Motion', 'Mobile UI'],
  blurb: designSource.description,
  summary: designSource.highlights[0],
  liveUrl: designSource.figmaUrl,
  thumbnails: ['/projects/design-lab.svg', '/projects/design-lab.svg', '/projects/design-lab.svg'],
  sections: [
    { type: 'overview', label: 'Practice', body: designSource.highlights[0] },
    { type: 'figure', media: { src: '/projects/design-lab.svg', alt: 'Interface Design Lab visual study' }, aspect: 1.5, wide: true },
    { type: 'text', title: 'Motion', body: designSource.highlights[1] },
    { type: 'phones', rows: [[
      { src: '/projects/design-lab.svg', alt: 'Mobile interface study one' },
      { src: '/projects/design-lab.svg', alt: 'Mobile interface study two' },
      { src: '/projects/design-lab.svg', alt: 'Mobile interface study three' },
    ]] },
    { type: 'text', title: 'System', body: designSource.highlights[2] },
  ],
})

export const projectBySlug = (slug: string | undefined) => projects.find((project) => project.slug === slug)
