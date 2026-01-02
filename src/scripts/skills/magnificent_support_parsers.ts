import {
  getDescriptionPart,
  parseTierRange,
  validateAllTiers,
} from "./progression_table";
import { template } from "./template-compiler";
import type {
  MagnificentLevelParser,
  ParsedMagnificentValues,
  TierRange,
} from "./types";

/**
 * Parser for "Burning Shot: Combustion (Magnificent)"
 *
 * Tier-scaled: additional damage (from progression table)
 * Rank-scaled: additional damage [0, 5, 10, 15, 20] for ranks 1-5
 * Constants: +25% Projectile Size, +15% Ignite Duration, +15% Duration
 */
export const burningCombustionParser: MagnificentLevelParser = (input) => {
  const { skillName, description, progressionTable } = input;

  // Parse tier-scaled damage from progression table
  // The column header is "name", not the description
  const dmgCol = progressionTable.find(
    (col) => col.header.toLowerCase() === "name",
  );
  if (dmgCol === undefined) {
    throw new Error(`${skillName}: no "name" column found`);
  }

  const tierDmgPct: Record<number, TierRange> = {};
  for (const [tierStr, text] of Object.entries(dmgCol.rows)) {
    tierDmgPct[Number(tierStr)] = parseTierRange(text, skillName);
  }

  validateAllTiers(tierDmgPct, skillName);

  const tierValues: ParsedMagnificentValues["tierValues"] = {
    tierDmgPct: {
      0: tierDmgPct[0],
      1: tierDmgPct[1],
      2: tierDmgPct[2],
    },
  };

  // Parse rank-scaled damage from description
  // The description shows max rank value (e.g., "+20% additional damage")
  // Rank values are [0, 5, 10, 15, 20] for ranks 1-5
  const firstDescription = getDescriptionPart(skillName, description, 0);
  const rankDmgMatch = template(
    "+{value:int}% additional damage for the supported skill",
  ).tryMatch(firstDescription);

  let rankValues: ParsedMagnificentValues["rankValues"];
  if (rankDmgMatch !== undefined) {
    const maxRankValue = rankDmgMatch.value;
    const step = maxRankValue / 4; // 4 steps from rank 1 to rank 5
    rankValues = {
      rankDmgPct: [0, step, step * 2, step * 3, maxRankValue],
    };
  }

  // Parse constant values from description
  const constantValues: Record<string, number> = {};

  const projSizeMatch = template(
    "+{value:int}% Projectile Size for the supported skill",
  ).tryMatch(firstDescription);
  if (projSizeMatch !== undefined) {
    constantValues.projectileSizePct = projSizeMatch.value;
  }

  const igniteDurMatch = template(
    "+{value:int}% additional Ignite Duration for the supported skill",
  ).tryMatch(firstDescription);
  if (igniteDurMatch !== undefined) {
    constantValues.igniteDurationPct = igniteDurMatch.value;
  }

  const durMatch = template(
    "+{value:int}% additional Duration for the supported skill",
  ).tryMatch(firstDescription);
  if (durMatch !== undefined) {
    constantValues.durationPct = durMatch.value;
  }

  return {
    tierValues,
    rankValues,
    constantValues:
      Object.keys(constantValues).length > 0 ? constantValues : undefined,
  };
};
