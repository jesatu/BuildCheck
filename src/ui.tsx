import { useState } from 'react'
import {
  characterSkills, CS_LADDERS, csById, guildListById, guildLists, loresheetById, loresheets, occupationalSkills, osById, raceById, scriptFamilies,
  type CsGroup,
} from './data'
import { factions } from './data/races'
import { skillKey, type Build, type CardId, type SkillSource } from './engine/build'
import type { Plan } from './engine/plan'
import type { Issue, SkillStatus, ValidationResult } from './engine/validate'

const CS_GROUPS: Array<[CsGroup, string]> = [['weapon', 'Weapon'], ['armour', 'Armour'], ['knowledge', 'Knowledge'], ['power', 'Power']]
const ROUTE_LABEL = { buy: 'Buy', loresheet: 'Loresheet', architect: 'Architect', joat: 'Jack of All Trades' } as const
const CARD_LABEL: Record<CardId, string> = { character: 'Character card', creature: 'Special creature card', power: 'Special power card', loresheet: 'Granted by loresheets' }
const STATE_LABEL = { active: 'Active', inactive: 'Inactive', redundant: 'Redundant', replaced: 'Replaced', dropped: 'Off card' } as const

// ---------- Character Skills ----------

export function CsPanel({ build, setBuild, points: { spent, available } }: {
  build: Build
  setBuild: (f: (b: Build) => Build) => void
  points: { spent: number; available: number }
}) {
  const setLevel = (id: string, level: number) => setBuild((b) => {
    const cs = { ...b.cs }
    if (level) cs[id] = level
    else delete cs[id]
    return { ...b, cs }
  })
  return (
    <div className="panel">
      <h2>Character Skills <span className={`count ${spent > available ? 'bad' : ''}`}>{spent} / {available} points</span></h2>
      {CS_GROUPS.map(([group, label]) => (
        <fieldset key={group}>
          <legend>{label}</legend>
          {characterSkills.filter((s) => s.group === group).map((s) => {
            const level = build.cs[s.id] ?? 0
            const ladder = CS_LADDERS.find((l) => (l.skills as readonly string[]).includes(s.id))
            if (ladder) {
              // One choice per ladder: the higher skill replaces the lower (CS-8).
              if (ladder.skills[0] !== s.id) return null
              const chosen = ladder.skills.find((id) => build.cs[id]) ?? ''
              return (
                <label key={ladder.name} className="check">
                  <select aria-label={ladder.name} value={chosen}
                    onChange={(e) => setBuild((b) => {
                      const cs = { ...b.cs }
                      for (const id of ladder.skills) delete cs[id]
                      if (e.target.value) cs[e.target.value] = 1
                      return { ...b, cs }
                    })}>
                    <option value="">–</option>
                    {ladder.skills.map((id) => <option key={id} value={id}>{csById.get(id)!.name} ({csById.get(id)!.levelCosts[0]})</option>)}
                  </select>
                  <span className="grow">{ladder.name}</span><span className="cost">{chosen ? csById.get(chosen)!.levelCosts[0] : ''}</span>
                </label>
              )
            }
            return s.levelCosts.length === 1 ? (
              <label key={s.id} className="check" title={s.summary}>
                <input type="checkbox" checked={level > 0} onChange={(e) => setLevel(s.id, e.target.checked ? 1 : 0)} />
                <span className="grow">{s.name}</span><span className="cost">{s.levelCosts[0]}</span>
              </label>
            ) : (
              <label key={s.id} className="check" title={s.summary}>
                <select aria-label={s.name} value={level} onChange={(e) => setLevel(s.id, Number(e.target.value))}>
                  <option value={0}>–</option>
                  {s.levelCosts.map((c, i) => <option key={i} value={i + 1}>{i + 1} ({c})</option>)}
                </select>
                <span className="grow">{s.name}</span><span className="cost">{level ? s.levelCosts[level - 1] : ''}</span>
              </label>
            )
          })}
        </fieldset>
      ))}
    </div>
  )
}

// ---------- Skill picker ----------

