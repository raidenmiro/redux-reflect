import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// eslint-disable-next-line import/extensions
import { argsv } from './shared.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { dir: DIRECTORY } = argsv(['dir'], 'docs/generate-root-links');
const SKIP_FILES = ['index.md', '__index.md'];
const ROOT_GENERATION = path.resolve(__dirname, '..', 'docs/src', DIRECTORY);

function createReference(name) {
  let filenameWithoutExtension = name.replace(/\.[^/.]+$/, '');
  return `- [${filenameWithoutExtension}](${filenameWithoutExtension})`;
}

async function processFiles(dir, opts = {}) {
  let { insertToMd = 'index.md', notInclude = SKIP_FILES } = opts;

  if (!fs.existsSync(dir)) {
    throw new Error(`${dir} does not exist`);
  }

  let fileStream = fs.createWriteStream(path.resolve(dir, insertToMd));
  let files = await fs.promises.readdir(dir);

  files.sort((a, b) => a.localeCompare(b));

  for (let file of files) {
    let fileName = path.basename(file);
    let link = createReference(fileName);

    if (!notInclude.includes(fileName)) {
      fileStream.write(link + '\n');
    }
  }

  fileStream.end();
}

processFiles(ROOT_GENERATION) // eslint-disable-next-line no-console
  .then(() => console.log(chalk.green('Inject all files links, Done!')))
  .catch((error) => console.error(chalk.red('Write error, %s'), error));
