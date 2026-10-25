<script lang="ts">
  import Popover from '$lib/components/Popover.svelte'

  import Inlines from './Inlines.svelte'
  import { getPassage, noteLabel, pressed } from './passage'

  let { index }: { index: number } = $props()

  const passage = getPassage()
  let note = $derived(passage.notes[index])
  let label = $derived(noteLabel(index))

  let button = $state<HTMLSpanElement>()
  let open = $state(false)

  function closeOutside(event: MouseEvent) {
    if (!open) return
    const target = event.target as Element
    if (!button?.contains(target) && !target.closest?.('[data-footnote]')) open = false
  }
</script>

<svelte:window
  onclick={closeOutside}
  onkeydown={event => {
    if (event.key === 'Escape') open = false
  }}
/>

<span
  bind:this={button}
  class="footnote-call"
  role="button"
  tabindex="0"
  aria-expanded={open}
  aria-label="Footnote {label}"
  onclick={() => (open = !open)}
  onkeydown={pressed(() => (open = !open))}>{label}</span
><Popover anchor={button} {open} interactive>
  <div
    data-footnote
    class="card max-w-72 p-3 font-sans text-sm leading-relaxed font-normal text-stone-700 not-italic"
  >
    <span class="mr-1 font-semibold text-primary-700">{passage.chapter}:{note.verse || 1}</span>
    <Inlines content={note.content} />
  </div>
</Popover>
