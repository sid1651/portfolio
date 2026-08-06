import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { PALETTES } from '../palette';
import type { ScenePalette } from '../palette';
import type { Quality } from '../capabilities';
import { useThemeMode, usePointer } from '../hooks';
import { Appear, Dust, ParallaxRig, SceneLighting, Spin } from './shared';

/* ============================================================
   MATERIALS
   ============================================================ */

/**
 * Brushed, faintly iridescent metal. The iridescence is deliberately
 * restrained — enough for the accent colours to bloom across a curve,
 * not so much that the objects turn into rainbows.
 */
function IridescentMetal({
  palette,
  color,
  roughness = 0.24,
  iridescence = 0.45,
}: {
  palette: ScenePalette;
  color?: string;
  roughness?: number;
  iridescence?: number;
}) {
  return (
    <meshPhysicalMaterial
      color={color ?? palette.metal}
      metalness={1}
      roughness={roughness}
      iridescence={iridescence}
      iridescenceIOR={1.35}
      iridescenceThicknessRange={[180, 480]}
      clearcoat={1}
      clearcoatRoughness={0.3}
      envMapIntensity={palette.envIntensity}
    />
  );
}

/**
 * Faceted gem. Flat shading gives every face its own clean specular
 * response, which reads far crisper against a dark page than a
 * refractive material would — glass needs bright surroundings to
 * refract, and this hero has none.
 */
function Gem({ palette, scale }: { palette: ScenePalette; scale: number }) {
  return (
    <mesh scale={scale}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial
        color={palette.metal}
        metalness={1}
        roughness={0.26}
        iridescence={0.5}
        iridescenceIOR={1.4}
        iridescenceThicknessRange={[160, 520]}
        clearcoat={1}
        clearcoatRoughness={0.2}
        envMapIntensity={palette.envIntensity}
        flatShading
      />
    </mesh>
  );
}

/* ============================================================
   LAYOUT
   Object placement is derived from the projected viewport so the
   artifacts always frame the hero copy instead of colliding with
   it — wide screens push them to the margins, portrait screens
   move them to the top and bottom corners.
   ============================================================ */
interface Placement {
  position: [number, number, number];
  scale: number;
}

interface HeroLayout {
  knot: Placement;
  crystal: Placement;
  octahedron: Placement | null;
  ring: Placement | null;
  orb: Placement | null;
  dustCount: number;
  dustRadius: number;
}

function useHeroLayout(quality: Quality): HeroLayout {
  const width = useThree((state) => state.viewport.width);
  const height = useThree((state) => state.viewport.height);
  const cameraZ = useThree((state) => state.camera.position.z);

  return useMemo(() => {
    /**
     * Places an object at a screen-space fraction of the half-viewport
     * (-1 … 1) regardless of its depth: pushing something back would
     * otherwise drag it toward the centre of frame — and into the copy.
     */
    const place = (fx: number, fy: number, z: number, scale: number): Placement => {
      const depth = (cameraZ - z) / cameraZ;
      return {
        position: [(width / 2) * fx * depth, (height / 2) * fy * depth, z],
        scale: scale * depth,
      };
    };

    const portrait = width / height < 1.05;

    if (portrait) {
      /* Phones: two small accents in opposite corners. Anything larger
         crowds the copy, which runs the full width here. */
      return {
        knot: place(0.58, 0.74, -3, 0.24),
        crystal: place(-0.62, -0.8, -2, 0.2),
        octahedron: null,
        ring: null,
        orb: null,
        dustCount: 90,
        dustRadius: Math.max(width, height) * 0.7,
      };
    }

    return {
      knot: place(0.73, 0.4, -3, 0.54),
      crystal: place(-0.8, -0.36, -2, 0.46),
      octahedron: place(-0.72, 0.58, -4.5, 0.3),
      ring: place(0.66, -0.68, -3.5, 0.42),
      orb: quality === 'high' ? place(0.88, -0.14, -6, 0.24) : null,
      dustCount: quality === 'high' ? 260 : 160,
      dustRadius: Math.max(width, height) * 0.9,
    };
  }, [width, height, cameraZ, quality]);
}

