import { hashSource } from 'paqjs';
import * as fs from 'fs';

function main(): void {
    const args: string[] = process.argv.slice(2);

    // Basic Argument Parsing
    let source: string | null = null;
    let flagIgnoreHidden: boolean = false;

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
        const arg = args[i];
        if (arg === '-i' || arg === '--ignore-hidden') {
            flagIgnoreHidden = true;
        } else if (!source) {
            source = arg;
        }
    }

    if (!source) {
        console.error("Error: the following arguments are required: source");
        process.exit(1);
    }

    // Logic from paq.py:
    // If flag is present (-i), we do NOT ignore hidden files (false).
    // If flag is absent, we DO ignore hidden files (true).
    const shouldIgnoreHidden: boolean = !flagIgnoreHidden;

    try {
        // Check if source exists before passing to Rust
        if (!fs.existsSync(source)) {
            throw new Error(`'${source}' does not exist`);
        }

        const result: string = hashSource(source, shouldIgnoreHidden);
        console.log(result);
    } catch (e: unknown) {
        // In TypeScript, errors in catch blocks are 'unknown' type
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error(`Error: ${errorMessage}`);
        process.exit(1);
    }
}

main();
