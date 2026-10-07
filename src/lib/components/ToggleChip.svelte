<script lang="ts">
  let { checked = $bindable(), label }: { checked: boolean; label: string } = $props()
</script>

<!-- A checkbox drawn as a pill, matching SegmentedControl -->
<label
  class="flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium shadow-sm transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-stone-800 {checked
    ? 'border-stone-800 bg-stone-800 text-stone-50'
    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'}"
>
  <input class="pointer-events-none absolute opacity-0" type="checkbox" bind:checked />
  <!-- An empty box when off, a tick when on -->
  <span
    class="grid size-4 place-items-center rounded border {checked
      ? 'border-transparent'
      : 'border-stone-300 bg-white'}"
  >
    {#if checked}
      <svg
        class="size-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="3"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="m5 12 5 5 9-10" />
      </svg>
    {/if}
  </span>
  {label}
</label>
