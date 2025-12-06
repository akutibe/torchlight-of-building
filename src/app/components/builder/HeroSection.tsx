"use client";

import { useCallback } from "react";
import { getBaseTraitForHero } from "../../lib/hero-utils";
import type { HeroMemory, HeroMemorySlot } from "../../lib/save-data";
import { createEmptyHeroPage, generateItemId } from "../../lib/storage";
import { useBuilderStore } from "../../stores/builderStore";
import { useLoadout } from "../../stores/builderStoreSelectors";
import { HeroTab } from "../hero/HeroTab";

export const HeroSection = () => {
  const saveData = useBuilderStore((state) => state.saveData);
  const updateSaveData = useBuilderStore((state) => state.updateSaveData);
  const loadout = useLoadout();

  const handleHeroChange = useCallback(
    (hero: string | undefined) => {
      updateSaveData((prev) => {
        if (!hero) {
          return {
            ...prev,
            heroPage: createEmptyHeroPage(),
          };
        }

        const baseTrait = getBaseTraitForHero(hero);

        return {
          ...prev,
          heroPage: {
            selectedHero: hero,
            traits: {
              level1: baseTrait?.name,
              level45: undefined,
              level60: undefined,
              level75: undefined,
            },
            memorySlots: {
              slot45: undefined,
              slot60: undefined,
              slot75: undefined,
            },
          },
        };
      });
    },
    [updateSaveData],
  );

  const handleTraitSelect = useCallback(
    (level: 45 | 60 | 75, traitName: string | undefined) => {
      const traitKey = `level${level}` as "level45" | "level60" | "level75";
      updateSaveData((prev) => ({
        ...prev,
        heroPage: {
          ...prev.heroPage,
          traits: {
            ...prev.heroPage.traits,
            [traitKey]: traitName,
          },
        },
      }));
    },
    [updateSaveData],
  );

  const handleMemoryEquip = useCallback(
    (slot: HeroMemorySlot, memoryId: string | undefined) => {
      updateSaveData((prev) => {
        const memory = memoryId
          ? prev.heroMemoryList.find((m) => m.id === memoryId)
          : undefined;

        return {
          ...prev,
          heroPage: {
            ...prev.heroPage,
            memorySlots: {
              ...prev.heroPage.memorySlots,
              [slot]: memory,
            },
          },
        };
      });
    },
    [updateSaveData],
  );

  const handleMemorySave = useCallback(
    (memory: HeroMemory) => {
      updateSaveData((prev) => ({
        ...prev,
        heroMemoryList: [...prev.heroMemoryList, memory],
      }));
    },
    [updateSaveData],
  );

  const handleMemoryCopy = useCallback(
    (memory: HeroMemory) => {
      const newMemory: HeroMemory = { ...memory, id: generateItemId() };
      updateSaveData((prev) => ({
        ...prev,
        heroMemoryList: [...prev.heroMemoryList, newMemory],
      }));
    },
    [updateSaveData],
  );

  const handleMemoryDelete = useCallback(
    (memoryId: string) => {
      updateSaveData((prev) => {
        const newMemoryList = prev.heroMemoryList.filter(
          (m) => m.id !== memoryId,
        );
        const newMemorySlots = { ...prev.heroPage.memorySlots };
        if (newMemorySlots.slot45?.id === memoryId) {
          newMemorySlots.slot45 = undefined;
        }
        if (newMemorySlots.slot60?.id === memoryId) {
          newMemorySlots.slot60 = undefined;
        }
        if (newMemorySlots.slot75?.id === memoryId) {
          newMemorySlots.slot75 = undefined;
        }

        return {
          ...prev,
          heroMemoryList: newMemoryList,
          heroPage: {
            ...prev.heroPage,
            memorySlots: newMemorySlots,
          },
        };
      });
    },
    [updateSaveData],
  );

  return (
    <HeroTab
      heroPage={loadout.heroPage}
      heroMemoryList={saveData.heroMemoryList}
      onHeroChange={handleHeroChange}
      onTraitSelect={handleTraitSelect}
      onMemoryEquip={handleMemoryEquip}
      onMemorySave={handleMemorySave}
      onMemoryCopy={handleMemoryCopy}
      onMemoryDelete={handleMemoryDelete}
    />
  );
};
