const { hashSource } = require('@paqjs/core');

function main() {
    const args = process.argv.slice(2);

    // Basic Argument Parsing
    let source = null;
    let flagIgnoreHidden = false;

    let followLinks = false;

    if (args.includes('--help') || args.includes('-h')) {
        console.log(`usage: paq [-h] [--ignore-hidden] [--follow] source

Hash directory or file with BLAKE3.

positional arguments:
  source              Source to hash (filesystem path)

options:
  -h, --help          show this help message and exit
  -i, --ignore-hidden Ignore files or directories starting with dot (default: included)
  -L, --follow        Follow symbolic links and hash their targets
`);
        process.exit(0);
    }

    // Parse args
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '-i' || args[i] === '--ignore-hidden') {
            flagIgnoreHidden = true;
        } else if (args[i] === '-L' || args[i] === '--follow') {
            followLinks = true;
        } else if (!source) {
            source = args[i];
        }
    }

    if (!source) {
        console.error("Error: the following arguments are required: source");
        process.exit(1);
    }

    try {
        const result = hashSource(source, flagIgnoreHidden, followLinks);
        console.log(result);
    } catch (e) {
        console.error(`Error: ${e.message}`);
        process.exit(1);
    }
}

main();
