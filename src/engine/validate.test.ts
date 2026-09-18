import { describe, expect, it } from 'vitest'
import { newBuild, type Build, type HeldSkill } from './build'
import { validate } from './validate'

const buy = (id: string, param?: string): HeldSkill => ({ id, param, source: 'buy' })
const build = (b: Partial<Build>): Build => ({ ...newBuild(), ...b })
const rules = (b: Build) => validate(b).issues.filter((i) => i.severity === 'error').map((i) => i.rule)
const state = (b: Build, id: string) => validate(b).skills.find((s) => s.id === id)

describe('character skills', () => {
  it('accepts a legal 16-point build', () => {
    const r = validate(build({ cs: { healing: 2, 'body-development': 1, 'light-armour': 1 } }))
    expect(r.valid).toBe(true)
    expect(r.derived.csPoints).toEqual({ spent: 14, available: 16 })
  })

  it('rejects overspending and two level-2 magic skills', () => {
    expect(rules(build({ cs: { healing: 2, spellcasting: 2, cartography: 1 } }))).toEqual(['CS-1', 'CS-6'])
  })

  it('needs Bow Competency for Projectile Weapon Use, and a magic CS for Ritual Magic', () => {
    expect(rules(build({ cs: { 'projectile-weapon': 1, 'ritual-magic': 1 } }))).toEqual(['CS-7', 'CS-7'])
  })

  it('applies children\'s limits', () => {
    expect(rules(build({ age: 8, cs: { 'heavy-armour': 1 } }))).toEqual(['CH'])
    expect(rules(build({ age: 8, cs: { healing: 2, 'base-power': 1 } }))).toEqual([])
    expect(rules(build({ age: 8, cs: { healing: 2, 'base-power': 2 } }))).toEqual(['CS-1'])
  })
})

describe('skill status', () => {
  it('marks replaced skills and keeps skills that are not replaced (REP-2a)', () => {
    const b = build({ os: [buy('immune-fear'), buy('immune-mute'), buy('rally')] })
    expect(validate(b).valid).toBe(true)
    expect(state(b, 'immune-fear')).toMatchObject({ state: 'replaced', replacedBy: 'Rally' })
    expect(state(b, 'immune-mute')?.state).toBe('active')
  })

  it('shows a skill as inactive when a use requirement is missing', () => {
    const b = build({ os: [buy('shadow-magic')] })
    expect(state(b, 'shadow-magic')).toMatchObject({ state: 'inactive', reason: 'Needs Spellcasting CS' })
    expect(state({ ...b, cs: { spellcasting: 1 } }, 'shadow-magic')?.state).toBe('active')
  })

  it('treats a replacing skill as the replaced one for prerequisites (REP-2b)', () => {
    const b = build({ os: [buy('immune-fumble'), buy('immune-fumble-shatter'), buy('oiled-weapons')] })
    expect(validate(b).valid).toBe(true)
  })

  it('Script Master <family> replaces only the TNS skills in that family', () => {
    const b = build({ os: [buy('translate-named-script', 'Elven'), buy('translate-named-script', 'Nihon'), buy('script-master', 'People & Race')] })
    const r = validate(b)
    expect(r.skills.map((s) => s.state)).toEqual(['replaced', 'active', 'active'])
    expect(r.skills[0]!.replacedBy).toBe('Script Master People & Race')
    expect(r.valid).toBe(true)
    expect(rules(build({ os: [buy('translate-named-script', 'Nihon'), buy('script-master', 'Myth & Magic')] }))).toEqual(['OS-4'])
  })

  it('matches parameters when replacing income skills', () => {
    const b = build({ os: [buy('apprentice', 'Smith'), buy('journeyman', 'Smith'), buy('apprentice', 'Baker')] })
    const r = validate(b)
    expect(r.skills.map((s) => s.state)).toEqual(['replaced', 'active', 'active'])
    expect(r.valid).toBe(true)
  })
})

describe('buying routes', () => {
  it('needs learn prerequisites for a normal purchase', () => {
    expect(rules(build({ cs: { 'light-armour': 1 }, os: [buy('champion')] }))).toEqual(['OS-4'])
  })

  it('lets a Paladin buy Champion from the loresheet without Transcend Armour (LS-3)', () => {
    const b = build({
      cs: { 'light-armour': 1 },
      loresheets: [{ id: 'paladin', tier: 1 }],
      os: [{ id: 'champion', source: 'loresheet', loresheet: 'paladin' }],
    })
    expect(validate(b).valid).toBe(true)
    expect(state(b, 'dedicated-follower')?.state).toBe('active') // granted by the Paladin loresheet
  })

  it('checks loresheet Min. type and that the loresheet is held', () => {
    const skill: HeldSkill = { id: 'immune-through', source: 'loresheet', loresheet: 'paladin' }
    expect(rules(build({ loresheets: [{ id: 'paladin', tier: 1 }], os: [skill] }))).toEqual(['LS-5'])
    expect(rules(build({ os: [skill] }))).toEqual(['LS-3'])
  })

  it('lets Architect skip prerequisites up to Tier 4 only', () => {
    const arch = { loresheets: [{ id: 'architect' }] }
    expect(rules(build({ ...arch, os: [{ id: 'mighty-blow', source: 'architect' }] }))).toEqual([])
    expect(rules(build({ ...arch, os: [{ id: 'crushing-blow', source: 'architect' }] }))).toEqual(['LS-4a'])
    expect(rules(build({ os: [{ id: 'mighty-blow', source: 'architect' }] }))).toEqual(['LS-4a'])
  })

  it('keeps granted skills off the character card', () => {
    expect(rules(build({ os: [{ id: 'immune-fatal', source: 'granted', card: 'power' }] }))).toEqual([])
    expect(rules(build({ os: [{ id: 'immune-fatal', source: 'granted' }] }))).toEqual(['OS-6'])
  })
})

