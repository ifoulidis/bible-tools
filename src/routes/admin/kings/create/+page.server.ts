import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'

import { characterLoaded, charactersSchema } from '$lib/model/schemas'
import prisma from '$lib/prisma.server'
import { createContext } from '$lib/trpc/context'
import { createCaller } from '$lib/trpc/router'

import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async event => {
  // One way to retrieve the data (via tRPC)
  // See the listKings query for how to call prisma directly
  const rows = await createCaller(await createContext(event)).listKings()
  const kings = rows.map(row => characterLoaded.parse(row))
  const form = await superValidate(zod(charactersSchema))
  return {
    form,
    kings,
  }
}

export const actions: Actions = {
  upsertKing: async event => {
    const { request } = event

    const form = await superValidate(request, zod(charactersSchema))
    console.log('Form is here', form.data)

    if (!form.valid) return { form }

    console.log('Form is valid', form, form.data)

    if (form.id) {
      let updatedData = { updatedAt: new Date(), ...form.data }
      const { id, ...data } = updatedData
      // Using Prisma directly, instead of tRPC
      await prisma.character.update({ where: { id }, data })
    } else {
      await prisma.character.create({ data: form.data })
    }
    return {
      form,
    }
  },
}
