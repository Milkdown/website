import { readFile } from "node:fs/promises";
import { join } from "node:path";

const docsDir = join(process.cwd(), "docs");

export function getPlaygroundTemplate() {
  const path = join(docsDir, "playground", "template.md");
  return readFile(path, "utf-8");
}
