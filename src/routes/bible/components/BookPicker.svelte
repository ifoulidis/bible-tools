<script lang="ts">
  import { type ChapterRef, chapterCount, chapterHref } from '$lib/bible'
  import { type BookId, books } from '$lib/data/books'

  interface Props {
    /** The chapter being read, to mark in the lists */
    current?: ChapterRef
    /** Called when a chapter is chosen, as a dialog holding this closes then */
    onpick?: () => void
  }

  let { current, onpick }: Props = $props()

  /** The book whose chapters are showing, or none for the list of books */
  let book = $state<(typeof books)[number]>()

  const testaments = [
    { name: 'Old Testament', books: books.slice(0, 39) },
    { name: 'New Testament', books: books.slice(39) },
  ]

  const isCurrent = (id: BookId) => current?.book === id

  const chapters = (id: BookId) => Array.from({ length: chapterCount(id) }, (_, i) => i + 1)
</script>

{#if book}
  {@const shown = book}
  <div class="flex items-center gap-3">
    <button
      class="grid size-9 place-items-center rounded-full text-stone-600 hover:bg-stone-100 hover:text-stone-900"
      aria-label="All books"
      onclick={() => (book = undefined)}
    >
      <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6" />
      </svg>
    </button>
    <h2 class="text-2xl font-semibold">{shown.name}</h2>
  </div>
  <ol class="mt-4 grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] gap-1.5">
    {#each chapters(shown.id) as chapter (chapter)}
      {@const here = isCurrent(shown.id) && current?.chapter === chapter}
      <li>
        <a
          href={chapterHref(shown.id, chapter)}
          class={[
            'grid aspect-square place-items-center rounded-lg text-sm font-medium tabular-nums transition-colors',
            here
              ? 'bg-stone-900 text-stone-50'
              : 'bg-white text-stone-700 ring-1 ring-stone-200 hover:bg-primary-50 hover:ring-primary-300',
          ]}
          aria-current={here ? 'page' : undefined}
          onclick={onpick}>{chapter}</a
        >
      </li>
    {/each}
  </ol>
{:else}
  <div class="grid gap-8 sm:grid-cols-2">
    {#each testaments as testament (testament.name)}
      <section>
        <h2 class="eyebrow mb-2 font-sans">{testament.name}</h2>
        <ul class="grid grid-cols-2 gap-x-2">
          {#each testament.books as b (b.id)}
            {@const linkClass = [
              'block w-full rounded-md px-2.5 py-1.5 text-left text-[0.95rem] transition-colors',
              isCurrent(b.id)
                ? 'bg-primary-100 font-semibold text-stone-900'
                : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900',
            ]}
            <li>
              <!-- A book of one chapter goes straight to it -->
              {#if chapterCount(b.id) === 1}
                <a href={chapterHref(b.id, 1)} class={linkClass} onclick={onpick}>{b.name}</a>
              {:else}
                <button class={linkClass} onclick={() => (book = b)}>{b.name}</button>
              {/if}
            </li>
          {/each}
        </ul>
      </section>
    {/each}
  </div>
{/if}
