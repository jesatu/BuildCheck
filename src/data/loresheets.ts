import type { EssenceTier, Loresheet, LoresheetSkill, Requirement, Tier } from './types'

// Reference doc section 12. Tiers, costs and prerequisites are as printed on each loresheet (LS-3).
// A loresheet purchase skips the handbook learn prerequisite and uses `learn` below instead.

const os = (id: string, param?: string): Requirement => (param ? { os: id, param } : { os: id })
const cs = (id: string, level?: number): Requirement => (level ? { cs: id, level } : { cs: id })
const claw: Requirement = { flag: 'clawCompetency' }

function s(osId: string, tier: Tier, cost: number, extra: Partial<LoresheetSkill> = {}): LoresheetSkill {
  return { os: osId, tier, cost, ...extra }
}

const ALL = 1, MATURE = 2, ELDER = 3, ANCIENT = 4
const B = { availability: 'beastForm' as const }
const V = { availability: 'night' as const }

const essenceNote = 'Essence creature. Tier advances by essence rite plus the tier OSP cost (12.5).'

export const loresheets: Loresheet[] = [
  // ---- Planar creatures (race) ----
  {
    id: 'elemental', name: 'Elemental', kind: 'race', source: 'LS: Elemental',
    summary: 'Summoned elemental. Can be Dismissed and Controlled. Innate Control Elemental for own power.',
    restrictions: [{ kind: 'setsRace', race: 'elemental' }],
    skills: [
      s('shield-dismiss-level', 1, 10), s('elementalism', 1, 10), s('tns-runes', 1, 10, { param: 'Elemental', note: 'Elementals only; cannot be tutored.' }),
      s('dismiss-rank-5', 1, 10), s('discern-elemental-being', 1, 10),
      s('magical-armour-1', 2, 20), s('natural-armour-1', 2, 20), s('magical-armour-mastery', 2, 20),
      s('dismiss-rank-10', 3, 30, { learn: os('dismiss-rank-5') }),
      s('high-magic-elementalism', 4, 40, { learn: os('elementalism') }),
      s('voidportal', 4, 85, { note: 'Tier 4 here, Tier 5 in the handbook (L4).' }),
      s('base-lhv-1', 4, 65),
    ],
  },
  {
    id: 'daemon', name: 'Daemon', kind: 'race', source: 'LS: Daemon',
    summary: 'Summoned daemon. Can be Dismissed and Controlled. Innate Control Daemon for own power.',
    restrictions: [{ kind: 'setsRace', race: 'daemon' }],
    skills: [
      s('shield-dismiss-level', 1, 10), s('daemonology', 1, 10), s('tns-runes', 1, 10, { param: 'Daemon', note: 'Daemons only; cannot be tutored.' }),
      s('dismiss-rank-5', 1, 10), s('discern-daemonic-being', 1, 10),
      s('magical-armour-1', 2, 20), s('magical-armour-mastery', 2, 20),
      s('dismiss-rank-10', 3, 30, { learn: os('dismiss-rank-5') }),
      s('level-2-spell-reduction-1', 4, 60),
      s('high-magic-daemonology', 4, 40, { learn: os('daemonology') }),
    ],
  },
  {
    id: 'ancestral', name: 'Ancestral', kind: 'race', source: 'LS: Ancestral',
    summary: 'Summoned ancestral. Can be Dismissed.',
    restrictions: [{ kind: 'setsRace', race: 'ancestral' }],
    skills: [
      s('shield-dismiss-level', 1, 10), s('theology', 1, 10), s('tns-runes', 1, 10, { param: 'Ancestor', note: 'Ancestrals only; cannot be tutored.' }),
      s('dismiss-rank-5', 1, 10),
      s('dismiss-rank-10', 1, 30, { learn: os('dismiss-rank-5'), note: 'Printed as Tier 1 (other sheets say Tier 3): probably a loresheet error.' }),
      s('discern-ancestral-being', 1, 10),
      s('toughen-body', 3, 30), s('strike-for-enchanted', 3, 30), s('champion', 3, 30),
      s('high-magic-theology', 4, 40, { learn: os('theology') }),
      s('cast-additional-incantation', 4, 40, { learn: { any: [os('last-rites-improved'), os('master-countermagic')] } }),
    ],
  },

  // ---- Existential creatures (race) ----
  {
    id: 'plant', name: 'Plant', kind: 'race', source: 'LS: Plant',
    summary: 'Plant creature. Herb Cure Wound heals 2 wounds per location.',
    restrictions: [{ kind: 'setsRace', race: 'plant' }],
    skills: [
      s('conceal-item', 1, 10, { note: 'Printed as "Conceal" (L6).' }), s('herb-lore', 1, 5),
      s('herb-lore-improved', 2, 20, { learn: os('herb-lore') }),
      s('regeneration', 3, 25, { param: '10 minutes' }),
      s('natural-armour-1', 3, 35),
      s('improved-regeneration', 4, 35, { learn: os('regeneration') }),
      s('natural-armour-2', 4, 45, { learn: os('natural-armour-1') }),
      s('treewalker', 4, 85, { learn: { any: [cs('ritual-magic'), os('perform-transport-rite')] } }),
    ],
  },
  {
    id: 'mineral', name: 'Mineral', kind: 'race', source: 'LS: Mineral',
    summary: 'Mineral creature.',
    restrictions: [{ kind: 'setsRace', race: 'mineral' }],
    skills: [
      s('toughen-body', 3, 30), s('damage-reduction-crush', 3, 30), s('immune-through', 3, 35),
      s('immune-repel-strikedown', 3, 25), s('strike-for-enchanted', 3, 30),
      s('harden-body', 4, 85, { learn: os('toughen-body') }),
    ],
  },
  {
    id: 'beast', name: 'Beast', kind: 'race', source: 'LS: Beast',
    summary: 'Beast creature.',
    restrictions: [{ kind: 'setsRace', race: 'beast' }],
    skills: [
      s('fearsome-aspect', 3, 30), s('natural-armour-1', 3, 35),
      s('natural-armour-regrowth', 3, 30, { learn: os('natural-armour-1'), note: 'Printed prerequisite "Natural Armour" (L6).' }),
    ],
  },

  // ---- Patterns and conditions ----
  {
    id: 'unliving', name: 'Unliving', kind: 'pattern', source: 'LS: Unliving',
    summary: 'Unliving pattern. Immune to Decay, Disease, Paralysis, Fatal, Ritual of Peace and non-magical alchemy.',
    restrictions: [
      { kind: 'setsPattern', pattern: 'unliving' },
      { kind: 'cannotCast', spells: ['Heal Wound', 'Remove Paralysis', 'Heal Fatal Wound', 'Endurance', 'Shield from Corruption', 'High Carapace Armour', 'Total Heal'] },
      { kind: 'note', text: 'Recovers hits at time-in. Regeneration capped at 1 per 30 s.' },
    ],
    skills: [
      s('shield-dismiss-level', 1, 10), s('necromancy', 1, 10), s('tns-runes', 1, 10, { param: 'Grave', note: 'Unliving only; cannot be tutored.' }),
      s('dismiss-rank-5', 1, 10), s('discern-unliving', 1, 10),
      s('dismiss-rank-10', 3, 30, { learn: os('dismiss-rank-5') }),
      s('lhv-1', 3, 30),
      s('toughen-body', 4, 40),
      s('high-magic-necromancy', 4, 40, { learn: os('necromancy') }),
      s('base-lhv-1', 4, 65),
    ],
  },
  {
    id: 'magical-pattern', name: 'Magical Pattern', kind: 'pattern', source: 'LS: Magical Pattern',
    summary: 'Magical pattern. Healing needs a caster with Heal Magical Pattern.',
    restrictions: [{ kind: 'setsPattern', pattern: 'magical' }],
    skills: [
      s('fearsome-aspect', 3, 30),
      s('spell-reduction-1', 4, 40), s('magical-armour-repair', 4, 40),
      s('natural-armour-2', 4, 40, { learn: os('natural-armour-1') }),
      s('magical-armour-2', 4, 40, { learn: os('magical-armour-1') }),
      s('strike-for-enchanted', 4, 40),
    ],
  },
  {
    id: 'alien-pattern', name: 'Alien Life Pattern', kind: 'pattern', source: 'LS: Alien Life Pattern',
    summary: 'Bypasses the Ritual of Peace; immune to alchemy; standard Cure spells need Heal Alien or Aberrant Pattern.',
    restrictions: [], skills: [],
  },
  {
    id: 'possession', name: 'Possession', kind: 'condition', source: 'LS: Possession',
    summary: 'One possession at a time. Ends Embody Unliving. Gains the possessor\'s planar category.',
    restrictions: [], skills: [],
  },

  // ---- Essence creatures ----
  {
    id: 'werecreature', name: 'Werecreature', kind: 'essence', source: 'LS: Werecreature',
    summary: 'Transforms into beast form; mandatory after 8pm. Silver weakness.',
    restrictions: [{ kind: 'note', text: essenceNote }, { kind: 'note', text: 'Needs removable mask, natural claws and Claw Competency.' }],
    tiers: [
      tier(1, 'Werecreature', 10, 1, ['Regeneration 1 per 10 min (beast form)', '2 voluntary changes per day']),
      tier(2, 'Mature Werecreature', 20, 2, ['+1 Base LHV (beast form)', 'Regeneration 1 per 5 min', '3 changes per day']),
      tier(3, 'Elder Werecreature', 30, 3, ['+1 Base LHV, +1 LHV (beast form)', 'DR Crush', 'Regeneration 1 per 1 min', '4 changes per day']),
      tier(4, 'Alpha Werecreature', 40, 4, ['+1 Base LHV, +2 LHV (beast form)', 'DR Crush', 'Regeneration 1 per 1 min', '6 changes per day']),
    ],
    skills: [
      s('tracking', 1, 5, { minType: ALL, ...B }),
      s('discern-race', 1, 10, { minType: ALL, learn: os('tracking') }),
      s('lhv-1', 1, 10, { minType: ALL, ...B }),
      s('fearsome-aspect-level', 1, 10, { param: '1', minType: ALL, ...B }),
      s('beast-form-skill-use', 1, 10, { minType: ALL, ...B }),
      s('improved-regeneration', 1, 10, { minType: ALL, ...B }),
      s('fearsome-aspect-level', 2, 20, { param: '2', minType: MATURE, learn: os('fearsome-aspect-level', '1'), ...B }),
      s('enchanted-claws', 2, 20, { minType: MATURE, ...B }),
      s('beast-form-changes-2', 2, 20, { minType: MATURE }),
      s('discern-race-pattern', 3, 30, { minType: ALL, learn: os('discern-race') }),
      s('lhv-2', 3, 30, { minType: MATURE, learn: os('lhv-1'), ...B }),
      s('fearsome-aspect-level', 3, 30, { param: '4', minType: ELDER, learn: os('fearsome-aspect-level', '2'), ...B }),
      s('beast-form-casting', 3, 30, { minType: ANCIENT, learn: os('beast-form-skill-use'), ...B }),
      s('natural-armour-1', 3, 30, { minType: MATURE }),
      s('enchanted-strikedown-claws', 4, 40, { minType: ANCIENT, learn: os('enchanted-claws'), ...B }),
      s('natural-armour-2', 4, 40, { minType: ELDER, learn: os('natural-armour-1') }),
    ],
  },
  {
    id: 'paladin', name: 'Paladin', kind: 'essence', source: 'LS: Paladin',
    summary: 'Paladin Brand. Focus of Piety gives bonus AV.',
    restrictions: [
      { kind: 'note', text: essenceNote },
      { kind: 'grantsSkills', skills: ['dedicated-follower'] },
      { kind: 'noMageArmour' },
      { kind: 'csDisablesSkills', cs: 'spellcasting', skills: ['damage-reduction-crush', 'damage-reduction-all'] },
      { kind: 'note', text: 'Blind Faith: cannot be targeted by Heal Wound or derived effects.' },
    ],
    tiers: [
      tier(1, 'Paladin', 10, 1, ['Focus of Piety: +1 AV', 'Voice Above Them All: Speak with Ancestor for 4 power, once per day']),
      tier(2, 'Questing Paladin', 20, 2, ['Focus of Piety: +1 Base AV, +1 AV', 'Shield/Dagger of Pantheon: Sanctuary or Wasting chant for 0 power, once per hour']),
      tier(3, 'Knight Paladin', 30, 3, ['Focus of Piety: +1 Base AV, +2 AV', 'Dagger of Suns Dawning: small weapon strikes Lay to Rest for 10 minutes (4 power)']),
      tier(4, 'Lord Paladin', 40, 4, ['Focus of Piety: +2 Base AV, +2 AV']),
    ],
    skills: [
      s('champion', 1, 10, { minType: ALL }),
      s('dismiss-control-4', 1, 10, { minType: ALL }),
      s('immune-paralysis', 2, 20, { minType: ALL }),
      s('shield-mastery', 2, 20, { minType: ALL }),
      s('immune-charms', 2, 20, { minType: ALL }),
      s('last-rites-improved', 2, 20, { minType: ALL }),
      s('immune-through', 3, 30, { minType: MATURE }),
      s('damage-reduction-fatal', 3, 30, { minType: MATURE, learn: os('dedicated-follower') }),
      s('immune-disease-decay', 3, 30, { minType: ALL, learn: os('immune-paralysis') }),
      s('strike-for-enchanted', 3, 30, { minType: ELDER }),
      s('damage-reduction-crush', 4, 40, { minType: ELDER, learn: os('immune-through') }),
      s('damage-reduction-all', 5, 40, { minType: ANCIENT, learn: os('damage-reduction-crush') }),
      s('immune-fatal', 5, 40, { minType: ELDER, learn: os('damage-reduction-fatal') }),
      s('cast-additional-incantation', 5, 30, { minType: ELDER, learn: os('last-rites-improved') }),
    ],
  },
  {
    id: 'warlock', name: 'Warlock', kind: 'essence', source: 'LS: Warlock',
    summary: 'Runic Brand. Focus of the Void gives extra daily power.',
    restrictions: [
      { kind: 'note', text: essenceNote },
      { kind: 'grantsSkills', skills: ['sigil-spell-reduction-1'] },
      { kind: 'noBenefitFrom', items: ['body-development', 'base-lhv-1', 'toughen-body', 'harden-body', 'Titans Endurance', 'Paladins Armour'] },
    ],
    tiers: [
      tier(1, 'Warlock', 10, 1, ['Circle Affinity', 'Max wedge contribution 1']),
      { ...tier(2, 'Adept Warlock', 20, 2, ['+4 Warlock Power', 'Familiar Spell', 'Max wedge contribution 2']), extraSpellPower: 4 },
      { ...tier(3, 'Master Warlock', 30, 3, ['+8 Warlock Power', 'Leech Power', 'Max wedge contribution 3']), extraSpellPower: 8 },
      { ...tier(4, 'Master Adept Warlock', 40, 4, ['+12 Warlock Power', 'Magic Weaver', 'Max wedge contribution 4']), extraSpellPower: 12 },
    ],
    skills: [
      s('cast-high-countermagic', 1, 10, { minType: ALL, learn: cs('spellcasting', 2) }),
      s('mage-bolt-wedge', 1, 10, { minType: ALL, learn: cs('spellcasting', 2) }),
      s('shadow-magic', 1, 10, { minType: ALL }),
      s('enchanting', 1, 10, { minType: ALL }),
      s('spell-power-8', 2, 10, { minType: ALL }),
      s('global-blast-wedge', 2, 20, { minType: MATURE, learn: os('mage-bolt-wedge') }),
      s('level-2-spell-reduction-1', 2, 30, { minType: MATURE }),
      s('spell-power-12', 3, 20, { minType: MATURE, learn: os('spell-power-8') }),
      s('mass-blast-wedge', 3, 30, { minType: ELDER, learn: os('global-blast-wedge') }),
      s('cast-additional-magecraft', 3, 20, { minType: MATURE, learn: cs('spellcasting', 2) }),
      s('spell-power-16', 4, 40, { minType: ANCIENT, learn: os('spell-power-12') }),
      s('high-magic', 5, 30, { param: 'Spellcasting', minType: ELDER, learn: cs('spellcasting', 2) }),
      s('high-magic', 5, 30, { param: 'Healing', minType: ELDER, learn: cs('healing', 2) }),
      s('spell-reduction-2', 5, 50, { minType: ELDER, learn: os('level-2-spell-reduction-1') }),
      s('cast-all-magecraft', 5, 65, { minType: ANCIENT, learn: os('cast-additional-magecraft') }),
    ],
  },
  {
    id: 'vampire', name: 'Vampire', kind: 'essence', source: 'LS: Vampire',
    summary: 'Fangs; needs the Unliving loresheet. Energy Drain at night.',
    restrictions: [
      { kind: 'note', text: essenceNote },
      { kind: 'requiresLoresheet', loresheet: 'unliving' },
      { kind: 'setsPattern', pattern: 'unliving' },
    ],
    tiers: [
      tier(1, 'Vampire', 10, 1, ['Base dismiss rank 10', 'Mist Form (night)']),
      tier(2, 'Mature Vampire', 20, 2, ['Base dismiss rank 20 (night)', 'Waste Not Want Not']),
      tier(3, 'Elder Vampire', 30, 3, ['+1 Base LHV (night)', 'Base dismiss rank 45 (night)', 'Crypt Blade']),
      tier(4, 'Ancient Vampire', 40, 4, ['+2 Base LHV (night)', 'Base dismiss rank 60 (night)', 'Death Incarnate (night)']),
    ],
    skills: [
      s('beguile-level', 1, 10, { param: '1', minType: ALL, ...V }),
      s('repair-unliving-advanced', 2, 20, { minType: ALL, learn: os('revitalise-unliving') }),
      s('dismiss-control-4', 2, 10, { minType: ALL }),
      s('beguile-level', 2, 20, { param: '2', minType: MATURE, learn: os('beguile-level', '1'), ...V }),
      s('toughen-body', 2, 20, { minType: MATURE, ...V }),
      s('dismiss-control-8', 3, 30, { minType: ALL, learn: os('dismiss-control-4'), note: 'Needs +4, skipping +6 (L5).' }),
      s('beguile-level', 3, 30, { param: '3', minType: ELDER, learn: os('beguile-level', '2'), ...V }),
      s('beguile-level', 4, 40, { param: '4', minType: ANCIENT, learn: os('beguile-level', '3'), ...V }),
      s('harden-body', 4, 40, { minType: ANCIENT, learn: os('toughen-body'), ...V }),
      s('lhv-1-vampire', 4, 20, { minType: MATURE, ...V, note: 'Stacks with the +1 LHV OS (L5).' }),
      s('high-magic', 5, 50, { param: 'Corruption', minType: ELDER, learn: cs('corruption', 2) }),
      s('source-of-unlife', 5, 65, { minType: ANCIENT, learn: { all: [os('mind-healing'), os('repair-unliving-advanced')] } }),
    ],
  },
  {
    id: 'druid', name: 'Druid', kind: 'essence', source: 'LS: Druid',
    summary: 'Totem of animal, plant or beast. Force of Nature gives Natural AV.',
    restrictions: [
      { kind: 'note', text: essenceNote },
      { kind: 'standardArmourOnly' },
      { kind: 'noMageArmour' },
    ],
    tiers: [
      tier(1, 'Druid', 10, 1, ['Root Veins: Paralysis lasts 30 s']),
      tier(2, 'Mature Druid', 20, 1, ['+1 Natural AV', 'Creation Affinity: free second Cure Wound']),
      tier(3, 'Elder Druid', 30, 2, ['+2 Natural AV', 'Blessing of Germination: Global Cure Wound']),
      tier(4, 'Ancient Druid', 40, 4, ['+3 Natural AV', 'Absolution of Erdreja: petition to remove a curse']),
    ],
    skills: [
      s('theology', 1, 10, { minType: ALL }),
      s('herb-lore', 1, 5, { minType: ALL }),
      s('cast-high-countermagic', 1, 10, { minType: ALL }),
      s('herb-lore-improved', 2, 20, { minType: ALL, learn: os('herb-lore') }),
      s('natural-armour-1', 2, 20, { minType: ALL }),
      s('master-countermagic', 2, 10, { minType: MATURE, learn: os('cast-high-countermagic') }),
      s('spell-power-8', 2, 10, { minType: ALL }),
      s('spell-power-12', 3, 20, { minType: MATURE, learn: os('spell-power-8') }),
      s('natural-armour-regrowth', 3, 30, { minType: MATURE, learn: os('natural-armour-1') }),
      s('natural-claws', 3, 25, { minType: ELDER, learn: claw }),
      s('retractable-claws', 1, 10, { minType: ELDER, learn: os('natural-claws'), note: 'Tier 1 but needs a Tier 3 skill (L2).' }),
      s('cast-additional-incantation', 4, 40, { minType: ELDER, learn: { any: [os('last-rites-improved'), os('master-countermagic')] } }),
      s('high-magic', 5, 30, { param: 'Incantation', minType: ELDER, learn: cs('incantation', 2) }),
      s('cast-all-incantation', 5, 65, { minType: ANCIENT, learn: os('cast-additional-incantation') }),
    ],
  },
  {
    id: 'essence-creature', name: 'Essence Creature', kind: 'condition', source: 'LS: Essence Creature',
    summary: 'Shared essence and bloodline rules (12.5).',
    restrictions: [], skills: [],
  },

  // ---- Awakened ----
  {
    id: 'awakened-beastkin', name: 'Awakened Beastkin', kind: 'awakened', source: 'LS: Awakened Beastkin',
    summary: 'Herb Cure Wound on head or torso cures twice.',
    restrictions: [{ kind: 'requiresRace', race: 'beastkin' }, { kind: 'note', text: 'Awakened creature: still counts as the base race (Bane, Affect, detection, elemental weakness). Awakening costs 10 OSP (Awakened <X>). Cannot also become an essence, summonable or other special creature.' }],
    skills: [
      s('translate-named-script', 1, 5, { param: 'Beastkin' }), s('immune-fumble', 1, 5), s('herb-lore', 1, 5), s('tracking', 1, 5),
      s('discern-race', 1, 10, { learn: os('tracking') }),
      s('immune-repel-strikedown', 3, 25),
      s('natural-claws', 3, 25, { learn: claw }),
      s('natural-armour-1', 3, 25),
      s('retractable-claws', 3, 10, { learn: { all: [os('natural-claws'), claw] } }),
      s('mystic-claws', 4, 10, { learn: { all: [os('natural-claws'), claw] } }),
      s('natural-armour-2', 4, 35, { learn: os('natural-armour-1') }),
      s('natural-armour-regrowth', 4, 30, { learn: os('natural-armour-2') }),
    ],
  },
  {
    id: 'awakened-drow', name: 'Awakened Drow', kind: 'awakened', source: 'LS: Awakened Drow',
    summary: 'Immune to Wasting. Incantation 2 grants Chant of Wasting.',
    restrictions: [{ kind: 'requiresRace', race: 'drow' }, { kind: 'note', text: 'Awakened creature: still counts as the base race (Bane, Affect, detection, elemental weakness). Awakening costs 10 OSP (Awakened <X>). Cannot also become an essence, summonable or other special creature.' }],
    skills: [
      s('translate-named-script', 1, 5, { param: 'Elven' }), s('dedicated-follower', 1, 10),
      s('light-incantation', 1, 5, { learn: cs('incantation') }),
      s('dark-incantation', 1, 5, { learn: cs('incantation') }),
      s('focused-through', 2, 15, { learn: os('immune-fumble') }),
      s('conceal-item', 2, 10), s('locate', 2, 15),
      s('traverse-faction-wards', 3, 20),
      s('cast-additional-incantation', 5, 20, { learn: { any: [os('last-rites-improved'), os('master-countermagic')] } }),
    ],
  },
  {
    id: 'awakened-dwarf', name: 'Awakened Dwarf', kind: 'awakened', source: 'LS: Awakened Dwarf (PDF)',
    summary: 'Stubborn as an Ancestor: once per 10 minutes resist a Normal Strikedown or Crush from a melee weapon (not Earth).',
    restrictions: [{ kind: 'requiresRace', race: 'dwarf' }, { kind: 'note', text: 'Awakened creature: still counts as the base race (Bane, Affect, detection, elemental weakness). Awakening costs 10 OSP (Awakened <X>). Cannot also become an essence, summonable or other special creature.' }],
    skills: [
      s('translate-named-script', 1, 5, { param: 'Dwarf' }),
      s('quick-armour-repair', 1, 10),
      s('advanced-armour-repair', 3, 30, { learn: os('quick-armour-repair') }),
      s('master-armour-repair', 4, 40, { learn: os('advanced-armour-repair') }),
      s('self-repairing-armour', 3, 30, { learn: os('master-armour-repair') }),
      s('ritual-magic-improved', 3, 25),
      s('spell-tempering', 3, 25),
      s('spell-tempering-master', 4, 35, { learn: os('spell-tempering') }),
      s('ritual-crafter', 4, 55, { learn: os('spell-tempering-master') }),
    ],
  },
  {
    id: 'awakened-elf', name: 'Awakened Elf', kind: 'awakened', source: 'LS: Awakened Elf (PDF)',
    summary: 'Quickblood: once per 10 minutes Paralysis lasts 30 s instead of 1 minute.',
    restrictions: [{ kind: 'requiresRace', race: 'elf' }, { kind: 'note', text: 'Awakened creature: still counts as the base race (Bane, Affect, detection, elemental weakness). Awakening costs 10 OSP (Awakened <X>). Cannot also become an essence, summonable or other special creature.' }],
    skills: [
      s('translate-named-script', 1, 5, { param: 'Elven', note: 'No tier printed; handbook tier used (L14).' }),
      s('immune-sleep', 4, 35, { note: 'No tier printed; handbook tier used (L14).' }),
      s('spell-power-4', 1, 5),
      s('spell-power-8', 2, 15, { learn: os('spell-power-4') }),
      s('spell-power-12', 3, 35, { learn: os('spell-power-8') }),
      s('spell-power-16', 4, 45, { learn: os('spell-power-12') }),
      s('level-2-spell-reduction-1', 5, 55, { learn: os('spell-power-12') }),
      s('strike-for-enchanted', 4, 45),
    ],
  },
  {
    id: 'awakened-fey', name: 'Awakened Fey', kind: 'awakened', source: 'LS: Awakened Fey (PDF)',
    summary: 'The Song of Arcadia: once per 10 minutes Mute lasts 30 s instead of 1 minute.',
    restrictions: [{ kind: 'requiresRace', race: 'fey' }, { kind: 'note', text: 'Awakened creature: still counts as the base race (Bane, Affect, detection, elemental weakness). Awakening costs 10 OSP (Awakened <X>). Cannot also become an essence, summonable or other special creature.' }],
    skills: [
      s('translate-named-script', 1, 5, { param: 'Fey' }),
      s('detect-remove-beguile', 1, 5),
      s('immune-charms', 2, 25, { learn: os('detect-remove-beguile') }),
      s('magical-armour-mastery', 2, 15, { learn: { any: [cs('light-armour'), cs('medium-armour'), cs('heavy-armour')] } }),
      s('magical-armour-1', 3, 35),
      s('magical-armour-2', 4, 45, { learn: os('magical-armour-1') }),
      s('magical-armour-repair', 4, 35, { learn: os('magical-armour-2') }),
    ],
  },
  {
    id: 'awakened-halfling', name: 'Awakened Halfling', kind: 'awakened', source: 'LS: Awakened Halfling (PDF)',
    summary: 'Younger (Race) and Trickier: Traverse Faction Wards replaces Escape Bonds; Conceal Item replaces Locate.',
    restrictions: [
      { kind: 'requiresRace', race: 'halfling' }, { kind: 'note', text: 'Awakened creature: still counts as the base race (Bane, Affect, detection, elemental weakness). Awakening costs 10 OSP (Awakened <X>). Cannot also become an essence, summonable or other special creature.' },
      { kind: 'replaces', skill: 'traverse-faction-wards', replaces: ['escape-bonds'] },
      { kind: 'replaces', skill: 'conceal-item', replaces: ['locate'] },
      { kind: 'replaces', skill: 'conceal-item-improved', replaces: ['locate'] },
    ],
    skills: [
      s('translate-named-script', 1, 5, { param: 'Halfling' }),
      s('escape-bonds', 1, 5),
      s('traverse-faction-wards', 3, 20, { learn: os('escape-bonds') }),
      s('immune-fear', 1, 5),
      s('locate', 2, 15),
      s('conceal-item', 2, 15, { learn: os('locate') }),
      s('conceal-item-improved', 3, 25, { learn: os('conceal-item') }),
      s('identify', 1, 5),
      s('venom-resistance', 1, 10),
      s('beguile-level', 3, 25, { param: '1' }),
    ],
  },
  {
    id: 'awakened-human', name: 'Awakened Human', kind: 'awakened', source: 'LS: Awakened Human (PDF)',
    summary: 'The Innocence: immune to the Red Mist curse. Jack of All Trades is bought here (20 OSP each time).',
    restrictions: [
      { kind: 'requiresRace', race: 'human' }, { kind: 'note', text: 'Awakened creature: still counts as the base race (Bane, Affect, detection, elemental weakness). Awakening costs 10 OSP (Awakened <X>). Cannot also become an essence, summonable or other special creature.' },
      { kind: 'note', text: 'Oathbreaker: Tier 5 skills learned with Jack of All Trades (and JoAT) are suspended while the guild\'s Oathbreaker Curse lasts, and lost after 1 year. Losing this loresheet removes every skill learned with Jack of All Trades.' },
    ],
    skills: [
      s('improved-ritual-of-peace', 1, 10),
      s('jack-of-all-trades', 2, 20),
      s('bonus-pr-1', 2, 15),
      s('bonus-pr-2', 3, 30, { learn: os('bonus-pr-1') }),
      s('hard-worker', 1, 5),
    ],
  },
  {
    id: 'awakened-olog', name: 'Awakened Olog', kind: 'awakened', source: 'LS: Awakened Olog (PDF)',
    summary: 'Walk It Off: once per 10 minutes resist a Normal Strikedown or Crush from a melee weapon (not Air).',
    restrictions: [{ kind: 'requiresRace', race: 'olog' }, { kind: 'note', text: 'Awakened creature: still counts as the base race (Bane, Affect, detection, elemental weakness). Awakening costs 10 OSP (Awakened <X>). Cannot also become an essence, summonable or other special creature.' }],
    skills: [
      s('translate-named-script', 1, 5, { param: 'Olog' }),
      s('natural-armour-1', 3, 30),
      s('natural-armour-2', 4, 40, { learn: os('natural-armour-1') }),
      s('regeneration', 4, 40, { param: '10 minutes', note: 'Does not regenerate Artefact. No tier printed; Tier 4 assumed (L14).' }),
      s('improved-regeneration', 4, 30, { learn: os('regeneration') }),
      s('lhv-1', 4, 35),
      s('lhv-2', 4, 45, { learn: { all: [os('lhv-1'), cs('body-development', 1)] } }),
      s('base-lhv-1', 4, 60, { learn: { all: [os('lhv-2'), cs('body-development', 2)] } }),
    ],
  },
  {
    id: 'awakened-uruk', name: 'Awakened Uruk', kind: 'awakened', source: 'LS: Awakened Uruk (PDF)',
    summary: 'Hagglemaster (better Fence offers). Brutish Strike, Focused Strike and Goblin Resilience routes.',
    restrictions: [{ kind: 'requiresRace', race: 'uruk' }, { kind: 'note', text: 'Awakened creature: still counts as the base race (Bane, Affect, detection, elemental weakness). Awakening costs 10 OSP (Awakened <X>). Cannot also become an essence, summonable or other special creature.' }],
    skills: [
      s('translate-named-script', 1, 5, { param: 'Uruck', note: 'No tier printed; handbook tier used (L14).' }),
      s('lhv-1', 5, 45, { note: 'No tier printed; handbook tier (5) used (L14).' }),
      s('master-brewer', 3, 30, { note: 'No tier printed; Tier 3 assumed (L14).' }),
      s('herb-lore', 1, 5, { note: 'No tier printed; handbook tier used (L14).' }),
      s('herb-lore-improved', 2, 20, { learn: os('herb-lore'), note: 'No tier printed; handbook tier used (L14).' }),
      s('brutish-strike', 1, 10),
      s('focused-strike', 3, 25, { learn: { any: [os('brutish-strike'), os('mighty-blow')] } }),
      s('goblin-resilience', 2, 15),
      s('toughen-body', 4, 35, { learn: os('goblin-resilience') }),
      s('harden-body', 5, 50, { learn: os('toughen-body') }),
      s('mighty-blow-brutish', 4, 20, { learn: os('brutish-strike'), note: 'Mighty Blow at 20 OSP less with Brutish Strike.' }),
      s('crushing-blow-focused', 5, 25, { learn: os('focused-strike'), note: 'Crushing Blow at 25 OSP less with Focused Strike.' }),
    ],
  },

  // ---- Skill loresheets from the PDF that the markdown lost ----
  {
    id: 'circle-warden', name: 'Circle Warden', kind: 'skill', skill: 'circle-warden', source: 'LS: Circle Warden (PDF)',
    summary: 'Bonded to one Ritual Circle. Network Attunement without Ritual Magic 3; Transportation in 30 s; circle rites.',
    restrictions: [{ kind: 'grantsSkills', skills: ['immune-mute', 'immune-charms'] }],
    skills: [
      s('circle-warden', 5, 85),
      s('immune-mind-effects', 5, 40, { learn: os('rally') }),
      s('cast-all-magecraft', 5, 65, { learn: os('cast-additional-magecraft') }),
      s('cast-all-incantation', 5, 65, { learn: os('cast-additional-incantation') }),
    ],
  },
  {
    id: 'circle-watcher', name: 'Circle Watcher', kind: 'skill', skill: 'circle-watcher', source: 'LS: Circle Watcher (PDF)',
    summary: 'Aligned to the Watchers\' circles. As Circle Warden, plus Rite of Blocking and Network Leap.',
    restrictions: [{ kind: 'grantsSkills', skills: ['immune-mute', 'immune-charms'] }],
    skills: [
      s('circle-watcher', 5, 85),
      s('immune-mind-effects', 5, 40, { learn: os('rally') }),
      s('voidportal', 4, 85),
      s('cast-all-magecraft', 5, 65, { learn: os('cast-additional-magecraft') }),
      s('cast-all-incantation', 5, 65, { learn: os('cast-additional-incantation') }),
    ],
  },
  {
    id: 'diagnose-powers', name: 'Diagnose Powers', kind: 'skill', skill: 'diagnose-powers', source: 'LS: Diagnose Powers (PDF)',
    summary: 'Identify item powers; once per day restore an item card.',
    restrictions: [],
    skills: [
      s('daemonology', 1, 5), s('elementalism', 1, 5), s('necromancy', 1, 5), s('theology', 1, 5),
      s('level-2-spell-reduction-1', 4, 60),
    ],
  },

  // ---- Skill and route loresheets ----
  {
    id: 'treewalker', name: 'Treewalker', kind: 'skill', skill: 'treewalker', source: 'LS: Treewalker',
    summary: 'Tree Network travel. Needs Perform Transport Rite.',
    restrictions: [
      { kind: 'requiresCs', cs: ['spellcasting', 'incantation', 'healing'] },
      { kind: 'excludesCs', cs: ['corruption'] },
      { kind: 'note', text: 'Not available with Necromancy or an Unliving pattern (L11).' },
    ],
    skills: [s('treewalker', 5, 85, { learn: os('perform-transport-rite') })],
  },
  {
    id: 'voidportal', name: 'Voidportal', kind: 'skill', skill: 'voidportal', source: 'LS: Voidportal',
    summary: 'Grants Perform Teleport Rite and Spell Reduction (2) on Teleport.',
    restrictions: [{ kind: 'grantsSkills', skills: ['perform-teleport-rite'] }],
    skills: [s('voidportal', 5, 85)],
  },
  {
    id: 'tpc', name: 'TPC', kind: 'route', unpublished: true, source: 'Owner request, 2026-09-18',
    summary: 'Placeholder: details to come.',
    restrictions: [], skills: [],
  },
  {
    id: 'npc-dpc', name: 'NPC/DPC', kind: 'route', unpublished: true, param: 'Faction or Guild', source: 'Owner ruling, 2026-09-18',
    summary: 'Held by NPC and DPC characters for a faction or guild. Grants Oathsworn <X> and <X> Command (Command is never on a player card).',
    restrictions: [{ kind: 'grantsSkills', skills: ['oathsworn', 'command'], withParam: true }],
    skills: [],
  },
  {
    id: 'architect', name: 'Architect', kind: 'route', unpublished: true, source: 'Owner ruling, 2026-09-17',
    summary: 'Buy any skill you have access to, up to Tier 4, without buying its prerequisites. The skill still costs OSP; one step per tree per year and use requirements still apply.',
    restrictions: [],
    skills: [],
  },
]

// Essence creature tiers are skills on the character card (Vampire → Mature Vampire → …), bought from the loresheet.
// Each tier also needs an essence rite (12.5); the OSP cost is the tier's cost.
for (const l of loresheets) {
  for (const t of l.tiers ?? []) {
    l.skills.unshift(s(`${l.id}-${t.tier}`, t.tier, t.cost, t.tier === 1
      ? { note: 'Also needs the essence Rite of Creation.' }
      : { learn: os(`${l.id}-${t.tier - 1}`), note: 'Also needs an essence rite (Tier Advancement, Peer Advancement or Assimilation).' }))
  }
}

function tier(n: 1 | 2 | 3 | 4, name: string, cost: number, powerRating: number, abilities: string[]): EssenceTier {
  return { tier: n, name, cost, powerRating, abilities }
}
