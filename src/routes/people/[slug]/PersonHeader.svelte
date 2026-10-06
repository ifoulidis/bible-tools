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
      person.ministry?.hasBook && { label: 'Has a book', color: 'bg-stone-700' },
    ].filter(badge => !!badge),
  )
</script>

<header class="mt-6 mb-8">
  <h1 class="text-5xl font-semibold">{person.name}</h1>
  {#if person.altNames.length > 0}
    <p class="mt-1 text-stone-500 italic">Also called {person.altNames.join(', ')}</p>
  {/if}
  <div class="mt-4 flex gap-2">
    {#each badges as { label, color } (label)}
      <span
        class="rounded-full px-3 py-1 text-xs font-semibold tracking-wide text-white shadow-sm {color}"
        >{label}</span
      >
    {/each}
  </div>
  <p class="mt-5 text-lg leading-relaxed text-stone-700">{person.summary}</p>
</header>
