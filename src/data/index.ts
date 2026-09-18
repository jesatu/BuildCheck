import { characterSkills } from './character-skills'
import { guildLists } from './guild-lists'
import { loresheets } from './loresheets'
import { occupationalSkills } from './occupational-skills'
import { races } from './races'
import { spellLists } from './spells'
import type { CharacterSkill, FlagId, GuildList, Loresheet, OccupationalSkill, Race, Requirement, SpellList } from './types'

export * from './types'
export { RULES } from './rules'
export { characterSkills, occupationalSkills, loresheets, races, spellLists, guildLists }
export { CS_LADDERS, MAGIC_CS as MAGIC_CS_IDS } from './character-skills'
export { scriptFamilies, scriptFamilyOf } from './scripts'
export { researchCategories } from './research'
export { damageReductionBySkill, immunitiesBySkill, onlyAffects, unaffectedBySheet } from './immunities'

export const FLAG_LABELS: Record<FlagId, string> = {
  bowCompetency: 'Bow Competency',
  clawCompetency: 'Claw Competency',
  factionPermission: 'Faction or guild permission (Oathsworn)',
  awakenedRite: 'Awakened Rite of Creation',
  researchRequest: 'Research request submitted (Sage)',
}

function byId<T extends { id: string }>(items: T[]): Map<string, T> {
  return new Map(items.map((i) => [i.id, i]))
}

export const csById: Map<string, CharacterSkill> = byId(characterSkills)
export const osById: Map<string, OccupationalSkill> = byId(occupationalSkills)
export const loresheetById: Map<string, Loresheet> = byId(loresheets)
export const raceById: Map<string, Race> = byId(races)
export const spellListById: Map<string, SpellList> = byId(spellLists)
export const guildListById: Map<string, GuildList> = byId(guildLists)

/** Guilds whose Ω lists include this skill: the guilds Jack of All Trades can teach it for. */
export function joatGuilds(skillId: string): string[] {
  const lists = osById.get(skillId)?.lists ?? []
  return [...new Set(lists.flatMap((l) => (guildListById.get(l)?.jackOfAllTrades ? guildListById.get(l)!.guilds : [])))]
}

/** Guild named by an Oathsworn <X> value ("Mages Guild" or "Mages"), if it is a guild. */
export function guildOf(param: string | undefined): string | undefined {
  const name = param?.replace(/ Guild$/i, '').trim().toLowerCase()
  return guildLists.flatMap((g) => g.guilds).find((g) => g.toLowerCase() === name)
}

/** Every leaf requirement in an expression, in order. */
export function requirementLeaves(r: Requirement | undefined): Requirement[] {
  if (!r) return []
  if ('all' in r) return r.all.flatMap(requirementLeaves)
  if ('any' in r) return r.any.flatMap(requirementLeaves)
  if ('not' in r) return requirementLeaves(r.not)
  return [r]
}

/** OS ids referenced by a requirement. For learn prerequisites these are the skill's tree parents (OS-2). */
export function osIdsIn(r: Requirement | undefined): string[] {
  return requirementLeaves(r).flatMap((l) => ('os' in l ? [l.os] : []))
}
