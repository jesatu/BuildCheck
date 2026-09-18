import {
  loresheetById, osById, osIdsIn, RULES, scriptFamilies, scriptFamilyOf,
  type LoresheetSkill, type Requirement, type Tier,
} from '../data'
import { addLoresheets, skillKey, type Build, type HeldSkill } from './build'
import { coveredBy, describe, essenceTier, joatBlocker, skillName, validate, withGrants, type ValidationResult } from './validate'

// Route planner (reference doc 8.2, 8.3, 8.8). Turns target skills into a year-by-year purchase plan.
// With an unlimited OSP pool, plans differ only in route choice (buy / loresheet / Architect) and
// "one of" prerequisites, so we enumerate those alternatives and schedule each one.

export type Route = 'buy' | 'loresheet' | 'architect' | 'joat'

export interface Target { id: string; param?: string }

export interface PlanOptions {
  /** The character follows a retirement: 2 double steps on different trees in year 1 (RET-3, RET-3a). */
  retired?: boolean
  /** Skills (skillKey) to take off the finished card; they still count for prerequisites. */
  drop?: string[]
  /** Book all 4 events together each season: prebook tier advancement (C20). */
  prebook?: boolean
}

export interface PlannedPurchase {
  year: number
  id: string
  param?: string
  name: string
  route: Route
  loresheet?: string
  cost: number
  tier?: Tier
  /** Uses one of the 4 purchases that year (OS-1). */
  countsTowardYearly: boolean
  /** Bought in the same year as its prerequisite, as a retirement double step. */
  doubleStep?: boolean
  /** One of the season's 4 purchases, all made at prebook so one can be advanced (C20). */
  prebook?: boolean
  /** Prebook tier advancement: a 5th purchase, the next level of one of that season's prebook purchases (C20). */
  advanced?: boolean
  notes: string[]
}

export interface Plan {
  purchases: PlannedPurchase[]
  years: number
  totalOsp: number
  /** Things the planner can't buy: Character Skills, competencies, loresheets, pattern. */
  blockers: string[]
  validation: ValidationResult
}

export interface PlanResult {
  cheapest?: Plan
  fastest?: Plan
  /** True when the cheapest and fastest plans differ in cost or years. */
  diverges: boolean
}

interface Acq {
  key: string
  id: string
  param?: string
  route: Route
  loresheet?: string
  cost: number
  tier?: Tier
  /** Learn requirement for the chosen route (Architect: none). */
  learn?: Requirement
  /** Note printed on the loresheet for this skill. */
  note?: string
}

interface Alt { items: Map<string, Acq>; blockers: Set<string>; depth: number }

const ANY = 'any'
const keyOf = (id: string, param?: string) => (param ? `${id}|${param}` : id)
const empty = (): Alt => ({ items: new Map(), blockers: new Set(), depth: 0 })
// ponytail: alternatives capped per expansion step; raise if real builds lose options.
const MAX_ALTS = 60

