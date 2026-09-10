import { PARALLAX_DEPTH } from './config';

export function calculateParallaxOffset(
  scrollY: number,
  elementTop: number,
  depthType: keyof typeof PARALLAX_DEPTH,
  windowHeight: number
): number {
  const depth = PARALLAX_DEPTH[depthType];
  const relativeDistance = scrollY - elementTop + windowHeight * 0.5;
  return -relativeDistance * depth;
}
