<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import PeopleFilters from '../routes/people/components/PeopleFilters.svelte'
  import { defaultFilters } from '../routes/people/search'

  const { Story } = defineMeta({
    title: 'People/PeopleFilters',
    component: PeopleFilters,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    args: {
      role: defaultFilters.role,
      kingdom: defaultFilters.kingdom,
      hasBook: defaultFilters.hasBook,
      sort: defaultFilters.sort,
    },
  })
</script>

<Story name="Defaults" />

<Story name="Changed" args={{ role: 'prophet', kingdom: 'judah', hasBook: true, sort: 'name' }} />

<!-- Wraps on a phone; the page puts it in a card behind a Filters button there -->
<Story name="Phone" globals={{ viewport: { value: 'mobile1', isRotated: false } }} />