export function planRoute(build: Build, targets: Target[], opts: PlanOptions = {}): PlanResult {
  const heldLs = new Map(build.loresheets.map((l) => [l.id, l]))
  const hasArchitect = heldLs.has('architect')

  const paramMatches = (want: string | undefined, have: string | undefined) =>
    want === undefined || want === ANY || want === have ||
    (want.startsWith(`${ANY}:`) && scriptFamilyOf(have) === want.slice(ANY.length + 1))

  const held = withGrants(build)
  const heldNow = (id: string, param?: string) =>
    held.some((h) => (h.id === id && paramMatches(param, h.param)) || ((param === undefined || param === ANY) && coveredBy(h.id).has(id)))

  const leafMet = (r: Requirement): boolean => {
    if ('cs' in r) return (build.cs[r.cs] ?? 0) >= (r.level ?? 1)
    if ('flag' in r) return build.flags.includes(r.flag)
    if ('loresheet' in r) return r.loresheet === '*' ? build.loresheets.length > 0 : heldLs.has(r.loresheet)
    if ('pattern' in r) return build.pattern === r.pattern
    return false
  }

  /** Loresheet entries the character can buy this skill from. */
  const loresheetRoutes = (id: string, param?: string): Array<{ ls: string; entry: LoresheetSkill }> =>
    build.loresheets.flatMap((l) => {
      const entry = loresheetById.get(l.id)?.skills.find((e) => e.os === id && (e.param === undefined || paramMatches(param, e.param)))
      return entry && (!entry.minType || essenceTier(build, l.id) >= entry.minType) ? [{ ls: l.id, entry }] : []
    })

  // A prerequisite with no <X> inherits the parent's <X> when both use the same kind of parameter
  // (Journeyman <Smith> needs Apprentice <Smith>); otherwise any value will do.
  const leafParam = (leaf: { os: string; param?: string }, parentId: string, parentParam?: string) => {
    if (leaf.param) return leaf.param
    const leafSkill = osById.get(leaf.os)
    if (!leafSkill?.param) return undefined
    if (parentId === 'script-master' && parentParam && parentParam !== ANY) return `${ANY}:${parentParam}`
    return osById.get(parentId)?.param === leafSkill.param && parentParam ? parentParam : ANY
  }

  const expandOs = (id: string, param: string | undefined, stack: string[]): Alt[] => {
    if (heldNow(id, param)) return [empty()]
    const key = keyOf(id, param)
    if (stack.includes(key)) return []
    const s = osById.get(id)
    if (!s) return [{ ...empty(), blockers: new Set([`unknown skill ${id}`]) }]

    const options: Acq[] = []
    if (!s.loresheetOnly && s.lists.length > 0) options.push({ key, id, param, route: 'buy', cost: s.cost!, tier: s.tier, learn: s.learn })
    for (const { ls, entry } of loresheetRoutes(id, param)) {
      options.push({ key, id, param, route: 'loresheet', loresheet: ls, cost: entry.cost, tier: entry.tier, learn: entry.learn, note: entry.note })
    }
    const lsEntry = loresheetRoutes(id, param)[0]?.entry
    if (hasArchitect && (options.length > 0) && (s.tier ?? lsEntry?.tier ?? 5) <= RULES.architectMaxTier) {
      options.push({ key, id, param, route: 'architect', cost: s.cost ?? lsEntry!.cost, tier: s.tier ?? lsEntry?.tier })
    }
    if (options.length === 0) return [{ ...empty(), blockers: new Set([`${skillName(id, param)} is not available to this character`]) }]

    return pareto(options.flatMap((acq) =>
      expandReq(acq.learn, id, param, [...stack, key]).map((sub) => {
        const items = new Map(sub.items)
        items.set(key, acq)
        return { items, blockers: sub.blockers, depth: sub.depth + 1 }
      })))
  }

  const expandReq = (r: Requirement | undefined, parentId: string, parentParam: string | undefined, stack: string[]): Alt[] => {
    if (!r) return [empty()]
    if ('os' in r) return expandOs(r.os, leafParam(r, parentId, parentParam), stack)
    if ('all' in r) {
      return r.all.reduce<Alt[]>((acc, x) => pareto(product(acc, expandReq(x, parentId, parentParam, stack))), [empty()])
    }
    if ('any' in r) return pareto(r.any.flatMap((x) => expandReq(x, parentId, parentParam, stack)))
    if ('not' in r) return [empty()] // exclusions are the validator's job
    return leafMet(r) ? [empty()] : [{ ...empty(), blockers: new Set([`needs ${describe(r)}`]) }]
  }

  const alts = pareto(targets.reduce<Alt[]>((acc, t) => pareto(product(acc, expandOs(t.id, t.param, []))), [empty()]))
  const plans = alts.map((a) => schedule(a, build, opts))
  const usable = plans.filter((p) => p.blockers.length === 0)
  const pool = usable.length ? usable : plans

  const by = (f: (p: Plan) => number, g: (p: Plan) => number) =>
    [...pool].sort((a, b) => f(a) - f(b) || g(a) - g(b))[0]
  const cheapest = by((p) => p.totalOsp, (p) => p.years)
  const fastest = by((p) => p.years, (p) => p.totalOsp)
  return {
    cheapest, fastest,
    diverges: !!cheapest && !!fastest && (cheapest.totalOsp !== fastest.totalOsp || cheapest.years !== fastest.years),
  }
}

