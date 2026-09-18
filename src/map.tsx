import { loresheetById, osById, osIdsIn, type Requirement } from './data'
import type { Build } from './engine/build'
import type { Plan, PlannedPurchase } from './engine/plan'
import { coveredBy, type SkillStatus, type ValidationResult } from './engine/validate'

// A picture of the character's skill journeys: one row per tree, prerequisites on the left.

interface Node {
  s: SkillStatus
  year?: number
  years: number[]
  planned: boolean
  route: string
  learn?: Requirement
  /** Route skipped the prerequisites (Architect, Ritual, granted). */
  skipped: boolean
  col: number
  row: number
}

const W = 190, H = 50, GX = 36, GY = 14, PAD = 12
const ROUTE_NAMES: Record<string, string> = { buy: 'Buy', loresheet: 'Loresheet', architect: 'Architect', joat: 'JoAT', ritual: 'Ritual', granted: 'Granted' }

export function BuildMap({ build, result, spent, plan }: { build: Build; result: ValidationResult; spent?: Plan; plan?: Plan }) {
  const past = spent?.years ?? 0
  const match = (ps: PlannedPurchase[] | undefined, s: SkillStatus) => ps?.find((p) => p.id === s.id && (p.param ?? '') === (s.param ?? ''))

  const nodes: Node[] = result.skills.filter((s) => s.card === 'character').map((s) => {
    const held = build.os[s.index]
    const planned = held ? undefined : match(plan?.purchases, s)
    const route = held?.source ?? planned?.route ?? 'buy'
    const sheet = route === 'loresheet' ? loresheetById.get(held?.loresheet ?? planned?.loresheet ?? '') : undefined
    const learn = route === 'loresheet' ? sheet?.skills.find((e) => e.os === s.id)?.learn : osById.get(s.id)?.learn
    const year = held ? match(spent?.purchases, s)?.year : planned ? past + planned.year : undefined
    // A skill bought more than once (Jack of All Trades is re-bought for each use) lists every year.
    const years = held ? (spent?.purchases ?? []).filter((p) => p.id === s.id && (p.param ?? '') === (s.param ?? '')).map((p) => p.year) : []
    return { s, year, years, planned: !held, route, learn, skipped: ['architect', 'ritual', 'granted'].includes(route), col: 0, row: 0 }
  })

  // Edges run from a prerequisite to the skill it unlocks. A skipped route still shows the handbook link, dotted.
  const find = (id: string, self: Node) =>
    nodes.find((n) => n !== self && n.s.id === id) ?? nodes.find((n) => n !== self && coveredBy(n.s.id).has(id))
  const edges: Array<{ from: Node; to: Node; skipped: boolean }> = []
  for (const n of nodes) {
    const req = n.skipped ? osById.get(n.s.id)?.learn : n.learn
    for (const id of new Set(osIdsIn(req))) {
      const from = find(id, n)
      if (from && !edges.some((e) => e.from === from && e.to === n)) edges.push({ from, to: n, skipped: n.skipped })
    }
  }

  // Trees are the connected groups of skills; skills with no links go together at the end.
  const group = new Map<Node, number>(nodes.map((n, i) => [n, i]))
  const root = (n: Node): number => { let g = group.get(n)!; while (group.get(nodes[g]!) !== g) g = group.get(nodes[g]!)!; return g }
  for (const e of edges) group.set(nodes[root(e.to)]!, root(e.from))
  const trees = [...new Set(nodes.map(root))].map((g) => nodes.filter((n) => root(n) === g))
  const linked = trees.filter((t) => t.length > 1).sort((a, b) => b.length - a.length)
  const single = trees.filter((t) => t.length === 1).flat()

  const depth = (n: Node, seen = new Set<Node>()): number => {
    if (seen.has(n)) return 0
    seen.add(n)
    return Math.max(0, ...edges.filter((e) => e.to === n).map((e) => depth(e.from, seen) + 1))
  }

  let y = 0
  const bands: Array<{ label: string; top: number }> = []
  for (const tree of linked) {
    const rows = new Map<number, number>()
    for (const n of [...tree].sort((a, b) => (a.year ?? 99) - (b.year ?? 99))) {
      n.col = depth(n)
      n.row = y + (rows.get(n.col) ?? 0)
      rows.set(n.col, (rows.get(n.col) ?? 0) + 1)
    }
    bands.push({ label: '', top: y })
    y += Math.max(...rows.values())
  }
  if (single.length) {
    bands.push({ label: 'Stand-alone skills', top: y })
    single.forEach((n, i) => { n.col = i % 4; n.row = y + Math.floor(i / 4) })
    y += Math.ceil(single.length / 4)
  }

  const cols = Math.max(4, ...nodes.map((n) => n.col + 1))
  const x = (n: Node) => PAD + n.col * (W + GX)
  const top = (n: Node) => PAD + n.row * (H + GY)
  const width = PAD * 2 + cols * (W + GX) - GX
  const height = PAD * 2 + Math.max(1, y) * (H + GY)

  if (nodes.length === 0) return <p className="muted">Add skills to see the map.</p>

  return (
    <div className="map-scroll">
      <svg className="build-map" width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img"
        aria-label="Skill trees: prerequisites on the left, the skills they unlock on the right">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" className="map-arrow" />
          </marker>
        </defs>
        {bands.slice(1).map((b) => <line key={b.top} x1={PAD} x2={width - PAD} y1={PAD + b.top * (H + GY) - GY / 2} y2={PAD + b.top * (H + GY) - GY / 2} className="map-divider" />)}
        {edges.map((e, i) => {
          const x1 = x(e.from) + W, y1 = top(e.from) + H / 2, x2 = x(e.to), y2 = top(e.to) + H / 2
          const mid = (x1 + x2) / 2
          return <path key={i} d={`M${x1},${y1} C${mid},${y1} ${mid},${y2} ${x2 - 2},${y2}`} className={`map-edge${e.skipped ? ' skipped' : ''}`} markerEnd="url(#arrow)" />
        })}
        {nodes.map((n) => {
          const sub = [n.years.length > 1 ? `Years ${n.years.join(', ')}` : n.year ? `Year ${n.year}${n.planned ? ' (planned)' : ''}` : n.planned ? 'Planned' : 'Held', ROUTE_NAMES[n.route] ?? n.route,
            n.s.state !== 'active' ? n.s.state === 'dropped' ? 'off card' : n.s.state : ''].filter(Boolean).join(' · ')
          return (
            <g key={n.s.index} transform={`translate(${x(n)},${top(n)})`} className={`map-node ${n.s.state}${n.planned ? ' planned' : ''}`}>
              <title>{`${n.s.name}${n.s.reason ? ` — ${n.s.reason}` : ''}${n.s.replacedBy ? ` — replaced by ${n.s.replacedBy}` : ''}`}</title>
              <rect width={W} height={H} rx={7} />
              <text x={10} y={20} className="map-name">{n.s.name.length > 26 ? `${n.s.name.slice(0, 25)}…` : n.s.name}</text>
              <text x={10} y={38} className="map-sub">{sub}</text>
              {n.s.tier && <text x={W - 10} y={20} textAnchor="end" className="map-sub">T{n.s.tier}</text>}
            </g>
          )
        })}
        {bands.filter((b) => b.label).map((b) => (
          <text key={b.label} x={width - PAD} y={PAD + b.top * (H + GY) - GY / 2 - 3} textAnchor="end" className="map-sub">{b.label}</text>
        ))}
      </svg>
    </div>
  )
}