export function SkillPicker({ build, onAdd, addPrereqs, onAddPrereqs }: {
  build: Build
  onAdd: (id: string, where: 'want' | 'held' | CardId) => void
  addPrereqs: boolean
  onAddPrereqs: (value: boolean) => void
}) {
  const [query, setQuery] = useState('')
  const [list, setList] = useState('all')
  const sheetSkills = new Map<string, string>() // skill id -> loresheet names that offer it
  for (const l of build.loresheets) {
    const ls = loresheetById.get(l.id)
    for (const e of ls?.skills ?? []) sheetSkills.set(e.os, [sheetSkills.get(e.os), ls!.name].filter(Boolean).join(', '))
  }
  const q = query.trim().toLowerCase()
  const matches = occupationalSkills
    .filter((s) => s.side !== 'none')
    .filter((s) => list === 'all' || (list === 'sheets' ? sheetSkills.has(s.id) : list === 'special' ? s.loresheetOnly : s.lists.includes(list as never)))
    .filter((s) => !q || s.name.toLowerCase().includes(q) || s.summary.toLowerCase().includes(q))
  const shown = matches.slice(0, 50)
  return (
    <div className="panel">
      <h2>
        Find skills
        <label className="check h2-option" title="When you add a skill with Have, also add the earlier skills it needs, as if bought along the normal route">
          <input type="checkbox" checked={addPrereqs} onChange={(e) => onAddPrereqs(e.target.checked)} />
          Add earlier skills
        </label>
      </h2>
      <div className="search">
        <input type="search" placeholder="Search skills…" aria-label="Search skills" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select aria-label="Filter by list" value={list} onChange={(e) => setList(e.target.value)}>
          <option value="all">All lists</option>
          {build.loresheets.length > 0 && <option value="sheets">On my loresheets</option>}
          {guildLists.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          <option value="special">Lammie or loresheet only</option>
        </select>
      </div>
      <ul className="rows picker">
        {shown.map((s) => (
          <li key={s.id} className="row">
            <div className="grow">
              <div>
                <b>{s.name}</b>{' '}
                <span className="meta">
                  {s.tier ? `T${s.tier} · ${s.cost} OSP` : 'loresheet'}{s.restricted && ' · restricted'}{s.side === 'left' && ' · left side'}
                </span>
              </div>
              <div className="meta">{s.summary}</div>
              <div className="meta">
                {s.lists.map((l) => guildListById.get(l)?.name).join(', ')}
                {sheetSkills.has(s.id) && <span className="tag">on {sheetSkills.get(s.id)}</span>}
              </div>
            </div>
            <div className="add-buttons">
              <button type="button" onClick={() => onAdd(s.id, 'want')} title="Plan a route to this skill">Want</button>
              <button type="button" className="quiet" onClick={() => onAdd(s.id, 'held')} title="Already on the character card">Have</button>
              <button type="button" className="quiet" onClick={() => onAdd(s.id, 'creature')} title="Granted on a special creature card">Creature</button>
              <button type="button" className="quiet" onClick={() => onAdd(s.id, 'power')} title="Granted on a special power card (monster room or ritual)">Power</button>
            </div>
          </li>
        ))}
      </ul>
      {matches.length > shown.length && <p className="muted small">Showing {shown.length} of {matches.length}. Search to narrow the list.</p>}
    </div>
  )
}

// ---------- Wanted / held rows ----------

export const FACTIONS_AND_GUILDS = [...factions, ...new Set(guildLists.flatMap((g) => g.guilds).map((g) => `${g} Guild`))]
function paramSuggestions(id: string): string[] {
  if (id === 'script-master') return Object.keys(scriptFamilies)
  if (id === 'translate-named-script') return Object.values(scriptFamilies).flat()
  if (id === 'oathsworn' || id === 'activate-item') return FACTIONS_AND_GUILDS
  if (id === 'general-knowledge') return ['Guildsman', 'Merchant', 'Rumour Monger', 'Storyteller', 'Wanderer', 'War Scout']
  return []
}

/** Params with a fixed list get a drop-down instead of free text. */
function paramChoices(id: string): string[] {
  if (id === 'awakened') return loresheets.filter((l) => l.kind === 'awakened').map((l) => l.name.replace(/^Awakened /, ''))
  return []
}

interface Row { id: string; param?: string; card?: CardId; source?: SkillSource; loresheet?: string }

export function SkillRows({ rows, build, onParam, onSource, onRemove }: {
  rows: Row[]
  build?: Build
  onParam: (i: number, param: string | undefined) => void
  onSource?: (i: number, source: SkillSource, loresheet?: string) => void
  onRemove: (i: number) => void
}) {
  return (
    <ul className="rows">
      {rows.map((r, i) => {
        const s = osById.get(r.id)!
        const suggestions = paramSuggestions(r.id)
        const choices = paramChoices(r.id)
        const sheets = build?.loresheets.filter((l) => loresheetById.get(l.id)?.skills.some((e) => e.os === r.id)) ?? []
        return (
          <li key={i} className="row">
            <span className="grow">
              {s.name}
              {r.card && r.card !== 'character' && <span className="tag">{CARD_LABEL[r.card]}</span>}
            </span>
            {s.param && choices.length > 0 && (
              <select className="param" aria-label={`${s.name}: ${s.param}`} value={r.param ?? ''} onChange={(e) => onParam(i, e.target.value || undefined)}>
                <option value="">{s.param}…</option>
                {choices.map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
            )}
            {s.param && !choices.length && (
              <>
                <input className="param" aria-label={`${s.name}: ${s.param}`} placeholder={s.param} value={r.param ?? ''}
                  list={suggestions.length ? `x-${r.id}` : undefined} onChange={(e) => onParam(i, e.target.value || undefined)} />
                {suggestions.length > 0 && <datalist id={`x-${r.id}`}>{suggestions.map((x) => <option key={x} value={x} />)}</datalist>}
              </>
            )}
            {onSource && r.source !== 'granted' && (
              <select aria-label={`How ${s.name} was gained`} value={r.source === 'loresheet' ? `ls:${r.loresheet}` : r.source}
                onChange={(e) => {
                  const v = e.target.value
                  onSource(i, v.startsWith('ls:') ? 'loresheet' : (v as SkillSource), v.startsWith('ls:') ? v.slice(3) : undefined)
                }}>
                <option value="buy">Bought</option>
                <option value="ritual">Ritual (no prerequisites)</option>
                {build?.loresheets.some((l) => l.id === 'architect') && <option value="architect">Architect</option>}
                {(build?.os.some((h) => h.id === 'jack-of-all-trades') || build?.loresheets.some((l) => l.id === 'awakened-human')) && <option value="joat">Jack of All Trades</option>}
                {sheets.map((l) => <option key={l.id} value={`ls:${l.id}`}>{loresheetById.get(l.id)?.name} loresheet</option>)}
              </select>
            )}
            <button type="button" className="remove" aria-label={`Remove ${s.name}`} onClick={() => onRemove(i)}>×</button>
          </li>
        )
      })}
    </ul>
  )
}

// ---------- Character card ----------

function SkillLine({ s, onToggleDrop }: { s: SkillStatus; onToggleDrop?: (key: string) => void }) {
  const detail = s.state === 'replaced' ? `Replaced by ${s.replacedBy}` : s.reason
  const canToggle = onToggleDrop && s.card === 'character' && s.state !== 'replaced'
  return (
    <li className={`skill ${s.state}`}>
      <span className="grow">{s.name}{s.tier && <span className="meta"> T{s.tier}</span>}</span>
      {s.state !== 'active' && <span className="state">{STATE_LABEL[s.state]}</span>}
      {canToggle && (
        <button type="button" className="drop" onClick={() => onToggleDrop(skillKey(s.id, s.param))}
          title={s.state === 'dropped' ? 'Put back on the card' : 'Take off the card; it still counts for prerequisites'}>
          {s.state === 'dropped' ? 'Restore' : 'Drop'}
        </button>
      )}
      {detail && <span className="detail">{detail}</span>}
    </li>
  )
}

export function CardView({ build, result, onToggleDrop }: { build: Build; result: ValidationResult; onToggleDrop: (key: string) => void }) {
  const [showReplaced, setShowReplaced] = useState(false)
  const onCard = (card: CardId) => result.skills.filter((s) => s.card === card && s.state !== 'dropped' && (showReplaced || s.state !== 'replaced'))
  const offCard = result.skills.filter((s) => s.state === 'dropped')
  const character = onCard('character')
  const left = character.filter((s) => s.side === 'left')
  const right = character.filter((s) => s.side === 'right')
  const counted = right.filter((s) => s.state !== 'replaced' && osById.get(s.id)?.countsTowardLimit).length
  const t5 = character.filter((s) => s.state !== 'replaced' && s.tier === 5).length
  const race = raceById.get(build.race)
  const d = result.derived
  const specials = (['creature', 'power', 'loresheet'] as const).filter((c) => onCard(c).length > 0 || (c === 'creature' && (race && !race.startingRace)))

  return (
    <div className="panel">
      <h2>Character card {result.valid ? <span className="ok">Legal</span> : <span className="bad">Not legal</span>}</h2>
      <p className="meta">
        {race?.name} · {build.pattern} pattern · {d.lhv} {d.lhv === 1 ? 'hit' : 'hits'} per location (base {d.baseLhv})
        {d.spellPower.total > 0 && ` · ${d.spellPower.total} Spell Power`}
        {d.powerRating.carried > 0 && ` · PR ${d.powerRating.carried}/${d.powerRating.limit}`}
      </p>
      <div className="card">
        <div>
          <h3>Left side</h3>
          <ul className="skills">
            {Object.entries(build.cs).map(([id, level]) => {
              const cs = characterSkills.find((c) => c.id === id)
              return <li key={id} className="skill active"><span className="grow">{cs?.name}{cs && cs.levelCosts.length > 1 ? ` ${level}` : ''}</span></li>
            })}
            {left.map((s) => <SkillLine key={s.index} s={s} onToggleDrop={onToggleDrop} />)}
          </ul>
        </div>
        <div>
          <h3>Right side <span className={`count ${counted > 12 ? 'bad' : ''}`}>{counted}/12</span>{t5 > 0 && <span className={`count ${t5 > 4 ? 'bad' : ''}`}>T5 {t5}/4</span>}</h3>
          <ul className="skills">{right.map((s) => <SkillLine key={s.index} s={s} onToggleDrop={onToggleDrop} />)}</ul>
          {right.length === 0 && <p className="muted small">No Occupational Skills yet.</p>}
        </div>
      </div>
      {specials.map((c) => (
        <div key={c} className="card special">
          <div>
            <h3>{CARD_LABEL[c]}{c === 'creature' && race && !race.startingRace && `: ${race.name}`}</h3>
            <ul className="skills">{onCard(c).map((s) => <SkillLine key={s.index} s={s} />)}</ul>
          </div>
        </div>
      ))}
      {offCard.length > 0 && (
        <div className="card special">
          <div>
            <h3>Off the card (kept for prerequisites)</h3>
            <ul className="skills">{offCard.map((s) => <SkillLine key={s.index} s={s} onToggleDrop={onToggleDrop} />)}</ul>
          </div>
        </div>
      )}
      <label className="check small">
        <input type="checkbox" checked={showReplaced} onChange={(e) => setShowReplaced(e.target.checked)} />
        Show replaced skills
      </label>
      <p className="legend small">
        <span className="skill inactive"><span className="state">Inactive</span></span> a use requirement is missing ·{' '}
        <span className="skill redundant"><span className="state">Redundant</span></span> covered by another skill
      </p>
    </div>
  )
}

// ---------- Issues and plan ----------

export function Issues({ issues, nameOf }: { issues: Issue[]; nameOf: (i: number) => string | undefined }) {
  if (issues.length === 0) return null
  const sorted = [...issues].sort((a, b) => (a.severity === b.severity ? 0 : a.severity === 'error' ? -1 : 1))
  return (
    <div className="panel">
      <h2>Rule checks</h2>
      <ul className="issues">
        {sorted.map((i, n) => (
          <li key={n} className={i.severity}>
            <b>{i.severity === 'error' ? 'Problem' : 'Note'}</b> {i.message}
            <span className="rule">{i.rule}{i.skill !== undefined && nameOf(i.skill) ? ` · ${nameOf(i.skill)}` : ''}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function PlanView({ plan, title, note }: { plan: Plan; title: string; note?: string }) {
  const years = [...new Set(plan.purchases.map((p) => p.year))].sort((a, b) => a - b)
  return (
    <div className="panel">
      <h2>{title} <span className="count">{plan.totalOsp} OSP · {plan.years} {plan.years === 1 ? 'year' : 'years'}{title === 'Spent so far' ? ' minimum' : ''}</span></h2>
      {note && <p className="muted small">{note}</p>}
      {plan.blockers.length > 0 && (
        <div className="blockers">
          <b>Can't plan until:</b>
          <ul>{plan.blockers.map((b) => <li key={b}>{b}</li>)}</ul>
        </div>
      )}
      {plan.purchases.length === 0 && <p className="muted">Everything wanted is already held.</p>}
      <ol className="years">
        {years.map((y) => {
          const buys = plan.purchases.filter((p) => p.year === y)
          const slots = buys.filter((p) => p.countsTowardYearly).length
          return (
            <li key={y}>
              <h3>Year {y} <span className="meta">{slots}/4 purchases · {buys.reduce((n, p) => n + p.cost, 0)} OSP</span></h3>
              <ul className="skills">
                {buys.map((p) => (
                  <li key={`${p.id}|${p.param}`} className="skill active">
                    <span className="grow">{p.name}{p.tier && <span className="meta"> T{p.tier}</span>}</span>
                    <span className={`route ${p.route}`}>{p.route === 'loresheet' ? loresheetById.get(p.loresheet!)?.name : ROUTE_LABEL[p.route]}</span>
                    <span className="cost">{p.cost}</span>
                    {(p.doubleStep || p.prebook || p.afterPrebook || !p.countsTowardYearly || p.notes.length > 0) && (
                      <span className="detail">
                        {[p.doubleStep && 'Retirement double step', p.prebook && 'Prebook (self-taught)', p.afterPrebook && 'At an event after its prebooked prerequisite', !p.countsTowardYearly && !p.doubleStep && 'Doesn\'t use a yearly purchase', ...p.notes].filter(Boolean).join(' · ')}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

