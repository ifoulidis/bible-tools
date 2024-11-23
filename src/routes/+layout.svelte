<script lang="ts">
  import '../app.css'
  import { goto, invalidate } from '$app/navigation'
  import { onMount } from 'svelte'
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte'
  import { HammerSolid } from 'flowbite-svelte-icons'

  let { data, children } = $props()
  let { user, session, supabase } = $derived(data)

  let logout = $derived(async () => {
    console.log('Going to log out')
    const { error } = await supabase.auth.signOut()
    goto('/auth')
    if (error) {
      console.error(error)
    }
  })

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth')
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>

{#if user}
  <header>
    <Navbar class="fixed start-0 top-0 z-20 w-full border-b px-2 py-2.5 sm:px-4">
      <NavBrand href="/">
        <HammerSolid />
        <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
          >Tools for the Bible</span
        >
      </NavBrand>
      <NavHamburger />
      <NavUl>
        <NavLi href="/">Home</NavLi>
        <NavLi href="/kings-timeline">Timeline</NavLi>
        <NavLi href="/admin/kings/create">Admin</NavLi>
      </NavUl>
    </Navbar>

    <button onclick={logout}>Logout</button>
  </header>
{/if}

<main>
  {@render children?.()}
</main>

<style>
  header {
    padding: 2rem;
    display: flex;
    justify-content: space-between;
  }
</style>
