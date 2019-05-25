export const clamp = op => (v, min, max) => {
  if (op.isLessThan(v, min)) return min;
  if (op.isLessThan(max, v)) return max;
  return v;
};

export const mix = (op) => {
  const clampFunc = clamp(op);
  return (a, b, t) => {
    // a * (1 - m) + b * m
    const m = clampFunc(t, op.zero(), op.identity(), op);
    return op.add(
      op.multiply(a, (op.subtract(op.identity(), m))),
      op.multiply(b, m),
    );
  };
};

export const step = op => (edge, x) => (
  (op.isLessThan(edge, x) || op.isEqual(edge, x)) ? op.identity() : op.zero()
);

export const smoothstep = (op) => {
  const clampFunc = clamp(op);
  return (edge0, edge1, x) => {
    // t * t * (3.0 - 2.0 * t)
    const t = clampFunc(
      op.divide(op.subtract(x, edge0), op.subtract(edge1, edge0)),
      op.zero(),
      op.identity(),
      op,
    );

    return op.multiply(
      op.multiply(t, t),
      op.subtract(op.identity(3), op.multiply(op.identity(2), t)),
    );
  };
};
