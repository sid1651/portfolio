import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { PALETTES } from '../palette';
import type { Quality } from '../capabilities';
import { useThemeMode, usePointer } from '../hooks';
import { createRng } from '../rng';
import { Appear, ParallaxRig, SceneLighting, Spin } from './shared';

/* ============================================================
   NODES
   Small emissive spheres placed on a Fibonacci sphere, so the
   distribution reads as even from every angle.
   ============================================================ */
function Nodes({ count, radius, color }: { count: number; radius: number; color: string }) {
  const mesh = useRef<THREE.InstancedMesh>(null);

  const matrices = useMemo(() => {
    const golden = Math.PI * (3 - Math.sqrt(5));
    const dummy = new THREE.Object3D();
    const rand = createRng(count * 104729);

    return Array.from({ length: count }, (_, i) => {
      const y = 1 - (i / (count - 1)) * 2;
      const ring = Math.sqrt(1 - y * y);
      const theta = golden * i;

      dummy.position.set(
        Math.cos(theta) * ring * radius,
        y * radius,
        Math.sin(theta) * ring * radius,
      );
      dummy.scale.setScalar(0.7 + rand() * 0.6);
      dummy.updateMatrix();
      return dummy.matrix.clone();
    });
  }, [count, radius]);

  useFrame(() => {
    const m = mesh.current;
    if (!m || m.userData.placed) return;
    matrices.forEach((matrix, i) => m.setMatrixAt(i, matrix));
    m.instanceMatrix.needsUpdate = true;
    m.userData.placed = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.018, 10, 10]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} />
    </instancedMesh>
  );
}

/* ============================================================
   ORB SCENE
   A wireframe shell around an iridescent core — the "tech
   arsenal" motif behind the Skills heading.
   ============================================================ */
export default function OrbScene({ quality }: { quality: Quality }) {
  const mode = useThemeMode();
  const palette = PALETTES[mode];
  const pointer = usePointer();

  const shellGeometry = useMemo(() => new THREE.IcosahedronGeometry(1.55, 1), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(shellGeometry), [shellGeometry]);

  return (
    <>
      <SceneLighting palette={palette} mode={mode} resolution={128} />

      <ParallaxRig pointer={pointer} strength={1.6}>
        <Float speed={1} rotationIntensity={0.25} floatIntensity={0.8} floatingRange={[-0.12, 0.12]}>
          <Appear delay={0.1}>
            {/* Wireframe shell */}
            <Spin speed={[0.03, 0.11, 0]}>
              <lineSegments geometry={edges}>
                <lineBasicMaterial
                  color={palette.accent1}
                  transparent
                  opacity={mode === 'dark' ? 0.45 : 0.35}
                />
              </lineSegments>
              <Nodes count={quality === 'high' ? 42 : 24} radius={1.55} color={palette.accent2} />
            </Spin>

            {/* Iridescent core */}
            <Spin speed={[-0.08, -0.14, 0.03]}>
              <mesh scale={0.32}>
                <icosahedronGeometry args={[1, 1]} />
                <meshPhysicalMaterial
                  color={palette.metal}
                  metalness={1}
                  roughness={0.32}
                  iridescence={0.22}
                  iridescenceIOR={1.4}
                  iridescenceThicknessRange={[180, 500]}
                  clearcoat={1}
                  clearcoatRoughness={0.25}
                  envMapIntensity={palette.envIntensity}
                  flatShading
                />
              </mesh>
            </Spin>

            {/* Tilted orbital ring */}
            <Spin speed={[0, 0.18, 0]}>
              <mesh rotation={[Math.PI / 2.4, 0, 0.4]} scale={2.05}>
                <torusGeometry args={[1, 0.006, 10, 140]} />
                <meshBasicMaterial
                  color={palette.accent3}
                  transparent
                  opacity={mode === 'dark' ? 0.4 : 0.35}
                />
              </mesh>
            </Spin>
          </Appear>
        </Float>

        <Sparkles
          count={quality === 'high' ? 44 : 24}
          scale={5}
          size={1.8}
          speed={0.3}
          noise={0.4}
          opacity={mode === 'dark' ? 0.5 : 0.35}
          color={palette.accent2}
        />
      </ParallaxRig>
    </>
  );
}