describe('card limits', () => {
  it('counts only right-side skills toward the 12', () => {
    const right = ['immune-fear', 'immune-mute', 'immune-fumble', 'tracking', 'locate', 'escape-bonds', 'forensic-analysis',
      'herb-lore', 'trap-lore', 'traverse-faction-wards', 'immune-repel', 'dismiss-control-2']
    const b = build({ os: [...right.map((id) => buy(id)), buy('apprentice', 'Smith'), buy('scholar', 'History')] })
    expect(rules(b)).toEqual([])
    expect(rules({ ...b, os: [...b.os, buy('detect-remove-beguile')] })).toEqual(['LIM-1'])
  })

  it('limits income and research combinations', () => {
    expect(rules(build({ os: [buy('apprentice', 'A'), buy('journeyman', 'A'), buy('apprentice', 'B'), buy('journeyman', 'B'), buy('apprentice', 'C')] })))
      .toEqual(['LIM-5'])
    expect(rules(build({ os: [buy('scholar', 'A'), buy('scholar', 'B'), buy('scholar', 'C')] }))).toEqual(['LIM-6'])
  })

  it('rejects mutually exclusive skills', () => {
    const b = build({
      cs: { 'large-weapon': 1 },
      loresheets: [{ id: 'architect' }],
      os: [{ id: 'mighty-blow', source: 'architect' }, { id: 'goblin-resilience', source: 'granted', card: 'creature' }],
    })
    // Granted skills are on another card; the exclusion still applies to the character card only.
    expect(rules(b)).toEqual([])
    expect(rules({ ...b, os: [b.os[0]!, { id: 'goblin-resilience', source: 'architect' }] })).toContain('EX')
  })
})

describe('race, pattern and loresheets', () => {
  it('needs the loresheet for a non-starting race or pattern', () => {
    expect(rules(build({ race: 'elemental' }))).toEqual(['3.1'])
    expect(rules(build({ race: 'elemental', loresheets: [{ id: 'elemental' }] }))).toEqual([])
    expect(rules(build({ pattern: 'unliving' }))).toEqual(['A13'])
  })

  it('makes a Vampire need the Unliving loresheet and pattern', () => {
    expect(rules(build({ loresheets: [{ id: 'vampire', tier: 1 }] }))).toEqual(['A13', '12.4'])
    expect(rules(build({ pattern: 'unliving', loresheets: [{ id: 'vampire', tier: 1 }, { id: 'unliving' }] }))).toEqual([])
  })

  it('turns off Paladin damage reduction when Spellcasting is held', () => {
    const b = build({
      cs: { spellcasting: 1 },
      loresheets: [{ id: 'paladin', tier: 3 }],
      os: [
        { id: 'immune-through', source: 'loresheet', loresheet: 'paladin' },
        { id: 'damage-reduction-crush', source: 'loresheet', loresheet: 'paladin' },
      ],
    })
    expect(state(b, 'damage-reduction-crush')).toMatchObject({ state: 'inactive', reason: 'Spellcasting CS turns it off' })
  })
})

describe('derived values', () => {
  it('applies the Rule of Double to Spell Power', () => {
    const d = validate(build({ cs: { healing: 1 }, os: [buy('spell-power-4'), buy('spell-power-8'), buy('spell-power-12'), buy('spell-power-16')] })).derived
    expect(d.spellPower).toEqual({ base: 4, total: 8, cap: 8 })
  })

  it('adds power from several magic skills by default (A1)', () => {
    expect(validate(build({ cs: { healing: 1, spellcasting: 2, 'base-power': 1 } })).derived.spellPower.base).toBe(20)
  })

  it('gives a Warlock no LHV from Body Development', () => {
    expect(validate(build({ cs: { 'body-development': 2 } })).derived.baseLhv).toBe(3)
    const w = validate(build({ cs: { 'body-development': 2 }, loresheets: [{ id: 'warlock', tier: 1 }] }))
    expect(w.derived.baseLhv).toBe(1)
    expect(w.issues.map((i) => i.rule)).toContain('12.4')
  })
})
