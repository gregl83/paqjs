[![CI](https://github.com/gregl83/paqjs/actions/workflows/ci.yml/badge.svg)](https://github.com/gregl83/paqjs/actions/workflows/ci.yml)
[![NPMjs.com](https://img.shields.io/npm/v/%40paqjs%2Fcore.svg)](https://www.npmjs.com/package/@paqjs/core)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/gregl83/paqjs/blob/master/LICENSE)

# paqjs

Hash directory or file with `BLAKE3`.

Node.js bindings to the Rust `paq` library.

## Performance

The [Go](https://github.com/golang/go/commit/6e676ab2b809d46623acb5988248d95d1eb7939c) programming language repository was used as a test data source (157 MB / 14,490 files).

| Tool                                     | Version | Command                                 |     Mean [ms] | Min [ms] | Max [ms] |     Relative |
| :--------------------------------------- | :------ | :-------------------------------------- | ------------: | -------: | -------: | -----------: |
| [paq][paq]                               | 2.0.0   | `paq ./go`                              |    30.0 ± 0.3 |     29.3 |     30.6 |         1.00 |
| [GNU md5sum][gnumd5]                     | 9.11    | `fd ... ./go ... md5sum`                |    90.6 ± 6.9 |     79.6 |    102.6 |  3.02 ± 0.23 |
| [merkle_hash][merkle_hash]               | 3.9.0   | `merkle-hash ./go`                      |   98.7 ± 27.4 |     36.1 |    138.6 |  3.29 ± 0.91 |
| [b3sum][b3sum]                           | 1.5.1   | `fd ... ./go ... b3sum`                 |   114.1 ± 3.6 |    108.3 |    119.5 |  3.80 ± 0.13 |
| [GNU sha2][gnusha]                       | 9.11    | `fd ... ./go ... sha256sum`             |  155.3 ± 11.7 |    140.1 |    191.2 |  5.17 ± 0.40 |
| [directory-checksum][directory-checksum] | 1.4.20  | `directory-checksum --max-depth=0 ./go` |   386.5 ± 2.0 |    382.8 |    389.1 | 12.87 ± 0.15 |
| [checksumdir][checksumdir]               | 1.3.0   | `checksumdir -a sha256 ./go`            |   453.9 ± 6.8 |    447.3 |    471.0 | 15.11 ± 0.28 |
| [dirhash][dirhash]                       | 0.5.0   | `dirhash -a sha256 ./go`                |   570.0 ± 3.3 |    565.2 |    575.8 | 18.98 ± 0.23 |
| [folder-hash][folder-hash]               | 4.1.1   | `folder-hash ./go`                      | 1407.0 ± 49.0 |   1318.0 |   1497.0 | 46.86 ± 1.72 |
| [Hashrat][hashrat]                       | 1.25    | `hashrat -sha256 -dir -hidden ./go`     |  2076.0 ± 6.0 |   2065.0 |   2084.0 | 69.12 ± 0.77 |

[paq]: https://github.com/gregl83/paq
[merkle_hash]: https://github.com/hristogochev/merkle_hash
[directory-checksum]: https://github.com/MShekow/directory-checksum
[hashrat]: https://github.com/ColumPaget/Hashrat
[checksumdir]: https://pypi.org/project/checksumdir/
[b3sum]: https://github.com/BLAKE3-team/BLAKE3/tree/master/b3sum
[gnumd5]: https://www.gnu.org/software/coreutils/manual/html_node/md5sum-invocation.html
[gnusha]: https://manpages.debian.org/testing/coreutils/sha256sum.1.en.html
[dirhash]: https://github.com/andhus/dirhash-python
[folder-hash]: https://github.com/marc136/node-folder-hash

These are upstream paq CLI benchmarks, not measurements of the Node.js bindings.
The benchmark VM is an AWS EC2 `c6a.4xlarge` (16 vCPUs, 32 GiB RAM).
See the [paq benchmarks](https://github.com/gregl83/paq/blob/master/docs/benchmarks.md) documentation for methodology and commands.

## Installation

### Install From NPM

```bash
npm install @paqjs/core
```

### Install From Repository (Unstable)

Not recommended due to instability of main branch in-between tagged releases.

1. Clone this repository.
2. Run `npm install` from repository root.
3. Run `npm run build` to build `.node` binary.

### Upgrading to v2

paqjs v2 hashes are incompatible with v1; regenerate stored hashes after upgrading.
See [release notes](https://github.com/gregl83/paq/releases/tag/v2.0.0).

## Usage

### Typescript

```typescript
import { hashSource } from '@paqjs/core';

const source: string = "/path/to/source";
const ignore_hidden: boolean = true; // .dir or .file

const source_hash: string = hashSource(
    source,
    ignore_hidden,
    false, // follow_links
);

console.log(source_hash);
```

`hashSource(source, ignoreHidden, followLinks?)` returns a hexadecimal hash string.
Existing two-argument calls remain supported; `followLinks` defaults to `false`.
By default, symbolic links are hashed by their target-path text, including when
the source itself is a symbolic link. Set `followLinks` to `true` to hash target
contents and traverse linked directories, including targets outside the source
tree. Broken links and cycles throw errors when following links.

`hashSource` uses paq’s fallible Rust API. File system failures throw a JavaScript
`Error` with the underlying `paq` error message.

### Javascript

```javascript
const { hashSource } = require('@paqjs/core');

const source = "/path/to/source";
const ignore_hidden = true; // .dir or .file

const source_hash = hashSource(
    source,
    ignore_hidden,
    false, // follow_links
);

console.log(source_hash);
```

Visit the [paq](https://github.com/gregl83/paq) homepage for more details.

## License

[MIT](LICENSE)
