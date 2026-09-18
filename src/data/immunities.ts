// What each Occupational Skill makes the character immune to (HB skill descriptions).
// A skill also gives the immunities of the skills it replaces or includes (Rally → Fear), so only list its own.
// "Effect|limit" adds a limit, dropped when another skill gives the effect without one.

const CHARMS = ['Befriend', 'Beguile', 'Enthral', 'Enthral Unliving']
const THROUGH = 'Through|not Artefact or Elemental Weakness damage'

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
  'immune-fumble-shatter': ['Fumble|also items held', 'Shatter|also items held'],
  'immune-through': [THROUGH],
  'damage-reduction-all': ['Through|not Artefact Through'],
  'armour-mastery-expert': ['Crush|not Artefact damage'],
  'immune-immobilisation': ['Immobilisation|not Petrification'],
  'immune-paralysis': ['Paralysis'],
  'immune-disease': ['Disease'],
  'immune-disease-decay': ['Disease', 'Decay'],
  'immune-lethal-alchemical-venoms': ['Lethal Alchemical Venoms|non-magical'],
  'immune-fatal': ['Fatal'],
  'immune-harm': ['Harm'],
  'immune-mage-bolt': ['Mage Bolt'],
}
