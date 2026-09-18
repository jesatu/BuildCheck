import type { Spell, SpellList, SpellRange } from './types'

// Reference doc 7.5. Spells are written as "Name:Range" and parsed below to keep the lists readable.

function parse(entries: string[]): Spell[] {
  return entries.map((e) => {
    const [name, range] = e.split(':') as [string, SpellRange]
    return { name, range }
  })
}

function list(
  id: string, name: string, family: SpellList['family'], kind: SpellList['kind'],
  l1: string[], l2: string[], l3: string[], source: string,
): SpellList {
  return { id, name, family, kind, levels: [parse(l1), parse(l2), parse(l3)], source }
}

function union(id: string, name: string, family: SpellList['family'], lists: SpellList[], source: string, omit: string[] = []): SpellList {
  const levels = [0, 1, 2].map((i) => {
    const seen = new Map<string, Spell>()
    for (const l of lists) for (const sp of l.levels[i]!) if (!omit.includes(sp.name)) seen.set(sp.name, sp)
    return [...seen.values()]
  }) as SpellList['levels']
  return { id, name, family, kind: 'combined', levels, source }
}

const incantation = list('incantation', 'Incantation', 'incantation', 'base',
  ['Befriend:Rng', 'Confusion:Rng', 'Countermagic:Rng', 'Cure Wound:Prox', 'Detect Unliving:Mss', 'Dismiss:Rng', 'Fear:Rng', 'Retribution:Slf'],
  ['Ancestral Strike:Slf', 'Aura of Defence:Slf', 'Chant of Protection:Prox', 'Chant of Sanctuary:Prox', 'Halt:Rng', 'Iron Will:Prox', 'Lay to Rest:Rit', 'Speak with Dead:Prox'],
  ['Ethereal Weapon:Slf', 'High Countermagic:Rng', 'High Dismiss:Rng', 'Mass Fear:Mss', 'Paladins Armour:Prox', 'Protection from Paralysis:Prox', 'Shield from Corruption:Prox', 'Speak with Ancestor:Rit'],
  'HB p.32')

const lightIncantation = list('light-incantation', 'Light Incantation', 'incantation', 'specialisation',
  ['Befriend:Rng', 'Countermagic:Rng', 'Cure Wound:Prox', 'Remove Disease:Prox', 'Detect Unliving:Mss', 'Dismiss:Rng', 'Remove Fear:Prox', 'Retribution:Slf'],
  ['Aura of Defence:Slf', 'Chant of Protection:Prox', 'Chant of Sanctuary:Prox', 'Remove Decay:Prox', 'Full Cure:Prox', 'Iron Will:Prox', 'Lay to Rest:Rit', 'Speak with Dead:Prox'],
  ['Smite:Slf', 'High Countermagic:Rng', 'High Dismiss:Rng', 'Paladins Armour:Prox', 'Protection from Paralysis:Prox', 'Fortify Body:Prox', 'Shield from Corruption:Prox', 'Speak with Ancestor:Rit'],
  'HB p.32')

const darkIncantation = list('dark-incantation', 'Dark Incantation', 'incantation', 'specialisation',
  ['Befriend:Rng', 'Confusion:Rng', 'Control Unliving:Rng', 'Countermagic:Rng', 'Detect Unliving:Mss', 'Fear:Rng', 'Repair Unliving:Prox', 'Retribution:Slf'],
  ['Ancestral Strike:Slf', 'Aura of Defence:Slf', 'Chant of Protection:Prox', 'Wasting:Rit', 'Halt:Rng', 'Iron Will:Prox', 'Lay to Rest:Rit', 'Speak with Dead:Prox'],
  ['Harm:Slf', 'High Control Unliving:Rng', 'High Countermagic:Rng', 'Mass Fear:Mss', 'Paladins Armour:Prox', 'Protection from Paralysis:Prox', 'Shield from Corruption:Prox', 'Speak with Ancestor:Rit'],
  'HB p.32')

const spellcasting = list('spellcasting', 'Spellcasting', 'magecraft', 'base',
  ['Countermagic:Rng', 'Detect Magic:Mss', 'Purge Poison:Prox', 'Fumble:Rng', 'Mend:Prox', 'Repel:Rng', 'Strikedown:Rng', 'Trace Transport:Rit'],
  ['Blast:Rng', 'Chant of Melee Immunity:Prox', 'Cause Corrosion:Slf', 'Enthral:Rng', 'Iron Will:Prox', 'Mute:Rng', 'Sleep:Rng', 'Shatter:Rng'],
  ['Aura of Immunity:Slf', 'Chant of Forbidding:Mss', 'Freeze:Rng', 'High Countermagic:Rng', 'Mage Armour:Prox', 'Mage Bolt:Rng', 'Teleport:Rit', 'Weapon of Primal Magic:Slf'],
  'HB p.33')

