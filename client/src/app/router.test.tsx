import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { makeMemoryRouter } from './router'

afterEach(() => {
  cleanup()
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

describe('portfolio router', () => {
  it('renders the complete portfolio surface on the home route', async () => {
    render(<RouterProvider router={makeMemoryRouter(['/'])} />)

    expect(await screen.findByRole('navigation', { name: /main navigation/i })).toBeVisible()
    expect(screen.getByRole('heading', { level: 1, name: /narava venkat siddharth/i })).toBeVisible()
    expect(screen.getByRole('img', { name: /cloudscape seen through an airplane window/i })).toBeVisible()
    expect(screen.getByRole('heading', { name: /selected work/i })).toBeVisible()
  })

  it('uses the airplane shade to switch and persist the site theme', async () => {
    const user = userEvent.setup()
    render(<RouterProvider router={makeMemoryRouter(['/'])} />)

    const themeControl = await screen.findByRole('button', { name: /close window shade for dark mode/i })
    await user.click(themeControl)

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    expect(localStorage.getItem('siddharth-air:theme')).toBe('dark')
    expect(themeControl).toHaveAccessibleName(/open window shade for light mode/i)
  })

  it('renders a complete case study for a known project route', async () => {
    render(<RouterProvider router={makeMemoryRouter(['/work/lumaloop'])} />)

    expect(await screen.findByRole('main', { name: /lumaloop case study/i })).toBeVisible()
    expect(screen.getByRole('heading', { level: 1, name: /lumaloop/i })).toBeVisible()
    expect(screen.getByRole('link', { name: /view live project/i })).toHaveAttribute(
      'href',
      'https://amino-clone-jade.vercel.app/',
    )
  })

  it('redirects an unknown project route to the home flight plan', async () => {
    render(<RouterProvider router={makeMemoryRouter(['/work/not-real'])} />)

    expect(await screen.findByRole('main', { name: /flight plan/i })).toBeVisible()
  })
})
