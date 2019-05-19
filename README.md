# Linear algebra

Math library for doing basic linear algebra operations, inspired by GLSL.

## Installation
```
npm install --save @kjerandp/linear-algebra
```
## Usage

The package exports an object containing all types and functions. 

```js
// es6
import { vec3, mat3, ... } from '@kjerandp/linear-algebra';

// commonjs
const lib = require('@kjerandp/linear-algebra');

const vec3 = lib.vec3;
const mat3 = lib.mat3;
(...)
```

### Types
This lib has two types, a **Vector** class (2, 3 or 4 dimensions) and a **Matrix** class (MxN-dimensions). A N-dimension vector can be thought of as a Nx1 (column) matrix, but is included in this lib as a seperate class as vectors have some special use cases in the lower dimensions, and are commonly used and understood in areas such as computer graphics and physics.

Both these types offer convenience functions for creating new instances, to make it a bit easier and more explicit to work in 2-4 dimensions.

```js
// 2d vectors - these statements produce the same result
const v = new Vector(2, 1); // => [2, 1]
const v = new Vector([2, 1]); // array as input
const v = new Vector(2).fill(2, 1); // first arg is dimensions 
const v = vec2(2, 1); // creator function

// 3d vectors - these statements produce the same result
const v = new Vector(2, 0, 1); // => [2, 0, 1]
const v = new Vector([2, 0, 1]); // array as input
const v = new Vector(3).fill(2, 0, 1); // first arg is dimensions 
const v = vec3(2, 0, 1); // creator function

// 4d vectors - these statements produce the same result
const v = new Vector(2, 2, 0, 1); // => [2, 2, 0, 1]
const v = new Vector([2, 2, 0, 1]); // array as input
const v = new Vector(4).fill(2, 2, 0, 1); // first arg is dimensions 
const v = vec4(2, 2, 0, 1); // creator function
const v = vec4(vec3([2, 2], 0), 1); // combining arguments

// constructing a 2x2 matrix and filling it with values top left to bottom right
const m = new Matrix(2, 2).fill(1, 2, 3, 4); 

// passing the values as a 2d array to the constructor gives the same result
const m = new Matrix([
  [1, 2],
  [3, 4],
]);

// even better is using the 2x2 matrix constructor function
const m = mat2(
  1, 2,
  3, 4,
);

// there are constructor functions available for square matrices and
// column and row matrices for 2, 3 and 4 dimensions
const m = mat3(
  1, 2, 3,
  4, 5, 6,
  7, 8, 9,
);

const c = col3(1, 2, 3); // [[1], [2], [3]] (column matrix)

const r = row4(1, 2, 3, 4); // [[1, 2, 3, 4]] (row matrix)

// you can create identity matrices of any dimensions using the static
// identity function in the Matrix class
const I = Matrix.identity(4); // creates a 4x4 identity matrix
```

### Vector operations
Most operations on vectors are mutable.
```js

const u = vec4(1, 0, 1, 1);
const v = vec4(-1, -2, 0, 1);

// Add (mutatable)
const w = u.add(v); // u = w = [0, -2, 1, 2]

// Add (immutable)
const w = u.clone().add(v)
const w = add(u, v); // same as above 

// Subtract
u.sub(v); // mutable
sub(u, v); // immutable

// dot product
const p = u.dot(v);
const p = dot(u, v);

// cross product (immutable)
const w = u.cross(v);
const w = cross(u, v);

// triple product
const p = triple(u, u, v); // same as u.dot(u.cross(v))

// scale (mutable)
u.scale(3); // by scalar => [3, 0, 3, 3]
u.scale(v); // by vector => [-1, 0, 0, 1]
const w = scale(u, 3); // immutable

// clamp (mutable)
u.clamp(0, 255); // clamp values to min 0, max 255
const w = clamp(u, 0, 255); // same as above, but immutable

// mix (linear interpolation)
const w = mix(u, v, 0.5); // half of u and half of v

```
### Matrix operations
Matrices can be added, subtracted, scaled, clamped and mixed the same way as with vectors. Only additional operations are shown here.

```js
const M = mat4(
  2, 0, 0, 1,
  0, 2, 0, 1,
  0, 0, 1, 1,
  0, 0, 0, 1,
);

// determinant
const d = M.det();
const d = det(M); // same as above

// inverse
const iM = M.invert(); // mutable
const iM = inv(M); // same as above, but immutable

// transpose
const T = M.transpose(); // mutable
const T = tran(M); // immutable

// +++
```

(to be continued)


## License
MIT
