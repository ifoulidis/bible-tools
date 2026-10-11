<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import AnswerFeedback from '$lib/components/AnswerFeedback.svelte'

  const { Story } = defineMeta({
    title: 'Memorise/AnswerFeedback',
    component: AnswerFeedback,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    args: { verdict: 'typo', given: 'Jehosaphat', answer: 'Jehoshaphat' },
  })
</script>

<Story name="Typo" />

<!-- Close to another accepted spelling, so the diff is against that one -->
<Story
  name="Typo of another name"
  args={{ given: 'Usiah', answer: 'Azariah', closest: 'Uzziah' }}
/>

<Story name="Incorrect" args={{ verdict: 'incorrect', given: 'Omri', answer: 'Ahab' }} />

<!-- "I don't know" submits nothing -->
<Story name="Didn't know" args={{ verdict: 'incorrect', given: '', answer: 'Ahab' }} />
