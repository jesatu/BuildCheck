import type { CharacterSkill, Requirement } from './types'

// Reference doc section 4. Costs are the total cost at each level (CS-3).

export const MAGIC_CS = ['spellcasting', 'incantation', 'healing', 'corruption'] as const
export const ARMOUR_CS = ['light-armour', 'medium-armour', 'heavy-armour'] as const

/** CS where a higher rung replaces the lower ones: a character holds at most one skill from each (CS-8 ruling). */
export const CS_LADDERS = [
  { name: 'Armour Use', skills: ['light-armour', 'medium-armour', 'heavy-armour'] },
  { name: 'Triage', skills: ['triage', 'triage-advanced'] },
] as const

export const anyMagicCs: Requirement = { any: MAGIC_CS.map((cs) => ({ cs })) }
export const anyArmourCs: Requirement = { any: ARMOUR_CS.map((cs) => ({ cs })) }

export const characterSkills: CharacterSkill[] = [
  // Weapon
  {
    id: 'ambidexterity', name: 'Ambidexterity', group: 'weapon', levelCosts: [2],
    summary: 'Use weapons or cast with the off-hand (needs the base skill for that use).',
    source: 'HB p.53',
  },
  {
    id: 'large-weapon', name: 'Large Weapon Use', group: 'weapon', levelCosts: [2],
    summary: 'Two-handed weapons 43"–72", pole-arms 43"–84".',
    source: 'HB p.53',
  },
  {
    id: 'projectile-weapon', name: 'Projectile Weapon Use', group: 'weapon', levelCosts: [4],
    requires: { flag: 'bowCompetency' },
    summary: 'Bow, crossbow or sling. Arrows and bolts deal Normal Through.',
    source: 'HB p.53',
  },
  {
    id: 'shield', name: 'Shield Use', group: 'weapon', levelCosts: [2],
    summary: 'One shield in the off-hand (either hand with Ambidexterity).',
    source: 'HB p.53',
  },
  {
    id: 'missile-weapon', name: 'Missile Weapon Use', group: 'weapon', levelCosts: [1],
    summary: 'Throw one missile with the primary hand.',
    source: 'HB p.53',
  },

  // Armour
  {
    id: 'light-armour', name: 'Light Armour Use', group: 'armour', levelCosts: [2],
    summary: 'Wear and repair Light armour (base AV 1).',
    source: 'HB p.54',
  },
  {
    id: 'medium-armour', name: 'Medium Armour Use', group: 'armour', levelCosts: [3],
    summary: 'Wear and repair Light and Medium armour (base AV 2). No Ranged casting in Medium armour.',
    source: 'HB p.54',
  },
  {
    id: 'heavy-armour', name: 'Heavy Armour Use', group: 'armour', levelCosts: [4],
    summary: 'Wear and repair any armour (base AV 3). No Ranged or Mass casting in Heavy armour.',
    source: 'HB p.54',
  },
  {
    id: 'body-development', name: 'Body Development', group: 'armour', levelCosts: [4, 8],
    summary: 'Level 1: base LHV 2. Level 2: base LHV 3.',
    source: 'HB p.54',
  },

  // Knowledge
  {
    id: 'potion-lore', name: 'Potion Lore', group: 'knowledge', levelCosts: [3],
    summary: 'Recognise potions; Discern Potion; Master Purge; set vapour potions. Loresheet.',
    source: 'HB p.56',
  },
  {
    id: 'poison-lore', name: 'Poison Lore', group: 'knowledge', levelCosts: [3],
    summary: 'Recognise poisons; Discern Poison; use venoms and weapon oils; set vapours. Loresheet.',
    source: 'HB p.56',
  },
  {
    id: 'cartography', name: 'Cartography', group: 'knowledge', levelCosts: [1],
    summary: 'Draw and navigate from maps; collect an in-character regional map.',
    source: 'HB p.56',
  },
  {
    id: 'sense-magic', name: 'Sense Magic', group: 'knowledge', levelCosts: [1],
    summary: 'Sense magic in an item. Loresheet.',
    source: 'HB p.56',
  },
  {
    id: 'evaluate', name: 'Evaluate', group: 'knowledge', levelCosts: [1],
    summary: 'Estimate an item\'s value. Loresheet.',
    source: 'HB p.56',
  },
  {
    id: 'recognise-forgery', name: 'Recognise Forgery', group: 'knowledge', levelCosts: [1],
    summary: 'Tell whether an item is genuine. Loresheet.',
    source: 'HB p.56',
  },
  {
    id: 'triage', name: 'Triage', group: 'knowledge', levelCosts: [1],
    summary: 'Remove a mortal wound on a limb (living patterns).',
    source: 'HB p.56',
  },
  {
    id: 'triage-advanced', name: 'Triage (Advanced)', group: 'knowledge', levelCosts: [2],
    summary: 'Remove a mortal wound on any location; raise all locations to 1 LHV; identify effects.',
    source: 'HB p.56',
  },

  // Power
  {
    id: 'healing', name: 'Healing', group: 'power', levelCosts: [4, 8],
    summary: 'Level 1: L1 Healing spells, +4 base Spell Power. Level 2: L1–2, +12.',
    source: 'HB p.55',
  },
  {
    id: 'corruption', name: 'Corruption', group: 'power', levelCosts: [4, 8],
    summary: 'Level 1: L1 Corruption spells, +4 base Spell Power. Level 2: L1–2, +12.',
    source: 'HB p.55',
  },
  {
    id: 'incantation', name: 'Incantation', group: 'power', levelCosts: [4, 8],
    summary: 'Level 1: L1 Incantation spells, +4 base Spell Power. Level 2: L1–2, +12.',
    source: 'HB p.55',
  },
  {
    id: 'spellcasting', name: 'Spellcasting', group: 'power', levelCosts: [4, 8],
    summary: 'Level 1: L1 Spellcasting spells, +4 base Spell Power. Level 2: L1–2, +12.',
    source: 'HB p.55',
  },
  {
    id: 'ritual-magic', name: 'Ritual Magic', group: 'power', levelCosts: [2, 4, 6],
    // CS-7 / A3: "some form of casting ability". Enforced through rules config.
    requires: anyMagicCs,
    summary: 'L1: contribute and Transportation. L2: lead 1 ritual per event. L3: 1 per day, Network Attunement.',
    source: 'HB p.55',
  },
  {
    id: 'contribute', name: 'Contribute', group: 'power', levelCosts: [1],
    summary: 'Contribute 1 ritual power to one ritual per day.',
    source: 'HB p.55',
  },
  {
    id: 'base-power', name: '+Base Power', group: 'power', levelCosts: [2, 4, 6, 8],
    summary: '+4 base Spell Power per level. Does not need a magic skill.',
    source: 'HB p.55',
  },
  {
    id: 'invocation', name: 'Invocation', group: 'power', levelCosts: [2],
    summary: 'Activate invocable items, glyphs and scrolls. Not restricted by armour.',
    source: 'HB p.55',
  },
]
