import { z } from 'zod'

import { bookIds } from './books'

export const personIdSchema = z.string().regex(/^[a-z0-9-]+$/, 'ids are lowercase kebab-case slugs')

/** Years BC as positive integers, so larger numbers are earlier */
const yearBC = z.number().int().positive()

export const spanSchema = z
  .object({ from: yearBC, to: yearBC, approx: z.boolean() })
  .refine(
    span => span.from >= span.to,
    'span must start before (i.e. at a larger BC year than) it ends',
  )

const verseRefSchema = z.object({
  chapter: z.number().int().positive(),
  verse: z.number().int().positive().optional(),
})

export const passageKinds = [
  'book',
  'narrative',
  'regnal-formula',
  'superscription',
  'genealogy',
  'mention',
  'nt-reference',
] as const

export const passageSchema = z
  .object({
    book: z.enum(bookIds),
    from: verseRefSchema,
    to: verseRefSchema.optional(),
    kind: z.enum(passageKinds),
    note: z.string().optional(),
  })
  .refine(
    ({ from, to }) =>
      !to ||
      to.chapter > from.chapter ||
      (to.chapter === from.chapter && (to.verse ?? Infinity) > (from.verse ?? 0)),
    'passage must end after it starts',
  )

/** Why a person is dated where they are */
export const evidenceSchema = z.discriminatedUnion('kind', [
  // "In the 38th year of Asa king of Judah, Ahab began to reign" (1 Kgs 16:29)
  z.object({ kind: z.literal('synchronism'), passage: passageSchema, note: z.string() }),
  z.object({ kind: z.literal('regnal-length'), passage: passageSchema, note: z.string() }),
  // "in the days of Uzziah, Jotham, Ahaz, and Hezekiah" (Hos 1:1)
  z.object({
    kind: z.literal('superscription'),
    passage: passageSchema,
    contemporaries: z.array(personIdSchema).min(1),
  }),
  // A prophet and king meet in the narrative (Elijah and Ahab, 1 Kgs 18)
  z.object({
    kind: z.literal('narrative-contact'),
    passage: passageSchema,
    contemporaries: z.array(personIdSchema).min(1),
  }),
  // "In the second year of Darius the king, in the sixth month" (Hag 1:1)
  z.object({ kind: z.literal('internal-date'), passage: passageSchema, note: z.string() }),
  z.object({ kind: z.literal('extrabiblical'), artifact: z.string(), note: z.string() }),
  z.object({ kind: z.literal('inference'), note: z.string() }),
])

export const citationSchema = z.object({
  sourceId: z.string(),
  pages: z.string().optional(),
})

export const confidences = ['firm', 'probable', 'disputed'] as const

export const datingSchema = z
  .object({
    span: spanSchema,
    /** Start of a coregency with the predecessor, before the sole reign begins at `span.from` */
    coregencyFrom: yearBC.optional(),
    confidence: z.enum(confidences),
    evidence: z.array(evidenceSchema).min(1),
    citations: z.array(citationSchema).min(1),
    notes: z.string().optional(),
  })
  .refine(
    dating => dating.coregencyFrom === undefined || dating.coregencyFrom > dating.span.from,
    'coregency must begin before the sole reign',
  )

export const alternativeDatingSchema = z.object({
  label: z.string(),
  dating: datingSchema,
})

export const kingdoms = ['united', 'israel', 'judah'] as const

export const reignSchema = z.object({
  kingdom: z.enum(kingdoms),
  dating: datingSchema,
  alternatives: z.array(alternativeDatingSchema),
  predecessor: personIdSchema.optional(),
  successor: personIdSchema.optional(),
  relationToPredecessor: z.string().optional(),
})

export const audiences = ['united', 'israel', 'judah', 'nations', 'exiles', 'returnees'] as const

export const ministrySchema = z.object({
  audience: z.array(z.enum(audiences)).min(1),
  hasBook: z.boolean(),
  dating: datingSchema,
  alternatives: z.array(alternativeDatingSchema),
})

export const familyRelations = ['father', 'mother', 'son', 'daughter', 'spouse'] as const

export const personSchema = z
  .object({
    id: personIdSchema,
    name: z.string().min(1),
    altNames: z.array(z.string()),
    summary: z.string().min(1),
    reign: reignSchema.optional(),
    ministry: ministrySchema.optional(),
    family: z.array(
      z.object({
        relation: z.enum(familyRelations),
        personId: personIdSchema.optional(),
        name: z.string(),
      }),
    ),
    passages: z.array(passageSchema).min(1),
  })
  .refine(person => person.reign ?? person.ministry, 'a person must be a king, a prophet, or both')

export const sourceSchema = z.object({
  id: z.string(),
  author: z.string(),
  title: z.string(),
  year: z.number().int(),
  kind: z.enum(['book', 'article', 'web']),
  publisher: z.string().optional(),
  url: z.url().optional(),
})

export type Span = z.infer<typeof spanSchema>
export type Passage = z.infer<typeof passageSchema>
export type Evidence = z.infer<typeof evidenceSchema>
export type Dating = z.infer<typeof datingSchema>
export type AlternativeDating = z.infer<typeof alternativeDatingSchema>
export type Kingdom = (typeof kingdoms)[number]
export type Audience = (typeof audiences)[number]
export type Reign = z.infer<typeof reignSchema>
export type Ministry = z.infer<typeof ministrySchema>
export type Person = z.infer<typeof personSchema>
export type Source = z.infer<typeof sourceSchema>
