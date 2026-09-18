import type { FlagId, Pattern } from '../data'

/** How a skill was obtained. */
export type SkillSource =
  | 'buy'        // normal purchase from a handbook list
  | 'loresheet'  // alternative route from a held loresheet (LS-3)
  | 'architect'  // Architect route: prerequisites bypassed (LS-4a)
  | 'granted'    // recorded on a special creature or special power card, no purchase

export type CardId = 'character' | 'creature' | 'power'

export interface HeldSkill {
  id: string
  param?: string
  source: SkillSource
  /** Loresheet the skill was bought from (source 'loresheet'). */
  loresheet?: string
  /** Defaults to 'character'. Granted skills go on 'creature' or 'power'. */
  card?: CardId
}

export interface HeldLoresheet {
  id: string
  /** Essence creature tier (1–4). */
  tier?: 1 | 2 | 3 | 4
}

export interface Build {
  race: string
  pattern: Pattern
  /** Player age in years. Undefined = adult. */
  age?: number
  flags: FlagId[]
  /** Character Skill id → level. */
  cs: Record<string, number>
  /** Every OS ever obtained, including ones since replaced (kept for prerequisites, REP-2b). */
  os: HeldSkill[]
  loresheets: HeldLoresheet[]
}

export const newBuild = (): Build => ({ race: 'human', pattern: 'living', flags: [], cs: {}, os: [], loresheets: [] })
