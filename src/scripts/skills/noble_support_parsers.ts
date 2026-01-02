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

// Noble parsers use the same types as Magnificent since they share the tier/rank/value system
export type NobleLevelParser = MagnificentLevelParser;

/**
 * Parser for "Chain Lightning: Lucky (Noble)"
 *
 * Tier-scaled: additional damage penalty (-7–-5)% at tier 1, etc.
 *   - tier 0: (-4–-1)% (best, least negative)
 *   - tier 1: (-7–-5)%
 *   - tier 2: (-10–-8)% (worst, most negative)
 * Rank-scaled: +20% additional damage [0, 5, 10, 15, 20] for ranks 1-5
 * Constants: +1 Jump on kill, LuckyDmg (LuckyDmg has no numeric value)
 */
export const chainLightningLuckyParser: NobleLevelParser = (input) => {
  const { skillName, description, progressionTable } = input;

  // Parse tier-scaled damage from progression table
  // The column header is "name"
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

  // Constant values
  // +1 Jump when defeating an enemy - the value is always 1
  // LuckyDmg is a boolean mod with no numeric value, so not included here
  const constantValues: Record<string, number> = {
    jumpOnKill: 1,
  };

  return {
    tierValues,
    rankValues,
    constantValues,
  };
};
