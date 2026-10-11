<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect } from 'storybook/test'
  import Flashcard from '$lib/components/Flashcard.svelte'

  // Placeholder text only: real cards need checked content and sources
  const card = {
    id: 'sample',
    prompt: 'Sample prompt: a question about a find or a fact goes here?',
    answer: 'Sample answer',
    detail: 'A sentence or two of context under the answer, kept short enough to read at a glance.',
    source: { label: 'Sample source, page 12', url: 'https://example.com' },
  }

  const { Story } = defineMeta({
    title: 'Memorise/Flashcard',
    component: Flashcard,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    args: { card, revealed: false, kicker: 'Sample deck' },
  })
</script>

<Story name="Front" />

<Story name="Back" args={{ revealed: true }} />

<Story
  name="Answer only"
  args={{ revealed: true, card: { id: 'bare', prompt: card.prompt, answer: card.answer } }}
/>

<Story
  name="Long text"
  args={{
    revealed: true,
    card: {
      ...card,
      prompt: `${card.prompt} With a much longer second sentence to see how the prompt wraps when it runs over several lines.`,
      detail: `${card.detail} `.repeat(4).trim(),
    },
  }}
/>

<Story
  name="Flipped by clicking"
  play={async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button'))
    await expect(canvas.getByText('Sample answer')).toBeVisible()
  }}
/>