function product(as: Alt[], bs: Alt[]): Alt[] {
  return as.flatMap((a) => bs.map((b) => {
    const items = new Map(a.items)
    for (const [k, v] of b.items) if (!items.has(k)) items.set(k, v)
    return { items, blockers: new Set([...a.blockers, ...b.blockers]), depth: Math.max(a.depth, b.depth) }
  }))
}

const altCost = (a: Alt) => [...a.items.values()].reduce((n, i) => n + i.cost, 0)

/** Keep alternatives not beaten on blockers, cost and depth (depth approximates years). */
function pareto(alts: Alt[]): Alt[] {
  const scored = alts.map((a) => ({ a, b: a.blockers.size, c: altCost(a), d: a.depth, n: a.items.size }))
  const kept = scored.filter((x) => !scored.some((y) => y !== x &&
    y.b <= x.b && y.c <= x.c && y.d <= x.d && y.n <= x.n && (y.b < x.b || y.c < x.c || y.d < x.d || y.n < x.n)))
  const seen = new Set<string>()
  return kept
    .filter((x) => { const k = [...x.a.items.values()].map((i) => `${i.key}:${i.route}`).sort().join(','); return !seen.has(k) && !!seen.add(k) })
    .sort((x, y) => x.b - y.b || x.c - y.c || x.d - y.d)
    .slice(0, MAX_ALTS)
    .map((x) => x.a)
}

/** Handbook tree ancestors of a skill (transitive learn prerequisites). */
function ancestors(id: string, seen = new Set<string>()): Set<string> {
  for (const p of osIdsIn(osById.get(id)?.learn)) if (!seen.has(p)) { seen.add(p); ancestors(p, seen) }
  return seen
}

/**
 * List scheduling, highest remaining chain first (Hu's algorithm: optimal for tree-shaped
 * prerequisites with unit-length purchases).
 * ponytail: greedy for DAGs with shared prerequisites; exact search if real builds show longer plans than needed.
 */
