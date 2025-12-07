"use client";

import { enableMapSet } from "immer";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

enableMapSet();

type SkillSlotType = "active" | "passive";
type SkillSlotNumber = 1 | 2 | 3 | 4;

interface SkillsUIState {
  // Expanded skill slots (for showing support skills)
  expandedSlots: Set<string>;

  // Actions
  toggleSlotExpanded: (type: SkillSlotType, slot: SkillSlotNumber) => void;
  setSlotExpanded: (
    type: SkillSlotType,
    slot: SkillSlotNumber,
    expanded: boolean,
  ) => void;
  isSlotExpanded: (type: SkillSlotType, slot: SkillSlotNumber) => boolean;
  collapseAllSlots: () => void;
}

const getSlotKey = (type: SkillSlotType, slot: SkillSlotNumber): string =>
  `${type}-${slot}`;

export const useSkillsUIStore = create<SkillsUIState>()(
  immer((set, get) => ({
    // Initial state
    expandedSlots: new Set<string>(),

    // Actions
    toggleSlotExpanded: (type, slot) =>
      set((state) => {
        const key = getSlotKey(type, slot);
        if (state.expandedSlots.has(key)) {
          state.expandedSlots.delete(key);
        } else {
          state.expandedSlots.add(key);
        }
      }),

    setSlotExpanded: (type, slot, expanded) =>
      set((state) => {
        const key = getSlotKey(type, slot);
        if (expanded) {
          state.expandedSlots.add(key);
        } else {
          state.expandedSlots.delete(key);
        }
      }),

    isSlotExpanded: (type, slot) => {
      const key = getSlotKey(type, slot);
      return get().expandedSlots.has(key);
    },

    collapseAllSlots: () =>
      set((state) => {
        state.expandedSlots.clear();
      }),
  })),
);
