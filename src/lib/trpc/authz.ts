import type { Role } from '@prisma/client'
import { TRPCError } from '@trpc/server'

export function requiresAdmin(ctx: { role: Role | null }) {
  if (ctx.role !== 'Admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'This requires admin access',
    })
  }
}
