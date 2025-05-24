import { execSync } from "child_process";
import { mkdirSync, existsSync } from "fs";
import { join } from "path";

const __dirname = new URL(".", import.meta.url).pathname;

const MILKDOWN_DIR = join(__dirname, "..", "milkdown");
const API_DIR = join(__dirname, "..", "docs", "api");

async function main() {
  try {
    console.log("Getting milkdown...");
    execSync("git submodule update --remote", { stdio: "inherit" });

    // Change to milkdown directory
    process.chdir(MILKDOWN_DIR);

    // Run pnpm install
    console.log("Installing dependencies...");
    execSync("pnpm install", { stdio: "inherit" });

    // Build TypeScript files
    console.log("Building TypeScript files...");
    execSync("pnpm --filter=@milkdown/dev exec tsc", { stdio: "inherit" });
    execSync("pnpm --filter=@milkdown/docs build", { stdio: "inherit" });

    // Ensure api directory exists
    if (!existsSync(API_DIR)) {
      mkdirSync(API_DIR, { recursive: true });
    }

    // Copy files from milkdown/docs/lib to api directory
    const sourceDir = join(MILKDOWN_DIR, "docs", "lib");
    console.log("Copying files...");

    // Copy all markdown files
    execSync(`cp ${join(sourceDir, "*.md")} ${API_DIR}`, { stdio: "inherit" });

    console.log("Done!");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
