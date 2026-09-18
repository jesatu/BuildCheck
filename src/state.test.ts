import { expect, it } from 'vitest'
import { decodeState, emptyState, encodeState } from './state'

it('round-trips editor state through the URL hash, including non-ASCII text', () => {
  const s = emptyState()
  s.build.cs = { healing: 2 }
  s.targets = [{ id: 'script-master', param: 'Myth & Magic' }, { id: 'apprentice', param: 'Tänzer' }]
  s.retired = true
  expect(decodeState(encodeState(s))).toEqual(s)
  expect(decodeState('#b=not-valid')).toBeUndefined()
  expect(decodeState('')).toBeUndefined()
})
