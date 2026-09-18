import {
  csById, CS_LADDERS, FLAG_LABELS, loresheets, guildOf, joatGuilds, loresheetById, MAGIC_CS_IDS, osById, raceById, RULES, scriptFamilies, scriptFamilyOf,
  type Loresheet, type LoresheetSkill, type OccupationalSkill, type Requirement, type Tier,
} from '../data'
import { factions } from '../data/races'
import type { Build, CardId, HeldSkill } from './build'

// Checks a finished build (reference doc section 14). Route and timing rules belong to the planner.

export type Severity = 'error' | 'warning'

export interface Issue {
  rule: string
  severity: Severity
  message: string
  /** Index into build.os, when the issue is about one skill. */
  skill?: number
}

/** redundant: still on the card, but another held skill already covers it (shown differently from inactive). */
export type SkillState = 'active' | 'inactive' | 'redundant' | 'replaced'

export interface SkillStatus {
  index: number
  id: string
  param?: string
  name: string
  card: CardId
  side: OccupationalSkill['side']
  tier?: Tier
  state: SkillState
  /** Why the skill is inactive (missing use requirement) or redundant (what covers it). */
  reason?: string
  /** Name of the skill that replaced this one. */
  replacedBy?: string
}

export interface Derived {
  csPoints: { spent: number; available: number }
  baseLhv: number
  lhv: number
  spellPower: { base: number; total: number; cap: number }
  powerRating: { carried: number; limit: number }
}

export interface ValidationResult {
  valid: boolean
  issues: Issue[]
  skills: SkillStatus[]
  derived: Derived
}

export const skillName = (id: string, param?: string) => {
  const name = osById.get(id)?.name ?? id
  return param ? name.replace('<X>', param) : name
}

/** Plain-English description of a requirement, e.g. "Spellcasting 2 CS". */
export function describe(r: Requirement): string {
  if ('os' in r) return skillName(r.os, r.param)
  if ('cs' in r) return `${csById.get(r.cs)?.name ?? r.cs}${r.level && r.level > 1 ? ` ${r.level}` : ''} CS`
  if ('flag' in r) return FLAG_LABELS[r.flag]
  if ('loresheet' in r) return r.loresheet === '*' ? 'a lammie or loresheet' : `${loresheetById.get(r.loresheet)?.name} loresheet`
  if ('pattern' in r) return `a ${r.pattern} pattern`
  if ('all' in r) return r.all.map(describe).join(' and ')
  if ('any' in r) return `one of: ${r.any.map(describe).join(', ')}`
  return `not ${describe(r.not)}`
}

/** An essence creature's tier: the highest tier skill on the card (e.g. vampire-2), else the loresheet's recorded tier. */
export function essenceTier(b: Build, loresheetId: string): number {
  const fromCard = b.os.map((h) => h.id.match(new RegExp(`^${loresheetId}-([1-4])$`))).filter(Boolean).map((m) => Number(m![1]))
  return Math.max(0, ...fromCard) || (b.loresheets.find((l) => l.id === loresheetId)?.tier ?? 0)
}

/** Loresheets the build needs but doesn't hold: race, pattern, loresheet-only skills, and their own requirements. */
export function missingLoresheets(b: Build, targets: Array<{ id: string }> = []): string[] {
  const need = new Set<string>()
  const race = raceById.get(b.race)
  if (race && !race.startingRace && race.loresheet) need.add(race.loresheet)
  if (b.pattern === 'magical') need.add('magical-pattern')
  if (b.pattern === 'unliving') need.add('unliving')
  for (const h of b.os) if (h.source === 'loresheet' && h.loresheet) need.add(h.loresheet)
  for (const t of targets) {
    const s = osById.get(t.id)
    const sheets = loresheets.filter((l) => l.skills.some((e) => e.os === t.id))
    if (s?.loresheetOnly && sheets.length === 1) need.add(sheets[0]!.id)
  }
  for (const id of [...need, ...b.loresheets.map((l) => l.id)]) {
    for (const r of loresheetById.get(id)?.restrictions ?? []) if (r.kind === 'requiresLoresheet') need.add(r.loresheet)
  }
  return [...need].filter((id) => !b.loresheets.some((l) => l.id === id))
}

