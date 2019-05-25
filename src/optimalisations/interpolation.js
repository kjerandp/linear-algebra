export function clamp(v, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v));
}

export function mix(a, b, t) {
  const m = clamp(t);
  return a * (1 - m) + b * m;
}

export function step(edge, x) {
  return x >= edge ? 1 : 0;
}

export function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3.0 - 2.0 * t);
}

