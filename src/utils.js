import { Matrix } from './matrix';
import { Vector } from './vector';

export function standardizeArgument(arg, matrixForm = false) {
  let res = [];

  if (Number.isFinite(arg)) {
    res.push(matrixForm ? [arg] : arg);
  } else if (arg instanceof Vector) {
    res = matrixForm ? arg.value.map(v => [v]) : arg.value;
  } else if (arg instanceof Matrix) {
    res = matrixForm ? arg.value : arg.flatten();
  } else if (Array.isArray(arg) && Number.isFinite(arg[0])) {
    res = matrixForm ? arg.map(v => [v]) : arg;
  } else if (Array.isArray(arg) && Array.isArray(arg[0])) {
    res = matrixForm ? arg : arg.reduce((arr, el) => [...arr, ...el], []);
  } else {
    res = arg;
  }

  return res;
}

export function argumentsToList(arg, values = []) {
  // if (arg._values) {
  //   arg = arg._values;
  // }
  if (Array.isArray(arg)) {
    arg.forEach(v => argumentsToList(v, values));
  } else {
    values.push(arg);
  }
  return values;
}

