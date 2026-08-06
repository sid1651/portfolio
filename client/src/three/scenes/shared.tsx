import { useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { createRng } from '../rng';
import type { ScenePalette, ThemeMode } from '../palette';
import type { Pointer } from '../hooks';

/* ============================================================
   PARALLAX RIG
   Whole-scene cursor parallax with frame-rate independent
   damping, so the objects feel weighted rather than glued
   to the pointer.
   ============================================================ */
interface ParallaxRigProps {
  pointer: React.RefObject<Pointer>;
  children: ReactNode;
  /** 0 disables, 1 is the hero-strength default. */
  strength?: number;
}

export function ParallaxRig({ pointer, children, strength = 1 }: ParallaxRigProps) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;

    const { x, y } = pointer.current;
    const dt = Math.min(delta, 0.1);

    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, x * 0.22 * strength, 2.4, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -y * 0.16 * strength, 2.4, dt);
    g.position.x = THREE.MathUtils.damp(g.position.x, x * 0.45 * strength, 2, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, y * 0.3 * strength, 2, dt);
  });

  return <group ref={group}>{children}</group>;
}

/* ============================================================
   APPEAR
   Staggered scale-in entrance matching the CSS ease-out-quart
   used by the rest of the page.
   ============================================================ */
interface AppearProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

export function Appear({ children, delay = 0, duration = 1.1 }: AppearProps) {
  const group = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const done = useRef(false);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g || done.current) return;

    elapsed.current += Math.min(delta, 0.1);
    const t = THREE.MathUtils.clamp((elapsed.current - delay) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - t, 4);

    g.visible = t > 0;
    g.scale.setScalar(eased);
    if (t === 1) done.current = true;
  });

  return (
    <group ref={group} scale={0} visible={false}>
      {children}
    </group>
  );
}

/* ============================================================
   SPIN
   Continuous multi-axis rotation.
   ============================================================ */
interface SpinProps {
  children: ReactNode;
  speed?: [number, number, number];
}

export function Spin({ children, speed = [0.05, 0.12, 0] }: SpinProps) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 0.1);
    g.rotation.x += speed[0] * dt;
    g.rotation.y += speed[1] * dt;
    g.rotation.z += speed[2] * dt;
  });

  return <group ref={group}>{children}</group>;
}

/* ============================================================
   DUST
   Depth-cued particle field. Additive in dark mode for a glow,
   plain alpha in light mode so it reads as fine grain.
   ============================================================ */
interface DustProps {
  count: number;
  radius: number;
  palette: ScenePalette;
  size?: number;
}

export function Dust({ count, radius, palette, size = 0.035 }: DustProps) {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    const rand = createRng(count * 7919 + Math.round(radius * 100));

    for (let i = 0; i < count; i++) {
      // Spherical shell distribution — denser toward the outside,
      // which keeps the middle of the screen (the copy) clear.
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const r = radius * (0.45 + rand() * 0.55);

      array[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      array[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      array[i * 3 + 2] = r * Math.cos(phi) * 0.5;
    }
    return array;
  }, [count, radius]);

  useFrame((state, delta) => {
    const p = points.current;
    if (!p) return;
    const dt = Math.min(delta, 0.1);
    p.rotation.y += dt * 0.025;
    p.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.08;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        sizeAttenuation
        transparent
        depthWrite={false}
        opacity={palette.dustOpacity}
        color={palette.dust}
        blending={palette.dustAdditive ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}

/* ============================================================
   LIGHTING
   A studio rig built entirely from lightformers — no external
   HDRI request, so the scene works offline and adds no network
   weight. Baked once per theme (`key` remounts on change).
   ============================================================ */
interface SceneLightingProps {
  palette: ScenePalette;
  mode: ThemeMode;
  resolution?: number;
}

export function SceneLighting({ palette, mode, resolution = 256 }: SceneLightingProps) {
  const l = palette.lightformer;

  return (
    <>
      <ambientLight intensity={palette.ambient} />
      <directionalLight position={[4, 6, 6]} intensity={palette.keyIntensity} />
      <pointLight position={[-5, -2, 3]} intensity={22} distance={16} color={palette.accent1} />
      <pointLight position={[5, 3, 2]} intensity={16} distance={16} color={palette.accent2} />

      <Environment key={mode} resolution={resolution} frames={1}>
        {/* Surround. Without it, polished metal reflects pure black and
            the objects read as flat silhouettes with colour blotches. */}
        <mesh scale={40}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshBasicMaterial color={palette.surround} side={THREE.BackSide} />
        </mesh>

        {/* Softbox above — the broad highlight that defines each form */}
        <Lightformer
          form="rect"
          intensity={2.6 * l}
          position={[0, 6, -2]}
          rotation-x={Math.PI / 2}
          scale={[16, 10, 1]}
          color="#ffffff"
        />
        {/* Frontal fill from behind the camera — clean specular streak */}
        <Lightformer
          form="rect"
          intensity={1.4 * l}
          position={[0, 2, 9]}
          scale={[14, 9, 1]}
          color={palette.fill}
        />
        {/* Purple rim from the left */}
        <Lightformer
          form="rect"
          intensity={3 * l}
          position={[-7, 1, 2]}
          rotation-y={Math.PI / 2}
          scale={[10, 8, 1]}
          color={palette.accent1}
        />
        {/* Teal rim from the right */}
        <Lightformer
          form="rect"
          intensity={2.6 * l}
          position={[7, -1, 2]}
          rotation-y={-Math.PI / 2}
          scale={[10, 8, 1]}
          color={palette.accent2}
        />
        {/* Pink bounce from below */}
        <Lightformer
          form="circle"
          intensity={1.4 * l}
          position={[0, -6, 2]}
          rotation-x={-Math.PI / 2}
          scale={8}
          color={palette.accent3}
        />
      </Environment>
    </>
  );
}
