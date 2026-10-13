<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import Manuscript from '$lib/components/Manuscript.svelte'

  const { Story } = defineMeta({
    title: 'Components/Manuscript',
    component: Manuscript,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    args: { eyebrow: 'Prophet', title: 'Elijah' },
  })
</script>

<Story name="Title only" />

<Story name="With text">
  {#snippet template(args)}
    <Manuscript {...args} class="max-w-72">
      <p class="italic">c. 860–850 BC</p>
      <p>Placeholder text, long enough to wrap onto a second line inside the rules.</p>
    </Manuscript>
  {/snippet}
</Story>

<Story name="No eyebrow" args={{ eyebrow: undefined }} />
