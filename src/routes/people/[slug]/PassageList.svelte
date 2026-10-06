<script lang="ts">
  import { type Passage, bibleGatewayUrl, formatPassage } from '$lib/data'

  import Card from './Card.svelte'

  let { name, passages }: { name: string; passages: Passage[] } = $props()

  const passageGroups: { kind: Passage['kind']; title: string }[] = [
    { kind: 'book', title: 'Their book' },
    { kind: 'narrative', title: 'Narrative' },
    { kind: 'regnal-formula', title: 'Regnal formulas' },
    { kind: 'superscription', title: 'Superscriptions' },
    { kind: 'genealogy', title: 'Genealogies' },
    { kind: 'mention', title: 'Other Old Testament mentions' },
    { kind: 'nt-reference', title: 'New Testament' },
  ]

  let groups = $derived(
    passageGroups
      .map(group => ({ ...group, passages: passages.filter(p => p.kind === group.kind) }))
      .filter(group => group.passages.length > 0),
  )
</script>

<Card title="Where {name} appears in Scripture">
  {#each groups as group (group.kind)}
    <h3 class="mt-4 mb-1.5 font-semibold">{group.title}</h3>
    <ul class="grid gap-1">
      {#each group.passages as passage (formatPassage(passage))}
        <li>
          <a class="link" href={bibleGatewayUrl(passage)} target="_blank" rel="noopener noreferrer"
            >{formatPassage(passage)}</a
          >
          {#if passage.note}<span class="text-stone-500">{passage.note}</span>{/if}
        </li>
      {/each}
    </ul>
  {/each}
</Card>
