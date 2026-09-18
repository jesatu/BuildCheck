// Scholar and Sage topics (HB "Research Occupational Skills"). A topic is "<category> (<subject>)".

const factions = ['Bears', 'Dragons', 'Gryphons', 'Harts', 'Jackals', 'Lions', 'Tarantulas', 'Unicorns', 'Vipers', 'Wolves']
const guilds = ['Alchemists', 'Bards', 'Bank', 'Casino', 'Mages', 'Incantors', 'Healers', 'Corruptors', 'Rangers', 'Armourers', 'Scouts', 'Militia']

export const researchCategories: Record<string, string[]> = {
  'History and Culture': [...factions, ...guilds, 'Elder Races', 'Dwarves', 'Elves', 'Fey', 'Ologs', 'Younger Races', 'Halflings', 'Drow', 'Beastkin', 'Uruks'],
  History: ['Humans', 'Umbrals', 'Magecraft', 'Incantation', 'Healing', 'Corruption', 'Summoning', 'Necromancy', 'Daemonology', 'Theology',
    'Elementalism', 'Empire', 'Irisia', 'Telluria', 'Siberja', 'Sicilja', 'Cathay', 'Nihon', 'Thousand Isles', 'Planes', 'Law', 'Chaos', 'Evil', 'Good',
    'Reality', 'Illusion', 'Fate', 'Fortune', 'Knowledge', 'Magic', 'Time', 'Spirit', 'Earth', 'Air', 'Fire', 'Water', 'Time of Legends', 'Pre-Imperial',
    'Imperial', 'Post Imperial'],
  'Ancestors and Legends': [...factions, ...guilds],
  'Skills and Abilities': [...guilds, 'Warfare and Tactics', 'Navigation and Sea Faring', 'Cosmology and Metaphysics', 'Geography and Cartography',
    'Construction', 'Iconic Items and Artefacts'],
  'Flora and Fauna': factions,
  'Essence Creatures': ['Werecreatures', 'Paladins', 'Warlocks', 'Vampires', 'Druids'],
  'Summonable Creatures': ['Unliving', 'Daemons', 'Elementals', 'Ancestrals'],
}
