import { useState } from 'react'
import { ImageBroken } from '@phosphor-icons/react'

type ProjectVisualProps = {
  src: string
  alt: string
  eager?: boolean
}

export function ProjectVisual({ src, alt, eager = false }: ProjectVisualProps) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  return (
    <span className={`project-visual project-visual--${status}`}>
      {status === 'loading' && <span className="project-visual__skeleton" aria-hidden="true" />}
      {status !== 'error' && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          onLoad={() => setStatus('ready')}
          onError={() => setStatus('error')}
        />
      )}
      {status === 'error' && (
        <span className="project-visual__error" role="img" aria-label={`${alt}. Image unavailable.`}>
          <ImageBroken size={26} weight="light" aria-hidden="true" />
          <span>Preview unavailable</span>
        </span>
      )}
    </span>
  )
}
