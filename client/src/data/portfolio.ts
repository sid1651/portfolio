import { EXPERIENCES, PERSONAL, SOCIAL_LINKS } from '../utils/constants'

export type ProjectLink = {
  slug: string
  title: string
  summary: string
  thumbnails: [string, string, string]
}

export type CareerEntry = {
  year: string
  route: string
  company: string
  role: string
  description: string
  current?: boolean
  technologies: string[]
  projects: ProjectLink[]
}

export const portfolioIdentity = {
  name: PERSONAL.name,
  shortName: `${PERSONAL.firstName} ${PERSONAL.lastName}`,
  title: PERSONAL.title,
  statement: 'I build dependable products where thoughtful interfaces meet production-ready engineering.',
  email: PERSONAL.email,
  location: 'New Delhi, India',
  timeZone: 'Asia/Kolkata',
  coordinates: { latitude: 28.6139, longitude: 77.209 },
  resumeUrl: PERSONAL.resumeUrl,
  socials: SOCIAL_LINKS,
}

const projectLinks: ProjectLink[] = [
  { slug: 'kodikos', title: 'Kodikos', summary: 'A real-time collaborative code editor built for teams.', thumbnails: ['/projects/kodikos.svg', '/projects/kodikos.svg', '/projects/kodikos.svg'] },
  { slug: 'estia-stay', title: 'Estia Stay', summary: 'A booking platform with practical owner workflows.', thumbnails: ['/projects/estia-stay.svg', '/projects/estia-stay.svg', '/projects/estia-stay.svg'] },
  { slug: 'lumaloop', title: 'LumaLoop', summary: 'A private, browser-based motion studio.', thumbnails: ['/projects/lumaloop.svg', '/projects/lumaloop.svg', '/projects/lumaloop.svg'] },
  { slug: 'sphere-point', title: 'Sphere / Point', summary: 'An interactive WebGL formation visualizer.', thumbnails: ['/projects/sphere-point.svg', '/projects/sphere-point.svg', '/projects/sphere-point.svg'] },
  { slug: 'settlers-3d', title: 'Settlers 3D', summary: 'A realtime 3D strategy board game.', thumbnails: ['/projects/settlers-3d.svg', '/projects/settlers-3d.svg', '/projects/settlers-3d.svg'] },
  { slug: 'design-lab', title: 'Interface Design Lab', summary: 'A set of motion-led product interface studies.', thumbnails: ['/projects/design-lab.svg', '/projects/design-lab.svg', '/projects/design-lab.svg'] },
]

const routes = ['DEL / BEN', 'BEN / HYD', 'HYD / BLR', 'BLR / WORLD']
const groupedProjects = [projectLinks.slice(0, 1), projectLinks.slice(1, 3), projectLinks.slice(3, 5), projectLinks.slice(5)]

export const careerEntries: CareerEntry[] = EXPERIENCES.map((experience, index) => ({
  year: experience.period.replaceAll('—', '-').replaceAll('–', '-'),
  route: routes[index] ?? 'DEL / WORLD',
  company: experience.company,
  role: experience.role,
  description: experience.description,
  current: experience.period.includes('Present'),
  technologies: experience.technologies,
  projects: groupedProjects[index] ?? [],
}))

export const memoryCards = [
  { src: '/memories/build.svg', alt: 'A layered build study', label: 'Build' },
  { src: '/memories/learn.svg', alt: 'A notebook study', label: 'Learn' },
  { src: '/memories/ship.svg', alt: 'A release-day study', label: 'Ship' },
  { src: '/memories/lead.svg', alt: 'A team collaboration study', label: 'Lead' },
  { src: '/memories/explore.svg', alt: 'An exploration study', label: 'Explore' },
]
