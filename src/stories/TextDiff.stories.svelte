<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import TextDiff from '$lib/components/TextDiff.svelte'

  const { Story } = defineMeta({
    title: 'Memorise/TextDiff',
    component: TextDiff,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    args: { given: 'Jehosaphat', expected: 'Jehoshaphat' },
  })
</script>

<Story name="Missing letter" />

<Story name="Extra letter" args={{ given: 'Hezekiahh', expected: 'Hezekiah' }} />

<Story name="Wrong letter" args={{ given: 'Manassah', expected: 'Manasseh' }} />

<Story name="Case only" args={{ given: 'ahab', expected: 'Ahab' }} />
