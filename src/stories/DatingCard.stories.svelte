<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import DatingCard from '$lib/components/DatingCard.svelte'
  import { type Dating, people, peopleById, sources } from '$lib/data'

  const names = Object.fromEntries(people.map(person => [person.id, person.name]))
  const sourcesById = Object.fromEntries(sources.map(source => [source.id, source]))

  /** A real dating from the dataset, as the person page shows it */
  function dating(id: string, role: 'reign' | 'ministry'): Dating {
    const facet = peopleById.get(id)?.[role]
    if (!facet) throw new Error(`No ${role} for "${id}" in the dataset`)
    return facet.dating
  }

  const { Story } = defineMeta({
    title: 'People/DatingCard',
    component: DatingCard,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    args: { names, sources: sourcesById },
  })
</script>

<!-- Dated partly from Assyrian records -->
<Story
  name="Reign with evidence outside the Bible"
  args={{ dating: dating('hezekiah', 'reign') }}
/>

<Story name="Prophet's ministry" args={{ dating: dating('hosea', 'ministry') }} />

<Story name="Short reign" args={{ dating: dating('zimri', 'reign') }} />
