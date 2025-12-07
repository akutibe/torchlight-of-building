"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { PactspiritSlotIndex, RingSlotKey } from "../lib/types";

interface PactspiritUIState {
  // Destiny selection modal state
  isDestinyModalOpen: boolean;
  destinyModalSlotIndex: PactspiritSlotIndex | undefined;
  destinyModalRingSlot: RingSlotKey | undefined;

  // Actions
  openDestinyModal: (
    slotIndex: PactspiritSlotIndex,
    ringSlot: RingSlotKey,
  ) => void;
  closeDestinyModal: () => void;
}

export const usePactspiritUIStore = create<PactspiritUIState>()(
  immer((set) => ({
    // Initial state
    isDestinyModalOpen: false,
    destinyModalSlotIndex: undefined,
    destinyModalRingSlot: undefined,

    // Actions
    openDestinyModal: (slotIndex, ringSlot) =>
      set((state) => {
        state.isDestinyModalOpen = true;
        state.destinyModalSlotIndex = slotIndex;
        state.destinyModalRingSlot = ringSlot;
      }),

    closeDestinyModal: () =>
      set((state) => {
        state.isDestinyModalOpen = false;
        state.destinyModalSlotIndex = undefined;
        state.destinyModalRingSlot = undefined;
      }),
  })),
);
