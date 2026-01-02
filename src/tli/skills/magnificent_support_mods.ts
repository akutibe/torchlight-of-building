import { MagnificentSupportSkills } from "@/src/data/skill/support_magnificent";
import type {
  BaseMagnificentSupportSkill,
  MagnificentSupportSkillName,
} from "@/src/data/skill/types";
import type { Mod } from "../mod";
import { magnificentSupportSkillModFactories } from "./magnificent_support_factories";

/**
 * Get mods for a magnificent support skill at the specified tier, rank, and value.
 *
 * @param skillName - Name of the magnificent support skill
 * @param tier - Tier 0-2 (lower is better, tier 0 has best values)
 * @param rank - Rank 1-5 (higher is better, rank 5 is max)
 * @param value - Specific value within the tier's range (e.g., 23 for tier 0 range 19-23)
 * @returns Array of Mod objects
 */
export const getMagnificentSupportSkillMods = (
  skillName: MagnificentSupportSkillName,
  tier: 0 | 1 | 2,
  rank: 1 | 2 | 3 | 4 | 5,
  value: number,
): Mod[] => {
  const factory = magnificentSupportSkillModFactories[skillName];
  if (factory === undefined) {
    // Skill has no tier/rank/value-scaling mods
    return [];
  }

  // Get skill data from generated magnificent support skills
  const skill = MagnificentSupportSkills.find((s) => s.name === skillName) as
    | BaseMagnificentSupportSkill
    | undefined;
  if (skill === undefined) {
    throw new Error(`Magnificent support skill "${skillName}" not found`);
  }

  // Validate value is within tier's range if tierValues exists
  if (skill.tierValues !== undefined) {
    // Get the first tier value key to validate range
    const firstKey = Object.keys(skill.tierValues)[0];
    if (firstKey !== undefined) {
      const tierRanges = skill.tierValues[firstKey];
      const range = tierRanges[tier];
      if (value < range.min || value > range.max) {
        throw new Error(
          `Value ${value} out of range [${range.min}, ${range.max}] for tier ${tier} of "${skillName}"`,
        );
      }
    }
  }

  // Flatten rankValues and constantValues into a single Record<string, number[]>
  // Constants are expanded to 5-element arrays so v(vals.x, rank) works uniformly
  const vals: Record<string, readonly number[]> = {};

  if (skill.rankValues !== undefined) {
    for (const [key, arr] of Object.entries(skill.rankValues)) {
      vals[key] = arr;
    }
  }

  if (skill.constantValues !== undefined) {
    for (const [key, num] of Object.entries(skill.constantValues)) {
      vals[key] = [num, num, num, num, num];
    }
  }

  return factory(tier, rank, value, vals);
};
