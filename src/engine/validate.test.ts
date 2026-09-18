import { describe, expect, it } from 'vitest'
import { addLoresheets, newBuild, type Build, type HeldSkill } from './build'
import { damageReductions, immunities, missingLoresheets, unaffectedBy, validate } from './validate'
import { damageReductionBySkill, immunitiesBySkill, osById } from '../data'

const buy = (id: string, param?: string): HeldSkill => ({ id, param, source: 'buy' })
const build = (b: Partial<Build>): Build => ({ ...newBuild(), ...b })
/** An Awakened Human: the loresheet comes with the Awakened (Human) skill. */
const awake = (b: Partial<Build>): Build => build({ ...b, flags: [...(b.flags ?? []), 'awakenedRite'], os: [...(b.os ?? []), buy('awakened', 'Human')] })
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

  it('allows only one skill from each ladder: armour use, and triage (CS-8)', () => {
    expect(rules(build({ cs: { 'light-armour': 1, 'heavy-armour': 1 } }))).toEqual(['CS-8'])
    expect(rules(build({ cs: { triage: 1, 'triage-advanced': 1 } }))).toEqual(['CS-8'])
    expect(rules(build({ cs: { 'heavy-armour': 1, 'triage-advanced': 1 } }))).toEqual([])
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
    expect(r.skills[0]!.replacedBy).toBe('Script Master (People & Race)')
    expect(r.valid).toBe(true)
    expect(rules(build({ os: [buy('translate-named-script', 'Nihon'), buy('script-master', 'Myth & Magic')] }))).toEqual(['OS-4'])
  })

  it('marks family TNS left over after Polyglot as redundant, but not restricted or unlisted scripts', () => {
    const b = build({
      cs: { 'recognise-forgery': 1 },
      os: [
        buy('translate-named-script', 'Elven'), buy('script-master', 'People & Race'), buy('polyglot'),
        buy('translate-named-script', 'Nihon'),                                            // family script, no Script Master
        { id: 'tns-runes', param: 'Grave', source: 'granted', card: 'creature' },         // restricted: not in a family
        buy('translate-named-script', 'Atlantean'),                                        // not in any family
      ],
    })
    const r = validate(b)
    expect(r.skills.map((s) => s.state)).toEqual(['replaced', 'replaced', 'active', 'redundant', 'active', 'active'])
    expect(r.skills[3]!.reason).toBe('Covered by Polyglot')
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

  it('lets Jack of All Trades teach an Ω skill for an Oathsworn guild, including Oathsworn from an NPC/DPC loresheet', () => {
    const joat: HeldSkill = { id: 'jack-of-all-trades', source: 'loresheet', loresheet: 'awakened-human' }
    const human = [{ id: 'awakened-human' }]
    const oath: HeldSkill = { id: 'oathsworn', param: 'Mages Guild', source: 'buy' }
    const skill: HeldSkill = { id: 'thaulmonic-alignment', source: 'joat' }
    expect(rules(awake({ flags: ['factionPermission'], loresheets: human, os: [joat, oath, skill] }))).toEqual([])
    const npc = awake({ os: [joat, skill], loresheets: [...human, { id: 'npc-dpc', param: 'Mages Guild' }] })
    expect(rules(npc)).toEqual([])
    expect(state(npc, 'oathsworn')).toMatchObject({ card: 'loresheet', param: 'Mages Guild' })
    expect(rules(awake({ os: [joat, skill], loresheets: [...human, { id: 'npc-dpc' }] }))).toContain('12')
    expect(rules(awake({ flags: ['factionPermission'], loresheets: human, os: [joat, { ...oath, param: 'Bards Guild' }, skill] }))).toEqual(['JoAT'])
    // No Awakened Human sheet: no JoAT, even with one on a card.
    expect(rules(build({ flags: ['factionPermission'], os: [{ id: 'jack-of-all-trades', source: 'granted', card: 'power' }, oath, skill] }))).toEqual(['JoAT'])
    // Group lists count: Oathsworn Mages opens the Arcane Guilds list, except High Magic <X>.
    expect(rules(awake({ cs: { spellcasting: 2 }, loresheets: [...human, { id: 'npc-dpc', param: 'Mages Guild' }], os: [joat, { id: 'spell-power-4', source: 'joat' }] }))).toEqual([])
    expect(rules(awake({ cs: { spellcasting: 2 }, loresheets: [...human, { id: 'npc-dpc', param: 'Mages Guild' }], os: [joat, { id: 'high-magic', param: 'Spellcasting', source: 'joat' }] }))).toEqual(['JoAT'])
    // Prerequisites still apply.
    expect(rules(awake({ loresheets: [...human, { id: 'npc-dpc', param: 'Mages Guild' }], os: [joat, { id: 'ritualist-master', source: 'joat' }] }))).toEqual(['OS-4'])
  })

  it('keeps granted skills off the character card', () => {
    expect(rules(build({ os: [{ id: 'immune-fatal', source: 'granted', card: 'power' }] }))).toEqual([])
    expect(rules(build({ os: [{ id: 'immune-fatal', source: 'granted' }] }))).toEqual(['OS-6'])
  })
})

