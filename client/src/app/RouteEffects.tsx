import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollSmoother, ScrollTrigger } from '../animation/gsap'
import { projectBySlug } from '../data/projects'

export function RouteEffects() {
  const { pathname } = useLocation()

  useEffect(() => {
    const smoother = ScrollSmoother.get()
    if (smoother) {
      smoother.scrollTo(0, false)
      // New route, new measurements.
      requestAnimationFrame(() => ScrollTrigger.refresh())
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }

    const slug = pathname.startsWith('/work/') ? pathname.slice('/work/'.length) : undefined
    const project = projectBySlug(slug)
    document.title = project ? `${project.title} | Siddharth Narava` : 'Siddharth Narava | Full Stack Developer'
  }, [pathname])

  return null
}
