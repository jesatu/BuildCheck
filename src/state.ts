import { newBuild, type Build } from './engine/build'
import type { Target } from './engine/plan'

/** Everything the editor needs to rebuild the page. Stored in the URL hash, so reload and share both work. */
export interface EditorState {
  build: Build
  targets: Target[]
  retired: boolean
  /** Skills (skillKey) taken off the card: held or planned. */
  dropped: string[]
  /** Have also adds the skill's earlier (prerequisite) skills. */
  addPrereqs: boolean
  /** Plan with prebook each season (C20). */
  prebook: boolean
}

export const emptyState = (): EditorState => ({ build: newBuild(), targets: [], retired: false, dropped: [], addPrereqs: true, prebook: true })

const PREFIX = '#b='

export function encodeState(s: EditorState): string {
  const bytes = new TextEncoder().encode(JSON.stringify(s))
  return PREFIX + btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeState(hash: string): EditorState | undefined {
  if (!hash.startsWith(PREFIX)) return undefined
  try {
    const b64 = hash.slice(PREFIX.length).replace(/-/g, '+').replace(/_/g, '/')
    const json = new TextDecoder().decode(Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)))
    const s = JSON.parse(json) as Partial<EditorState>
    return { ...emptyState(), ...s, build: { ...newBuild(), ...s.build } }
  } catch {
    return undefined
  }
}
