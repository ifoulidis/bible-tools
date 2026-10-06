<script lang="ts">
  import type { Audience, Kingdom } from '$lib/data'

  import Card from './Card.svelte'
  import FacetCard from './FacetCard.svelte'
  import PassageList from './PassageList.svelte'
  import PersonHeader from './PersonHeader.svelte'
  import Succession from './Succession.svelte'

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

<article class="mx-auto my-10 max-w-190 px-4">
  <a
    class="inline-flex items-center gap-1 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
    href="/timeline"><span aria-hidden="true">←</span> Timeline</a
  >

  <PersonHeader {person} />

  {#if data.predecessor || data.successor || person.reign?.relationToPredecessor}
    <Succession
      predecessor={data.predecessor}
      successor={data.successor}
      relation={person.reign?.relationToPredecessor}
    />
  {/if}

  {#each facets as { title, facet } (title)}
    <FacetCard {title} {facet} names={data.names} sources={data.sources} />
  {/each}

  {#if data.contemporaries.length > 0}
    <Card title="Named contemporaries">
      <ul class="flex flex-wrap gap-x-5 gap-y-2">
        {#each data.contemporaries as other (other.id)}
          <li>
            <a class="link" href="/people/{other.id}">{other.name}</a>
            <span class="text-stone-500">{other.role}</span>
          </li>
        {/each}
      </ul>
    </Card>
  {/if}

  {#if person.family.length > 0}
    <Card title="Family">
      <ul class="grid gap-1">
        {#each person.family as member (member.relation + member.name)}
          <li>
            <span class="inline-block min-w-20 text-stone-500 capitalize">{member.relation}</span>
            {#if member.personId}
              <a class="link" href="/people/{member.personId}">{member.name}</a>
            {:else}
              {member.name}
            {/if}
          </li>
        {/each}
      </ul>
    </Card>
  {/if}

  <PassageList name={person.name} passages={data.passages} />
</article>
