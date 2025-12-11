# Skill Analysis: Determine InferredSkillKind

Analyze the given skill and determine which InferredSkillKind values apply to it.

## InferredSkillKind Definitions

### `deal_damage`
The skill deals damage of any kind (hit damage, DoT, secondary damage, etc.). This is the broadest damage category.

**Indicators:**
- "Deals X Damage" or "dealing X Damage"
- "X% Weapon Attack Damage" or "X% Base Damage"
- "Secondary X Damage" (e.g., "Secondary Fire Damage", "Secondary Physical Damage")
- Any numerical damage values followed by "Damage" in the description
- Counterattack damage, reflected damage, or any triggered damage

**Does NOT apply to:**
- Skills that only buff/debuff without dealing damage themselves
- Skills that only summon minions (the minions deal damage, not the skill)

### `dot`
The skill deals Damage Over Time (DoT). This is ongoing damage that ticks over a duration.

**Indicators:**
- "Persistent X Damage" (e.g., "Persistent Fire Damage", "Persistent Erosion Damage")
- "Damage Over Time"
- "deals X damage every second"
- "deals X damage per second"
- DoT-specific status effects when the skill directly applies the DoT (not just chance to apply)

**Does NOT apply to:**
- Skills that only hit once (even if they leave a debuff)
- Skills that have a chance to inflict Ignite/Poison (those are ailments, not direct DoT)

### `hit_enemies`
The skill hits enemies directly (as opposed to DoT or indirect effects). A "hit" is an instant damage application.

**Indicators:**
- "on hit" language
- "Attack X Damage" (weapon attacks hit)
- "Spell X Damage" when dealing instant damage (not persistent/DoT)
- "Secondary X Damage" (secondary damage is always a hit)
- "deals X Damage" in context of projectiles, strikes, counterattacks, or other instant effects

**Does NOT apply to:**
- Pure DoT skills (no hit, just ongoing damage)
- Aura/buff skills that don't directly attack
- Summoning skills (minions hit, not the skill itself)

### `inflict_ailment`
The skill can inflict ailments. Ailments are specific status effects tied to damage types.

**Ailments in the game:**
- **Ignite** (Fire) - burning damage over time
- **Frostbite/Frostbitten** (Cold) - cold DoT and movement effects
- **Shock** (Lightning) - increased damage taken
- **Poison** (Physical/Erosion) - stacking damage over time
- **Wilt** (Erosion) - weakening effect

**Indicators:**
- "X% chance to Ignite/Frostbite/Shock/Poison/Wilt"
- "chance to be Frostbitten"
- "+X% Ignite Damage" or similar ailment damage bonuses (implies skill can ignite)
- "inflicts X Ailment"
- Explicit ailment application

**Does NOT apply to:**
- Skills that just deal elemental damage without ailment mechanics
- Skills that buff ailment damage but don't apply ailments themselves

### `summon_minions`
The skill summons Minions. "Minion" is the general category that includes all summoned entities.

**Indicators:**
- "summon Minion(s)"
- "Minion" + "summon" in description
- Creating entities that fight for the player (general case)

**Note:** If a skill summons Spirit Magus or Synthetic Troops specifically, it should ALSO match `summon_minions` since those are subtypes of minions.

### `summon_spirit_magus`
The skill summons Spirit Magus specifically.

**Indicators:**
- "Spirit Magus" or "Spirit Magi" mentioned with summoning context
- Tags include "Spirit Magus"
- Skills that buff/interact with Spirit Magus (if they also summon them)

### `summon_synthetic_troops`
The skill summons Synthetic Troops specifically.

**Indicators:**
- "Synthetic Troop" mentioned with summoning context
- Tags include "Synthetic Troop"
- Skills that interact with Synthetic Troops in summoning context

---

## Examples

**Example 1: Damage-dealing projectile skill**
- Name: "Power Strike"
- Tags: Attack, Physical, Projectile
- Description: "Fires a projectile dealing 150% Weapon Attack Damage"
- Output: `{"inferredSkillKinds": [{"kind": "deal_damage", "reason": "150% Weapon Attack Damage"}, {"kind": "hit_enemies", "reason": "Weapon Attack Damage is instant hit damage"}]}`

**Example 2: DoT skill**
- Name: "Burning Ground"
- Tags: Spell, Fire, Area, Persistent
- Description: "Creates ground that deals 50 Persistent Fire Damage per second for 5s"
- Output: `{"inferredSkillKinds": [{"kind": "deal_damage", "reason": "Deals Persistent Fire Damage"}, {"kind": "dot", "reason": "Persistent damage per second"}]}`

**Example 3: Pure buff skill (no damage)**
- Name: "Battle Stance"
- Tags: Spell, Empower
- Description: "Grants +30% Attack Speed for 10s"
- Output: `{"inferredSkillKinds": []}`

**Example 4: Sentry that deals damage**
- Name: "Turret"
- Tags: Attack, Sentry, Physical
- Description: "Places a Sentry that shoots arrows dealing 100% Weapon Attack Damage"
- Output: `{"inferredSkillKinds": [{"kind": "deal_damage", "reason": "Sentry deals 100% Weapon Attack Damage"}, {"kind": "hit_enemies", "reason": "Weapon Attack Damage is instant hits"}]}`

---

## Skill to Analyze

**Name:** {{SKILL_NAME}}

**Tags:** {{SKILL_TAGS}}

**Description:**
{{SKILL_DESCRIPTION}}

---

## Output Format

Respond with ONLY a JSON object (no markdown code blocks, no explanation) in this exact format:

```
{
  "inferredSkillKinds": [
    {"kind": "kind_name", "reason": "Brief explanation"},
    ...
  ]
}
```

If no InferredSkillKind applies, return: `{"inferredSkillKinds": []}`

Valid kind values: "deal_damage", "dot", "hit_enemies", "inflict_ailment", "spell_burst", "summon_minions", "summon_spirit_magus", "summon_synthetic_troops"
