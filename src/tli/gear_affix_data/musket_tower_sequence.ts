import { BaseGearAffix } from "./types";

export const MUSKET_TOWER_SEQUENCE_AFFIXES = [
  {
    equipmentSlot: "Two-Handed",
    equipmentType: "Musket",
    affixType: "Tower Sequence",
    craftingPool: "Advanced",
    tier: "",
    craftableAffix:
      "+200% Precise Projectiles Aura effect<> -30% additional Precise Projectiles Sealed Mana Compensation",
  },
  {
    equipmentSlot: "Two-Handed",
    equipmentType: "Musket",
    affixType: "Tower Sequence",
    craftingPool: "Advanced",
    tier: "",
    craftableAffix:
      "+30% additional Deterioration Damage<> 10% chance to inflict 2additional stack(s) of Deterioration",
  },
  {
    equipmentSlot: "Two-Handed",
    equipmentType: "Musket",
    affixType: "Tower Sequence",
    craftingPool: "Advanced",
    tier: "",
    craftableAffix:
      "+50% Elemental Damage for the gear<> -25% gear Physical Damage",
  },
  {
    equipmentSlot: "Two-Handed",
    equipmentType: "Musket",
    affixType: "Tower Sequence",
    craftingPool: "Advanced",
    tier: "",
    craftableAffix:
      "+80% gear Physical Damage<> -20% Attack Critical Strike Rating for this gear",
  },
  {
    equipmentSlot: "Two-Handed",
    equipmentType: "Musket",
    affixType: "Tower Sequence",
    craftingPool: "Advanced",
    tier: "",
    craftableAffix: "Adds 1- 7Lightning Damage to Attacks per 10Dexterity",
  },
  {
    equipmentSlot: "Two-Handed",
    equipmentType: "Musket",
    affixType: "Tower Sequence",
    craftingPool: "Advanced",
    tier: "",
    craftableAffix: "Adds 3- 5Fire Damage to Attacks per 10Strength",
  },
  {
    equipmentSlot: "Two-Handed",
    equipmentType: "Musket",
    affixType: "Tower Sequence",
    craftingPool: "Advanced",
    tier: "",
    craftableAffix:
      "Attack Horizontal Projectiles will return after reaching their max range and will hit enemies on their path again<> -30% additional Projectile Damage",
  },
  {
    equipmentSlot: "Two-Handed",
    equipmentType: "Musket",
    affixType: "Tower Sequence",
    craftingPool: "Advanced",
    tier: "",
    craftableAffix:
      "Enemies have a 30% chance to explode when defeated by an Attack or Spell, dealing Secondary Physical Damage equal to 25% of their Max Life to enemies within a 5m radius",
  },
  {
    equipmentSlot: "Two-Handed",
    equipmentType: "Musket",
    affixType: "Tower Sequence",
    craftingPool: "Advanced",
    tier: "",
    craftableAffix:
      "Main Skill is supported by Lv. 25Multiple Projectiles<> +25% additional Projectile Damage",
  },
  {
    equipmentSlot: "Two-Handed",
    equipmentType: "Musket",
    affixType: "Tower Sequence",
    craftingPool: "Intermediate",
    tier: "",
    craftableAffix: "+12% Armor DMG Mitigation Penetration",
  },
  {
    equipmentSlot: "Two-Handed",
    equipmentType: "Musket",
    affixType: "Tower Sequence",
    craftingPool: "Intermediate",
    tier: "",
    craftableAffix: "+16% all stats",
  },
  {
    equipmentSlot: "Two-Handed",
    equipmentType: "Musket",
    affixType: "Tower Sequence",
    craftingPool: "Intermediate",
    tier: "",
    craftableAffix: "+16% additional damage for Weapons",
  },
  {
    equipmentSlot: "Two-Handed",
    equipmentType: "Musket",
    affixType: "Tower Sequence",
    craftingPool: "Intermediate",
    tier: "",
    craftableAffix: "+16% Cold Penetration",
  },
  {
    equipmentSlot: "Two-Handed",
    equipmentType: "Musket",
    affixType: "Tower Sequence",
    craftingPool: "Intermediate",
    tier: "",
    craftableAffix: "+16% Erosion Resistance Penetration",
  },
  {
    equipmentSlot: "Two-Handed",
    equipmentType: "Musket",
    affixType: "Tower Sequence",
    craftingPool: "Intermediate",
    tier: "",
    craftableAffix: "+16% Fire Penetration",
  },
  {
    equipmentSlot: "Two-Handed",
    equipmentType: "Musket",
    affixType: "Tower Sequence",
    craftingPool: "Intermediate",
    tier: "",
    craftableAffix: "+16% Lightning Penetration",
  },
  {
    equipmentSlot: "Two-Handed",
    equipmentType: "Musket",
    affixType: "Tower Sequence",
    craftingPool: "Intermediate",
    tier: "",
    craftableAffix: "+20% additional damage on Critical Strike",
  },
  {
    equipmentSlot: "Two-Handed",
    equipmentType: "Musket",
    affixType: "Tower Sequence",
    craftingPool: "Intermediate",
    tier: "",
    craftableAffix: "+20% Attack Critical Strike Rating for this gear",
  },
  {
    equipmentSlot: "Two-Handed",
    equipmentType: "Musket",
    affixType: "Tower Sequence",
    craftingPool: "Intermediate",
    tier: "",
    craftableAffix: "+8% gear Attack Speed",
  },
] as const satisfies readonly BaseGearAffix[];

export type MusketTowerSequenceAffix =
  (typeof MUSKET_TOWER_SEQUENCE_AFFIXES)[number];
