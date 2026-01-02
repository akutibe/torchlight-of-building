import type {
  ActiveSkillName,
  BaseSkill,
  MagnificentSupportSkillName,
  PassiveSkillName,
  SupportSkillName,
} from "@/src/data/skill/types";
import { activeSkillModFactories } from "./active_factories";
import { magnificentSupportSkillModFactories } from "./magnificent_support_factories";
import { passiveSkillModFactories } from "./passive_factories";
import { supportSkillModFactories } from "./support_factories";

/**
 * Check if a skill has a factory implementation.
 * Skills without implementations don't contribute to calculations.
 */
export const isSkillImplemented = (skill: BaseSkill): boolean => {
  switch (skill.type) {
    case "Active":
      return (
        activeSkillModFactories[skill.name as ActiveSkillName] !== undefined
      );
    case "Passive":
      return (
        passiveSkillModFactories[skill.name as PassiveSkillName] !== undefined
      );
    case "Support":
      return (
        supportSkillModFactories[skill.name as SupportSkillName] !== undefined
      );
    case "Support (Magnificent)":
      return (
        magnificentSupportSkillModFactories[
          skill.name as MagnificentSupportSkillName
        ] !== undefined
      );
    default:
      // Noble, Activation Medium don't have factory patterns yet
      return false;
  }
};
