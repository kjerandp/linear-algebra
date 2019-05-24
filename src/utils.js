
export function argumentsToList(arg, values = []) {
  if (arg && arg._values) {
    arg = arg._values;
  }
  if (Array.isArray(arg)) {
    arg.forEach(v => argumentsToList(v, values));
  } else {
    values.push(arg);
  }
  return values;
}

export function nTimes(n, cb) {
  for (let i = 0; i < n; i++) {
    cb(i);
  }
}

export function range(size, start = 0, step = 1) {
  const arr = new Array(size);
  for (let i = 0; i < size; i++) {
    arr[i] = start + (i * step);
  }
  return arr;
}
