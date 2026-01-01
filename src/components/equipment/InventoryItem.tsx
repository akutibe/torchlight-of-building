import { Tooltip } from "@/src/components/ui/Tooltip";
import { useTooltip } from "@/src/hooks/useTooltip";
import { getGearAffixes } from "@/src/tli/calcs/affix-collectors";
import type { Gear } from "@/src/tli/core";
import { GearTooltipContent } from "./GearTooltipContent";

interface InventoryItemProps {
  item: Gear;
  isEquipped: boolean;
  onCopy: (itemId: string) => void;
  onDelete: (id: string) => void;
}

export const InventoryItem: React.FC<InventoryItemProps> = ({
  item,
  isEquipped,
  onCopy,
  onDelete,
}) => {
  const { isVisible, triggerRef, triggerRect, tooltipHandlers } = useTooltip();

  const isLegendary = item.rarity === "legendary";

  return (
    <div
      className={`group relative flex items-center justify-between p-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors border ${
        isLegendary ? "border-amber-500/50" : "border-transparent"
      }`}
      ref={triggerRef}
    >
      <div className="flex items-center gap-2">
        <span className="font-medium text-zinc-50 text-sm">
          {item.legendaryName ?? item.equipmentType}
        </span>
        {isLegendary && (
          <span className="text-xs text-amber-400 font-medium">Legendary</span>
        )}
        <span className="text-xs text-zinc-500">
          ({getGearAffixes(item).length} affixes)
        </span>
        {isEquipped && (
          <span className="text-xs text-green-500 font-medium">Equipped</span>
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          // biome-ignore lint/style/noNonNullAssertion: inventory items always have id
          onClick={() => onCopy(item.id!)}
          className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded text-xs"
          title="Copy item"
        >
          Copy
        </button>
        <button
          type="button"
          // biome-ignore lint/style/noNonNullAssertion: inventory items always have id
          onClick={() => onDelete(item.id!)}
          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
          title="Delete item"
        >
          Delete
        </button>
      </div>

      <Tooltip
        isVisible={isVisible}
        triggerRect={triggerRect}
        variant={isLegendary ? "legendary" : "default"}
        {...tooltipHandlers}
      >
        <GearTooltipContent item={item} />
      </Tooltip>
    </div>
  );
};
