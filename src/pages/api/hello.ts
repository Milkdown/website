// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';
import { resolve } from 'path';
import type { NextApiRequest, NextApiResponse } from 'next'

const isRoot = (url: string): boolean => {
  const file = resolve(url, 'package.json')
  if (!fs.existsSync(file)) return false;

  const pkgJson = fs.readFileSync(file).toString();
  
  try {
    const pkg = JSON.parse(pkgJson);
    return pkg.name === 'website';
  } catch {
    return false;
  }
}

const findRootDir = (): string => {
  let current = __dirname;
  while (!isRoot(current)) {
    current = resolve(current, '..');
  }
  return current;
}

const __root = findRootDir();
const __milkdown = resolve(__root, 'node_modules', '@milkdown');

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const data = fs.readFileSync(resolve(__milkdown, 'core', 'package.json'))
  res.status(200).json(JSON.parse(data.toString()))
}
