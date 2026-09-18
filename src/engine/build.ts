import { loresheetById, type FlagId, type Pattern } from '../data'

/** How a skill was obtained. */
export type SkillSource =
  | 'buy'        // normal purchase from a handbook list
  | 'loresheet'  // alternative route from a held loresheet (LS-3)
  | 'architect'  // Architect route: prerequisites bypassed (LS-4a)
  | 'joat'       // Jack of All Trades: training facility for an Ω list of an Oathsworn guild (ruling)
  | 'ritual'     // put straight on the character card by a ritual: no purchase, no prerequisites
  | 'granted'    // recorded on a special creature or special power card, no purchase

/** 'loresheet': granted by a held loresheet, recorded there rather than on a card. */
export type CardId = 'character' | 'creature' | 'power' | 'loresheet'

export interface HeldSkill {
  id: string
  param?: string
  source: SkillSource
  /** Loresheet the skill was bought from (source 'loresheet'). */
  loresheet?: string
  /** Defaults to 'character'. Granted skills go on 'creature' or 'power'. */
  card?: CardId
  /** Taken off the card (switched off or sacrificed, LIM-8). Still counts as held for prerequisites. */
  dropped?: boolean
}

/** Identifies a skill (and its <X>) for dropping. */
export const skillKey = (id: string, param?: string) => `${id}|${param ?? ''}`

export interface HeldLoresheet {
  id: string
  /** Essence creature level (1–4), for old saved builds. The level normally comes from the essence skill on the card. */
  tier?: 1 | 2 | 3 | 4
  /** <X> for loresheets held for a faction or guild (NPC/DPC). */
  param?: string
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

/**
 * Add loresheets, applying what each one sets: pattern (Unliving, Vampire), race (Elemental and other ritual races),
 * and the tier 1 skill of an essence creature (the Vampire loresheet puts Vampire on the card).
 */
export function addLoresheets(b: Build, ids: string[]): Build {
  const next: Build = { ...b, loresheets: [...b.loresheets], os: [...b.os] }
  for (const id of ids) {
    const ls = loresheetById.get(id)
    if (!ls || next.loresheets.some((l) => l.id === id)) continue
    next.loresheets.push({ id })
    for (const r of ls.restrictions) {
      if (r.kind === 'setsPattern') next.pattern = r.pattern
      if (r.kind === 'setsRace') next.race = r.race
    }
    if (ls.tiers && !next.os.some((h) => new RegExp(`^${id}-[1-4]$`).test(h.id))) {
      next.os.push({ id: `${id}-1`, source: 'loresheet', loresheet: id })
    }
    // An awakened sheet comes with the Awakened <X> skill, gained through the Rite of Creation.
    if (ls.kind === 'awakened' && !next.os.some((h) => h.id === 'awakened')) {
      next.os.push({ id: 'awakened', param: ls.name.replace(/^Awakened /, ''), source: 'buy' })
      if (!next.flags.includes('awakenedRite')) next.flags = [...next.flags, 'awakenedRite']
    }
  }
  return next
}

export const newBuild = (): Build => ({ race: 'human', pattern: 'living', flags: [], cs: {}, os: [], loresheets: [] })
