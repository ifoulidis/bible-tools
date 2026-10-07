<script lang="ts">
  import SegmentedControl from '$lib/components/SegmentedControl.svelte'
  import ToggleChip from '$lib/components/ToggleChip.svelte'

  import type { KingdomFilter, RoleFilter, SortOrder } from '../search'

  let {
    role = $bindable(),
    kingdom = $bindable(),
    hasBook = $bindable(),
    sort = $bindable(),
  }: { role: RoleFilter; kingdom: KingdomFilter; hasBook: boolean; sort: SortOrder } = $props()

  const roleOptions: { value: RoleFilter; label: string }[] = [
    { value: 'everyone', label: 'Everyone' },
    { value: 'king', label: 'Kings' },
    { value: 'prophet', label: 'Prophets' },
  ]
  const kingdomOptions: { value: KingdomFilter; label: string }[] = [
    { value: 'any', label: 'Any' },
    { value: 'united', label: 'United' },
    { value: 'israel', label: 'Israel' },
    { value: 'judah', label: 'Judah' },
  ]
  const sortOptions: { value: SortOrder; label: string }[] = [
    { value: 'date', label: 'By date' },
    { value: 'name', label: 'A–Z' },
  ]
</script>

<div class="flex flex-wrap items-end gap-x-6 gap-y-4">
  <div class="grid gap-1.5">
    <span class="text-xs font-semibold tracking-wider text-stone-500 uppercase">Show</span>
    <SegmentedControl options={roleOptions} bind:value={role} label="Show" name="role" />
  </div>
  <div class="grid gap-1.5">
    <span class="text-xs font-semibold tracking-wider text-stone-500 uppercase">Kingdom</span>
    <SegmentedControl
      options={kingdomOptions}
      bind:value={kingdom}
      label="Kingdom"
      name="kingdom"
    />
  </div>
  <ToggleChip bind:checked={hasBook} label="Has a book" />
  <div class="grid gap-1.5 sm:ml-auto">
    <span class="text-xs font-semibold tracking-wider text-stone-500 uppercase">Sort</span>
    <SegmentedControl options={sortOptions} bind:value={sort} label="Sort" name="sort" />
  </div>
</div>
