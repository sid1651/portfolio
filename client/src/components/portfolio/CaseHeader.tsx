import { ArrowLeft, Moon, Sun } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'

export function CaseHeader() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="case-header">
      <div className="page-shell case-header__inner">
        <Link className="case-header__back" to="/">
          <ArrowLeft size={18} weight="bold" aria-hidden="true" />
          All work
        </Link>
        <Link className="site-mark" to="/" aria-label="Narava Venkat Siddharth home">
          <span>SN</span>
        </Link>
        <button
          className="case-header__theme"
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>
      </div>
    </header>
  )
}
