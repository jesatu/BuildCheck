import { describe, expect, it } from 'vitest'
import {
  characterSkills, csById, guildLists, loresheetById, loresheets, occupationalSkills, osById, osIdsIn, races,
  requirementLeaves, spellLists, type Requirement,
} from './index'

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/

function uniqueIds(items: { id: string }[]): string[] {
  const seen = new Set<string>()
  const dupes: string[] = []
  for (const { id } of items) (seen.has(id) ? dupes : []).push(id), seen.add(id)
  return dupes
}

/** References in a requirement that don't exist in the data. */
function brokenRefs(r: Requirement | undefined): string[] {
  return requirementLeaves(r).flatMap((l) => {
    if ('os' in l && !osById.has(l.os)) return [`os:${l.os}`]
    if ('cs' in l && !csById.has(l.cs)) return [`cs:${l.cs}`]
    if ('loresheet' in l && l.loresheet !== '*' && !loresheetById.has(l.loresheet)) return [`loresheet:${l.loresheet}`]
    return []
  })
}

describe('ids', () => {
  it.each([
    ['character skills', characterSkills],
    ['occupational skills', occupationalSkills],
    ['loresheets', loresheets],
    ['races', races],
    ['spell lists', spellLists],
    ['guild lists', guildLists],
  ] as const)('%s have unique kebab-case ids', (_, items) => {
    expect(uniqueIds(items)).toEqual([])
    expect(items.filter((i) => !KEBAB.test(i.id)).map((i) => i.id)).toEqual([])
  })
})

describe('character skills', () => {
  it('have increasing costs per level', () => {
    for (const s of characterSkills) {
      const sorted = [...s.levelCosts].sort((a, b) => a - b)
      expect(s.levelCosts, s.id).toEqual(sorted)
    }
  })

  it('reference existing skills', () => {
    for (const s of characterSkills) {
      expect(brokenRefs(s.requires), s.id).toEqual([])
    }
  })
})

describe('occupational skills', () => {
  it('reference existing skills in learn, use, replaces, includes and excludes', () => {
    for (const s of occupationalSkills) {
      expect(brokenRefs(s.learn), `${s.id} learn`).toEqual([])
      expect(brokenRefs(s.use), `${s.id} use`).toEqual([])
      for (const x of [...(s.replaces ?? []), ...(s.includes ?? []), ...(s.excludes ?? [])]) {
        expect(osById.has(x), `${s.id} → ${x}`).toBe(true)
      }
    }
  })

  it('have no cycles in learn prerequisites', () => {
    const state = new Map<string, 'visiting' | 'done'>()
    const cycles: string[] = []
    const visit = (id: string, path: string[]) => {
      if (state.get(id) === 'done') return
      if (state.get(id) === 'visiting') return void cycles.push([...path, id].join(' → '))
      state.set(id, 'visiting')
      for (const p of osIdsIn(osById.get(id)?.learn)) visit(p, [...path, id])
      state.set(id, 'done')
    }
    for (const s of occupationalSkills) visit(s.id, [])
    expect(cycles).toEqual([])
  })

  it('cost 10 OSP per tier, except known exceptions', () => {
    const exceptions = new Set([
      'polyglot', 'treewalker', 'voidportal', 'circle-warden', 'circle-watcher',
      'herb-lore-improved', 'mighty-blow-brutish', 'crushing-blow-focused',
    ])
    const wrong = occupationalSkills
      .filter((s) => s.tier !== undefined && !exceptions.has(s.id) && s.cost !== s.tier * 10)
      .map((s) => `${s.id}: T${s.tier} ${s.cost}`)
    expect(wrong).toEqual([])
  })

  it('handbook-list skills have a tier and cost; loresheet-only skills without them have no lists', () => {
    for (const s of occupationalSkills) {
      if (s.lists.length > 0) expect(s.tier !== undefined && s.cost !== undefined, s.id).toBe(true)
      else expect(s.loresheetOnly, s.id).toBe(true)
    }
  })

  it('Tier 5 skills on standard lists are restricted', () => {
    const wrong = occupationalSkills.filter((s) => s.tier === 5 && !s.loresheetOnly && !s.restricted).map((s) => s.id)
    expect(wrong).toEqual([])
  })

  it('only replace a skill outside the learn prerequisite for loresheet-only skills', () => {
    const wrong = occupationalSkills.flatMap((s) => {
      const learn = new Set(osIdsIn(s.learn))
      return (s.replaces ?? []).filter((r) => !learn.has(r) && !s.loresheetOnly).map((r) => `${s.id} replaces ${r}`)
    })
    expect(wrong).toEqual([])
  })

  it('skills off the right side never count toward the 12-skill limit', () => {
    const wrong = occupationalSkills.filter((s) => s.side !== 'right' && s.countsTowardLimit).map((s) => s.id)
    expect(wrong).toEqual([])
  })

  it('left-side skills match the card-side ruling', () => {
    const left = occupationalSkills.filter((s) => s.side === 'left').map((s) => s.id).sort()
    expect(left).toEqual(['apprentice', 'general-knowledge', 'journeyman', 'master', 'oathsworn', 'sage', 'scholar'])
  })

  it('mutual exclusions are symmetric', () => {
    const wrong: string[] = []
    for (const s of occupationalSkills) {
      for (const x of s.excludes ?? []) {
        if (!osById.get(x)?.excludes?.includes(s.id)) wrong.push(`${s.id} excludes ${x}, but not the reverse`)
      }
    }
    expect(wrong).toEqual([])
  })

  // Counts taken from reference doc section 9. A mismatch means a skill is missing or on the wrong list.
  it.each([
    ['alchemists', 18], ['armourers', 16], ['bards', 17], ['casino', 12], ['corruptors', 15],
    ['healers', 14], ['incantors', 16], ['mages', 15], ['militia', 16], ['rangers', 16],
    ['scouts', 18], ['bank', 9], ['knowledge', 3], ['arcane', 22], ['martial', 4], ['generic', 27],
  ] as const)('%s list has %i skills', (list, count) => {
    expect(occupationalSkills.filter((s) => s.lists.includes(list)).map((s) => s.id)).toHaveLength(count)
  })
})

