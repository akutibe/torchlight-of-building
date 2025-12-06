"use client";

import { useCallback } from "react";
import type { PactspiritPage } from "@/src/tli/core";
import { createEmptyPactspiritSlot } from "../../lib/storage";
import type {
  InstalledDestinyResult,
  PactspiritSlotIndex,
  RingSlotKey,
} from "../../lib/types";
import { useBuilderStore } from "../../stores/builderStore";
import { useLoadout } from "../../stores/builderStoreSelectors";
import { PactspiritTab } from "../pactspirit/PactspiritTab";

export const PactspiritSection = () => {
  const loadout = useLoadout();
  const updateSaveData = useBuilderStore((state) => state.updateSaveData);

  const handlePactspiritSelect = useCallback(
    (slotIndex: PactspiritSlotIndex, pactspiritName: string | undefined) => {
      const slotKey = `slot${slotIndex}` as keyof PactspiritPage;
      updateSaveData((prev) => ({
        ...prev,
        pactspiritPage: {
          ...prev.pactspiritPage,
          [slotKey]: {
            ...createEmptyPactspiritSlot(),
            pactspiritName,
          },
        },
      }));
    },
    [updateSaveData],
  );

  const handleLevelChange = useCallback(
    (slotIndex: PactspiritSlotIndex, level: number) => {
      const slotKey = `slot${slotIndex}` as keyof PactspiritPage;
      updateSaveData((prev) => ({
        ...prev,
        pactspiritPage: {
          ...prev.pactspiritPage,
          [slotKey]: {
            ...prev.pactspiritPage[slotKey],
            level,
          },
        },
      }));
    },
    [updateSaveData],
  );

  const handleInstallDestiny = useCallback(
    (
      slotIndex: PactspiritSlotIndex,
      ringSlot: RingSlotKey,
      destiny: InstalledDestinyResult,
    ) => {
      const slotKey = `slot${slotIndex}` as keyof PactspiritPage;
      updateSaveData((prev) => ({
        ...prev,
        pactspiritPage: {
          ...prev.pactspiritPage,
          [slotKey]: {
            ...prev.pactspiritPage[slotKey],
            rings: {
              ...prev.pactspiritPage[slotKey].rings,
              [ringSlot]: {
                installedDestiny: destiny,
              },
            },
          },
        },
      }));
    },
    [updateSaveData],
  );

  const handleRevertRing = useCallback(
    (slotIndex: PactspiritSlotIndex, ringSlot: RingSlotKey) => {
      const slotKey = `slot${slotIndex}` as keyof PactspiritPage;
      updateSaveData((prev) => ({
        ...prev,
        pactspiritPage: {
          ...prev.pactspiritPage,
          [slotKey]: {
            ...prev.pactspiritPage[slotKey],
            rings: {
              ...prev.pactspiritPage[slotKey].rings,
              [ringSlot]: {},
            },
          },
        },
      }));
    },
    [updateSaveData],
  );

  return (
    <PactspiritTab
      pactspiritPage={loadout.pactspiritPage}
      onPactspiritSelect={handlePactspiritSelect}
      onLevelChange={handleLevelChange}
      onInstallDestiny={handleInstallDestiny}
      onRevertRing={handleRevertRing}
    />
  );
};
