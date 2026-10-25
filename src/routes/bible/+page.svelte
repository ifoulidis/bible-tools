<script lang="ts">
  import { onMount } from 'svelte'

  import { type ChapterRef, chapterCount, chapterHref, chapterTitle, lastReadKey } from '$lib/bible'
  import { books } from '$lib/data/books'

  import BookPicker from './components/BookPicker.svelte'

  let lastRead = $state<ChapterRef>()

  onMount(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(lastReadKey) ?? 'null') as ChapterRef | null
      // Checked against the books, in case what was saved is out of date
      const valid =
        saved &&
        books.some(book => book.id === saved.book) &&
        saved.chapter >= 1 &&
        saved.chapter <= chapterCount(saved.book)
      if (valid) lastRead = saved
    } catch {
      // Nothing saved, or storage is blocked
    }
  })
</script>

<svelte:head>
  <title>Read the Bible (BSB)</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 pt-12 pb-8 md:pt-16">
  <p class="eyebrow">Berean Standard Bible</p>
  <h1 class="mt-2 text-4xl font-semibold md:text-5xl">Read the Bible</h1>
  <p class="mt-3 max-w-xl text-stone-600">
    A modern translation from the Hebrew, Aramaic and Greek, with its headings, footnotes and
    cross-references. Tap a verse number to select a verse and copy it.
  </p>

  {#if lastRead}
    <a
      href={chapterHref(lastRead.book, lastRead.chapter)}
      class="card mt-8 flex items-center justify-between gap-4 px-5 py-4 transition hover:-translate-y-px hover:shadow-md"
    >
      <span>
        <span class="block text-sm text-stone-500">Carry on reading</span>
        <span class="font-display text-xl font-semibold text-stone-900"
          >{chapterTitle(lastRead)}</span
        >
      </span>
      <svg
        class="size-5 text-stone-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6" />
      </svg>
    </a>
  {/if}

  <div class="card mt-8 p-5 sm:p-6">
    <BookPicker current={lastRead} />
  </div>
</div>