describe('redundant skills', () => {
  it('marks a skill included by another as redundant (Mind Healing includes Immune to Sleep)', () => {
    const b = build({ os: [buy('revive'), buy('advanced-healing'), buy('mind-healing'), buy('immune-befriend-confusion'), buy('immune-sleep')], cs: { healing: 1 } })
    expect(state(b, 'immune-sleep')).toMatchObject({ state: 'redundant', reason: 'Covered by Mind Healing' })
  })

  it('marks Shadow Magic redundant under Cast All Magecraft', () => {
    const b = build({ cs: { spellcasting: 2 }, loresheets: [{ id: 'warlock', tier: 4 }],
      os: [buy('shadow-magic'), { id: 'cast-all-magecraft', source: 'granted', card: 'power' }] })
    expect(state(b, 'shadow-magic')).toMatchObject({ state: 'redundant', reason: 'Covered by Cast All Magecraft' })
  })

  it('marks a bought skill redundant when a loresheet also grants it (Circle Warden grants Immune to Mute)', () => {
    const b = build({ loresheets: [{ id: 'circle-warden' }], os: [buy('immune-fear'), buy('immune-mute')] })
    expect(validate(b).skills.find((s) => s.id === 'immune-mute' && s.card === 'character'))
      .toMatchObject({ state: 'redundant', reason: 'Also granted by the Circle Warden loresheet' })
  })
})

describe('implicit replacements and covered skills (rulings C17-C19)', () => {
  it('replaces along the chains the owner confirmed', () => {
    const r = validate(build({ cs: { spellcasting: 1 }, os: [buy('perform-transport-rite'), buy('perform-teleport-rite'), buy('identify'), buy('diagnose-powers')] }))
    expect(r.skills.map((s) => `${s.id}:${s.state}`)).toEqual([
      'perform-transport-rite:replaced', 'perform-teleport-rite:active', 'identify:replaced', 'diagnose-powers:active',
    ])
  })

  it('Vampire Dismiss/Control +8 replaces +4', () => {
    const b = build({ pattern: 'unliving', loresheets: [{ id: 'vampire' }, { id: 'unliving' }], os: [
      { id: 'vampire-1', source: 'loresheet', loresheet: 'vampire' },
      { id: 'dismiss-control-4', source: 'loresheet', loresheet: 'vampire' },
      { id: 'dismiss-control-8', source: 'loresheet', loresheet: 'vampire' }] })
    expect(state(b, 'dismiss-control-4')).toMatchObject({ state: 'replaced', replacedBy: 'Dismiss/Control +8' })
  })

  it('Beguile replaces only Detect and Remove Beguile; Cast Mass Charms stays', () => {
    const b = build({ os: ['detect-remove-beguile', 'immune-charms', 'cast-mass-charms', 'beguile'].map((id) => buy(id)) })
    expect(validate(b).skills.map((s) => s.state)).toEqual(['replaced', 'replaced', 'active', 'active'])
  })

  it('Beguile makes a held Immune to Charms redundant', () => {
    const b = build({ os: [{ id: 'immune-charms', source: 'ritual' }, { id: 'beguile', source: 'ritual' }] })
    expect(state(b, 'immune-charms')).toMatchObject({ state: 'redundant', reason: 'Covered by Beguile' })
  })

  it('marks covered skills redundant without replacing them or counting them for prerequisites', () => {
    const b = build({ os: [buy('immune-fear'), buy('immune-mute'), { ...buy('rally'), dropped: true }, buy('immune-mind-effects'), buy('immune-befriend-confusion')] })
    expect(state(b, 'immune-befriend-confusion')).toMatchObject({ state: 'redundant', reason: 'Covered by Immune to Mind Effects' })
    // Immune to Mind Effects doesn't count as Immune to Fear for a prerequisite.
    expect(rules(build({ os: [{ id: 'immune-mind-effects', source: 'ritual' }, buy('immune-mute')] }))).toEqual(['OS-4'])
  })

  it('a higher Fearsome Aspect or Beguile level replaces the lower ones', () => {
    const b = build({ loresheets: [{ id: 'werecreature' }], os: [
      { id: 'werecreature-3', source: 'ritual' },
      { id: 'fearsome-aspect-level', param: '1', source: 'loresheet', loresheet: 'werecreature' },
      { id: 'fearsome-aspect-level', param: '2', source: 'loresheet', loresheet: 'werecreature' },
      { id: 'fearsome-aspect-level', param: '4', source: 'loresheet', loresheet: 'werecreature' }] })
    expect(validate(b).skills.map((s) => s.state)).toEqual(['active', 'replaced', 'replaced', 'active'])
    expect(validate(b).skills.slice(1, 3).map((x) => x.replacedBy)).toEqual(['Fearsome Aspect (2)', 'Fearsome Aspect (4)'])
  })
})

