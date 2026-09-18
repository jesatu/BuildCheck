// Data types for the Lorien Trust rules data.
// Rule IDs in comments (CS-1, OS-2, LS-3, ...) refer to docs/LT-Build-Rules-Reference.md.

export type Tier = 1 | 2 | 3 | 4 | 5

/** Where a skill is printed on the character card. `none` = never on a player card. */
export type CardSide = 'left' | 'right' | 'none'

export type Pattern = 'living' | 'unliving' | 'magical'

/** Out-of-game qualifications or in-character permissions the tool cannot derive. */
export type FlagId =
  | 'bowCompetency'
  | 'clawCompetency'
  | 'factionPermission'
  | 'awakenedRite'
  | 'researchRequest'

/**
 * A requirement expression. Used for both learn prerequisites and use requirements.
 * `os` is satisfied by the skill itself, or by any skill that replaces or includes it (REP-2b).
 */
export type Requirement =
  | { os: string; param?: string }
  | { cs: string; level?: number }
  | { flag: FlagId }
  | { loresheet: string }
  | { pattern: Pattern }
  | { all: Requirement[] }
  | { any: Requirement[] }
  | { not: Requirement }

export type CsGroup = 'weapon' | 'armour' | 'knowledge' | 'power'

export interface CharacterSkill {
  id: string
  name: string
  group: CsGroup
  /** Total cost at each level. Unlevelled skills have one entry. (CS-3) */
  levelCosts: number[]
  requires?: Requirement
  summary: string
  source: string
}

export type GuildListId =
  | 'alchemists'
  | 'armourers'
  | 'bards'
  | 'casino'
  | 'corruptors'
  | 'healers'
  | 'incantors'
  | 'mages'
  | 'militia'
  | 'rangers'
  | 'scouts'
  | 'bank'
  | 'knowledge'
  | 'arcane'
  | 'martial'
  | 'generic'

export interface GuildList {
  id: GuildListId
  name: string
  /** Guilds whose members can use this list. Group lists cover several guilds. */
  guilds: string[]
  /** Marked Ω: usable with Jack of All Trades. */
  jackOfAllTrades: boolean
}

export interface OccupationalSkill {
  id: string
  name: string
  /** Handbook tier and cost. Undefined for skills whose tier and cost come only from a loresheet. */
  tier?: Tier
  cost?: number
  /** `@`: needs a training facility, tutor or forgery. */
  restricted: boolean
  /** `#`: only available through a ritual, lammie or loresheet. */
  loresheetOnly: boolean
  /** Label for a parameterised skill, e.g. "Profession" for Apprentice <X>. */
  param?: string
  lists: GuildListId[]
  /** Learn prerequisite (checked when buying). Also defines the skill's tree (OS-2). */
  learn?: Requirement
  /** Use requirement (checked for the skill to be active). */
  use?: Requirement
  /** Skills removed from the card when this is bought (REP-1, REP-2a). */
  replaces?: string[]
  /** Skills whose abilities this one includes without them being replaced on the card. */
  includes?: string[]
  /** OS that cannot be held alongside this one (8.6). */
  excludes?: string[]
  side: CardSide
  countsTowardLimit: boolean
  /** Does not count toward the 4 purchases per season (OS-1). */
  exemptFromYearly: boolean
  /** Can only be bought at a main event (8.3). */
  mainEventOnly?: boolean
  paragon?: boolean
  summary: string
  source: string
}

export type LoresheetKind =
  | 'race'
  | 'pattern'
  | 'essence'
  | 'awakened'
  | 'skill'
  | 'condition'
  | 'route'

/** A skill purchasable from a loresheet at the loresheet's tier and cost (LS-3). */
export interface LoresheetSkill {
  os: string
  param?: string
  tier: Tier
  cost: number
  /** Loresheet learn prerequisite. Replaces the handbook learn prerequisite for this route. */
  learn?: Requirement
  /** Essence creature tier needed to buy (LS-5). */
  minType?: 1 | 2 | 3 | 4
  /** (B) beast form only, (V) night only (LS-6). */
  availability?: 'beastForm' | 'night'
  note?: string
}

export interface EssenceTier {
  tier: 1 | 2 | 3 | 4
  name: string
  cost: number
  powerRating: number
  /** Warlock Focus of the Void: daily power added on top of the Rule of Double cap. */
  extraSpellPower?: number
  abilities: string[]
}

export type Restriction =
  | { kind: 'cannotCast'; spells: string[] }
  | { kind: 'noBenefitFrom'; items: string[] }
  | { kind: 'noMageArmour' }
  | { kind: 'standardArmourOnly' }
  | { kind: 'requiresLoresheet'; loresheet: string }
  | { kind: 'setsPattern'; pattern: Pattern }
  | { kind: 'setsRace'; race: string }
  | { kind: 'grantsSkills'; skills: string[] }
  | { kind: 'csDisablesSkills'; cs: string; skills: string[] }
  | { kind: 'excludesCs'; cs: string[] }
  | { kind: 'requiresCs'; cs: string[] }
  | { kind: 'note'; text: string }

export interface Loresheet {
  id: string
  name: string
  kind: LoresheetKind
  /** True if the loresheet is not in the published loresheets file. */
  unpublished?: boolean
  skills: LoresheetSkill[]
  tiers?: EssenceTier[]
  restrictions: Restriction[]
  summary: string
  source: string
}

export type SpellRange = 'Mss' | 'Rng' | 'Prox' | 'Slf' | 'Rit'

export interface Spell {
  name: string
  range: SpellRange
}

export type MagicFamily = 'magecraft' | 'incantation' | 'channelling' | 'summoning' | 'ritual'

export interface SpellList {
  id: string
  name: string
  family: MagicFamily
  /** How the list is gained. */
  kind: 'base' | 'specialisation' | 'combined' | 'summoning' | 'ritual'
  /** Spells by level: index 0 = level 1. */
  levels: [Spell[], Spell[], Spell[]]
  source: string
}

export type RaceCategory = 'existential' | 'elderRaces' | 'youngerRaces' | 'planar'
export type Element = 'flame' | 'air' | 'water' | 'earth'

export interface Race {
  id: string
  name: string
  category: RaceCategory
  startingRace: boolean
  elementalWeakness: Element
  /** Loresheet that a character of this race holds. */
  loresheet?: string
}
