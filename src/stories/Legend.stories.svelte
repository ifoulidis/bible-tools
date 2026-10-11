<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import Legend from '../routes/timeline/Legend.svelte'

  const { Story } = defineMeta({
    title: 'Timeline/Legend',
    component: Legend,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
  })
</script>

<Story name="Legend" />

<Story name="Phone" globals={{ viewport: { value: 'mobile1', isRotated: false } }} />
