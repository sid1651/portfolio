import { Navigate, Outlet, createBrowserRouter, createMemoryRouter } from 'react-router-dom'
import CaseStudyPage from '../pages/CaseStudyPage'
import HomePage from '../pages/HomePage'
import { RouteEffects } from './RouteEffects'

function AppLayout() {
  return <><RouteEffects /><Outlet /></>
}

export const routes = [{
  element: <AppLayout />,
  children: [
    { path: '/', element: <HomePage /> },
    { path: '/work/:slug', element: <CaseStudyPage /> },
    { path: '*', element: <Navigate to="/" replace /> },
  ],
}]

export const router = createBrowserRouter(routes)
export const makeMemoryRouter = (initialEntries: string[]) => createMemoryRouter(routes, { initialEntries })
