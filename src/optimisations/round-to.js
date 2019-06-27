export default function roundTo(v, digits = 1) {
  if (Number.isFinite(v)) {
    const f = 10 ** digits;
    return Math.round(v * f) / f;
  }
  return v;
}
