<script lang="ts">
  import {
    type Dating,
    type Evidence,
    type Source,
    bibleGatewayUrl,
    formatPassage,
  } from '$lib/data'
  import { formatSpan } from '$lib/timeline/layout'

  let {
    dating,
    names,
    sources,
  }: { dating: Dating; names: Record<string, string>; sources: Record<string, Source> } = $props()

  const evidenceLabels: Record<Evidence['kind'], string> = {
    synchronism: 'Cross-dated in the text',
    'regnal-length': 'Length of reign',
    superscription: 'Opening verse names the kings',
    'narrative-contact': 'Meets them in the narrative',
    'internal-date': 'Dated in the text',
    extrabiblical: 'Outside the Bible',
    inference: 'Inference',
  }
</script>

<div class="dating">
  <p class="span">
    <strong>{formatSpan(dating)}</strong>
    <span class="confidence {dating.confidence}">{dating.confidence}</span>
  </p>
  {#if dating.coregencyFrom}
    <p class="muted">
      Overlapping reign from {dating.coregencyFrom} BC; sole reign from {dating.span.from} BC.
    </p>
  {/if}

  <h4>Why this date</h4>
  <ul class="evidence">
    {#each dating.evidence as evidence, i (i)}
      <li>
        <span class="kind">{evidenceLabels[evidence.kind]}</span>
        {#if 'passage' in evidence}
          <a href={bibleGatewayUrl(evidence.passage)} target="_blank" rel="noopener noreferrer"
            >{formatPassage(evidence.passage)}</a
          >
        {/if}
        {#if evidence.kind === 'extrabiblical'}
          <em>{evidence.artifact}</em>
        {/if}
        {#if 'note' in evidence}
          <span>{evidence.note}</span>
        {/if}
        {#if 'contemporaries' in evidence}
          <span>
            Names
            {#each evidence.contemporaries as id, j (id)}
              {j > 0 ? ', ' : ''}<a href="/people/{id}">{names[id] ?? id}</a>
            {/each}
          </span>
        {/if}
      </li>
    {/each}
  </ul>

  {#if dating.notes}
    <p class="muted">{dating.notes}</p>
  {/if}

  <h4>Sources</h4>
  <ul class="sources">
    {#each dating.citations as citation (citation.sourceId)}
      {@const source = sources[citation.sourceId]}
      <li>
        {#if source}
          {source.author}, <cite>{source.title}</cite> ({source.publisher
            ? `${source.publisher}, `
            : ''}{source.year}){citation.pages ? `, ${citation.pages}` : ''}
        {:else}
          {citation.sourceId}
        {/if}
      </li>
    {/each}
  </ul>
</div>

<style>
  .span {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-family: var(--font-display);
    font-size: 1.5rem;
    color: var(--color-stone-900);
  }

  .confidence {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-family: var(--font-sans);
    font-weight: 600;
    padding: 0.15rem 0.6rem;
    border-radius: 999px;
  }
  .confidence.firm {
    background: #dcfce7;
    color: #166534;
  }
  .confidence.probable {
    background: #fef9c3;
    color: #854d0e;
  }
  .confidence.disputed {
    background: #fee2e2;
    color: #991b1b;
  }

  h4 {
    margin: 1.25rem 0 0.5rem;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-primary-700);
  }

  ul {
    display: grid;
    gap: 0.4rem;
  }

  .evidence li {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 0.5rem;
    align-items: baseline;
  }

  .kind {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-stone-700);
    background: var(--color-stone-100);
    padding: 0.05rem 0.5rem;
    border-radius: 0.25rem;
  }

  a {
    font-weight: 500;
    color: var(--color-stone-900);
    text-decoration: underline 2px var(--color-primary-400);
    text-underline-offset: 3px;
    transition: text-decoration-color 150ms;
  }
  a:hover {
    text-decoration-color: currentcolor;
  }

  .muted {
    color: var(--color-stone-500);
    margin-top: 0.5rem;
  }
</style>