describe('loresheets', () => {
  it('reference existing skills and requirements', () => {
    for (const l of loresheets) {
      for (const s of l.skills) {
        expect(osById.has(s.os), `${l.id} → ${s.os}`).toBe(true)
        expect(brokenRefs(s.learn), `${l.id} → ${s.os} learn`).toEqual([])
      }
      for (const r of l.restrictions) {
        if (r.kind === 'grantsSkills') for (const x of r.skills) expect(osById.has(x), `${l.id} grants ${x}`).toBe(true)
        if (r.kind === 'requiresLoresheet') expect(loresheetById.has(r.loresheet), `${l.id} requires ${r.loresheet}`).toBe(true)
        if (r.kind === 'csDisablesSkills') expect(csById.has(r.cs)).toBe(true)
        if (r.kind === 'requiresCs' || r.kind === 'excludesCs') for (const x of r.cs) expect(csById.has(x), x).toBe(true)
      }
    }
  })

  it('essence creatures have 4 tiers, and only they use Min. type', () => {
    for (const l of loresheets) {
      if (l.kind === 'essence') {
        expect(l.tiers?.map((t) => t.tier), l.id).toEqual([1, 2, 3, 4])
        expect(l.tiers?.map((t) => t.cost), l.id).toEqual([10, 20, 30, 40])
      } else {
        expect(l.skills.filter((s) => s.minType !== undefined), l.id).toEqual([])
      }
    }
  })

  it('list each skill (and parameter) at most once per loresheet', () => {
    for (const l of loresheets) {
      const keys = l.skills.map((s) => `${s.os}|${s.param ?? ''}`)
      expect(keys.length, l.id).toBe(new Set(keys).size)
    }
  })
})

describe('races', () => {
  it('have 10 starting races', () => {
    expect(races.filter((r) => r.startingRace)).toHaveLength(10)
  })

  it('non-starting races link to an existing race loresheet', () => {
    for (const r of races.filter((x) => !x.startingRace)) {
      const l = loresheetById.get(r.loresheet ?? '')
      expect(l?.kind, r.id).toBe('race')
    }
  })
})

describe('spell lists', () => {
  it('base and specialisation lists have 8 spells per level (Channelling has 5)', () => {
    for (const l of spellLists.filter((x) => x.kind === 'base' || x.kind === 'specialisation')) {
      const expected = l.family === 'channelling' ? 5 : 8
      expect(l.levels.map((lv) => lv.length), l.id).toEqual([expected, expected, expected])
    }
  })

  it('Cast All Incantation is the 12/11/12 union of the Incantation lists', () => {
    const l = spellLists.find((x) => x.id === 'cast-all-incantation')!
    expect(l.levels.map((lv) => lv.length)).toEqual([12, 11, 12])
  })

  it('Cast All Spellcasting is the full union of the Magecraft lists (E6 ruling)', () => {
    const l = spellLists.find((x) => x.id === 'cast-all-magecraft')!
    expect(l.levels.map((lv) => lv.length)).toEqual([12, 12, 12])
    expect(l.levels[0].map((s) => s.name)).toContain('Control Unliving')
  })
})
