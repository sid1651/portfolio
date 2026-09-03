import { Outlet } from 'react-router-dom'
import { RouteEffects } from './RouteEffects'

export function AppLayout() {
  return (
    <>
      <RouteEffects />
      <Outlet />
    </>
  )
}
