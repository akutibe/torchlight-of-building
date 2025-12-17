"use client";

import { Fragment } from "react";
import { TooltipContent, TooltipTitle } from "@/src/app/components/ui/Tooltip";
import type { BaseSkill } from "@/src/data/skill/types";

interface SkillTooltipContentProps {
  skill: BaseSkill;
}

export const SkillTooltipContent: React.FC<SkillTooltipContentProps> = ({
  skill,
}) => {
  return (
    <>
      <TooltipTitle>{skill.name}</TooltipTitle>
      {skill.tags.length > 0 && (
        <div className="text-xs text-zinc-500 mb-2">
          {skill.tags.join(" • ")}
        </div>
      )}
      {skill.description.map((desc, i) => (
        // Description arrays are static, so index key is safe here
        // biome-ignore lint/suspicious/noArrayIndexKey: static array
        <Fragment key={i}>
          {i > 0 && <hr className="border-zinc-700 my-2" />}
          <TooltipContent>{desc}</TooltipContent>
        </Fragment>
      ))}
    </>
  );
};
