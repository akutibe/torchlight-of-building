"use client";

import type {
  Gear,
  HeroMemorySlot,
  PlacedSlate,
  ReflectedAllocatedNode,
  SupportSkills,
} from "../../lib/save-data";
import {
  loadSaveData,
  loadSavesIndex,
  saveSaveData,
  saveSavesIndex,
} from "../../lib/saves";
import { generateItemId } from "../../lib/storage";
import type { GearSlot } from "../../lib/types";
import { internalStore } from "./internal";
import type { BuilderActions } from "./types";

export const createActions = (): BuilderActions => ({
  // Core actions
  setSaveData: (saveData) => {
    internalStore.setState({ saveData, hasUnsavedChanges: false });
  },

  updateSaveData: (updater) => {
    internalStore.setState((state) => ({
      saveData: updater(state.saveData),
      hasUnsavedChanges: true,
    }));
  },

  loadFromSave: (saveId) => {
    const index = loadSavesIndex();
    const saveMeta = index.saves.find((s) => s.id === saveId);
    if (!saveMeta) return false;

    const data = loadSaveData(saveId);
    if (!data) return false;

    const updatedIndex = { ...index, currentSaveId: saveId };
    saveSavesIndex(updatedIndex);

    internalStore.setState({
      saveData: data,
      currentSaveId: saveId,
      currentSaveName: saveMeta.name,
      savesIndex: updatedIndex,
      hasUnsavedChanges: false,
    });
    return true;
  },

  save: () => {
    const { currentSaveId, saveData, savesIndex } = internalStore.getState();
    if (!currentSaveId) return false;

    const success = saveSaveData(currentSaveId, saveData);
    if (success) {
      const now = Date.now();
      const updatedSaves = savesIndex.saves.map((s) =>
        s.id === currentSaveId ? { ...s, updatedAt: now } : s,
      );
      const newIndex = { ...savesIndex, saves: updatedSaves };
      saveSavesIndex(newIndex);
      internalStore.setState({
        savesIndex: newIndex,
        hasUnsavedChanges: false,
      });
    }
    return success;
  },

  resetUnsavedChanges: () => {
    internalStore.setState({ hasUnsavedChanges: false });
  },

  // Equipment actions
  addItemToInventory: (item) => {
    internalStore.setState((state) => ({
      saveData: {
        ...state.saveData,
        itemsList: [...state.saveData.itemsList, item],
      },
      hasUnsavedChanges: true,
    }));
  },

  copyItem: (itemId) => {
    const item = internalStore
      .getState()
      .saveData.itemsList.find((i) => i.id === itemId);
    if (!item) return;
    const newItem: Gear = { ...item, id: generateItemId() };
    internalStore.setState((state) => ({
      saveData: {
        ...state.saveData,
        itemsList: [...state.saveData.itemsList, newItem],
      },
      hasUnsavedChanges: true,
    }));
  },

  deleteItem: (itemId) => {
    internalStore.setState((state) => {
      const newItemsList = state.saveData.itemsList.filter(
        (item) => item.id !== itemId,
      );
      const newEquipmentPage = { ...state.saveData.equipmentPage };
      const slots: GearSlot[] = [
        "helmet",
        "chest",
        "neck",
        "gloves",
        "belt",
        "boots",
        "leftRing",
        "rightRing",
        "mainHand",
        "offHand",
      ];
      for (const slot of slots) {
        if (newEquipmentPage[slot]?.id === itemId) {
          delete newEquipmentPage[slot];
        }
      }
      return {
        saveData: {
          ...state.saveData,
          itemsList: newItemsList,
          equipmentPage: newEquipmentPage,
        },
        hasUnsavedChanges: true,
      };
    });
  },

  selectItemForSlot: (slot, itemId) => {
    internalStore.setState((state) => {
      if (!itemId) {
        const newEquipmentPage = { ...state.saveData.equipmentPage };
        delete newEquipmentPage[slot];
        return {
          saveData: { ...state.saveData, equipmentPage: newEquipmentPage },
          hasUnsavedChanges: true,
        };
      }
      const item = state.saveData.itemsList.find((i) => i.id === itemId);
      if (!item) return state;
      return {
        saveData: {
          ...state.saveData,
          equipmentPage: { ...state.saveData.equipmentPage, [slot]: item },
        },
        hasUnsavedChanges: true,
      };
    });
  },

  isItemEquipped: (itemId) => {
    const { saveData } = internalStore.getState();
    const slots: GearSlot[] = [
      "helmet",
      "chest",
      "neck",
      "gloves",
      "belt",
      "boots",
      "leftRing",
      "rightRing",
      "mainHand",
      "offHand",
    ];
    return slots.some((slot) => saveData.equipmentPage[slot]?.id === itemId);
  },

  // Talent actions
  setTreeName: (slot, treeName) => {
    internalStore.setState((state) => ({
      saveData: {
        ...state.saveData,
        talentPage: {
          ...state.saveData.talentPage,
          [slot]: {
            name: treeName,
            allocatedNodes: [],
            selectedCoreTalents: [],
          },
        },
      },
      hasUnsavedChanges: true,
    }));
  },

  clearTree: (slot) => {
    internalStore.setState((state) => {
      const newTalentPage = { ...state.saveData.talentPage };
      delete newTalentPage[slot];
      return {
        saveData: { ...state.saveData, talentPage: newTalentPage },
        hasUnsavedChanges: true,
      };
    });
  },

  setAllocatedNodes: (slot, nodes) => {
    internalStore.setState((state) => {
      const tree = state.saveData.talentPage[slot];
      if (!tree) return state;
      return {
        saveData: {
          ...state.saveData,
          talentPage: {
            ...state.saveData.talentPage,
            [slot]: { ...tree, allocatedNodes: nodes },
          },
        },
        hasUnsavedChanges: true,
      };
    });
  },

  setCoreTalents: (slot, talents) => {
    internalStore.setState((state) => {
      const tree = state.saveData.talentPage[slot];
      if (!tree) return state;
      return {
        saveData: {
          ...state.saveData,
          talentPage: {
            ...state.saveData.talentPage,
            [slot]: { ...tree, selectedCoreTalents: talents },
          },
        },
        hasUnsavedChanges: true,
      };
    });
  },

  addPrismToInventory: (prism) => {
    internalStore.setState((state) => ({
      saveData: {
        ...state.saveData,
        prismList: [...state.saveData.prismList, prism],
      },
      hasUnsavedChanges: true,
    }));
  },

  deletePrism: (prismId) => {
    internalStore.setState((state) => {
      const newPrismList = state.saveData.prismList.filter(
        (p) => p.id !== prismId,
      );
      const placedPrism = state.saveData.talentPage.placedPrism;
      const newTalentPage = { ...state.saveData.talentPage };
      if (placedPrism?.prism.id === prismId) {
        delete newTalentPage.placedPrism;
      }
      return {
        saveData: {
          ...state.saveData,
          prismList: newPrismList,
          talentPage: newTalentPage,
        },
        hasUnsavedChanges: true,
      };
    });
  },

  placePrism: (prism, treeSlot, position) => {
    internalStore.setState((state) => ({
      saveData: {
        ...state.saveData,
        talentPage: {
          ...state.saveData.talentPage,
          placedPrism: { prism, treeSlot, position },
        },
      },
      hasUnsavedChanges: true,
    }));
  },

  removePlacedPrism: () => {
    internalStore.setState((state) => {
      const newTalentPage = { ...state.saveData.talentPage };
      delete newTalentPage.placedPrism;
      return {
        saveData: { ...state.saveData, talentPage: newTalentPage },
        hasUnsavedChanges: true,
      };
    });
  },

  addInverseImageToInventory: (inverseImage) => {
    internalStore.setState((state) => ({
      saveData: {
        ...state.saveData,
        inverseImageList: [...state.saveData.inverseImageList, inverseImage],
      },
      hasUnsavedChanges: true,
    }));
  },

  deleteInverseImage: (inverseImageId) => {
    internalStore.setState((state) => {
      const newInverseImageList = state.saveData.inverseImageList.filter(
        (ii) => ii.id !== inverseImageId,
      );
      const placedInverseImage = state.saveData.talentPage.placedInverseImage;
      const newTalentPage = { ...state.saveData.talentPage };
      if (placedInverseImage?.inverseImage.id === inverseImageId) {
        delete newTalentPage.placedInverseImage;
      }
      return {
        saveData: {
          ...state.saveData,
          inverseImageList: newInverseImageList,
          talentPage: newTalentPage,
        },
        hasUnsavedChanges: true,
      };
    });
  },

  placeInverseImage: (inverseImage, treeSlot, position) => {
    internalStore.setState((state) => ({
      saveData: {
        ...state.saveData,
        inverseImageList: state.saveData.inverseImageList.filter(
          (ii) => ii.id !== inverseImage.id,
        ),
        talentPage: {
          ...state.saveData.talentPage,
          placedInverseImage: {
            inverseImage,
            treeSlot,
            position,
            reflectedAllocatedNodes: [],
          },
        },
      },
      hasUnsavedChanges: true,
    }));
  },

  removePlacedInverseImage: () => {
    internalStore.setState((state) => {
      const placedInverseImage = state.saveData.talentPage.placedInverseImage;
      if (!placedInverseImage) return state;

      const newTalentPage = { ...state.saveData.talentPage };
      delete newTalentPage.placedInverseImage;

      return {
        saveData: {
          ...state.saveData,
          inverseImageList: [
            ...state.saveData.inverseImageList,
            placedInverseImage.inverseImage,
          ],
          talentPage: newTalentPage,
        },
        hasUnsavedChanges: true,
      };
    });
  },

  allocateReflectedNode: (x, y, sourceX, sourceY) => {
    internalStore.setState((state) => {
      const placedInverseImage = state.saveData.talentPage.placedInverseImage;
      if (!placedInverseImage) return state;

      const existingIdx = placedInverseImage.reflectedAllocatedNodes.findIndex(
        (n) => n.x === x && n.y === y,
      );

      let updatedNodes: ReflectedAllocatedNode[];
      if (existingIdx >= 0) {
        updatedNodes = placedInverseImage.reflectedAllocatedNodes.map(
          (n, idx) =>
            idx === existingIdx ? { ...n, points: n.points + 1 } : n,
        );
      } else {
        updatedNodes = [
          ...placedInverseImage.reflectedAllocatedNodes,
          { x, y, sourceX, sourceY, points: 1 },
        ];
      }

      return {
        saveData: {
          ...state.saveData,
          talentPage: {
            ...state.saveData.talentPage,
            placedInverseImage: {
              ...placedInverseImage,
              reflectedAllocatedNodes: updatedNodes,
            },
          },
        },
        hasUnsavedChanges: true,
      };
    });
  },

  deallocateReflectedNode: (x, y) => {
    internalStore.setState((state) => {
      const placedInverseImage = state.saveData.talentPage.placedInverseImage;
      if (!placedInverseImage) return state;

      const existing = placedInverseImage.reflectedAllocatedNodes.find(
        (n) => n.x === x && n.y === y,
      );
      if (!existing) return state;

      let updatedNodes: ReflectedAllocatedNode[];
      if (existing.points > 1) {
        updatedNodes = placedInverseImage.reflectedAllocatedNodes.map((n) =>
          n.x === x && n.y === y ? { ...n, points: n.points - 1 } : n,
        );
      } else {
        updatedNodes = placedInverseImage.reflectedAllocatedNodes.filter(
          (n) => !(n.x === x && n.y === y),
        );
      }

      return {
        saveData: {
          ...state.saveData,
          talentPage: {
            ...state.saveData.talentPage,
            placedInverseImage: {
              ...placedInverseImage,
              reflectedAllocatedNodes: updatedNodes,
            },
          },
        },
        hasUnsavedChanges: true,
      };
    });
  },

  setReflectedAllocatedNodes: (nodes) => {
    internalStore.setState((state) => {
      const placedInverseImage = state.saveData.talentPage.placedInverseImage;
      if (!placedInverseImage) return state;

      return {
        saveData: {
          ...state.saveData,
          talentPage: {
            ...state.saveData.talentPage,
            placedInverseImage: {
              ...placedInverseImage,
              reflectedAllocatedNodes: nodes,
            },
          },
        },
        hasUnsavedChanges: true,
      };
    });
  },

  // Hero actions
  setHero: (hero) => {
    internalStore.setState((state) => ({
      saveData: {
        ...state.saveData,
        heroPage: { ...state.saveData.heroPage, selectedHero: hero },
      },
      hasUnsavedChanges: true,
    }));
  },

  setTrait: (level, trait) => {
    internalStore.setState((state) => ({
      saveData: {
        ...state.saveData,
        heroPage: {
          ...state.saveData.heroPage,
          traits: { ...state.saveData.heroPage.traits, [level]: trait },
        },
      },
      hasUnsavedChanges: true,
    }));
  },

  addHeroMemory: (memory) => {
    internalStore.setState((state) => ({
      saveData: {
        ...state.saveData,
        heroMemoryList: [...state.saveData.heroMemoryList, memory],
      },
      hasUnsavedChanges: true,
    }));
  },

  deleteHeroMemory: (memoryId) => {
    internalStore.setState((state) => {
      const newMemoryList = state.saveData.heroMemoryList.filter(
        (m) => m.id !== memoryId,
      );
      const newMemorySlots = { ...state.saveData.heroPage.memorySlots };
      (["slot45", "slot60", "slot75"] as HeroMemorySlot[]).forEach((slot) => {
        if (newMemorySlots[slot]?.id === memoryId) {
          newMemorySlots[slot] = undefined;
        }
      });
      return {
        saveData: {
          ...state.saveData,
          heroMemoryList: newMemoryList,
          heroPage: {
            ...state.saveData.heroPage,
            memorySlots: newMemorySlots,
          },
        },
        hasUnsavedChanges: true,
      };
    });
  },

  equipHeroMemory: (slot, memory) => {
    internalStore.setState((state) => ({
      saveData: {
        ...state.saveData,
        heroPage: {
          ...state.saveData.heroPage,
          memorySlots: {
            ...state.saveData.heroPage.memorySlots,
            [slot]: memory,
          },
        },
      },
      hasUnsavedChanges: true,
    }));
  },

  copyHeroMemory: (memoryId) => {
    const memory = internalStore
      .getState()
      .saveData.heroMemoryList.find((m) => m.id === memoryId);
    if (!memory) return;
    const newMemory = { ...memory, id: generateItemId() };
    internalStore.setState((state) => ({
      saveData: {
        ...state.saveData,
        heroMemoryList: [...state.saveData.heroMemoryList, newMemory],
      },
      hasUnsavedChanges: true,
    }));
  },

  // Pactspirit actions
  setPactspirit: (slotIndex, name) => {
    internalStore.setState((state) => {
      const slotKey =
        `slot${slotIndex}` as keyof typeof state.saveData.pactspiritPage;
      return {
        saveData: {
          ...state.saveData,
          pactspiritPage: {
            ...state.saveData.pactspiritPage,
            [slotKey]: {
              ...state.saveData.pactspiritPage[slotKey],
              pactspiritName: name,
            },
          },
        },
        hasUnsavedChanges: true,
      };
    });
  },

  setPactspiritLevel: (slotIndex, level) => {
    internalStore.setState((state) => {
      const slotKey =
        `slot${slotIndex}` as keyof typeof state.saveData.pactspiritPage;
      return {
        saveData: {
          ...state.saveData,
          pactspiritPage: {
            ...state.saveData.pactspiritPage,
            [slotKey]: {
              ...state.saveData.pactspiritPage[slotKey],
              level,
            },
          },
        },
        hasUnsavedChanges: true,
      };
    });
  },

  setRingDestiny: (slotIndex, ringSlot, destiny) => {
    internalStore.setState((state) => {
      const slotKey =
        `slot${slotIndex}` as keyof typeof state.saveData.pactspiritPage;
      const slot = state.saveData.pactspiritPage[slotKey];
      return {
        saveData: {
          ...state.saveData,
          pactspiritPage: {
            ...state.saveData.pactspiritPage,
            [slotKey]: {
              ...slot,
              rings: {
                ...slot.rings,
                [ringSlot]: { installedDestiny: destiny },
              },
            },
          },
        },
        hasUnsavedChanges: true,
      };
    });
  },

  updatePactspiritSlot: (slotIndex, slot) => {
    internalStore.setState((state) => {
      const slotKey =
        `slot${slotIndex}` as keyof typeof state.saveData.pactspiritPage;
      return {
        saveData: {
          ...state.saveData,
          pactspiritPage: {
            ...state.saveData.pactspiritPage,
            [slotKey]: slot,
          },
        },
        hasUnsavedChanges: true,
      };
    });
  },

  // Divinity actions
  addSlateToInventory: (slate) => {
    internalStore.setState((state) => ({
      saveData: {
        ...state.saveData,
        divinitySlateList: [...state.saveData.divinitySlateList, slate],
      },
      hasUnsavedChanges: true,
    }));
  },

  deleteSlate: (slateId) => {
    internalStore.setState((state) => {
      const newSlateList = state.saveData.divinitySlateList.filter(
        (s) => s.id !== slateId,
      );
      const newPlacedSlates = state.saveData.divinityPage.placedSlates.filter(
        (p) => p.slateId !== slateId,
      );
      return {
        saveData: {
          ...state.saveData,
          divinitySlateList: newSlateList,
          divinityPage: {
            ...state.saveData.divinityPage,
            placedSlates: newPlacedSlates,
          },
        },
        hasUnsavedChanges: true,
      };
    });
  },

  placeSlate: (slateId, position) => {
    internalStore.setState((state) => {
      const existingIndex = state.saveData.divinityPage.placedSlates.findIndex(
        (p) => p.slateId === slateId,
      );
      let newPlacedSlates: PlacedSlate[];
      if (existingIndex >= 0) {
        newPlacedSlates = state.saveData.divinityPage.placedSlates.map(
          (p, i) => (i === existingIndex ? { slateId, position } : p),
        );
      } else {
        newPlacedSlates = [
          ...state.saveData.divinityPage.placedSlates,
          { slateId, position },
        ];
      }
      return {
        saveData: {
          ...state.saveData,
          divinityPage: {
            ...state.saveData.divinityPage,
            placedSlates: newPlacedSlates,
          },
        },
        hasUnsavedChanges: true,
      };
    });
  },

  removeSlate: (slateId) => {
    internalStore.setState((state) => ({
      saveData: {
        ...state.saveData,
        divinityPage: {
          ...state.saveData.divinityPage,
          placedSlates: state.saveData.divinityPage.placedSlates.filter(
            (p) => p.slateId !== slateId,
          ),
        },
      },
      hasUnsavedChanges: true,
    }));
  },

  updateSlate: (slateId, updates) => {
    internalStore.setState((state) => ({
      saveData: {
        ...state.saveData,
        divinitySlateList: state.saveData.divinitySlateList.map((s) =>
          s.id === slateId ? { ...s, ...updates } : s,
        ),
      },
      hasUnsavedChanges: true,
    }));
  },

  // Skills actions
  setActiveSkill: (slot, skillName) => {
    internalStore.setState((state) => {
      const skillKey =
        `activeSkill${slot}` as keyof typeof state.saveData.skillPage;
      return {
        saveData: {
          ...state.saveData,
          skillPage: {
            ...state.saveData.skillPage,
            [skillKey]: {
              ...state.saveData.skillPage[skillKey],
              skillName,
            },
          },
        },
        hasUnsavedChanges: true,
      };
    });
  },

  setPassiveSkill: (slot, skillName) => {
    internalStore.setState((state) => {
      const skillKey =
        `passiveSkill${slot}` as keyof typeof state.saveData.skillPage;
      return {
        saveData: {
          ...state.saveData,
          skillPage: {
            ...state.saveData.skillPage,
            [skillKey]: {
              ...state.saveData.skillPage[skillKey],
              skillName,
            },
          },
        },
        hasUnsavedChanges: true,
      };
    });
  },

  setSupportSkill: (skillType, skillSlot, supportSlot, supportName) => {
    internalStore.setState((state) => {
      const skillKey =
        `${skillType}Skill${skillSlot}` as keyof typeof state.saveData.skillPage;
      const supportKey = `supportSkill${supportSlot}` as keyof SupportSkills;
      const skill = state.saveData.skillPage[skillKey];
      if (!skill) return state;
      return {
        saveData: {
          ...state.saveData,
          skillPage: {
            ...state.saveData.skillPage,
            [skillKey]: {
              ...skill,
              supportSkills: {
                ...skill.supportSkills,
                [supportKey]: supportName,
              },
            },
          },
        },
        hasUnsavedChanges: true,
      };
    });
  },

  toggleSkillEnabled: (skillType, slot) => {
    internalStore.setState((state) => {
      const skillKey =
        `${skillType}Skill${slot}` as keyof typeof state.saveData.skillPage;
      const skill = state.saveData.skillPage[skillKey];
      if (!skill) return state;
      return {
        saveData: {
          ...state.saveData,
          skillPage: {
            ...state.saveData.skillPage,
            [skillKey]: { ...skill, enabled: !skill.enabled },
          },
        },
        hasUnsavedChanges: true,
      };
    });
  },
});

// Create actions singleton
export const actions = createActions();
