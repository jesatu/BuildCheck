import {
  loresheetById, osById, osIdsIn, RULES, scriptFamilies, scriptFamilyOf,
  type LoresheetSkill, type Requirement, type Tier,
} from '../data'
import type { Build, HeldSkill } from './build'
import { coveredBy, describe, skillName, validate, type ValidationResult } from './validate'

// Route planner (reference doc 8.2, 8.3, 8.8). Turns target skills into a year-by-year purchase plan.
// With an unlimited OSP pool, plans differ only in route choice (buy / loresheet / Architect) and
// "one of" prerequisites, so we enumerate those alternatives and schedule each one.

export type Route = 'buy' | 'loresheet' | 'architect'

export interface Target { id: string; param?: string }

export interface PlanOptions {
  /** The character follows a retirement: 2 double steps on different trees in year 1 (RET-3, RET-3a). */
  retired?: boolean
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

  const heldNow = (id: string, param?: string) =>
    build.os.some((h) => (h.id === id && paramMatches(param, h.param)) || ((param === undefined || param === ANY) && coveredBy(h.id).has(id)))

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
      return entry && (!entry.minType || (l.tier ?? 0) >= entry.minType) ? [{ ls: l.id, entry }] : []
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
      options.push({ key, id, param, route: 'loresheet', loresheet: ls, cost: entry.cost, tier: entry.tier, learn: entry.learn })
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
function schedule(alt: Alt, build: Build, opts: PlanOptions): Plan {
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
  const year = new Map<string, number>()
  for (let y = 1; year.size < items.length; y++) {
    if (y > items.length + 1) break // unreachable unless preds form a cycle
    const ready = items
      .filter((i) => !year.has(i.key) && !doubled.has(i.key) && [...preds.get(i.key)!].every((p) => (year.get(p) ?? Infinity) < y))
      .sort((a, b) => Number(isDoubleParent(b)) - Number(isDoubleParent(a)) || heightOf(b.key) - heightOf(a.key) || a.cost - b.cost)
    let slots: number = RULES.purchasesPerYear
    for (const i of ready) {
      if (countsYearly(i)) { if (slots === 0) continue; slots-- }
      year.set(i.key, y)
      for (const [c, p] of doubled) if (p === i.key && y === 1) year.set(c, y)
    }
    // A double step whose parent missed year 1 becomes a normal purchase.
    if (y === 1) for (const c of [...doubled.keys()]) if (!year.has(c)) doubled.delete(c)
  }

  const purchases: PlannedPurchase[] = items.map((i) => {
    const s = osById.get(i.id)!
    const notes: string[] = []
    if (i.route === 'buy' && s.restricted) notes.push('Restricted: needs a training facility, tutor or forgery')
    if (s.mainEventOnly) notes.push('Main event only')
    if (i.param === ANY || i.param?.startsWith(`${ANY}:`)) notes.push('Choose any value for <X>')
    return {
      year: year.get(i.key) ?? 0, id: i.id, param: i.param, name: displayName(i.id, i.param), route: i.route,
      loresheet: i.loresheet, cost: i.cost, tier: i.tier, countsTowardYearly: countsYearly(i) && !doubled.has(i.key),
      doubleStep: doubled.has(i.key) || undefined, notes,
    }
  }).sort((a, b) => a.year - b.year || a.name.localeCompare(b.name))

  const finalBuild: Build = {
    ...build,
    os: [...build.os, ...purchases.map((p): HeldSkill => ({ id: p.id, param: concreteParam(p.id, p.param), source: p.route, loresheet: p.loresheet }))],
  }
  return {
    purchases,
    years: Math.max(0, ...purchases.map((p) => p.year)),
    totalOsp: purchases.reduce((n, p) => n + p.cost, 0),
    blockers: [...alt.blockers],
    validation: validate(finalBuild),
  }
}

function displayName(id: string, param?: string) {
  if (param === ANY) return skillName(id, '(your choice)')
  if (param?.startsWith(`${ANY}:`)) return skillName(id, `(any ${param.slice(ANY.length + 1)} script)`)
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
