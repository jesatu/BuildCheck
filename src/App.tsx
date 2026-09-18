import { useEffect, useMemo, useState } from 'react'
import { csById, loresheetById, loresheets, osById, races, raceById, type FlagId, type Pattern } from './data'
import type { Build, CardId, HeldSkill } from './engine/build'
import { planRoute } from './engine/plan'
import { validate } from './engine/validate'
import { decodeState, emptyState, encodeState, type EditorState } from './state'
import { CardView, CsPanel, Issues, PlanView, SkillPicker, SkillRows } from './ui'

const FLAGS: Array<[FlagId, string]> = [
  ['bowCompetency', 'Bow Competency'],
  ['clawCompetency', 'Claw Competency'],
  ['factionPermission', 'Faction or guild permission (Oathsworn)'],
  ['researchRequest', 'Research request submitted (Sage)'],
]

export function App() {
  const [state, setState] = useState<EditorState>(() => decodeState(location.hash) ?? emptyState())
  const { build, targets, retired } = state
  useEffect(() => { history.replaceState(null, '', encodeState(state)) }, [state])

  const setBuild = (f: (b: Build) => Build) => setState((s) => ({ ...s, build: f(s.build) }))

  // One plan: the cheapest, with years as the tiebreak (owner decision).
  const plan = useMemo(() => (targets.length ? planRoute(build, targets, { retired }).cheapest : undefined), [build, targets, retired])
  const result = useMemo(() => plan?.validation ?? validate(build), [plan, build])

  const add = (id: string, where: 'want' | 'held' | CardId) => {
    if (where === 'want') return setState((s) => ({ ...s, targets: [...s.targets, { id }] }))
    const skill: HeldSkill = where === 'held' ? { id, source: 'buy' } : { id, source: 'granted', card: where }
    setBuild((b) => ({ ...b, os: [...b.os, skill] }))
  }

  const race = raceById.get(build.race)
  const heldSheetIds = new Set(build.loresheets.map((l) => l.id))

  return (
    <div className="app">
      <header className="top">
        <div>
          <h1>BuildCheck</h1>
          <p className="muted">Plan and check a Lorien Trust character build.</p>
        </div>
        <div className="top-actions">
          <button type="button" onClick={() => navigator.clipboard?.writeText(location.href)}>Copy share link</button>
          <button type="button" className="quiet" onClick={() => { if (confirm('Clear this build?')) setState(emptyState()) }}>New build</button>
        </div>
      </header>

      <main className="layout">
        <section className="col">
          <div className="panel">
            <h2>Character</h2>
            <label>Race
              <select value={build.race} onChange={(e) => setBuild((b) => ({ ...b, race: e.target.value }))}>
                <optgroup label="Starting races">
                  {races.filter((r) => r.startingRace).map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </optgroup>
                <optgroup label="By ritual (special creature)">
                  {races.filter((r) => !r.startingRace).map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </optgroup>
              </select>
            </label>
            {race && !race.startingRace && race.loresheet && !heldSheetIds.has(race.loresheet) && (
              <button type="button" className="inline" onClick={() => setBuild((b) => ({ ...b, loresheets: [...b.loresheets, { id: race.loresheet! }] }))}>
                Add the {race.name} loresheet
              </button>
            )}
            <label>Pattern
              <select value={build.pattern} onChange={(e) => setBuild((b) => ({ ...b, pattern: e.target.value as Pattern }))}>
                <option value="living">Living</option>
                <option value="magical">Magical (ritual)</option>
                <option value="unliving">Unliving (ritual or Vampire)</option>
              </select>
            </label>
            <label>Player age
              <select value={build.age ?? ''} onChange={(e) => setBuild((b) => ({ ...b, age: e.target.value ? Number(e.target.value) : undefined }))}>
                <option value="">16 or over</option>
                <option value="13">13–15</option>
                <option value="10">10–12</option>
                <option value="5">5–9</option>
                <option value="4">Under 5</option>
              </select>
            </label>
            <fieldset>
              <legend>Competencies and permissions</legend>
              {FLAGS.map(([id, label]) => (
                <label key={id} className="check">
                  <input type="checkbox" checked={build.flags.includes(id)}
                    onChange={(e) => setBuild((b) => ({ ...b, flags: e.target.checked ? [...b.flags, id] : b.flags.filter((f) => f !== id) }))} />
                  {label}
                </label>
              ))}
            </fieldset>
            <label className="check">
              <input type="checkbox" checked={retired} onChange={(e) => setState((s) => ({ ...s, retired: e.target.checked }))} />
              Created after retiring a previous character (2 double steps in year 1)
            </label>
          </div>

          <div className="panel">
            <h2>Loresheets</h2>
            {build.loresheets.length === 0 && <p className="muted">None. Add a creature, essence or route loresheet (such as Architect).</p>}
            <ul className="rows">
              {build.loresheets.map((l, i) => {
                const ls = loresheetById.get(l.id)!
                return (
                  <li key={l.id} className="row">
                    <span className="grow">{ls.name}{ls.unpublished && <span className="tag">unpublished</span>}</span>
                    {ls.tiers && (
                      <select aria-label={`${ls.name} tier`} value={l.tier ?? 1}
                        onChange={(e) => setBuild((b) => ({ ...b, loresheets: b.loresheets.map((x, j) => j === i ? { ...x, tier: Number(e.target.value) as 1 | 2 | 3 | 4 } : x) }))}>
                        {ls.tiers.map((t) => <option key={t.tier} value={t.tier}>{t.name}</option>)}
                      </select>
                    )}
                    <button type="button" className="remove" aria-label={`Remove ${ls.name}`}
                      onClick={() => setBuild((b) => ({ ...b, loresheets: b.loresheets.filter((_, j) => j !== i) }))}>×</button>
                  </li>
                )
              })}
            </ul>
            <select aria-label="Add a loresheet" value=""
              onChange={(e) => {
                const ls = loresheetById.get(e.target.value)
                if (ls) setBuild((b) => ({ ...b, loresheets: [...b.loresheets, { id: ls.id, tier: ls.tiers ? 1 : undefined }] }))
              }}>
              <option value="">Add a loresheet…</option>
              {loresheets.filter((l) => !heldSheetIds.has(l.id) && l.kind !== 'condition').map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          <CsPanel build={build} setBuild={setBuild} />
        </section>

        <section className="col">
          <SkillPicker build={build} onAdd={add} />

          <div className="panel">
            <h2>Skills wanted <span className="count">{targets.length}</span></h2>
            {targets.length === 0 && <p className="muted">Pick skills above with <b>Want</b>. The plan shows how to get them.</p>}
            <SkillRows
              rows={targets.map((t) => ({ id: t.id, param: t.param }))}
              onParam={(i, param) => setState((s) => ({ ...s, targets: s.targets.map((t, j) => j === i ? { ...t, param } : t) }))}
              onRemove={(i) => setState((s) => ({ ...s, targets: s.targets.filter((_, j) => j !== i) }))}
            />
          </div>

          <div className="panel">
            <h2>Skills already held <span className="count">{build.os.length}</span></h2>
            {build.os.length === 0 && <p className="muted">For an existing character, add skills with <b>Have</b>. Monster room or ritual powers go on a special creature or power card.</p>}
            <SkillRows
              rows={build.os.map((h) => ({ id: h.id, param: h.param, card: h.card, source: h.source, loresheet: h.loresheet }))}
              build={build}
              onParam={(i, param) => setBuild((b) => ({ ...b, os: b.os.map((h, j) => j === i ? { ...h, param } : h) }))}
              onSource={(i, source, loresheet) => setBuild((b) => ({ ...b, os: b.os.map((h, j) => j === i ? { ...h, source, loresheet } : h) }))}
              onRemove={(i) => setBuild((b) => ({ ...b, os: b.os.filter((_, j) => j !== i) }))}
            />
          </div>
        </section>

        <section className="col">
          <CardView build={build} result={result} />
          <Issues issues={result.issues} nameOf={(i) => result.skills[i]?.name} />
          {plan && <PlanView plan={plan} />}
          <p className="muted small">
            Rules: Lorien Trust Rules Handbook v4.06 and loresheets v4.06, summarised in the project's rules reference.
            {' '}{csById.size} Character Skills, {osById.size} Occupational Skills.
          </p>
        </section>
      </main>
    </div>
  )
}
