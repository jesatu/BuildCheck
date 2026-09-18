import type { GuildList } from './types'

// Reference doc 3.3 and 9. All handbook lists are marked Ω.

export const guildLists: GuildList[] = [
  { id: 'alchemists', name: 'Alchemists Guild', guilds: ['Alchemists'], jackOfAllTrades: true },
  { id: 'armourers', name: 'Armourers Guild', guilds: ['Armourers'], jackOfAllTrades: true },
  { id: 'bards', name: 'Bards Guild', guilds: ['Bards'], jackOfAllTrades: true },
  { id: 'casino', name: 'Casino Guild', guilds: ['Casino'], jackOfAllTrades: true },
  { id: 'corruptors', name: 'Corruptors Guild', guilds: ['Corruptors'], jackOfAllTrades: true },
  { id: 'healers', name: 'Healers Guild', guilds: ['Healers'], jackOfAllTrades: true },
  { id: 'incantors', name: 'Incantors Guild', guilds: ['Incantors'], jackOfAllTrades: true },
  { id: 'mages', name: 'Mages Guild', guilds: ['Mages'], jackOfAllTrades: true },
  { id: 'militia', name: 'Militia Guild', guilds: ['Militia'], jackOfAllTrades: true },
  { id: 'rangers', name: 'Rangers Guild', guilds: ['Rangers'], jackOfAllTrades: true },
  { id: 'scouts', name: 'Scouts Guild', guilds: ['Scouts'], jackOfAllTrades: true },
  { id: 'bank', name: 'Bank of Erdreja', guilds: ['Bank'], jackOfAllTrades: true },
  { id: 'knowledge', name: 'Knowledge Guilds', guilds: ['Alchemists', 'Bank', 'Bards', 'Casino'], jackOfAllTrades: true },
  { id: 'arcane', name: 'Arcane Guilds', guilds: ['Corruptors', 'Healers', 'Incantors', 'Mages'], jackOfAllTrades: true },
  { id: 'martial', name: 'Martial Guilds', guilds: ['Armourers', 'Militia', 'Rangers', 'Scouts'], jackOfAllTrades: true },
  { id: 'generic', name: 'Generic', guilds: [], jackOfAllTrades: false },
]
