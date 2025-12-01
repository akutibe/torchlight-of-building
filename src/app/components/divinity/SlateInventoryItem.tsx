"use client";

import { RawDivinitySlate } from "@/src/tli/core";
import { getSlateDisplayName, GOD_COLORS, GOD_BORDER_COLORS } from "@/src/app/lib/divinity-utils";
import { SlatePreview } from "./SlatePreview";

interface SlateInventoryItemProps {
  slate: RawDivinitySlate;
  isPlaced: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onCopy: () => void;
  onDelete: () => void;
}

export const SlateInventoryItem: React.FC<SlateInventoryItemProps> = ({
  slate,
  isPlaced,
  isSelected,
  onSelect,
  onEdit,
  onCopy,
  onDelete,
}) => {
  const legendaryCount = slate.affixTypes.filter((t) => t === "Legendary Medium").length;
  const mediumCount = slate.affixTypes.filter((t) => t === "Medium").length;

  return (
    <div
      className={`flex items-center gap-3 rounded border p-2 transition-colors ${
        isSelected
          ? `${GOD_BORDER_COLORS[slate.god]} border-2 bg-zinc-700`
          : isPlaced
            ? "border-zinc-600 bg-zinc-700/50"
            : "border-zinc-700 bg-zinc-900 hover:border-zinc-600"
      }`}
    >
      <div className="flex-shrink-0">
        <SlatePreview
          shape={slate.shape}
          god={slate.god}
          rotation={slate.rotation}
          flippedH={slate.flippedH}
          flippedV={slate.flippedV}
          size="small"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-200">
            {getSlateDisplayName(slate.god)}
          </span>
          {isPlaced && (
            <span className="rounded bg-zinc-600 px-1.5 py-0.5 text-xs text-zinc-300">
              Placed
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1">
          {legendaryCount > 0 && (
            <div className="flex items-center gap-0.5">
              <span className="h-2 w-2 rounded-sm bg-orange-500" />
              <span className="text-xs text-zinc-400">×{legendaryCount}</span>
            </div>
          )}
          {mediumCount > 0 && (
            <div className="flex items-center gap-0.5 ml-1">
              <span className="h-2 w-2 rounded-sm bg-purple-500" />
              <span className="text-xs text-zinc-400">×{mediumCount}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        {!isPlaced && (
          <button
            onClick={onSelect}
            className={`rounded px-2 py-1 text-xs transition-colors ${
              isSelected
                ? "bg-amber-600 text-white"
                : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
            }`}
          >
            {isSelected ? "Selected" : "Place"}
          </button>
        )}
        <button
          onClick={onEdit}
          className="rounded bg-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-600"
        >
          Edit
        </button>
        <button
          onClick={onCopy}
          className="rounded bg-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-600"
        >
          Copy
        </button>
        <button
          onClick={onDelete}
          className="rounded bg-zinc-700 px-2 py-1 text-xs text-red-400 hover:bg-red-900"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
