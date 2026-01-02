export interface ProgressionColumn {
  // column header
  header: string;
  // maps level to text
  rows: Record<number, string>;
}

export interface SupportParserInput {
  skillName: string;
  description: string[];
  progressionTable: ProgressionColumn[];
}

/**
 * Parser return type: named keys mapping to level→value records.
 * Keys are descriptive names matching factory expectations.
 * Example: { weaponAtkDmgPct: { 1: 1.49, 2: 1.52, ... }, addedDmgEffPct: { 1: 1.49, ... } }
 */
export type ParsedLevelValues = Record<string, Record<number, number>>;

export type SupportLevelParser = (
  input: SupportParserInput,
) => ParsedLevelValues;

export type SkillCategory =
  | "support"
  | "active"
  | "passive"
  | "activation_medium"
  | "magnificent_support"
  | "noble_support";

export interface SkillParserEntry {
  skillName: string;
  categories: SkillCategory[];
  parser: SupportLevelParser;
}

// ============================================
// Magnificent Support Parser Types
// ============================================

/**
 * Range of values for a tier (min and max).
 */
export interface TierRange {
  min: number;
  max: number;
}

/**
 * Input for magnificent support skill parsers.
 * Uses 3-row tier table instead of 40-row level table.
 */
export interface MagnificentParserInput {
  skillName: string;
  description: string[];
  // Progression table with 3 rows for tiers (0, 1, 2)
  progressionTable: ProgressionColumn[];
}

/**
 * Parsed values from a magnificent support skill.
 */
export interface ParsedMagnificentValues {
  // Tier-scaled values with min/max ranges per tier
  tierValues?: Record<string, { 0: TierRange; 1: TierRange; 2: TierRange }>;
  // Rank-scaled values (5-element tuples for ranks 1-5)
  rankValues?: Record<string, [number, number, number, number, number]>;
  // Constant values that don't change with tier/rank
  constantValues?: Record<string, number>;
}

/**
 * Parser function for magnificent support skills.
 */
export type MagnificentLevelParser = (
  input: MagnificentParserInput,
) => ParsedMagnificentValues;

/**
 * Registry entry for magnificent support parsers.
 */
export interface MagnificentSkillParserEntry {
  skillName: string;
  parser: MagnificentLevelParser;
}
