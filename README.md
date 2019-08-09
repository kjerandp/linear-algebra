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

See this [live sample](https://observablehq.com/@kjerandp/affine-transformations) of usage or refer to the [docs](https://kjerandp.github.io/linear-algebra/) and tests for more details.

## License
MIT
