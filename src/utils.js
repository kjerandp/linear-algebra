
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

