"use client";

import { useCallback, useMemo } from "react";
import { ActiveSkills, PassiveSkills } from "@/src/data/skill";
import type { SupportSkills } from "../../lib/save-data";
import { useBuilderStore } from "../../stores/builderStore";
import { SkillSlot } from "../skills/SkillSlot";

type ActiveSkillSlot =
  | "activeSkill1"
  | "activeSkill2"
  | "activeSkill3"
  | "activeSkill4";
type PassiveSkillSlot =
  | "passiveSkill1"
  | "passiveSkill2"
  | "passiveSkill3"
  | "passiveSkill4";
type SkillSlotKey = ActiveSkillSlot | PassiveSkillSlot;
type SupportSkillKey = keyof SupportSkills;

const ACTIVE_SKILL_SLOTS: ActiveSkillSlot[] = [
  "activeSkill1",
  "activeSkill2",
  "activeSkill3",
  "activeSkill4",
];

const PASSIVE_SKILL_SLOTS: PassiveSkillSlot[] = [
  "passiveSkill1",
  "passiveSkill2",
  "passiveSkill3",
  "passiveSkill4",
];

export const SkillsSection = () => {
  const saveData = useBuilderStore((state) => state.saveData);
  const updateSaveData = useBuilderStore((state) => state.updateSaveData);

  const getSelectedActiveSkillNames = useMemo((): string[] => {
    return ACTIVE_SKILL_SLOTS.map(
      (slot) => saveData.skillPage[slot]?.skillName,
    ).filter((name): name is string => name !== undefined);
  }, [saveData.skillPage]);

  const getSelectedPassiveSkillNames = useMemo((): string[] => {
    return PASSIVE_SKILL_SLOTS.map(
      (slot) => saveData.skillPage[slot]?.skillName,
    ).filter((name): name is string => name !== undefined);
  }, [saveData.skillPage]);

  const handleSkillChange = useCallback(
    (slotKey: SkillSlotKey, skillName: string | undefined): void => {
      updateSaveData((prev) => ({
        ...prev,
        skillPage: {
          ...prev.skillPage,
          [slotKey]: skillName
            ? { skillName, enabled: true, supportSkills: {} }
            : undefined,
        },
      }));
    },
    [updateSaveData],
  );

  const handleToggleSkill = useCallback(
    (slotKey: SkillSlotKey): void => {
      updateSaveData((prev) => {
        const currentSlot = prev.skillPage[slotKey];
        if (!currentSlot) return prev;
        return {
          ...prev,
          skillPage: {
            ...prev.skillPage,
            [slotKey]: { ...currentSlot, enabled: !currentSlot.enabled },
          },
        };
      });
    },
    [updateSaveData],
  );

  const handleUpdateSkillSupport = useCallback(
    (
      slotKey: SkillSlotKey,
      supportKey: SupportSkillKey,
      supportName: string | undefined,
    ): void => {
      updateSaveData((prev) => {
        const currentSlot = prev.skillPage[slotKey];
        if (!currentSlot) return prev;
        return {
          ...prev,
          skillPage: {
            ...prev.skillPage,
            [slotKey]: {
              ...currentSlot,
              supportSkills: {
                ...currentSlot.supportSkills,
                [supportKey]: supportName,
              },
            },
          },
        };
      });
    },
    [updateSaveData],
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-xl font-bold text-zinc-50">Active Skills</h2>

        <div className="space-y-3">
          {ACTIVE_SKILL_SLOTS.map((slotKey, index) => (
            <SkillSlot
              key={slotKey}
              slotLabel={`Active ${index + 1}`}
              skill={saveData.skillPage[slotKey]}
              availableSkills={ActiveSkills}
              excludedSkillNames={getSelectedActiveSkillNames}
              onSkillChange={(skillName) =>
                handleSkillChange(slotKey, skillName)
              }
              onToggle={() => handleToggleSkill(slotKey)}
              onUpdateSupport={(supportKey, supportName) =>
                handleUpdateSkillSupport(slotKey, supportKey, supportName)
              }
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold text-zinc-50">Passive Skills</h2>

        <div className="space-y-3">
          {PASSIVE_SKILL_SLOTS.map((slotKey, index) => (
            <SkillSlot
              key={slotKey}
              slotLabel={`Passive ${index + 1}`}
              skill={saveData.skillPage[slotKey]}
              availableSkills={PassiveSkills}
              excludedSkillNames={getSelectedPassiveSkillNames}
              onSkillChange={(skillName) =>
                handleSkillChange(slotKey, skillName)
              }
              onToggle={() => handleToggleSkill(slotKey)}
              onUpdateSupport={(supportKey, supportName) =>
                handleUpdateSkillSupport(slotKey, supportKey, supportName)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};
