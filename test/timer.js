export function timer(func) {
  const s = new Date().getTime();
  const r = func();
  return [r, new Date().getTime() - s];
}

export function timerAsync(func) {
  const s = new Date().getTime();
  return func().then(fulfilled => [fulfilled, new Date().getTime() - s]);
}
