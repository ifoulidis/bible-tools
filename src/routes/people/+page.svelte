<script lang="ts">
  import { page } from '$app/stores'
  import { untrack } from 'svelte'

  import { replaceState } from '$app/navigation'
  import SearchInput from '$lib/components/SearchInput.svelte'
  import { Debounced } from '$lib/utility/debounced.svelte'

  import PeopleFilters from './components/PeopleFilters.svelte'
  import PersonCard from './components/PersonCard.svelte'
  import {
    type KingdomFilter,
    type RoleFilter,
    type SortOrder,
    defaultFilters,
    filterPeople,
  } from './search'

  let { data } = $props()

  // Filters start from the URL, so a filtered list can be shared or bookmarked
  const params = $page.url.searchParams
  const pick = <T extends string>(key: string, allowed: readonly T[], fallback: T) => {
    const value = params.get(key)
    return allowed.find(option => option === value) ?? fallback
  }

  let query = $state(params.get('q') ?? '')
  let role = $state(pick<RoleFilter>('role', ['everyone', 'king', 'prophet'], defaultFilters.role))
  let kingdom = $state(
    pick<KingdomFilter>('kingdom', ['any', 'united', 'israel', 'judah'], defaultFilters.kingdom),
  )
  let hasBook = $state(params.get('book') === '1')
  let sort = $state(pick<SortOrder>('sort', ['date', 'name'], defaultFilters.sort))

  // Typing waits a second before the results change; Enter or clearing skips the wait
  const search = new Debounced(() => query, 1000)

  let results = $derived(
    filterPeople(data.entries, { query: search.current, role, kingdom, hasBook, sort }),
  )
  let filtered = $derived(
    search.current !== '' || role !== 'everyone' || kingdom !== 'any' || hasBook,
  )

  // Keeps the URL in step with the filters. Compared against `location` rather than `$page.url`,
  // which doesn't always follow `replaceState`, and reading it here would loop
  $effect(() => {
    const next = new URLSearchParams()
    const set = (key: string, value: string, fallback: string) => {
      if (value !== fallback) next.set(key, value)
    }
    set('q', search.current.trim(), '')
    set('role', role, defaultFilters.role)
    set('kingdom', kingdom, defaultFilters.kingdom)
    set('book', hasBook ? '1' : '', '')
    set('sort', sort, defaultFilters.sort)
    const query = next.size > 0 ? `?${next.toString()}` : ''
    if (query !== location.search) {
      replaceState(
        location.pathname + query,
        untrack(() => $page.state),
      )
    }
  })

  function clearAll() {
    query = ''
    search.flush()
    role = defaultFilters.role
    kingdom = defaultFilters.kingdom
    hasBook = false
  }
</script>

<svelte:head>
  <title>People</title>
</svelte:head>

<div class="mx-auto my-10 max-w-300 px-4">
  <p class="eyebrow">People</p>
  <h1 class="mt-2 text-4xl font-semibold md:text-5xl">Kings and prophets</h1>
  <p class="mt-3 mb-6 max-w-[60ch] text-stone-600">
    Search everyone on the timeline by name, by another name they went by, or by what they're known
    for.
  </p>

  <div class="grid gap-5">
    <SearchInput
      bind:value={query}
      label="Search people"
      placeholder="Name, or what they did"
      pending={search.pending}
      onsubmit={() => search.flush()}
    />
    <PeopleFilters bind:role bind:kingdom bind:hasBook bind:sort />
  </div>

  <div class="mt-8 mb-4 flex min-h-8 items-center justify-between gap-4">
    <p class="text-sm text-stone-500" aria-live="polite">
      {results.length}
      {results.length === 1 ? 'person' : 'people'}
    </p>
    {#if filtered}
      <button
        class="text-sm font-medium text-stone-600 underline decoration-stone-300 underline-offset-4 hover:text-stone-900"
        onclick={clearAll}>Clear search and filters</button
      >
    {/if}
  </div>

  {#if results.length > 0}
    <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each results as person (person.id)}
        <li><PersonCard {person} /></li>
      {/each}
    </ul>
  {:else}
    <div class="card grid justify-items-center gap-3 px-6 py-12 text-center">
      <p class="font-display text-2xl font-semibold text-stone-900">No one matches</p>
      <p class="text-stone-600">Try a different spelling, or loosen the filters.</p>
      <button class="btn btn-secondary mt-2" onclick={clearAll}>Clear search and filters</button>
    </div>
  {/if}
</div>
