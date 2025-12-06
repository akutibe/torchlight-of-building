import type {
  SaveData,
  Gear as SaveDataGear,
  GearPage as SaveDataGearPage,
  TalentPage as SaveDataTalentPage,
  TalentTree as SaveDataTalentTree,
  PlacedPrism as SaveDataPlacedPrism,
  CraftedPrism as SaveDataCraftedPrism,
  AllocatedTalentNode as SaveDataAllocatedTalentNode,
  ReflectedAllocatedNode as SaveDataReflectedAllocatedNode,
} from "@/src/app/lib/save-data";
import type {
  Affix,
  EquippedGear,
  Gear,
  GearPage,
  Loadout,
  TalentPage,
  TalentTree,
  PlacedPrism,
  CraftedPrism,
  TalentGrid,
  TalentInventory,
  AllocatedTalentNode,
  ReflectedAllocatedNode,
} from "../core";
import type { Mod } from "../mod";
import { parseMod } from "../mod_parser";
import {
  findTalentNodeData,
  getPrismAffixesForNode,
  scaleTalentAffix,
  type TreeSlot,
} from "../talent-affix-utils";

type GearSlot = keyof SaveDataGearPage;

const getSrc = (gearSlot: GearSlot): string => {
  return `Gear#${gearSlot}`;
};

const convertAffix = (affixText: string, src: string | undefined): Affix => {
  const affixLines = affixText.split(/\n/);
  const mods: Mod[] = [];
  for (const affixLine of affixLines) {
    const mod = parseMod(affixLine);
    if (mod !== undefined) {
      mods.push({ ...mod, src });
    }
  }

  return {
    text: affixText,
    mods: mods.length > 0 ? mods : undefined,
    src,
  };
};

const convertAffixArray = (
  affixes: string[] | undefined,
  src: string | undefined,
): Affix[] | undefined => {
  if (!affixes || affixes.length === 0) return undefined;
  return affixes.map((text) => convertAffix(text, src));
};

const convertGear = (gear: SaveDataGear, src: string | undefined): Gear => {
  return {
    equipmentType: gear.equipmentType,
    id: gear.id,
    rarity: gear.rarity,
    legendaryName: gear.legendaryName,
    baseStats: gear.baseStats ? convertAffix(gear.baseStats, src) : undefined,
    base_affixes: convertAffixArray(gear.base_affixes, src),
    prefixes: convertAffixArray(gear.prefixes, src),
    suffixes: convertAffixArray(gear.suffixes, src),
    blend_affix: gear.blend_affix
      ? convertAffix(gear.blend_affix, src)
      : undefined,
    legendary_affixes: convertAffixArray(gear.legendary_affixes, src),
  };
};

const convertGearPage = (
  saveDataGearPage: SaveDataGearPage,
  gearInventory: SaveDataGear[],
): GearPage => {
  const slots: GearSlot[] = [
    "helmet",
    "chest",
    "neck",
    "gloves",
    "belt",
    "boots",
    "leftRing",
    "rightRing",
    "mainHand",
    "offHand",
  ];

  const equippedGear: EquippedGear = {};

  for (const slot of slots) {
    const gear = saveDataGearPage[slot];
    if (gear) {
      const src = getSrc(slot);
      equippedGear[slot] = convertGear(gear, src);
    }
  }

  return {
    equippedGear,
    inventory: gearInventory.map((gear) => {
      return convertGear(gear, undefined);
    }),
  };
};

const getTalentSrc = (treeSlot: TreeSlot): string => {
  return `Talent#${treeSlot}`;
};

const enrichAllocatedNode = (
  node: SaveDataAllocatedTalentNode,
  treeName: string,
  treeSlot: TreeSlot,
  placedPrism: SaveDataPlacedPrism | undefined,
  src: string,
): AllocatedTalentNode => {
  const nodeData = findTalentNodeData(treeName, node.x, node.y);

  if (!nodeData) {
    return {
      x: node.x,
      y: node.y,
      points: node.points,
      affix: { text: "", src },
      prismAffixes: [],
    };
  }

  return {
    x: node.x,
    y: node.y,
    points: node.points,
    affix: scaleTalentAffix(nodeData.rawAffix, node.points, src),
    prismAffixes: getPrismAffixesForNode(
      { x: node.x, y: node.y },
      nodeData.nodeType,
      node.points,
      placedPrism,
      treeSlot,
      src,
    ),
  };
};

