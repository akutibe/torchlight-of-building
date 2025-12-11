import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { ActiveSkills } from "../data/skill/active";
import type { InferredSkillKind } from "../data/skill/types";
import { classifyWithRegex } from "./skill_kind_patterns";

interface InferredKindEntry {
  kind: InferredSkillKind;
  reason: string;
}

interface OutputEntry {
  inferredSkillKinds: InferredKindEntry[];
}

interface OutputRecord {
  [skillName: string]: OutputEntry;
}

const OUTPUT_PATH = join(
  process.cwd(),
  ".garbage/skills/inferred_skill_kinds_regex.json",
);

const main = async (): Promise<void> => {
  console.log(
    `Classifying ${ActiveSkills.length} skills using regex patterns...\n`,
  );

  const output: OutputRecord = {};
  let classifiedCount = 0;
  let unclassifiedCount = 0;

  for (const skill of ActiveSkills) {
    const kinds = classifyWithRegex(skill);

    output[skill.name] = {
      inferredSkillKinds: kinds.map((kind) => ({
        kind,
        reason: "regex match",
      })),
    };

    if (kinds.length > 0) {
      classifiedCount++;
    } else {
      unclassifiedCount++;
    }
  }

  // Ensure output directory exists
  await mkdir(join(process.cwd(), ".garbage/skills"), { recursive: true });

  // Write output
  await writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf-8");

  console.log(`Complete!`);
  console.log(`  Total skills: ${ActiveSkills.length}`);
  console.log(`  Classified (at least 1 kind): ${classifiedCount}`);
  console.log(`  Unclassified (no matches): ${unclassifiedCount}`);
  console.log(`  Output: ${OUTPUT_PATH}`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
