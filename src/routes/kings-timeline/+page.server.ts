import { createContext } from '$lib/trpc/context'
import { createCaller } from '$lib/trpc/router'

import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async event => ({
  kings: await createCaller(await createContext(event)).listKings(),
})
