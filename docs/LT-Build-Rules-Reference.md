# Lorien Trust Character Build Rules Reference

**Sources:**
- Lorien Trust Rules Handbook v4.06 (`Lorien-Trust-Rules-Handbook-v4.06-3.md`), cited as `HB p.NN`.
- Lorien Trust Printable Loresheets and Files v4.06, cited as `LS: <sheet name>`. The original PDF is the authority. The markdown copy (`Lorien_Trust_Loresheets_v4.06.md`) is incomplete: it lost ten sheets and some table rows (see L15).

**Scope:** Character creation, Character Skills (CS), Occupational Skills (OS), loresheet skill lists, prerequisites, limits and derived values. Only the rules that decide whether a build is legal and what it can do are included.
**Out of scope:** Combat procedure, safety, event logistics, weapon construction, full spell descriptions and the in-play use of creature powers. Use the source files for these.

Where the sources contradict themselves or each other, or are unclear, this document says so in [Section 13](#13-ambiguities-and-errata). It does not silently choose an answer.

This is a summary for building a tool. It does not replace the source files. Both sources are © Merlinroute Ltd.

---

## Contents

1. [Glossary and notation](#1-glossary-and-notation)
2. [What a character build consists of](#2-what-a-character-build-consists-of)
3. [Identity: race, faction, guilds](#3-identity-race-faction-guilds)
4. [Character Skills (CS)](#4-character-skills-cs)
5. [Children](#5-children)
6. [Derived values and caps](#6-derived-values-and-caps)
7. [Magic access](#7-magic-access)
8. [Occupational Skills: rules](#8-occupational-skills-rules)
9. [Occupational Skill lists by guild](#9-occupational-skill-lists-by-guild)
10. [Occupational Skill catalogue](#10-occupational-skill-catalogue)
11. [Skills that need a lammie or loresheet](#11-skills-that-need-a-lammie-or-loresheet)
12. [Loresheet reference](#12-loresheet-reference)
13. [Ambiguities and errata](#13-ambiguities-and-errata)
14. [Validation rule checklist](#14-validation-rule-checklist)

---

## 1. Glossary and notation

| Term | Meaning |
|---|---|
| CS | Character Skill. Bought once at creation with 16 character points. |
| OS | Occupational Skill. Bought over time with OSPs. |
| OSP | Occupational Skill Point. |
| Tier (T1–T5) | OS rarity and complexity level. |
| `@` | Restricted OS. Needs an in-character route: a training facility, a tutor or a forgery. You cannot buy it at prebook. |
| `#` | OS only available through a ritual, lammie or loresheet. |
| `Ω` | OS list that you can use with *Jack of All Trades*. |
| LHV | Locational Hit Value (hits per body location). |
| AV / MAV / NAV | Armour Value / Magical Armour Value / Natural Armour Value. |
| PR | Power Rating of an item, power or creature. |
| Lammie | Laminated card that grants an item, power or creature ability. |
| Loresheet | Rules extension sheet for a skill or creature. It overrides lammies. |
| Learn prereq | What the character must already have to **buy** the OS (the handbook's "Pre-Requisite to Learn" column). |
| Use requires | What the character must have to **use** the OS (the "Requirements to use" text in the description). |
| Replaces | The new OS removes the named OS from the card. Its ability is kept only when the description says "replaces **and includes**" or restates it. |
| Magic CS | Any of Spellcasting, Incantation, Healing or Corruption. |
| Armour CS | Any of Light, Medium or Heavy Armour Use. |

---

## 2. What a character build consists of

A character card holds:

- Identity: character name, race, faction, player name, player ID (PID), and the year and version the card was printed.
- **Left side:** Character Skills (bought with 16 points), **plus** exactly the OS that don't count toward the 12 (LIM-4): income skills (Apprentice, Journeyman and Master <X>), research skills (Scholar and Sage <X>), General Knowledge <X> and <X> Oathsworn. (<X> Command is also exempt but never on a player card.) Newsmonger and Improved Research Ability go on the right. *(Ruling, 2026-09-18.)*
- **Right side:** all other Occupational Skills, up to a limit of 12 (see [8.4](#84-card-limits)).
- **Never on the card:** <X> Command. It is recorded on an unpublished NPC/DPC loresheet, not on a player character card. *(Ruling.)*
- Optionally: at most one special creature lammie, at most one special power lammie, and loresheets.

A player account also holds:

- An OSP balance. Unspent OSPs stay on the player record when a character dies or retires.
- All OS ever bought for the character, each flagged **active** or **inactive**. Inactive skills are there to record prerequisites. You cannot switch them on and off to swap skills between events (HB p.74).
- Credited Tier 5 vouchers from retirement (see [8.8](#88-retirement)).

Cards printed in earlier years are not valid. A card is valid from the day it is printed.

---

## 3. Identity: race, faction, guilds

### 3.1 Races (HB p.50)

A character counts as a member of both their **racial group** and its **category**. For example, an Elf is hit by both *Elf Bane* and *Elder Race Bane*. You can never become immune to your **elemental weakness**.

| Category | Racial group | Starting race? | Elemental weakness |
|---|---|---|---|
| Existential | Human | Yes (the default) | Flame |
| Existential | Beast | No | Air |
| Existential | Plant | No | Water |
| Existential | Mineral | No | Earth |
| Elder Races | Dwarf | Yes | Earth |
| Elder Races | Elf | Yes | Flame |
| Elder Races | Fey | Yes | Water |
| Elder Races | Olog | Yes | Air |
| Younger Races | Beastkin | Yes | Air |
| Younger Races | Drow | Yes | Flame |
| Younger Races | Halfling | Yes | Water |
| Younger Races | Uruk | Yes | Earth |
| Planar | Ancestral | No | Water |
| Planar | Daemon | No | Air |
| Planar | Elemental | No | Earth |
| Planar | Umbral | Yes | Flame |

Races marked "No" need a lammie and loresheet. Ancestral, Daemon, Elemental, Plant, Mineral and Beast each have a creature loresheet (see [12.3](#123-special-creature-os-lists)). Umbral is a starting race with no loresheet in the loresheets file. No race has innate special powers. Characters have no gender in game terms. Every character has a **Living** pattern unless a lammie, loresheet or OS says otherwise.

**Race and pattern changes (rulings):**
- **Race** and **pattern** are separate fields.
- A change to a non-standard race (Elemental, Daemon, Ancestral, Plant, Mineral or Beast) normally happens through a **ritual**. It **replaces** the race on the character card and gives the character that creature's loresheet.
- Every character starts with a **Living** pattern. A ritual can change it to **Magical** or **Unliving**. Becoming a Vampire also changes it to Unliving.
- A pattern change normally goes one way only. See A13 in [Section 13](#13-ambiguities-and-errata) for the exact wording to confirm.

### 3.2 Factions (player factions)

Bears, Dragons, Gryphons, Harts, Jackals, Lions, Tarantulas, Unicorns, Vipers, Wolves.

### 3.3 Guilds and guild groups (HB p.82)

| Group | Guilds |
|---|---|
| Martial Guilds | Armourers, Militia, Rangers, Scouts |
| Arcane Guilds | Corruptors, Healers, Incantors, Mages |
| Knowledge Guilds | Alchemists, Bank of Erdreja, Bards, Casino |

A group list (for example the Arcane Guilds list) is available through any guild in that group.

---

## 4. Character Skills (CS)

### 4.1 Core rules (HB p.51)

- **CS-1** Every character has **16 character points**. Children have fewer; see [Section 5](#5-children).
- **CS-2** You can buy each CS only once. **+Base Power** and **Ritual Magic** are the exceptions: you buy them in levels.
- **CS-3** Levelled skills are *replacing* levels. The listed cost is the total cost for that level, not an extra cost. You cannot hold both Healing 1 and Healing 2, or both Body Development 1 and 2.
- **CS-4** After creation, changing CS costs **5 OSP**. New players can usually redesign free during roughly their first year, at the organisers' discretion.
- **CS-5** If you change a CS that an OS needs, you **lose that OS** with no refund (HB p.84).
- **CS-8 (ruling)** Light, Medium and Heavy Armour Use form a ladder, and so do Triage and Triage (Advanced). A higher rung replaces the lower ones, so a character holds **at most one** skill from each ladder.

### 4.2 Character Skill table

| Skill | Cost | Group | Requires | Limits and notes |
|---|---|---|---|---|
| Ambidexterity | 2 | Weapon | — | Use weapons or cast with the off-hand. You still need the base CS for whatever the off-hand uses. It does not let you do two Concentration actions at once. |
| Large (Melee) Weapon Use | 2 | Weapon | — | Two-handed weapons 43"–72", pole-arms 43"–84". |
| Projectile Weapon Use | 4 | Weapon | Bow Competency test | Bow, crossbow or sling. Arrows and bolts deal Normal Through. |
| Shield Use | 2 | Weapon | — | One shield in the off-hand, or either hand with Ambidexterity. |
| Missile Weapon Use | 1 | Weapon | — | Throw one missile with the primary hand. |
| Light Armour Use | 2 | Armour | — | Base AV 1. |
| Medium Armour Use | 3 | Armour | — | Base AV 2. Also lets you wear Light armour. You cannot cast Ranged effects while wearing it. |
| Heavy Armour Use | 4 | Armour | — | Base AV 3. Also lets you wear Light and Medium armour. You cannot cast Ranged or Mass effects while wearing it. |
| Body Development 1 | 4 | Armour | — | Base LHV 2. |
| Body Development 2 | 8 | Armour | — | Base LHV 3. Cannot be combined with Body Development 1. |
| Potion Lore | 3 | Knowledge | — | Loresheet. Discern Potion, Master Purge, set vapour potions. |
| Poison Lore | 3 | Knowledge | — | Loresheet. Discern Poison. Needed to use venoms and weapon oils and to set vapours. |
| Cartography | 1 | Knowledge | — | Collect an in-character regional map at events. |
| Sense Magic | 1 | Knowledge | — | Loresheet. Sense magic in an item. |
| Evaluate | 1 | Knowledge | — | Loresheet. Estimate an item's value. |
| Recognise Forgery | 1 | Knowledge | — | Loresheet. Tell whether an item is genuine. |
| Triage | 1 | Knowledge | — | Remove a mortal wound on a **limb**. Living patterns only. |
| Triage (Advanced) | 2 | Knowledge | — | Remove a mortal wound on **any** location. Raise all locations to 1 LHV in 5 minutes. Identify effects. |
| Healing 1 / 2 | 4 / 8 | Power | — | Level 1 gives L1 spells and +4 base Spell Power. Level 2 gives L1–2 spells and +12 base Spell Power. |
| Corruption 1 / 2 | 4 / 8 | Power | — | As Healing. |
| Incantation 1 / 2 | 4 / 8 | Power | — | As Healing. |
| Spellcasting 1 / 2 | 4 / 8 | Power | — | As Healing. |
| Ritual Magic 1 / 2 / 3 | 2 / 4 / 6 | Power | Some casting ability | See [7.6](#76-ritual-magic-cs). |
| Contribute (to Ritualist) | 1 | Power | — | Contribute 1 ritual power to one ritual per day. |
| +Base Power 1 / 2 / 3 / 4 | 2 / 4 / 6 / 8 | Power | — | +4 base Spell Power per level, up to +16. It does **not** need a magic CS. It counts as base for the Rule of Double. |
| Invocation | 2 | Power | — | Activate invocable items, glyphs and scrolls. Armour does not restrict it. |

Magic CS limits:

- **CS-6** You may hold **at most one** magic CS at level 2. Any mix of level 1 magic CS is allowed alongside it.
- **CS-7** Ritual Magic needs "some form of casting ability". See [13](#13-ambiguities-and-errata), item A3.

### 4.3 Free skills (0 points, not printed on the card)

Numeracy, Literacy, Read Maps, Small Melee Weapon Use (7"–18", primary hand), Medium Melee Weapon Use (18"–42", primary hand).

---

## 5. Children

(HB p.52, p.75)

| Age | Character points | Excluded CS | Notes |
|---|---|---|---|
| Under 5 | 0 | All | Free skills only. |
| 5–9 | 10 | Large Weapon Use, Projectile Weapon Use, Thrown/Missile Weapon Use, Body Development 2, Heavy Armour Use, Ritual Magic (all levels), Contribute | Any level of a magic CS and +Base Power is allowed. |
| 10–15 | 16 | Ritual Magic 2 and 3 | Any magic CS and +Base Power is allowed. Large Weapon Use is allowed with size limits. |
| 13–15 | (as 10–15) | — | Projectile Weapon Use is allowed with a Bow Competency card. No prod-type crossbows. |

Other rules for children:

- **CH-1** Children under 16 are immune to Charm and Command effects. This **does not** count as the OS *Immune to Charms* for prerequisites.
- **CH-2** Children can buy any OS that their level and type of spellcasting allow.
- **CH-3** A child aged 10–15 with Large Weapon Use can buy **Brutish Strike #** instead of Strikedown-type skills. It converts automatically on their 16th birthday.
- **CH-4** Children aged 10–15 can use claws if their creature or power needs them and they pass the Claw Competency test.

---

## 6. Derived values and caps

### 6.1 Rule of Double (HB p.62)

- **RD-1** LHV, AV and Spell Power can never go above **2 × base**, whatever the source.
- **RD-2** "Base" means anything bought with **character points**. If several base values exist, only the **highest** counts.
- **RD-3** Magical Armour is **not** covered by the Rule of Double. It has a hard cap of 4.

### 6.2 LHV (hits per location)

| Source | Base LHV |
|---|---|
| Default | 1 |
| Body Development 1 | 2 |
| Body Development 2 | 3 |

- There are six locations: head, torso, left arm, right arm, left leg and right leg.
- The OS **+1 LHV** needs Body Development 2 to use, giving 4 hits (Rule of Double cap 6).
- **+1 Base LHV #** cannot take total base LHV above 4.

### 6.3 Armour

| Armour | Base AV | CS needed | Casting restriction |
|---|---|---|---|
| Light | 1 | Light, Medium or Heavy Armour Use | None |
| Medium | 2 | Medium or Heavy Armour Use | No Ranged |
| Heavy | 3 | Heavy Armour Use | No Ranged or Mass |

- **AR-1** Armour worn without the matching CS gives no AV, but it still restricts casting.
- **AR-2** Armour Mastery OS adds AV, subject to the Rule of Double. They only work on Magical Armour if you also have Magical Armour Mastery.
- **AR-3** Magical Armour (Mage Armour, Paladins Armour, +X Magical Armour) has a cap of **4** and does not stack with physical AV. Both armour sources take damage together.
- **AR-4** Natural Armour has a cap of **4**. The Carapace and High Carapace Armour sigils stack with +X Natural Armour OS.
- **AR-5** Casting restriction overrides:
  - **Transcend Armour:** Ranged spells in Medium armour and Mass spells in Heavy armour. Ranged spells are still not allowed in Heavy armour.
  - **Champion:** Ranged and Mass spells in any armour.
  - Casting as part of a wedge also ignores the restriction.

### 6.4 Spell Power (per day)

| Source | Spell Power |
|---|---|
| Magic CS at level 1 | +4 base |
| Magic CS at level 2 | +12 base |
| +Base Power (per level, maximum 4 levels) | +4 base |
| OS +4 / +8 / +12 / +16 Spell Power | +4 / +8 / +12 / +16. Each replaces the previous one. Subject to the Rule of Double. |

Spell cost by level:

| Spell level | Power cost |
|---|---|
| Level 1 | 1 |
| Level 2 | 2 |
| Level 3 | 4 |

Power does not carry over between days. For combining power from several magic CS, see [13](#13-ambiguities-and-errata), item A1.

**Example:** Spellcasting 2 (12) + Base Power 4 (16) = 28 base. With +16 Spell Power the total is 44, which is under the cap of 56.
**Example:** Healing 1 (4) with +16 Spell Power gives 20, capped at **8**.

### 6.5 Power Rating and lammie limits (HB p.58)

- **PR-1** A standard character has PR 0 and a personal limit of **12**. Bonus PR OS (#) raise the limit.
- **PR-1a** Active sigils count toward PR (LS: Daily Sigil Record):
  - **PR 0:** Carapace Armour, Iron Will.
  - **PR 1:** Embody Unliving, Endurance, High Carapace Armour, Mage Armour, Network Attunement, Paladins Armour, Protection from Paralysis, Weapon of Primal Magic.
- **PR-1b** Each essence creature tier has its own PR (1–4). See [12.4](#124-essence-creatures).
- **PR-2** At most 1 special creature lammie and at most 1 special power lammie per character.
- **PR-3** Each item has at most 1 special item lammie and 1 special item power lammie.
- **PR-4** Precedence when effects conflict:
  - A loresheet beats a lammie or spell.
  - Otherwise the lammie with the higher PR wins.
  - On equal PR: Special Weapon > Spell > Special Item > Special Power > Special Creature.

---

## 7. Magic access

### 7.1 Magic families

| Family | Base list (from CS) | Specialisations (OS, replace the base list) | Classed as |
|---|---|---|---|
| Magecraft | Spellcasting | Enchanting, Shadow Magic | Mage |
| Incantation | Incantation (Balance) | Light Incantation, Dark Incantation | Incantor |
| Channelling | Healing, Corruption | — | Channeller |
| Summoning | — (added on top of a base list) | Daemonology, Elementalism, Necromancy, Theology | Summoner |
| Ritual | Ritual Magic CS | — | Ritualist |

### 7.2 Level access

- **MG-1** A magic CS at level N lets you cast levels 1..N (N ≤ 2) of its list.
- **MG-2** Level 3 spells need a **High Magic** OS:
  - **High Magic <X>** gives level 3 in every list you can cast at level 2.
  - The summoning-specific High Magic OS give level 3 of that summoning list.
  - **Source of Life** and **Source of Unlife** also unlock Total Heal and Total Repair Unliving without High Magic.
- **MG-3** High Magic grants **no** extra Spell Power.

### 7.3 Specialisations

- **MG-4** A specialisation **replaces** the base list and stays capped at the level of the underlying CS.
  - Light Incantation and Dark Incantation need Incantation CS.
  - Enchanting and Shadow Magic need Spellcasting CS.
- **MG-5** You cannot hold both **Light and Dark Incantation**, or both **Enchanting and Shadow Magic**, unless an OS, lammie or loresheet allows it.
- **MG-6** You get the base list back **as well** through:
  - *Cast Additional Incantation* (needs Light or Dark Incantation).
  - *Cast Additional Magecraft* (needs Enchanting or Shadow Magic).
  - *Cast All Incantation #* and *Cast All Magecraft #*, which give the combined list.
- **MG-7** A character with a specialisation can still buy OS from the Mages or Incantors lists as normal.

### 7.4 Summoning lists

These are **added** to your existing lists.

| Summoning list | Enabled by (any one) | Maximum level without High Magic | High Magic OS (T4 @) and what it needs to use |
|---|---|---|---|
| Necromancy | Corruption CS, Shadow Magic OS, or Dark Incantation OS | Highest level castable in any enabling list | **High Magic (Necromancy):** Corruption 2, **or** Incantation 2 + Dark Incantation, **or** Spellcasting 2 + Shadow Magic |
| Elementalism | Healing CS, Light Incantation OS, or Enchanting OS | Highest level castable in any enabling list | **High Magic (Elementalism):** Healing 2, **or** Spellcasting 2 + Enchanting, **or** Incantation 2 + Light Incantation |
| Theology | Incantation CS (any incantation list) | Same as Incantation CS level | **High Magic (Theology):** Incantation 2 + Theology |
| Daemonology | Spellcasting CS (any Magecraft list) | Same as Spellcasting CS level | **High Magic (Daemonology):** Spellcasting 2 |

- **MG-8** *Cast All Incantation #* and *Cast All Magecraft #* each count as the enabler for Elementalism **or** Necromancy. You cannot use this to hold both.
- Summoning OS also give a ritual bonus to characters with Ritual Magic or Contribute.

### 7.5 Spell lists by level

Range codes: **Mss** Mass, **Rng** Ranged, **Prox** Proximity, **Slf** Self, **Rit** Rite. Range matters for armour restrictions.

**Incantation**

| L1 | L2 | L3 |
|---|---|---|
| Befriend (Rng) | Ancestral Strike (Slf) | Ethereal Weapon (Slf) |
| Confusion (Rng) | Aura of Defence (Slf) | High Countermagic (Rng) |
| Countermagic (Rng) | Chant of Protection (Prox) | High Dismiss (Rng) |
| Cure Wound (Prox) | Chant of Sanctuary (Prox) | Mass Fear (Mss) |
| Detect Unliving (Mss) | Halt (Rng) | Paladins Armour (Prox) |
| Dismiss (Rng) | Iron Will (Prox) | Protection from Paralysis (Prox) |
| Fear (Rng) | Lay to Rest (Rit) | Shield from Corruption (Prox) |
| Retribution (Slf) | Speak with Dead (Prox) | Speak with Ancestor (Rit) |

**Light Incantation** (replaces Incantation)

| L1 | L2 | L3 |
|---|---|---|
| Befriend (Rng) | Aura of Defence (Slf) | Smite (Slf) |
| Countermagic (Rng) | Chant of Protection (Prox) | High Countermagic (Rng) |
| Cure Wound (Prox) | Chant of Sanctuary (Prox) | High Dismiss (Rng) |
| Remove Disease (Prox) | Remove Decay (Prox) | Paladins Armour (Prox) |
| Detect Unliving (Mss) | Full Cure (Prox) | Protection from Paralysis (Prox) |
| Dismiss (Rng) | Iron Will (Prox) | Fortify Body (Prox) |
| Remove Fear (Prox) | Lay to Rest (Rit) | Shield from Corruption (Prox) |
| Retribution (Slf) | Speak with Dead (Prox) | Speak with Ancestor (Rit) |

**Dark Incantation** (replaces Incantation)

| L1 | L2 | L3 |
|---|---|---|
| Befriend (Rng) | Ancestral Strike (Slf) | Harm (Slf) |
| Confusion (Rng) | Aura of Defence (Slf) | High Control Unliving (Rng) |
| Control Unliving (Rng) | Chant of Protection (Prox) | High Countermagic (Rng) |
| Countermagic (Rng) | Wasting (Rit) | Mass Fear (Mss) |
| Detect Unliving (Mss) | Halt (Rng) | Paladins Armour (Prox) |
| Fear (Rng) | Iron Will (Prox) | Protection from Paralysis (Prox) |
| Repair Unliving (Prox) | Lay to Rest (Rit) | Shield from Corruption (Prox) |
| Retribution (Slf) | Speak with Dead (Prox) | Speak with Ancestor (Rit) |

**Cast All Incantation:** the union of the three Incantation lists above.

**Spellcasting**

| L1 | L2 | L3 |
|---|---|---|
| Countermagic (Rng) | Blast (Rng) | Aura of Immunity (Slf) |
| Detect Magic (Mss) | Chant of Melee Immunity (Prox) | Chant of Forbidding (Mss) |
| Purge Poison (Prox) | Cause Corrosion (Slf) | Freeze (Rng) |
| Fumble (Rng) | Enthral (Rng) | High Countermagic (Rng) |
| Mend (Prox) | Iron Will (Prox) | Mage Armour (Prox) |
| Repel (Rng) | Mute (Rng) | Mage Bolt (Rng) |
| Strikedown (Rng) | Sleep (Rng) | Teleport (Rit) |
| Trace Transport (Rit) | Shatter (Rng) | Weapon of Primal Magic (Slf) |

**Enchanting** (replaces Spellcasting)

| L1 | L2 | L3 |
|---|---|---|
| Countermagic (Rng) | Blast (Rng) | Endurance (Prox) |
| Detect Magic (Mss) | Chant of Melee Immunity (Prox) | Freeze (Rng) |
| Fumble (Rng) | Purge All Poisons (Prox) | High Countermagic (Rng) |
| Mend (Prox) | Infuse Shield (Prox) | Mage Armour (Prox) |
| Mend Armour (Prox) | Iron Will (Prox) | Mage Bolt (Rng) |
| Purge Poison (Prox) | Mute (Rng) | Fortify Body (Prox) |
| Strikedown (Rng) | Shatter (Rng) | Teleport (Rit) |
| Trace Transport (Rit) | Sleep (Rng) | Weapon of Primal Magic (Slf) |

**Shadow Magic** (replaces Spellcasting)

| L1 | L2 | L3 |
|---|---|---|
| Control Unliving (Rng) | Blast (Rng) | Aura of Immunity (Slf) |
| Countermagic (Rng) | Chant of Melee Immunity (Prox) | High Control Unliving (Rng) |
| Detect Unliving (Mss) | Wasting (Rit) | High Countermagic (Rng) |
| Fumble (Rng) | Cause Corrosion (Slf) | Mage Armour (Prox) |
| Mend (Prox) | Bind Unliving (Rng) | Mage Bolt (Rng) |
| Fear (Rng) | Mute (Rng) | Mass Fear (Mss) |
| Strikedown (Rng) | Sleep (Rng) | Teleport (Rit) |
| Trace Transport (Rit) | Shatter (Rng) | Weapon of Primal Magic (Slf) |

**Cast All Spellcasting** (from the skill *Cast All Magecraft #*): the union of the three Magecraft lists. The printed list leaves out Control Unliving at L1; ruling E6 treats that as a mistake.

**Healing**

| L1 | L2 | L3 |
|---|---|---|
| Heal Wound (Prox) | Aura of Defence (Slf) | Endurance (Prox) |
| Purge Poison (Prox) | Carapace Armour (Prox) | Shield from Corruption (Prox) |
| Remove Disease (Prox) | Heal Fatal Wound (Prox) | Cleanse Pattern (Mss) |
| Remove Fear (Prox) | Purge All Poisons (Prox) | Total Heal (Prox) |
| Remove Paralysis (Prox) | Remove Decay (Prox) | High Carapace Armour (Prox) |

**Corruption**

| L1 | L2 | L3 |
|---|---|---|
| Enthral Unliving (Rng) | Cause Disease (Slf) | Cause Fatal Wound (Slf) |
| Control Unliving (Rng) | Cause Paralysis (Slf) | Embody Unliving (Slf) |
| Detect Unliving (Mss) | Wasting (Rit) | High Control Unliving (Rng) |
| Fear (Rng) | Bind Unliving (Rng) | Mass Fear (Mss) |
| Repair Unliving (Prox) | Carapace Armour (Prox) | Total Repair Unliving (Prox) |

**Summoning lists** (added to a base list)

| List | L1 | L2 | L3 |
|---|---|---|---|
| Necromancy | Corrupt Body (Rit) | Full Repair Unliving (Prox); Strike for Flame (Slf) | Greater Corrupt Body (Rit); Speak with Unliving (Rit) |
| Daemonology | Control Daemon (Rng) | Full Cure Daemon (Prox); Strike for Water (Slf) | High Control Daemon (Rng); Speak with Daemon (Rit) |
| Theology | Control Ancestral (Rng) | Full Cure Ancestral (Prox); Strike for Air (Slf) | High Control Ancestral (Rng); Speak with Ancestor (Rit) |
| Elementalism | Control Elemental (Rng) | Full Cure Elemental (Prox); Strike for Earth (Slf) | High Control Elemental (Rng); Speak with Elemental (Rit) |

**Ritual Magic list:** Transportation (Rit) at L1 and Network Attunement (Rit) at L3.

### 7.6 Ritual Magic CS

| Level | Cost | Grants |
|---|---|---|
| 1 | 2 | Contribute 1 power to one ritual per day, as a Ritualist. Adds Transportation to your spell list. |
| 2 | 4 | Level 1, plus lead **1 ritual per event** at 10 power. |
| 3 | 6 | Level 1, plus lead **1 ritual per day** at 10 power. Adds the Network Attunement rite, which also needs a level 2 magic CS. |

- **RM-1** A Ritualist's own contribution (1 power, once per day) cannot be increased by any means.
- **RM-2** A character with both Ritual Magic and Contribute must state which one they are using on ritual paperwork.
- **RM-3** Contribute can be increased by OS (*Contribute to 2nd/3rd Ritual*), potions and items.
- **RM-4** Rites that are already on a character's spell lists do not need Ritual Magic.

---

## 8. Occupational Skills: rules

### 8.1 Earning OSPs (HB p.74)

| Source | OSP | Available |
|---|---|---|
| Prebooking a Lorien Trust main event | 10 | From the first day of the first prebooked event. You cannot spend them during the prebooking where you gained them. |
| Paying on the gate at a main event | 10 | Not until the **next** event season. |
| Sanctioned event | 2 | When the data is submitted. |
| Helping at events, offers, referrals | Varies | — |

Spent OSPs are not refunded, except on retirement (see [8.8](#88-retirement)).

### 8.2 Purchase limits (HB p.74)

- **OS-1** A character can buy at most **4 OS per event season**. This includes prebook and event purchases.
  - **Exempt:** income skills (Apprentice, Journeyman and Master <X>) and <X> Oathsworn.
  - **Counts:** Awakened <X>.
- **OS-2** A character can move **only one step along any one OS tree per year**. The retirement exception is in [8.8](#88-retirement). Prebook tier advancement is the other way to take two steps in one season (C20).
  - **Tree definition (ruling):** an OS tree is a chain of OS linked by *learn prerequisites*. For example: Create Poison (Novice) → (Artisan) → (Master) → (Magical). In practice, **a character cannot buy an OS in the same year as any OS that is its learn prerequisite**. CS prerequisites (such as Poison Lore) are not tree steps.
  - The same skill taught by different guilds is **one** tree. The teaching guild is not recorded against the skill.
- **OS-3** You cannot buy the **same OS twice**, from any source. Parameterised skills with different <X> values are different skills. For example, Translate Named Script <Elven> and <Dwarf> are separate, and Scholar can be bought for two different topics.
- **OS-4** You must meet the **learn prerequisites** when you buy. You must meet the **use requirements** to use the skill.
- **OS-5** Where an OS lists several prerequisites joined by "&", you need all of them. Where they are joined by "or", you need one.
- **OS-6** A lammie or loresheet can change an OS's tier and cost. Any OS listed on your loresheet counts as **unrestricted** for you.
- **OS-7** Purchases from a loresheet **count toward the 4 per year** limit (LS: Overview). The Tier 5 cap of 4 still applies. See [12.1](#121-general-loresheet-rules).

### 8.3 Acquisition routes (HB p.75)

| Route | What it can grant | Notes |
|---|---|---|
| **Self-teaching (prebook)** | Up to 4 skills, T1–T3, **not** `@`. Or skills from your creature loresheet. | OSPs are deducted immediately. |
| **Training facility** | Any tier, including `@`, as allocated by the guild or faction. | Registered at Game Control. The new card is available the next day. |
| **Tutor (OS)** | 1 OS per main event, up to T4, that the tutor holds. | The learner needs the prerequisites. Excludes Tutor, Essence Creature skills, restricted TNS scripts, blessings, and creature-card skills unless a lammie allows them. |
| **Written Forgery (OS)** | 1 OS at T1–T3, including `@`, from any guild, once per event. | No guild permission needed. |
| **Forgery (OS)** | 2 OS at T1–T3, **or** 1 OS at T4, including `@`, from any guild, once per event. | — |
| **Jack of All Trades #** | 1 OS of any tier from an `Ω` list whose guild the character is Oathsworn to. Includes that guild's Arcane, Knowledge or Martial group list. | Needs a Command member of that guild. The skill is used up and can be bought again next season. **Cannot be used for High Magic <X>.** |
| **Plot or miscellaneous** | Varies | — |

Restrictions on specific skills:

- *Oathsworn* can only be bought **at a main event**.
- *Sage <X>* and *Improved Research Ability* can only be gained **at a main event** (training voucher or tutor).
- *Scholar* can be bought at prebook.

### 8.4 Card limits

- **LIM-1** A character can have at most **12 OS** on the right side of the card.
- **LIM-2** Of those, at most **4 Tier 5** OS.
- **LIM-3** At most **1 Paragon <X>**.
- **LIM-4** These skills **do not count toward the 12**:
  - Apprentice <X>, Journeyman <X>, Master <X>
  - Scholar <X>, Sage <X>
  - <X> Command
  - General Knowledge <X>
  - <X> Oathsworn
  - Some "functional" administrative OS
- **LIM-5 (income skills):** allowed combinations are 4 Apprentice, **or** 2 Journeyman, **or** 1 Master, **or** 2 Apprentice + 1 Journeyman. Each must be bought separately. One way to implement this: give Apprentice a weight of 1, Journeyman 2 and Master 4, and require the total to be ≤ 4.
- **LIM-6 (research skills):** allowed combinations are up to 2 Scholar, **or** 1 Sage + 1 Scholar. Sage can only be bought once.
- **LIM-7 (oaths):** at most 1 faction Oathsworn and 1 guild Oathsworn at the same time.
- **LIM-8** You can sacrifice an OS to free a slot. There is no refund, and buying it back costs the full price.

### 8.5 Replacement semantics

- **REP-1** When an OS says it "replaces" another, the older skill leaves the active card. It stays on the account as a historic prerequisite.
- **REP-2** The older skill's ability is kept only when the description says "replaces **and includes**" or restates the ability. For example, *Source of Life* includes Advanced Healing and Mind Healing.
- **REP-2a (ruling)** A skill is replaced **only** where its description says so. Example: *Rally* replaces *Immune to Fear* and restates the fear immunity, but it does **not** replace *Immune to Mute*. A character keeps both Rally and Immune to Mute on the card. Example: *Cast Mass Charms* replaces *Immune to Charms*, so Immune to Charms leaves the card.
- **REP-2b (ruling)** A replacing skill **counts as** the skill it replaced for any learn prerequisite. Example: a character with Rally can buy a skill that needs Immune to Fear.
- **REP-3** In the handbook's printed lists, prerequisites in **bold** are the ones replaced. The bold formatting was lost in the markdown conversion, so the "Replaces" column in [Section 10](#10-occupational-skill-catalogue) is taken from the skill descriptions.

### 8.6 Mutual exclusions

| Rule | Exclusion |
|---|---|
| **EX-1** | *Goblin Resilience #* cannot be held with *Mighty Blow*, *Crushing Blow*, *Brutish Strike #* or *Focused Strike #*. Each blocks buying the other. |
| **EX-2** | Light Incantation cannot be held with Dark Incantation. Enchanting cannot be held with Shadow Magic. See MG-5. |
| **EX-3** | Cast All Incantation # and Cast All Magecraft # can enable Elementalism **or** Necromancy, not both. |
| **EX-4** | *Treewalker #* is not available to an Unliving-pattern character or anyone with Corruption CS. |
| **EX-5** | *Awakened <X>* stops the character becoming an Essence Creature, Summonable Creature or other ritual-made special creature. |
| **EX-6** | *Improved Ritual of Peace #* only works if the character has **no** Tier 5 OS. |
| **EX-7** | *Impweave Expertise* cannot be combined with any other Spell Reduction. |

### 8.7 Essence creatures and special creature trees

*Druid <X>*, *Paladin <X>*, *Vampire <X>*, *Warlock <X>* and *Werecreature <X>* are levelled `#` OS. Each level replaces the one below it. Each grants a loresheet whose own OS list can be bought "up to the stated Tier". A build tool should treat these loresheets as **extra OS lists** with their own costs and tiers (see OS-6). The tier tables, OS lists and restrictions for each essence creature are in [12.4](#124-essence-creatures).

### 8.8 Retirement

(HB p.20)

- **RET-1** You get back **half** the OSP value of the character's **active** OS, including prerequisite skills. Special creature skills are not counted.
- **RET-2** A character with at least 2 Tier 5 OS earns **floor(T5 count ÷ 2)** Tier 5 vouchers.
  - A voucher can be used later once the prerequisites are met.
  - Vouchers **cannot** be used for High Magic.
- **RET-3** The new character can buy up to 4 OS as normal. **Two** of those purchases may advance a skill **two tiers** at once, and each such double step uses one purchase slot. This is allowed only at creation after a retirement.
- **RET-3a (ruling)** The two double steps must be on **different trees**.

---

## 9. Occupational Skill lists by guild

The format is `Skill [Tier·OSP]`. An arrow `→` means the next skill needs the previous one. Lines are the chains as the handbook groups them, and stand-alone skills are listed at the end. All lists below are marked `Ω` in the handbook.

### Alchemists Guild
- Create Poison (Novice) [2·20] → Create Poison (Artisan) [3·30] → Create Poison (Master) [4·40] → Create Poison (Magical) @ [5·50]. Every step also needs Poison Lore CS.
- Create Potion (Novice) [2·20] → Create Potion (Artisan) [3·30] → Create Potion (Master) [4·40] → Create Potion (Magical) @ [5·50]. Every step also needs Potion Lore CS.
- Create Reagents [1·10] → Create Reagents (Improved) [2·20] → Increased Alchemical Production [4·40]
- Create Antidotes [1·10] → Create Antidotes (Improved) [3·30]
- Stand-alone: Herb Lore [1·10], Oiled Weapons [3·30] (needs Immune to Fumble), Master Poisoner [4·40], Forensic Analysis [3·30], Immune to Lethal Alchemical Venoms [4·40]

### Armourers Guild
- Armoursmith (Apprentice) [1·10] → Repair Enchanted Items [2·20] → Armoursmith (Artisan) [4·40] → Armoursmith (Master) @ [5·50]
- Weaponsmith (Apprentice) [1·10] → Repair Destroyed Items [2·20] → Weaponsmith (Artisan) [4·40] → Weaponsmith (Master) @ [5·50]
- Immune to Repel [2·20] → Immune to Repel and Strikedown [3·30] → Mighty Blow [4·40] → Crushing Blow @ [5·50]
- Additional Reforging [1·10] → Spell Tempering [3·30]
- Shield Mastery [3·30] → Shield Mastery (Expert) [4·40]

### Bards Guild
- Detect and Remove Beguile [2·20] → Immune to Charms [3·30] → Cast Mass Charms [4·40] → Beguile @ [5·50] (also needs Detect and Remove Beguile)
- Immune to Fear [1·10] → Immune to Mute [2·20] → Rally @ [4·40] (also needs Immune to Fear) → Immune to Mind Effects @ [5·50]
- Sleepless Chanting [2·20] → Unending Voice [3·30]
- Translate Named Script <X> [1·10] → Written Forgery [4·40] (also needs Recognise Forgery CS) → Forgery @ [5·50] (also needs Recognise Forgery CS)
- Translate Named Script <X> [1·10] → Script Master <X> [3·30] (any TNS from the same family) → Polyglot @ [5·**70**] (any Script Master)
- Stand-alone: Herb Lore [1·10], Immune to Befriend & Confusion [3·30]

### Casino Guild
- Detect and Remove Beguile [2·20] → Immune to Charms [3·30] → Cast Mass Charms [4·40]
- Immune to Fear [1·10] → Immune to Mute [2·20] → Rally @ [4·40] → Immune to Mind Effects @ [5·50]
- Conceal Item [2·20] → Conceal Item (Improved) [3·30]
- Perform Transport Rite [1·10] → Perform Teleport Rite @ [5·50]
- Stand-alone: Locate [2·20]

### Corruptors Guild
- Revitalise Unliving [1·10] → Repair Unliving (Advanced) [2·20] → Mind Healing [4·40] → Source of Unlife @ [5·50] (also needs Repair Unliving (Advanced))
- Mortician [2·20] → Mortician (Expert) [4·40]
- Dismiss/Control +2 [1·10] → +4 [2·20] → +6 [4·40] → +8 @ [5·50]
- Heal Alien or Aberrant Pattern [3·30] → Heal Magical Pattern @ [5·50]
- Stand-alone: Immune to Fear [1·10], Immune to Disease [3·30], Discern Unliving [3·30]

### Healers Guild
- Revive [1·10] → Advanced Healing [2·20] → Mind Healing [4·40] → Source of Life @ [5·50] (also needs Advanced Healing)
- Triage (Master) [2·20] → Triage (Expert) [4·40]
- Discern Pattern Type [1·10] → Advanced Pattern Scan [4·40]
- Heal Alien or Aberrant Pattern [3·30] → Heal Magical Pattern @ [5·50]
- Immune to Disease [3·30] → Guarded Channelling @ [5·50]
- Stand-alone: Herb Lore [1·10], Discern Elemental Being [3·30]

### Incantors Guild
- Dismiss/Control +2 [1·10] → +4 [2·20] → +6 [4·40] → +8 @ [5·50]
- Last Rites [1·10] → Last Rites (Improved) [4·40] → Cast Additional Incantation @ [5·50]
- Cast High Countermagic [3·30] → Master Countermagic [4·40] (or instead needs High Magic (Incantation)) → Cast Additional Incantation @ [5·50]
- Transcend Armour [2·20] → Champion [4·40]
- Dedicated Follower [3·30] → Damage Reduction (Fatal) @ [5·50]
- Stand-alone: Immune to Fear [1·10], Discern Ancestral Being [3·30], Discern Unliving [3·30]

### Mages Guild
- Rite Master [1·10] → Ritual Magic (Improved) [3·30] → Ritualist (Expert) [4·40] → Ritualist (Master) @ [5·50]
- Cast High Countermagic [3·30] → Master Countermagic [4·40] (or instead needs High Magic (Spellcasting)) → Cast Additional Magecraft @ [5·50]
- Transcend Armour [2·20] → Champion [4·40]
- Contribute to 2nd Ritual [1·10] → Contribute to 3rd Ritual [3·30]
- Stand-alone: Perform Transport Rite [1·10], Discern Daemonic Being [3·30], Thaulmonic Alignment @ [3·30], Impweave Expertise @ [4·40]

### Militia Guild
- Immune to Fumble [1·10] → Immune to Fumble and Shatter [3·30] → Immune to Through [4·40] → Magic Resistance @ [5·50]
- Immune to Repel [2·20] → Immune to Repel and Strikedown [3·30] → Mighty Blow [4·40] → Crushing Blow @ [5·50]
- Immune to Fear [1·10] → Immune to Mute [2·20] → Rally @ [4·40] → Immune to Mind Effects @ [5·50]
- Shield Mastery [3·30] → Shield Mastery (Expert) [4·40]
- Stand-alone: Tracking [1·10], Locate [2·20]

### Rangers Guild
- Immune to Fumble [1·10] → Immune to Fumble and Shatter [3·30] → Strikedown Shot [4·40] → Halt Shot @ [5·50]
- Tracking [1·10] → Discern Race [2·20] → Discern Race and Pattern [4·40] → Ethereal Shot @ [5·50]
- Immune to Befriend and Confusion [3·30] → Immune to Sleep [4·40]
- Bowyer (Apprentice) [2·20] → Bowyer (Master) [4·40]
- Stand-alone: Oiled Weapons [3·30] (needs Immune to Fumble), Hand of Nature [2·20], Trap Lore [3·30], Enchant Projectile Weapon @ [5·50]

### Scouts Guild
- Immune to Fumble [1·10] → Focused Through [2·20] → Through @ [4·40] → Weapon Finesse @ [5·50]
- Immune to Repel [2·20] → Immune to Repel and Strikedown [3·30] → Immune to Immobilisation @ [5·50]
- Translate Named Script <X> [1·10] → Written Forgery [4·40] (also needs Recognise Forgery CS) → Forgery @ [5·50]
- Stand-alone: Tracking [1·10], Conceal Item [2·20], Locate [2·20], Traverse Faction Wards [3·30], Trap Lore [3·30], TNS Spiral @ [1·10] (needs Oathsworn Scouts Guild), Oiled Weapons [3·30] (needs Immune to Fumble), Master Poisoner [4·40]

### Bank of Erdreja (Guild)
- Identify [2·20] (needs any magic CS or Sense Magic CS) → Diagnose Powers @ [5·50]
- Bank Advisor (Clerk) @ [2·20] → Bank Advisor (Associate) @ [3·30] → Bank Advisor (Broker) @ [4·40]. Every step also needs Oathsworn Bank.
- Stand-alone: Immune to Fumble [1·10], Conceal Item [2·20], Locate [2·20], Immune to Mind Effects @ [5·50] (needs Rally)

### Knowledge Guilds (Alchemists, Bank, Bards, Casino)
- General Knowledge <X> [1·10] → Newsmonger [2·20] → Improved Research Ability [4·40]

### Arcane Guilds (Corruptors, Healers, Incantors, Mages)

This list is marked `Ω*`. High Magic <X> cannot be gained with Jack of All Trades.

- +4 Spell Power [1·10] → +8 Spell Power [2·20] → +12 Spell Power [4·40] → +16 Spell Power @ [5·50]
- Arcane Crafter (Apprentice) [1·10] → Arcane Crafter (Adept) [2·20] → Arcane Crafter (Master) [4·40]
- Specialisations and summoning lists, all @ [1·10]: Dark Incantation, Daemonology, Elementalism, Enchanting, Light Incantation, Necromancy, Shadow Magic, Theology
- High Magic (Daemonology) @ [4·40] needs Daemonology. High Magic (Elementalism) @ [4·40] needs Elementalism. High Magic (Necromancy) @ [4·40] needs Necromancy. High Magic (Theology) @ [4·40] needs Theology.
- High Magic <X> @ [5·50]
- Identify [2·20] → Diagnose Powers @ [5·50]

### Martial Guilds (Armourers, Militia, Rangers, Scouts)
- Stand-alone: Quick Armour Repair [1·10]
- Armour Mastery [2·20] → Armour Mastery (Advanced) [4·40] → Armour Mastery (Expert) @ [5·50]

### Generic list (any character)
- Apprentice <X> [1·10] → Journeyman <X> [2·20] → Master <X> [3·30]
- Immune to Repel [2·20] → Immune to Repel and Strikedown [3·30] → Immune to Immobilisation @ [5·50]
- Scholar <X> [2·20] → Sage <X> @ [4·40]
- Awakened <X> @ [1·10]. Can only be created by an Awakened creature of the matching race.
- Tutor @ [4·40]
- <X> Oathsworn @ [1·10] → Activate <X> Item @ [2·20]
- <X> Command @ [5·50]
- Treewalker # [5·**85**] (needs Perform Transport Rite), Voidportal # [5·85], Circle Warden @# [5·85], Circle Watcher # [5·85]
- Magical Armour Mastery [2·20] (needs any Armour CS)
- Herb Lore (Improved) # [2·**25**] (needs Herb Lore)
- Escape Bonds [3·30]
- Shield Dismiss Level @ [3·30]
- Fearsome Aspect @ [4·40]
- Advanced Armour Repair # [3·30] → Master Armour Repair # [4·40]
- +1 LHV @ [5·50]
- Mighty Blow # [4·**20**] (needs Brutish Strike #)
- Crushing Blow # [5·**25**] (needs Focused Strike #)

---

## 10. Occupational Skill catalogue

This table covers every OS that appears on a Section 9 list, sorted alphabetically.

- **Lists:** Alc = Alchemists, Arm = Armourers, Bard = Bards, Cas = Casino, Cor = Corruptors, Heal = Healers, Inc = Incantors, Mag = Mages, Mil = Militia, Rng = Rangers, Sco = Scouts, Bank = Bank of Erdreja, Know = Knowledge Guilds, Arc = Arcane Guilds, Mart = Martial Guilds, Gen = Generic.
- **R** = Restricted (`@`). "Magic CS" means Spellcasting, Incantation, Healing or Corruption.
- An *(implied)* entry in "Replaces" means the chain suggests it but the description does not say so. See [Section 13](#13-ambiguities-and-errata).

| Skill | T | OSP | R | Lists | Learn prereq | Use requires | Replaces | Effect (summary) |
|---|---|---|---|---|---|---|---|---|
| +4 Spell Power | 1 | 10 | | Arc | — | — | — | +4 Spell Power per day (Rule of Double). |
| +8 Spell Power | 2 | 20 | | Arc | +4 Spell Power | — | +4 Spell Power | +8 Spell Power per day. |
| +12 Spell Power | 4 | 40 | | Arc | +8 Spell Power | — | +8 Spell Power | +12 Spell Power per day. |
| +16 Spell Power | 5 | 50 | @ | Arc | +12 Spell Power | — | +12 Spell Power | +16 Spell Power per day. |
| +1 LHV | 5 | 50 | @ | Gen | — | Body Development 2 CS (or lammie/loresheet) | — | +1 LHV (Rule of Double). |
| <X> Oathsworn | 1 | 10 | @ | Gen | Permission of faction or guild X | — | — | Sworn to X. Main event only. Exempt from 4-per-season and the 12 cap. Oathbreaker Curse removes it. |
| Activate <X> Item | 2 | 20 | @ | Gen | <X> Oathsworn | — | — | Activate X's items. X can revoke it. |
| <X> Command | 5 | 50 | @ | Gen | — | Lammie or loresheet | — | **Never on a player card:** recorded on an unpublished NPC/DPC loresheet (ruling). Includes Oathsworn X, Activate X Item, Immune to Lethal Alchemical Venoms and Tutor. Cannot be Beguiled. Exempt from the 12 cap. |
| Additional Reforging | 1 | 10 | | Arm | — | — | — | +1 reforge on items you craft yourself (+1 each for Armoursmith and Weaponsmith). |
| Advanced Healing | 2 | 20 | | Heal | Revive | Healing CS | Revive | Chant of Heal Wound covers all locations at no extra power. 1 power + 10 s removes debilitation. |
| Advanced Pattern Scan | 4 | 40 | | Heal | Discern Pattern Type | Healing or Corruption CS | Discern Pattern Type | Discern pattern type, alien or aberrant pattern, possession and regeneration. Some curse cures. |
| Apprentice <X> | 1 | 10 | | Gen | — | — | — | Income: +1 Gold per Gathering. Exempt from 4-per-season and the 12 cap. |
| Arcane Crafter (Apprentice) | 1 | 10 | | Arc | — | Magic CS | — | 2 × L1 crafted arcane items per main event. |
| Arcane Crafter (Adept) | 2 | 20 | | Arc | Arcane Crafter (Apprentice) | Magic CS | Arcane Crafter (Apprentice), includes it | 2 × L1 + 2 × L2 per event. |
| Arcane Crafter (Master) | 4 | 40 | | Arc | Arcane Crafter (Adept) | Magic CS | Arcane Crafter (Adept), includes it | 2 each of L1, L2 and L3 per event. |
| Armour Mastery | 2 | 20 | | Mart | — | Armour CS | — | +1 AV (Rule of Double). |
| Armour Mastery (Advanced) | 4 | 40 | | Mart | Armour Mastery | Armour CS | Armour Mastery | +2 AV. |
| Armour Mastery (Expert) | 5 | 50 | @ | Mart | Armour Mastery (Advanced) | Armour CS | Armour Mastery (Advanced) *(implied)* | +2 AV. Immune to non-Artefact Crush. Does not protect shields. |
| Armoursmith (Apprentice) | 1 | 10 | | Arm | — | — | — | 1 × L1 armour or shield per event. 1 reforge. Remove Corrosion in 30 s. |
| Armoursmith (Artisan) | 4 | 40 | | Arm | Repair Enchanted Items | — | Repair Enchanted Items | L1 + L2 armour or shields (2 items). 2 reforges. Repair destroyed crafted shields. |
| Armoursmith (Master) | 5 | 50 | @ | Arm | Armoursmith (Artisan) | — | Armoursmith (Artisan) | L1–L3 (3 items). 3 reforges. Repair any destroyed shield. |
| Awakened <X> | 1 | 10 | @ | Gen | Rite of Creation by an Awakened creature of the same race | Awakened loresheet | — | Special creature evolution of the base race. Counts toward 4 per season. Blocks other special creature types. |
| Bank Advisor (Clerk) | 2 | 20 | @ | Bank | Oathsworn Bank | Oathsworn Bank | — | Submit 1 item per event for repower assessment. |
| Bank Advisor (Associate) | 3 | 30 | @ | Bank | Bank Advisor (Clerk), Oathsworn Bank | Oathsworn Bank | Bank Advisor (Clerk) *(implied)* | 2 items per event. |
| Bank Advisor (Broker) | 4 | 40 | @ | Bank | Bank Advisor (Associate), Oathsworn Bank | Oathsworn Bank | Bank Advisor (Associate) *(implied)* | 3 items per event. |
| Beguile | 5 | 50 | @ | Bard | Cast Mass Charms **and** Detect and Remove Beguile | — | Detect and Remove Beguile | Detect and remove Beguile. Immune to Charms. 4 power: innate Beguile after 5 minutes of conversation. |
| Bowyer (Apprentice) | 2 | 20 | | Rng | — | — | — | Craft an L1 projectile weapon or bandolier. Check arrows in 10 s each. Mend a shattered bow in 1 minute. |
| Bowyer (Master) | 4 | 40 | | Rng | Bowyer (Apprentice) | — | Bowyer (Apprentice) | L1 + L2 (or a combined once-a-year item). Check arrows in 5 s. Mend in 30 s. |
| Cast Additional Incantation | 5 | 50 | @ | Inc | Last Rites (Improved) **or** Master Countermagic | Light or Dark Incantation OS | — | Also cast from the standard Incantation list. |
| Cast Additional Magecraft | 5 | 50 | @ | Mag | Master Countermagic | Enchanting or Shadow Magic OS | — | Also cast from the standard Spellcasting list. |
| Cast High Countermagic | 3 | 30 | | Inc, Mag | — | Spellcasting or Incantation CS | — | Cast High Countermagic for 4 power. |
| Cast Mass Charms | 4 | 40 | | Bard, Cas | Immune to Charms | — | Immune to Charms | Immune to Charms. Cast Befriend, Enthral or Enthral Unliving as an L3 mass spell (4 power) if you can cast them. |
| Champion | 4 | 40 | | Inc, Mag | Transcend Armour | Armour CS | Transcend Armour | Cast Ranged and Mass spells in any armour. |
| Conceal Item | 2 | 20 | | Cas, Sco, Bank | — | — | — | Conceal 1 item up to small-weapon size. Only Locate finds it. |
| Conceal Item (Improved) | 3 | 30 | | Cas | Conceal Item | — | Conceal Item, includes it | Or conceal a pouch of up to 50 coins. |
| Contribute to 2nd Ritual | 1 | 10 | | Mag | — | Contribute CS | — | Contribute to 2 rituals per day. |
| Contribute to 3rd Ritual | 3 | 30 | | Mag | Contribute to 2nd Ritual | Contribute CS | Contribute to 2nd Ritual | Contribute to 3 rituals per day. |
| Create Antidotes | 1 | 10 | | Alc | Poison Lore or Potion Lore CS | Poison Lore or Potion Lore CS | — | 1 × L1 antidote or protection potion per event. |
| Create Antidotes (Improved) | 3 | 30 | | Alc | Create Antidotes | Poison Lore or Potion Lore CS | Create Antidotes | Up to 3 × L1 or L2 per event. |
| Create Poison (Novice) | 2 | 20 | | Alc | Poison Lore CS | Poison Lore CS | — | 1 × L1 poison per event. |
| Create Poison (Artisan) | 3 | 30 | | Alc | Create Poison (Novice), Poison Lore CS | Poison Lore CS | Create Poison (Novice) | L1 + L2 poison. |
| Create Poison (Master) | 4 | 40 | | Alc | Create Poison (Artisan), Poison Lore CS | Poison Lore CS | Create Poison (Artisan) | L1–L3 poison. |
| Create Poison (Magical) | 5 | 50 | @ | Alc | Create Poison (Master), Poison Lore CS | Poison Lore CS | Create Poison (Master) | L1–L3 + 1 magical poison. 1 tailored poison per year. |
| Create Potion (Novice) | 2 | 20 | | Alc | Potion Lore CS | Potion Lore CS | — | 1 × L1 potion per event. |
| Create Potion (Artisan) | 3 | 30 | | Alc | Create Potion (Novice), Potion Lore CS | Potion Lore CS | Create Potion (Novice) | L1 + L2 potion. |
| Create Potion (Master) | 4 | 40 | | Alc | Create Potion (Artisan), Potion Lore CS | Potion Lore CS | Create Potion (Artisan) | L1–L3 potion. |
| Create Potion (Magical) | 5 | 50 | @ | Alc | Create Potion (Master), Potion Lore CS | Potion Lore CS | Create Potion (Master) | L1–L3 + 1 magical potion. 1 tailored potion per year. |
| Create Reagents | 1 | 10 | | Alc | Poison Lore or Potion Lore CS | Poison Lore or Potion Lore CS | — | 1 reagent per event. |
| Create Reagents (Improved) | 2 | 20 | | Alc | Create Reagents | Poison Lore or Potion Lore CS | Create Reagents | 2 reagents per event. |
| Crushing Blow | 5 | 50 | @ | Arm, Mil | Mighty Blow | Large Melee Weapon Use CS | Mighty Blow | Crush or Strikedown with a large weapon. Immune to Strikedown and Repel. Excludes Goblin Resilience. |
| Damage Reduction (Fatal) | 5 | 50 | @ | Inc | Dedicated Follower | — | — | Fatal deals a single blow instead of destroying the location. See HB p.88. |
| Daemonology | 1 | 10 | @ | Arc | — | Spellcasting CS | — | Daemonology list up to Spellcasting CS level. |
| Dark Incantation | 1 | 10 | @ | Arc | — | Incantation CS | — | Dark Incantation list **instead of** Incantation. Excludes Light Incantation. |
| Dedicated Follower | 3 | 30 | | Inc | — | — | — | Automatic Lay to Rest on death. Paladins Armour gives AV 3. |
| Detect and Remove Beguile | 2 | 20 | | Bard, Cas | — | — | — | Detect Beguile after 30 s of conversation. Remove it after 30 s more. |
| Diagnose Powers | 5 | 50 | @ | Bank, Arc | Identify | Lammie or loresheet, **and** magic CS or Sense Magic CS | — | Identify item powers with a referee. Restore 1 item card per day. |
| Discern Ancestral Being | 3 | 30 | | Inc | — | — | — | Discern the dismiss level of an ancestral being or possession (30 ft). |
| Discern Daemonic Being | 3 | 30 | | Mag | — | — | — | As above, for daemons. |
| Discern Elemental Being | 3 | 30 | | Heal | — | — | — | As above, for elementals. |
| Discern Pattern Type | 1 | 10 | | Heal | — | Healing or Corruption CS | — | Discern Living, Unliving or Magical pattern (proximity). |
| Discern Race | 2 | 20 | | Rng | Tracking | — | — | Discern the race on the target's card (30 ft). |
| Discern Race and Pattern | 4 | 40 | | Rng | Discern Race | — | Discern Race | Race and pattern type (30 ft). |
| Discern Unliving | 3 | 30 | | Cor, Inc | — | — | — | Discern the dismiss level of an unliving being or possession (30 ft). |
| Dismiss/Control +2 | 1 | 10 | | Cor, Inc | — | — | — | +2 to Dismiss and Control totals, including in wedges. |
| Dismiss/Control +4 | 2 | 20 | | Cor, Inc | Dismiss/Control +2 | — | Dismiss/Control +2 | +4. |
| Dismiss/Control +6 | 4 | 40 | | Cor, Inc | Dismiss/Control +4 | — | Dismiss/Control +4 | +6. |
| Dismiss/Control +8 | 5 | 50 | @ | Cor, Inc | Dismiss/Control +6 (printed as "+8", see E1) | — | Dismiss/Control +6 | +8. |
| Elementalism | 1 | 10 | @ | Arc | — | Healing CS, **or** Light Incantation OS, **or** Enchanting OS | — | Elementalism list up to the highest castable level of the enabling lists. |
| Enchant Projectile Weapon | 5 | 50 | @ | Rng | — | Projectile Weapon Use CS + Bow Competency | — | Choose to shoot Enchanted Through. |
| Enchanting | 1 | 10 | @ | Arc | — | Spellcasting CS | — | Enchanting list **instead of** Spellcasting. Excludes Shadow Magic. |
| Escape Bonds | 3 | 30 | | Gen | — | — | — | Escape in-character bonds in 1 minute (not while immobilised). |
| Ethereal Shot | 5 | 50 | @ | Rng | Discern Race and Pattern | Projectile Weapon Use CS + Bow Competency | Discern Race and Pattern, includes it | Once per 10 minutes: discern a target, then shoot Affect <race/pattern> for 1 minute. |
| Fearsome Aspect | 4 | 40 | @ | Gen | — | Own Spell Power (4 per use) | — | Innate Mass Fear (L3 mass, cannot be countered). |
| Focused Through | 2 | 20 | | Sco | Immune to Fumble | — | — | Through once per 10 minutes with a small or medium weapon in the primary hand. Every blow vs immobilised targets. |
| Forensic Analysis | 3 | 30 | | Alc | — | — | — | Examine a body for poison, then race, pattern and potions. |
| Forgery | 5 | 50 | @ | Bard, Sco | Written Forgery **and** Recognise Forgery CS | — | Written Forgery | Forge 1 item per event. Forged training: 2 × T1–3 or 1 × T4, including `@`. |
| General Knowledge <X> | 1 | 10 | | Know | — | — | — | News sheets. X is one of Guildsman, Merchant, Rumour Monger, Storyteller, Wanderer or War Scout. Exempt from the 12 cap. |
| Guarded Channelling | 5 | 50 | @ | Heal | Immune to Disease | Healing CS | — | Aura of Defence while casting a non-instant Cure. |
| Halt Shot | 5 | 50 | @ | Rng | Strikedown Shot | Projectile Weapon Use CS + Bow Competency | Strikedown Shot | Projectiles strike for Halt or Strikedown. |
| Hand of Nature | 2 | 20 | | Rng | — | Triage or Triage (Advanced) CS | — | Triage two locations at once. |
| Heal Alien or Aberrant Pattern | 3 | 30 | | Cor, Heal | — | Healing or Corruption CS | — | Cure effects work on alien and aberrant patterns. |
| Heal Magical Pattern | 5 | 50 | @ | Cor, Heal | Heal Alien or Aberrant Pattern | Healing or Corruption CS | Heal Alien or Aberrant Pattern | As above, plus magical patterns. Not unliving. |
| Herb Lore | 1 | 10 | | Alc, Bard, Heal | — | Herb loresheet (downloaded per event) | — | 12 herbs per day. See the herb table in [12.6](#126-herb-lore-table). |
| High Magic (Daemonology) | 4 | 40 | @ | Arc | Daemonology | Spellcasting 2 CS | Daemonology | Daemonology L3. |
| High Magic (Elementalism) | 4 | 40 | @ | Arc | Elementalism | Healing 2, **or** Spellcasting 2 + Enchanting, **or** Incantation 2 + Light Incantation | Elementalism | Elementalism L3. |
| High Magic (Necromancy) | 4 | 40 | @ | Arc | Necromancy | Corruption 2, **or** Incantation 2 + Dark Incantation, **or** Spellcasting 2 + Shadow Magic | Necromancy | Necromancy L3. |
| High Magic (Theology) | 4 | 40 | @ | Arc | Theology | Incantation 2 + Theology | Theology | Theology L3. |
| High Magic <X> | 5 | 50 | @ | Arc | — | A level 2 magic CS | — | L3 of every list castable at L2. No extra power. Not available through Jack of All Trades or retirement vouchers. |
| Identify | 2 | 20 | | Bank, Arc | Magic CS or Sense Magic CS | Magic CS or Sense Magic CS | — | Identify magic item powers with a referee (not weapons, armour, scrolls or alchemy). |
| Immune to Befriend and Confusion | 3 | 30 | | Bard, Rng | — | — | — | Immune to Befriend and Confusion. |
| Immune to Charms | 3 | 30 | | Bard, Cas | Detect and Remove Beguile | — | — | Immune to Befriend, Beguile, Enthral and Enthral Unliving. |
| Immune to Disease | 3 | 30 | | Cor, Heal | — | Healing or Corruption CS | — | Immune to Disease. |
| Immune to Fear | 1 | 10 | | Bard, Cas, Cor, Inc, Mil | — | — | — | Immune to Fear. |
| Immune to Fumble | 1 | 10 | | Mil, Rng, Sco, Bank | — | — | — | Immune to Fumble. |
| Immune to Fumble and Shatter | 3 | 30 | | Mil, Rng | Immune to Fumble | — | Immune to Fumble | You and held items are immune to Fumble and Shatter. |
| Immune to Immobilisation | 5 | 50 | @ | Sco, Gen | Immune to Repel and Strikedown | — | — | Immune to all Immobilisation (not Petrify). |
| Immune to Lethal Alchemical Venoms | 4 | 40 | | Alc | — | — | — | Immune to non-magical lethal venoms. |
| Immune to Mind Effects | 5 | 50 | @ | Bard, Cas, Mil, Bank | Rally | — | — | Immune to all Mind effects. |
| Immune to Mute | 2 | 20 | | Bard, Cas, Mil | Immune to Fear | — | — | Immune to Mute. |
| Immune to Repel | 2 | 20 | | Arm, Mil, Sco, Gen | — | — | — | Immune to Repel. |
| Immune to Repel and Strikedown | 3 | 30 | | Arm, Mil, Sco, Gen | Immune to Repel | — | Immune to Repel | Immune to Repel and Strikedown. |
| Immune to Sleep | 4 | 40 | | Rng | Immune to Befriend and Confusion | — | — | Immune to Sleep. |
| Immune to Through | 4 | 40 | | Mil | Immune to Fumble and Shatter | — | — | You and your armour are immune to Through unless it is Artefact or your elemental weakness. |
| Impweave Expertise | 4 | 40 | @ | Mag | — | (Daemonology casting) | — | Spell Reduction (1) on your own Daemonology spells. Does not stack with other Spell Reduction. |
| Improved Research Ability | 4 | 40 | | Know | Newsmonger | — | — | Summer research, and assist others as well as doing your own. Main event only. |
| Increased Alchemical Production | 4 | 40 | | Alc | Create Reagents (Improved) | Poison Lore or Potion Lore CS | Create Reagents (Improved) | Your own alchemy counts as made with reagents. |
| Journeyman <X> | 2 | 20 | | Gen | Apprentice <X> | — | Apprentice <X> | Income: +2 Gold per Gathering. Exempt. |
| Last Rites | 1 | 10 | | Inc | — | Incantation CS | — | Spell Reduction (1) on Lay to Rest. |
| Last Rites (Improved) | 4 | 40 | | Inc | Last Rites | Incantation CS | Last Rites | Spell Reduction (1) on Lay to Rest and (2) on Speak with Ancestor. |
| Light Incantation | 1 | 10 | @ | Arc | — | Incantation CS | — | Light Incantation list **instead of** Incantation. Excludes Dark Incantation. |
| Locate | 2 | 20 | | Cas, Mil, Sco, Bank | — | — | — | 30 s search. Reveals concealed items. |
| Magic Resistance | 5 | 50 | @ | Mil | Immune to Through | — | Immune to Through, includes it | Immune to Through. Damage Reduction (Harm and Mage Bolt). |
| Magical Armour Mastery | 2 | 20 | | Gen | Armour CS | Armour CS | — | Armour Mastery OS also apply to Magical Armour. |
| Master <X> | 3 | 30 | | Gen | Journeyman <X> | — | Journeyman <X> | Income: +4 Gold per Gathering. Exempt. |
| Master Countermagic | 4 | 40 | | Inc, Mag | Cast High Countermagic **or** High Magic (Incantation / Spellcasting) | Spellcasting or Incantation CS | Cast High Countermagic | High Countermagic. Spell Reduction (1) on Iron Will and High Countermagic. |
| Master Poisoner | 4 | 40 | | Alc, Sco | — | Poison Lore CS | — | Contact poisons, poison immobilised targets, poison food (referee needed). |
| Mighty Blow | 4 | 40 | | Arm, Mil | Immune to Repel and Strikedown | Large Melee Weapon Use CS | Immune to Repel and Strikedown *(implied)* | Strikedown with a large weapon. Immune to Repel and Strikedown. Excludes Goblin Resilience. |
| Mind Healing | 4 | 40 | | Cor, Heal | Heal: Advanced Healing. Cor: Repair Unliving (Advanced). | — | — | Discern and remove Mind effects (30 s chant). Includes Immune to Sleep. |
| Mortician | 2 | 20 | | Cor | — | Triage (Advanced) CS | — | Triage (Advanced) works on corporeal unliving. |
| Mortician (Expert) | 4 | 40 | | Cor | Mortician | Triage (Advanced) CS | Mortician | Mortician actions take 30 s. |
| Necromancy | 1 | 10 | @ | Arc | — | Corruption CS, **or** Shadow Magic OS, **or** Dark Incantation OS | — | Necromancy list up to the highest castable level of the enabling lists. |
| Newsmonger | 2 | 20 | | Know | General Knowledge <X> | — | All General Knowledge <X> | All news sheets. |
| Oiled Weapons | 3 | 30 | | Alc, Rng, Sco | Immune to Fumble | — | — | Apply weapon oils to your own weapons without Poison Lore. |
| Perform Teleport Rite | 5 | 50 | @ | Cas | Perform Transport Rite | Magic CS | — | Adds Transportation and Teleport. Spell Reduction (1) on Teleport. |
| Perform Transport Rite | 1 | 10 | | Cas, Mag | — | Magic CS | — | Adds Transportation to your spell lists. |
| Polyglot | 5 | 70 | @ | Bard | Any Script Master <X> | — | Script Master | All scripts in the three script categories. |
| Quick Armour Repair | 1 | 10 | | Mart | — | Armour CS | — | Armour repair takes half the time (not MAV or NAV). |
| Rally | 4 | 40 | @ | Bard, Cas, Mil | Immune to Mute **and** Immune to Fear | — | Immune to Fear | Immune to Fear. Mass Remove Fear once per 10 minutes (no power needed). |
| Repair Destroyed Items | 2 | 20 | | Arm | Weaponsmith (Apprentice) | — | Weaponsmith (Apprentice) | 1 × L1 weapon or shield. 1 reforge. Repair destroyed crafted weapons and shields. |
| Repair Enchanted Items | 2 | 20 | | Arm | Armoursmith (Apprentice) | — | Armoursmith (Apprentice) | 1 × L1 armour or shield. 1 reforge. Repair crafted shields. Remove Corrosion. |
| Repair Unliving (Advanced) | 2 | 20 | | Cor | Revitalise Unliving | Can cast the Repair Unliving spell | Revitalise Unliving | Chant of Repair Unliving covers all locations. 1 power removes debilitation. |
| Revitalise Unliving | 1 | 10 | | Cor | — | Can cast the Repair Unliving spell | — | Repair Unliving covers all locations except mortal wounds. |
| Revive | 1 | 10 | | Heal | — | Healing CS | — | Chant of Heal Wound covers all locations except mortal wounds. 1 power removes non-venom debilitation. |
| Rite Master | 1 | 10 | | Mag | — | Ritual Magic CS | — | Use power donated by others for rites. |
| Ritual Magic (Improved) | 3 | 30 | | Mag | Rite Master | Ritual Magic CS | Rite Master | +1 power to rituals you perform. Includes Rite Master's ability. |
| Ritualist (Expert) | 4 | 40 | | Mag | Ritual Magic (Improved) | Ritual Magic CS | Ritual Magic (Improved) | +3 ritual power. Donated power. |
| Ritualist (Master) | 5 | 50 | @ | Mag | Ritualist (Expert) | Ritual Magic CS | Ritualist (Expert) | +5 ritual power. Donated power. |
| Sage <X> | 4 | 40 | @ | Gen | Scholar <X> (same topic) | — | Scholar <X> | Better research on topic X. Main event only. Research request needed to learn it. Buy once. Exempt. |
| Scholar <X> | 2 | 20 | | Gen | — | — | — | Research on topic X. Up to 2 different topics. Exempt. |
| Script Master <X> | 3 | 30 | | Bard | Any TNS <X> in that script family | — | The TNS skills in that family | All scripts in one category. |
| Shadow Magic | 1 | 10 | @ | Arc | — | Spellcasting CS | — | Shadow Magic list **instead of** Spellcasting. Excludes Enchanting. |
| Shield Dismiss Level | 3 | 30 | @ | Gen | — | — | — | Discerns against you need a second 10 s attempt, and you notice the attempt. |
| Shield Mastery | 3 | 30 | | Arm, Mil | — | Shield Use CS | — | Parrying Normal Crush does not destroy the shield. |
| Shield Mastery (Expert) | 4 | 40 | | Arm, Mil | Shield Mastery | Shield Use CS | Shield Mastery | Also Enchanted (non-Artefact) Crush. |
| Sleepless Chanting | 2 | 20 | | Bard | — | — | — | Immune to Sleep while chanting. |
| Source of Life | 5 | 50 | @ | Heal | Mind Healing **and** Advanced Healing | Healing 2 CS | Advanced Healing, includes it and Mind Healing | Cast Total Heal without High Magic. Spell Reduction (3) on Total Heal with High Magic (Healing). |
| Source of Unlife | 5 | 50 | @ | Cor | Mind Healing **and** Repair Unliving (Advanced) | Corruption 2 CS | Repair Unliving (Advanced), includes it and Mind Healing | Cast Total Repair Unliving without High Magic. Spell Reduction (3) with High Magic (Corruption). |
| Spell Tempering | 3 | 30 | | Arm | Additional Reforging | — | — | 1 spell-tempered item per event. |
| Strikedown Shot | 4 | 40 | | Rng | Immune to Fumble and Shatter | Projectile Weapon Use CS + Bow Competency | — | Projectiles can strike for Strikedown. |
| Thaulmonic Alignment | 3 | 30 | @ | Mag | — | — | — | Mage Armour gives AV 3. |
| Theology | 1 | 10 | @ | Arc | — | Incantation CS | — | Theology list up to Incantation CS level. |
| Through | 4 | 40 | @ | Sco | Focused Through | — | Focused Through | Always Through with a small or medium weapon in the primary hand. |
| TNS Spiral | 1 | 10 | @ | Sco | Oathsworn Scouts Guild | — | — | Translate the Spiral script. Cannot be tutored. |
| Tracking | 1 | 10 | | Mil, Rng, Sco | — | Referee or marshal present | — | Read tracks. Once per hour after 8pm: Detect <Race> within 30 ft. |
| Transcend Armour | 2 | 20 | | Inc, Mag | — | Armour CS | — | Ranged spells in Medium armour and Mass spells in Heavy armour. |
| Translate Named Script <X> | 1 | 10 | | Bard, Sco | — | — | — | Translate one named script. You can buy it for each script. |
| Trap Lore | 3 | 30 | | Rng, Sco | — | — | — | Craft 1 trap bag per event. Detect, disarm and set traps (referee needed). |
| Traverse Faction Wards | 3 | 30 | | Sco | — | — | — | Pass faction wards in 10 s (not raised ritual seals). |
| Triage (Master) | 2 | 20 | | Heal | — | Triage (Advanced) CS | — | Triage (Advanced) actions on living targets take 30 s. |
| Triage (Expert) | 4 | 40 | | Heal | Triage (Master) | Triage (Advanced) CS | Triage (Master) | As Master, plus it works on alien and magical patterns. |
| Tutor | 4 | 40 | @ | Gen | — | — | — | Teach 1 of your OS (up to T4) per main event. |
| Unending Voice | 3 | 30 | | Bard | Sleepless Chanting | — | Sleepless Chanting | Spell Reduction (1) on Chants. Immune to Sleep while chanting. |
| Weapon Finesse | 5 | 50 | @ | Sco | Through | (Thrown weapons need the thrown or missile weapon CS) | Through | Through with thrown weapons, or any melee weapon you can use, including the off-hand. |
| Weaponsmith (Apprentice) | 1 | 10 | | Arm | — | — | — | 1 × L1 weapon or shield per event. 1 reforge. |
| Weaponsmith (Artisan) | 4 | 40 | | Arm | Repair Destroyed Items | — | Repair Destroyed Items | L1 + L2 weapons or shields (2 items). 2 reforges. Repair crafted weapons and shields. |
| Weaponsmith (Master) | 5 | 50 | @ | Arm | Weaponsmith (Artisan) | — | Weaponsmith (Artisan) | L1–L3 (3 items). 3 reforges. Repair any destroyed weapon or shield. |
| Written Forgery | 4 | 40 | | Bard, Sco | Translate Named Script <X> **and** Recognise Forgery CS | — | — | Forged training: 1 × T1–3 including `@`, once per event. |

**Generic-list `#` versions with non-standard costs** (these need a lammie or loresheet):

| Skill | T | OSP | Learn prereq | Use requires | Replaces | Effect |
|---|---|---|---|---|---|---|
| Treewalker # | 5 | 85 | Perform Transport Rite | Ritual Magic CS or Perform Transport Rite. Not Unliving pattern, not Corruption CS. | — | Use the Tree Network. Loresheet. |
| Voidportal # | 5 | 85 | — | Lammie or loresheet | — | Voidportal loresheet. |
| Circle Warden @# | 5 | 85 | — | — | — | Circle Warden ability. |
| Circle Watcher # | 5 | 85 | — | Command (Watchers) | — | Circle Watcher ability. |
| Herb Lore (Improved) # | 2 | 25 | Herb Lore | Lammie or loresheet | Herb Lore, includes it | 24 herb uses per day. |
| Advanced Armour Repair # | 3 | 30 | (Quick Armour Repair, implied) | Armour CS | Quick Armour Repair | Half repair time. One location to full in 1 minute. Not MAV or NAV. |
| Master Armour Repair # | 4 | 40 | Advanced Armour Repair | Armour CS | Advanced Armour Repair | Half time. All locations to full in 2 minutes. |
| Mighty Blow # | 4 | 20 | Brutish Strike # | Large Melee Weapon Use CS | Brutish Strike # | As Mighty Blow. |
| Crushing Blow # | 5 | 25 | Focused Strike # | Large Melee Weapon Use CS | Focused Strike # | As Crushing Blow. |

---

## 11. Skills that need a lammie or loresheet

These skills are not on any handbook purchase list. Their tier and cost come from the lammie or loresheet that grants them. Where a loresheet in the loresheets file lists the skill, its tier and cost are given in [Section 12](#12-loresheet-reference). A build tool should treat them as unlockable only through an attached lammie or loresheet record.

| Skill | Use requires | Replaces / requires | Exclusions | Effect (summary) |
|---|---|---|---|---|
| +1 Base LHV # | Lammie or loresheet | — | Base LHV cannot go above 4 | +1 base LHV. |
| +1 / +2 Bonus Power Rating # | Lammie or loresheet | +2 replaces +1 | — | +1 or +2 PR carrying limit. |
| +2 LHV # | Lammie or loresheet | Requires and replaces +1 LHV | — | +2 LHV (Rule of Double). |
| +5 / +10 Dismiss Rank # | Lammie or loresheet | — | — | Adds to your own dismiss rank. The name "Dismiss Rank +N" means the same skill. |
| +1 / +2 Magical Armour # | Lammie or loresheet | +2 replaces +1 | MAV cap 4 | Magical armour on all locations. Repair for 1 power. Boosts Mage or Paladins Armour instead if you have it. Refreshes at time-in. |
| +1 / +2 Natural Armour | Lammie or loresheet | +2 replaces +1 | NAV cap 4. A NAV sigil does not stack, Carapace sigils do. | Natural armour. |
| Beast-form Intelligence # | Lammie or loresheet | — | — | Speak in beast form. |
| Beast-form Skill Use # | Lammie or loresheet | Requires and replaces Beast-form Intelligence | — | Also use OS in beast form. |
| Beast-form Casting # | Lammie or loresheet | Requires and replaces Beast-form Skill Use | — | Also cast spells in beast form. |
| Beast-form Changes +2 # | Lammie or loresheet | — | — | 2 more changes per day. |
| Beguile <X> # | Lammie or loresheet | Each level replaces the one before | — | Innate Beguile X times per day. |
| Brutish Strike # | Lammie or loresheet + Large Melee Weapon Use CS. Children 10–15 can also buy it. | Mighty Blow replaces it | Goblin Resilience | Strikedown once per 10 minutes with a large weapon. |
| Cast All Incantation # | Lammie or loresheet + Incantation CS | Replaces Cast Additional Incantation | Enables Elementalism **or** Necromancy | Cast All Incantation list. |
| Cast All Magecraft # | Lammie or loresheet + Spellcasting CS | Replaces Cast Additional Magecraft | Enables Elementalism **or** Necromancy | Cast All Spellcasting list. |
| Cursing Word # | Lammie or loresheet | — | — | Inflict specific curses. |
| Damage Reduction (Crush) # | Lammie or loresheet | — | — | Damage Reduction vs Crush (not shields, not Artefact). |
| Damage Reduction (All) # | Lammie or loresheet | Replaces Damage Reduction (Crush) | — | Damage Reduction vs all damage effects. Immune to non-Artefact Through. Regeneration capped at 1 per 5 minutes. |
| Damage Reduction (Harm) # / (Mage Bolt) # | — | — | — | Harm or Mage Bolt deals a single blow instead. |
| Immune to Fatal # / Harm # / Mage Bolt # | Lammie or loresheet | Each replaces the matching Damage Reduction | — | Immunity. |
| Immune to Disease and Decay # | Lammie or loresheet | — | — | Immunity. |
| Immune to Paralysis # | Lammie or loresheet | — | — | Immunity. |
| Druid / Paladin / Vampire / Warlock / Werecreature <X> # | In-character requirements on the loresheet | Each level replaces the one below | Essence creature | Grants a loresheet OS list up to the stated tier. |
| Enchanted Claws # | Lammie or loresheet + Claw Competency | — | — | Claws strike Enchanted. |
| Enchanted Strikedown Claws # | Lammie or loresheet + Claw Competency | Requires and replaces Enchanted Claws | — | Claws strike Enchanted Strikedown. |
| Fearsome Aspect <X> # | Lammie or loresheet | Each level replaces the one before | — | Innate Mass Fear X times per day. |
| Fence # | Lammie or loresheet | — | — | Value crafted items for black-market resale. |
| Focused Strike # | Large Melee Weapon Use CS | Crushing Blow replaces it | Goblin Resilience | Crush once per 10 minutes with a large weapon. |
| Global Blast Wedge # | Lammie or loresheet + Mage Bolt Wedge | — | — | Head of a warlock wedge casts a global Blast. |
| Goblin Resilience # | Lammie or loresheet | — | Mighty Blow, Crushing Blow, Brutish Strike, Focused Strike | Unconscious with no location at -1: debilitated after 1 minute. |
| Hard Worker # | — | — | — | Collect full annual income at every main event. |
| Toughen Body # | Lammie or loresheet | — | — | Locations cannot go below 0 except from Enchanted, Harm, Mage Bolt, Smite, Fatal or Artefact. |
| Harden Body # | Lammie or loresheet | Requires and replaces Toughen Body | — | As Toughen Body, but Enchanted no longer bypasses it. |
| Improved Regeneration # | Lammie or loresheet | Buy once | Not item regeneration | Regeneration one step faster (maximum 10 s). |
| Improved Ritual of Peace # | — | — | Only works with **no** Tier 5 OS | Not taken below 0 by Artefact, Mage Bolt, Harm or Fatal under the Ritual of Peace. |
| Jack of All Trades # | — | Hold 1 at a time | Not for High Magic <X> | Counts as a training facility for 1 `Ω` OS. See [8.3](#83-acquisition-routes-hb-p75). |
| Level 2 Spell Reduction (1) # | Lammie or loresheet | — | Not Iron Will | Spell Reduction (1) on L2 spells. |
| Mage Bolt Wedge # | Lammie or loresheet | — | — | Head of a warlock wedge casts Mage Bolt. |
| Mass Blast Wedge # | Lammie or loresheet + Global Blast Wedge | — | — | Head of a wedge casts Mass Blast. |
| Magical Armour Repair # | — | — | — | MAV restored after 5 minutes out of combat. |
| Master Brewer # | — | — | — | Once per event, a second copy of an L1 or L2 potion or poison. |
| Mystic Claws # | — | — | — | Claws deliver effects, venoms and oils. |
| Natural Armour Regrowth # | — | — | — | NAV restored after 5 minutes out of combat. |
| Natural Claws # | Claw Competency | — | — | Use two claws. |
| Retractable Claws # | Claw Competency | — | — | Natural claws. 30 s debilitated to extend or retract. |
| <X> Paragon # | Various | — | 1 Paragon at a time | Paragon loresheet. |
| Regenerates (<time>, <effects>) [<exclusions>] # | — | — | — | Regenerate 1 hit per location per time period. |
| Ritual Crafter # | Ritual Magic CS | Replaces and includes Spell Tempering (Master) | — | +2 to item-creation rituals. |
| Self Repairing Armour | Armour CS | Replaces and includes Master Armour Repair | — | Worn AV restored after 5 minutes out of combat. |
| Sigil Spell Reduction (1) # | Lammie or loresheet | — | — | Spell Reduction (1) on Sigils and High Sigils. |
| Spell Reduction (1) # / (2) # | Lammie or loresheet | — | Not Iron Will. Minimum cost 1. | Spell Reduction on all spells. |
| Spell Tempering (Master) # | — | Replaces Spell Tempering | — | 1 master spell-tempered item per event. |
| Strike for Enchanted # | Lammie, loresheet or High Magic sigil | — | Weapon must not already have a non-Normal damage type | Strike Enchanted with a melee weapon. |
| Venom Resistance # | Lammie or loresheet | — | — | Purge Poison cures non-magical venoms. |

---

## 12. Loresheet reference

Source: `Lorien_Trust_Loresheets_v4.06.md`. The tables below give costs, tiers and prerequisites **as printed on each loresheet**. Where these differ from the handbook, the loresheet value applies to characters holding that loresheet (OS-6). Inconsistencies are listed under L-items in [Section 13](#13-ambiguities-and-errata).

### 12.1 General loresheet rules

- **LS-1** A loresheet skill purchase **counts toward the 4 per year** limit.
- **LS-2** The cap of **4 Tier 5 OS** per character still applies.
- **LS-3 (ruling)** Buying a skill from a loresheet you hold is an **alternative route**. It uses the loresheet's own prerequisites and cost, and skips the handbook's learn prerequisites. Example: a Paladin can buy *Champion* for 10 OSP without *Transcend Armour*. Only a character who holds that loresheet can use the route. Use requirements still apply.
- **LS-4** A skill on your own loresheet counts as **unrestricted** for you (HB p.74).
- **LS-4a (ruling)** The unpublished **Architect** loresheet lets a character buy any skill they have access to, up to Tier 4, without buying its learn prerequisites. The skill still costs its OSP. One step per tree per year and all use requirements still apply. An Architect purchase does **not** count toward the 4 buys per year.
- **LS-5** In essence creature tables, **Min. Type** is the lowest creature tier that can buy the skill. For example, "Mature" means Werecreature tier 2 or higher.
- **LS-6** Availability flags:
  - **(B):** the skill only works in beast form.
  - **(V):** the skill only works between dusk (8pm) and time-out (1am).
- **LS-7** A character with a loresheet must carry it. Spellcasting or power-using characters also need the Event Power Sheet, which tracks daily Spell Power and ritual use:
  - Ritualist Performance and Ritualist Contribute: 1 each per day.
  - Contribute to Ritual: up to 3 per day.
- **LS-8** Loresheet skills can only be bought **at a main event, not at prebook**. They need **no training voucher**, so a restricted (`@`) skill bought from a loresheet needs no training facility. They still count toward the 4 per year (LS-1).

### 12.2 Loresheet types

| Loresheet | Kind | Build effects |
|---|---|---|
| Elemental | Planar creature (race) | Can be Dismissed and Controlled, and cannot become immune to either unless stated. Innate Control Elemental costs 1 own power per 5 ranks. Corpse and items vanish on death. Has its own OS list. |
| Daemon | Planar creature (race) | As Elemental, for daemons. Has its own OS list. |
| Ancestral | Planar creature (race) | As Elemental, for ancestrals. Has its own OS list. |
| Plant | Existential race | Herb Cure Wound heals 2 wounds per location. Has its own OS list. |
| Mineral | Existential race | Has its own OS list. |
| Beast | Existential race | Has its own OS list. |
| Unliving | Pattern | Immune to Decay, Disease, Paralysis, Fatal, the Ritual of Peace and non-magical alchemy. **Cannot cast:** Heal Wound, Remove Paralysis, Heal Fatal Wound, Endurance, Shield from Corruption, High Carapace Armour, Total Heal. Recovers hits at time-in. Regeneration is capped at 1 per 30 s. Has its own OS list. |
| Magical Pattern | Pattern | Immune to alchemical and magical poisons, Decay, Disease, Paralysis, Fatal, the Ritual of Peace and Embody Unliving. Total Heal, Heal Wound and Repair Unliving only work if the caster has *Heal Magical Pattern*. Has its own OS list. |
| Alien Life Pattern | Pattern | Bypasses the Ritual of Peace. Immune to alchemy. Standard Cure spells don't work unless the caster has *Heal Alien or Aberrant Pattern*. No OS list. |
| Possession | Condition | Only 1 possession at a time. It ends Embody Unliving. The character gains the planar category of the possessor. No OS list. |
| Werecreature, Paladin, Warlock, Vampire, Druid | Essence creature | Tiered progression, restrictions and OS lists. See [12.4](#124-essence-creatures). |
| Essence Creature | Shared rules for essence creatures | Essence pool and bloodline rites. See [12.5](#125-essence-and-bloodlines). |
| Awakened Beastkin, Awakened Drow | Awakened race | Racial ability and OS list. See [12.3](#123-special-creature-os-lists). |
| Treewalker, Voidportal | Skill loresheet | See [12.7](#127-skill-loresheets). |
| Herb / Herb (Advanced) | Game sheet | Herb costs. See [12.6](#126-herb-lore-table). |
| Event Power Sheet, Daily Sigil Record | Game sheets | Power and ritual tracking (LS-7). Sigil PR values (PR-1a). |

### 12.3 Special creature OS lists

The format is `Skill [Tier·OSP]`, and a prerequisite follows in brackets. "None" on the loresheet is shown as no bracket.

**Elemental**
- Shield Dismiss Level [1·10], Elementalism [1·10], Dismiss Rank +5 [1·10], Discern Elemental Being [1·10]
- TNS Elemental Runes [1·10] (Elementals only, cannot be tutored)
- +1 Magical Armour [2·20], +1 Natural Armour [2·20], Magical Armour Mastery [2·20]
- Dismiss Rank +10 [3·30] (needs Dismiss Rank +5)
- High Magic (Elementalism) [4·40] (needs Elementalism)
- Voidportal # [4·85]
- +1 Base LHV [4·65]

**Daemon**
- Shield Dismiss Level [1·10], Daemonology [1·10], Dismiss Rank +5 [1·10], Discern Daemonic Being [1·10]
- TNS Daemon Runes [1·10] (Daemons only, cannot be tutored)
- +1 Magical Armour [2·20], Magical Armour Mastery [2·20]
- Dismiss Rank +10 [3·30] (needs Dismiss Rank +5)
- Level 2 Spell Reduction (1) [4·60]
- High Magic (Daemonology) [4·40] (needs Daemonology)

**Ancestral**
- Shield Dismiss Level [1·10], Theology [1·10], Dismiss Rank +5 [1·10], Discern Ancestral Being [1·10]
- TNS Ancestor Runes [1·10] (Ancestrals only, cannot be tutored)
- Dismiss Rank +10 [**1**·30] (needs Dismiss Rank +5; see L3)
- Toughen Body [3·30], Strike for Enchanted [3·30], Champion [3·30]
- High Magic (Theology) [4·40] (needs Theology)
- Cast Additional Incantation [4·40] (needs Last Rites (Improved) or Master Countermagic)

**Unliving**
- Shield Dismiss Level [1·10], Necromancy [1·10], Dismiss Rank +5 [1·10], Discern Unliving [1·10]
- TNS Grave Runes [1·10] (Unliving only, cannot be tutored)
- Dismiss Rank +10 [3·30] (needs Dismiss Rank +5)
- +1 LHV [3·30]
- Toughen Body [4·40]
- High Magic (Necromancy) [4·40] (needs Necromancy)
- +1 Base LHV [4·65]

**Plant**
- Conceal (Item) [1·10], Herb Lore [1·5]
- Herb Lore (Improved) [2·20] (needs Herb Lore)
- Regeneration (10m) [3·25]
- +1 Natural Armour [3·35]
- Improved Regeneration [4·35] (needs Regeneration)
- +2 Natural Armour [4·45] (needs +1 Natural Armour)
- Treewalker # [4·85] (needs Ritual Magic or Perform Transport Rite)

**Mineral**
- Toughen Body [3·30], Damage Reduction (Crush) [3·30], Immune to Through [3·35], Immune to Repel and Strikedown [3·25], Strike for Enchanted [3·30]
- Harden Body [4·85] (needs Toughen Body)

**Magical Pattern**
- Fearsome Aspect [3·30]
- Spell Reduction (1) [4·40], Magical Armour Repair [4·40], Strike for Enchanted [4·40]
- +2 Natural Armour [4·40] (needs +1 Natural Armour)
- +2 Magical Armour [4·40] (needs +1 Magical Armour)

**Beast**
- Fearsome Aspect [3·30], +1 Natural Armour [3·35]
- Natural Armour Regrowth [3·30] (needs Natural Armour)

**Awakened Beastkin.** Racial ability: herb Cure Wound on the head or torso cures twice.
- TNS Beastkin [1·5], Immune to Fumble [1·5], Herb Lore [1·5], Tracking [1·5]
- Discern Race [1·10] (needs Tracking)
- Immune to Repel and Strikedown [3·25], +1 Natural Armour [3·25]
- Natural Claws [3·25] (needs Claw Competency)
- Retractable Claws [3·10] (needs Natural Claws and Claw Competency)
- Mystic Claws [4·10] (needs Natural Claws and Claw Competency)
- +2 Natural Armour [4·35] (needs +1 Natural Armour)
- Natural Armour Regrowth [4·30] (needs +2 Natural Armour)

**Awakened (all).** An awakened creature still counts as its base race for Bane, Affect, detection and elemental weakness. Awakening is a 10-minute rite by an awakened creature of the same type and costs the target 10 OSP. An awakened creature cannot also become an essence, summonable or other special creature. Each awakened sheet only fits its base race.

**Awakened Drow.** Racial ability: immune to Wasting. Incantation 2 CS grants Chant of Wasting. Dark Incantation gives Spell Reduction (1) on Chant of Wasting.
- TNS Elven [1·5], Dedicated Follower [1·10]
- Light Incantation [1·5] (needs Incantation CS), Dark Incantation [1·5] (needs Incantation CS). MG-5 still applies: you cannot hold both.
- Focused Through [2·15] (needs Immune to Fumble), Conceal Item [2·10], Locate [2·15]
- Traverse Faction Wards [3·20]
- Cast Additional Incantation [5·20] (needs Last Rites (Improved) or Master Countermagic)

**Awakened Dwarf.** Stubborn as an Ancestor: once per 10 minutes, resist a Normal Strikedown or Crush from a melee weapon (not Earth).
- TNS Dwarf [1·5], Quick Armour Repair [1·10]
- Advanced Armour Repair [3·30] (needs Quick Armour Repair) → Master Armour Repair [4·40] → Self Repairing Armour [3·30]
- Ritual Magic (Improved) [3·25], Spell Tempering [3·25] → Spell Tempering (Master) [4·35] → Ritual Crafter [4·55]

**Awakened Elf.** Quickblood: once per 10 minutes, Paralysis lasts 30 s instead of 1 minute.
- TNS Elven [·5], Immune to Sleep [·35] (no tier printed; see L14)
- +4 Spell Power [1·5] → +8 [2·15] → +12 [3·35] → +16 [4·45]
- Level 2 Spell Reduction (1) [5·55] (needs +12 Spell Power), Strike for Enchanted [4·45]

**Awakened Fey.** The Song of Arcadia: once per 10 minutes, Mute lasts 30 s instead of 1 minute.
- TNS Fey [1·5], Detect and Remove Beguile [1·5] → Immune to Charms [2·25]
- Magical Armour Mastery [2·15] (needs any Armour Use CS)
- +1 Magical Armour [3·35] → +2 Magical Armour [4·45] → Magical Armour Repair [4·35]

**Awakened Halfling.** Younger (Race) and Trickier: for this character, Traverse Faction Wards includes and replaces Escape Bonds, and Conceal Item (or Improved) includes and replaces Locate.
- TNS Halfling [1·5], Escape Bonds [1·5] → Traverse Faction Wards [3·20]
- Immune to Fear [1·5], Locate [2·15] → Conceal Item [2·15] → Conceal Item (Improved) [3·25]
- Identify [1·5], Venom Resistance [1·10], Beguile <1> [3·25]

**Awakened Human.** The Innocence: immune to the Red Mist curse. Oathbreaker: Tier 5 skills learned with Jack of All Trades (and JoAT itself) are suspended while the guild's Oathbreaker Curse lasts, and lost if it isn't lifted within a year. If the loresheet is lost, every skill learned with JoAT is removed.
- Improved Ritual of Peace [1·10], Hard Worker [1·5]
- **Jack of All Trades [2·20]**: the source of JoAT. Each use removes it from the card, so each use needs another 20 OSP purchase.
- +1 Bonus PR [2·15] → +2 Bonus PR [3·30]

**Awakened Olog.** Walk It Off: once per 10 minutes, resist a Normal Strikedown or Crush from a melee weapon (not Air).
- TNS Olog [1·5], +1 Natural Armour [3·30] → +2 Natural Armour [4·40]
- Regeneration (10 min) [·40] (does not regenerate Artefact; no tier printed) → Improved Regeneration [4·30]
- +1 LHV [4·35] → +2 LHV [4·45] (also needs Body Development 1) → +1 Base LHV [4·60] (also needs Body Development 2)

**Awakened Uruk.** Hagglemaster: better Fence offers. Brutish Strike is replaced by Mighty Blow, which then costs 20 OSP less; Focused Strike is replaced by Crushing Blow, which then costs 25 OSP less. Goblin Resilience excludes all four.
- TNS Uruk [·5], +1 LHV [·45], Master Brewer [·30], Herb Lore [·5] → Herb Lore (Improved) [·20] (no tiers printed; see L14)
- Brutish Strike [1·10], Focused Strike [3·25] (needs Brutish Strike or Mighty Blow)
- Goblin Resilience [2·15] → Toughen Body [4·35] → Harden Body [5·50]

**Circle Warden** and **Circle Watcher** (skill loresheets). Both grant Immune to Mute and Immune to Charms, Network Attunement without Ritual Magic 3, and a 30-second Transportation spell. Warden is bonded to one Ritual Circle; Watcher is aligned to the Watchers' circles and adds the Rite of Blocking and Network Leap.
- Both: Immune to Mind Effects [5·40] (needs Rally), Cast All Magecraft [5·65] (needs Cast Additional Magecraft), Cast All Incantation [5·65] (needs Cast Additional Incantation)
- Watcher only: Voidportal # [4·85]

**Diagnose Powers** (skill loresheet). Held with the Diagnose Powers skill.
- Daemonology, Elementalism, Necromancy, Theology [1·5 each], Level 2 Spell Reduction (1) [4·60]

### 12.4 Essence creatures

Each essence creature has four tiers. A higher tier replaces the lower one. Tier advancement uses essence rites ([12.5](#125-essence-and-bloodlines)), and each tier also costs the OSP shown.

#### Werecreature

Physrep requirements: a removable mask, combat-safe natural claws and a passed Claw Competency test.

Rules that affect a build:
- **Lycan Moon:** after 8pm the character must transform, and regeneration improves by 1 step.
- **Transformation:** takes 30 s, during which the character is debilitated. It lasts at most 1 hour, followed by a 30-minute cooldown. It is forced when the character goes unconscious or enters their Grace Period.
- **Silver weakness:** silver inflicts a magical Disease that stops all healing until removed.

| Tier | Type | OSP | Hits (beast form) | Regeneration (beast form) | Voluntary changes per day | PR |
|---|---|---|---|---|---|---|
| 1 | Werecreature | 10 | Normal | 1 per 10 min | 2 | 1 |
| 2 | Mature Werecreature | 20 | +1 Base LHV | 1 per 5 min | 3 | 2 |
| 3 | Elder Werecreature | 30 | +1 Base LHV, +1 LHV, DR Crush | 1 per 1 min | 4 | 3 |
| 4 | Alpha Werecreature | 40 | +1 Base LHV, +2 LHV, DR Crush | 1 per 1 min | 6 | 4 |

| Skill | Min. type | T | OSP | Prereq |
|---|---|---|---|---|
| Tracking (B) | All | 1 | 5 | — |
| Discern Race | All | 1 | 10 | Tracking |
| +1 LHV (B) | All | 1 | 10 | — |
| Fearsome Aspect 1 (B) | All | 1 | 10 | — |
| Beast-form Skill Use (B) | All | 1 | 10 | — |
| Improved Regeneration (B) | All | 1 | 10 | — |
| Fearsome Aspect 2 (B) | Mature | 2 | 20 | Fearsome Aspect 1 |
| Enchanted Claws (B) | Mature | 2 | 20 | — |
| Beast-form Changes (+2) | Mature | 2 | 20 | — |
| Discern Race and Pattern | All | 3 | 30 | Discern Race |
| +2 LHV (B) | Mature | 3 | 30 | +1 LHV (B) |
| Fearsome Aspect 4 (B) | Elder | 3 | 30 | Fearsome Aspect 2 |
| Beast-form Casting (B) | Alpha | 3 | 30 | Beast-form Skill Use |
| +1 Natural Armour | Mature | 3 | 30 | — |
| Enchanted Strikedown Claws (B) | Alpha | 4 | 40 | Enchanted Claws |
| +2 Natural Armour | Elder | 4 | 40 | +1 Natural Armour |

#### Paladin

Physrep requirement: an in-character Paladin Brand. The character automatically has *Dedicated Follower* and is Laid to Rest on death.

Rules that affect a build:
- **Blind Faith:** cannot be targeted by Heal Wound or effects derived from it. Cannot receive Mage Armour. If the character gains the Spellcasting CS, DR Crush and DR All stop working.
- **Focus of Piety:** bonus AV on worn armour and Paladins Armour. It stacks with Armour Mastery and is subject to the Rule of Double.

| Tier | Type | OSP | Focus of Piety | PR | Power gained |
|---|---|---|---|---|---|
| 1 | Paladin | 10 | +1 AV | 1 | Voice Above Them All: once per day, cast Speak with Ancestor for 4 power. |
| 2 | Questing Paladin | 20 | +1 Base AV, +1 AV | 2 | Shield/Dagger of Pantheon: once per hour, Chant of Sanctuary or Wasting for 0 power. |
| 3 | Knight Paladin | 30 | +1 Base AV, +2 AV | 3 | Dagger of Suns Dawning: 4 power gives a small weapon Lay to Rest on every hit for 10 minutes. |
| 4 | Lord Paladin | 40 | +2 Base AV, +2 AV | 4 | — |

| Skill | Min. type | T | OSP | Prereq |
|---|---|---|---|---|
| Champion | All | 1 | 10 | — |
| Dismiss/Control +4 | All | 1 | 10 | — |
| Immune to Paralysis | All | 2 | 20 | — |
| Shield Mastery | All | 2 | 20 | — |
| Immune to Charms | All | 2 | 20 | — |
| Last Rites (Improved) | All | 2 | 20 | — |
| Immune to Through | Questing | 3 | 30 | — |
| Damage Reduction (Fatal) | Questing | 3 | 30 | Dedicated Follower |
| Immune to Disease and Decay | All | 3 | 30 | Immune to Paralysis |
| Strike for Enchanted | Knight | 3 | 30 | — |
| Damage Reduction (Crush) | Knight | 4 | 40 | Immune to Through |
| Damage Reduction (All) | Lord | 5 | 40 | Damage Reduction (Crush) |
| Immune to Fatal | Knight | 5 | 40 | Damage Reduction (Fatal) |
| Cast Additional Incantation | Knight | 5 | 30 | Last Rites (Improved) |

#### Warlock

Physrep requirement: an in-character Runic Brand. The character automatically has *Sigil Spell Reduction (1)*.

Rules that affect a build:
- **Price of Power:** the character gets **no benefit** from Body Development, +Base LHV, Toughen Body, Harden Body, Titans Endurance or Paladins Armour. In effect, **base LHV stays at 1**.
- **Focus of the Void:** additional daily Warlock Power, which stacks with other power sources.

| Tier | Type | OSP | Ability gained | Maximum wedge contribution | Additional power | PR |
|---|---|---|---|---|---|---|
| 1 | Warlock | 10 | Circle Affinity: 4 power to count as an extra ritual contributor | 1 | — | 1 |
| 2 | Adept Warlock | 20 | Familiar Spell: write an L1 spell onto a sigil, then cast it every 10 minutes for 0 power | 2 | +4 | 2 |
| 3 | Master Warlock | 30 | Leech Power: 1-minute rite to take 1 power from a willing Warlock | 3 | +8 | 3 |
| 4 | Master Adept Warlock | 40 | Magic Weaver: transport up to 20 characters. Arcane crafted items cost 1 power. Leech Power takes 2. | 4 | +12 | 4 |

| Skill | Min. type | T | OSP | Prereq |
|---|---|---|---|---|
| Cast High Countermagic | All | 1 | 10 | Spellcasting 2 CS |
| Mage Bolt Wedge | All | 1 | 10 | Spellcasting 2 CS |
| Shadow Magic | All | 1 | 10 | — |
| Enchanting | All | 1 | 10 | — |
| +8 Spell Power | All | 2 | 10 | — |
| Global Blast Wedge | Adept | 2 | 20 | Mage Bolt Wedge |
| Level 2 Spell Reduction (1) | Adept | 2 | 30 | — |
| +12 Spell Power | Adept | 3 | 20 | +8 Spell Power |
| Mass Blast Wedge | Master | 3 | 30 | Global Blast Wedge |
| Cast Additional Magecraft | Adept | 3 | 20 | Spellcasting 2 CS |
| +16 Spell Power | Master Adept | 4 | 40 | +12 Spell Power |
| High Magic (Spellcasting) | Master | 5 | 30 | Spellcasting 2 CS |
| High Magic (Healing) | Master | 5 | 30 | Healing 2 CS |
| Spell Reduction (2) | Master | 5 | 50 | Level 2 Spell Reduction (1) |
| Cast All Magecraft | Master Adept | 5 | 65 | Cast Additional Magecraft |

#### Vampire

Requirements: fangs worn at all times while in character, and the **Unliving loresheet**. All Unliving restrictions apply.

Rules that affect a build:
- **Energy Drain:** once per hour between 8pm and time-out, recover all hits from a target.
- **Lords of the Night:** the dismiss rank shown below applies only at night. From time-in until dusk it is 10.

| Tier | Type | OSP | Base dismiss rank | Night abilities | PR |
|---|---|---|---|---|---|
| 1 | Vampire | 10 | 10 | Mist Form (V) | 1 |
| 2 | Mature Vampire | 20 | 20 (V) | + Waste Not Want Not | 2 |
| 3 | Elder Vampire | 30 | 45 (V), +1 Base LHV (V) | + Crypt Blade | 3 |
| 4 | Ancient Vampire | 40 | 60 (V), +2 Base LHV (V) | + Death Incarnate (V) | 4 |

| Skill | Min. type | T | OSP | Prereq |
|---|---|---|---|---|
| Beguile 1 (V) | All | 1 | 10 | — |
| Repair Unliving (Advanced) | All | 2 | 20 | Revitalise Unliving |
| Dismiss/Control +4 | All | 2 | 10 | — |
| Beguile 2 (V) | Mature | 2 | 20 | Beguile 1 |
| Toughen Body (V) | Mature | 2 | 20 | — |
| Dismiss/Control +8 | All | 3 | 30 | Dismiss/Control +4 |
| Beguile 3 (V) | Elder | 3 | 30 | Beguile 2 |
| Beguile 4 (V) | Ancient | 4 | 40 | Beguile 3 |
| Harden Body (V) | Ancient | 4 | 40 | Toughen Body (V) |
| +1 LHV (V) | Mature | 4 | 20 | — (stacks with the +1 LHV OS) |
| High Magic (Corruption) | Elder | 5 | 50 | Corruption 2 CS |
| Source of Unlife | Ancient | 5 | 65 | Mind Healing and Repair Unliving (Advanced) |

#### Druid

Physrep requirement: a totem or symbol of an animal, plant or beast.

Rules that affect a build:
- **Armour limit:** Armour Use CS give standard AV only (Light 1, Medium 2, Heavy 3). Other sources give **no** bonus AV (see L10). The character cannot receive Mage Armour.
- **Force of Nature:** bonus Natural AV by tier (below).

| Tier | Type | OSP | Force of Nature | PR | Scales of the Dragon ability |
|---|---|---|---|---|---|
| 1 | Druid | 10 | — | 1 | Root Veins: Paralysis on you lasts 30 s. |
| 2 | Mature Druid | 20 | +1 Natural AV | 1 | Creation Affinity: a successful Cure Wound gives a free second Cure Wound within 10 s. |
| 3 | Elder Druid | 30 | +2 Natural AV | 2 | Blessing of Germination: take 1 enchanted damage (once per 10 minutes) to cast Global Cure Wound. |
| 4 | Ancient Druid | 40 | +3 Natural AV | 4 | Absolution of Erdreja: once per day, spend all remaining power (at least 4) to petition for curse removal. |

| Skill | Min. type | T | OSP | Prereq |
|---|---|---|---|---|
| Theology | All | 1 | 10 | — |
| Herb Lore | All | 1 | 5 | — |
| Cast High Countermagic | All | 1 | 10 | — |
| Herb Lore (Improved) | All | 2 | 20 | Herb Lore |
| +1 Natural Armour | All | 2 | 20 | — |
| Master Countermagic | Mature | 2 | 10 | Cast High Countermagic |
| +8 Spell Power | All | 2 | 10 | — |
| +12 Spell Power | Mature | 3 | 20 | +8 Spell Power |
| Natural Armour Regrowth | Mature | 3 | 30 | Natural Armour |
| Natural Claws | Elder | 3 | 25 | Claw Competency |
| Retractable Claws | Elder | 1 | 10 | Natural Claws |
| Cast Additional Incantation | Elder | 4 | 40 | Last Rites (Improved) or Master Countermagic |
| High Magic (Incantation) | Elder | 5 | 30 | Incantation 2 CS |
| Cast All Incantation | Ancient | 5 | 65 | Cast Additional Incantation |

### 12.5 Essence and bloodlines

(LS: Essence Creature)

- **ES-1** Each essence creature generates **1 Essence per year**, or **2** at tiers 3 and 4. Essence refreshes at the Spring Moot and unspent essence expires at the end of the Gathering. A **Pariah** generates 0.
- **ES-2** A bloodline **locks** once it holds 1 × T4, 4 × T3, 8 × T2 and 16 × T1 creatures. A locked line cannot use the Rite of Creation.
- **ES-3** How a character gains or changes essence tier:

| Rite | Cost | Effect |
|---|---|---|
| Creation | 1 Essence from a T3 or T4 creature | Turns a willing target into a T1 creature of that type. |
| Tier Advancement | 1 Essence from a higher-tier creature of the same type or line | Target goes up 1 tier. |
| Peer Advancement | 4 Essence from 4 T3/T4 peers of the same tier and line | Target goes up 1 tier. |
| Assimilation (referee needed) | None. A higher-tier target dies during the rite. | Performer goes up 1 tier. |
| Malevolence (referee needed) | A same- or higher-tier target dies | Performer moves into the target's bloodline. |
| Exile | Target's tier + 1 Essence | Target becomes a Pariah. |
| Adoption | 1 Essence | Target is adopted into the bloodline. |
| Lineage | Free, once per event | List the line members at or below your tier. |
| Yielding | Free, once per event | Voluntarily go down 1 tier. |

- **ES-4** A build tool should record for each essence creature: type, tier, bloodline and Pariah status. Buying the tier OS (10/20/30/40 OSP) goes with the rite.

### 12.6 Herb Lore table

(LS: Herb / Herb (Advanced))

- Herb Lore gives **12** herbs per day. Herb Lore (Improved) gives **+12**.
- Each application takes 10 s at proximity and doesn't need Concentration.
- Characters with Herb Lore can pool their herbs. At least one of them must meet any skill requirement.

| Herb effect | Herbs | Target | Skill required |
|---|---|---|---|
| Cure Wound | 2 | Living only | — |
| Remove Disease | 2 | — | — |
| Purge Poison | 2 | — | — |
| Purge All Poisons | 3 | — | — |
| Full Cure | 5 | — | — |
| Total Heal | 14 | Living only | — |
| Repair Unliving | 3 | Unliving only | Mortician, Mortician (Expert) or Necromancy |
| Full Repair Unliving | 6 | Unliving only | Mortician, Mortician (Expert) or Necromancy |
| Total Repair Unliving | 14 | Unliving only | Mortician, Mortician (Expert) or Necromancy |
| Full Cure Daemon | 6 | Daemon only | Triage (Master), Triage (Expert) or Daemonology |
| Full Cure Ancestral | 6 | Ancestral only | Triage (Master), Triage (Expert) or Theology |
| Full Cure Elemental | 6 | Elemental only | Triage (Master), Triage (Expert) or Elementalism |

### 12.7 Skill loresheets

| Loresheet | Requires | Grants |
|---|---|---|
| Treewalker | *Perform Transport Rite*, a lammie or loresheet, and Spellcasting, Incantation or Healing CS. **Not** available with Corruption, Necromancy or an Unliving pattern. | Attune to a Network Tree in 30 s. A 10 s rite and 4 power teleports you to the nearest attuned tree, passing faction wards. |
| Voidportal | Lammie or loresheet | *Perform Teleport Rite* and Spell Reduction (2) on Teleport. Once per day during a ritual, step out to Game Control for up to 10 minutes. |

---

## 13. Ambiguities and errata

Every item that changed the tool's answers has a ruling (below). The remaining rows record typos, naming variants and data notes; each has a stated treatment.

### Confirmed rulings

These items were settled by the project owner on 2026-09-17. They are now rules and need no switch.

| ID | Ruling | Where recorded |
|---|---|---|
| A5 | A skill is replaced only where its description says so. Rally does not replace Immune to Mute. | REP-2a |
| A6 | A replacing skill counts as the skill it replaced for learn prerequisites. | REP-2b |
| L1 | Loresheet purchases are an alternative route. They skip handbook learn prerequisites and use the loresheet cost. Only holders of the loresheet can use the route. | LS-3 |
| R1 | An OS tree is defined by learn prerequisites. You cannot buy an OS in the same year as its prerequisite. The teaching guild doesn't matter. | OS-2 |
| R5 | The two retirement double steps must be on different trees. | RET-3a |
| C1 | Income, research and knowledge skills and Oathsworn go on the left side of the card. Command is never on a player card. | Section 2 |
| A13 | Pattern changes: Living → Magical or Living → Unliving only. | 3.1 |
| R6 | Architect purchases follow one step per tree per year but do **not** count toward the 4 buys per year. | 12.1 |
| C2 | The left side holds exactly the skills that don't count toward the 12 (LIM-4). Newsmonger and Improved Research Ability are right-side skills. | Section 2 |
| C3 | Skills granted on a special creature or special power card don't count toward the 12-skill limit, the Tier 5 cap or mutual exclusions. Only the character card counts. | 8.4 |
| C4 | A Warlock's extra power (Focus of the Void) is added on top of the Rule of Double cap. | 12.4 |
| C5 | Script Master <X> is bought for one script family (for example *Script Master <Myth & Magic>*) and replaces the Translate Named Script skills in that family. | Section 10 |
| C6 | After Polyglot, any Translate Named Script skill left over from one of the three families is **redundant**: it stays on the card but is shown as covered by Polyglot. Restricted scripts (Runes, Spiral) and scripts outside the families are not redundant. | Section 10 |
| C8 | Jack of All Trades costs **20 OSP every time** it is bought (Awakened Human loresheet). | 12.3 |
| C9 | Where a loresheet row has no tier printed, use the skill's tier from the handbook, if it has one. | L14 |
| C10 | Master Brewer (Awakened Uruk) is Tier 3 and Regeneration (Awakened Olog) is Tier 4. What matters is that neither is Tier 5. Both can only be bought from their loresheets. | L14 |
| C11 | Essence creature tiers are Occupational Skills (Druid, Paladin, Vampire, Warlock and Werecreature <X>, HB p.90–98): Vampire → Mature → Elder → Ancient Vampire at 10/20/30/40 OSP, each replacing the one below, on the right side of the card. The creature's tier is the tier skill on the card. Each tier also needs an essence rite. Taking the skill needs its loresheet (and Vampire also needs Unliving); the tool offers to add required loresheets. | 12.4 |
| C12 | A skill can be taken off the card (switched off or sacrificed, LIM-8) and still count as held for prerequisites. Example: buy Immune to Mute and Rally to reach Immune to Mind Effects, then drop Immune to Mute and Rally. Dropped skills don't count toward the 12 or the Tier 5 cap, give no abilities, and don't clash with other skills. | 8.4 |
| C13 | **Rules exception:** Mighty Blow replaces Immune to Repel and Strikedown. The handbook doesn't say so explicitly. | Section 10 |
| C14 | A skill can be put straight on the character card by a ritual, with no prerequisites and no OSP cost. | 8.3 |
| C15 | A skill bought from a loresheet is valid while any held loresheet offers it (Cast All Magecraft: Warlock, Circle Warden or Circle Watcher). | LS-3 |
| C16 | A skill is redundant when another held skill already includes it (Mind Healing includes Immune to Sleep; Cast All Magecraft includes Shadow Magic and Enchanting; Cast All Incantation includes Light and Dark Incantation), or when a loresheet or special card also grants it. | Section 10 |
| C17 | **Implicit replacements** (not stated in the handbook, confirmed by the owner): Armour Mastery (Expert) replaces (Advanced); Bank Advisor (Associate) replaces (Clerk) and (Broker) replaces (Associate); Perform Teleport Rite replaces Perform Transport Rite; Diagnose Powers replaces Identify; Spell Reduction (2) replaces Level 2 Spell Reduction (1); Dismiss/Control +8 also replaces +4 (the Vampire route skips +6); Dismiss Rank +10 replaces +5; Retractable Claws replaces Natural Claws. Beguile replaces only Detect and Remove Beguile (as the handbook says), not Cast Mass Charms, whose mass-casting ability it doesn't give. Beguile <X> (Vampire, Awakened Halfling) is a separate skill and replaces nothing. | Section 10 |
| C18 | **Covered, not replaced:** these stay on the card, marked redundant, until dropped by hand, and don't count as the covered skill for prerequisites. Immune to Mind Effects covers Immune to Fear, Immune to Befriend and Confusion, Immune to Sleep and Immune to Charms; Immune to Immobilisation covers Immune to Paralysis; Immune to Disease and Decay covers Immune to Disease; Damage Reduction (All) covers Damage Reduction (Fatal); Magic Resistance covers Damage Reduction (Harm) and (Mage Bolt); Beguile covers Immune to Charms. | Section 10 |
| C19 | Fearsome Aspect <X> and Beguile <X>: a higher level replaces the lower levels. | Section 11 |
| C20 | **Prebook tier advancement.** Book all 4 events at the same time and spend all 4 purchases at prebook (so all T1–T3, not `@`), and you can advance one of those skills a second level straight away, e.g. Dismiss/Control +4 then +6. Pay the OSP for both levels; you need the OSP for all 5 skills. The advancement can't be Tier 5 or restricted. | 8.2, 8.3 |
| L7 | Dropped: loresheet purchases never go through Jack of All Trades or retirement vouchers. | 13 |
| A12 | +Base Power is allowed without a magic CS. The tool warns when Fearsome Aspect is held with no Spell Power. | 13 |
| A11 | The only skills that don't count toward the 12 are the ones LIM-4 lists. There are no other 'functional' exemptions. | 13 |
| L4 | Voidportal bought from a loresheet uses that loresheet's tier (Tier 4 on the Elemental and Circle Watcher sheets). | 13 |
| R5 | A retirement double step onto a restricted (@) skill still needs a training facility, tutor or forgery. | RET-3 |
| L12 | On essence loresheets only Min. type limits purchases by the creature's level. The creature's level (Vampire, Mature, Elder, Ancient) and a skill's Tier are different things that the sources both call "tier"; the tool says "Tier" only for skills and names creature levels by type. | 13 |
| L11 | Treewalker: both the handbook and loresheet requirements apply, and the tool shows a note about the mismatch. | 13 |
| L3 | Ancestral Dismiss Rank +10 stays Tier 1 as printed, with a note that it is probably a loresheet error. | 13 |
| E6 | Cast All Spellcasting includes Control Unliving at level 1; the printed list's omission is a mistake. | 13 |
| A10 | Revitalise Unliving and Repair Unliving (Advanced) need Corruption CS, or Incantation CS with Dark Incantation (or Cast All Incantation). | 13 |
| A4 | A character holds either Triage or Triage (Advanced), not both: the higher replaces the lower (CS-8). The same applies to Light, Medium and Heavy Armour Use. | 4.1 |
| E11 | Diagnose Powers needs no separate loresheet check: having the skill is enough. | 13 |
| L10 | A Druid's armour gives standard AV only (Light 1, Medium 2, Heavy 3). Armour Mastery and Armour Mastery (Advanced) add nothing; Armour Mastery (Expert) still gives Crush immunity. | 13 |
| A3 | Ritual Magic needs a magic CS (Spellcasting, Incantation, Healing or Corruption). +Base Power and Invocation don't count. | 13 |
| A1 | Base Spell Power is the **highest** magic CS grant only (Healing 1 + Spellcasting 2 = 12, cap 24). +Base Power adds on top (Spellcasting 2 + Base Power 1 = 16, cap 32). | 13 |
| C7 | **Jack of All Trades** is its own route. It needs the JoAT skill and **Oathsworn <guild>**, either bought or granted by the unpublished **NPC/DPC loresheet** (held for a faction or guild; it grants Oathsworn <X> and <X> Command). It teaches one skill of any tier (restricted included) from an Ω list of that guild, including the guild's group list; not High Magic <X>. Learn prerequisites, 4 purchases per year and one step per tree still apply. One use per season. | 8.3 |

### Ambiguous rules

| ID | Issue | Source | Suggested default |
|---|---|---|---|
| A1 | **Resolved (see Confirmed rulings).** **Spell Power from several magic CS.** Each CS "grants +4 / +12 base Spell Power", and any mix is allowed. But the Rule of Double says "where a character has several Base values, only the highest value will have an effect". It is unclear whether Healing 1 + Spellcasting 2 gives 16 base power or 12. | HB p.55, p.62 | Add the powers together for the pool. Treat the "highest base" clause as applying to separate base-value *sources* such as lammies. **Confirm with the organisers.** |
| A2 | **Resolved with A12.** **+Base Power without a magic CS.** It is allowed, but there is nothing to spend the power on except *Fearsome Aspect*, Magical Armour repair and similar. | HB p.55 | Allow it. |
| A3 | **Resolved (see Confirmed rulings).** **"Some form of casting ability" for Ritual Magic.** Does +Base Power alone count? Does Invocation? | HB p.55 | Require at least one magic CS. |
| A4 | **Resolved (see Confirmed rulings).** **Triage and Triage (Advanced)** are listed as separate CS. It is not stated whether you can or should hold both. | HB p.51 | Allow both, but warn that Advanced covers everything Triage does. |
| A5 | **Resolved (see Confirmed rulings).** **Replacement not stated** for several chains: Immune to Charms (from Detect and Remove Beguile), Immune to Mute, Immune to Mind Effects, Immune to Sleep, Mighty Blow, Armour Mastery (Expert), Bank Advisor tiers, Diagnose Powers (from Identify), Perform Teleport Rite, Guarded Channelling, Mind Healing. | HB p.84–98 | Replace only where the text says so. Treat the rest as additive. For Mighty Blow and Armour Mastery (Expert) the old skill is effectively included. |
| A6 | **Resolved (see Confirmed rulings).** **Does a replacing skill satisfy a prerequisite for its predecessor?** For example, Oiled Weapons needs *Immune to Fumble*, but Immune to Fumble and Shatter replaces it. | HB p.76, p.80 | Yes. A replacing skill satisfies prerequisites that name the skills it replaced, because historic skills stay on the account as inactive. |
| A7 | **Children's immunity** does not count as Immune to Charms for prerequisites. | HB p.75 | Stated explicitly. Enforce it. |
| A8 | **Retirement example** buys "+4 AND +8 Power (counting as one slot)" and gives other one-tier skills their own slots. | HB p.20 | Two-tier jumps use one purchase slot, at most 2 of them, at post-retirement creation only. |
| A9 | **Scholar/Sage counting.** Sage "may only be purchased once". Scholar "may be explicitly purchased twice". | HB p.74, p.96 | At most 2 Scholar/Sage skills in total, and at most 1 of them Sage. |
| A10 | **Resolved (see Confirmed rulings).** **Revitalise Unliving and Repair Unliving (Advanced)** need the ability to cast "Repair Unliving". That spell is on the Corruption and Dark Incantation lists (and Cast All Incantation). | HB p.94–95 | Use requires Corruption CS, **or** Incantation CS + Dark Incantation (or Cast All Incantation). |
| A11 | **Resolved (see Confirmed rulings).** **Functional OS** "may not always count towards your limit of 12". No list is given. | HB p.74 | Add a per-skill `countsTowardLimit` flag. |
| A12 | **Resolved (see Confirmed rulings).** **Fearsome Aspect** uses "their own Spell Power", so it needs a power pool but no magic CS. | HB p.90 | Allow it with any Spell Power source, and warn when the power pool is 0. |
| A13 | **Resolved (see Confirmed rulings).** Pattern changes go one way: Living → Magical or Living → Unliving only. | Owner ruling | — |

### Errata and naming inconsistencies

| ID | Issue | Source | Treatment |
|---|---|---|---|
| E1 | Dismiss/Control +8 lists its prerequisite as "Dismiss/Control **+8**" in both the Corruptors and Incantors lists. | HB p.78–79 | Read it as +6. |
| E2 | The CS is called **Missile Weapon Use** in the CS table but **Thrown Weapon** in the children rules and Weapon Finesse. | HB p.51–53, p.97 | Treat as aliases. |
| E3 | The CS is called **Large Weapon Use** in the table but **Large Melee Weapon Use** in the descriptions. | HB p.51, p.53 | Treat as aliases. |
| E4 | The CS is called **Evaluate** in the table but **Evaluation** in the description. | HB p.51, p.56 | Treat as aliases. |
| E5 | The CS is called **Contribute** in the table, **Contribute to Ritualist** in the description, and **Contribute to Ritual** in the OS text. **Poison Use** is used for Poison Lore in places. | HB p.51, p.55, p.60, p.87 | Treat as aliases. |
| E6 | **Resolved (see Confirmed rulings).** The **Cast All Spellcasting** list leaves out Control Unliving at L1, although Shadow Magic has it. Also, the skill is called Cast All **Magecraft** but the list is called Cast All **Spellcasting**. | HB p.33, p.87 | Flag it and keep the list as printed until confirmed. |
| E7 | Uruk is spelled **Uruk** and **Uruck**. | HB p.7, p.50 | Treat as aliases. |
| E8 | **Immune to Mind Effects** is on the Bank list with prerequisite **Rally**, but Rally is not on the Bank list. | HB p.81 | Rally must come from another list, or through Forgery or Tutor. |
| E9 | The **Awakened <X>** prerequisite is a rite performed by another creature, not an OS. | HB p.83 | Model it as an external flag. |
| E10 | The handbook's **bold race names** (starting races) and **bold replaced prerequisites** were lost in the markdown conversion. | HB p.50, p.75 | Starting races are taken from the race descriptions (HB p.6–7). Replacements are taken from the skill descriptions. |
| E11 | **Resolved (see Confirmed rulings).** **Diagnose Powers** use requires "Lammie or Loresheet", but it is on standard lists at T5. | HB p.90 | Check the loresheet requirement with the organisers. |
| E12 | **Polyglot** costs 70 OSP at T5. The standard T5 cost is 50. | HB p.77 | Printed value. Keep 70. |
| E13 | **Generic-list Mighty Blow # (20) and Crushing Blow # (25)** have the same names as the standard skills (40 and 50). | HB p.83 | Model them as separate catalogue entries (same effect, different route and cost). |

### Loresheet issues

| ID | Issue | Source | Suggested default |
|---|---|---|---|
| L1 | **Resolved (see Confirmed rulings).** **"None" prerequisites against handbook prerequisites.** The loresheet overview says handbook prerequisites still apply unless a skill explicitly says otherwise. But many loresheet rows print "None" for skills that need a prerequisite in the handbook. Examples: Mineral *Immune to Repel and Strikedown* (handbook needs Immune to Repel), Paladin *Champion* (Transcend Armour), Paladin *Last Rites (Improved)* (Last Rites), Unliving *+1 LHV* (Body Development 2 to use). | LS: Overview and creature sheets | Use the loresheet's prerequisite column for **learn** prerequisites. Keep the handbook's **use** requirements (for example Armour CS for Champion). **Confirm with the organisers.** |
| L2 | **Loresheet tiers don't follow cost or chain order.** Examples: Warlock +8 Spell Power is T2 at 10 OSP; Warlock High Magic (Spellcasting) is T5 at 30; Druid Retractable Claws is T1 but needs Natural Claws (T3); Druid Master Countermagic is T2 at 10. | LS: Warlock, Druid | Store tier and cost exactly as printed. Use tier for the T5 cap and routing, and cost for OSP. |
| L3 | **Resolved (see Confirmed rulings).** Ancestral *Dismiss Rank +10* is **Tier 1** at 30 OSP. On the other creature sheets it is Tier 3. | LS: Ancestral | Probably a typo for Tier 3. Keep the printed value but flag it. |
| L4 | **Resolved (see Confirmed rulings).** Voidportal # is **Tier 4** on the Elemental sheet and **Tier 5** in the handbook (both 85 OSP). | LS: Elemental; HB p.83 | Use the loresheet tier for Elementals. |
| L5 | Vampire *Dismiss/Control +8* needs **+4**, skipping +6. Vampire *+1 LHV (V)* "stacks with the +1 LHV OS", although OS-3 bans duplicate skills. | LS: Vampire | Allow both as printed. Model +1 LHV (V) as a separate skill ID. |
| L6 | **Unnamed or shortened skill names** on loresheets: "Conceal" (Conceal Item), "Regeneration (10m)" and "Regeneration" (Regenerates), "Natural Armour" as a prerequisite (+1 Natural Armour), "Magebolt Wedge" (Mage Bolt Wedge), "Fearsome Aspect 1/2/4" (Fearsome Aspect <X>). Fearsome Aspect has no level 3. | LS: Plant, Beast, Druid, Warlock, Werecreature | Treat as aliases. Fearsome Aspect 4 needs Fearsome Aspect 2 as printed. |
| L7 | **Resolved (see Confirmed rulings).** **High Magic (Spellcasting / Healing / Incantation / Corruption)** appear on essence loresheets. In the handbook these are High Magic <X>, which cannot be gained through Jack of All Trades or retirement vouchers. | LS: Warlock, Druid, Vampire | Treat as High Magic <X> for the list named, at the loresheet cost. |
| L8 | Some loresheet skills need a prerequisite that isn't on that loresheet. Examples: Magical Pattern *+2 Natural Armour* and *+2 Magical Armour* need the +1 versions; Vampire *Repair Unliving (Advanced)* needs Revitalise Unliving; Awakened Drow *Focused Through* needs Immune to Fumble. | LS: Magical Pattern, Vampire, Awakened Drow | The prerequisite must come from a handbook list or another loresheet. |
| L9 | **Resolved.** *Titans Endurance* is a Master-level potion from the 2026 crafting list: +2 LHV for a full day, not combinable with the Endurance spell. It affects a day's play, not the build, so the Warlock's Price of Power only lists it. *Chant of Wasting* (Paladin, Awakened Drow) is a loresheet name for the Wasting rite. | LS: Warlock; 2026 crafting list | Keep both as text. |
| L10 | **Resolved (see Confirmed rulings).** The Druid **armour limit** ("no bonus AV from external sources") doesn't say whether Armour Mastery OS count as external. | LS: Druid | Treat Armour Mastery as bonus AV, so it doesn't apply. **Confirm.** |
| L11 | **Resolved (see Confirmed rulings).** The Treewalker **loresheet** also excludes Necromancy and needs Spellcasting, Incantation or Healing CS. The handbook entry only needs Ritual Magic or Perform Transport Rite, and excludes Unliving and Corruption. | LS: Treewalker; HB p.97 | Apply both sets of restrictions. |
| L12 | **Resolved (see Confirmed rulings).** On essence loresheets, skill **tier** and **Min. type** are separate columns. For example, Werecreature *Discern Race and Pattern* is Tier 3 with Min. type "All". The file doesn't say whether creature tier limits skill tier. | LS: Werecreature | Only Min. type restricts by creature tier. Skill tier drives the T5 cap and acquisition routes. |
| L14 | **Resolved (C9, C10).** No tier printed for some awakened rows: Elf (TNS Elven, Immune to Sleep), Olog (Regeneration), Uruk (TNS Uruk, +1 LHV, Master Brewer, Herb Lore, Herb Lore (Improved)). | LS (PDF) | Handbook tier where one exists; otherwise Master Brewer Tier 3 and Olog Regeneration Tier 4. |
| L15 | The markdown copy of the loresheets file was incomplete. It lost the Awakened Dwarf, Elf, Fey, Halfling, Human, Olog and Uruk sheets, the Circle Warden, Circle Watcher and Diagnose Powers sheets, Awakened Drow's Cast Additional Incantation row, the Vampire Base LHV bonuses, and the rule that loresheet skills are main-event only with no training voucher. | PDF vs markdown | Use the PDF. All of these are now in the tool's data. |
| L13 | Umbral is a starting race, but the loresheets file has no Umbral loresheet. There is no Unliving race either: Unliving is a pattern loresheet. | LS | Model race and pattern as separate fields. |

---

## 14. Validation rule checklist

Implement these checks in this order. The rule IDs refer to the sections above.

### Character creation
1. Race is a starting race, or a special creature lammie or loresheet is attached. (3.1)
2. Faction is one of the 10 player factions. (3.2)
3. CS cost total ≤ character points for the age bracket. (CS-1, 5)
4. No CS is duplicated. Levelled skills hold one level only. (CS-2, CS-3)
5. Body Development 1 and 2 are not both held. (4.2)
6. At most one magic CS is at level 2. (CS-6)
7. +Base Power is at most 4 levels. Ritual Magic is at most 3 levels. (4.2)
8. Ritual Magic has a casting ability. (CS-7, A3)
9. Projectile Weapon Use has a Bow Competency flag. (4.2)
10. Age exclusions are respected. (5)

### Occupational Skills (per skill)
11. The skill is on a list available to the character, or on an attached loresheet (`#` skills need the loresheet). (9, 11, OS-6)
12. Learn prerequisites are met, with replaced skills counting as held. (OS-4, A6)
13. Use requirements are met. If not, show a warning, or mark the skill unusable rather than illegal. (OS-4)
14. The acquisition route allows the tier and restriction. (8.3)
    - Prebook: T1–3 and not `@`.
    - Tutor: up to T4.
    - Written Forgery: T1–3.
    - Forgery: T1–3 × 2 or T4 × 1.
    - Jack of All Trades: any tier from an `Ω` list, but not High Magic <X>.
15. The skill is not already held, allowing for distinct <X> parameters. (OS-3)
16. Mutual exclusions are respected. (8.6, MG-5)
17. The skill's special route rules are respected: Oathsworn at a main event; Sage and Improved Research Ability at a main event; TNS Spiral needs Oathsworn Scouts. (8.3)

### Occupational Skills (per season)
18. ≤ 4 non-exempt purchases. (OS-1)
19. No OS is bought in the same year as any of its learn prerequisites. The retirement double-step exception applies, and its two double steps are on different trees. (OS-2, RET-3, RET-3a)
20. Enough OSP balance. OSPs gained on the gate are not usable this season. (8.1)

### Card
21. ≤ 12 counted OS. (LIM-1, LIM-4)
22. ≤ 4 Tier 5 OS. (LIM-2)
23. ≤ 1 Paragon. (LIM-3)
24. Income skill weights ≤ 4. (LIM-5)
25. Research skills: ≤ 2 in total, ≤ 1 Sage. (LIM-6)
26. ≤ 1 faction Oathsworn and ≤ 1 guild Oathsworn. (LIM-7)
27. ≤ 1 special creature lammie and ≤ 1 special power lammie. (PR-2)

### Derived values
28. LHV = base LHV + modifiers, capped at 2 × base. (6.1, 6.2)
29. AV per armour type + Armour Mastery, capped at 2 × base AV. MAV ≤ 4. NAV ≤ 4. (6.3)
30. Spell Power = base from CS + OS modifiers, capped at 2 × base. (6.4, A1)
31. Castable spells per list and level, allowing for specialisation replacement, summoning additions, High Magic and Source of Life/Unlife. (7)
32. Casting restrictions for the armour worn, allowing for Transcend Armour and Champion. (6.3, AR-5)
33. PR carried ≤ 12 + Bonus PR, counting active sigils and essence creature tier PR. (PR-1, PR-1a, PR-1b)

### Loresheets and special creatures
34. Every loresheet skill is on a loresheet the character holds. Its cost and tier come from that loresheet. (OS-6, 12.3, 12.4)
35. Essence creature skills: the creature's tier ≥ the skill's Min. type. (LS-5)
36. Loresheet purchases count toward the 4 per year and the T5 cap. (LS-1, LS-2)
37. Loresheet prerequisites are applied, and handbook use requirements are kept. (LS-3, L1)
38. Creature restrictions are applied to derived values and spell access. (12.2, 12.4)
    - **Unliving** (including Vampire): the listed living spells are removed from castable spells.
    - **Warlock:** no LHV from Body Development, +Base LHV, Toughen Body or Harden Body.
    - **Druid:** armour AV = the standard armour value only, with no Mage Armour.
    - **Paladin:** no Mage Armour. Spellcasting CS turns off DR Crush and DR All.
    - **Vampire:** needs the Unliving loresheet.
39. Essence tier bonuses are applied: Werecreature LHV and DR in beast form, Paladin AV, Druid Natural AV (still capped at 4), Warlock extra power, Vampire dismiss rank. (12.4)
40. Treewalker has both the handbook and loresheet restrictions. (L11)

### On CS change
41. Charge 5 OSP after creation. Remove any OS whose learn or use CS prerequisite is no longer met, with no refund. (CS-4, CS-5)
