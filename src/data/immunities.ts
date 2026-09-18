// What each Occupational Skill makes the character immune to (HB skill descriptions).
// A skill also gives the immunities of the skills it replaces or includes (Rally → Fear), so only list its own.
// "Effect|limit" adds a limit, dropped when another skill gives the effect without one. Nothing is immune to Artefact or
// Elemental Weakness effects, so that exception isn't repeated as a limit.

const CHARMS = ['Befriend', 'Beguile', 'Enthral', 'Enthral Unliving']

export const immunitiesBySkill: Record<string, string[]> = {
  'immune-charms': CHARMS,
  beguile: CHARMS,
  'immune-befriend-confusion': ['Befriend', 'Confusion'],
  'immune-fear': ['Fear'],
  'immune-sleep': ['Sleep'],
  'immune-mind-effects': [...CHARMS, 'Confusion', 'Disregard', 'Fear', 'Mass Fear', 'Remove Fear', 'Sleep'],
  'sleepless-chanting': ['Sleep|while casting a Chant'],
  'unending-voice': ['Sleep|while casting a Chant'],
  'immune-mute': ['Mute'],
  'immune-repel': ['Repel'],
  'immune-repel-strikedown': ['Repel', 'Strikedown'],
  'mighty-blow-brutish': ['Repel', 'Strikedown'],
  'immune-fumble': ['Fumble'],
  'immune-fumble-shatter': ['Fumble', 'Shatter'],
  'immune-through': ['Through'],
  'damage-reduction-all': ['Through'],
  'armour-mastery-expert': ['Crush'],
  // Parrying with a shield: the shield isn't damaged. Expert first wins over the Shield Mastery it replaces.
  'shield-mastery': ['Crush on shield|Normal'],
  'shield-mastery-expert': ['Crush on shield|Normal or Enchanted'],
  'immune-immobilisation': ['Immobilisation|not Petrification'],
  'immune-paralysis': ['Paralysis'],
  'immune-disease': ['Disease'],
  'immune-disease-decay': ['Disease', 'Decay'],
  'immune-lethal-alchemical-venoms': ['Lethal Alchemical Venoms|non-magical'],
  'immune-fatal': ['Fatal'],
  'immune-harm': ['Harm'],
  'immune-mage-bolt': ['Mage Bolt'],
}

/** Damage Reduction: the effect still lands, reduced (HB Damage Reduction). Not listed where the character is immune. */
export const damageReductionBySkill: Record<string, string[]> = {
  'damage-reduction-fatal': ['Fatal'],
  'damage-reduction-harm': ['Harm'],
  'damage-reduction-mage-bolt': ['Mage Bolt'],
  'damage-reduction-crush': ['Crush'],
  'damage-reduction-all': ['All damage effects|not Bane'],
  'magic-resistance': ['Harm', 'Mage Bolt'],
}

/**
 * Effects that only work on some patterns (HB Damage Effects and spells), so they can't affect the others at all,
 * even with an Elemental Weakness or Artefact damage type.
 */
export const onlyAffects: Record<string, 'living' | 'unliving'> = {
  Decay: 'living', Disease: 'living', Fatal: 'living', Paralysis: 'living',
  Smite: 'unliving', 'Bind Unliving': 'unliving', 'Enthral Unliving': 'unliving',
}

/** Loresheets that stop an effect working on the holder. */
export const unaffectedBySheet: Record<string, string[]> = {
  'npc-dpc': ['Beguile'], // owner ruling, not in the published text
  unliving: ['Ritual of Peace', 'Alchemical Poisons and Potions|non-magical'],
  'magical-pattern': ['Ritual of Peace', 'Alchemical Poisons and Potions', 'Magical Poisons and Potions', 'Embody Unliving'],
  'alien-pattern': ['Ritual of Peace', 'Alchemical Poisons and Potions'],
  paladin: ['Heal Wound|and effects based on it', 'Mage Armour|cast on them'], // Blind Faith
  warlock: ["Paladin's Armour|cast on them"],
  'awakened-drow': ['Wasting'],
  'awakened-human': ['Red Mist curse|Militia Guild'],
}
