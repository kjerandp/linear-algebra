
export function argumentsToList(arg, rec = true, values = []) {
  if (arg && arg._values) {
    arg = arg._values;
  }
  if (rec && Array.isArray(arg)) {
    arg.forEach(v => argumentsToList(v, rec, values));
  } else {
    values.push(arg);
  }
  return values;
}

export function range(size, start = 0, step = 1) {
  const arr = new Array(size);
  for (let i = 0; i < size; i++) {
    arr[i] = start + (i * step);
  }
  return arr;
}
