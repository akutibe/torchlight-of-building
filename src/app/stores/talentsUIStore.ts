"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { PrismRarity } from "../lib/save-data";
import type { TreeSlot } from "../lib/types";

interface TalentsUIState {
  // Active tree slot being viewed
  activeTreeSlot: TreeSlot;

  // Prism crafting state
  selectedPrismId: string | undefined;
  craftingPrismRarity: PrismRarity;
  craftingBaseAffix: string | undefined;
  craftingGaugeAffixes: Array<{ affix: string; isLegendary: boolean }>;

  // Inverse image selection state
  selectedInverseImageId: string | undefined;

  // Actions
  setActiveTreeSlot: (slot: TreeSlot) => void;

  // Prism crafting actions
  setSelectedPrismId: (id: string | undefined) => void;
  setCraftingPrismRarity: (rarity: PrismRarity) => void;
  setCraftingBaseAffix: (affix: string | undefined) => void;
  addCraftingGaugeAffix: (affix: string, isLegendary: boolean) => void;
  removeCraftingGaugeAffix: (index: number) => void;
  resetPrismCrafting: () => void;

  // Inverse image actions
  setSelectedInverseImageId: (id: string | undefined) => void;
}

export const useTalentsUIStore = create<TalentsUIState>()(
  immer((set) => ({
    // Initial state
    activeTreeSlot: "tree1",
    selectedPrismId: undefined,
    craftingPrismRarity: "rare",
    craftingBaseAffix: undefined,
    craftingGaugeAffixes: [],
    selectedInverseImageId: undefined,

    // Actions
    setActiveTreeSlot: (slot) =>
      set((state) => {
        state.activeTreeSlot = slot;
      }),

    setSelectedPrismId: (id) =>
      set((state) => {
        state.selectedPrismId = id;
      }),

    setCraftingPrismRarity: (rarity) =>
      set((state) => {
        state.craftingPrismRarity = rarity;
        state.craftingBaseAffix = undefined;
        if (rarity === "rare") {
          state.craftingGaugeAffixes = state.craftingGaugeAffixes.filter(
            (a) => !a.isLegendary,
          );
        }
      }),

    setCraftingBaseAffix: (affix) =>
      set((state) => {
        state.craftingBaseAffix = affix;
      }),

    addCraftingGaugeAffix: (affix, isLegendary) =>
      set((state) => {
        state.craftingGaugeAffixes.push({ affix, isLegendary });
      }),

    removeCraftingGaugeAffix: (index) =>
      set((state) => {
        state.craftingGaugeAffixes.splice(index, 1);
      }),

    resetPrismCrafting: () =>
      set((state) => {
        state.craftingPrismRarity = "rare";
        state.craftingBaseAffix = undefined;
        state.craftingGaugeAffixes = [];
      }),

    setSelectedInverseImageId: (id) =>
      set((state) => {
        state.selectedInverseImageId = id;
      }),
  })),
);
