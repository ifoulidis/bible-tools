<script lang="ts">
  import '../app.css'
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte'

  let { data, children } = $props()
</script>

<header>
  <Navbar class="w-full border-b px-2 py-2.5 sm:px-4">
    <NavBrand href="/">
      <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
        >Bible Tools</span
      >
    </NavBrand>
    <NavHamburger />
    <NavUl>
      <NavLi href="/">Home</NavLi>
      <NavLi href="/timeline">Timeline</NavLi>
      {#if data.user}
        <li>
          <form method="POST" action="/logout">
            <button class="py-2 md:p-0" title={data.user.email}>Log out</button>
          </form>
        </li>
      {:else}
        <NavLi href="/auth">Log in</NavLi>
      {/if}
    </NavUl>
  </Navbar>
</header>

<main>
  {@render children?.()}
</main>
