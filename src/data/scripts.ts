// Translate Named Script families (reference doc, HB p.97). Script Master <family> replaces the TNS skills in its family.
// Restricted scripts (Ancestor, Daemon, Elemental and Grave Runes, Spiral) belong to no family.

export const scriptFamilies: Record<string, string[]> = {
  'Regional & Historical': ['Southern', 'Aegyptus', 'Arabia', 'Cathay', 'Maurabian', 'Nihon', 'Old Empire', 'Peng', 'Picta', 'Siberija'],
  'People & Race': ['Beastkin', 'Dwarf', 'Elven', 'Fey', 'Lizardman', 'Merrow', 'Olog', 'Skathen', 'Uruck', 'Halfling'],
  'Myth & Magic': ['Ancient', 'Arataic', 'Cecealia', 'Chaos and Magic', 'Daemon', 'Illithid', 'Moonlore', 'Old Ilithid', 'Void Entity', 'Void Wretch'],
}

export const scriptFamilyOf = (script: string | undefined) =>
  Object.keys(scriptFamilies).find((f) => scriptFamilies[f]!.includes(script ?? ''))
