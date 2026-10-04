<script lang="ts">
  import type { Kingdom, Person } from '$lib/data'

  let { person }: { person: Person } = $props()

  const kingdomClasses: Record<Kingdom, string> = {
    united: 'bg-united',
    israel: 'bg-israel',
    judah: 'bg-judah',
  }

  let badges = $derived(
    [
      person.reign && { label: 'King', color: kingdomClasses[person.reign.kingdom] },
      person.ministry && { label: 'Prophet', color: 'bg-prophets' },
      person.ministry?.hasBook && { label: 'Has a book', color: 'bg-gray-700' },
    ].filter(badge => !!badge),
  )
</script>

<header class="mt-4 mb-6">
  <h1 class="text-4xl font-bold">{person.name}</h1>
  {#if person.altNames.length > 0}
    <p class="text-gray-500">Also called {person.altNames.join(', ')}</p>
  {/if}
  <div class="mt-2 flex gap-2">
    {#each badges as { label, color } (label)}
      <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white {color}"
        >{label}</span
      >
    {/each}
  </div>
  <p class="mt-3 text-lg">{person.summary}</p>
</header>
