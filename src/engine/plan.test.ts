import { describe, expect, it } from 'vitest'
import { loresheetById, occupationalSkills } from '../data'
import { newBuild, type Build, type HeldSkill } from './build'
import { addHeldSkill, addLoresheetsAndSkills, planRoute, spentSoFar, type Target } from './plan'
import { validate } from './validate'

const build = (b: Partial<Build>): Build => ({ ...newBuild(), ...b })
const t = (id: string, param?: string): Target => ({ id, param })
const summary = (b: Build, targets: Target[], opts = {}) => {
  const p = planRoute(b, targets, opts).cheapest!
  return { years: p.years, osp: p.totalOsp, steps: p.purchases.map((x) => `${x.year}:${x.name}:${x.route}`) }
}

describe('planner', () => {
  it('buys a tree one step per year', () => {
    expect(summary(build({ cs: { 'poison-lore': 1 } }), [t('create-poison-magical')])).toEqual({
      years: 4, osp: 140,
      steps: ['1:Create Poison (Novice):buy', '2:Create Poison (Artisan):buy', '3:Create Poison (Master):buy', '4:Create Poison (Magical):buy'],
    })
  })

  it('reports Character Skills it cannot buy as blockers', () => {
    expect(planRoute(newBuild(), [t('create-poison-novice')]).cheapest!.blockers).toEqual(['needs Poison Lore CS'])
  })

  it('skips skills already held, including ones covered by a replacing skill', () => {
    const b = build({ os: [{ id: 'immune-fear', source: 'buy' }, { id: 'immune-mute', source: 'buy' }, { id: 'rally', source: 'buy' }] })
    expect(summary(b, [t('immune-mind-effects')]).steps).toEqual(['1:Immune to Mind Effects:buy'])
  })

  it('fits at most 4 counted purchases in a year; income skills and Oathsworn are free', () => {
    const five = ['immune-fear', 'immune-fumble', 'tracking', 'herb-lore', 'last-rites'].map((id) => t(id))
    expect(summary(build({ cs: { incantation: 1 } }), five).years).toBe(2)
    expect(summary(build({ cs: { incantation: 1 } }), [...five.slice(0, 4), t('apprentice', 'Smith'), t('oathsworn', 'Lions')]).years).toBe(1)
  })

  it('carries <X> down income chains', () => {
    expect(summary(newBuild(), [t('master', 'Smith')]).steps).toEqual(['1:Apprentice (Smith):buy', '2:Journeyman (Smith):buy', '3:Master (Smith):buy'])
  })

  it('uses Architect to skip prerequisites, without using a yearly slot', () => {
    const b = build({ cs: { 'large-weapon': 1 }, loresheets: [{ id: 'architect' }] })
    const p = planRoute(b, [t('mighty-blow'), t('immune-fear'), t('immune-fumble'), t('tracking'), t('herb-lore')]).cheapest!
    expect(p.years).toBe(1)
    expect(p.purchases.find((x) => x.id === 'mighty-blow')).toMatchObject({ route: 'architect', cost: 40, countsTowardYearly: false })
    expect(summary(build({ cs: { 'large-weapon': 1 } }), [t('mighty-blow')]).osp).toBe(90)
  })

  it('still applies one step per tree to Architect purchases', () => {
    const b = build({ cs: { 'large-weapon': 1 }, loresheets: [{ id: 'architect' }] })
    const p = planRoute(b, [t('mighty-blow'), t('immune-repel')]).cheapest!
    expect(p.years).toBe(2)
  })

  it('uses a held loresheet route at the loresheet price', () => {
    const b = build({ cs: { 'light-armour': 1 }, loresheets: [{ id: 'paladin', tier: 1 }] })
    expect(summary(b, [t('champion')])).toEqual({ years: 1, osp: 10, steps: ['1:Champion:loresheet'] })
  })

  it('uses Jack of All Trades for one restricted skill per season', () => {
    const b = build({ loresheets: [{ id: 'awakened-human' }], os: [
      { id: 'jack-of-all-trades', source: 'loresheet', loresheet: 'awakened-human' },
      { id: 'oathsworn', param: 'Mages Guild', source: 'buy' },
    ] })
    const p = planRoute(b, [t('thaulmonic-alignment'), t('impweave-expertise')]).cheapest!
    expect(p.purchases.map((x) => `${x.year}:${x.id}:${x.route}`)).toEqual([
      '1:impweave-expertise:joat', '1:thaulmonic-alignment:buy',
    ])
    expect(p.purchases[1]!.notes).toContain('Restricted: needs a training facility, tutor or forgery')
  })

  it('re-buys Jack of All Trades from the Awakened Human sheet for 20 OSP in each later season it is used', () => {
    const b = build({
      cs: { spellcasting: 1, 'ritual-magic': 1 },
      os: [{ id: 'jack-of-all-trades', source: 'loresheet', loresheet: 'awakened-human' }],
      loresheets: [{ id: 'npc-dpc', param: 'Mages Guild' }, { id: 'awakened-human' }],
    })
    const p = planRoute(b, [t('thaulmonic-alignment'), t('ritualist-master')]).cheapest!
    expect(p.purchases.filter((x) => x.route === 'joat').map((x) => `${x.year}:${x.id}`)).toEqual(['1:thaulmonic-alignment', '4:ritualist-master'])
    expect(p.purchases.filter((x) => x.id === 'jack-of-all-trades').map((x) => `${x.year}:${x.cost}:${x.route}`)).toEqual(['4:20:loresheet'])
    expect(p.totalOsp).toBe(30 + 10 + 30 + 40 + 50 + 20)
    expect(p.validation.valid).toBe(true)
  })

  it('buys Jack of All Trades from the Awakened Human sheet when none is held; never without the sheet', () => {
    const b = build({ loresheets: [{ id: 'awakened-human' }, { id: 'npc-dpc', param: 'Mages Guild' }] })
    const p = planRoute(b, [t('thaulmonic-alignment')]).cheapest!
    expect(p.purchases.map((x) => `${x.year}:${x.id}:${x.route}:${x.cost}`)).toEqual(['1:jack-of-all-trades:loresheet:20', '1:thaulmonic-alignment:joat:30'])
    const noSheet = planRoute(build({ loresheets: [{ id: 'npc-dpc', param: 'Mages Guild' }],
      os: [{ id: 'jack-of-all-trades', source: 'granted', card: 'power' }] }), [t('thaulmonic-alignment')]).cheapest!
    expect(noSheet.purchases.map((x) => x.route)).toEqual(['buy'])
  })

  it('shows the loresheet\'s own note on a loresheet purchase (L3)', () => {
    const b = build({ race: 'ancestral', loresheets: [{ id: 'ancestral' }], os: [{ id: 'dismiss-rank-5', source: 'loresheet', loresheet: 'ancestral' }] })
    const p = planRoute(b, [t('dismiss-rank-10')]).cheapest!
    expect(p.purchases[0]).toMatchObject({ tier: 1, route: 'loresheet' })
    expect(p.purchases[0]!.notes).toContain('Printed as Tier 1 (other sheets say Tier 3): probably a loresheet error.')
  })

  it('plans essence tiers one per year from the loresheet (Vampire → Elder Vampire)', () => {
    const b = { ...newBuild(), pattern: 'unliving' as const, loresheets: [{ id: 'vampire' }, { id: 'unliving' }],
      os: [{ id: 'vampire-1', source: 'loresheet' as const, loresheet: 'vampire' }] }
    expect(summary(b, [t('vampire-3')])).toMatchObject({ years: 2, osp: 50, steps: ['1:Mature Vampire:loresheet', '2:Elder Vampire:loresheet'] })
  })

  it('plans Crushing Blow for an awakened human Oathsworn to the Militia Guild, using Jack of All Trades for the restricted step', () => {
    const b = { ...newBuild(), cs: { 'large-weapon': 1 }, flags: ['factionPermission' as const],
      loresheets: [{ id: 'awakened-human' }], os: [{ id: 'oathsworn', param: 'Militia Guild', source: 'buy' as const }] }
    const p = planRoute(b, [{ id: 'crushing-blow' }]).cheapest!
    expect(p.purchases.map((x) => `${x.year}:${x.id}:${x.route}:${x.cost}`)).toEqual([
      '1:immune-repel:buy:20', '2:immune-repel-strikedown:buy:30', '3:mighty-blow:buy:40',
      '4:crushing-blow:joat:50', '4:jack-of-all-trades:loresheet:20',
    ])
    expect(p.validation.valid).toBe(true)
  })

  it('uses retirement double steps on two different trees in year 1', () => {
    const b = build({ cs: { 'poison-lore': 1, 'potion-lore': 1 } })
    const targets = [t('create-poison-master'), t('create-potion-master'), t('shield-mastery-expert')]
    expect(summary(b, targets).years).toBe(3)
    const p = planRoute(b, targets, { retired: true }).cheapest!
    expect(p.years).toBe(2)
    const doubles = p.purchases.filter((x) => x.doubleStep)
    expect(doubles).toHaveLength(2)
    expect(new Set(doubles.map((d) => d.id.split('-')[1])).size).toBe(2) // poison and potion, not the same tree
  })

  it('counts a Jack of All Trades purchase for each use in the history, one use per season', () => {
    const b = build({
      cs: { 'large-weapon': 1 },
      loresheets: [{ id: 'awakened-human' }],
      os: [
        { id: 'oathsworn', param: 'Militia Guild', source: 'buy' },
        { id: 'jack-of-all-trades', source: 'loresheet', loresheet: 'awakened-human', dropped: true },
        { id: 'immune-fear', source: 'joat' }, { id: 'immune-fumble', source: 'joat' }, { id: 'tracking', source: 'joat' },
      ],
    })
    const p = spentSoFar(b)
    const uses = p.purchases.filter((x) => x.route === 'joat').map((x) => x.year)
    expect(new Set(uses).size).toBe(3) // one per season
    expect(p.purchases.filter((x) => x.id === 'jack-of-all-trades')).toHaveLength(3) // the held one plus 2 re-buys
    expect(planRoute(b, [t('crushing-blow')]).cheapest!.purchases.some((x) => x.id === 'jack-of-all-trades')).toBe(true) // held one is used up
  })

  it('advances one of 4 prebook purchases a second level as a 5th purchase (C20)', () => {
    const b = build({ os: [{ id: 'dismiss-control-2', source: 'buy' }] })
    const targets = [t('dismiss-control-6'), t('immune-fear'), t('immune-fumble'), t('tracking')]
    expect(summary(b, targets).years).toBe(2)
    const p = planRoute(b, targets, { prebook: true }).cheapest!
    expect(p.years).toBe(1)
    expect(p.purchases.map((x) => `${x.id}:${x.prebook ? 'P' : ''}${x.advanced ? 'A' : ''}`)).toEqual([
      'dismiss-control-4:P', 'immune-fear:P', 'immune-fumble:P', 'tracking:P', 'dismiss-control-6:A',
    ])
    expect(p.purchases.at(-1)!.countsTowardYearly).toBe(false)
    // Only 3 purchases that season: no advancement.
    expect(summary(b, targets.slice(0, 3), { prebook: true }).years).toBe(2)
  })

  it('starts the chain of Jack of All Trades uses as early as it can, after the JoAT that pays for the first', () => {
    const buys = ['immune-repel', 'immune-repel-strikedown', 'mighty-blow', 'immune-fumble', 'immune-fumble-shatter', 'immune-through',
      'immune-fear', 'immune-mute', 'rally', 'armour-mastery', 'armour-mastery-advanced', 'detect-remove-beguile', 'immune-charms']
    const b = build({
      cs: { 'large-weapon': 1, 'medium-armour': 1 }, loresheets: [{ id: 'awakened-human' }],
      os: [
        { id: 'oathsworn', param: 'Militia Guild', source: 'buy' },
        { id: 'jack-of-all-trades', source: 'loresheet', loresheet: 'awakened-human', dropped: true },
        ...buys.map((id): HeldSkill => ({ id, source: 'buy' })),
        ...['crushing-blow', 'magic-resistance', 'immune-mind-effects', 'armour-mastery-expert'].map((id): HeldSkill => ({ id, source: 'joat' })),
      ],
    })
    const p = spentSoFar(b, { retired: true })
    expect(p.years).toBe(6)
    const at = (id: string) => p.purchases.filter((x) => x.id === id).map((x) => x.year)
    expect(Math.min(...at('jack-of-all-trades'))).toBeLessThanOrEqual(Math.min(...p.purchases.filter((x) => x.route === 'joat').map((x) => x.year)))
  })

  it('does not use prebook tier advancement in a retirement double-step year (C20)', () => {
    const b = build({ os: [{ id: 'dismiss-control-2', source: 'buy' }] })
    const targets = [t('dismiss-control-6'), t('immune-fumble-shatter'), t('immune-mute'), t('tracking')]
    const p = planRoute(b, targets, { prebook: true, retired: true }).cheapest!
    expect(p.purchases.some((x) => x.advanced)).toBe(false)
    expect(p.purchases.some((x) => x.doubleStep)).toBe(true)
  })

  it('plans Polyglot from an existing script without a prerequisite cycle', () => {
    const b = build({ cs: { 'recognise-forgery': 1 }, os: [{ id: 'translate-named-script', param: 'Elven', source: 'buy' }] })
    expect(summary(b, [t('polyglot')]).steps).toEqual(['1:Script Master (your choice):buy', '2:Polyglot:buy'])
  })

  it('uses a planned Script Master to satisfy Polyglot instead of adding another', () => {
    const b = build({ cs: { 'recognise-forgery': 1 }, os: [{ id: 'translate-named-script', param: 'Elven', source: 'buy' }] })
    expect(summary(b, [t('polyglot'), t('script-master', 'People & Race')])).toEqual({
      years: 2, osp: 100, steps: ['1:Script Master (People & Race):buy', '2:Polyglot:buy'],
    })
  })

  it('keeps the restricted note on a retirement double step (R5)', () => {
    const b = build({ cs: { 'poison-lore': 1 } })
    const p = planRoute(b, [t('create-poison-magical')], { retired: true }).cheapest!
    const magical = p.purchases.find((x) => x.id === 'create-poison-magical')!
    expect(p.purchases.some((x) => x.doubleStep)).toBe(true)
    expect(magical.notes).toContain('Restricted: needs a training facility, tutor or forgery')
  })

  it('drops planned prerequisites from the finished card', () => {
    const p = planRoute(newBuild(), [t('immune-mind-effects')], { drop: ['immune-mute|', 'rally|'] }).cheapest!
    expect(p.years).toBe(4)
    expect(p.validation.valid).toBe(true)
    expect(p.validation.skills.map((s) => `${s.id}:${s.state}`)).toEqual([
      'immune-fear:replaced', 'immune-mute:dropped', 'rally:dropped', 'immune-mind-effects:active',
    ])
  })

  it('validates the final build', () => {
    const p = planRoute(build({ cs: { 'poison-lore': 1 } }), [t('create-poison-master')]).cheapest!
    expect(p.validation.valid).toBe(true)
    expect(p.validation.skills.filter((s) => s.state === 'replaced').map((s) => s.id)).toEqual(['create-poison-novice', 'create-poison-artisan'])
  })
})

