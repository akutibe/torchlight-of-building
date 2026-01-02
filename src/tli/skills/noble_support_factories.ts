import type { NobleSupportSkillName } from "@/src/data/skill/types";
import type { Mod } from "../mod";
import type { MagnificentSupportSkillModFactory } from "./types";

/**
 * Factory functions for noble support skill mods.
 * Each factory receives (tier, value, vals) where:
 * - tier: 0-2 (lower is better)
 * - value: the actual value selected within the tier's range (used directly for tier-scaled mods)
 * - vals: constant values as direct numbers
 *
 * The rank-based damage mod is auto-included by getNobleSupportSkillMods.
 * The factory returns complete Mod[] with all fields populated.
 */
export const nobleSupportSkillModFactories: Partial<
  Record<NobleSupportSkillName, MagnificentSupportSkillModFactory>
> = {
  "Chain Lightning: Lucky (Noble)": (_tier, value, vals): Mod[] => [
    { type: "DmgPct", value, dmgModType: "global", addn: true },
    { type: "LuckyDmg" },
    { type: "Jump", value: vals.jumpOnKill },
  ],
};
