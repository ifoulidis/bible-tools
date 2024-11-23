import { z } from 'zod'

import { kingdoms } from '$lib/model/general'

export const charactersSchema = z.object({
  id: z.number().optional(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().nullable().optional(),
  name: z.string(),
  lengthOfReign: z.string(),
  startOfReign: z.number().int(),
  endOfReign: z.number().int(),
  kingdom: z.enum(kingdoms),
  relationToPredecessor: z.string().nullable().optional(),
})

export const characterLoaded = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date().nullable().optional(),
  name: z.string(),
  lengthOfReign: z.string(),
  startOfReign: z.number().int(),
  endOfReign: z.number().int(),
  kingdom: z.enum(kingdoms),
  relationToPredecessor: z.string().nullable().optional(),
})
