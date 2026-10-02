import { redirect } from '@sveltejs/kit'

import { endSession } from '$lib/server/session'

import type { Actions, PageServerLoad } from './$types'

// Logging out changes state, so it's a POST action only; visiting the page just goes home
export const load: PageServerLoad = () => redirect(303, '/')

export const actions: Actions = {
  default: async ({ cookies }) => {
    await endSession(cookies)
    redirect(303, '/')
  },
}
