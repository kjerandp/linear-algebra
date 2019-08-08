
import { RAD2DEG, DEG2RAD, TAU } from './const';

export function add(...vectors) {
  const target = vectors.shift();
  return vectors.reduce((res, v) => {
    for (let i = 0; i < target.length; i++) {
      res[i] += v[i];
    }
    return res;
  }, target);
}

export function sub(...vectors) {
  const target = vectors.shift();
  return vectors.reduce((res, v) => {
    for (let i = 0; i < target.length; i++) {
      res[i] -= v[i];
    }
    return res;
  }, target);
}

export function vec(from, to, target = null) {
  if (!target) {
    target = to.slice();
  } else {
    if (target.length === 0) {
      target.length = to.length;
    }
    for (let i = 0; i < target.length; i++) {
      target[i] = to[i];
    }
  }
  return sub(target, from);
}

export function scale(arr, factor, target = null) {
  target = target || arr;
  for (let i = 0; i < arr.length; i++) {
    target[i] = arr[i] * factor;
  }
  return target;
}

export function sumsqr(arr) {
  return arr.reduce((sum, v) => sum + v ** 2, 0);
}

export function scalar(vector) {
  const sq = sumsqr(vector);
  if (sq === 0) return sq;
  return Math.sqrt(sq);
}

export function norm(vector, target = null) {
  target = target || vector;
  const sc = scalar(vector);
  const f = sc === 0 ? 0 : 1 / sc;
  return scale(vector, f, target);
}

export function descr(p1, p2, target = null) {
  if (!target) {
    target = p2.slice();
  } else {
    if (target.length === 0) {
      target.length = p2.length;
    }
    for (let i = 0; i < target.length; i++) {
      target[i] = p2[i];
    }
  }
  const vector = sub(target, p1);
  const sqr = sumsqr(vector);
  const dst = Math.sqrt(sqr);
  const unit = scale(vector, dst > 0 ? 1 / dst : 0, vector.slice());
  return {
    vector,
    sqr,
    dist: dst,
    unit,
  };
}

export function orth2(vector, target = null) {
  target = target || vector;
  const x = -vector[1];
  target[1] = vector[0];
  target[0] = x;
  return norm(target);
}

export function angle(vector, axis = 0) {
  if (axis > 2 || axis < 0) return undefined;

  const [x, y, z] = vector;
  let a, b, c;
  switch (axis) {
    case 0: a = y; b = z; c = x; break;
    case 1: a = x; b = z; c = y; break;
    default: a = x; b = y; c = z;
  }
  const l = Math.sqrt(a ** 2 + b ** 2);
  return Math.atan2(l, c);
}

export function angle2(vector) {
  return Math.atan2(vector[1], vector[0]);
}

export function dir(from, to, target = null) {
  return norm(vec(from, to, target));
}

export function dist(p1, p2) {
  return scalar(sub(p2, p1));
}

export function dot(v1, v2) {
  return v1.reduce((sum, c, i) => sum + c * v2[i], 0);
}

export function cross(a, b, target = null) {
  target = target || new Array(3);
  target[0] = (a[1] * b[2]) - (a[2] * b[1]);
  target[1] = (a[2] * b[0]) - (a[0] * b[2]);
  target[2] = (a[0] * b[1]) - (a[1] * b[0]);

  return target;
}

export function triple(v1, v2, v3) {
  return dot(v1, cross(v2, v3));
}

export function cross2(v1, v2) {
  return (v1[0] * v2[1]) - (v1[1] * v2[0]);
}

export function clampValue(value, min = 0, max = 1) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function clampArray(arr, min = 0, max = 1, target = null) {
  target = target || arr;
  for (let i = 0; i < target.length; i++) {
    target[i] = clampValue(target[i], min, max);
  }
  return target;
}

export function clamp(arg, min = 0, max = 1, target = null) {
  if (Array.isArray(arg)) {
    return clampArray(arg, min, max, target);
  }
  return clampValue(arg, min, max);
}

export function stepValue(edge, x) {
  return x >= edge ? 1 : 0;
}

export function stepArray(edges, x, target = null) {
  const m = Array.isArray(x) ? i => x[i] : () => x;
  target = target || edges;
  for (let i = 0; i < target.length; i++) {
    target[i] = stepValue(target[i], m(i));
  }
  return target;
}

export function step(arg, x, target = null) {
  if (Array.isArray(arg)) {
    return stepArray(arg, x, target);
  }
  return stepValue(arg, x);
}

export function smoothstep(edge0, edge1, x) {
  const t = clampValue((x - edge0) / (edge1 - edge0));
  return t * t * (3.0 - 2.0 * t);
}

export function lerp(a, b, t) {
  const m = clampValue(t, 0, 1);
  return a * (1 - m) + b * m;
}

export function mix(a, b, t, target = null) {
  const m = Array.isArray(t) ? i => t[i] : () => t;
  target = target || a;
  for (let i = 0; i < target.length; i++) {
    target[i] = lerp(a[i], b[i], m(i));
  }
  return target;
}

export function round(v, digits) {
  const f = 10 ** digits;
  if (!Array.isArray(v)) {
    return Math.round(v * f) / f;
  }
  for (let i = 0; i < v.length; i++) {
    v[i] = Math.round(v[i] * f) / f;
  }
  return v;
}

export function rad(d) {
  return d * DEG2RAD;
}

export function deg(r) {
  return r * RAD2DEG;
}

export function nrad(r) {
  const v = r % TAU;
  return (v < 0 ? v + TAU : v);
}

