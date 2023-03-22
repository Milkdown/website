import { NextApiResponse, NextApiRequest } from "next";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const docsDir = join(process.cwd(), "docs");

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<{ content: string }>
) {
  const content = await readFile(
    join(docsDir, "playground", "template.md"),
    "utf-8"
  );

  return res.status(200).json({ content });
}
