import prisma from '$lib/prisma.server'
import { CharacterCreateInputSchema, CharacterSchema } from '$zod'

import { requiresAdmin } from '../authz'
import { procedure } from '../context'

export const listKings = procedure.query(async opts => {
  requiresAdmin(opts.ctx)

  return await prisma.character.findMany({ orderBy: { startOfReign: 'desc' } })
})

export const createKing = procedure.input(CharacterCreateInputSchema).query(async opts => {
  console.log('Going to create king with input data', opts.input)
  const king = await prisma.character.create({ data: opts.input })

  console.log('Created king')

  return king
})

export const updateKing = procedure.input(CharacterSchema).query(async opts => {
  console.log('Going to create king with input data', opts.input)
  const { id, ...data } = opts.input
  const king = await prisma.character.update({ data, where: { id } })

  console.log('Updated king')

  return king
})
