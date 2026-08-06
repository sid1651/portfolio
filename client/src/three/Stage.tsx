import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { useCanvasActive } from './hooks';
import './Stage.css';

interface StageProps {
  /** Class applied to the positioning wrapper (the canvas fills it). */
  className?: string;
  children: ReactNode;
  cameraPosition?: [number, number, number];
  fov?: number;
  /** Device-pixel-ratio clamp — keeps fill-rate sane on retina displays. */
  dpr?: [number, number];
}

/**
 * Shared <Canvas> host for every 3D scene in the portfolio.
 *
 * Responsibilities:
 *  - freezes the render loop while off-screen or in a background tab
 *  - clamps DPR and keeps the buffer transparent so the CSS background
 *    and theme transitions continue to show through
 *  - stays non-interactive: the 3D layer is decoration, never a target
 */
export default function Stage({
  className,
  children,
  cameraPosition = [0, 0, 9],
  fov = 40,
  dpr = [1, 1.75],
}: StageProps) {
  const { ref, active } = useCanvasActive<HTMLDivElement>();

  return (
    <div ref={ref} className={`stage ${className ?? ''}`.trim()} aria-hidden="true">
      <Canvas
        className="stage__canvas"
        frameloop={active ? 'always' : 'never'}
        dpr={dpr}
        camera={{ position: cameraPosition, fov, near: 0.1, far: 60 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
        }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
