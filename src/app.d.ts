import type { Role } from '@prisma/client'
import type { Session, SupabaseClient, User } from '@supabase/supabase-js'

// See https://kit.svelte.dev/docs/types#app for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      supabase: SupabaseClient
      safeGetSession: () => Promise<{ session: Session | null; user: User | null }>
      session: Session | null
      user: User | null
      role: Role | null
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {}
