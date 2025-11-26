import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { execSync } from "child_process";

interface RawAffix {
  equipmentSlot: string;
  equipmentType: string;
  affixType: string;
  craftingPool: string;
  tier: string;
  affix: string;
}

interface BaseGearAffix {
  equipmentSlot: string;
  equipmentType: string;
  affixType: string;
  craftingPool: string;
  tier: string;
  craftableAffix: string;
}

const normalizeEquipmentType = (type: string): string => {
  return type
    .toLowerCase()
    .replace(/\s*\(([^)]+)\)\s*/g, "_$1") // "(DEX)" → "_dex"
    .replace(/\s+/g, "_") // spaces → "_"
    .replace(/-/g, "_"); // hyphens → "_"
};

const normalizeAffixType = (type: string): string => {
  return type.toLowerCase().replace(/\s+/g, "_"); // spaces → "_"
};

const normalizeFileKey = (equipmentType: string, affixType: string): string => {
  return (
    normalizeEquipmentType(equipmentType) + "_" + normalizeAffixType(affixType)
  );
};

const toPascalCase = (str: string): string => {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
};

const generateEquipmentAffixFile = (
  fileKey: string,
  affixes: BaseGearAffix[],
): string => {
  const constName = fileKey.toUpperCase() + "_AFFIXES";
  const typeName = toPascalCase(fileKey) + "Affix";

  return `import { BaseGearAffix } from "./types";

export const ${constName} = ${JSON.stringify(affixes, null, 2)} as const satisfies readonly BaseGearAffix[];

export type ${typeName} = (typeof ${constName})[number];
`;
};

const generateAllAffixesFile = (fileKeys: string[]): string => {
  const imports = fileKeys
    .map((key) => {
      const constName = key.toUpperCase() + "_AFFIXES";
      return `import { ${constName} } from "./${key}";`;
    })
    .join("\n");

  const arraySpread = fileKeys
    .map((key) => `  ...${key.toUpperCase()}_AFFIXES,`)
    .join("\n");

  return `${imports}

export const ALL_GEAR_AFFIXES = [
${arraySpread}
] as const;
`;
};

const generateTypesFile = (
  equipmentSlots: string[],
  equipmentTypes: string[],
  affixTypes: string[],
  craftingPools: string[],
): string => {
  return `export const EQUIPMENT_SLOTS = ${JSON.stringify(equipmentSlots.sort(), null, 2)} as const;

export type EquipmentSlot = (typeof EQUIPMENT_SLOTS)[number];

export const EQUIPMENT_TYPES = ${JSON.stringify(equipmentTypes.sort(), null, 2)} as const;

export type EquipmentType = (typeof EQUIPMENT_TYPES)[number];

export const AFFIX_TYPES = ${JSON.stringify(affixTypes, null, 2)} as const;

export type AffixType = (typeof AFFIX_TYPES)[number];

export const CRAFTING_POOLS = ${JSON.stringify(craftingPools.sort(), null, 2)} as const;

export type CraftingPool = (typeof CRAFTING_POOLS)[number];

export interface BaseGearAffix {
  equipmentSlot: EquipmentSlot;
  equipmentType: EquipmentType;
  affixType: AffixType;
  craftingPool: CraftingPool;
  tier: string;
  craftableAffix: string;
}
`;
};

const main = async (): Promise<void> => {
  console.log("Reading crafting_data.json...");
  const jsonPath = join(process.cwd(), "data", "crafting_data.json");
  const rawData: RawAffix[] = JSON.parse(await readFile(jsonPath, "utf-8"));

  console.log(`Processing ${rawData.length} affixes...`);

  // Group by combination of equipmentType + affixType
  const grouped = new Map<string, BaseGearAffix[]>();
  const equipmentSlotsSet = new Set<string>();
  const equipmentTypesSet = new Set<string>();
  const affixTypesSet = new Set<string>();
  const craftingPoolsSet = new Set<string>();

  for (const raw of rawData) {
    const fileKey = normalizeFileKey(raw.equipmentType, raw.affixType);

    equipmentSlotsSet.add(raw.equipmentSlot);
    equipmentTypesSet.add(raw.equipmentType);
    affixTypesSet.add(raw.affixType);
    craftingPoolsSet.add(raw.craftingPool);

    const affixEntry: BaseGearAffix = {
      equipmentSlot: raw.equipmentSlot,
      equipmentType: raw.equipmentType,
      affixType: raw.affixType,
      craftingPool: raw.craftingPool,
      tier: raw.tier,
      craftableAffix: raw.affix,
    };

    if (!grouped.has(fileKey)) {
      grouped.set(fileKey, []);
    }
    grouped.get(fileKey)!.push(affixEntry);
  }

  console.log(`Grouped into ${grouped.size} files`);

  // Create output directory
  const outDir = join(process.cwd(), "src", "tli", "gear_affix_data");
  await mkdir(outDir, { recursive: true });

  // Generate individual affix files
  const fileKeys: string[] = [];

  for (const [fileKey, affixes] of grouped) {
    fileKeys.push(fileKey);
    const fileName = fileKey + ".ts";
    const filePath = join(outDir, fileName);
    const content = generateEquipmentAffixFile(fileKey, affixes);

    await writeFile(filePath, content, "utf-8");
    console.log(`✓ Generated ${fileName} (${affixes.length} affixes)`);
  }

  // Generate types.ts
  const typesPath = join(outDir, "types.ts");
  const typesContent = generateTypesFile(
    Array.from(equipmentSlotsSet),
    Array.from(equipmentTypesSet),
    Array.from(affixTypesSet),
    Array.from(craftingPoolsSet),
  );
  await writeFile(typesPath, typesContent, "utf-8");
  console.log(`✓ Generated types.ts`);

  // Generate all_affixes.ts
  const allAffixesPath = join(outDir, "all_affixes.ts");
  const allAffixesContent = generateAllAffixesFile(fileKeys.sort());
  await writeFile(allAffixesPath, allAffixesContent, "utf-8");
  console.log(`✓ Generated all_affixes.ts`);

  console.log("\n✓ Code generation complete!");
  console.log(
    `Generated ${grouped.size} affix files with ${rawData.length} total affixes`,
  );

  console.log("\n🎨 Running formatter...");
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

export { main as generateGearAffixData };
