<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { fn } from 'storybook/test'
  import SearchInput from '$lib/components/SearchInput.svelte'

  const { Story } = defineMeta({
    title: 'Controls/SearchInput',
    component: SearchInput,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    args: {
      value: '',
      label: 'Search people',
      placeholder: 'Name, or what they did',
      pending: false,
      onsubmit: fn(),
    },
  })
</script>

<Story name="Empty" />

<Story name="With text" args={{ value: 'Elijah' }} />

<!-- Typed, but the debounced search hasn't run yet -->
<Story name="Pending" args={{ value: 'Eli', pending: true }} />
