<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import SegmentedControl from '$lib/components/SegmentedControl.svelte'

  const { Story } = defineMeta({
    title: 'Controls/SegmentedControl',
    component: SegmentedControl,
    tags: ['autodocs'],
    args: {
      options: [
        { value: 'israel', label: 'Israel' },
        { value: 'judah', label: 'Judah' },
      ],
      value: 'israel',
      label: 'Kingdom',
      name: 'kingdom',
    },
  })
</script>

<Story name="Two options" />

<Story
  name="Four options"
  args={{
    options: [
      { value: 'any', label: 'Any' },
      { value: 'united', label: 'United' },
      { value: 'israel', label: 'Israel' },
      { value: 'judah', label: 'Judah' },
    ],
    value: 'any',
  }}
/>
