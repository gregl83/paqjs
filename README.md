[![Build](https://github.com/gregl83/paqjs/actions/workflows/release.yml/badge.svg)](https://github.com/gregl83/paqjs/actions/workflows/release.yml)
[![NPMjs.com](https://img.shields.io/npm/v/paqjs.svg)](https://www.npmjs.com/package/paqjs)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/gregl83/paqpy/blob/master/LICENSE)

# paqjs

Hash file or directory recursively.

Node.js bindings to the Rust `paq` library.

Powered by `blake3` cryptographic hashing algorithm.

## Performance

The [Go](https://github.com/golang/go/commit/6e676ab2b809d46623acb5988248d95d1eb7939c) programming language repository was used as a test data source (157 MB / 14,490 files).

| Tool               | Version | Command                   |    Mean [ms] | Min [ms] | Max [ms] |    Relative |
| :----------------- | :------ | :------------------------ | -----------: | -------: | -------: | ----------: |
| [paq][paq]         | latest  | `paq ./go`                |   99.5 ± 0.7 |     98.6 |    101.6 |        1.00 |
| [b3sum][b3sum]     | 1.5.1   | `find ./go ... b3sum`     |  314.3 ± 3.9 |    308.9 |    320.8 | 3.16 ± 0.04 |
| [dirhash][dirhash] | 0.5.0   | `dirhash -a sha256 ./go`  |  565.1 ± 5.8 |    558.7 |    572.3 | 5.68 ± 0.07 |
| [GNU sha2][gnusha] | 9.7     | `find ./go ... sha256sum` | 752.0 ± 60.7 |    683.2 |    817.1 | 7.56 ± 0.61 |

[paq]: https://github.com/gregl83/paq
[b3sum]: https://github.com/BLAKE3-team/BLAKE3/tree/master/b3sum
[dirhash]: https://github.com/andhus/dirhash-python
[gnusha]: https://manpages.debian.org/testing/coreutils/sha256sum.1.en.html

See [paq benchmarks](https://github.com/gregl83/paq/blob/main/docs/benchmarks.md) documentation for more details.

## Installation

### Install From NPM

```bash
npm install paqjs
```

### Install From Repository (Unstable)

Not recommended due to instability of main branch in-between tagged releases.

1. Clone this repository.
2. Run `npm install` from repository root.
4. Run `npm run build` to build `.node` binary.

## Usage

### Typescript

```typescript
import { hashSource } from 'paqjs';

const source: string = "/patth/to/source";
const ignore_hidden: boolean = true; // .dir or .file

const source_hash: string = hashSource(
    source,
    ignore_hidden,
);

console.log(source_hash);
```

### Javascript

```javascript
const { hashSource } = require('paqjs');

const source = "/path/to/source";
const ignore_hidden = true; // .dir or .file

const source_hash = hashSource(
    source,
    ignore_hidden,
);

console.log(source_hash);
```

Visit the [paq](https://github.com/gregl83/paq) homepage for more details.

## License

[MIT](LICENSE)
