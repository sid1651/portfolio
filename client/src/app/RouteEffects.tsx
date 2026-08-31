import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { projectBySlug } from '../data/projects'

export function RouteEffects() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    const slug = pathname.startsWith('/work/') ? pathname.slice('/work/'.length) : undefined
    const project = projectBySlug(slug)
    document.title = project ? `${project.title} | Siddharth Narava` : 'Siddharth Narava | Full Stack Developer'
  }, [pathname])

  return null
}