/** `history`: scheduling skills already bought, so their routes are fixed and Jack of All Trades isn't added. */
/** `joatCovered`: skills learned with Jack of All Trades that the held (used) JoAT paid for; every other use re-bought it. */
function schedule(alt: Alt, build: Build, opts: PlanOptions, history = false, joatCovered = 0): Plan {
  // An "any <X>" placeholder is already met by a specific version planned elsewhere (Polyglot's "any Script Master").
  const all = [...alt.items.values()]
  const items = all.filter((i) => !all.some((o) => o !== i && o.id === i.id && o.param !== ANY &&
    (i.param === ANY || (i.param?.startsWith(`${ANY}:`) && scriptFamilyOf(o.param) === i.param.slice(ANY.length + 1)))))
  const byKey = new Map(items.map((i) => [i.key, i]))

  // An item must come after any planned item that satisfies its learn requirement (chosen route),
  // and after any planned item further down its handbook tree (one step per tree per year, OS-2).
  const preds = new Map<string, Set<string>>()
  for (const i of items) {
    const needs = new Set([...osIdsIn(i.learn), ...ancestors(i.id)])
    const set = new Set<string>()
    for (const o of items) {
      // A replacing skill stands in for a learn prerequisite only when that prerequisite isn't itself planned (REP-2b),
      // and never when it sits above this skill in the tree (Polyglot can't stand in for Script Master's prerequisite).
      const standsIn = o.id !== i.id && !ancestors(o.id).has(i.id) &&
        [...coveredBy(o.id)].some((c) => osIdsIn(i.learn).includes(c) && !items.some((x) => x.id === c))
      if (o !== i && (needs.has(o.id) || standsIn)) set.add(o.key)
    }
    preds.set(i.key, set)
  }

  const height = new Map<string, number>()
  const heightOf = (k: string): number => {
    if (height.has(k)) return height.get(k)!
    height.set(k, 1) // guard: a cycle can't recurse forever
    const h = 1 + Math.max(0, ...items.filter((o) => preds.get(o.key)!.has(k)).map((o) => heightOf(o.key)))
    height.set(k, h)
    return h
  }
  items.forEach((i) => heightOf(i.key))

  const countsYearly = (i: Acq) => i.route !== 'architect' && !osById.get(i.id)?.exemptFromYearly

  // Retirement double steps: a child whose only prerequisite is a year-1 parent joins the parent's slot.
  const doubled = new Map<string, string>() // child -> parent
  if (opts.retired) {
    const roots = new Set<string>()
    const treeRoot = (k: string): string => { const p = [...preds.get(k)!][0]; return p ? treeRoot(p) : k }
    const candidates = items
      .filter((c) => preds.get(c.key)!.size === 1 && countsYearly(c))
      .map((c) => ({ c, p: [...preds.get(c.key)!][0]! }))
      .filter(({ p }) => preds.get(p)!.size === 0 && countsYearly(byKey.get(p)!))
      .sort((x, y) => heightOf(y.c.key) - heightOf(x.c.key))
    for (const { c, p } of candidates) {
      const root = treeRoot(p)
      if (doubled.size >= RULES.retirementDoubleSteps || roots.has(root) || [...doubled.values()].includes(p)) continue
      doubled.set(c.key, p)
      roots.add(root)
    }
  }

  const isDoubleParent = (i: Acq) => [...doubled.values()].includes(i.key)
  // Prebook tier advancement (C20): book all 4 events together and make all 4 purchases at prebook (T1–T3, not @),
  // and one of them can be advanced a second level straight away: a 5th purchase, not T5 and not restricted.
  const plain = (i: Acq, maxTier: number) => i.route === 'buy' && (i.tier ?? 5) <= maxTier &&
    !osById.get(i.id)?.restricted && !osById.get(i.id)?.mainEventOnly
  const prebooked = new Set<string>()
  const advanced = new Set<string>()
  const year = new Map<string, number>()
  // Skills already learned with Jack of All Trades: one use per season, and each use past the ones a held JoAT
  // paid for re-bought it that season (20 OSP, one of the 4 purchases).
  const rebuyYears = new Set<number>()
  let joatUses = 0
  for (let y = 1; year.size < items.length; y++) {
    if (y > items.length + 1) break // unreachable unless preds form a cycle
    const ready = items
      .filter((i) => !year.has(i.key) && !doubled.has(i.key) && [...preds.get(i.key)!].every((p) => (year.get(p) ?? Infinity) < y))
      .sort((a, b) => Number(isDoubleParent(b)) - Number(isDoubleParent(a)) || heightOf(b.key) - heightOf(a.key) ||
        (opts.prebook ? Number(plain(b, RULES.prebookMaxTier)) - Number(plain(a, RULES.prebookMaxTier)) : 0) || a.cost - b.cost)
    let slots: number = RULES.purchasesPerYear
    for (const i of ready) {
      const joat = i.route === 'joat', rebuy = joat && joatUses >= joatCovered
      if (joat && [...year].some(([k, v]) => v === y && byKey.get(k)?.route === 'joat')) continue
      const need = countsYearly(i) ? (rebuy ? 2 : 1) : 0
      if (need > slots) continue
      slots -= need
      if (joat) { joatUses++; if (rebuy) rebuyYears.add(y) }
      year.set(i.key, y)
      for (const [c, p] of doubled) if (p === i.key && y === 1) year.set(c, y)
    }
    // ponytail: greedy — only advances when the year's normal pick happens to be 4 prebookable skills.
    const four = items.filter((i) => year.get(i.key) === y && countsYearly(i) && !doubled.has(i.key))
    // Not in a season that uses retirement double steps (C20).
    const retirementYear = [...doubled.keys()].some((c) => year.get(c) === y)
    if (opts.prebook && !retirementYear && four.length === RULES.purchasesPerYear && four.every((i) => plain(i, RULES.prebookMaxTier))) {
      const step = items
        .filter((i) => !year.has(i.key) && !doubled.has(i.key) && plain(i, RULES.prebookAdvanceMaxTier) && countsYearly(i))
        .filter((i) => {
          const same = [...preds.get(i.key)!].filter((p) => year.get(p) === y)
          return same.length === 1 && four.some((f) => f.key === same[0]) && [...preds.get(i.key)!].every((p) => year.has(p))
        })
        .sort((a, b) => heightOf(b.key) - heightOf(a.key) || a.cost - b.cost)[0]
      if (step) { year.set(step.key, y); advanced.add(step.key); four.forEach((f) => prebooked.add(f.key)) }
    }
    // A double step whose parent missed year 1 becomes a normal purchase.
    if (y === 1) for (const c of [...doubled.keys()]) if (!year.has(c)) doubled.delete(c)
  }

  // Jack of All Trades stands in for the training facility a restricted skill needs: one use per season,
  // because using it removes it from the card. The first use can spend a JoAT already held; every other
  // use buys it from the Awakened Human loresheet (20 OSP, one of that year's purchases), so only use it
  // where a slot is free.
  const held = withGrants(build)
  // A JoAT taken off the card has been used.
  const heldJoat = held.some((h) => h.id === 'jack-of-all-trades' && !h.dropped)
  const joatSheet = build.loresheets.some((l) => l.id === 'awakened-human')
  const joatEntry = loresheetById.get('awakened-human')!.skills.find((e) => e.os === 'jack-of-all-trades')!
  const joatYears = new Set<number>()
  const viaJoat = new Set<string>()
  const slotsUsed = (y: number) => items.filter((i) => year.get(i.key) === y && countsYearly(i) && !doubled.has(i.key) && !advanced.has(i.key)).length + (rebuyYears.has(y) ? 1 : 0)
  for (const i of history ? [] : [...items].sort((a, b) => (year.get(a.key) ?? 0) - (year.get(b.key) ?? 0) || b.cost - a.cost)) {
    const y = year.get(i.key) ?? 0
    if (i.route !== 'buy' || !osById.get(i.id)?.restricted || joatYears.has(y) || joatBlocker(held, i.id, joatSheet)) continue
    const usesHeld = heldJoat && joatYears.size === 0
    if (!usesHeld) {
      if (!joatSheet || slotsUsed(y) >= RULES.purchasesPerYear) continue
      rebuyYears.add(y)
    }
    viaJoat.add(i.key)
    joatYears.add(y)
  }
  const joat = osById.get('jack-of-all-trades')!

  const purchases: PlannedPurchase[] = items.map((acq) => {
    const i: Acq = viaJoat.has(acq.key) ? { ...acq, route: 'joat' } : acq
    const s = osById.get(i.id)!
    const notes: string[] = []
    if (i.route === 'buy' && s.restricted) notes.push('Restricted: needs a training facility, tutor or forgery')
    if (i.route === 'joat') notes.push('Uses Jack of All Trades (removed from the card afterwards)')
    if (i.route === 'loresheet') notes.push('Main event only (not prebook); no training voucher needed')
    if (i.route === 'loresheet' && i.note) notes.push(i.note)
    if (s.mainEventOnly) notes.push('Main event only')
    if (i.param === ANY || i.param?.startsWith(`${ANY}:`)) notes.push('Choose any value for <X>')
    return {
      year: year.get(i.key) ?? 0, id: i.id, param: i.param, name: displayName(i.id, i.param), route: i.route,
      loresheet: i.loresheet, cost: i.cost, tier: i.tier, countsTowardYearly: countsYearly(i) && !doubled.has(i.key) && !advanced.has(i.key),
      doubleStep: doubled.has(i.key) || undefined, prebook: prebooked.has(acq.key) || undefined,
      advanced: advanced.has(acq.key) || undefined, notes,
    }
  })
  for (const y of rebuyYears) {
    purchases.push({
      year: y, id: joat.id, name: joat.name, route: 'loresheet', loresheet: 'awakened-human', cost: joatEntry.cost, tier: joatEntry.tier,
      countsTowardYearly: true, notes: ['Bought to use this season (each use removes it from the card)', 'Main event only (not prebook)'],
    })
  }
  purchases.sort((a, b) => a.year - b.year || Number(!!a.advanced) - Number(!!b.advanced) || a.name.localeCompare(b.name))

  const finalBuild: Build = {
    ...build,
    os: [...build.os, ...purchases.filter((p) => !rebuyYears.has(p.year) || p.id !== joat.id).map((p): HeldSkill => ({
      id: p.id, param: concreteParam(p.id, p.param), source: p.route, loresheet: p.loresheet,
      ...(opts.drop?.includes(skillKey(p.id, p.param)) ? { dropped: true } : {}),
    }))],
  }
  return {
    purchases,
    years: Math.max(0, ...purchases.map((p) => p.year)),
    totalOsp: purchases.reduce((n, p) => n + p.cost, 0),
    blockers: [...alt.blockers],
    validation: validate(finalBuild),
  }
}

