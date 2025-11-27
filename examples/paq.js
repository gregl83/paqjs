const { hashSource } = require('paqjs');
const fs = require('fs');

function main() {
    const args = process.argv.slice(2);

    // Basic Argument Parsing
    let source = null;
    let flagIgnoreHidden = false; // Corresponds to args.ignore_hidden in Python

    if (args.includes('--help') || args.includes('-h')) {
        console.log(`usage: paq [-h] [--ignore-hidden] source

Hash file or directory recursively.

positional arguments:
  source              Source to hash (filesystem path)

options:
  -h, --help          show this help message and exit
  -i, --ignore-hidden Ignore files or directories starting with dot (default: ignored)
`);
        process.exit(0);
    }

    // Parse args
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '-i' || args[i] === '--ignore-hidden') {
            flagIgnoreHidden = true;
        } else if (!source) {
            source = args[i];
        }
    }

    if (!source) {
        console.error("Error: the following arguments are required: source");
        process.exit(1);
    }

    // Logic from paq.py:
    // "ignore_hidden = not args.ignore_hidden"
    // If flag is present, ignore_hidden becomes false (meaning include them).
    // If flag is absent, ignore_hidden becomes true (meaning ignore them).
    const shouldIgnoreHidden = !flagIgnoreHidden;

    try {
        // Check if source exists before passing to Rust to match Python behavior
        if (!fs.existsSync(source)) {
            throw new Error(`'${source}' does not exist`);
        }

        const result = hashSource(source, shouldIgnoreHidden);
        console.log(result);
    } catch (e) {
        console.error(`Error: ${e.message}`);
        process.exit(1);
    }
}

main();
