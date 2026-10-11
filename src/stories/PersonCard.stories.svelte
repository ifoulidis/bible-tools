<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { peopleById } from '$lib/data'
  import PersonCard from '../routes/people/components/PersonCard.svelte'
  import { toPersonEntry } from '../routes/people/search'

  /** A real person from the dataset, as the people page shows them */
  function entry(id: string) {
    const person = peopleById.get(id)
    if (!person) throw new Error(`No person "${id}" in the dataset`)
    return toPersonEntry(person)
  }

  const { Story } = defineMeta({
    title: 'People/PersonCard',
    component: PersonCard,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
  })
</script>

<Story name="King" args={{ person: entry('hezekiah') }} />

<Story name="Prophet" args={{ person: entry('elijah') }} />

<Story name="Other names" args={{ person: entry('jehoiachin') }} />

<Story name="Long name" args={{ person: entry('zechariah-son-of-jehoiada') }} />
