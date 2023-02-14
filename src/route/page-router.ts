/* Copyright 2021, Milkdown by Mirone. */
import { config } from './page-config'

export interface Item {
  id: string
  title: string
  link: string
  parentId: string
  content: () => Promise<{ default: string }>
}
export interface Section {
  id: string
  title: string
  items: Item[]
}

export interface ConfigItem {
  dir: string
  items: string[]
}

const transformTitle = (title: string): string => title.split('-').map(word => word[0]!.toUpperCase() + word.slice(1)).join(' ')

const createItem = (dir: string, path: string): Item => ({
  id: path,
  parentId: dir,
  title: transformTitle(path),
  link: `/${path}`,
  content: () => import(`../../pages/${dir}/${path}.md`),
})

const mapConfig = ({ dir, items }: ConfigItem): Section => ({
  id: dir,
  title: transformTitle(dir),
  items: items.map(item => createItem(dir, item)),
})

const toRouter = (config: ConfigItem[]): Section[] => config.map(cfg => mapConfig(cfg))


export const pageRouter: Section[] = toRouter(config);
