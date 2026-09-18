import {
  csById, CS_LADDERS, FLAG_LABELS, loresheets, guildOf, joatGuilds, loresheetById, MAGIC_CS_IDS, osById, immunitiesBySkill, raceById, RULES, scriptFamilies, scriptFamilyOf,
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

/**
 * redundant: still on the card, but another held skill already covers it (shown differently from inactive).
 * dropped: taken off the card; still counts for prerequisites.
 */
export type SkillState = 'active' | 'inactive' | 'redundant' | 'replaced' | 'dropped'

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

/** Skill name with its <X> value in parentheses: "High Magic (Spellcasting)", "Oathsworn (Unicorns)". */
export const skillName = (id: string, param?: string) => {
  const name = osById.get(id)?.name ?? id
  return param ? `${name.replace(/\s*<X>\s*/, ' ').trim()} (${param})` : name
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
  for (const h of b.os) {
    if (h.source !== 'loresheet' || !h.loresheet) continue
    const offeredByHeld = b.loresheets.some((l) => loresheetById.get(l.id)?.skills.some((e) => e.os === h.id))
    if (!offeredByHeld) need.add(h.loresheet)
  }
  // Awakened <X> needs the awakened sheet for its race (the character's own race until <X> is chosen).
  for (const h of [...b.os, ...targets] as Array<{ id: string; param?: string }>) {
    if (h.id !== 'awakened') continue
    const race = h.param ?? raceById.get(b.race)?.name
    const sheet = loresheets.find((l) => l.kind === 'awakened' && l.name === `Awakened ${race}`)
    if (sheet) need.add(sheet.id)
  }
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
        if (!os.some((h) => h.id === id && h.param === param && h.card === 'loresheet')) os.push({ id, param, source: 'granted', card: 'loresheet', loresheet: l.id })
      }
    }
  }
  return os
}

/**
 * Why Jack of All Trades can't teach this skill, or undefined if it can. Needs the JoAT skill and
 * Oathsworn <guild> (bought, or granted by an NPC loresheet) for a guild whose Ω list has the skill.
 */
export function joatBlocker(os: HeldSkill[], skillId: string, hasSheet: boolean): string | undefined {
  // JoAT only comes from the Awakened Human loresheet; a used one is bought again there.
  if (!hasSheet) return 'needs the Awakened Human loresheet'
  if (skillId === 'high-magic') return 'High Magic <X> cannot be learned with Jack of All Trades'
  const guilds = joatGuilds(skillId)
  if (guilds.length === 0) return `${skillName(skillId)} is not on a Jack of All Trades (Ω) list`
  const sworn = new Set(os.filter((h) => h.id === 'oathsworn').map((h) => guildOf(h.param)))
  return guilds.some((g) => sworn.has(g)) ? undefined : `needs Oathsworn to one of: ${guilds.map((g) => `${g} Guild`).join(', ')}`
}

const CARD_NAMES = { character: 'the character card', creature: 'the special creature card', power: 'the special power card', loresheet: 'a loresheet' } as const

