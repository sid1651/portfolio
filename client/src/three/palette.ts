/* ============================================================
   SCENE PALETTE — keeps the 3D layer in sync with the CSS theme
   ------------------------------------------------------------
   Values mirror the accent tokens in index.css so the WebGL
   objects read as part of the same design system in both themes.
   ============================================================ */

export type ThemeMode = 'dark' | 'light';

export interface ScenePalette {
  /* Brand accents (match --accent-1 / 2 / 3) */
  accent1: string;
  accent2: string;
  accent3: string;

  /* Object base colours */
  metal: string;
  shell: string;

  /* Environment surround + frontal fill — what the metals reflect */
  surround: string;
  fill: string;

  /* Particles */
  dust: string;
  dustOpacity: number;
  dustAdditive: boolean;

  /* Lighting */
  ambient: number;
  keyIntensity: number;
  envIntensity: number;
  lightformer: number;
}

export const PALETTES: Record<ThemeMode, ScenePalette> = {
  dark: {
    accent1: '#6c5ce7',
    accent2: '#00cec9',
    accent3: '#fd79a8',

    metal: '#2b2740',
    shell: '#8f86ff',

    surround: '#191927',
    fill: '#b9bad6',

    dust: '#a9a3e8',
    dustOpacity: 0.38,
    dustAdditive: true,

    ambient: 0.35,
    keyIntensity: 1.1,
    envIntensity: 1.15,
    lightformer: 1,
  },

  light: {
    accent1: '#5a4bd1',
    accent2: '#00b4a6',
    accent3: '#e8638c',

    metal: '#c8c4e6',
    shell: '#6f63d8',

    surround: '#e9e9f4',
    fill: '#ffffff',

    dust: '#7d78b8',
    dustOpacity: 0.4,
    dustAdditive: false,

    ambient: 0.85,
    keyIntensity: 1.9,
    envIntensity: 0.85,
    lightformer: 0.7,
  },
};
