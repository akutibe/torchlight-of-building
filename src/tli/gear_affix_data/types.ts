import { DmgRange } from "../core";

export type ValueRange = DmgRange;

export const AFFIX_TYPES = [
  "Base Affix",
  "Base Stats",
  "Corrosion Base",
  "Prefix",
  "Suffix",
  "Sweet Dream Affix",
  "Tower Sequence",
] as const;

export type AffixType = (typeof AFFIX_TYPES)[number];

export const EQUIPMENT_TYPE_KEYS = [
  "belt",
  "boots_dex",
  "boots_int",
  "boots_str",
  "bow",
  "cane",
  "chest_armor_dex",
  "chest_armor_int",
  "chest_armor_str",
  "claw",
  "crossbow",
  "cudgel",
  "dagger",
  "fire_cannon",
  "gloves_dex",
  "gloves_int",
  "gloves_str",
  "helmet_dex",
  "helmet_int",
  "helmet_str",
  "musket",
  "necklace",
  "one_handed_axe",
  "one_handed_hammer",
  "one_handed_sword",
  "pistol",
  "ring",
  "rod",
  "scepter",
  "shield_dex",
  "shield_int",
  "shield_str",
  "spirit_ring",
  "tin_staff",
  "two_handed_axe",
  "two_handed_hammer",
  "two_handed_sword",
  "wand",
] as const;

export type EquipmentTypeKey = (typeof EQUIPMENT_TYPE_KEYS)[number];

export interface BaseGearAffix {
  equipmentTypeKey: EquipmentTypeKey;
  equipmentSlot: string;
  equipmentType: string;
  affixType: AffixType;
  craftingPool: string;
  tier: string;
  template: string;
  valueRanges: ValueRange[];
  rawAffix: string;
}
