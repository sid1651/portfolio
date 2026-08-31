import { Navigate, useParams } from 'react-router-dom'
import { projectBySlug } from '../data/projects'

export default function CaseStudyPage() {
  const { slug } = useParams()
  const project = projectBySlug(slug)
  if (!project) return <Navigate to="/" replace />

  return (
    <main aria-label={`${project.title} case study`}>
      <h1>{project.title}</h1>
    </main>
  )
}
