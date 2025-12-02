"use client";

import { createPortal } from "react-dom";

interface TooltipProps {
  isVisible: boolean;
  mousePos: { x: number; y: number };
  children: React.ReactNode;
  width?: "sm" | "md" | "lg";
}

const widthClasses = {
  sm: "w-64",
  md: "w-72",
  lg: "w-80",
} as const;

export const Tooltip = ({
  isVisible,
  mousePos,
  children,
  width = "md",
}: TooltipProps) => {
  if (!isVisible || typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`fixed z-50 ${widthClasses[width]} pointer-events-none`}
      style={{ left: mousePos.x + 12, top: mousePos.y + 12 }}
    >
      <div className="bg-zinc-950 text-zinc-50 p-3 rounded-lg shadow-xl border border-zinc-700">
        {children}
      </div>
    </div>,
    document.body,
  );
};

interface TooltipTitleProps {
  children: React.ReactNode;
}

export const TooltipTitle = ({ children }: TooltipTitleProps) => (
  <div className="font-semibold text-sm mb-2 text-amber-400">{children}</div>
);

interface TooltipContentProps {
  children: React.ReactNode;
}

export const TooltipContent = ({ children }: TooltipContentProps) => (
  <div className="text-xs text-zinc-400 whitespace-pre-line">{children}</div>
);
