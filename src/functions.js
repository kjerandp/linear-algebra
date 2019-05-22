import { Vector } from './vector';
import { Matrix } from './matrix';
import {
  mixValue,
  clampValue,
  stepValue,
  smoothstepValue,
} from './common';
import { standardizeArgument } from './utils';
import {
  DEG2RAD,
  RAD2DEG,
  TAU,
} from './constants';


export function add(a, b) {
  if (a.constructor !== b.constructor)
    throw Error('Unable to add different types!');
  return a.clone().add(b);
}

export function sub(a, b) {
  if (a.constructor !== b.constructor)
    throw Error('Unable to subtract different types!');
  return a.clone().sub(b);
}

export function scale(v, f) {
  if (!Number.isFinite(f) && v.constructor !== f.constructor)
    throw Error('Unable to scale different types!');
  return v.clone().scale(f);
}

export function length(v) {
  return v.length;
}


export function dot(a, b) {
  return a.dot(b);
}

export function cross(a, b) {
  if (a instanceof Vector && b instanceof Vector) {
    return a.cross(b);
  }
  throw Error('Only defined for vectors!');
}

export function norm(v) {
  if (v instanceof Vector) {
    return v.clone().normalize();
  }
  throw Error('Currently only defined for vectors!');
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

    const va = standardizeArgument(a);
    const vb = standardizeArgument(b);

    if (va.length !== vb.length)
      throw Error('Values must have the same number of components!');

    const ts = standardizeArgument(t);
    const mixed = va.map((v, i) => mixValue(v, vb[i], i < ts.length ? ts[i] : ts[0]));

    if (Array.isArray(a)) {
      return mixed;
    }
    return a.clone().fill(mixed);
  }
  return mixValue(a, b, t);
}

export function clamp(val, min = 0, max = 1) {
  if (Number.isFinite(val)) {
    return clampValue(val);
  }
  const arr = standardizeArgument(val);
  const clamped = arr.map(v => clampValue(v, min, max));
  if (Array.isArray(val)) return clamped;

  return val.clone().fill(clamped);
}

export function step(edge, x) {
  if (typeof (edge) === 'object' || typeof (x) === 'object') {
    if (edge.constructor !== x.constructor)
      throw Error('Unable to step using different input types!');

    const ve = standardizeArgument(edge);
    const vx = standardizeArgument(x);

    if (ve.length !== vx.length)
      throw Error('Inputs must have the same number of components!');

    const stepped = ve.map((v, i) => stepValue(v, vx[i]));

    if (Array.isArray(edge)) {
      return stepped;
    }
    return edge.clone().fill(stepped);
  }
  return stepValue(edge, x);
}

export function smoothstep(edge0, edge1, x) {
  if (typeof (edge0) === 'object' || typeof (edge1) === 'object' || typeof (x) === 'object') {
    if (edge0.constructor !== x.constructor || edge1.constructor !== x.constructor)
      throw Error('Unable to smoothstep using different input types!');

    const ve0 = standardizeArgument(edge0);
    const ve1 = standardizeArgument(edge1);
    const vx = standardizeArgument(x);

    if (ve0.length !== vx.length || ve1.length !== vx.length)
      throw Error('Inputs must have the same number of components!');

    const stepped = ve0.map((v, i) => smoothstepValue(v, ve1[i], vx[i]));

    if (Array.isArray(edge0)) {
      return stepped;
    }
    return edge0.clone().fill(stepped);
  }
  return smoothstepValue(edge0, edge1, x);
}

export function det(m) {
  if (m instanceof Matrix) {
    return m.det();
  }
  throw Error('Only defined for matrices!');
}

export function inv(m) {
  if (m instanceof Matrix) {
    return m.clone().invert();
  }
  throw Error('Only defined for matrices!');
}

export function tran(m) {
  if (m instanceof Matrix) {
    return m.clone().transpose();
  }
  throw Error('Only defined for matrices!');
}

export const rad = d => d * DEG2RAD;

export const deg = r => r * RAD2DEG;

export function nrad(r) {
  const v = r % TAU;
  return (v < 0 ? v + TAU : v);
}

// remove
export function sum(arr) {
  let s = null;
  for (let i = 0; i < arr.length; i++) {
    if (!Number.isFinite(arr[i])) return null;
    s += arr[i];
  }
  return s;
}

export function avg(arr) {
  if (arr.length === 0) return undefined;
  const s = sum(arr);
  if (!Number.isFinite(s)) return undefined;
  return s / arr.length;
}

export function product(arr) {
  let p = 1;
  for (let i = 0; i < arr.length; i++) {
    if (!Number.isFinite(arr[i])) return null;
    if (arr[i] === 0) return 0; // early termination
    p *= arr[i];
  }
  return p;
}