/* ============================================================
   HERO SCENE
   ============================================================ */
export default function HeroScene({ quality }: { quality: Quality }) {
  const mode = useThemeMode();
  const palette = PALETTES[mode];
  const pointer = usePointer();
  const layout = useHeroLayout(quality);

  return (
    <>
      <SceneLighting palette={palette} mode={mode} resolution={quality === 'high' ? 256 : 128} />

      <ParallaxRig pointer={pointer}>
        {/* Iridescent torus knot — the focal artifact */}
        <Float
          position={layout.knot.position}
          speed={1.1}
          rotationIntensity={0.5}
          floatIntensity={1.1}
          floatingRange={[-0.18, 0.18]}
        >
          <Appear delay={0.15}>
            <Spin speed={[0.06, 0.15, 0.02]}>
              <mesh scale={layout.knot.scale}>
                <torusKnotGeometry args={[1, 0.3, quality === 'high' ? 220 : 128, 32]} />
                <IridescentMetal palette={palette} />
              </mesh>
            </Spin>
          </Appear>
        </Float>

        {/* Faceted gem */}
        <Float
          position={layout.crystal.position}
          speed={0.9}
          rotationIntensity={0.7}
          floatIntensity={1.3}
          floatingRange={[-0.22, 0.22]}
        >
          <Appear delay={0.35}>
            <Spin speed={[0.1, -0.09, 0.04]}>
              <Gem palette={palette} scale={layout.crystal.scale} />
            </Spin>
          </Appear>
        </Float>

        {/* Chrome octahedron */}
        {layout.octahedron && (
          <Float
            position={layout.octahedron.position}
            speed={1.4}
            rotationIntensity={0.9}
            floatIntensity={1.6}
            floatingRange={[-0.25, 0.25]}
          >
            <Appear delay={0.55}>
              <Spin speed={[0.14, 0.2, -0.05]}>
                <mesh scale={layout.octahedron.scale}>
                  <octahedronGeometry args={[1, 0]} />
                  <IridescentMetal
                    palette={palette}
                    color={palette.shell}
                    roughness={0.32}
                    iridescence={0.3}
                  />
                </mesh>
              </Spin>
            </Appear>
          </Float>
        )}

        {/* Slim accent ring */}
        {layout.ring && (
          <Float
            position={layout.ring.position}
            rotation={[0.55, 0.15, 0.3]}
            speed={1.2}
            rotationIntensity={0.3}
            floatIntensity={1.4}
            floatingRange={[-0.2, 0.2]}
          >
            <Appear delay={0.75}>
              <Spin speed={[0.02, 0.05, 0.12]}>
                <mesh scale={layout.ring.scale}>
                  <torusGeometry args={[1, 0.085, 24, 120]} />
                  <IridescentMetal
                    palette={palette}
                    color={palette.accent2}
                    roughness={0.15}
                    iridescence={0.25}
                  />
                </mesh>
              </Spin>
            </Appear>
          </Float>
        )}

        {/* Distant polished orb for depth */}
        {layout.orb && (
          <Float
            position={layout.orb.position}
            speed={0.8}
            rotationIntensity={0.3}
            floatIntensity={1}
          >
            <Appear delay={0.95}>
              <mesh scale={layout.orb.scale}>
                <sphereGeometry args={[1, 48, 48]} />
                <IridescentMetal
                  palette={palette}
                  color={palette.accent1}
                  roughness={0.14}
                  iridescence={0.5}
                />
              </mesh>
            </Appear>
          </Float>
        )}

        <Dust count={layout.dustCount} radius={layout.dustRadius} palette={palette} />
      </ParallaxRig>
    </>
  );
}
