
export default op => (v, digits = 1) => {
  if (op.isFinite(v)) {
    const f = op.pow(op.identity(10), op.identity(digits));
    return op.divide(op.round(op.multiply(v, f)), f);
  }
  return v;
};
