import { compileTemplate } from "./compiler";
import type { ParseTemplate } from "./template-types";
import type { TemplateMatcher } from "./types";

/**
 * Create a template matcher from a template string.
 * Uses substring matching - the pattern can appear anywhere in the input.
 *
 * Template syntax:
 * - `{name:int}` - Unsigned integer (no sign): "5" → 5
 * - `{name:+int}` - Signed integer (requires +/-): "+5" → 5, "-3" → -3
 * - `{name:dec}` - Unsigned decimal: "21.5" → 21.5
 * - `{name:+dec}` - Signed decimal: "+21.5" → 21.5
 * - `{name:dec%}` - Unsigned decimal percent: "96%" → 96
 * - `{name:+dec%}` - Signed decimal percent: "+96%" → 96
 * - `[word]` - Optional literal word (captured as boolean)
 * - `(a|b)` - Alternation (non-capturing)
 *
 * @example
 * const matcher = template("{value:+int} shadow quantity");
 * const result = matcher.match("Adds +50 Shadow Quantity", "Haunt");
 * // result = { value: 50 }
 * // throws if no match: "Haunt: no match for '{value:+int} shadow quantity'"
 */
export const template = <T extends string>(
  templateStr: T,
): TemplateMatcher<ParseTemplate<T>> => {
  const compiled = compileTemplate(templateStr);

  const extractResult = (match: RegExpMatchArray): ParseTemplate<T> => {
    const result: Record<string, string | number | boolean> = {};

    for (let i = 0; i < compiled.captureNames.length; i++) {
      const name = compiled.captureNames[i];
      const value = match[i + 1];

      if (value !== undefined) {
        const extractor = compiled.extractors.get(name);
        if (extractor) {
          result[name] = extractor(value);
        } else {
          result[name] = value;
        }
      }
    }

    return result as ParseTemplate<T>;
  };

  return {
    match(input: string, skillName: string): ParseTemplate<T> {
      const match = input.match(compiled.regex);
      if (!match) {
        throw new Error(
          `${skillName}: no match for '${compiled.templateStr}' in '${input}'`,
        );
      }
      return extractResult(match);
    },

    tryMatch(input: string): ParseTemplate<T> | undefined {
      const match = input.match(compiled.regex);
      if (!match) {
        return undefined;
      }
      return extractResult(match);
    },
  };
};
