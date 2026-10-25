<script lang="ts">
  import { afterNavigate } from '$app/navigation'
  import { type ChapterRef, chapterHref, chapterTitle } from '$lib/bible'

  import BookPicker from './BookPicker.svelte'
  import ReaderSettings from './ReaderSettings.svelte'

  interface Props {
    current: ChapterRef
    previous?: ChapterRef
    next?: ChapterRef
  }

  let { current, previous, next }: Props = $props()

  let dialog = $state<HTMLDialogElement>()
  /** Counts openings, so the picker starts again from the list of books each time */
  let opened = $state(0)

  function openPicker() {
    opened++
    dialog?.showModal()
  }

  afterNavigate(() => dialog?.close())

  const arrowClass =
    'grid size-9 place-items-center rounded-full text-stone-600 transition-colors hover:bg-stone-200/60 hover:text-stone-900'
</script>

{#snippet arrow(ref: ChapterRef | undefined, direction: 'previous' | 'next')}
  {#if ref}
    <a
      href={chapterHref(ref.book, ref.chapter)}
      class={arrowClass}
      aria-label="{direction === 'previous' ? 'Previous' : 'Next'} chapter, {chapterTitle(ref)}"
    >
      <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d={direction === 'previous' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
        />
      </svg>
    </a>
  {:else}
    <span class="size-9"></span>
  {/if}
{/snippet}

<!-- Sticks over the site's header once the page scrolls, so it's always to hand. Solid, as the
     header is under it then -->
<div class="sticky top-0 z-40 border-b border-stone-200/70 bg-parchment">
  <div class="mx-auto flex max-w-2xl items-center justify-between gap-2 px-4 py-2">
    <div class="flex items-center gap-1">
      {@render arrow(previous, 'previous')}
      <button
        class="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-display text-lg font-semibold text-stone-900 transition-colors hover:bg-stone-200/60"
        aria-haspopup="dialog"
        onclick={openPicker}
      >
        {chapterTitle(current)}
        <svg
          class="size-4 text-stone-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {@render arrow(next, 'next')}
    </div>
    <ReaderSettings />
  </div>
</div>

<!-- Escape already closes a dialog; this closes it on a click on the backdrop too -->
<dialog
  bind:this={dialog}
  class="m-auto max-h-[85vh] w-[min(44rem,calc(100%-2rem))] rounded-2xl border border-stone-200 bg-parchment p-0 shadow-2xl backdrop:bg-stone-900/30 backdrop:backdrop-blur-sm"
  aria-label="Choose a book and chapter"
  onclick={event => {
    if (event.target === dialog) dialog.close()
  }}
>
  <div class="p-5 sm:p-6">
    {#key opened}
      <BookPicker {current} onpick={() => dialog?.close()} />
    {/key}
  </div>
</dialog>