/**
 * Add a skill to the card as already held, assuming its prerequisites were bought along the normal route
 * (the cheapest route without Architect). Prerequisites already held are kept; the rest are added.
 * Mark the skill as Architect or Ritual afterwards if it skipped its prerequisites.
 */
export function addHeldSkill(build: Build, id: string, param?: string): Build {
  const normal = { ...build, loresheets: build.loresheets.filter((l) => l.id !== 'architect') }
  const plan = planRoute(normal, [{ id, param }]).cheapest
  const bought = (plan?.purchases ?? [])
    .filter((p) => p.id !== 'jack-of-all-trades' || id === 'jack-of-all-trades')
    .map((p): HeldSkill => ({ id: p.id, param: concreteParam(p.id, p.param), source: p.route, loresheet: p.loresheet }))
  if (!bought.some((h) => h.id === id) && !build.os.some((h) => h.id === id && h.param === param)) {
    const sheet = loresheetById.get(build.loresheets.find((l) => loresheetById.get(l.id)?.skills.some((e) => e.os === id))?.id ?? '')
    bought.push(sheet ? { id, param, source: 'loresheet', loresheet: sheet.id } : { id, param, source: 'buy' })
  }
  return { ...build, os: [...build.os, ...bought] }
}

/** Add loresheets (see addLoresheets), plus the skill a skill loresheet belongs to (Circle Warden, Treewalker…). */
export function addLoresheetsAndSkills(build: Build, ids: string[]): Build {
  let next = addLoresheets(build, ids)
  for (const id of ids) {
    const skill = loresheetById.get(id)?.skill
    if (skill && !next.os.some((h) => h.id === skill)) next = addHeldSkill(next, skill)
  }
  return next
}