const enchanting = list('enchanting', 'Enchanting', 'magecraft', 'specialisation',
  ['Countermagic:Rng', 'Detect Magic:Mss', 'Fumble:Rng', 'Mend:Prox', 'Mend Armour:Prox', 'Purge Poison:Prox', 'Strikedown:Rng', 'Trace Transport:Rit'],
  ['Blast:Rng', 'Chant of Melee Immunity:Prox', 'Purge All Poisons:Prox', 'Infuse Shield:Prox', 'Iron Will:Prox', 'Mute:Rng', 'Shatter:Rng', 'Sleep:Rng'],
  ['Endurance:Prox', 'Freeze:Rng', 'High Countermagic:Rng', 'Mage Armour:Prox', 'Mage Bolt:Rng', 'Fortify Body:Prox', 'Teleport:Rit', 'Weapon of Primal Magic:Slf'],
  'HB p.33')

const shadowMagic = list('shadow-magic', 'Shadow Magic', 'magecraft', 'specialisation',
  ['Control Unliving:Rng', 'Countermagic:Rng', 'Detect Unliving:Mss', 'Fumble:Rng', 'Mend:Prox', 'Fear:Rng', 'Strikedown:Rng', 'Trace Transport:Rit'],
  ['Blast:Rng', 'Chant of Melee Immunity:Prox', 'Wasting:Rit', 'Cause Corrosion:Slf', 'Bind Unliving:Rng', 'Mute:Rng', 'Sleep:Rng', 'Shatter:Rng'],
  ['Aura of Immunity:Slf', 'High Control Unliving:Rng', 'High Countermagic:Rng', 'Mage Armour:Prox', 'Mage Bolt:Rng', 'Mass Fear:Mss', 'Teleport:Rit', 'Weapon of Primal Magic:Slf'],
  'HB p.33')

const healing = list('healing', 'Healing', 'channelling', 'base',
  ['Heal Wound:Prox', 'Purge Poison:Prox', 'Remove Disease:Prox', 'Remove Fear:Prox', 'Remove Paralysis:Prox'],
  ['Aura of Defence:Slf', 'Carapace Armour:Prox', 'Heal Fatal Wound:Prox', 'Purge All Poisons:Prox', 'Remove Decay:Prox'],
  ['Endurance:Prox', 'Shield from Corruption:Prox', 'Cleanse Pattern:Mss', 'Total Heal:Prox', 'High Carapace Armour:Prox'],
  'HB p.34')

const corruption = list('corruption', 'Corruption', 'channelling', 'base',
  ['Enthral Unliving:Rng', 'Control Unliving:Rng', 'Detect Unliving:Mss', 'Fear:Rng', 'Repair Unliving:Prox'],
  ['Cause Disease:Slf', 'Cause Paralysis:Slf', 'Wasting:Rit', 'Bind Unliving:Rng', 'Carapace Armour:Prox'],
  ['Cause Fatal Wound:Slf', 'Embody Unliving:Slf', 'High Control Unliving:Rng', 'Mass Fear:Mss', 'Total Repair Unliving:Prox'],
  'HB p.34')

export const spellLists: SpellList[] = [
  incantation, lightIncantation, darkIncantation,
  union('cast-all-incantation', 'Cast All Incantation', 'incantation', [incantation, lightIncantation, darkIncantation], 'HB p.32'),
  spellcasting, enchanting, shadowMagic,
  // E6 ruling: the printed list's missing Control Unliving (L1) is an omission, so the list is the full union.
  union('cast-all-magecraft', 'Cast All Spellcasting', 'magecraft', [spellcasting, enchanting, shadowMagic], 'HB p.33'),
  healing, corruption,
  list('necromancy', 'Necromancy', 'summoning', 'summoning',
    ['Corrupt Body:Rit'], ['Full Repair Unliving:Prox', 'Strike for Flame:Slf'], ['Greater Corrupt Body:Rit', 'Speak with Unliving:Rit'], 'HB p.35'),
  list('daemonology', 'Daemonology', 'summoning', 'summoning',
    ['Control Daemon:Rng'], ['Full Cure Daemon:Prox', 'Strike for Water:Slf'], ['High Control Daemon:Rng', 'Speak with Daemon:Rit'], 'HB p.35'),
  list('theology', 'Theology', 'summoning', 'summoning',
    ['Control Ancestral:Rng'], ['Full Cure Ancestral:Prox', 'Strike for Air:Slf'], ['High Control Ancestral:Rng', 'Speak with Ancestor:Rit'], 'HB p.35'),
  list('elementalism', 'Elementalism', 'summoning', 'summoning',
    ['Control Elemental:Rng'], ['Full Cure Elemental:Prox', 'Strike for Earth:Slf'], ['High Control Elemental:Rng', 'Speak with Elemental:Rit'], 'HB p.35'),
  list('ritual-magic', 'Ritual Magic', 'ritual', 'ritual',
    ['Transportation:Rit'], [], ['Network Attunement:Rit'], 'HB p.35'),
]

/** Power Rating of each sigil while active (PR-1a). */
export const sigilPowerRatings: Record<string, number> = {
  'Carapace Armour': 0,
  'Iron Will': 0,
  'Embody Unliving': 1,
  'Endurance': 1,
  'High Carapace Armour': 1,
  'Mage Armour': 1,
  'Network Attunement': 1,
  'Paladins Armour': 1,
  'Protection from Paralysis': 1,
  'Weapon of Primal Magic': 1,
}
