import Stage from './Stage';
import OrbScene from './scenes/OrbScene';
import type { Quality } from './capabilities';

/**
 * Decorative orb behind the Skills heading. Shares the three.js
 * chunk with the hero layer, so it costs no extra download once
 * the hero scene has loaded.
 */
export default function SkillsOrb({ quality }: { quality: Quality }) {
  return (
    <Stage
      className="skills-orb__stage"
      cameraPosition={[0, 0, 6]}
      fov={40}
      dpr={quality === 'high' ? [1, 1.6] : [1, 1.25]}
    >
      <OrbScene quality={quality} />
    </Stage>
  );
}
