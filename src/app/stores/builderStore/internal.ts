"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { SaveData } from "../../lib/save-data";
import type { SavesIndex } from "../../lib/saves";
import { createEmptySaveData } from "../../lib/storage";

export interface InternalBuilderState {
  saveData: SaveData;
  hasUnsavedChanges: boolean;
  currentSaveId: string | undefined;
  currentSaveName: string | undefined;
  savesIndex: SavesIndex;
}

export const internalStore = create<InternalBuilderState>()(
  immer(
    persist(
      (): InternalBuilderState => ({
        saveData: createEmptySaveData(),
        hasUnsavedChanges: false,
        currentSaveId: undefined,
        currentSaveName: undefined,
        savesIndex: { currentSaveId: undefined, saves: [] },
      }),
      {
        name: "torchlight-builder-storage",
        partialize: (state) => ({
          saveData: state.saveData,
          currentSaveId: state.currentSaveId,
        }),
      },
    ),
  ),
);