describe('adding held skills', () => {
  const fighter = build({ cs: { 'large-weapon': 1 } })

  it('adds the prerequisites of a held skill along the normal route (Crushing Blow)', () => {
    const b = addHeldSkill(fighter, 'crushing-blow')
    expect(b.os.map((h) => `${h.id}:${h.source}`)).toEqual([
      'immune-repel:buy', 'immune-repel-strikedown:buy', 'mighty-blow:buy', 'crushing-blow:buy',
    ])
    const r = validate(b)
    expect(r.valid).toBe(true)
    // Mighty Blow replaces Immune to Repel and Strikedown (ruling C13), so only Crushing Blow stays on the card.
    expect(r.skills.map((s) => s.state)).toEqual(['replaced', 'replaced', 'replaced', 'active'])
  })

  it('uses the normal route even when the character holds Architect', () => {
    const b = addHeldSkill({ ...fighter, loresheets: [{ id: 'architect' }] }, 'mighty-blow')
    expect(b.os.map((h) => h.source)).toEqual(['buy', 'buy', 'buy'])
  })

  it('accepts a skill a ritual put straight on the card, with no prerequisites', () => {
    const r = validate({ ...fighter, os: [{ id: 'crushing-blow', source: 'ritual' }] })
    expect(r.valid).toBe(true)
    expect(r.skills[0]).toMatchObject({ card: 'character', state: 'active' })
  })

  it('adding a skill loresheet adds its skill (Circle Warden)', () => {
    const b = addLoresheetsAndSkills(newBuild(), ['circle-warden'])
    expect(b.os).toEqual([{ id: 'circle-warden', source: 'loresheet', loresheet: 'circle-warden' }])
    expect(validate(b).valid).toBe(true)
  })

  it('reports what has been spent so far and the fewest years it took', () => {
    const b = addHeldSkill(fighter, 'crushing-blow')
    expect(spentSoFar(b)).toMatchObject({ totalOsp: 140, years: 4 })
    expect(spentSoFar(b, { retired: true }).years).toBe(3)
    const ritual = { ...fighter, os: [{ id: 'crushing-blow', source: 'ritual' as const }] }
    expect(spentSoFar(ritual)).toMatchObject({ totalOsp: 0, years: 0 })
  })
})

