import type { Race } from './types'

// Reference doc 3.1. Non-starting races are reached by ritual, which replaces the race on the card.

export const races: Race[] = [
  { id: 'human', name: 'Human', category: 'existential', startingRace: true, elementalWeakness: 'flame' },
  { id: 'beast', name: 'Beast', category: 'existential', startingRace: false, elementalWeakness: 'air', loresheet: 'beast' },
  { id: 'plant', name: 'Plant', category: 'existential', startingRace: false, elementalWeakness: 'water', loresheet: 'plant' },
  { id: 'mineral', name: 'Mineral', category: 'existential', startingRace: false, elementalWeakness: 'earth', loresheet: 'mineral' },
  { id: 'dwarf', name: 'Dwarf', category: 'elderRaces', startingRace: true, elementalWeakness: 'earth' },
  { id: 'elf', name: 'Elf', category: 'elderRaces', startingRace: true, elementalWeakness: 'flame' },
  { id: 'fey', name: 'Fey', category: 'elderRaces', startingRace: true, elementalWeakness: 'water' },
  { id: 'olog', name: 'Olog', category: 'elderRaces', startingRace: true, elementalWeakness: 'air' },
  { id: 'beastkin', name: 'Beastkin', category: 'youngerRaces', startingRace: true, elementalWeakness: 'air' },
  { id: 'drow', name: 'Drow', category: 'youngerRaces', startingRace: true, elementalWeakness: 'flame' },
  { id: 'halfling', name: 'Halfling', category: 'youngerRaces', startingRace: true, elementalWeakness: 'water' },
  { id: 'uruk', name: 'Uruk', category: 'youngerRaces', startingRace: true, elementalWeakness: 'earth', aliases: ['Uruck'] },
  { id: 'ancestral', name: 'Ancestral', category: 'planar', startingRace: false, elementalWeakness: 'water', loresheet: 'ancestral' },
  { id: 'daemon', name: 'Daemon', category: 'planar', startingRace: false, elementalWeakness: 'air', loresheet: 'daemon' },
  { id: 'elemental', name: 'Elemental', category: 'planar', startingRace: false, elementalWeakness: 'earth', loresheet: 'elemental' },
  { id: 'umbral', name: 'Umbral', category: 'planar', startingRace: true, elementalWeakness: 'flame' },
]

export const factions = [
  'Bears', 'Dragons', 'Gryphons', 'Harts', 'Jackals',
  'Lions', 'Tarantulas', 'Unicorns', 'Vipers', 'Wolves',
]
