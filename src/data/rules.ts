// Fixed rule constants. Rulings are recorded in docs/LT-Build-Rules-Reference.md section 13.

export const RULES = {
  characterPoints: 16,               // CS-1
  maxLevel2MagicCs: 1,               // CS-6
  purchasesPerYear: 4,               // OS-1
  cardLimit: 12,                     // LIM-1
  tier5Cap: 4,                       // LIM-2
  paragonCap: 1,                     // LIM-3
  incomeWeights: { apprentice: 1, journeyman: 2, master: 4 } as Record<string, number>,
  incomeWeightCap: 4,                // LIM-5
  researchCap: 2,                    // LIM-6
  sageCap: 1,                        // LIM-6
  oathswornFactionCap: 1,            // LIM-7
  oathswornGuildCap: 1,              // LIM-7
  retirementDoubleSteps: 2,          // RET-3 (on different trees, RET-3a)
  powerRatingLimit: 12,              // PR-1
  baseLhvCap: 4,                     // +1 Base LHV
  architectMaxTier: 4,               // Architect ruling
  csSpellPower: { 1: 4, 2: 12 } as Record<number, number>,
  basePowerPerLevel: 4,
  childPoints: { under5: 0, age5to9: 10, age10to15: 16 },
} as const
