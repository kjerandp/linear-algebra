export function timer(func) {
  const s = new Date().getTime();
  const r = func();
  return [r, new Date().getTime() - s];
}

export function timerAsync(func, done) {
  const s = new Date().getTime();
  return () => func().then((fulfilled) => {
    done();
    return [fulfilled, new Date().getTime() - s];
  });
}
