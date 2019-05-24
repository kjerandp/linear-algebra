export function clamp(v, min, max, op) {
  if (op.isLessThan(v, min)) return min;
  if (op.isLessThan(max, v)) return max;
  return v;
}

export function mix(a, b, t, op) {
  // a * (1 - m) + b * m
  const m = clamp(t, op.zero(), op.identity(), op);
  return op.add(
    op.multiply(a, (op.subtract(op.identity(), m))),
    op.multiply(b, m),
  );
}

export function step(edge, x, op) {
  return (op.isLessThan(edge, x) || op.isEqual(edge, x)) ? op.identity() : op.zero();
}

export function smoothstep(edge0, edge1, x, op) {
  const two = op.add(op.identity(), op.identity());
  const three = op.add(two, op.identity());
  // t * t * (3.0 - 2.0 * t)
  const t = clamp(
    op.divide(op.subtract(x, edge0), op.subtract(edge1, edge0)),
    op.zero(),
    op.identity(),
    op,
  );

  return op.multiply(
    op.multiply(t, t),
    op.subtract(three, op.multiply(two, t)),
  );
}
