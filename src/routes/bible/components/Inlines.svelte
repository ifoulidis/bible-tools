<script lang="ts">
  import { type Inline, osisRefHref } from '$lib/bible'
  import { settings } from '$lib/bible/settings.svelte'

  import FootnoteCall from './FootnoteCall.svelte'
  import Inlines from './Inlines.svelte'
  import { getPassage, pressed } from './passage'

  let { content }: { content: Inline[] } = $props()

  const passage = getPassage()

  /**
   * "LORD" and "GOD" stand for the divine name, YHWH, and are printed in small capitals. Splitting
   * on a captured group leaves the names at the odd indices
   */
  const divineName = /\b(LORD|GOD)\b/
  const smallCaps = (name: string) => name[0] + name.slice(1).toLowerCase()
</script>

<!-- Kept on few lines: whitespace between these would show up as spaces in the text -->
{#each content as inline, i (i)}{#if typeof inline === 'string'}{#each inline.split(divineName) as part, j (j)}{#if j % 2}<span
          class="small-caps">{smallCaps(part)}</span
        >{:else}{part}{/if}{/each}{:else if 'verse' in inline}{#if settings.verseNumbers}<span
        id="v{inline.verse}"
        class="verse-number"
        role="button"
        tabindex="0"
        aria-pressed={passage.isSelected(inline.verse)}
        aria-label="Verse {inline.verse}"
        onclick={() => passage.toggleVerse(inline.verse)}
        onkeydown={pressed(() => passage.toggleVerse(inline.verse))}>{inline.verse}</span
      >{:else}<span id="v{inline.verse}" class="scroll-mt-24"
      ></span>{/if}{:else if 'gap' in inline}<span id="v{inline.gap}" class="scroll-mt-24"
    ></span>{:else if 'note' in inline}{#if settings.notes}<FootnoteCall
        index={inline.note}
      />{/if}{:else if 'italic' in inline}<i><Inlines content={inline.italic} /></i
    >{:else if 'sup' in inline}<sup><Inlines content={inline.sup} /></sup>{:else}{@const href =
      osisRefHref(inline.ref)}{#if href}<a
        {href}
        class="underline decoration-primary-300 underline-offset-2 transition-colors hover:decoration-primary-700"
        ><Inlines content={inline.text} /></a
      >{:else}<Inlines content={inline.text} />{/if}{/if}{/each}
