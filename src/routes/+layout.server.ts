import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = ({ locals: { user } }) => ({
  user: user && { email: user.email, role: user.role },
})
