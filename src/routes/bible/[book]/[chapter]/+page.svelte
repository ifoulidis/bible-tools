<script lang="ts">
  import { goto } from '$app/navigation'
  import { bookName, chapterHref, chapterTitle, lastReadKey } from '$lib/bible'

  import Passage from '../../components/Passage.svelte'
  import ReaderToolbar from '../../components/ReaderToolbar.svelte'

  let { data } = $props()

  let current = $derived({ book: data.book, chapter: data.chapter })
  let title = $derived(chapterTitle(current))

  // Remembered so /bible can offer to carry on from here
  $effect(() => {
    try {
      localStorage.setItem(lastReadKey, JSON.stringify(current))
    } catch {
      // Storage can be blocked; there's just nothing to carry on from then
    }
  })

  /** The arrow keys turn the page, as in an e-reader */
  function turnPage(event: KeyboardEvent) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
    const typing = (event.target as Element).closest('input, textarea, select, [contenteditable]')
    if (typing || document.querySelector('dialog[open]')) return
    const to = event.key === 'ArrowLeft' ? data.previous : event.key === 'ArrowRight' && data.next
    if (to) goto(chapterHref(to.book, to.chapter))
  }
</script>

<svelte:window onkeydown={turnPage} />

<svelte:head>
  <title>{title} (BSB)</title>
</svelte:head>

<ReaderToolbar {current} previous={data.previous} next={data.next} />

<article class="mx-auto max-w-2xl px-5 pt-10 pb-8 sm:px-4 sm:pt-14">
  <header class="mb-8 text-center">
    <p class="eyebrow">{bookName(data.book)}</p>
    <h1 class="mt-1 text-6xl font-semibold text-stone-900 sm:text-7xl">{data.chapter}</h1>
  </header>

  <!-- Started afresh for each chapter, so a selection or open footnote doesn't carry over -->
  {#key title}
    <Passage book={data.book} chapter={data.chapter} content={data.content} />
  {/key}

  <nav class="mt-14 grid grid-cols-2 gap-3" aria-label="Chapters">
    {#if data.previous}
      <a
        href={chapterHref(data.previous.book, data.previous.chapter)}
        class="card group px-4 py-3 transition hover:-translate-y-px hover:shadow-md"
      >
        <span class="text-xs text-stone-500">Previous</span>
        <span class="block font-display font-semibold text-stone-900"
          >‹ {chapterTitle(data.previous)}</span
        >
      </a>
    {:else}
      <span></span>
    {/if}
    {#if data.next}
      <a
        href={chapterHref(data.next.book, data.next.chapter)}
        class="card group px-4 py-3 text-right transition hover:-translate-y-px hover:shadow-md"
      >
        <span class="text-xs text-stone-500">Next</span>
        <span class="block font-display font-semibold text-stone-900"
          >{chapterTitle(data.next)} ›</span
        >
      </a>
    {/if}
  </nav>

  <p class="mt-10 text-center text-xs text-stone-400">
    The Holy Bible, <a href="https://berean.bible" class="underline underline-offset-2"
      >Berean Standard Bible</a
    >, BSB. Dedicated to the public domain.
  </p>
</article>
