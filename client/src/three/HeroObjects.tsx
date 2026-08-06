import Stage from './Stage';
import HeroScene from './scenes/HeroScene';
import type { Quality } from './capabilities';

/**
 * Hero WebGL layer. Loaded lazily by <Hero /> — this module is the
 * entry point of the three.js chunk, so nothing 3D ships in the
 * initial bundle.
 */
export default function HeroObjects({ quality }: { quality: Quality }) {
  return (
    <Stage
      className="hero__three"
      cameraPosition={[0, 0, 9]}
      fov={40}
      dpr={quality === 'high' ? [1, 1.75] : [1, 1.25]}
    >
      <HeroScene quality={quality} />
    </Stage>
  );
}
