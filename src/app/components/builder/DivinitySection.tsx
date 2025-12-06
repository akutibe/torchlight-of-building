"use client";

import { useCallback } from "react";
import type { DivinitySlate, PlacedSlate } from "../../lib/save-data";
import { generateItemId } from "../../lib/storage";
import { useBuilderStore } from "../../stores/builderStore";
import { DivinityTab } from "../divinity/DivinityTab";

export const DivinitySection = () => {
  const saveData = useBuilderStore((state) => state.saveData);
  const updateSaveData = useBuilderStore((state) => state.updateSaveData);

  const handleSaveSlate = useCallback(
    (slate: DivinitySlate) => {
      updateSaveData((prev) => ({
        ...prev,
        divinitySlateList: [...prev.divinitySlateList, slate],
      }));
    },
    [updateSaveData],
  );

  const handleUpdateSlate = useCallback(
    (slate: DivinitySlate) => {
      updateSaveData((prev) => ({
        ...prev,
        divinitySlateList: prev.divinitySlateList.map((s) =>
          s.id === slate.id ? slate : s,
        ),
      }));
    },
    [updateSaveData],
  );

  const handleCopySlate = useCallback(
    (slate: DivinitySlate) => {
      const newSlate = { ...slate, id: generateItemId() };
      updateSaveData((prev) => ({
        ...prev,
        divinitySlateList: [...prev.divinitySlateList, newSlate],
      }));
    },
    [updateSaveData],
  );

  const handleDeleteSlate = useCallback(
    (slateId: string) => {
      updateSaveData((prev) => ({
        ...prev,
        divinitySlateList: prev.divinitySlateList.filter(
          (s) => s.id !== slateId,
        ),
        divinityPage: {
          ...prev.divinityPage,
          placedSlates: prev.divinityPage.placedSlates.filter(
            (p) => p.slateId !== slateId,
          ),
        },
      }));
    },
    [updateSaveData],
  );

  const handlePlaceSlate = useCallback(
    (placement: PlacedSlate) => {
      updateSaveData((prev) => ({
        ...prev,
        divinityPage: {
          ...prev.divinityPage,
          placedSlates: [...prev.divinityPage.placedSlates, placement],
        },
      }));
    },
    [updateSaveData],
  );

  const handleRemovePlacedSlate = useCallback(
    (slateId: string) => {
      updateSaveData((prev) => ({
        ...prev,
        divinityPage: {
          ...prev.divinityPage,
          placedSlates: prev.divinityPage.placedSlates.filter(
            (p) => p.slateId !== slateId,
          ),
        },
      }));
    },
    [updateSaveData],
  );

  const handleMoveSlate = useCallback(
    (slateId: string, position: { row: number; col: number }) => {
      updateSaveData((prev) => ({
        ...prev,
        divinityPage: {
          ...prev.divinityPage,
          placedSlates: prev.divinityPage.placedSlates.map((p) =>
            p.slateId === slateId ? { ...p, position } : p,
          ),
        },
      }));
    },
    [updateSaveData],
  );

  return (
    <DivinityTab
      divinityPage={saveData.divinityPage}
      divinitySlateList={saveData.divinitySlateList}
      onSaveSlate={handleSaveSlate}
      onUpdateSlate={handleUpdateSlate}
      onCopySlate={handleCopySlate}
      onDeleteSlate={handleDeleteSlate}
      onPlaceSlate={handlePlaceSlate}
      onRemovePlacedSlate={handleRemovePlacedSlate}
      onMoveSlate={handleMoveSlate}
    />
  );
};
