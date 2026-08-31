import { render, screen } from '@testing-library/react'
import { RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { makeMemoryRouter } from './router'

describe('portfolio router', () => {
  it('redirects an unknown project route to the home flight plan', async () => {
    render(<RouterProvider router={makeMemoryRouter(['/work/not-real'])} />)

    expect(await screen.findByRole('main', { name: /flight plan/i })).toBeVisible()
  })
})
