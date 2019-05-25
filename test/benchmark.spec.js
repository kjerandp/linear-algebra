import { Matrix, mat3 } from '../src/matrix';
import { vec2 } from '../src/vector';
import { mix, dot } from '../src/functions';
import { range } from '../src/utils';

const T = mat3(
  0,    -2,   3,
  2,    0,    2,
  0,    0,    1,
);

const v = vec2(-1, -2);
const columns = 20;
const steps = 1;

const w = 1000;
const h = w * 0.75;
const u = Math.ceil(w / columns);

const proj = mat3(
  u,   0,     w / 2,
  0,   -u,    h / 2,
  0,     0,      1,
);

const I = Matrix.identity(3);

const points = range(columns ** 2).map(i => vec2(
  Math.floor(i / columns) - columns / 2,
  (i % columns) - columns / 2,
));

function drawPoints(t) {
  // eslint-disable-next-line arrow-parens
  points.forEach(c => {
    dot(t, c);
  });
}

function drawBasisVectors(t) {
  dot(t, vec2(0, 0));
  dot(t, vec2(1, 0));
  dot(t, vec2(0, 1));
}

function drawVector(t) {
  dot(t, vec2(0, 0));
  dot(t, v);
}

it('mix', () => {
  for (let i = 0; i < steps * 100; i++)
    mix(I, T, 0.5);
});

it('accessing elements in matrix', () => {
  for (let i = 0; i < steps * 100; i++) {
    for (let r = 0; r < T.rows; r++) {
      for (let c = 0; c < T.cols; c++) {
        T.get(r + 1, c + 1);
      }
    }
  }
});

it('dotting', () => {
  for (let i = 0; i < steps * 100; i++)
    dot(proj, T);
});

it('Benchmarking', () => {
  const basis = dot(proj, I);

  for (let n = 0; n <= steps; n++) {
    const m = mix(I, T, n / steps);
    const t = dot(proj, m);

    // original
    drawPoints(basis);
    drawBasisVectors(basis);
    drawVector(basis);

    // transformed
    drawPoints(t);
    drawBasisVectors(t);
    drawVector(t);
  }
});
