import { anyArmourCs, anyMagicCs } from './character-skills'
import { loresheets } from './loresheets'
import type { GuildListId, OccupationalSkill, Requirement, Tier } from './types'

// Reference doc sections 9, 10 and 11. One entry per skill; guild lists are recorded on the skill.
// Learn prerequisites define trees (OS-2). Replacement is only recorded where the text says so (REP-2a).

const os = (id: string, param?: string): Requirement => (param ? { os: id, param } : { os: id })
const cs = (id: string, level?: number): Requirement => (level ? { cs: id, level } : { cs: id })
const all = (...r: Requirement[]): Requirement => ({ all: r })
const any = (...r: Requirement[]): Requirement => ({ any: r })
const ls: Requirement = { loresheet: '*' } // "Lammie or loresheet": satisfied by any loresheet or card granting it

const canCastRepairUnliving = any(
  cs('corruption'),
  all(cs('incantation'), any(os('dark-incantation'), os('cast-all-incantation'))),
)
const poisonOrPotionLore = any(cs('poison-lore'), cs('potion-lore'))

type Draft = Omit<OccupationalSkill, 'side' | 'countsTowardLimit' | 'exemptFromYearly' | 'restricted' | 'loresheetOnly' | 'lists'> &
  Partial<Pick<OccupationalSkill, 'side' | 'countsTowardLimit' | 'exemptFromYearly' | 'restricted' | 'loresheetOnly' | 'lists'>>

/** Standard purchasable skill on one or more handbook lists. */
function skill(tier: Tier, cost: number, lists: GuildListId[], d: Omit<Draft, 'tier' | 'cost' | 'lists'>): OccupationalSkill {
  return {
    side: 'right', countsTowardLimit: true, exemptFromYearly: false, restricted: false, loresheetOnly: false,
    tier, cost, lists, ...d,
  }
}

/** `#` skill with no handbook tier or cost: bought from a loresheet or granted. */
function special(d: Omit<Draft, 'tier' | 'cost' | 'lists'>): OccupationalSkill {
  return {
    side: 'right', countsTowardLimit: true, exemptFromYearly: false, restricted: false, loresheetOnly: true,
    lists: [], ...d,
  }
}

