"use client";

import { useState } from "react";
import {
  RawDivinityPage,
  RawDivinitySlate,
  PlacedSlate,
} from "@/src/tli/core";
import { DivinityGrid } from "./DivinityGrid";
import { SlateCrafter } from "./SlateCrafter";
import { SlateInventory } from "./SlateInventory";

interface DivinityTabProps {
  divinityPage: RawDivinityPage;
  divinitySlateList: RawDivinitySlate[];
  onSaveSlate: (slate: RawDivinitySlate) => void;
  onUpdateSlate: (slate: RawDivinitySlate) => void;
  onCopySlate: (slate: RawDivinitySlate) => void;
  onDeleteSlate: (slateId: string) => void;
  onPlaceSlate: (placement: PlacedSlate) => void;
  onRemovePlacedSlate: (slateId: string) => void;
}

export const DivinityTab: React.FC<DivinityTabProps> = ({
  divinityPage,
  divinitySlateList,
  onSaveSlate,
  onUpdateSlate,
  onCopySlate,
  onDeleteSlate,
  onPlaceSlate,
  onRemovePlacedSlate,
}) => {
  const [selectedSlateId, setSelectedSlateId] = useState<string | undefined>();
  const [editingSlate, setEditingSlate] = useState<RawDivinitySlate | undefined>();

  const selectedSlate = selectedSlateId
    ? divinitySlateList.find((s) => s.id === selectedSlateId)
    : undefined;

  const placedSlateIds = divinityPage.placedSlates.map((p) => p.slateId);
  const editingSlateIsPlaced = editingSlate
    ? placedSlateIds.includes(editingSlate.id)
    : false;

  const handleSelectForPlacement = (slateId: string) => {
    if (selectedSlateId === slateId) {
      setSelectedSlateId(undefined);
    } else {
      setSelectedSlateId(slateId);
    }
  };

  const handleEditSlate = (slate: RawDivinitySlate) => {
    setEditingSlate(slate);
    setSelectedSlateId(undefined);
  };

  const handleCancelEdit = () => {
    setEditingSlate(undefined);
  };

  const handleSaveEdit = (slate: RawDivinitySlate) => {
    onUpdateSlate(slate);
    setEditingSlate(undefined);
  };

  const handlePlaceAtPosition = (position: { row: number; col: number }) => {
    if (!selectedSlateId) return;

    const placement: PlacedSlate = {
      slateId: selectedSlateId,
      position,
    };

    onPlaceSlate(placement);
    setSelectedSlateId(undefined);
  };

  const handleClickPlacedSlate = (slateId: string) => {
    const slate = divinitySlateList.find((s) => s.id === slateId);
    if (slate) {
      handleEditSlate(slate);
    }
  };

  const handleRemoveFromGrid = () => {
    if (editingSlate) {
      onRemovePlacedSlate(editingSlate.id);
    }
  };

  return (
    <div className="flex gap-8">
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-medium text-zinc-200">Divinity Grid</h3>
        <DivinityGrid
          divinityPage={divinityPage}
          divinitySlateList={divinitySlateList}
          selectedSlate={selectedSlate}
          onPlaceAtPosition={handlePlaceAtPosition}
          onClickPlacedSlate={handleClickPlacedSlate}
        />
        {selectedSlate && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-400">
              Click a cell to place the selected slate
            </span>
            <button
              onClick={() => setSelectedSlateId(undefined)}
              className="rounded bg-zinc-700 px-3 py-1 text-sm text-zinc-200 hover:bg-zinc-600"
            >
              Cancel (Esc)
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <SlateCrafter
          editingSlate={editingSlate}
          isPlaced={editingSlateIsPlaced}
          onSave={editingSlate ? handleSaveEdit : onSaveSlate}
          onCancel={editingSlate ? handleCancelEdit : undefined}
          onRemoveFromGrid={editingSlateIsPlaced ? handleRemoveFromGrid : undefined}
        />

        <SlateInventory
          slates={divinitySlateList}
          placedSlateIds={placedSlateIds}
          selectedSlateId={selectedSlateId}
          onSelect={handleSelectForPlacement}
          onEdit={handleEditSlate}
          onCopy={onCopySlate}
          onDelete={onDeleteSlate}
        />
      </div>
    </div>
  );
};
