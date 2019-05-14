import Vector from './Vector';
import Matrix from './Matrix';
import { mixValue, clampValue } from './internal';
import {
  DEG2RAD,
  RAD2DEG,
} from './constants';

export function dot(a, b) {
  return a.dot(b);
}

export function cross(a, b) {
  if (a instanceof Vector && b instanceof Vector) {
    return a.cross(b);
  }
  throw Error('Only defined for vectors!');
}

export function triple(a, b, c) {
  if (a instanceof Vector && b instanceof Vector && c instanceof Vector) {
    return dot(a, cross(b, c));
  }
  throw Error('Only defined for vectors!');
}

export function mix(a, b, t) {
  if (typeof (a) === 'object' || typeof (b) === 'object') {
    if (a.constructor !== b.constructor)
      throw Error('Unable to mix different types!');

    const isVector = a instanceof Vector;
    const va = isVector ? a.value : a;
    const vb = isVector ? b.value : b;
    if (va.length !== vb.length)
      throw Error('Values must have the same number of components!');

    let ts = va.map(() => t);

    if (t instanceof Vector) {
      ts = t.value;
    } else if (Array.isArray(t)) {
      ts = t;
    }

    if (ts.length !== va.length)
      throw Error('Invalid argument of t!');

    const mixed = ts.map((m, i) => mixValue(va[i], vb[i], m));

    if (isVector) {
      return new Vector().dimensions(a.dim).fill(mixed);
    }
    return mixed;
  } else if (Number.isFinite(a)) {
    return mixValue(a, b, t);
  }
  throw Error('Invalid input value!');
}

export function clamp(val, min = 0, max = 1) {
  if (Array.isArray(val) && val.every(v => Number.isFinite(v))) {
    val.forEach((v, i) => {
      val[i] = clampValue(v);
    });
    return val;
  } else if (val instanceof Vector || val instanceof Matrix) {
    return val.clamp(min, max);
  } else if (Number.isFinite(val)) {
    return clampValue(val);
  }
  throw Error('Invalid input value!');
}

export function det(m) {
  if (m instanceof Matrix) {
    return m.det();
  }
  throw Error('Only defined for matrices!');
}

export function inv(m) {
  if (m instanceof Matrix) {
    return m.inverse();
  }
  throw Error('Only defined for matrices!');
}


export const rad = d => d * DEG2RAD;

export const deg = r => r * RAD2DEG;
