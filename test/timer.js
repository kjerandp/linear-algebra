export default (f) => {
  const s = new Date().getTime();
  const r = f();
  return [r, new Date().getTime() - s];
};
