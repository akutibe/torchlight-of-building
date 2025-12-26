import type { Mod } from "../mod";
import { multi } from "./template";
import { allParsers } from "./templates";

export { spec, t } from "./template";

const combinedParser = multi(allParsers);

/**
 * Parses an affix line string and returns extracted mods.
 *
 * Return value semantics:
 * - `undefined`: No parser matched the input (parse failure)
 * - `[]`: Successfully parsed, but no mods to extract (intentional no-op)
 * - `[...mods]`: Successfully parsed with one or more extracted mods
 */
export const parseMod = (input: string): Mod[] | undefined => {
  const normalized = input.trim().toLowerCase();
  return combinedParser.parse(normalized);
};
