import { useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { SmoothScroll } from '../animation/SmoothScroll'
import { gsap, useGSAP } from '../animation/gsap'
import { CaseHeader } from '../components/portfolio/CaseHeader'
import { SiteHeader } from '../components/portfolio/SiteHeader'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { RouteEffects } from './RouteEffects'

function RouteView() {
  const { pathname } = useLocation()
  const view = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useGSAP(() => {
    if (reduced || !view.current) return
    gsap.fromTo(view.current, { opacity: 0 }, { opacity: 1, duration: 0.55, ease: 'power2.out' })
  }, { dependencies: [pathname] })

  return (
    <div className="route-view" ref={view}>
      <Outlet />
    </div>
  )
}

export function AppLayout() {
  const { pathname } = useLocation()
  const isCaseStudy = pathname.startsWith('/work/')

  return (
    <>
      <RouteEffects />
      <a className="skip-link" href={isCaseStudy ? '#case-content' : '#main-content'}>
        Skip to content
      </a>
      {isCaseStudy ? <CaseHeader /> : <SiteHeader />}
      <SmoothScroll>
        <RouteView />
      </SmoothScroll>
    </>
  )
}
