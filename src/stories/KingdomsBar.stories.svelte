<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import KingdomsBar from '../routes/timeline/KingdomsBar.svelte'

  const { Story } = defineMeta({
    title: 'Timeline/KingdomsBar',
    component: KingdomsBar,
    tags: ['autodocs'],
    // Not centered: it fills its container's width, which would be nothing there
    parameters: { layout: 'padded' },
  })
</script>

<!-- Decorative: the united kingdom dividing into Israel and Judah -->
<Story name="KingdomsBar" />
