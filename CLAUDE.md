# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Next.js 16 + React 19 + TypeScript character build planner for Torchlight Infinite.

## Commands

```bash
pnpm dev          # Development server (http://localhost:3000)
pnpm build        # Production build
pnpm test         # Run all tests
pnpm test <file>  # Run single test file
pnpm typecheck    # TypeScript type checking
pnpm check        # Biome linting and formatting
```

## Architecture

- **UI Components** ([src/app/components/](src/app/components/)) - React components organized by feature (equipment, talents, skills, hero, pactspirit)
- **UI Lib** ([src/app/lib/](src/app/lib/)) - Shared types, constants, storage utilities, build-code encoding
- **Game Engine** ([src/tli/](src/tli/)) - Pure TypeScript, no React
  - [calcs/offense.ts](src/tli/calcs/offense.ts) - DPS/stat calculations
  - [mod_parser.ts](src/tli/mod_parser.ts) - String → typed Mod conversion
  - [core.ts](src/tli/core.ts), [mod.ts](src/tli/mod.ts) - Type definitions
  - [storage/load-save.ts](src/tli/storage/load-save.ts) - SaveData parsing
  - [skills/](src/tli/skills/) - Skill templates
- **Scripts** ([src/scripts/](src/scripts/)) - Build-time scripts for scraping and code generation
- **Generated Data** ([src/data/](src/data/)) - TypeScript data generated from scripts

## Key Conventions

**Code Style:**

- Use `const` arrow functions, not `function` declarations
- Derive types from const arrays: `const X = [...] as const; type T = (typeof X)[number]`
- No backwards compatibility for localStorage schemas

**Data Flow:**

```
RawLoadout (UI, strings) → parseMod() → Loadout (typed Mods) → calculateOffense() → Results
```

## Common Tasks

**Add mod type:** Define in [mod.ts](src/tli/mod.ts) → parser in [mod_parser.ts](src/tli/mod_parser.ts) → handler in [calcs/offense.ts](src/tli/calcs/offense.ts) → test

**Add skill:** Add to [calcs/skill_confs.ts](src/tli/calcs/skill_confs.ts)

**Update talent trees:** `pnpm exec tsx src/scripts/generate_talent_tree_data.ts`

**Regenerate gear affixes:** `pnpm exec tsx src/scripts/generate_gear_affix_data.ts`

**Regenerate skills:** `pnpm exec tsx src/scripts/generate_skill_data.ts`

## Code Generation Pattern

For large datasets (5k+ entries), use build-time code generation:

1. Script in `src/scripts/` reads JSON data
2. Groups/transforms data into TypeScript const arrays
3. Generates files with `satisfies readonly T[]` for type safety
4. Exports discriminated union from const array types
5. See [generate_gear_affix_data.ts](src/scripts/generate_gear_affix_data.ts) for reference

## Before Development Work

**Always read [docs/claude/development.md](docs/claude/development.md) before planning or making code changes.** It contains current project structure, patterns, and conventions.

For UI work, also read [docs/claude/ui-development.md](docs/claude/ui-development.md).

## Code Guidelines

- Prefer `undefined` over `null` for TypeScript code
- Only add comments that explain complex logic or non-obvious decisions
- Run `pnpm test`, `pnpm typecheck`, and `pnpm check` after making changes
- When using git, assume there is no remote—work locally only
