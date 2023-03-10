/* Copyright 2021, Milkdown by Mirone. */
import { basename, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { dataToEsm } from '@rollup/pluginutils'
import { build } from 'builddocs'
import type { PluginOption } from 'vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const markdownPlugin = (): PluginOption =>
  ({
    name: 'vite-plugin-markdown',
    enforce: 'pre',
    transform(code: string, id: string) {
      if (!id.endsWith('.md'))
        return null

      // Transform markdown files in the `api` directory to documentation ESM.
      if (/\/api\//.test(id)) {
        const packageDirName = basename(id).replace(/\.md$/, '')
        const name = `@milkdown/${packageDirName}`
        const filename = resolve(__dirname, `../node_modules/@milkdown/${packageDirName}/src/index.ts`)
        const markdown = build({
          name,
          filename,
          main: id,
          format: 'markdown',
          templates: resolve(__dirname, './templates'),
        })

        return dataToEsm(markdown)
      }

      return dataToEsm(code)
    },
  } as const)
