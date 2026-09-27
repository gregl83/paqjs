import { hashSource } from '@paqjs/core';

function main(): void {
    const args: string[] = process.argv.slice(2);

    // Basic Argument Parsing
    let source: string | null = null;
    let flagIgnoreHidden: boolean = false;

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
        const arg = args[i];
        if (arg === '-i' || arg === '--ignore-hidden') {
            flagIgnoreHidden = true;
        } else if (args[i] === '-L' || args[i] === '--follow') {
            followLinks = true;
        } else if (!source) {
            source = arg;
        }
    }

    if (!source) {
        console.error("Error: the following arguments are required: source");
        process.exit(1);
    }

    try {
        const result: string = hashSource(source, flagIgnoreHidden, followLinks);
        console.log(result);
    } catch (e: unknown) {
        // In TypeScript, errors in catch blocks are 'unknown' type
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error(`Error: ${errorMessage}`);
        process.exit(1);
    }
}

main();
