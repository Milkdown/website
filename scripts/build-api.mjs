import {build} from 'builddocs';
import {readdirSync} from "node:fs";
import {writeFile} from "node:fs/promises";
import {ensureDirSync} from "fs-extra/esm";
import {resolve, parse} from "node:path";
import chalk from "chalk";

const __dirname = new URL('.', import.meta.url).pathname;
const milkdownDir = resolve(__dirname, '..', 'node_modules', '@milkdown');
const templatesDir = resolve(__dirname, 'templates');
const apiDir = resolve(__dirname, '..', 'docs', 'api-src');
const apiOutDir = resolve(__dirname, '..', 'docs', 'api');

ensureDirSync(apiOutDir);

const write = readdirSync(apiDir)
  .filter(dir => dir !== '.DS_Store')
  .map(pathname => parse(pathname).name)
  .map(name => {
    const filename = resolve(milkdownDir, name, 'src', 'index.ts');
    const main = resolve(apiDir, `${name}.md`);
    const out = resolve(apiOutDir, `${name}.md`);
    console.log(chalk.blue(`Building module: @milkdown/${name}...`));
    return Promise
      .resolve()
      .then(() => build({
        name,
        filename,
        main,
        format: 'markdown',
        templates: templatesDir,
      }))
      .then(markdown => writeFile(out, markdown))
      .then(() => {
        console.log(chalk.green(`Build module: @milkdown/${name} finished.`));
      })
      .catch((error) => {
        console.log(chalk.red(`Build module: @milkdown/${name} failed.`));
        console.log(chalk.red(error.message));
        console.log(chalk.red(error.stack));
      });
  });

await Promise.all(write);

console.log('Build api done.');
