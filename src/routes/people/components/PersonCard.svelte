<script lang="ts">
  import { formatSpan } from '$lib/timeline/layout'

  import type { PersonEntry } from '../search'

  let { person }: { person: PersonEntry } = $props()

  const kingdomNames = { united: 'United kingdom', israel: 'Israel', judah: 'Judah' }
  // Full class names so Tailwind can see them
  const kingdomBadges = { united: 'bg-united', israel: 'bg-israel', judah: 'bg-judah' }

  let badge = $derived(
    person.role === 'king'
      ? {
          label: `King · ${kingdomNames[person.kingdoms[0]]}`,
          color: kingdomBadges[person.kingdoms[0]],
        }
      : { label: 'Prophet', color: 'bg-prophets' },
  )
</script>

<a
  href="/people/{person.id}"
  class="card group flex h-full flex-col gap-2 p-5 transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-800"
>
  <div class="flex items-start justify-between gap-3">
    <h2
      class="text-xl font-semibold group-hover:underline group-hover:decoration-primary-400 group-hover:decoration-2 group-hover:underline-offset-4"
    >
      {person.name}
    </h2>
    <span class="shrink-0 pt-1 text-sm text-stone-500 tabular-nums">{formatSpan(person)}</span>
  </div>
  {#if person.altNames.length > 0}
    <p class="-mt-1 text-sm text-stone-500 italic">Also {person.altNames.join(', ')}</p>
  {/if}
  <p class="line-clamp-2 text-stone-600">{person.summary}</p>
  <div class="mt-auto flex flex-wrap gap-1.5 pt-2">
    <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white {badge.color}"
      >{badge.label}</span
    >
    {#if person.hasBook}
      <span class="rounded-full bg-stone-700 px-2.5 py-0.5 text-xs font-semibold text-white"
        >Has a book</span
      >
    {/if}
  </div>
</a>