/** The build's skills plus those granted by held loresheets (Paladin → Dedicated Follower, NPC/DPC → Oathsworn <X>). */
export function withGrants(b: Build): HeldSkill[] {
  const os: HeldSkill[] = [...b.os]
  for (const l of b.loresheets) {
    for (const r of loresheetById.get(l.id)?.restrictions ?? []) {
      if (r.kind !== 'grantsSkills') continue
      const param = r.withParam ? l.param : undefined
      for (const id of r.skills) {
        if (!os.some((h) => h.id === id && h.param === param)) os.push({ id, param, source: 'granted', card: 'loresheet', loresheet: l.id })
      }
    }
  }
  return os
}

/**
 * Why Jack of All Trades can't teach this skill, or undefined if it can. Needs the JoAT skill and
 * Oathsworn <guild> (bought, or granted by an NPC loresheet) for a guild whose Ω list has the skill.
 */
export function joatBlocker(os: HeldSkill[], skillId: string, canBuyJoat = false): string | undefined {
  if (!canBuyJoat && !os.some((h) => h.id === 'jack-of-all-trades')) return 'needs Jack of All Trades'
  if (skillId === 'high-magic') return 'High Magic <X> cannot be learned with Jack of All Trades'
  const guilds = joatGuilds(skillId)
  if (guilds.length === 0) return `${skillName(skillId)} is not on a Jack of All Trades (Ω) list`
  const sworn = new Set(os.filter((h) => h.id === 'oathsworn').map((h) => guildOf(h.param)))
  return guilds.some((g) => sworn.has(g)) ? undefined : `needs Oathsworn to one of: ${guilds.map((g) => `${g} Guild`).join(', ')}`
}

/** OS ids each skill counts as, through replaces and includes, transitively (REP-2b). */
const covers = new Map<string, Set<string>>()
export function coveredBy(id: string): Set<string> {
  let set = covers.get(id)
  if (set) return set
  set = new Set()
  covers.set(id, set)
  const s = osById.get(id)
  for (const x of [...(s?.replaces ?? []), ...(s?.includes ?? [])]) {
    set.add(x)
    for (const y of coveredBy(x)) set.add(y)
  }
  return set
}