const enrichReflectedNode = (
  node: SaveDataReflectedAllocatedNode,
  treeName: string,
  src: string,
): ReflectedAllocatedNode => {
  const sourceNodeData = findTalentNodeData(
    treeName,
    node.sourceX,
    node.sourceY,
  );

  const affix =
    sourceNodeData !== undefined
      ? scaleTalentAffix(sourceNodeData.rawAffix, node.points, src)
      : { text: "", src };

  return {
    x: node.x,
    y: node.y,
    sourceX: node.sourceX,
    sourceY: node.sourceY,
    points: node.points,
    affix,
  };
};

const convertTalentTree = (
  tree: SaveDataTalentTree,
  treeSlot: TreeSlot,
  placedPrism: SaveDataPlacedPrism | undefined,
  src: string,
): TalentTree => {
  return {
    name: tree.name,
    allocatedNodes: tree.allocatedNodes.map((node) =>
      enrichAllocatedNode(node, tree.name, treeSlot, placedPrism, src),
    ),
    selectedCoreTalents: tree.selectedCoreTalents
      ? tree.selectedCoreTalents.map((text) => convertAffix(text, src))
      : undefined,
  };
};

const convertCraftedPrism = (
  prism: SaveDataCraftedPrism,
  src: string,
): CraftedPrism => {
  return {
    id: prism.id,
    rarity: prism.rarity,
    baseAffix: convertAffix(prism.baseAffix, src),
    gaugeAffixes: prism.gaugeAffixes.map((text) => convertAffix(text, src)),
  };
};

const convertPlacedPrism = (
  placedPrism: SaveDataPlacedPrism,
  src: string,
): PlacedPrism => {
  return {
    prism: convertCraftedPrism(placedPrism.prism, src),
    treeSlot: placedPrism.treeSlot,
    position: placedPrism.position,
  };
};

const convertTalentPage = (
  saveDataTalentPage: SaveDataTalentPage,
  prismList: SaveDataCraftedPrism[],
  inverseImageList: SaveData["inverseImageList"],
): TalentPage => {
  const treeSlots: TreeSlot[] = ["tree1", "tree2", "tree3", "tree4"];
  const placedPrism = saveDataTalentPage.placedPrism;

  const allocatedTalents: TalentGrid = {};

  for (const slot of treeSlots) {
    const tree = saveDataTalentPage[slot];
    if (tree) {
      const src = getTalentSrc(slot);
      allocatedTalents[slot] = convertTalentTree(tree, slot, placedPrism, src);
    }
  }

  if (placedPrism) {
    const src = getTalentSrc(placedPrism.treeSlot);
    allocatedTalents.placedPrism = convertPlacedPrism(placedPrism, src);
  }

  if (saveDataTalentPage.placedInverseImage) {
    const inverseImage = saveDataTalentPage.placedInverseImage;
    const src = getTalentSrc(inverseImage.treeSlot);
    const tree = saveDataTalentPage[inverseImage.treeSlot];

    if (tree) {
      allocatedTalents.placedInverseImage = {
        inverseImage: inverseImage.inverseImage,
        treeSlot: inverseImage.treeSlot,
        position: inverseImage.position,
        reflectedAllocatedNodes: inverseImage.reflectedAllocatedNodes.map(
          (node) => enrichReflectedNode(node, tree.name, src),
        ),
      };
    } else {
      allocatedTalents.placedInverseImage = {
        inverseImage: inverseImage.inverseImage,
        treeSlot: inverseImage.treeSlot,
        position: inverseImage.position,
        reflectedAllocatedNodes: inverseImage.reflectedAllocatedNodes.map(
          (node) => ({
            ...node,
            affix: { text: "", src },
            prismAffixes: [],
          }),
        ),
      };
    }
  }

  const inventory: TalentInventory = {
    prismList,
    inverseImageList,
  };

  return {
    allocatedTalents,
    inventory,
  };
};

export const loadSave = (saveData: SaveData): Loadout => {
  return {
    gearPage: convertGearPage(saveData.equipmentPage, saveData.itemsList),
    talentPage: convertTalentPage(
      saveData.talentPage,
      saveData.prismList,
      saveData.inverseImageList,
    ),
    divinityPage: { slates: [] },
    customConfiguration: [],
  };
};
