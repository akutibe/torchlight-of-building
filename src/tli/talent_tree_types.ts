import * as R from "remeda";

// Tree name constants
export const GOD_GODDESS_TREES = [
  "God_of_War",
  "God_of_Might",
  "God_of_Machines",
  "Goddess_of_Hunting",
  "Goddess_of_Knowledge",
  "Goddess_of_Deception",
] as const;

export const PROFESSION_TREES = [
  "Warrior",
  "Warlord",
  "Onslaughter",
  "The_Brave",
  "Marksman",
  "Bladerunner",
  "Druid",
  "Assassin",
  "Magister",
  "Arcanist",
  "Elementalist",
  "Prophet",
  "Shadowdancer",
  "Ranger",
  "Sentinel",
  "Shadowmaster",
  "Psychic",
  "Warlock",
  "Lich",
  "Machinist",
  "Steel_Vanguard",
  "Alchemist",
  "Artisan",
  "Ronin",
] as const;

export const ALL_TREES = R.concat(GOD_GODDESS_TREES, PROFESSION_TREES);

export type TreeName = (typeof ALL_TREES)[number];

export const isProfessionName = (name: string): name is TreeName => {
  return ALL_TREES.includes(name as TreeName);
};

// Check if a tree name is a god/goddess tree
export const isGodGoddessTree = (name: string): boolean => {
  return GOD_GODDESS_TREES.includes(name as (typeof GOD_GODDESS_TREES)[number]);
};
