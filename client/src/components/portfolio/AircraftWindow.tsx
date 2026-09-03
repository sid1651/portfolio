import { motion, useReducedMotion } from 'motion/react'
import type { Theme } from '../../hooks/useTheme'

type AircraftWindowProps = {
  theme: Theme
  onToggle: () => void
}

export function AircraftWindow({ theme, onToggle }: AircraftWindowProps) {
  const reduceMotion = useReducedMotion()
  const isDark = theme === 'dark'
  const action = isDark
    ? 'Open window shade for light mode'
    : 'Close window shade for dark mode'

  return (
    <div className="window-scene">
      <div className="window-cabin-line window-cabin-line--top" aria-hidden="true" />
      <div className="aircraft-window-frame">
        <button
          className="aircraft-window"
          type="button"
          aria-label={action}
          aria-pressed={isDark}
          aria-describedby="window-instruction"
          onClick={onToggle}
        >
          <img
            className="aircraft-window__image"
            src="/media/cloudscape.avif"
            alt="Cloudscape seen through an airplane window"
            width="1536"
            height="1024"
            fetchPriority="high"
          />
          <span className="aircraft-window__glass" aria-hidden="true" />
          <motion.span
            className="aircraft-window__shade"
            aria-hidden="true"
            initial={false}
            animate={{ y: isDark ? '0%' : '-86%' }}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 110, damping: 19 }}
          >
            <span className="aircraft-window__shade-ribs" />
            <span className="aircraft-window__handle" />
          </motion.span>
        </button>
      </div>
      <p className="window-instruction" id="window-instruction">
        {isDark ? 'Open the shade for daylight' : 'Close the shade for night mode'}
      </p>
      <div className="window-cabin-line window-cabin-line--bottom" aria-hidden="true" />
    </div>
  )
}