/**
 * What the skills already bought cost, and the fewest years it could have taken to buy them in their
 * recorded routes (4 per year, one step per tree per year). Granted and ritual skills cost nothing.
 */
export function spentSoFar(build: Build, opts: PlanOptions = {}): Plan {
  const free = (h: HeldSkill) => h.source === 'granted' || h.source === 'ritual'
  const items = new Map<string, Acq>()
  for (const h of build.os.filter((x) => !free(x))) {
    const s = osById.get(h.id)
    if (!s) continue
    const sheet = [h.loresheet, ...build.loresheets.map((l) => l.id)]
      .map((l) => loresheetById.get(l ?? '')).find((l) => l?.skills.some((e) => e.os === h.id && (e.param === undefined || e.param === h.param)))
    const entry = sheet?.skills.find((e) => e.os === h.id && (e.param === undefined || e.param === h.param))
    const route: Route = h.source === 'loresheet' || h.source === 'architect' || h.source === 'joat' ? h.source : 'buy'
    const key = keyOf(h.id, h.param)
    items.set(key, {
      key, id: h.id, param: h.param, route, loresheet: route === 'loresheet' ? sheet?.id : undefined,
      cost: (route === 'loresheet' ? entry?.cost : undefined) ?? s.cost ?? entry?.cost ?? 0,
      tier: (route === 'loresheet' ? entry?.tier : undefined) ?? s.tier ?? entry?.tier,
      learn: route === 'architect' ? undefined : route === 'loresheet' ? entry?.learn : s.learn,
    })
  }
  const base = { ...build, os: build.os.filter(free) }
  const usedJoat = build.os.some((h) => h.id === 'jack-of-all-trades' && h.dropped) ? 1 : 0
  return schedule({ items, blockers: new Set(), depth: 0 }, base, opts, true, usedJoat)
}

function displayName(id: string, param?: string) {
  if (param === ANY) return skillName(id, 'your choice')
  if (param?.startsWith(`${ANY}:`)) return skillName(id, `any ${param.slice(ANY.length + 1)} script`)
  return skillName(id, param)
}

/** Replace "any" placeholders with a real value so the final build can be validated. */
function concreteParam(id: string, param?: string) {
  const families = Object.keys(scriptFamilies)
  if (param === ANY && id === 'script-master') return families[0]
  if (id === 'translate-named-script' && (param === ANY || param?.startsWith(`${ANY}:`))) {
    const family = param === ANY ? families[0]! : param.slice(ANY.length + 1)
    return (scriptFamilies[family] ?? scriptFamilies[families[0]!]!)[0]
  }
  return param === ANY ? 'Any' : param
}
