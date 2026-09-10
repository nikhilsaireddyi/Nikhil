export const MOTION_TIMING = {
  micro: 200,
  ui: 400,
  section: 800,
  hero: 1800,
  atmospheric: 16000,
} as const;

export const PARALLAX_DEPTH = {
  background: 0.05,
  grid: 0.1,
  typography: 0.15,
  images: 0.25,
  foreground: 0.35,
} as const;

export const MAGNETIC_CONFIG = {
  maxAttraction: 12,
  friction: 0.15,
} as const;
