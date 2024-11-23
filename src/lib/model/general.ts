export const kingdoms = ['United', 'Israel', 'Judah'] as const
export type Kingdom = (typeof kingdoms)[number]
export const kingdomsOptions = kingdoms.map(value => ({ name: value, value }))
