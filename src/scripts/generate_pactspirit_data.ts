import * as cheerio from "cheerio";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { execSync } from "child_process";

interface Pactspirit {
  type: string;
  rarity: string;
  name: string;
  effect: string;
}

const cleanEffectText = (html: string): string => {
  // Replace <br> tags with placeholder to preserve intentional line breaks
  const BR_PLACEHOLDER = "\x00";
  let text = html.replace(/<br\s*\/?>/gi, BR_PLACEHOLDER);
  // Remove all other HTML tags
  text = text.replace(/<[^>]+>/g, "");
  // Fix mojibake dash: UTF-8 en-dash bytes misinterpreted as Windows-1252
  text = text.replace(/\u00e2\u20ac\u201c/g, "-");
  // Decode common HTML entities
  text = text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
  // Normalize all whitespace (including source newlines) to single spaces
  text = text.replace(/\s+/g, " ");
  // Restore intentional line breaks from <br> tags
  text = text.replace(new RegExp(BR_PLACEHOLDER, "g"), "\n");
  // Clean up: trim each line and remove empty lines
  text = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");
  return text.trim();
};

const extractPactspiritData = (html: string): Pactspirit[] => {
  const $ = cheerio.load(html);
  const items: Pactspirit[] = [];

  const rows = $('#pactspirit tbody tr[class*="thing"]');
  console.log(`Found ${rows.length} pactspirit rows`);

  rows.each((_, row) => {
    const tds = $(row).find("td");

    if (tds.length !== 4) {
      console.warn(`Skipping row with ${tds.length} columns (expected 4)`);
      return;
    }

    const item: Pactspirit = {
      type: $(tds[0]).text().trim(),
      rarity: $(tds[1]).text().trim(),
      name: $(tds[2]).text().trim(),
      effect: cleanEffectText($(tds[3]).html() || ""),
    };

    items.push(item);
  });

  return items;
};

const generateTypesFile = (): string => {
  return `export interface Pactspirit {
  type: string;
  rarity: string;
  name: string;
  effect: string;
}
`;
};

const generateDataFile = (items: Pactspirit[]): string => {
  return `import type { Pactspirit } from "./types";

export const Pactspirits = ${JSON.stringify(items, null, 2)} as const satisfies readonly Pactspirit[];

export type PactspiritEntry = (typeof Pactspirits)[number];
`;
};

const generateIndexFile = (): string => {
  return `export * from "./types";
export * from "./pactspirits";
`;
};

const main = async (): Promise<void> => {
  console.log("Reading HTML file...");
  const htmlPath = join(process.cwd(), ".garbage", "codex.html");
  const html = await readFile(htmlPath, "utf-8");

  console.log("Extracting pactspirit data...");
  const items = extractPactspiritData(html);
  console.log(`Extracted ${items.length} pactspirits`);

  const outDir = join(process.cwd(), "src", "data", "pactspirit");
  await mkdir(outDir, { recursive: true });

  const typesPath = join(outDir, "types.ts");
  await writeFile(typesPath, generateTypesFile(), "utf-8");
  console.log(`Generated types.ts`);

  const dataPath = join(outDir, "pactspirits.ts");
  await writeFile(dataPath, generateDataFile(items), "utf-8");
  console.log(`Generated pactspirits.ts (${items.length} items)`);

  const indexPath = join(outDir, "index.ts");
  await writeFile(indexPath, generateIndexFile(), "utf-8");
  console.log(`Generated index.ts`);

  console.log("\nCode generation complete!");
  execSync("pnpm format", { stdio: "inherit" });
};

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Script failed:", error);
      process.exit(1);
    });
}

export { main as generatePactspiritData };
