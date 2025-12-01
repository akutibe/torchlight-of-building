import { RawDivinitySlate, PlacedSlate, SlateShape, Rotation } from "@/src/tli/core";
import { getOccupiedCells, getTransformedCells } from "./divinity-shapes";

export const GRID_MASK: number[][] = [
  [0, 0, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 0, 0],
];

export const GRID_ROWS = 6;
export const GRID_COLS = 6;

export const isValidGridCell = (row: number, col: number): boolean => {
  if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS) {
    return false;
  }
  return GRID_MASK[row][col] === 1;
};

export const buildOccupiedCellsSet = (
  slates: RawDivinitySlate[],
  placements: PlacedSlate[],
): Set<string> => {
  const occupied = new Set<string>();

  placements.forEach((placement) => {
    const slate = slates.find((s) => s.id === placement.slateId);
    if (!slate) return;

    const cells = getOccupiedCells(slate, placement);
    cells.forEach(([r, c]) => occupied.add(`${r},${c}`));
  });

  return occupied;
};

export const canPlaceSlate = (
  shape: SlateShape,
  position: { row: number; col: number },
  rotation: Rotation,
  flippedH: boolean,
  flippedV: boolean,
  occupiedCells: Set<string>,
): boolean => {
  const cells = getTransformedCells(shape, rotation, flippedH, flippedV);
  const absoluteCells = cells.map(
    ([r, c]): [number, number] => [r + position.row, c + position.col],
  );

  return absoluteCells.every(([r, c]) => {
    const key = `${r},${c}`;
    return isValidGridCell(r, c) && !occupiedCells.has(key);
  });
};

export const findSlateAtCell = (
  row: number,
  col: number,
  slates: RawDivinitySlate[],
  placements: PlacedSlate[],
): PlacedSlate | undefined => {
  for (const placement of placements) {
    const slate = slates.find((s) => s.id === placement.slateId);
    if (!slate) continue;

    const cells = getOccupiedCells(slate, placement);
    if (cells.some(([r, c]) => r === row && c === col)) {
      return placement;
    }
  }
  return undefined;
};
