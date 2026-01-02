import type { MagnificentSupportSkillName } from "@/src/data/skill/types";
import type { Mod } from "../mod";
import type { MagnificentSupportSkillModFactory } from "./types";
import { v } from "./types";

/**
 * Factory functions for magnificent support skill mods.
 * Each factory receives (tier, rank, value, vals) where:
 * - tier: 0-2 (lower is better)
 * - rank: 1-5 (higher is better)
 * - value: the actual value selected within the tier's range (used directly for tier-scaled mods)
 * - vals: named value arrays (5-element, indexed by rank; constants are repeated)
 *
 * The factory returns complete Mod[] with all fields populated.
 */
export const magnificentSupportSkillModFactories: Partial<
  Record<MagnificentSupportSkillName, MagnificentSupportSkillModFactory>
> = {
  "Burning Shot: Combustion (Magnificent)": (
    _tier,
    rank,
    value,
    vals,
  ): Mod[] => [
    { type: "DmgPct", value, dmgModType: "global", addn: true },
    { type: "DmgPct", value: v(vals.rankDmgPct, rank), dmgModType: "global", addn: true },
    { type: "ProjectileSizePct", value: v(vals.projectileSizePct, rank) },
    { type: "IgniteDurationPct", value: v(vals.igniteDurationPct, rank) },
    { type: "SkillEffDurationPct", value: v(vals.durationPct, rank) },
  ],
};