describe('cheapest vs fastest divergence report', () => {
  const allCs = { spellcasting: 2, incantation: 1, healing: 1, corruption: 1, 'poison-lore': 1, 'potion-lore': 1,
    'recognise-forgery': 1, 'sense-magic': 1, 'triage-advanced': 1, 'large-weapon': 1, shield: 1,
    'projectile-weapon': 1, 'light-armour': 1, 'ritual-magic': 1, contribute: 1 }
  const profiles: Record<string, Build> = {
    standard: build({ cs: allCs, flags: ['bowCompetency', 'clawCompetency', 'factionPermission', 'researchRequest'] }),
    architect: build({ cs: allCs, flags: ['bowCompetency', 'factionPermission', 'researchRequest'], loresheets: [{ id: 'architect' }] }),
    paladinArchitect: build({ cs: allCs, flags: ['bowCompetency', 'factionPermission'], loresheets: [{ id: 'paladin', tier: 4 }, { id: 'architect' }] }),
    druidArchitect: build({ cs: allCs, flags: ['bowCompetency', 'clawCompetency', 'factionPermission'], loresheets: [{ id: 'druid', tier: 4 }, { id: 'architect' }] }),
    warlockArchitect: build({ cs: allCs, flags: ['bowCompetency', 'factionPermission'], loresheets: [{ id: 'warlock', tier: 4 }, { id: 'architect' }] }),
    vampireArchitect: build({ cs: allCs, pattern: 'unliving', flags: ['bowCompetency', 'factionPermission'], loresheets: [{ id: 'unliving' }, { id: 'vampire', tier: 4 }, { id: 'architect' }] }),
  }
  // Loresheet-only skills on each profile's loresheets are targets too.
  const sheetTargets = (b: Build) => b.loresheets.flatMap((l) => loresheetById.get(l.id)?.skills.map((e) => [t(e.os, e.param)]) ?? [])
  const buyable = occupationalSkills.filter((s) => !s.loresheetOnly && s.lists.length && s.side !== 'none')
  const target = (id: string) => t(id, id === 'script-master' ? 'Myth & Magic' : osById(id)?.param ? 'Test' : undefined)
  function osById(id: string) { return buyable.find((s) => s.id === id) }

  it('schedules every purchase, cheapest is never dearer and fastest is never slower', () => {
    const rows: string[] = []
    for (const [name, b] of Object.entries(profiles)) {
      let runs = 0, diverged = 0
      const examples: string[] = []
      const cases: Target[][] = [
        ...buyable.map((s) => [target(s.id)]),
        ...sheetTargets(b),
        // pairs of every 7th skill for a spread of combinations
        ...buyable.filter((_, i) => i % 7 === 0).flatMap((a, i, arr) => arr.slice(i + 1).map((c) => [target(a.id), target(c.id)])),
      ]
      for (const targets of cases) {
        const r = planRoute(b, targets)
        if (!r.cheapest || !r.fastest || r.cheapest.blockers.length) continue
        runs++
        for (const p of [r.cheapest, r.fastest]) expect(p.purchases.filter((x) => x.year < 1).map((x) => x.id), targets.map((x) => x.id).join('+')).toEqual([])
        expect(r.cheapest.totalOsp).toBeLessThanOrEqual(r.fastest.totalOsp)
        expect(r.fastest.years).toBeLessThanOrEqual(r.cheapest.years)
        if (r.diverges) {
          diverged++
          if (examples.length < 4) examples.push(`${targets.map((x) => x.id).join(' + ')}: cheapest ${r.cheapest.totalOsp} OSP/${r.cheapest.years}y, fastest ${r.fastest.totalOsp} OSP/${r.fastest.years}y`)
        }
      }
      rows.push(`${name}: ${diverged}/${runs} plans diverge (${((100 * diverged) / Math.max(runs, 1)).toFixed(1)}%)`, ...examples.map((e) => `  e.g. ${e}`))
    }
    console.log(`\nCheapest vs fastest divergence\n${rows.join('\n')}\n`)
  })
})
