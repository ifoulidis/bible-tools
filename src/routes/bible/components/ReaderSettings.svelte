<script lang="ts">
  import { settings, textSizes } from '$lib/bible/settings.svelte'
  import SegmentedControl from '$lib/components/SegmentedControl.svelte'
  import ToggleChip from '$lib/components/ToggleChip.svelte'

  let open = $state(false)
  let menu = $state<HTMLDivElement>()
</script>

<svelte:window
  onclick={event => {
    if (open && !menu?.contains(event.target as Node)) open = false
  }}
  onkeydown={event => {
    if (event.key === 'Escape') open = false
  }}
/>

<div class="relative" bind:this={menu}>
  <button
    class="grid size-9 place-items-center rounded-full font-reading text-lg text-stone-700 transition-colors hover:bg-stone-200/60 hover:text-stone-900 aria-expanded:bg-stone-200/70"
    aria-label="Reading settings"
    aria-expanded={open}
    onclick={() => (open = !open)}
  >
    <span aria-hidden="true">A<span class="text-sm">a</span></span>
  </button>

  {#if open}
    <div
      class="card absolute top-full right-0 z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] space-y-5 p-5"
    >
      <div>
        <h3 class="eyebrow mb-2.5">Text size</h3>
        <div class="flex items-center gap-3">
          <span class="font-reading text-sm text-stone-500" aria-hidden="true">A</span>
          <input
            class="slider flex-1"
            type="range"
            min="0"
            max={textSizes.length - 1}
            aria-label="Text size"
            bind:value={settings.size}
          />
          <span class="font-reading text-xl text-stone-500" aria-hidden="true">A</span>
        </div>
      </div>

      <div>
        <h3 class="eyebrow mb-2.5">Typeface</h3>
        <SegmentedControl
          label="Typeface"
          name="typeface"
          options={[
            { value: 'serif', label: 'Serif' },
            { value: 'sans', label: 'Sans' },
          ]}
          bind:value={settings.typeface}
        />
      </div>

      <div>
        <h3 class="eyebrow mb-2.5">Layout</h3>
        <SegmentedControl
          label="Layout"
          name="layout"
          options={[
            { value: 'paragraphs', label: 'Paragraphs' },
            { value: 'verses', label: 'Verse by verse' },
          ]}
          bind:value={settings.layout}
        />
      </div>

      <div>
        <h3 class="eyebrow mb-2.5">Show</h3>
        <div class="flex flex-wrap gap-2">
          <ToggleChip label="Headings" bind:checked={settings.headings} />
          <ToggleChip label="Footnotes" bind:checked={settings.notes} />
          <ToggleChip label="Verse numbers" bind:checked={settings.verseNumbers} />
        </div>
      </div>
    </div>
  {/if}
</div>