export function validate(input: Build): ValidationResult {
  const issues: Issue[] = []
  const err = (rule: string, message: string, skill?: number) => issues.push({ rule, severity: 'error', message, skill })
  const warn = (rule: string, message: string, skill?: number) => issues.push({ rule, severity: 'warning', message, skill })

  const b = input
  const heldLs = new Map(b.loresheets.map((l) => [l.id, l]))
  const lsRestrictions = b.loresheets.flatMap((l) => loresheetById.get(l.id)?.restrictions ?? [])

  const os = withGrants(b)

  const csLevel = (id: string) => b.cs[id] ?? 0
  /** `except`: index of the skill being checked, so it can't satisfy its own prerequisite. */
  const holds = (id: string, param?: string, except?: number) =>
    os.some((h, i) => i !== except &&
      ((h.id === id && (param === undefined || h.param === param)) || (param === undefined && coveredBy(h.id).has(id))))

  /** Returns undefined if met, otherwise a description of what is missing. */
  const missing = (r: Requirement | undefined, viaLoresheet = false, except?: number): string | undefined => {
    if (!r) return undefined
    if ('os' in r) return holds(r.os, r.param, except) ? undefined : describe(r)
    if ('cs' in r) return csLevel(r.cs) >= (r.level ?? 1) ? undefined : describe(r)
    if ('flag' in r) return b.flags.includes(r.flag) ? undefined : describe(r)
    if ('loresheet' in r) return (r.loresheet === '*' ? viaLoresheet : heldLs.has(r.loresheet)) ? undefined : describe(r)
    if ('pattern' in r) return b.pattern === r.pattern ? undefined : describe(r)
    if ('all' in r) {
      const gaps = r.all.map((x) => missing(x, viaLoresheet, except)).filter(Boolean)
      return gaps.length ? gaps.join(' and ') : undefined
    }
    if ('any' in r) return r.any.some((x) => !missing(x, viaLoresheet, except)) ? undefined : describe(r)
    return missing(r.not, viaLoresheet, except) ? undefined : `no ${describe(r.not)}`
  }

  // ---------- Character Skills ----------
  const age = b.age ?? 99
  const available = age < 5 ? RULES.childPoints.under5 : age < 10 ? RULES.childPoints.age5to9 : RULES.characterPoints
  let spent = 0
  for (const [id, level] of Object.entries(b.cs)) {
    const cs = csById.get(id)
    if (!cs) { err('CS-1', `Unknown Character Skill "${id}".`); continue }
    const cost = cs.levelCosts[level - 1]
    if (cost === undefined || level < 1) { err('CS-3', `${cs.name} has no level ${level}.`); continue }
    spent += cost
    const gap = missing(cs.requires) // A3 ruling: Ritual Magic needs a magic CS
    if (gap) err('CS-7', `${cs.name} needs ${gap}.`)
  }
  if (spent > available) err('CS-1', `Character Skills cost ${spent} points; only ${available} are available.`)
  if (MAGIC_CS_IDS.filter((id) => csLevel(id) >= 2).length > RULES.maxLevel2MagicCs) err('CS-6', 'Only one magic Character Skill can be at level 2.')
  for (const ladder of CS_LADDERS) {
    const held = ladder.skills.filter((id) => csLevel(id))
    if (held.length > 1) err('CS-8', `Only one ${ladder.name} skill can be held; the higher one replaces the lower: ${held.map((id) => csById.get(id)!.name).join(', ')}.`)
  }

  // Children (section 5)
  if (age < 10) {
    const banned = ['large-weapon', 'projectile-weapon', 'missile-weapon', 'heavy-armour', 'ritual-magic', 'contribute']
    for (const id of banned) if (csLevel(id)) err('CH', `${csById.get(id)!.name} is not available to children aged 5–9.`)
    if (csLevel('body-development') >= 2) err('CH', 'Body Development 2 is not available to children aged 5–9.')
  } else if (age < 16) {
    if (csLevel('ritual-magic') >= 2) err('CH', 'Ritual Magic 2 and 3 are not available under 16.')
    if (age < 13 && csLevel('projectile-weapon')) err('CH', 'Projectile Weapon Use needs age 13 or over.')
  }

  // ---------- Race, pattern and loresheets ----------
  const race = raceById.get(b.race)
  if (!race) err('3.1', `Unknown race "${b.race}".`)
  else if (!race.startingRace && !heldLs.has(race.loresheet ?? '')) err('3.1', `${race.name} needs the ${race.name} loresheet.`)
  for (const r of lsRestrictions) {
    if (r.kind === 'setsRace' && r.race !== b.race) err('3.1', `The ${raceById.get(r.race)?.name} loresheet sets the race to ${raceById.get(r.race)?.name}.`)
  }
  const patternSources = lsRestrictions.filter((r) => r.kind === 'setsPattern').map((r) => r.pattern)
  if (b.pattern !== 'living' && !patternSources.includes(b.pattern)) err('A13', `A ${b.pattern} pattern needs a pattern loresheet.`)
  if (patternSources.some((p) => p !== b.pattern)) err('A13', `A held loresheet sets the pattern to ${patternSources.find((p) => p !== b.pattern)}.`)

  for (const l of b.loresheets) {
    const ls = loresheetById.get(l.id)
    if (!ls) { err('12', `Unknown loresheet "${l.id}".`); continue }
    if (ls.kind === 'essence' && !essenceTier(b, ls.id)) err('12.4', `${ls.name}: add the ${ls.tiers![0]!.name} skill to the card.`)
    if (ls.param && !l.param) err('12', `${ls.name} needs a value for <X> (${ls.param}).`)
    for (const r of ls.restrictions) {
      if (r.kind === 'requiresLoresheet' && !heldLs.has(r.loresheet)) err('12.4', `${ls.name} needs the ${loresheetById.get(r.loresheet)?.name} loresheet.`)
      if (r.kind === 'requiresRace' && r.race !== b.race) err('12.3', `${ls.name} is only for ${raceById.get(r.race)?.name} characters.`)
      if (r.kind === 'requiresCs' && !r.cs.some((c) => csLevel(c))) err('12.7', `${ls.name} needs one of: ${r.cs.map((c) => csById.get(c)?.name).join(', ')}.`)
      if (r.kind === 'excludesCs') for (const c of r.cs) if (csLevel(c)) err('12.7', `${ls.name} is not available with ${csById.get(c)?.name}.`)
      if (r.kind === 'noBenefitFrom') {
        const wasted = r.items.filter((x) => csLevel(x) || holds(x)).map((x) => csById.get(x)?.name ?? skillName(x))
        if (wasted.length) warn('12.4', `${ls.name}: no benefit from ${wasted.join(', ')}.`)
      }
    }
  }

  // ---------- Occupational Skills: how each was obtained ----------
  const tierOf: (Tier | undefined)[] = []
  os.forEach((h, i) => {
    const s = osById.get(h.id)
    const name = skillName(h.id, h.param)
    if (!s) { err('OS-4', `Unknown Occupational Skill "${h.id}".`, i); return }
    if (s.param && !h.param) err('OS-3', `${s.name} needs a value for <X> (${s.param}).`, i)
    tierOf[i] = s.tier

    if (h.source === 'buy') {
      if (s.loresheetOnly || s.lists.length === 0) err('OS-6', `${name} can only be gained from a lammie or loresheet.`, i)
      const gap = missing(s.learn, false, i)
      if (gap) err('OS-4', `${name} needs ${gap} before it can be bought.`, i)
      if (h.id === 'script-master' && h.param) {
        if (!scriptFamilies[h.param]) err('OS-3', `"${h.param}" is not a script category.`, i)
        else if (!os.some((o) => o.id === 'translate-named-script' && scriptFamilyOf(o.param) === h.param)) {
          err('OS-4', `${name} needs a Translate Named Script skill from the ${h.param} family.`, i)
        }
      }
    } else if (h.source === 'loresheet') {
      const ls = loresheetById.get(h.loresheet ?? '')
      const entry = ls && lsEntry(ls, h)
      if (!ls || !heldLs.has(ls.id)) err('LS-3', `${name} is bought from the ${ls?.name ?? h.loresheet ?? '?'} loresheet, which the character doesn't hold.`, i)
      else if (!entry) err('LS-3', `${name} is not on the ${ls.name} loresheet.`, i)
      else {
        tierOf[i] = entry.tier
        const gap = missing(entry.learn, true, i)
        if (gap) err('LS-3', `${name} (${ls.name}) needs ${gap} before it can be bought.`, i)
        const creatureTier = essenceTier(b, ls.id)
        if (entry.minType && creatureTier < entry.minType) err('LS-5', `${name} needs ${ls.name} tier ${entry.minType} or higher.`, i)
      }
    } else if (h.source === 'joat') {
      // JoAT is used up, so a skill learned with it only needs a JoAT source: held, or the Awakened Human sheet.
      const blocker = joatBlocker(os, h.id, heldLs.has('awakened-human'))
      if (blocker) err('JoAT', `${name} through Jack of All Trades: ${blocker}.`, i)
      const gap = missing(s.learn, false, i)
      if (gap) err('OS-4', `${name} needs ${gap} before it can be bought.`, i)
    } else if (h.source === 'architect') {
      if (!heldLs.has('architect')) err('LS-4a', `${name} uses the Architect route, but the character doesn't hold the Architect loresheet.`, i)
      const onList = !s.loresheetOnly && s.lists.length > 0
      const onHeldSheet = b.loresheets.some((l) => { const ls = loresheetById.get(l.id); return ls && lsEntry(ls, h) })
      if (!onList && !onHeldSheet) err('LS-4a', `${name} is not available to this character, so Architect can't bypass to it.`, i)
      if ((s.tier ?? 5) > RULES.architectMaxTier) err('LS-4a', `${name} is Tier ${s.tier}; Architect only reaches Tier ${RULES.architectMaxTier}.`, i)
    } else if (!h.card || h.card === 'character') {
      err('OS-6', `${name} is granted, so it belongs on a special creature or special power card.`, i)
    }
  })

  // ---------- Status: replaced, inactive or active ----------
  const replacedBy = new Map<number, string>()
  const sheetReplaces = lsRestrictions.flatMap((r) => (r.kind === 'replaces' ? [r] : []))
  os.forEach((h) => {
    const extra = sheetReplaces.filter((r) => r.skill === h.id).flatMap((r) => r.replaces)
    for (const r of [...(osById.get(h.id)?.replaces ?? []), ...extra]) {
      os.forEach((o, j) => {
        // Script Master <family> replaces the TNS skills in that family; other parameterised skills match on the same <X>.
        const sameX = h.id === 'script-master' ? scriptFamilyOf(o.param) === h.param
          : o.param === undefined || h.param === undefined || o.param === h.param
        if (o.id === r && sameX) replacedBy.set(j, skillName(h.id, h.param))
      })
    }
  })

  const standardArmourOnly = lsRestrictions.some((r) => r.kind === 'standardArmourOnly')
  const disabled = new Map<string, string>()
  for (const r of lsRestrictions) {
    if (r.kind === 'csDisablesSkills' && csLevel(r.cs)) for (const x of r.skills) disabled.set(x, `${csById.get(r.cs)?.name} CS turns it off`)
  }

  const skills: SkillStatus[] = os.map((h, i) => {
    const s = osById.get(h.id)
    const via = h.source === 'loresheet' || h.source === 'granted'
    const gap = missing(s?.use, via)
    const inactive = gap ? `Needs ${gap}` : disabled.get(h.id)
    // Polyglot covers every family script; TNS left over from a family without Script Master is redundant.
    // A Druid gets standard AV only, so Armour Mastery adds nothing (L10). The Expert level keeps its Crush immunity.
    const redundant = h.id === 'translate-named-script' && scriptFamilyOf(h.param) && holds('polyglot', undefined, i)
      ? 'Covered by Polyglot'
      : standardArmourOnly && (h.id === 'armour-mastery' || h.id === 'armour-mastery-advanced')
        ? 'Druid: standard AV only, so no extra AV' : undefined
    const reason = inactive ?? redundant
    const replaced = replacedBy.get(i)
    return {
      index: i, id: h.id, param: h.param, name: skillName(h.id, h.param), card: h.card ?? 'character',
      side: s?.side ?? 'right', tier: tierOf[i],
      state: replaced ? 'replaced' : inactive ? 'inactive' : redundant ? 'redundant' : 'active',
      reason, replacedBy: replaced,
    }
  })

  // ---------- Card limits (section 8.4) ----------
  // ponytail: only the character card counts toward limits; granted creature/power skills don't (unconfirmed).
  const onCard = skills.filter((s) => s.state !== 'replaced' && s.card === 'character')
  const seen = new Set<string>()
  for (const s of onCard) {
    const k = `${s.id}|${s.param ?? ''}`
    if (seen.has(k)) err('OS-3', `${s.name} is listed more than once.`, s.index)
    seen.add(k)
  }
  const counted = onCard.filter((s) => osById.get(s.id)?.countsTowardLimit)
  if (counted.length > RULES.cardLimit) err('LIM-1', `${counted.length} Occupational Skills on the right side; the limit is ${RULES.cardLimit}.`)
  const t5 = onCard.filter((s) => s.tier === 5).length
  if (t5 > RULES.tier5Cap) err('LIM-2', `${t5} Tier 5 skills; the limit is ${RULES.tier5Cap}.`)
  if (onCard.filter((s) => osById.get(s.id)?.paragon).length > RULES.paragonCap) err('LIM-3', 'Only one Paragon skill is allowed.')

  const incomeWeight = onCard.reduce((n, s) => n + (RULES.incomeWeights[s.id] ?? 0), 0)
  if (incomeWeight > RULES.incomeWeightCap) err('LIM-5', 'Too many income skills: the limit is 4 Apprentice, 2 Journeyman, 1 Master, or 2 Apprentice + 1 Journeyman.')
  const research = onCard.filter((s) => s.id === 'scholar' || s.id === 'sage')
  if (research.length > RULES.researchCap || research.filter((s) => s.id === 'sage').length > RULES.sageCap) {
    err('LIM-6', 'Research skills: at most 2 Scholar, or 1 Sage and 1 Scholar.')
  }
  const oaths = onCard.filter((s) => s.id === 'oathsworn')
  const factionOaths = oaths.filter((s) => factions.includes(s.param ?? '')).length
  if (factionOaths > RULES.oathswornFactionCap || oaths.length - factionOaths > RULES.oathswornGuildCap) {
    err('LIM-7', 'At most one faction Oathsworn and one guild Oathsworn.')
  }
  if (holds('treewalker') || heldLs.has('treewalker')) {
    warn('L11', 'Treewalker: the handbook and the Treewalker loresheet give different requirements. Both are applied: Ritual Magic or Perform Transport Rite, and Spellcasting, Incantation or Healing CS; not Corruption, Necromancy or an Unliving pattern.')
  }
  if (holds('improved-ritual-of-peace') && t5 > 0) warn('EX-6', 'Improved Ritual of Peace does nothing while the character has a Tier 5 skill.')

  // Mutual exclusions (8.6, MG-5)
  for (const s of onCard) {
    for (const x of osById.get(s.id)?.excludes ?? []) {
      const other = onCard.find((o) => o.id === x)
      if (other && s.index < other.index) err('EX', `${s.name} cannot be held with ${other.name}.`, other.index)
    }
  }

  // ---------- Derived values (section 6) ----------
  const noBenefit = new Set(lsRestrictions.flatMap((r) => (r.kind === 'noBenefitFrom' ? r.items : [])))
  const isActive = (id: string) => skills.some((s) => s.state === 'active' && (s.id === id || coveredBy(s.id).has(id)))

  const bd = noBenefit.has('body-development') ? 0 : csLevel('body-development')
  const baseLhv = Math.min(RULES.baseLhvCap, 1 + bd + (isActive('base-lhv-1') && !noBenefit.has('base-lhv-1') ? 1 : 0))
  const lhvBonus = isActive('lhv-2') ? 2 : isActive('lhv-1') ? 1 : 0
  const lhv = Math.min(baseLhv * 2, baseLhv + lhvBonus)

  const csPower = MAGIC_CS_IDS.map((id) => RULES.csSpellPower[csLevel(id)] ?? 0)
  // A1 ruling: only the highest magic CS grant counts as base; +Base Power adds on top.
  const basePower = Math.max(...csPower) + csLevel('base-power') * RULES.basePowerPerLevel
  const osPower = [16, 12, 8, 4].find((n) => isActive(`spell-power-${n}`)) ?? 0
  const warlockTier = heldLs.has('warlock') ? essenceTier(b, 'warlock') : 0
  const warlockPower = warlockTier ? loresheetById.get('warlock')!.tiers![warlockTier - 1]!.extraSpellPower ?? 0 : 0
  // ponytail: Warlock power is added outside the Rule of Double cap ("stacks with other sources"); unconfirmed.
  const spellPower = { base: basePower, total: Math.min(basePower * 2, basePower + osPower) + warlockPower, cap: basePower * 2 }

  const essencePr = b.loresheets.reduce((n, l) => n + (loresheetById.get(l.id)?.tiers?.[essenceTier(b, l.id) - 1]?.powerRating ?? 0), 0)
  const prLimit = RULES.powerRatingLimit + (isActive('bonus-pr-2') ? 2 : isActive('bonus-pr-1') ? 1 : 0)
  if (essencePr > prLimit) err('PR-1', `Essence creature Power Rating ${essencePr} is over the limit of ${prLimit}.`)

  if (isActive('fearsome-aspect') && spellPower.total === 0) {
    warn('A12', 'Fearsome Aspect needs Spell Power, and the character has none.')
  }

  return {
    valid: !issues.some((i) => i.severity === 'error'),
    issues,
    skills,
    derived: {
      csPoints: { spent, available },
      baseLhv, lhv, spellPower,
      powerRating: { carried: essencePr, limit: prLimit },
    },
  }
}

function lsEntry(ls: Loresheet, h: HeldSkill): LoresheetSkill | undefined {
  return ls.skills.find((e) => e.os === h.id && (e.param === undefined || e.param === h.param))
}
