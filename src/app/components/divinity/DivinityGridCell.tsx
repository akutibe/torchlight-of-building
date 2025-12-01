"use client";

import { RawDivinitySlate } from "@/src/tli/core";
import { GOD_COLORS } from "@/src/app/lib/divinity-utils";

interface DivinityGridCellProps {
  row: number;
  col: number;
  isValid: boolean;
  isOccupied: boolean;
  isPreview: boolean;
  isValidPlacement: boolean;
  slate: RawDivinitySlate | undefined;
  selectedSlate: RawDivinitySlate | undefined;
  onClick: () => void;
  onMouseEnter: () => void;
}

export const DivinityGridCell: React.FC<DivinityGridCellProps> = ({
  isValid,
  isOccupied,
  isPreview,
  isValidPlacement,
  slate,
  selectedSlate,
  onClick,
  onMouseEnter,
}) => {
  if (!isValid) {
    return <div className="h-12 w-12" />;
  }

  const getBackgroundClass = (): string => {
    if (isPreview && selectedSlate) {
      if (isValidPlacement) {
        return `${GOD_COLORS[selectedSlate.god]} opacity-50`;
      }
      return "bg-red-500 opacity-50";
    }

    if (slate) {
      return GOD_COLORS[slate.god];
    }

    return "bg-zinc-800";
  };

  const getBorderClass = (): string => {
    if (isPreview && !isValidPlacement) {
      return "border-2 border-red-400";
    }
    if (isPreview && isValidPlacement) {
      return "border-2 border-white";
    }
    if (slate) {
      return "border border-zinc-600";
    }
    return "border border-zinc-700";
  };

  const getCursorClass = (): string => {
    if (selectedSlate) {
      return isValidPlacement && isPreview ? "cursor-pointer" : "cursor-not-allowed";
    }
    if (slate) {
      return "cursor-pointer";
    }
    return "cursor-default";
  };

  return (
    <div
      className={`h-12 w-12 transition-colors ${getBackgroundClass()} ${getBorderClass()} ${getCursorClass()}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    />
  );
};
