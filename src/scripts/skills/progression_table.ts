import type { CheerioAPI } from "cheerio";
import { template } from "./template-compiler";
import type { ProgressionColumn, SupportParserInput } from "./types";

const EXPECTED_LEVELS = 40;

export const extractProgressionTable = (
  $: CheerioAPI,
): SupportParserInput["progressionTable"] | undefined => {
  const card = $("div.card-header:contains('Progression /40')").closest(
    "div.card",
  );
  if (card.length === 0) {
    return undefined;
  }

  const table = card.find("table");
  if (table.length === 0) {
    return undefined;
  }

  const headerRow = table.find("thead tr").first();
  const headerCells = headerRow.find("th");

  const headers: string[] = [];
  headerCells.slice(1).each((_, cell) => {
    headers.push($(cell).text().trim());
  });

  // Build column-centric structure: each column has all its level values
  const columns: ProgressionColumn[] = headers.map((header) => ({
    header,
    rows: {},
  }));

  table.find("tbody tr").each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length < 2) return;

    const level = Number.parseInt($(cells[0]).text().trim(), 10);
    if (Number.isNaN(level)) return;

    cells.slice(1).each((i, cell) => {
      if (columns[i] !== undefined) {
        columns[i].rows[level] = $(cell).text().trim();
      }
    });
  });

  return columns;
};

export const validateAllLevels = (
  levels: Record<number, unknown>,
  skillName: string,
): void => {
  const levelNumbers = Object.keys(levels)
    .map(Number)
    .sort((a, b) => a - b);

  if (levelNumbers.length !== EXPECTED_LEVELS) {
    throw new Error(
      `Parser for "${skillName}" extracted ${levelNumbers.length} levels, expected ${EXPECTED_LEVELS}`,
    );
  }

  for (let i = 1; i <= EXPECTED_LEVELS; i++) {
    if (!levelNumbers.includes(i)) {
      throw new Error(`Parser for "${skillName}" missing level ${i}`);
    }
  }
};

export const parseNumericValue = (value: string): number => {
  const cleaned = value.replace(/^\+/, "").trim();

  // Handle fraction notation (e.g., "31/2" = 15.5)
  const fractionMatch = cleaned.match(/^(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
  let num: number;

  if (fractionMatch) {
    const numerator = Number.parseFloat(fractionMatch[1]);
    const denominator = Number.parseFloat(fractionMatch[2]);
    num = numerator / denominator;
  } else {
    num = Number.parseFloat(cleaned);
  }

  if (Number.isNaN(num)) {
    throw new Error(`Failed to parse numeric value: "${value}"`);
  }

  // Round to 4 decimal places to avoid floating point artifacts
  return Math.round(num * 10000) / 10000;
};

export const findColumn = (
  columns: ProgressionColumn[],
  headerTemplate: string,
  skillName: string,
): ProgressionColumn => {
  const t = template(headerTemplate);
  const col = columns.find((c) => t.tryMatch(c.header) !== undefined);
  if (col === undefined) {
    throw new Error(`${skillName}: no column matches "${headerTemplate}"`);
  }
  return col;
};

export const getDescriptionPart = (
  skillName: string,
  description: string[],
  index: number,
): string => {
  const descriptionPart = description[index];
  if (descriptionPart === undefined) {
    throw new Error(`${skillName}: no description found`);
  }
  return descriptionPart;
};

// ============================================
// Magnificent Support Progression Table
// ============================================

const EXPECTED_TIERS = 3;

/**
 * Extract the 3-tier progression table for magnificent support skills.
 * Looks for "Progression /3" header instead of "Progression /40".
 */
export const extractMagnificentProgressionTable = (
  $: CheerioAPI,
): ProgressionColumn[] | undefined => {
  const card = $("div.card-header:contains('Progression /3')").closest(
    "div.card",
  );
  if (card.length === 0) {
    return undefined;
  }

  const table = card.find("table");
  if (table.length === 0) {
    return undefined;
  }

  const headerRow = table.find("thead tr").first();
  const headerCells = headerRow.find("th");

  const headers: string[] = [];
  headerCells.slice(1).each((_, cell) => {
    headers.push($(cell).text().trim());
  });

  // Build column-centric structure: each column has all its tier values
  const columns: ProgressionColumn[] = headers.map((header) => ({
    header,
    rows: {},
  }));

  table.find("tbody tr").each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length < 2) return;

    const tier = Number.parseInt($(cells[0]).text().trim(), 10);
    if (Number.isNaN(tier)) return;

    cells.slice(1).each((i, cell) => {
      if (columns[i] !== undefined) {
        columns[i].rows[tier] = $(cell).text().trim();
      }
    });
  });

  return columns;
};

/**
 * Validate that all 3 tiers (0, 1, 2) are present in parsed data.
 */
export const validateAllTiers = (
  tiers: Record<number, unknown>,
  skillName: string,
): void => {
  const tierNumbers = Object.keys(tiers)
    .map(Number)
    .sort((a, b) => a - b);

  if (tierNumbers.length !== EXPECTED_TIERS) {
    throw new Error(
      `Parser for "${skillName}" extracted ${tierNumbers.length} tiers, expected ${EXPECTED_TIERS}`,
    );
  }

  for (const tier of [0, 1, 2]) {
    if (!tierNumbers.includes(tier)) {
      throw new Error(`Parser for "${skillName}" missing tier ${tier}`);
    }
  }
};

/**
 * Parse a tier range from text like "+(19–23)%" or "+(16–18)%".
 * Returns { min, max } object.
 */
export const parseTierRange = (
  text: string,
  skillName: string,
): { min: number; max: number } => {
  // Match patterns like "+(19–23)%" or "(130–150)%" or "+(12-14)%"
  // Handle both en-dash (–) and regular hyphen (-)
  const rangeMatch = text.match(/\+?\(?(\d+(?:\.\d+)?)[–-](\d+(?:\.\d+)?)\)?/);
  if (rangeMatch === null) {
    throw new Error(
      `${skillName}: Failed to parse tier range from text: "${text}"`,
    );
  }
  return {
    min: Number.parseFloat(rangeMatch[1]),
    max: Number.parseFloat(rangeMatch[2]),
  };
};
