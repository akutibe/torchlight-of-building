"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { MAX_SLATE_AFFIXES } from "../lib/constants";
import type {
  DivinityAffixType,
  DivinityGod,
  SlateShape,
} from "../lib/save-data";

interface SelectedSlateAffix {
  effect: string;
  affixType: DivinityAffixType;
}

interface DivinityUIState {
  // Slate crafting state
  craftingGod: DivinityGod | undefined;
  craftingShape: SlateShape;
  craftingAffixes: SelectedSlateAffix[];

  // Dragging state
  draggingSlateId: string | undefined;
  previewPosition: { row: number; col: number } | undefined;

  // Actions
  setCraftingGod: (god: DivinityGod | undefined) => void;
  setCraftingShape: (shape: SlateShape) => void;
  addCraftingAffix: (affix: SelectedSlateAffix) => void;
  removeCraftingAffix: (index: number) => void;
  resetSlateCrafting: () => void;

  setDraggingSlateId: (id: string | undefined) => void;
  setPreviewPosition: (
    position: { row: number; col: number } | undefined,
  ) => void;
}

export const useDivinityUIStore = create<DivinityUIState>()(
  immer((set) => ({
    // Initial state
    craftingGod: undefined,
    craftingShape: "O",
    craftingAffixes: [],
    draggingSlateId: undefined,
    previewPosition: undefined,

    // Actions
    setCraftingGod: (god) =>
      set((state) => {
        state.craftingGod = god;
        state.craftingAffixes = [];
      }),

    setCraftingShape: (shape) =>
      set((state) => {
        state.craftingShape = shape;
      }),

    addCraftingAffix: (affix) =>
      set((state) => {
        if (state.craftingAffixes.length >= MAX_SLATE_AFFIXES) return;
        if (state.craftingAffixes.some((a) => a.effect === affix.effect))
          return;
        state.craftingAffixes.push(affix);
      }),

    removeCraftingAffix: (index) =>
      set((state) => {
        state.craftingAffixes.splice(index, 1);
      }),

    resetSlateCrafting: () =>
      set((state) => {
        state.craftingGod = undefined;
        state.craftingShape = "O";
        state.craftingAffixes = [];
      }),

    setDraggingSlateId: (id) =>
      set((state) => {
        state.draggingSlateId = id;
      }),

    setPreviewPosition: (position) =>
      set((state) => {
        state.previewPosition = position;
      }),
  })),
);
