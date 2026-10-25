<script lang="ts">
  import { onMount } from 'svelte'
  import { SvelteSet } from 'svelte/reactivity'

  import {
    type Block,
    type Chapter,
    chapterHref,
    chapterTitle,
    formatVerses,
    isText,
    plainText,
    segmentBlocks,
    versesByLine,
  } from '$lib/bible'
  import { settings, textSizes } from '$lib/bible/settings.svelte'
  import { showToast } from '$lib/components/toast/toast.svelte'
  import type { BookId } from '$lib/data/books'

  import Inlines from './Inlines.svelte'
  import { noteLabel, setPassage } from './passage'

  let { book, chapter, content }: { book: BookId; chapter: number; content: Chapter } = $props()

  const selected = new SvelteSet<number>()
  /** The verse a link pointed at, such as #v16 */
  let target = $state<number>()

  function toggle(verse: number) {
    if (selected.has(verse)) selected.delete(verse)
    else selected.add(verse)
  }

  setPassage({
    get chapter() {
      return chapter
    },
    get notes() {
      return content.notes
    },
    isSelected: verse => selected.has(verse),
    toggleVerse: toggle,
  })

  let blocks = $derived(segmentBlocks(content.blocks))
  let rows = $derived(versesByLine(content.blocks))

  const blockClass: Record<Block['kind'], string> = {
    p: 'mt-[0.8em]',
    line1: 'pl-[2em] -indent-[1.25em]',
    line2: 'pl-[3.25em] -indent-[1.25em]',
    lineRight: 'pr-[1em] text-right italic',
    item1: 'mt-[0.2em] pl-[2em] -indent-[1.25em]',
    item2: 'pl-[3.25em] -indent-[1.25em]',
    heading:
      'mt-[1.9em] mb-[0.15em] font-display text-[1.05em] leading-snug font-semibold text-stone-900',
    parallel: 'mb-[0.3em] font-sans text-[0.72em] text-stone-500 italic',
    psalmTitle: 'mt-[0.8em] text-[0.92em] text-stone-600 italic',
    acrostic:
      'mt-[1.6em] font-sans text-[0.68em] font-semibold tracking-[0.2em] text-rubric uppercase',
    scope:
      'mt-[1.5em] text-center font-sans text-[0.68em] font-semibold tracking-[0.2em] text-primary-700 uppercase',
  }

  /** Headings the reader can hide; a psalm's title is part of the text, so it stays */
  const optional = new Set<Block['kind']>(['heading', 'parallel', 'acrostic', 'scope'])
  const shown = (block: Block) => settings.headings || !optional.has(block.kind)

  const verseClass = (verse: number) => [
    'rounded-sm box-decoration-clone transition-colors duration-300',
    selected.has(verse)
      ? 'bg-primary-200/70'
      : target === verse && 'bg-amber-100 ring-2 ring-amber-100',
  ]

  let text = $state<HTMLDivElement>()

  /**
   * Tapping a verse's words picks it out too, unless that's a link, a button or a text selection.
   * A shortcut for the mouse and touch: the verse number is the button for keyboards and readers
   */
  $effect(() => {
    if (!text) return
    const select = (event: MouseEvent) => {
      const target = event.target as Element
      if (target.closest('a, button, [role=button]') || window.getSelection()?.toString()) return
      const verse = Number(target.closest<HTMLElement>('[data-verse]')?.dataset.verse)
      if (verse) toggle(verse)
    }
    text.addEventListener('click', select)
    return () => text?.removeEventListener('click', select)
  })

  let selection = $derived([...selected].sort((a, b) => a - b))
  let reference = $derived(`${chapterTitle({ book, chapter })}:${formatVerses(selection)}`)

  async function copy(text: string, done: string) {
    try {
      await navigator.clipboard.writeText(text)
      showToast(done, 'success')
    } catch {
      showToast("Couldn't copy", 'error')
    }
  }

  function copyText() {
    const text = rows
      .filter(row => row.kind === 'verse' && selected.has(row.verse))
      .map(row => plainText(row.content).trim())
      .join(' ')
    copy(`${text}\n${reference} BSB`, `Copied ${reference}`)
  }

  function copyLink() {
    copy(`${location.origin}${chapterHref(book, chapter, selection[0])}`, 'Copied link')
  }

  function readTarget() {
    target = Number(location.hash.match(/^#v(\d+)$/)?.[1]) || undefined
  }
  onMount(readTarget)
</script>

<svelte:window
  onhashchange={readTarget}
  onkeydown={event => {
    if (event.key === 'Escape') selected.clear()
  }}
/>

<div
  bind:this={text}
  class={[
    'leading-[1.8] text-stone-800 [&>:first-child]:mt-0',
    settings.typeface === 'serif' ? 'font-reading' : 'font-sans',
  ]}
  style:font-size="{textSizes[settings.size]}px"
>
  {#if settings.layout === 'paragraphs'}
    {#each blocks as block, i (i)}
      {#if isText(block)}
        <div class={[blockClass[block.kind], block.stanza && 'mt-[0.8em]']}>
          {#each block.segments as segment, j (j)}<span
              class={verseClass(segment.verse)}
              data-verse={segment.verse}><Inlines content={segment.content} /></span
            >{/each}
        </div>
      {:else if shown(block)}
        <div class={blockClass[block.kind]}><Inlines content={block.content} /></div>
      {/if}
    {/each}
  {:else}
    {#each rows as row, i (i)}
      {#if row.kind === 'verse'}
        <div class="mt-[0.45em] flex gap-[0.5em]" data-verse={row.verse}>
          {#if settings.verseNumbers}
            <button
              id="v{row.verse}"
              class="verse-number w-[2.4em] shrink-0 self-start text-right leading-[3]"
              aria-pressed={selected.has(row.verse)}
              aria-label="Verse {row.verse}"
              onclick={() => toggle(row.verse)}>{row.verse}</button
            >
          {:else}
            <span id="v{row.verse}" class="scroll-mt-24"></span>
          {/if}
          <span class="min-w-0"
            ><span class={verseClass(row.verse)}><Inlines content={row.content} /></span></span
          >
        </div>
      {:else if shown(row)}
        <div class={blockClass[row.kind]}><Inlines content={row.content} /></div>
      {/if}
    {/each}
  {/if}
</div>

{#if settings.notes && content.notes.length > 0}
  <section class="mt-14 border-t border-stone-200/80 pt-6 font-sans text-sm text-stone-600">
    <h2 class="eyebrow mb-3 font-sans tracking-[0.2em]">Footnotes</h2>
    <ol class="space-y-1.5">
      {#each content.notes as note, i (i)}
        <li class="flex gap-2 leading-relaxed">
          <span class="w-12 shrink-0">
            <span class="font-semibold text-primary-700">{noteLabel(i)}</span>
            <a href="#v{note.verse || 1}" class="text-stone-400 hover:text-stone-700"
              >{chapter}:{note.verse || 1}</a
            >
          </span>
          <span><Inlines content={note.content} /></span>
        </li>
      {/each}
    </ol>
  </section>
{/if}

{#if selection.length > 0}
  <div
    class="fixed inset-x-0 bottom-5 z-40 flex justify-center px-4"
    role="toolbar"
    aria-label="Selected verses"
  >
    <div
      class="flex items-center gap-1 rounded-full border border-stone-200 bg-white/95 p-1.5 pl-4 text-sm shadow-card backdrop-blur"
    >
      <span class="mr-2 font-semibold whitespace-nowrap text-stone-900">{reference}</span>
      <button class="rounded-full px-3 py-1.5 font-medium hover:bg-stone-100" onclick={copyText}
        >Copy</button
      >
      <button class="rounded-full px-3 py-1.5 font-medium hover:bg-stone-100" onclick={copyLink}
        >Copy link</button
      >
      <button
        class="grid size-8 place-items-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-900"
        aria-label="Clear selection"
        onclick={() => selected.clear()}
      >
        <svg
          class="size-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path stroke-linecap="round" d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
    </div>
  </div>
{/if}