export const occupationalSkills: OccupationalSkill[] = [
  // ---- Spell Power (Arcane) ----
  skill(1, 10, ['arcane'], { id: 'spell-power-4', name: '+4 Spell Power', summary: '+4 Spell Power per day (Rule of Double).', source: 'HB p.84' }),
  skill(2, 20, ['arcane'], { id: 'spell-power-8', name: '+8 Spell Power', learn: os('spell-power-4'), replaces: ['spell-power-4'], summary: '+8 Spell Power per day.', source: 'HB p.84' }),
  skill(4, 40, ['arcane'], { id: 'spell-power-12', name: '+12 Spell Power', learn: os('spell-power-8'), replaces: ['spell-power-8'], summary: '+12 Spell Power per day.', source: 'HB p.84' }),
  skill(5, 50, ['arcane'], { id: 'spell-power-16', name: '+16 Spell Power', restricted: true, learn: os('spell-power-12'), replaces: ['spell-power-12'], summary: '+16 Spell Power per day.', source: 'HB p.84' }),

  // ---- Generic ----
  skill(5, 50, ['generic'], { id: 'lhv-1', name: '+1 LHV', restricted: true, use: any(cs('body-development', 2), ls), summary: '+1 LHV (Rule of Double).', source: 'HB p.84' }),
  skill(1, 10, ['generic'], {
    id: 'oathsworn', name: '<X> Oathsworn', param: 'Faction or Guild', restricted: true,
    learn: { flag: 'factionPermission' }, side: 'left', countsTowardLimit: false, exemptFromYearly: true, mainEventOnly: true,
    summary: 'Sworn to faction or guild X. Max 1 faction and 1 guild (LIM-7).', source: 'HB p.85',
  }),
  skill(2, 20, ['generic'], { id: 'activate-item', name: 'Activate <X> Item', param: 'Faction or Guild', restricted: true, learn: os('oathsworn'), summary: 'Activate items belonging to X. Revocable.', source: 'HB p.85' }),
  skill(5, 50, ['generic'], {
    id: 'command', name: '<X> Command', param: 'Faction or Guild', restricted: true, use: ls,
    side: 'none', countsTowardLimit: false,
    includes: ['oathsworn', 'activate-item', 'immune-lethal-alchemical-venoms', 'tutor'],
    summary: 'Never on a player card: recorded on an unpublished NPC/DPC loresheet (ruling).', source: 'HB p.84',
  }),
  skill(1, 10, ['generic'], { id: 'apprentice', name: 'Apprentice <X>', param: 'Profession', side: 'left', countsTowardLimit: false, exemptFromYearly: true, summary: 'Income: +1 Gold per Gathering.', source: 'HB p.85' }),
  skill(2, 20, ['generic'], { id: 'journeyman', name: 'Journeyman <X>', param: 'Profession', learn: os('apprentice'), replaces: ['apprentice'], side: 'left', countsTowardLimit: false, exemptFromYearly: true, summary: 'Income: +2 Gold per Gathering.', source: 'HB p.93' }),
  skill(3, 30, ['generic'], { id: 'master', name: 'Master <X>', param: 'Profession', learn: os('journeyman'), replaces: ['journeyman'], side: 'left', countsTowardLimit: false, exemptFromYearly: true, summary: 'Income: +4 Gold per Gathering.', source: 'HB p.93' }),
  skill(2, 20, ['armourers', 'militia', 'scouts', 'generic'], { id: 'immune-repel', name: 'Immune to Repel', summary: 'Immune to Repel.', source: 'HB p.92' }),
  skill(3, 30, ['armourers', 'militia', 'scouts', 'generic'], { id: 'immune-repel-strikedown', name: 'Immune to Repel and Strikedown', learn: os('immune-repel'), replaces: ['immune-repel'], summary: 'Immune to Repel and Strikedown.', source: 'HB p.92' }),
  skill(5, 50, ['scouts', 'generic'], { id: 'immune-immobilisation', name: 'Immune to Immobilisation', restricted: true, learn: os('immune-repel-strikedown'), covers: ['immune-paralysis'], summary: 'Immune to all Immobilisation (not Petrify).', source: 'HB p.92' }),
  skill(2, 20, ['generic'], { id: 'scholar', name: 'Scholar <X>', param: 'Research topic', side: 'left', countsTowardLimit: false, summary: 'Research on topic X. Up to 2 topics (LIM-6).', source: 'HB p.96' }),
  skill(4, 40, ['generic'], { id: 'sage', name: 'Sage <X>', param: 'Research topic', restricted: true, learn: all(os('scholar'), { flag: 'researchRequest' }), replaces: ['scholar'], side: 'left', countsTowardLimit: false, mainEventOnly: true, summary: 'Better research on topic X (same topic as Scholar). Buy once.', source: 'HB p.96' }),
  skill(1, 10, ['generic'], { id: 'awakened', name: 'Awakened <X>', param: 'Race', restricted: true, learn: { flag: 'awakenedRite' }, use: ls, summary: 'Special creature evolution of the base race. Blocks other special creature types.', source: 'HB p.86' }),
  skill(4, 40, ['generic'], { id: 'tutor', name: 'Tutor', restricted: true, summary: 'Teach 1 OS (up to T4) per main event.', source: 'HB p.98' }),
  skill(2, 20, ['generic'], { id: 'magical-armour-mastery', name: 'Magical Armour Mastery', learn: anyArmourCs, use: anyArmourCs, summary: 'Armour Mastery skills also apply to Magical Armour.', source: 'HB p.93' }),
  skill(3, 30, ['generic'], { id: 'escape-bonds', name: 'Escape Bonds', summary: 'Escape in-character bonds in 1 minute.', source: 'HB p.90' }),
  skill(3, 30, ['generic'], { id: 'shield-dismiss-level', name: 'Shield Dismiss Level', restricted: true, summary: 'Discerns against you need a second attempt, and you notice.', source: 'HB p.96' }),
  skill(4, 40, ['generic'], { id: 'fearsome-aspect', name: 'Fearsome Aspect', restricted: true, summary: 'Innate Mass Fear for 4 own Spell Power.', source: 'HB p.90' }),
  skill(5, 85, ['generic'], { id: 'treewalker', name: 'Treewalker', restricted: false, loresheetOnly: true, learn: os('perform-transport-rite'), use: all(any(cs('ritual-magic'), os('perform-transport-rite')), { not: cs('corruption') }, { not: { pattern: 'unliving' } }), summary: 'Use the Tree Network. See also the Treewalker loresheet (L11).', source: 'HB p.97' }),
  skill(5, 85, ['generic'], { id: 'voidportal', name: 'Voidportal', loresheetOnly: true, use: ls, summary: 'Voidportal loresheet: Perform Teleport Rite and Spell Reduction (2) on Teleport.', source: 'HB p.98' }),
  skill(5, 85, ['generic'], { id: 'circle-warden', name: 'Circle Warden', restricted: true, loresheetOnly: true, summary: 'Circle Warden ability.', source: 'HB p.87' }),
  skill(5, 85, ['generic'], { id: 'circle-watcher', name: 'Circle Watcher', loresheetOnly: true, use: os('command', 'Watchers'), summary: 'Circle Watcher ability.', source: 'HB p.87' }),
  skill(2, 25, ['generic'], { id: 'herb-lore-improved', name: 'Herb Lore (Improved)', loresheetOnly: true, learn: os('herb-lore'), use: ls, replaces: ['herb-lore'], summary: '24 herbs per day.', source: 'HB p.91' }),
  skill(3, 30, ['generic'], { id: 'advanced-armour-repair', name: 'Advanced Armour Repair', loresheetOnly: true, use: anyArmourCs, replaces: ['quick-armour-repair'], summary: 'Half repair time; one location to full in 1 minute.', source: 'HB p.85' }),
  skill(4, 40, ['generic'], { id: 'master-armour-repair', name: 'Master Armour Repair', loresheetOnly: true, learn: os('advanced-armour-repair'), use: anyArmourCs, replaces: ['advanced-armour-repair'], summary: 'Half repair time; all locations to full in 2 minutes.', source: 'HB p.93' }),
  skill(4, 20, ['generic'], { id: 'mighty-blow-brutish', name: 'Mighty Blow (from Brutish Strike)', loresheetOnly: true, learn: os('brutish-strike'), use: cs('large-weapon'), replaces: ['brutish-strike'], excludes: ['goblin-resilience'], summary: 'As Mighty Blow. Loresheet route at 20 OSP (E13).', source: 'HB p.83' }),
  skill(5, 25, ['generic'], { id: 'crushing-blow-focused', name: 'Crushing Blow (from Focused Strike)', loresheetOnly: true, learn: os('focused-strike'), use: cs('large-weapon'), replaces: ['focused-strike'], excludes: ['goblin-resilience'], summary: 'As Crushing Blow. Loresheet route at 25 OSP (E13).', source: 'HB p.83' }),

  // ---- Alchemists ----
  skill(2, 20, ['alchemists'], { id: 'create-poison-novice', name: 'Create Poison (Novice)', learn: cs('poison-lore'), use: cs('poison-lore'), summary: '1 × L1 poison per event.', source: 'HB p.87' }),
  skill(3, 30, ['alchemists'], { id: 'create-poison-artisan', name: 'Create Poison (Artisan)', learn: all(os('create-poison-novice'), cs('poison-lore')), use: cs('poison-lore'), replaces: ['create-poison-novice'], summary: 'L1 + L2 poison.', source: 'HB p.87' }),
  skill(4, 40, ['alchemists'], { id: 'create-poison-master', name: 'Create Poison (Master)', learn: all(os('create-poison-artisan'), cs('poison-lore')), use: cs('poison-lore'), replaces: ['create-poison-artisan'], summary: 'L1–L3 poison.', source: 'HB p.87' }),
  skill(5, 50, ['alchemists'], { id: 'create-poison-magical', name: 'Create Poison (Magical)', restricted: true, learn: all(os('create-poison-master'), cs('poison-lore')), use: cs('poison-lore'), replaces: ['create-poison-master'], summary: 'L1–L3 + 1 magical poison; 1 tailored per year.', source: 'HB p.87' }),
  skill(2, 20, ['alchemists'], { id: 'create-potion-novice', name: 'Create Potion (Novice)', learn: cs('potion-lore'), use: cs('potion-lore'), summary: '1 × L1 potion per event.', source: 'HB p.88' }),
  skill(3, 30, ['alchemists'], { id: 'create-potion-artisan', name: 'Create Potion (Artisan)', learn: all(os('create-potion-novice'), cs('potion-lore')), use: cs('potion-lore'), replaces: ['create-potion-novice'], summary: 'L1 + L2 potion.', source: 'HB p.88' }),
  skill(4, 40, ['alchemists'], { id: 'create-potion-master', name: 'Create Potion (Master)', learn: all(os('create-potion-artisan'), cs('potion-lore')), use: cs('potion-lore'), replaces: ['create-potion-artisan'], summary: 'L1–L3 potion.', source: 'HB p.88' }),
  skill(5, 50, ['alchemists'], { id: 'create-potion-magical', name: 'Create Potion (Magical)', restricted: true, learn: all(os('create-potion-master'), cs('potion-lore')), use: cs('potion-lore'), replaces: ['create-potion-master'], summary: 'L1–L3 + 1 magical potion; 1 tailored per year.', source: 'HB p.88' }),
  skill(1, 10, ['alchemists'], { id: 'create-reagents', name: 'Create Reagents', learn: poisonOrPotionLore, use: poisonOrPotionLore, summary: '1 reagent per event.', source: 'HB p.88' }),
  skill(2, 20, ['alchemists'], { id: 'create-reagents-improved', name: 'Create Reagents (Improved)', learn: os('create-reagents'), use: poisonOrPotionLore, replaces: ['create-reagents'], summary: '2 reagents per event.', source: 'HB p.88' }),
  skill(4, 40, ['alchemists'], { id: 'increased-alchemical-production', name: 'Increased Alchemical Production', learn: os('create-reagents-improved'), use: poisonOrPotionLore, replaces: ['create-reagents-improved'], summary: 'Own alchemy counts as made with reagents.', source: 'HB p.93' }),
  skill(1, 10, ['alchemists'], { id: 'create-antidotes', name: 'Create Antidotes', learn: poisonOrPotionLore, use: poisonOrPotionLore, summary: '1 × L1 antidote or protection potion per event.', source: 'HB p.87' }),
  skill(3, 30, ['alchemists'], { id: 'create-antidotes-improved', name: 'Create Antidotes (Improved)', learn: os('create-antidotes'), use: poisonOrPotionLore, replaces: ['create-antidotes'], summary: 'Up to 3 × L1 or L2 per event.', source: 'HB p.87' }),
  skill(1, 10, ['alchemists', 'bards', 'healers'], { id: 'herb-lore', name: 'Herb Lore', summary: '12 herbs per day (herb loresheet).', source: 'HB p.91' }),
  skill(3, 30, ['alchemists', 'rangers', 'scouts'], { id: 'oiled-weapons', name: 'Oiled Weapons', learn: os('immune-fumble'), summary: 'Apply weapon oils to own weapons without Poison Lore.', source: 'HB p.94' }),
  skill(4, 40, ['alchemists', 'scouts'], { id: 'master-poisoner', name: 'Master Poisoner', use: cs('poison-lore'), summary: 'Contact poisons, poison immobilised targets and food (referee).', source: 'HB p.94' }),
  skill(3, 30, ['alchemists'], { id: 'forensic-analysis', name: 'Forensic Analysis', summary: 'Examine a body for poison, race, pattern and potions.', source: 'HB p.90' }),
  skill(4, 40, ['alchemists'], { id: 'immune-lethal-alchemical-venoms', name: 'Immune to Lethal Alchemical Venoms', summary: 'Immune to non-magical lethal venoms.', source: 'HB p.92' }),

  // ---- Armourers ----
  skill(1, 10, ['armourers'], { id: 'armoursmith-apprentice', name: 'Armoursmith (Apprentice)', summary: '1 × L1 armour or shield per event; 1 reforge.', source: 'HB p.85' }),
  skill(2, 20, ['armourers'], { id: 'repair-enchanted-items', name: 'Repair Enchanted Items', learn: os('armoursmith-apprentice'), replaces: ['armoursmith-apprentice'], summary: '1 × L1 armour or shield; repair crafted shields.', source: 'HB p.95' }),
  skill(4, 40, ['armourers'], { id: 'armoursmith-artisan', name: 'Armoursmith (Artisan)', learn: os('repair-enchanted-items'), replaces: ['repair-enchanted-items'], summary: 'L1 + L2 (2 items); 2 reforges.', source: 'HB p.85' }),
  skill(5, 50, ['armourers'], { id: 'armoursmith-master', name: 'Armoursmith (Master)', restricted: true, learn: os('armoursmith-artisan'), replaces: ['armoursmith-artisan'], summary: 'L1–L3 (3 items); 3 reforges; repair any shield.', source: 'HB p.85' }),
  skill(1, 10, ['armourers'], { id: 'weaponsmith-apprentice', name: 'Weaponsmith (Apprentice)', summary: '1 × L1 weapon or shield per event; 1 reforge.', source: 'HB p.98' }),
  skill(2, 20, ['armourers'], { id: 'repair-destroyed-items', name: 'Repair Destroyed Items', learn: os('weaponsmith-apprentice'), replaces: ['weaponsmith-apprentice'], summary: '1 × L1 weapon or shield; repair crafted weapons and shields.', source: 'HB p.95' }),
  skill(4, 40, ['armourers'], { id: 'weaponsmith-artisan', name: 'Weaponsmith (Artisan)', learn: os('repair-destroyed-items'), replaces: ['repair-destroyed-items'], summary: 'L1 + L2 (2 items); 2 reforges.', source: 'HB p.98' }),
  skill(5, 50, ['armourers'], { id: 'weaponsmith-master', name: 'Weaponsmith (Master)', restricted: true, learn: os('weaponsmith-artisan'), replaces: ['weaponsmith-artisan'], summary: 'L1–L3 (3 items); 3 reforges; repair any weapon or shield.', source: 'HB p.98' }),
  skill(4, 40, ['armourers', 'militia'], { id: 'mighty-blow', name: 'Mighty Blow', learn: os('immune-repel-strikedown'), use: cs('large-weapon'), replaces: ['immune-repel-strikedown'], excludes: ['goblin-resilience'], summary: 'Strikedown with a large weapon; immune to Repel and Strikedown. Replaces Immune to Repel and Strikedown (ruling C13).', source: 'HB p.94' }),
  skill(5, 50, ['armourers', 'militia'], { id: 'crushing-blow', name: 'Crushing Blow', restricted: true, learn: os('mighty-blow'), use: cs('large-weapon'), replaces: ['mighty-blow'], excludes: ['goblin-resilience'], summary: 'Crush or Strikedown with a large weapon; immune to Repel and Strikedown.', source: 'HB p.88' }),
  skill(1, 10, ['armourers'], { id: 'additional-reforging', name: 'Additional Reforging', summary: '+1 reforge on own crafted items.', source: 'HB p.85' }),
  skill(3, 30, ['armourers'], { id: 'spell-tempering', name: 'Spell Tempering', learn: os('additional-reforging'), summary: '1 spell-tempered item per event.', source: 'HB p.96' }),
  skill(3, 30, ['armourers', 'militia'], { id: 'shield-mastery', name: 'Shield Mastery', use: cs('shield'), summary: 'Parrying Normal Crush does not destroy the shield.', source: 'HB p.96' }),
  skill(4, 40, ['armourers', 'militia'], { id: 'shield-mastery-expert', name: 'Shield Mastery (Expert)', learn: os('shield-mastery'), use: cs('shield'), replaces: ['shield-mastery'], summary: 'Also Enchanted (non-Artefact) Crush.', source: 'HB p.96' }),

  // ---- Bards / Casino ----
  skill(2, 20, ['bards', 'casino'], { id: 'detect-remove-beguile', name: 'Detect and Remove Beguile', summary: 'Detect and remove Beguile through conversation.', source: 'HB p.89' }),
  skill(3, 30, ['bards', 'casino'], { id: 'immune-charms', name: 'Immune to Charms', learn: os('detect-remove-beguile'), summary: 'Immune to Befriend, Beguile, Enthral and Enthral Unliving.', source: 'HB p.92' }),
  skill(4, 40, ['bards', 'casino'], { id: 'cast-mass-charms', name: 'Cast Mass Charms', learn: os('immune-charms'), replaces: ['immune-charms'], summary: 'Immune to Charms; cast Befriend/Enthral/Enthral Unliving as L3 mass.', source: 'HB p.87' }),
  skill(5, 50, ['bards'], { id: 'beguile', name: 'Beguile', restricted: true, learn: all(os('cast-mass-charms'), os('detect-remove-beguile')), replaces: ['detect-remove-beguile'], covers: ['immune-charms'], summary: 'Detect/remove Beguile; immune to Charms; innate Beguile for 4 power.', source: 'HB p.86' }),
  skill(1, 10, ['bards', 'casino', 'corruptors', 'incantors', 'militia'], { id: 'immune-fear', name: 'Immune to Fear', summary: 'Immune to Fear.', source: 'HB p.92' }),
  skill(2, 20, ['bards', 'casino', 'militia'], { id: 'immune-mute', name: 'Immune to Mute', learn: os('immune-fear'), summary: 'Immune to Mute.', source: 'HB p.92' }),
  skill(4, 40, ['bards', 'casino', 'militia'], { id: 'rally', name: 'Rally', restricted: true, learn: all(os('immune-mute'), os('immune-fear')), replaces: ['immune-fear'], summary: 'Immune to Fear; Mass Remove Fear once per 10 minutes.', source: 'HB p.95' }),
  skill(5, 50, ['bards', 'casino', 'militia', 'bank'], { id: 'immune-mind-effects', name: 'Immune to Mind Effects', restricted: true, learn: os('rally'), covers: ['immune-fear', 'immune-befriend-confusion', 'immune-sleep', 'immune-charms'], summary: 'Immune to all Mind effects.', source: 'HB p.92' }),
  skill(2, 20, ['bards'], { id: 'sleepless-chanting', name: 'Sleepless Chanting', summary: 'Immune to Sleep while chanting.', source: 'HB p.96' }),
  skill(3, 30, ['bards'], { id: 'unending-voice', name: 'Unending Voice', learn: os('sleepless-chanting'), replaces: ['sleepless-chanting'], summary: 'Spell Reduction (1) on Chants; immune to Sleep while chanting.', source: 'HB p.98' }),
  skill(1, 10, ['bards', 'scouts'], { id: 'translate-named-script', name: 'Translate Named Script <X>', param: 'Script', summary: 'Translate one named script.', source: 'HB p.97' }),
  skill(4, 40, ['bards', 'scouts'], { id: 'written-forgery', name: 'Written Forgery', learn: all(os('translate-named-script'), cs('recognise-forgery')), summary: 'Forged training: 1 × T1–3 including restricted, once per event.', source: 'HB p.98' }),
  skill(5, 50, ['bards', 'scouts'], { id: 'forgery', name: 'Forgery', restricted: true, learn: all(os('written-forgery'), cs('recognise-forgery')), replaces: ['written-forgery'], summary: 'Forge 1 item per event; forged training 2 × T1–3 or 1 × T4.', source: 'HB p.90' }),
  skill(3, 30, ['bards'], { id: 'script-master', name: 'Script Master <X>', param: 'Regional & Historical, People & Race or Myth & Magic', learn: os('translate-named-script'), replaces: ['translate-named-script'], summary: 'All scripts in one category. Replaces the TNS skills in that family (see scripts.ts).', source: 'HB p.96' }),
  skill(5, 70, ['bards'], { id: 'polyglot', name: 'Polyglot', restricted: true, learn: os('script-master'), replaces: ['script-master'], summary: 'All scripts in all three categories (70 OSP as printed, E12).', source: 'HB p.95' }),
  skill(3, 30, ['bards', 'rangers'], { id: 'immune-befriend-confusion', name: 'Immune to Befriend and Confusion', summary: 'Immune to Befriend and Confusion.', source: 'HB p.92' }),
  skill(2, 20, ['casino', 'scouts', 'bank'], { id: 'conceal-item', name: 'Conceal Item', summary: 'Conceal 1 item; only Locate finds it.', source: 'HB p.87' }),
  skill(3, 30, ['casino'], { id: 'conceal-item-improved', name: 'Conceal Item (Improved)', learn: os('conceal-item'), replaces: ['conceal-item'], includes: ['conceal-item'], summary: 'Or conceal a pouch of up to 50 coins.', source: 'HB p.87' }),
  skill(2, 20, ['casino', 'militia', 'scouts', 'bank'], { id: 'locate', name: 'Locate', summary: '30 s search; reveals concealed items.', source: 'HB p.93' }),
  skill(1, 10, ['casino', 'mages'], { id: 'perform-transport-rite', name: 'Perform Transport Rite', use: anyMagicCs, summary: 'Adds Transportation to spell lists.', source: 'HB p.95' }),
  skill(5, 50, ['casino'], { id: 'perform-teleport-rite', name: 'Perform Teleport Rite', restricted: true, learn: os('perform-transport-rite'), use: anyMagicCs, replaces: ['perform-transport-rite'], summary: 'Adds Transportation and Teleport; Spell Reduction (1) on Teleport.', source: 'HB p.94' }),

  // ---- Corruptors / Healers ----
  skill(1, 10, ['corruptors'], { id: 'revitalise-unliving', name: 'Revitalise Unliving', use: canCastRepairUnliving, summary: 'Repair Unliving covers all locations (not mortal wounds).', source: 'HB p.95' }),
  skill(2, 20, ['corruptors'], { id: 'repair-unliving-advanced', name: 'Repair Unliving (Advanced)', learn: os('revitalise-unliving'), use: canCastRepairUnliving, replaces: ['revitalise-unliving'], summary: 'Chant of Repair Unliving covers all locations; remove debilitation.', source: 'HB p.95' }),
  skill(4, 40, ['corruptors', 'healers'], { id: 'mind-healing', name: 'Mind Healing', learn: any(os('advanced-healing'), os('repair-unliving-advanced')), includes: ['immune-sleep'], summary: 'Discern and remove Mind effects; includes Immune to Sleep.', source: 'HB p.94' }),
  skill(5, 50, ['corruptors'], { id: 'source-of-unlife', name: 'Source of Unlife', restricted: true, learn: all(os('mind-healing'), os('repair-unliving-advanced')), use: cs('corruption', 2), replaces: ['repair-unliving-advanced'], includes: ['repair-unliving-advanced', 'mind-healing'], summary: 'Cast Total Repair Unliving without High Magic.', source: 'HB p.96' }),
  skill(2, 20, ['corruptors'], { id: 'mortician', name: 'Mortician', use: cs('triage-advanced'), summary: 'Triage (Advanced) works on corporeal unliving.', source: 'HB p.94' }),
  skill(4, 40, ['corruptors'], { id: 'mortician-expert', name: 'Mortician (Expert)', learn: os('mortician'), use: cs('triage-advanced'), replaces: ['mortician'], summary: 'Mortician actions take 30 s.', source: 'HB p.94' }),
  skill(1, 10, ['corruptors', 'incantors'], { id: 'dismiss-control-2', name: 'Dismiss/Control +2', summary: '+2 to Dismiss and Control totals.', source: 'HB p.89' }),
  skill(2, 20, ['corruptors', 'incantors'], { id: 'dismiss-control-4', name: 'Dismiss/Control +4', learn: os('dismiss-control-2'), replaces: ['dismiss-control-2'], summary: '+4 to Dismiss and Control totals.', source: 'HB p.89' }),
  skill(4, 40, ['corruptors', 'incantors'], { id: 'dismiss-control-6', name: 'Dismiss/Control +6', learn: os('dismiss-control-4'), replaces: ['dismiss-control-4'], summary: '+6 to Dismiss and Control totals.', source: 'HB p.89' }),
  // E1: printed prerequisite is "+8"; corrected to +6.
  skill(5, 50, ['corruptors', 'incantors'], { id: 'dismiss-control-8', name: 'Dismiss/Control +8', restricted: true, learn: os('dismiss-control-6'), replaces: ['dismiss-control-6', 'dismiss-control-4'], summary: '+8 to Dismiss and Control totals.', source: 'HB p.89' }),
  skill(3, 30, ['corruptors', 'healers'], { id: 'heal-alien-aberrant', name: 'Heal Alien or Aberrant Pattern', use: any(cs('healing'), cs('corruption')), summary: 'Cure effects work on alien and aberrant patterns.', source: 'HB p.91' }),
  skill(5, 50, ['corruptors', 'healers'], { id: 'heal-magical-pattern', name: 'Heal Magical Pattern', restricted: true, learn: os('heal-alien-aberrant'), use: any(cs('healing'), cs('corruption')), replaces: ['heal-alien-aberrant'], summary: 'Also magical patterns (not unliving).', source: 'HB p.91' }),
  skill(3, 30, ['corruptors', 'healers'], { id: 'immune-disease', name: 'Immune to Disease', use: any(cs('healing'), cs('corruption')), summary: 'Immune to Disease.', source: 'HB p.92' }),
  skill(3, 30, ['corruptors', 'incantors'], { id: 'discern-unliving', name: 'Discern Unliving', summary: 'Discern the dismiss level of an unliving being or possession.', source: 'HB p.89' }),
  skill(1, 10, ['healers'], { id: 'revive', name: 'Revive', use: cs('healing'), summary: 'Chant of Heal Wound covers all locations (not mortal wounds).', source: 'HB p.95' }),
  skill(2, 20, ['healers'], { id: 'advanced-healing', name: 'Advanced Healing', learn: os('revive'), use: cs('healing'), replaces: ['revive'], summary: 'Chant of Heal Wound covers all locations; remove debilitation.', source: 'HB p.85' }),
  skill(5, 50, ['healers'], { id: 'source-of-life', name: 'Source of Life', restricted: true, learn: all(os('mind-healing'), os('advanced-healing')), use: cs('healing', 2), replaces: ['advanced-healing'], includes: ['advanced-healing', 'mind-healing'], summary: 'Cast Total Heal without High Magic.', source: 'HB p.96' }),
  skill(2, 20, ['healers'], { id: 'triage-master', name: 'Triage (Master)', use: cs('triage-advanced'), summary: 'Triage (Advanced) actions take 30 s.', source: 'HB p.98' }),
  skill(4, 40, ['healers'], { id: 'triage-expert', name: 'Triage (Expert)', learn: os('triage-master'), use: cs('triage-advanced'), replaces: ['triage-master'], summary: 'As Master; also alien and magical patterns.', source: 'HB p.97' }),
  skill(1, 10, ['healers'], { id: 'discern-pattern-type', name: 'Discern Pattern Type', use: any(cs('healing'), cs('corruption')), summary: 'Discern Living, Unliving or Magical pattern.', source: 'HB p.89' }),
  skill(4, 40, ['healers'], { id: 'advanced-pattern-scan', name: 'Advanced Pattern Scan', learn: os('discern-pattern-type'), use: any(cs('healing'), cs('corruption')), replaces: ['discern-pattern-type'], summary: 'Pattern, alien/aberrant, possession, regeneration.', source: 'HB p.85' }),
  skill(5, 50, ['healers'], { id: 'guarded-channelling', name: 'Guarded Channelling', restricted: true, learn: os('immune-disease'), use: cs('healing'), summary: 'Aura of Defence while casting a non-instant Cure.', source: 'HB p.91' }),
  skill(3, 30, ['healers'], { id: 'discern-elemental-being', name: 'Discern Elemental Being', summary: 'Discern the dismiss level of an elemental.', source: 'HB p.89' }),

  // ---- Incantors / Mages ----
  skill(1, 10, ['incantors'], { id: 'last-rites', name: 'Last Rites', use: cs('incantation'), summary: 'Spell Reduction (1) on Lay to Rest.', source: 'HB p.93' }),
  skill(4, 40, ['incantors'], { id: 'last-rites-improved', name: 'Last Rites (Improved)', learn: os('last-rites'), use: cs('incantation'), replaces: ['last-rites'], summary: 'Spell Reduction (1) Lay to Rest, (2) Speak with Ancestor.', source: 'HB p.93' }),
  skill(3, 30, ['incantors', 'mages'], { id: 'cast-high-countermagic', name: 'Cast High Countermagic', use: any(cs('spellcasting'), cs('incantation')), summary: 'Cast High Countermagic for 4 power.', source: 'HB p.87' }),
  skill(4, 40, ['incantors', 'mages'], { id: 'master-countermagic', name: 'Master Countermagic', learn: any(os('cast-high-countermagic'), os('high-magic', 'Incantation'), os('high-magic', 'Spellcasting')), use: any(cs('spellcasting'), cs('incantation')), replaces: ['cast-high-countermagic'], summary: 'High Countermagic; Spell Reduction (1) on Iron Will and High Countermagic.', source: 'HB p.93' }),
  skill(5, 50, ['incantors'], { id: 'cast-additional-incantation', name: 'Cast Additional Incantation', restricted: true, learn: any(os('last-rites-improved'), os('master-countermagic')), use: any(os('light-incantation'), os('dark-incantation')), summary: 'Also cast the standard Incantation list.', source: 'HB p.86' }),
  skill(5, 50, ['mages'], { id: 'cast-additional-magecraft', name: 'Cast Additional Magecraft', restricted: true, learn: os('master-countermagic'), use: any(os('enchanting'), os('shadow-magic')), summary: 'Also cast the standard Spellcasting list.', source: 'HB p.86' }),
  skill(2, 20, ['incantors', 'mages'], { id: 'transcend-armour', name: 'Transcend Armour', use: anyArmourCs, summary: 'Ranged spells in Medium armour, Mass spells in Heavy armour.', source: 'HB p.97' }),
  skill(4, 40, ['incantors', 'mages'], { id: 'champion', name: 'Champion', learn: os('transcend-armour'), use: anyArmourCs, replaces: ['transcend-armour'], summary: 'Cast Ranged and Mass spells in any armour.', source: 'HB p.87' }),
  skill(3, 30, ['incantors'], { id: 'dedicated-follower', name: 'Dedicated Follower', summary: 'Automatic Lay to Rest on death; Paladins Armour gives AV 3.', source: 'HB p.88' }),
  skill(5, 50, ['incantors'], { id: 'damage-reduction-fatal', name: 'Damage Reduction (Fatal)', restricted: true, learn: os('dedicated-follower'), summary: 'Fatal deals a single blow instead of destroying the location.', source: 'HB p.88' }),
  skill(3, 30, ['incantors'], { id: 'discern-ancestral-being', name: 'Discern Ancestral Being', summary: 'Discern the dismiss level of an ancestral.', source: 'HB p.89' }),
  skill(1, 10, ['mages'], { id: 'rite-master', name: 'Rite Master', use: cs('ritual-magic'), summary: 'Use power donated by others for rites.', source: 'HB p.95' }),
  skill(3, 30, ['mages'], { id: 'ritual-magic-improved', name: 'Ritual Magic (Improved)', learn: os('rite-master'), use: cs('ritual-magic'), replaces: ['rite-master'], includes: ['rite-master'], summary: '+1 ritual power; donated power.', source: 'HB p.95' }),
  skill(4, 40, ['mages'], { id: 'ritualist-expert', name: 'Ritualist (Expert)', learn: os('ritual-magic-improved'), use: cs('ritual-magic'), replaces: ['ritual-magic-improved'], summary: '+3 ritual power; donated power.', source: 'HB p.95' }),
  skill(5, 50, ['mages'], { id: 'ritualist-master', name: 'Ritualist (Master)', restricted: true, learn: os('ritualist-expert'), use: cs('ritual-magic'), replaces: ['ritualist-expert'], summary: '+5 ritual power; donated power.', source: 'HB p.95' }),
  skill(1, 10, ['mages'], { id: 'contribute-2nd', name: 'Contribute to 2nd Ritual', use: cs('contribute'), summary: 'Contribute to 2 rituals per day.', source: 'HB p.87' }),
  skill(3, 30, ['mages'], { id: 'contribute-3rd', name: 'Contribute to 3rd Ritual', learn: os('contribute-2nd'), use: cs('contribute'), replaces: ['contribute-2nd'], summary: 'Contribute to 3 rituals per day.', source: 'HB p.87' }),
  skill(3, 30, ['mages'], { id: 'discern-daemonic-being', name: 'Discern Daemonic Being', summary: 'Discern the dismiss level of a daemon.', source: 'HB p.89' }),
  skill(3, 30, ['mages'], { id: 'thaulmonic-alignment', name: 'Thaulmonic Alignment', restricted: true, summary: 'Mage Armour gives AV 3.', source: 'HB p.96' }),
  skill(4, 40, ['mages'], { id: 'impweave-expertise', name: 'Impweave Expertise', restricted: true, use: os('daemonology'), summary: 'Spell Reduction (1) on own Daemonology spells.', source: 'HB p.92' }),

  // ---- Militia / Rangers / Scouts ----
  skill(1, 10, ['militia', 'rangers', 'scouts', 'bank'], { id: 'immune-fumble', name: 'Immune to Fumble', summary: 'Immune to Fumble.', source: 'HB p.92' }),
  skill(3, 30, ['militia', 'rangers'], { id: 'immune-fumble-shatter', name: 'Immune to Fumble and Shatter', learn: os('immune-fumble'), replaces: ['immune-fumble'], summary: 'You and held items are immune to Fumble and Shatter.', source: 'HB p.92' }),
  skill(4, 40, ['militia'], { id: 'immune-through', name: 'Immune to Through', learn: os('immune-fumble-shatter'), summary: 'Immune to Through unless Artefact or elemental weakness.', source: 'HB p.92' }),
  skill(5, 50, ['militia'], { id: 'magic-resistance', name: 'Magic Resistance', restricted: true, learn: os('immune-through'), replaces: ['immune-through'], includes: ['immune-through'], covers: ['damage-reduction-harm', 'damage-reduction-mage-bolt'], summary: 'Immune to Through; Damage Reduction (Harm and Mage Bolt).', source: 'HB p.93' }),
  skill(1, 10, ['militia', 'rangers', 'scouts'], { id: 'tracking', name: 'Tracking', summary: 'Read tracks; Detect <Race> after dark (referee).', source: 'HB p.97' }),
  skill(4, 40, ['rangers'], { id: 'strikedown-shot', name: 'Strikedown Shot', learn: os('immune-fumble-shatter'), use: all(cs('projectile-weapon'), { flag: 'bowCompetency' }), summary: 'Projectiles can strike for Strikedown.', source: 'HB p.96' }),
  skill(5, 50, ['rangers'], { id: 'halt-shot', name: 'Halt Shot', restricted: true, learn: os('strikedown-shot'), use: all(cs('projectile-weapon'), { flag: 'bowCompetency' }), replaces: ['strikedown-shot'], summary: 'Projectiles strike for Halt or Strikedown.', source: 'HB p.91' }),
  skill(2, 20, ['rangers'], { id: 'discern-race', name: 'Discern Race', learn: os('tracking'), summary: 'Discern the race on the target\'s card.', source: 'HB p.89' }),
  skill(4, 40, ['rangers'], { id: 'discern-race-pattern', name: 'Discern Race and Pattern', learn: os('discern-race'), replaces: ['discern-race'], summary: 'Race and pattern type.', source: 'HB p.89' }),
  skill(5, 50, ['rangers'], { id: 'ethereal-shot', name: 'Ethereal Shot', restricted: true, learn: os('discern-race-pattern'), use: all(cs('projectile-weapon'), { flag: 'bowCompetency' }), replaces: ['discern-race-pattern'], includes: ['discern-race-pattern'], summary: 'Discern, then shoot Affect <race/pattern> for 1 minute.', source: 'HB p.90' }),
  skill(4, 40, ['rangers'], { id: 'immune-sleep', name: 'Immune to Sleep', learn: os('immune-befriend-confusion'), covers: ['sleepless-chanting'], summary: 'Immune to Sleep.', source: 'HB p.92' }),
  skill(2, 20, ['rangers'], { id: 'bowyer-apprentice', name: 'Bowyer (Apprentice)', summary: 'Craft L1 projectile weapon; faster arrow checks; mend bows.', source: 'HB p.86' }),
  skill(4, 40, ['rangers'], { id: 'bowyer-master', name: 'Bowyer (Master)', learn: os('bowyer-apprentice'), replaces: ['bowyer-apprentice'], summary: 'L1 + L2; faster checks and mending.', source: 'HB p.86' }),
  skill(2, 20, ['rangers'], { id: 'hand-of-nature', name: 'Hand of Nature', use: any(cs('triage'), cs('triage-advanced')), summary: 'Triage two locations at once.', source: 'HB p.91' }),
  skill(3, 30, ['rangers', 'scouts'], { id: 'trap-lore', name: 'Trap Lore', summary: 'Craft a trap bag; detect, disarm and set traps (referee).', source: 'HB p.97' }),
  skill(5, 50, ['rangers'], { id: 'enchant-projectile-weapon', name: 'Enchant Projectile Weapon', restricted: true, use: all(cs('projectile-weapon'), { flag: 'bowCompetency' }), summary: 'Shoot Enchanted Through.', source: 'HB p.90' }),
  skill(2, 20, ['scouts'], { id: 'focused-through', name: 'Focused Through', learn: os('immune-fumble'), summary: 'Through once per 10 minutes with a small or medium weapon.', source: 'HB p.90' }),
  skill(4, 40, ['scouts'], { id: 'through', name: 'Through', restricted: true, learn: os('focused-through'), replaces: ['focused-through'], summary: 'Always Through with a small or medium weapon.', source: 'HB p.97' }),
  skill(5, 50, ['scouts'], { id: 'weapon-finesse', name: 'Weapon Finesse', restricted: true, learn: os('through'), replaces: ['through'], summary: 'Through with thrown weapons or any usable melee weapon.', source: 'HB p.98' }),
  skill(3, 30, ['scouts'], { id: 'traverse-faction-wards', name: 'Traverse Faction Wards', summary: 'Pass faction wards in 10 s.', source: 'HB p.97' }),
  skill(1, 10, ['scouts'], { id: 'tns-spiral', name: 'TNS Spiral', restricted: true, learn: os('oathsworn', 'Scouts Guild'), summary: 'Translate the Spiral script. Cannot be tutored.', source: 'HB p.97' }),

  // ---- Bank ----
  skill(2, 20, ['bank', 'arcane'], { id: 'identify', name: 'Identify', learn: any(anyMagicCs, cs('sense-magic')), use: any(anyMagicCs, cs('sense-magic')), summary: 'Identify magic item powers (referee).', source: 'HB p.92' }),
  skill(5, 50, ['bank', 'arcane'], { id: 'diagnose-powers', name: 'Diagnose Powers', restricted: true, learn: os('identify'), replaces: ['identify'], use: any(anyMagicCs, cs('sense-magic')), summary: 'Identify powers; restore 1 item card per day. (E11: printed use also needs a loresheet.)', source: 'HB p.89' }),
  skill(2, 20, ['bank'], { id: 'bank-advisor-clerk', name: 'Bank Advisor (Clerk)', restricted: true, learn: os('oathsworn', 'Bank'), use: os('oathsworn', 'Bank'), summary: 'Submit 1 item per event for repower assessment.', source: 'HB p.86' }),
  skill(3, 30, ['bank'], { id: 'bank-advisor-associate', name: 'Bank Advisor (Associate)', restricted: true, learn: all(os('bank-advisor-clerk'), os('oathsworn', 'Bank')), use: os('oathsworn', 'Bank'), replaces: ['bank-advisor-clerk'], summary: '2 items per event.', source: 'HB p.86' }),
  skill(4, 40, ['bank'], { id: 'bank-advisor-broker', name: 'Bank Advisor (Broker)', restricted: true, learn: all(os('bank-advisor-associate'), os('oathsworn', 'Bank')), use: os('oathsworn', 'Bank'), replaces: ['bank-advisor-associate'], summary: '3 items per event.', source: 'HB p.86' }),

  // ---- Knowledge Guilds ----
  skill(1, 10, ['knowledge'], { id: 'general-knowledge', name: 'General Knowledge <X>', param: 'Guildsman, Merchant, Rumour Monger, Storyteller, Wanderer or War Scout', side: 'left', countsTowardLimit: false, summary: 'News sheets for topic X.', source: 'HB p.91' }),
  // Only the skills LIM-4 exempts from the 12 go on the left; Newsmonger and Improved Research Ability are right-side.
  skill(2, 20, ['knowledge'], { id: 'newsmonger', name: 'Newsmonger', learn: os('general-knowledge'), replaces: ['general-knowledge'], summary: 'All news sheets.', source: 'HB p.94' }),
  skill(4, 40, ['knowledge'], { id: 'improved-research-ability', name: 'Improved Research Ability', learn: os('newsmonger'), mainEventOnly: true, summary: 'Summer research; assist others as well as own research.', source: 'HB p.92' }),

  // ---- Arcane Guilds ----
  skill(1, 10, ['arcane'], { id: 'arcane-crafter-apprentice', name: 'Arcane Crafter (Apprentice)', use: anyMagicCs, summary: '2 × L1 crafted arcane items per event.', source: 'HB p.85' }),
  skill(2, 20, ['arcane'], { id: 'arcane-crafter-adept', name: 'Arcane Crafter (Adept)', learn: os('arcane-crafter-apprentice'), use: anyMagicCs, replaces: ['arcane-crafter-apprentice'], includes: ['arcane-crafter-apprentice'], summary: '2 × L1 + 2 × L2 per event.', source: 'HB p.85' }),
  skill(4, 40, ['arcane'], { id: 'arcane-crafter-master', name: 'Arcane Crafter (Master)', learn: os('arcane-crafter-adept'), use: anyMagicCs, replaces: ['arcane-crafter-adept'], includes: ['arcane-crafter-adept'], summary: '2 each of L1, L2, L3 per event.', source: 'HB p.86' }),
  skill(1, 10, ['arcane'], { id: 'dark-incantation', name: 'Dark Incantation', restricted: true, use: cs('incantation'), excludes: ['light-incantation'], summary: 'Dark Incantation list instead of Incantation.', source: 'HB p.89' }),
  skill(1, 10, ['arcane'], { id: 'light-incantation', name: 'Light Incantation', restricted: true, use: cs('incantation'), excludes: ['dark-incantation'], summary: 'Light Incantation list instead of Incantation.', source: 'HB p.93' }),
  skill(1, 10, ['arcane'], { id: 'enchanting', name: 'Enchanting', restricted: true, use: cs('spellcasting'), excludes: ['shadow-magic'], summary: 'Enchanting list instead of Spellcasting.', source: 'HB p.90' }),
  skill(1, 10, ['arcane'], { id: 'shadow-magic', name: 'Shadow Magic', restricted: true, use: cs('spellcasting'), excludes: ['enchanting'], summary: 'Shadow Magic list instead of Spellcasting.', source: 'HB p.96' }),
  skill(1, 10, ['arcane'], { id: 'daemonology', name: 'Daemonology', restricted: true, use: cs('spellcasting'), summary: 'Daemonology list up to Spellcasting level.', source: 'HB p.88' }),
  skill(1, 10, ['arcane'], { id: 'theology', name: 'Theology', restricted: true, use: cs('incantation'), summary: 'Theology list up to Incantation level.', source: 'HB p.97' }),
  skill(1, 10, ['arcane'], { id: 'elementalism', name: 'Elementalism', restricted: true, use: any(cs('healing'), os('light-incantation'), os('enchanting')), summary: 'Elementalism list up to the highest enabling level.', source: 'HB p.90' }),
  skill(1, 10, ['arcane'], { id: 'necromancy', name: 'Necromancy', restricted: true, use: any(cs('corruption'), os('shadow-magic'), os('dark-incantation')), summary: 'Necromancy list up to the highest enabling level.', source: 'HB p.94' }),
  skill(4, 40, ['arcane'], { id: 'high-magic-daemonology', name: 'High Magic (Daemonology)', restricted: true, learn: os('daemonology'), use: cs('spellcasting', 2), replaces: ['daemonology'], includes: ['daemonology'], summary: 'Daemonology level 3.', source: 'HB p.91' }),
  skill(4, 40, ['arcane'], { id: 'high-magic-elementalism', name: 'High Magic (Elementalism)', restricted: true, learn: os('elementalism'), use: any(cs('healing', 2), all(cs('spellcasting', 2), os('enchanting')), all(cs('incantation', 2), os('light-incantation'))), replaces: ['elementalism'], includes: ['elementalism'], summary: 'Elementalism level 3.', source: 'HB p.91' }),
  skill(4, 40, ['arcane'], { id: 'high-magic-necromancy', name: 'High Magic (Necromancy)', restricted: true, learn: os('necromancy'), use: any(cs('corruption', 2), all(cs('incantation', 2), os('dark-incantation')), all(cs('spellcasting', 2), os('shadow-magic'))), replaces: ['necromancy'], includes: ['necromancy'], summary: 'Necromancy level 3.', source: 'HB p.91' }),
  skill(4, 40, ['arcane'], { id: 'high-magic-theology', name: 'High Magic (Theology)', restricted: true, learn: os('theology'), use: all(cs('incantation', 2), os('theology')), replaces: ['theology'], includes: ['theology'], summary: 'Theology level 3.', source: 'HB p.92' }),
  skill(5, 50, ['arcane'], { id: 'high-magic', name: 'High Magic <X>', param: 'Magic list', restricted: true, use: any(cs('spellcasting', 2), cs('incantation', 2), cs('healing', 2), cs('corruption', 2)), summary: 'Level 3 of lists castable at level 2. Not via Jack of All Trades.', source: 'HB p.92' }),

  // ---- Martial Guilds ----
  skill(1, 10, ['martial'], { id: 'quick-armour-repair', name: 'Quick Armour Repair', use: anyArmourCs, summary: 'Armour repair takes half the time.', source: 'HB p.95' }),
  skill(2, 20, ['martial'], { id: 'armour-mastery', name: 'Armour Mastery', use: anyArmourCs, summary: '+1 AV (Rule of Double).', source: 'HB p.85' }),
  skill(4, 40, ['martial'], { id: 'armour-mastery-advanced', name: 'Armour Mastery (Advanced)', learn: os('armour-mastery'), use: anyArmourCs, replaces: ['armour-mastery'], summary: '+2 AV.', source: 'HB p.85' }),
  skill(5, 50, ['martial'], { id: 'armour-mastery-expert', name: 'Armour Mastery (Expert)', restricted: true, learn: os('armour-mastery-advanced'), use: anyArmourCs, replaces: ['armour-mastery-advanced'], summary: '+2 AV; immune to non-Artefact Crush.', source: 'HB p.85' }),

  // ---- Loresheet-only skills (section 11) ----
  special({ id: 'base-lhv-1', name: '+1 Base LHV', use: ls, summary: '+1 base LHV (base LHV max 4).', source: 'HB p.84' }),
  special({ id: 'bonus-pr-1', name: '+1 Bonus Power Rating', use: ls, summary: '+1 PR carrying limit.', source: 'HB p.84' }),
  special({ id: 'bonus-pr-2', name: '+2 Bonus Power Rating', learn: os('bonus-pr-1'), use: ls, replaces: ['bonus-pr-1'], summary: '+2 PR carrying limit.', source: 'HB p.84' }),
  special({ id: 'lhv-1-vampire', name: '+1 LHV (Vampire)', use: ls, summary: '+1 LHV at night. Stacks with the +1 LHV OS (L5).', source: 'LS: Vampire' }),
  special({ id: 'lhv-2', name: '+2 LHV', learn: os('lhv-1'), use: ls, replaces: ['lhv-1'], summary: '+2 LHV (Rule of Double).', source: 'HB p.84' }),
  special({ id: 'dismiss-rank-5', name: 'Dismiss Rank +5', use: ls, summary: '+5 own dismiss rank.', source: 'HB p.84' }),
  special({ id: 'dismiss-rank-10', name: 'Dismiss Rank +10', use: ls, replaces: ['dismiss-rank-5'], summary: '+10 own dismiss rank.', source: 'HB p.84' }),
  special({ id: 'magical-armour-1', name: '+1 Magical Armour', use: ls, summary: '1 MAV on all locations (MAV cap 4).', source: 'HB p.84' }),
  special({ id: 'magical-armour-2', name: '+2 Magical Armour', learn: os('magical-armour-1'), use: ls, replaces: ['magical-armour-1'], summary: '2 MAV on all locations.', source: 'HB p.84' }),
  special({ id: 'natural-armour-1', name: '+1 Natural Armour', use: ls, summary: '1 NAV (NAV cap 4).', source: 'HB p.84' }),
  special({ id: 'natural-armour-2', name: '+2 Natural Armour', learn: os('natural-armour-1'), use: ls, replaces: ['natural-armour-1'], summary: '2 NAV.', source: 'HB p.84' }),
  special({ id: 'beast-form-intelligence', name: 'Beast-form Intelligence', use: ls, summary: 'Speak in beast form.', source: 'HB p.86' }),
  special({ id: 'beast-form-skill-use', name: 'Beast-form Skill Use', use: ls, replaces: ['beast-form-intelligence'], summary: 'Speak and use OS in beast form.', source: 'HB p.86' }),
  special({ id: 'beast-form-casting', name: 'Beast-form Casting', learn: os('beast-form-skill-use'), use: ls, replaces: ['beast-form-skill-use'], summary: 'Also cast spells in beast form.', source: 'HB p.86' }),
  special({ id: 'beast-form-changes-2', name: 'Beast-form Changes +2', use: ls, summary: '2 more beast-form changes per day.', source: 'HB p.86' }),
  special({ id: 'beguile-level', name: 'Beguile <X>', param: 'Level', levelled: true, use: ls, summary: 'Innate Beguile X times per day. Each level replaces the previous.', source: 'HB p.86' }),
  special({ id: 'brutish-strike', name: 'Brutish Strike', use: all(ls, cs('large-weapon')), excludes: ['goblin-resilience'], summary: 'Strikedown once per 10 minutes with a large weapon.', source: 'HB p.86' }),
  special({ id: 'focused-strike', name: 'Focused Strike', use: cs('large-weapon'), excludes: ['goblin-resilience'], summary: 'Crush once per 10 minutes with a large weapon.', source: 'HB p.90' }),
  special({ id: 'goblin-resilience', name: 'Goblin Resilience', use: ls, excludes: ['mighty-blow', 'crushing-blow', 'brutish-strike', 'focused-strike', 'mighty-blow-brutish', 'crushing-blow-focused'], summary: 'Unconscious with no location at -1: debilitated after 1 minute.', source: 'HB p.91' }),
  special({ id: 'cast-all-incantation', name: 'Cast All Incantation', use: all(ls, cs('incantation')), replaces: ['cast-additional-incantation'], includes: ['light-incantation', 'dark-incantation'], summary: 'Cast the combined Incantation list.', source: 'HB p.87' }),
  special({ id: 'cast-all-magecraft', name: 'Cast All Magecraft', use: all(ls, cs('spellcasting')), replaces: ['cast-additional-magecraft'], includes: ['enchanting', 'shadow-magic'], summary: 'Cast the combined Spellcasting list.', source: 'HB p.87' }),
  special({ id: 'cursing-word', name: 'Cursing Word', use: ls, summary: 'Inflict specific curses.', source: 'HB p.88' }),
  special({ id: 'damage-reduction-crush', name: 'Damage Reduction (Crush)', use: ls, summary: 'Damage Reduction vs Crush.', source: 'HB p.88' }),
  special({ id: 'damage-reduction-all', name: 'Damage Reduction (All)', use: ls, replaces: ['damage-reduction-crush'], covers: ['damage-reduction-fatal'], summary: 'Damage Reduction vs all damage effects.', source: 'HB p.88' }),
  special({ id: 'damage-reduction-harm', name: 'Damage Reduction (Harm)', summary: 'Harm deals a single blow.', source: 'HB p.88' }),
  special({ id: 'damage-reduction-mage-bolt', name: 'Damage Reduction (Mage Bolt)', summary: 'Mage Bolt deals a single blow.', source: 'HB p.88' }),
  special({ id: 'immune-fatal', name: 'Immune to Fatal', use: ls, replaces: ['damage-reduction-fatal'], summary: 'Immune to Fatal.', source: 'HB p.92' }),
  special({ id: 'immune-harm', name: 'Immune to Harm', use: ls, replaces: ['damage-reduction-harm'], summary: 'Immune to Harm.', source: 'HB p.92' }),
  special({ id: 'immune-mage-bolt', name: 'Immune to Mage Bolt', use: ls, replaces: ['damage-reduction-mage-bolt'], summary: 'Immune to Mage Bolt.', source: 'HB p.92' }),
  special({ id: 'immune-disease-decay', name: 'Immune to Disease and Decay', use: ls, covers: ['immune-disease'], summary: 'Immune to Disease and Decay.', source: 'HB p.92' }),
  special({ id: 'immune-paralysis', name: 'Immune to Paralysis', use: ls, summary: 'Immune to Paralysis.', source: 'HB p.92' }),
  special({ id: 'enchanted-claws', name: 'Enchanted Claws', use: all(ls, { flag: 'clawCompetency' }), summary: 'Claws strike Enchanted.', source: 'HB p.90' }),
  special({ id: 'enchanted-strikedown-claws', name: 'Enchanted Strikedown Claws', learn: os('enchanted-claws'), use: all(ls, { flag: 'clawCompetency' }), replaces: ['enchanted-claws'], summary: 'Claws strike Enchanted Strikedown.', source: 'HB p.90' }),
  special({ id: 'fearsome-aspect-level', name: 'Fearsome Aspect <X>', param: 'Level', levelled: true, use: ls, summary: 'Innate Mass Fear X times per day. Each level replaces the previous.', source: 'HB p.90' }),
  special({ id: 'fence', name: 'Fence', use: ls, summary: 'Value crafted items for resale.', source: 'HB p.90' }),
  special({ id: 'mage-bolt-wedge', name: 'Mage Bolt Wedge', use: ls, summary: 'Head of a warlock wedge casts Mage Bolt.', source: 'HB p.93' }),
  special({ id: 'global-blast-wedge', name: 'Global Blast Wedge', learn: os('mage-bolt-wedge'), use: all(ls, os('mage-bolt-wedge')), summary: 'Head of a warlock wedge casts global Blast.', source: 'HB p.91' }),
  special({ id: 'mass-blast-wedge', name: 'Mass Blast Wedge', learn: os('global-blast-wedge'), use: all(ls, os('global-blast-wedge')), summary: 'Head of a wedge casts Mass Blast.', source: 'HB p.93' }),
  special({ id: 'hard-worker', name: 'Hard Worker', summary: 'Collect full annual income at every main event.', source: 'HB p.91' }),
  special({ id: 'toughen-body', name: 'Toughen Body', use: ls, summary: 'Locations cannot drop below 0 except to listed effects.', source: 'HB p.97' }),
  special({ id: 'harden-body', name: 'Harden Body', learn: os('toughen-body'), use: ls, replaces: ['toughen-body'], summary: 'As Toughen Body; Enchanted no longer bypasses it.', source: 'HB p.91' }),
  special({ id: 'regeneration', name: 'Regenerates', param: 'Time period', use: ls, summary: 'Regenerate 1 hit per location per time period.', source: 'HB p.95' }),
  special({ id: 'improved-regeneration', name: 'Improved Regeneration', use: ls, summary: 'Regeneration one step faster (max 10 s). Buy once.', source: 'HB p.92' }),
  special({ id: 'improved-ritual-of-peace', name: 'Improved Ritual of Peace', summary: 'Not taken below 0 by listed effects under the Ritual of Peace. Only with no Tier 5 OS.', source: 'HB p.92' }),
  { ...special({ id: 'jack-of-all-trades', name: 'Jack of All Trades', use: { loresheet: 'awakened-human' }, summary: 'Counts as a training facility for 1 Ω OS (not High Magic <X>). Used up; re-buying always costs 20 OSP.', source: 'HB p.93; cost from the Awakened Human loresheet (not in the published file)' }), tier: 2, cost: 20 },
  special({ id: 'level-2-spell-reduction-1', name: 'Level 2 Spell Reduction (1)', use: ls, summary: 'Spell Reduction (1) on L2 spells (not Iron Will).', source: 'HB p.93' }),
  special({ id: 'magical-armour-repair', name: 'Magical Armour Repair', summary: 'MAV restored after 5 minutes out of combat.', source: 'HB p.93' }),
  special({ id: 'master-brewer', name: 'Master Brewer', summary: 'Once per event, a second copy of an L1 or L2 potion or poison.', source: 'HB p.93' }),
  special({ id: 'mystic-claws', name: 'Mystic Claws', summary: 'Claws deliver effects, venoms and oils.', source: 'HB p.94' }),
  special({ id: 'natural-armour-regrowth', name: 'Natural Armour Regrowth', summary: 'NAV restored after 5 minutes out of combat.', source: 'HB p.94' }),
  special({ id: 'natural-claws', name: 'Natural Claws', use: { flag: 'clawCompetency' }, summary: 'Use two claws.', source: 'HB p.94' }),
  special({ id: 'retractable-claws', name: 'Retractable Claws', use: { flag: 'clawCompetency' }, replaces: ['natural-claws'], summary: 'Natural claws that can be retracted.', source: 'HB p.95' }),
  special({ id: 'paragon', name: '<X> Paragon', param: 'Paragon', paragon: true, summary: 'Paragon loresheet. Max 1 (LIM-3).', source: 'HB p.95' }),
  special({ id: 'ritual-crafter', name: 'Ritual Crafter', use: cs('ritual-magic'), replaces: ['spell-tempering-master'], includes: ['spell-tempering-master'], summary: '+2 to item-creation rituals.', source: 'HB p.95' }),
  special({ id: 'self-repairing-armour', name: 'Self Repairing Armour', use: anyArmourCs, replaces: ['master-armour-repair'], includes: ['master-armour-repair'], summary: 'Worn AV restored after 5 minutes out of combat.', source: 'HB p.96' }),
  special({ id: 'sigil-spell-reduction-1', name: 'Sigil Spell Reduction (1)', use: ls, summary: 'Spell Reduction (1) on Sigils and High Sigils.', source: 'HB p.96' }),
  special({ id: 'spell-reduction-1', name: 'Spell Reduction (1)', use: ls, summary: 'Spell Reduction (1) on all spells (not Iron Will).', source: 'HB p.96' }),
  special({ id: 'spell-reduction-2', name: 'Spell Reduction (2)', use: ls, replaces: ['level-2-spell-reduction-1'], summary: 'Spell Reduction (2) on all spells (not Iron Will).', source: 'HB p.96' }),
  special({ id: 'spell-tempering-master', name: 'Spell Tempering (Master)', learn: os('spell-tempering'), replaces: ['spell-tempering'], summary: '1 master spell-tempered item per event.', source: 'HB p.96' }),
  special({ id: 'strike-for-enchanted', name: 'Strike for Enchanted', use: ls, summary: 'Strike Enchanted with a melee weapon.', source: 'HB p.96' }),
  special({ id: 'venom-resistance', name: 'Venom Resistance', use: ls, summary: 'Purge Poison cures non-magical venoms.', source: 'HB p.98' }),
  special({ id: 'tns-runes', name: 'TNS <X> Runes', param: 'Ancestor, Daemon, Elemental or Grave', summary: 'Creature-only script. Cannot be tutored.', source: 'HB p.97' }),

  // Essence creature tiers (Druid, Paladin, Vampire, Warlock, Werecreature <X>): each tier replaces the one below.
  ...loresheets.flatMap((l) => (l.tiers ?? []).map((t): OccupationalSkill => {
    const prev = `${l.id}-${t.tier - 1}`
    return {
      ...special({ id: `${l.id}-${t.tier}`, name: t.name, use: { loresheet: l.id }, summary: t.abilities.join('; ') || l.summary, source: l.source }),
      tier: t.tier, cost: t.cost,
      ...(t.tier > 1 ? { learn: os(prev), replaces: [prev] } : {}),
    }
  })),
]