describe('loresheet purchases', () => {
  it('accept any held loresheet that offers the skill (Cast All Magecraft: Warlock or Circle Warden)', () => {
    const b = build({ cs: { spellcasting: 2 }, loresheets: [{ id: 'circle-warden' }],
      os: [{ id: 'cast-additional-magecraft', source: 'ritual' }, { id: 'cast-all-magecraft', source: 'loresheet', loresheet: 'warlock' }] })
    expect(rules(b)).toEqual([])
    expect(rules({ ...b, loresheets: [] })).toEqual(['LS-3'])
  })
})

describe('dropping skills', () => {
  it('takes a dropped skill off the card but keeps it for prerequisites (LIM-8)', () => {
    const b = build({ os: [buy('immune-fear'), { ...buy('immune-mute'), dropped: true }, { ...buy('rally'), dropped: true }, buy('immune-mind-effects')] })
    const r = validate(b)
    expect(r.valid).toBe(true)
    expect(r.skills.map((s) => s.state)).toEqual(['replaced', 'dropped', 'dropped', 'active'])
    expect(r.skills[1]!.reason).toBe('Off the card; still counts for prerequisites')
  })

  it('does not count dropped skills toward the 12 or clash with other skills', () => {
    const right = ['immune-fear', 'immune-mute', 'immune-fumble', 'tracking', 'locate', 'escape-bonds', 'forensic-analysis',
      'herb-lore', 'trap-lore', 'traverse-faction-wards', 'immune-repel', 'dismiss-control-2', 'detect-remove-beguile']
    const b = build({ os: right.map((id) => buy(id)) })
    expect(rules(b)).toEqual(['LIM-1'])
    expect(rules({ ...b, os: b.os.map((h, i) => (i === 0 ? { ...h, dropped: true } : h)) })).toEqual([])
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

describe('awakened loresheets', () => {
  it('only fit their base race', () => {
    expect(rules(awake({ race: 'human', loresheets: [{ id: 'awakened-human' }] }))).toEqual([])
    expect(rules(awake({ race: 'elf', loresheets: [{ id: 'awakened-human' }] }))).toEqual(['C21', '12.3'])
    // The loresheet and the skill come together.
    expect(rules(build({ loresheets: [{ id: 'awakened-human' }] }))).toEqual(['12.3'])
    expect(addLoresheets(newBuild(), ['awakened-human'])).toMatchObject({ flags: ['awakenedRite'], os: [{ id: 'awakened', param: 'Human' }] })
  })

  it('apply loresheet-specific replacement (Awakened Halfling: Traverse Faction Wards replaces Escape Bonds)', () => {
    const skills = [
      { id: 'escape-bonds', source: 'loresheet', loresheet: 'awakened-halfling' },
      { id: 'traverse-faction-wards', source: 'loresheet', loresheet: 'awakened-halfling' },
    ] as HeldSkill[]
    expect(state(build({ race: 'halfling', loresheets: [{ id: 'awakened-halfling' }], os: skills }), 'escape-bonds')?.state).toBe('replaced')
    expect(state(build({ os: skills.map((s) => ({ ...s, source: 'buy' as const })) }), 'escape-bonds')?.state).toBe('active')
  })
})

describe('notes', () => {
  it('notes the Treewalker rules mismatch (L11)', () => {
    const r = validate(build({ cs: { spellcasting: 1 }, loresheets: [{ id: 'treewalker' }] }))
    expect(r.issues.filter((i) => i.rule === 'L11').map((i) => i.severity)).toEqual(['warning'])
  })
})

describe('essence creatures and required loresheets', () => {
  it('lists the loresheets a build needs: pattern, race, and a loresheet-only skill with its own requirements', () => {
    expect(missingLoresheets(build({ pattern: 'magical' }))).toEqual(['magical-pattern'])
    expect(missingLoresheets(build({ race: 'elemental' }))).toEqual(['elemental'])
    expect(missingLoresheets(build({ os: [{ id: 'vampire-1', source: 'loresheet', loresheet: 'vampire' }] }))).toEqual(['vampire', 'unliving'])
    expect(missingLoresheets(newBuild(), [{ id: 'vampire-1' }])).toEqual(['vampire', 'unliving'])
    expect(missingLoresheets(newBuild())).toEqual([])
  })

  it('adding the Vampire and Unliving loresheets sets the pattern and puts Vampire on the card', () => {
    const b = addLoresheets(newBuild(), ['vampire', 'unliving'])
    expect(b.pattern).toBe('unliving')
    expect(b.os).toEqual([{ id: 'vampire-1', source: 'loresheet', loresheet: 'vampire' }])
    const r = validate(b)
    expect(r.valid).toBe(true)
    expect(r.skills[0]).toMatchObject({ name: 'Vampire', side: 'right', state: 'active' })
    expect(missingLoresheets(b)).toEqual([])
  })

  it('takes the creature tier from the card: Mature Vampire replaces Vampire and unlocks Mature skills', () => {
    const b = addLoresheets(newBuild(), ['vampire', 'unliving'])
    const mature = { ...b, os: [...b.os, { id: 'vampire-2', source: 'loresheet', loresheet: 'vampire' } as HeldSkill,
      { id: 'toughen-body', source: 'loresheet', loresheet: 'vampire' } as HeldSkill] }
    const r = validate(mature)
    expect(r.valid).toBe(true)
    expect(r.skills.map((s) => s.state)).toEqual(['replaced', 'active', 'active'])
    expect(r.derived.powerRating.carried).toBe(2)
    expect(rules(b.os.length ? { ...b, os: [...b.os, { id: 'toughen-body', source: 'loresheet', loresheet: 'vampire' }] } : b)).toEqual(['LS-5'])
  })
})

describe('derived values', () => {
  it('applies the Rule of Double to Spell Power', () => {
    const d = validate(build({ cs: { healing: 1 }, os: [buy('spell-power-4'), buy('spell-power-8'), buy('spell-power-12'), buy('spell-power-16')] })).derived
    expect(d.spellPower).toEqual({ base: 4, total: 8, cap: 8 })
  })

  it('takes the highest magic CS grant as base, plus +Base Power (A1)', () => {
    expect(validate(build({ cs: { healing: 1, spellcasting: 2 } })).derived.spellPower).toMatchObject({ base: 12, cap: 24 })
    expect(validate(build({ cs: { spellcasting: 2, 'base-power': 1 } })).derived.spellPower).toMatchObject({ base: 16, cap: 32 })
  })

  it('shows Armour Mastery as redundant for a Druid, but keeps Armour Mastery (Expert) active for its Crush immunity (L10)', () => {
    const b = build({
      cs: { 'light-armour': 1 },
      loresheets: [{ id: 'druid', tier: 1 }],
      os: [{ id: 'armour-mastery', source: 'buy' }, { id: 'armour-mastery-advanced', source: 'buy' }, { id: 'armour-mastery-expert', source: 'buy' }],
    })
    // Expert replaces Advanced (C17) and keeps its Crush immunity; without Expert, Advanced is redundant for a Druid.
    expect(validate(b).skills.map((s) => s.state)).toEqual(['replaced', 'replaced', 'active'])
    expect(validate({ ...b, os: b.os.slice(0, 2) }).skills.map((s) => s.state)).toEqual(['replaced', 'redundant'])
  })

  it('gives a Warlock no LHV from Body Development', () => {
    expect(validate(build({ cs: { 'body-development': 2 } })).derived.baseLhv).toBe(3)
    const w = validate(build({ cs: { 'body-development': 2 }, loresheets: [{ id: 'warlock', tier: 1 }] }))
    expect(w.derived.baseLhv).toBe(1)
    expect(w.issues.map((i) => i.rule)).toContain('12.4')
  })
  it('treats the matching awakened loresheet as the lammie for a bought Awakened <X>', () => {
    const state = (race: string) => validate({ ...newBuild(), loresheets: [{ id: 'awakened-human' }],
      os: [{ id: 'awakened', param: race, source: 'buy' }] }).skills[0]!.state
    expect(state('Human')).toBe('active')
    expect(state('Elf')).toBe('inactive')
  })
  it("asks for the awakened sheet of the chosen race, or the character's own race until one is chosen", () => {
    expect(missingLoresheets({ ...newBuild(), os: [buy('awakened', 'Elf')] })).toEqual(['awakened-elf'])
    expect(missingLoresheets(newBuild(), [{ id: 'awakened' }])).toEqual(['awakened-human'])
  })
  it('allows only one special creature (C21)', () => {
    const c21 = (b: Partial<Build>) => validate({ ...newBuild(), ...b }).issues.filter((x) => x.rule === 'C21').map((x) => x.message)
    const vampire = { id: 'vampire' }, druid = { id: 'druid' }
    expect(c21({ os: [buy('awakened', 'Human')] })).toEqual([])
    expect(c21({ race: 'elf', os: [buy('awakened', 'Human')] })).toEqual(['Awakened Human needs a Human character (this one is Elf).'])
    expect(c21({ os: [buy('awakened', 'Human')], loresheets: [{ id: 'awakened-human' }] })).toEqual([])
    expect(c21({ race: 'elf', loresheets: [{ id: 'awakened-elf' }, { id: 'awakened-human' }] })).toHaveLength(1)
    expect(c21({ loresheets: [{ id: 'awakened-human' }, druid] })).toEqual(['A character can only be one special creature: this one is Druid, Awakened Human.'])
    expect(c21({ race: 'daemon', loresheets: [{ id: 'daemon' }, druid] })).toHaveLength(1)
    expect(c21({ race: 'plant', loresheets: [{ id: 'plant' }, druid] })).toHaveLength(1)
    expect(c21({ race: 'umbral', loresheets: [druid] })).toEqual([])
    expect(c21({ loresheets: [vampire, druid] })).toHaveLength(1)
    expect(c21({ pattern: 'unliving', loresheets: [{ id: 'unliving' }, vampire] })).toEqual([])
    expect(c21({ pattern: 'unliving', loresheets: [{ id: 'unliving' }, druid] })).toHaveLength(1)
    expect(c21({ pattern: 'magical', loresheets: [{ id: 'magical-pattern' }, druid] })).toHaveLength(1)
    expect(c21({ pattern: 'magical', loresheets: [{ id: 'magical-pattern' }, { id: 'awakened-human' }] })).toHaveLength(1)
    expect(c21({ race: 'plant', pattern: 'unliving', loresheets: [{ id: 'plant' }, { id: 'unliving' }] })).toEqual([])
    expect(c21({ race: 'daemon', pattern: 'magical', loresheets: [{ id: 'daemon' }, { id: 'magical-pattern' }] })).toEqual([])
    expect(c21({ pattern: 'unliving', loresheets: [{ id: 'unliving' }, { id: 'awakened-human' }] }))
      .toEqual(['A character can only be one special creature: this one is Awakened Human, unliving pattern.'])
  })

  it('needs the Awakened Human sheet for every Jack of All Trades use', () => {
    const joat = (sheet: boolean) => validate({ ...newBuild(), loresheets: sheet ? [{ id: 'awakened-human' }] : [],
      os: [{ id: 'jack-of-all-trades', source: 'granted', card: 'power' }, { id: 'oathsworn', param: 'Militia Guild', source: 'buy' },
        { id: 'immune-fear', source: 'joat' }, { id: 'immune-fumble', source: 'joat' }] }).issues.filter((x) => x.rule === 'JoAT')
    expect(joat(false)).toHaveLength(2)
    expect(joat(true)).toEqual([])
  })
  it('makes Sleepless Chanting redundant with any Sleep immunity, but not Unending Voice', () => {
    const chant = (id: string) => state(build({ os: [buy(id), buy('sleepless-chanting')] }), 'sleepless-chanting')!.state
    expect(chant('immune-mind-effects')).toBe('redundant')
    expect(chant('immune-sleep')).toBe('redundant')
    expect(chant('mind-healing')).toBe('redundant')
    expect(state(build({ os: [buy('immune-sleep'), buy('unending-voice')] }), 'unending-voice')!.state).toBe('active')
  })
  it('allows one faction and one guild Oathsworn, counting switched-off and loresheet oaths (LIM-7)', () => {
    const oath = (param: string, extra: Partial<HeldSkill> = {}): HeldSkill => ({ ...buy('oathsworn', param), ...extra })
    const rules = (b: Build) => validate(b).issues.filter((i) => i.rule === 'LIM-7').map((i) => i.rule)
    expect(rules(build({ os: [oath('Lions'), oath('Mages Guild')] }))).toEqual([])
    expect(rules(build({ os: [oath('Lions'), oath('Wolves', { dropped: true })] }))).toEqual(['LIM-7'])
    expect(rules(build({ os: [oath('Bards Guild')], loresheets: [{ id: 'npc-dpc', param: 'Mages Guild' }] }))).toEqual(['LIM-7'])
    expect(rules(build({ os: [oath('Mages Guild')], loresheets: [{ id: 'npc-dpc', param: 'Mages Guild' }] }))).toEqual([])
  })
  it('lists immunities from working skills, including those of replaced and included skills', () => {
    expect(Object.keys(immunitiesBySkill).filter((id) => !osById.has(id))).toEqual([])
    const imm = (os: HeldSkill[], b: Partial<Build> = {}) => immunities(validate(build({ ...b, os })))
      .map((i) => `${i.effect}${i.limit ? ` (${i.limit})` : ''}: ${i.from.join(', ')}`)
    expect(imm([buy('rally'), buy('sleepless-chanting')])).toEqual(['Fear: Rally', 'Sleep (while casting a Chant): Sleepless Chanting'])
    expect(imm([buy('mighty-blow')], { cs: { 'large-weapon': 1 } })).toEqual(['Repel: Mighty Blow', 'Strikedown: Mighty Blow'])
    expect(imm([buy('mind-healing'), buy('sleepless-chanting')], { cs: { healing: 2 } })).toContain('Sleep: Mind Healing, Sleepless Chanting')
    expect(imm([buy('mighty-blow')])).toEqual([]) // inactive without Large Melee Weapon Use
    expect(imm([buy('shield-mastery'), buy('shield-mastery-expert')], { cs: { shield: 1 } })).toEqual(['Crush on shield (Normal or Enchanted): Shield Mastery (Expert)'])
  })
  it('lists Damage Reduction separately, leaving out effects the character is immune to', () => {
    expect(Object.keys(damageReductionBySkill).filter((id) => !osById.has(id))).toEqual([])
    const lammie = (id: string): HeldSkill => ({ id, source: 'granted', card: 'creature' })
    const dr = (os: HeldSkill[]) => damageReductions(validate(build({ os }))).map((d) => `${d.effect}: ${d.from.join(', ')}`)
    expect(dr([buy('immune-through'), buy('magic-resistance')])).toEqual(['Harm: Magic Resistance', 'Mage Bolt: Magic Resistance'])
    expect(dr([buy('immune-through'), buy('magic-resistance'), lammie('immune-harm')])).toEqual(['Mage Bolt: Magic Resistance'])
  })
  it('needs Level 2 of its own <X> to use High Magic <X>', () => {
    const hm = (param: string) => state(build({ cs: { healing: 2 }, os: [buy('high-magic', param)] }), 'high-magic')!.state
    expect(hm('Healing')).toBe('active')
    expect(hm('Spellcasting')).toBe('inactive')
  })
  it('lists effects that cannot affect the character because of its pattern or loresheets', () => {
    const not = (b: Partial<Build>) => unaffectedBy(build(b)).map((u) => `${u.effect}: ${u.from.join(', ')}`)
    expect(not({})).toEqual(['Bind Unliving: Living pattern', 'Enthral Unliving: Living pattern', 'Smite: Living pattern'])
    expect(not({ pattern: 'unliving' })).toEqual(['Decay: Unliving pattern', 'Disease: Unliving pattern', 'Fatal: Unliving pattern', 'Paralysis: Unliving pattern'])
    expect(not({ pattern: 'magical' })).toHaveLength(7)
    expect(not({ loresheets: [{ id: 'npc-dpc', param: 'Lions' }] })).toContain('Beguile: NPC/DPC')
    expect(not({ loresheets: [{ id: 'paladin' }] })).toContain('Chant of Healing: Paladin')
  })
})
