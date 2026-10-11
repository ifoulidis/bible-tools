<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import ToggleChip from '$lib/components/ToggleChip.svelte'

  const { Story } = defineMeta({
    title: 'Controls/ToggleChip',
    component: ToggleChip,
    tags: ['autodocs'],
    args: { checked: false, label: 'Has a book' },
  })
</script>

<Story name="Off" />

<Story name="On" args={{ checked: true }} />
