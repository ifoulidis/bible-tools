<script lang="ts">
  import DatingCard from '$lib/components/DatingCard.svelte'
  import {
    type Audience,
    type Kingdom,
    type Passage,
    bibleGatewayUrl,
    formatPassage,
  } from '$lib/data'

  let { data } = $props()
  let person = $derived(data.person)

  const kingdomNames: Record<Kingdom, string> = {
    united: 'the united kingdom',
    israel: 'Israel',
    judah: 'Judah',
  }
  const audienceNames: Record<Audience, string> = {
    united: 'the united kingdom',
    israel: 'Israel',
    judah: 'Judah',
    nations: 'the nations',
    exiles: 'the exiles',
    returnees: 'the returned exiles',
  }
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
      .map(group => ({ ...group, passages: data.passages.filter(p => p.kind === group.kind) }))
      .filter(group => group.passages.length > 0),
  )
  let facets = $derived(
    [
      person.reign && {
        title: `King of ${kingdomNames[person.reign.kingdom]}`,
        facet: person.reign,
      },
      person.ministry && {
        title: `Prophet to ${person.ministry.audience.map(a => audienceNames[a]).join(', ')}`,
        facet: person.ministry,
      },
    ].filter(entry => !!entry),
  )
</script>

<svelte:head>
  <title>{person.name}</title>
</svelte:head>

<article class="page">
  <a class="back" href="/timeline">← Timeline</a>

  <header>
    <h1>{person.name}</h1>
    {#if person.altNames.length > 0}
      <p class="alt">Also called {person.altNames.join(', ')}</p>
    {/if}
    <div class="badges">
      {#if person.reign}<span class="badge {person.reign.kingdom}">King</span>{/if}
      {#if person.ministry}<span class="badge prophet">Prophet</span>{/if}
      {#if person.ministry?.hasBook}<span class="badge book">Has a book</span>{/if}
    </div>
    <p class="summary">{person.summary}</p>
  </header>

  {#if data.predecessor || data.successor || person.reign?.relationToPredecessor}
    <nav class="succession" aria-label="Succession">
      <span>
        {#if data.predecessor}← <a href="/people/{data.predecessor.id}">{data.predecessor.name}</a
          >{/if}
      </span>
      {#if person.reign?.relationToPredecessor}
        <span class="muted">{person.reign.relationToPredecessor}</span>
      {/if}
      <span>
        {#if data.successor}<a href="/people/{data.successor.id}">{data.successor.name}</a> →{/if}
      </span>
    </nav>
  {/if}

  {#each facets as { title, facet } (title)}
    <section class="card">
      <h2>{title}</h2>
      <DatingCard dating={facet.dating} names={data.names} sources={data.sources} />

      {#if facet.alternatives.length > 0}
        <details>
          <summary>Other views ({facet.alternatives.length})</summary>
          {#each facet.alternatives as alternative (alternative.label)}
            <div class="alternative">
              <h3>{alternative.label}</h3>
              <DatingCard dating={alternative.dating} names={data.names} sources={data.sources} />
            </div>
          {/each}
        </details>
      {/if}
    </section>
  {/each}

  {#if data.contemporaries.length > 0}
    <section class="card">
      <h2>Named contemporaries</h2>
      <ul class="chips">
        {#each data.contemporaries as other (other.id)}
          <li>
            <a href="/people/{other.id}">{other.name}</a> <span class="muted">{other.role}</span>
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if person.family.length > 0}
    <section class="card">
      <h2>Family</h2>
      <ul class="family">
        {#each person.family as member (member.relation + member.name)}
          <li>
            <span class="muted">{member.relation}</span>
            {#if member.personId}
              <a href="/people/{member.personId}">{member.name}</a>
            {:else}
              {member.name}
            {/if}
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  <section class="card">
    <h2>Where {person.name} appears in Scripture</h2>
    {#each groups as group (group.kind)}
      <h3>{group.title}</h3>
      <ul class="passages">
        {#each group.passages as passage (formatPassage(passage))}
          <li>
            <a href={bibleGatewayUrl(passage)} target="_blank" rel="noopener noreferrer"
              >{formatPassage(passage)}</a
            >
            {#if passage.note}<span class="muted">{passage.note}</span>{/if}
          </li>
        {/each}
      </ul>
    {/each}
  </section>
</article>

<style>
  .page {
    max-width: 760px;
    margin: 2rem auto;
    padding: 0 1rem;
    color: #1f2937;
  }

  .back {
    color: #6b7280;
  }

  header {
    margin: 1rem 0 1.5rem;
  }

  h1 {
    font-size: 2.25rem;
    font-weight: 700;
  }

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  h3 {
    font-weight: 600;
    margin: 1rem 0 0.4rem;
  }

  .alt,
  .muted {
    color: #6b7280;
  }

  .summary {
    margin-top: 0.75rem;
    font-size: 1.1rem;
  }

  .badges {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .badge {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.15rem 0.6rem;
    border-radius: 999px;
    color: white;
    background: #6b7280;
  }
  .badge.united {
    background: #7c3aed;
  }
  .badge.israel {
    background: #2563eb;
  }
  .badge.judah {
    background: #dc2626;
  }
  .badge.prophet {
    background: #d97706;
  }
  .badge.book {
    background: #374151;
  }

  .succession {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  .succession > :last-child {
    text-align: right;
  }

  .card {
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin-bottom: 1.25rem;
  }

  details {
    margin-top: 1.25rem;
    border-top: 1px solid #e5e7eb;
    padding-top: 0.75rem;
  }

  summary {
    cursor: pointer;
    font-weight: 600;
  }

  .alternative {
    margin-top: 1rem;
    padding-left: 1rem;
    border-left: 3px solid #e5e7eb;
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.25rem;
  }

  .family,
  .passages {
    display: grid;
    gap: 0.3rem;
  }

  .family .muted {
    display: inline-block;
    min-width: 5rem;
    text-transform: capitalize;
  }

  a {
    color: #1d4ed8;
  }
  .card a,
  .succession a {
    text-decoration: underline;
  }
</style>
