import { describe, expect, it } from 'vitest'
import { loresheetById, occupationalSkills } from '../data'
import { newBuild, type Build } from './build'
import { planRoute, type Target } from './plan'

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
    expect(summary(newBuild(), [t('master', 'Smith')]).steps).toEqual(['1:Apprentice Smith:buy', '2:Journeyman Smith:buy', '3:Master Smith:buy'])
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
    const b = build({ os: [
      { id: 'jack-of-all-trades', source: 'granted', card: 'power' },
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
      os: [{ id: 'jack-of-all-trades', source: 'granted', card: 'power' }],
      loresheets: [{ id: 'npc-dpc', param: 'Mages Guild' }, { id: 'awakened-human' }],
    })
    const p = planRoute(b, [t('thaulmonic-alignment'), t('ritualist-master')]).cheapest!
    expect(p.purchases.filter((x) => x.route === 'joat').map((x) => `${x.year}:${x.id}`)).toEqual(['1:thaulmonic-alignment', '4:ritualist-master'])
    expect(p.purchases.filter((x) => x.id === 'jack-of-all-trades').map((x) => `${x.year}:${x.cost}:${x.route}`)).toEqual(['4:20:loresheet'])
    expect(p.totalOsp).toBe(30 + 10 + 30 + 40 + 50 + 20)
    expect(p.validation.valid).toBe(true)
  })

  it('buys Jack of All Trades from the Awakened Human sheet when none is held; without the sheet it only uses a held one', () => {
    const b = build({ loresheets: [{ id: 'awakened-human' }, { id: 'npc-dpc', param: 'Mages Guild' }] })
    const p = planRoute(b, [t('thaulmonic-alignment')]).cheapest!
    expect(p.purchases.map((x) => `${x.year}:${x.id}:${x.route}:${x.cost}`)).toEqual(['1:jack-of-all-trades:loresheet:20', '1:thaulmonic-alignment:joat:30'])
    const noSheet = planRoute(build({ loresheets: [{ id: 'npc-dpc', param: 'Mages Guild' }] }), [t('thaulmonic-alignment')]).cheapest!
    expect(noSheet.purchases.map((x) => x.route)).toEqual(['buy'])
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

  it('plans Polyglot from an existing script without a prerequisite cycle', () => {
    const b = build({ cs: { 'recognise-forgery': 1 }, os: [{ id: 'translate-named-script', param: 'Elven', source: 'buy' }] })
    expect(summary(b, [t('polyglot')]).steps).toEqual(['1:Script Master (your choice):buy', '2:Polyglot:buy'])
  })

  it('uses a planned Script Master to satisfy Polyglot instead of adding another', () => {
    const b = build({ cs: { 'recognise-forgery': 1 }, os: [{ id: 'translate-named-script', param: 'Elven', source: 'buy' }] })
    expect(summary(b, [t('polyglot'), t('script-master', 'People & Race')])).toEqual({
      years: 2, osp: 100, steps: ['1:Script Master People & Race:buy', '2:Polyglot:buy'],
    })
  })

  it('validates the final build', () => {
    const p = planRoute(build({ cs: { 'poison-lore': 1 } }), [t('create-poison-master')]).cheapest!
    expect(p.validation.valid).toBe(true)
    expect(p.validation.skills.filter((s) => s.state === 'replaced').map((s) => s.id)).toEqual(['create-poison-novice', 'create-poison-artisan'])
  })
})

describe('cheapest vs fastest divergence report', () => {
  const allCs = { spellcasting: 2, incantation: 1, healing: 1, corruption: 1, 'poison-lore': 1, 'potion-lore': 1,
    'recognise-forgery': 1, 'sense-magic': 1, 'triage-advanced': 1, triage: 1, 'large-weapon': 1, shield: 1,
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