/** OS ids each skill counts as, through replaces and includes, transitively (REP-2b). */
/** Skills a held skill makes redundant: what it counts as, what it covers, and what those cover (Immune to Mind Effects → Immune to Sleep → Sleepless Chanting). */
function gives(id: string): Set<string> {
  const direct = new Set([id, ...coveredBy(id), ...(osById.get(id)?.covers ?? [])])
  const all = new Set([...direct].flatMap((c) => [...coveredBy(c), ...(osById.get(c)?.covers ?? [])]))
  all.delete(id)
  return all
}

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

  // One special creature at a time (C21, PR-2): essence, awakened, ritual race or changed pattern
  // ("Becoming an Awakened/Essence Creature prevents the character becoming ... any other kind of Special Creature").
  const an = (w: string) => `${/^[AEIOU]/i.test(w) ? 'an' : 'a'} ${w}`
  // An awakened loresheet on the wrong race is already an error (12.3); this checks the skill's <X>.
  for (const h of b.os) if (h.id === 'awakened' && h.param && race && h.param !== race.name) err('C21', `Awakened ${h.param} needs ${an(h.param)} character (this one is ${race.name}).`)
  const essences = b.loresheets.map((l) => loresheetById.get(l.id)).filter((ls) => ls?.kind === 'essence').map((ls) => ls!.name)
  const awakened = new Set([
    ...b.loresheets.map((l) => loresheetById.get(l.id)).filter((ls) => ls?.kind === 'awakened').map((ls) => ls!.name),
    ...b.os.filter((h) => h.id === 'awakened').map((h) => (h.param ? `Awakened ${h.param}` : 'Awakened')),
  ])
  if (awakened.size > 1 && awakened.has('Awakened')) awakened.delete('Awakened')
  const creatures = [
    ...essences, ...awakened,
    ...(race && !race.startingRace ? [race.name] : []),
    ...(b.pattern === 'magical' || (b.pattern === 'unliving' && !essences.includes('Vampire')) ? [`${b.pattern} pattern`] : []),
  ]
  if (creatures.length > 1) err('C21', `A character can only be one special creature: this one is ${creatures.join(', ')}.`)

  for (const l of b.loresheets) {
    const ls = loresheetById.get(l.id)
    if (!ls) { err('12', `Unknown loresheet "${l.id}".`); continue }
    if (ls.kind === 'essence' && !essenceTier(b, ls.id)) err('12.4', `${ls.name}: add the ${ls.tiers![0]!.name} skill to the card.`)
    if (ls.kind === 'awakened' && !b.os.some((h) => h.id === 'awakened' && `Awakened ${h.param}` === ls.name)) err('12.3', `${ls.name}: add the ${ls.name.replace(/^Awakened (.*)/, 'Awakened ($1)')} skill to the card.`)
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
      // The recorded sheet if held, otherwise any held sheet that offers the skill (Cast All Magecraft: Warlock or Circle Warden).
      const offering = loresheets.filter((l) => lsEntry(l, h))
      const ls = [loresheetById.get(h.loresheet ?? ''), ...offering].find((l) => l && heldLs.has(l.id) && lsEntry(l, h))
      const entry = ls && lsEntry(ls, h)
      if (!ls || !entry) {
        const names = offering.map((l) => l.name).join(', ')
        err('LS-3', `${name} needs a loresheet that offers it${names ? ` (${names})` : ''}.`, i)
      }
      else {
        tierOf[i] = entry.tier
        const gap = missing(entry.learn, true, i)
        if (gap) err('LS-3', `${name} (${ls.name}) needs ${gap} before it can be bought.`, i)
        const creatureTier = essenceTier(b, ls.id)
        if (entry.minType && creatureTier < entry.minType) err('LS-5', `${name} needs ${ls.tiers?.[entry.minType - 1]?.name ?? ls.name} or higher (Min. type).`, i)
      }
    } else if (h.source === 'joat') {
      // JoAT is used up and bought again each time, so a skill learned with it needs the Awakened Human sheet.
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
    } else if (h.source === 'granted' && (!h.card || h.card === 'character')) {
      err('OS-6', `${name} is granted, so it belongs on a special creature or special power card.`, i)
    }
    // 'ritual': put on the character card by a ritual, so no route or prerequisite checks.
  })

  // ---------- Status: replaced, inactive or active ----------
  const replacedBy = new Map<number, string>()
  const sheetReplaces = lsRestrictions.flatMap((r) => (r.kind === 'replaces' ? [r] : []))
  // Levelled skills: a higher <X> level replaces the lower ones (Fearsome Aspect 4 replaces 2 and 1).
  os.forEach((h, j) => {
    if (!osById.get(h.id)?.levelled) return
    const higher = os.filter((o) => o.id === h.id && Number(o.param) > Number(h.param))
      .sort((a, b) => Number(a.param) - Number(b.param))[0]
    if (higher) replacedBy.set(j, skillName(higher.id, higher.param))
  })
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
    // "Lammie or loresheet": met by a skill that came from one, or by holding a sheet that offers it
    // (Awakened <X> is bought, and its lammie is the matching awakened loresheet).
    const via = h.source === 'loresheet' || h.source === 'granted' || b.loresheets.some((l) => {
      const sheet = loresheetById.get(l.id)
      if (h.id === 'awakened') return sheet?.kind === 'awakened' && (!h.param || sheet.name === `Awakened ${h.param}`)
      return sheet?.skill === h.id || !!sheet?.skills.some((e) => e.os === h.id)
    })
    const gap = missing(s?.use, via)
    const inactive = gap ? `Needs ${gap}` : disabled.get(h.id)
    // Polyglot covers every family script; TNS left over from a family without Script Master is redundant.
    // A Druid gets standard AV only, so Armour Mastery adds nothing (L10). The Expert level keeps its Crush immunity.
    const onCharacterCard = !h.card || h.card === 'character'
    // Scripts use the Polyglot rule below; other skills are covered only by a skill with the same <X> (or none).
    const coverer = onCharacterCard && h.id !== 'translate-named-script'
      ? os.find((o, j) => j !== i && !o.dropped && !replacedBy.has(j)
        && gives(o.id).has(h.id)
        && (o.param === undefined || h.param === undefined || o.param === h.param))
      : undefined
    const alsoGranted = onCharacterCard ? os.find((o) => o !== h && o.id === h.id && o.param === h.param && o.card && o.card !== 'character') : undefined
    const redundant = h.id === 'translate-named-script' && scriptFamilyOf(h.param) && os.some((o) => o.id === 'polyglot' && !o.dropped)
      ? 'Covered by Polyglot'
      : standardArmourOnly && (h.id === 'armour-mastery' || h.id === 'armour-mastery-advanced')
        ? 'Druid: standard AV only, so no extra AV'
        : coverer ? `Covered by ${skillName(coverer.id, coverer.param)}`
          : alsoGranted ? `Also granted by ${alsoGranted.loresheet ? `the ${loresheetById.get(alsoGranted.loresheet)?.name} loresheet` : CARD_NAMES[alsoGranted.card!]}`
            : undefined
    const reason = h.dropped ? 'Off the card; still counts for prerequisites' : inactive ?? redundant
    const replaced = replacedBy.get(i)
    return {
      index: i, id: h.id, param: h.param, name: skillName(h.id, h.param), card: h.card ?? 'character',
      side: s?.side ?? 'right', tier: tierOf[i],
      state: h.dropped ? 'dropped' : replaced ? 'replaced' : inactive ? 'inactive' : redundant ? 'redundant' : 'active',
      reason, replacedBy: replaced,
    }
  })

  // ---------- Card limits (section 8.4) ----------
  // ponytail: only the character card counts toward limits; granted creature/power skills don't (unconfirmed).
  const onCard = skills.filter((s) => s.state !== 'replaced' && s.state !== 'dropped' && s.card === 'character')
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
  // Every Oathsworn counts, wherever it's held (switched off, or from an NPC/DPC loresheet); the same oath twice is one oath.
  const oaths = [...new Set(skills.filter((s) => s.id === 'oathsworn').map((s) => s.param ?? ''))]
  const factionOaths = oaths.filter((p) => factions.includes(p))
  const guildOaths = [...new Set(oaths.filter((p) => !factions.includes(p)).map((p) => guildOf(p) ?? p))]
  if (factionOaths.length > RULES.oathswornFactionCap) err('LIM-7', `Oathsworn to one faction only (this character: ${factionOaths.join(', ')}).`)
  if (guildOaths.length > RULES.oathswornGuildCap) err('LIM-7', `Oathsworn to one guild only (this character: ${guildOaths.join(', ')}).`)
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

/**
 * What the character is immune to through its working skills (active or redundant, any card), with the skills
 * that give each immunity. A skill gives its own immunities and those of the skills it replaces or includes.
 */
export function immunities(result: ValidationResult): Array<{ effect: string; limit?: string; from: string[] }> {
  const out = new Map<string, { effect: string; limit?: string; from: string[] }>()
  for (const s of result.skills.filter((x) => x.state === 'active' || x.state === 'redundant')) {
    for (const id of [s.id, ...coveredBy(s.id)]) {
      for (const entry of immunitiesBySkill[id] ?? []) {
        const [effect, limit] = entry.split('|') as [string, string | undefined]
        const seen = out.get(effect)
        if (!seen) out.set(effect, { effect, limit, from: [s.name] })
        else {
          if (!seen.from.includes(s.name)) seen.from.push(s.name)
          if (!limit) seen.limit = undefined
        }
      }
    }
  }
  return [...out.values()].sort((a, b) => a.effect.localeCompare(b.effect))
}
