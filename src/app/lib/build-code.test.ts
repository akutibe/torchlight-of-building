import { describe, expect, it } from "vitest";
import { encodeBuildCode, decodeBuildCode } from "./build-code";
import { RawLoadout } from "@/src/tli/core";
import { createEmptyLoadout } from "./storage";

describe("build-code", () => {
  it("should encode and decode an empty loadout", () => {
    const loadout = createEmptyLoadout();
    const code = encodeBuildCode(loadout);
    const decoded = decodeBuildCode(code);

    expect(decoded).toEqual(loadout);
  });

  it("should encode and decode a loadout with equipment", () => {
    const loadout: RawLoadout = {
      equipmentPage: {
        helmet: {
          id: "test-helmet-1",
          gearType: "helmet",
          affixes: ["+10% fire damage", "+5% attack speed"],
          equipmentType: "Helmet (STR)",
        },
        mainHand: {
          id: "test-sword-1",
          gearType: "sword",
          affixes: ["+100 physical damage"],
        },
      },
      talentPage: {},
      skillPage: {
        skills: [],
      },
      itemsList: [],
    };

    const code = encodeBuildCode(loadout);
    const decoded = decodeBuildCode(code);

    expect(decoded).toEqual(loadout);
  });

  it("should encode and decode a loadout with talents", () => {
    const loadout: RawLoadout = {
      equipmentPage: {},
      talentPage: {
        tree1: {
          name: "Goddess_of_Might",
          allocatedNodes: [
            { x: 0, y: 0, points: 3 },
            { x: 1, y: 0, points: 2 },
          ],
        },
        tree2: {
          name: "God_of_War",
          allocatedNodes: [{ x: 2, y: 1, points: 5 }],
        },
      },
      skillPage: {
        skills: [],
      },
      itemsList: [],
    };

    const code = encodeBuildCode(loadout);
    const decoded = decodeBuildCode(code);

    expect(decoded).toEqual(loadout);
  });

  it("should encode and decode a loadout with skills", () => {
    const loadout: RawLoadout = {
      equipmentPage: {},
      talentPage: {},
      skillPage: {
        skills: [
          { skill: "[Test] Simple Attack", enabled: true },
          { skill: "Berserking Blade", enabled: false },
        ],
      },
      itemsList: [],
    };

    const code = encodeBuildCode(loadout);
    const decoded = decodeBuildCode(code);

    expect(decoded).toEqual(loadout);
  });

  it("should encode and decode a full loadout", () => {
    const loadout: RawLoadout = {
      equipmentPage: {
        helmet: {
          id: "test-1",
          gearType: "helmet",
          affixes: ["+10% fire damage", "+5% attack speed"],
          equipmentType: "Helmet (STR)",
        },
        chest: {
          id: "test-2",
          gearType: "chest",
          affixes: ["+100 health"],
        },
      },
      talentPage: {
        tree1: {
          name: "Goddess_of_Might",
          allocatedNodes: [
            { x: 0, y: 0, points: 3 },
            { x: 1, y: 0, points: 2 },
          ],
        },
      },
      skillPage: {
        skills: [{ skill: "[Test] Simple Attack", enabled: true }],
      },
      itemsList: [
        {
          id: "inv-1",
          gearType: "ring",
          affixes: ["+10% crit"],
        },
      ],
    };

    const code = encodeBuildCode(loadout);
    const decoded = decodeBuildCode(code);

    expect(decoded).toEqual(loadout);
  });

  it("should return null for invalid build codes", () => {
    expect(decodeBuildCode("invalid")).toBeNull();
    expect(decodeBuildCode("")).toBeNull();
    expect(decodeBuildCode("abc123xyz")).toBeNull();
  });

  it("should return null for malformed JSON", () => {
    // This would decompress but not be valid JSON
    expect(decodeBuildCode("not-valid-lz-string")).toBeNull();
  });

  it("should produce URL-safe codes", () => {
    const loadout = createEmptyLoadout();
    const code = encodeBuildCode(loadout);

    // lz-string's compressToEncodedURIComponent produces URL-safe output
    // It should not contain characters that need URL encoding
    expect(encodeURIComponent(code)).toBe(code);
  });

  it("should produce reasonably sized codes", () => {
    const loadout = createEmptyLoadout();
    const code = encodeBuildCode(loadout);

    // Empty loadout should be fairly small
    expect(code.length).toBeLessThan(200);
  });
});
