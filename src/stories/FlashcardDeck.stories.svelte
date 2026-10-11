<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect } from 'storybook/test'
  import FlashcardDeck from '$lib/components/FlashcardDeck.svelte'

  // Placeholder text only: real cards need checked content and sources
  const cards = [1, 2, 3, 4].map(n => ({
    id: `sample-${n}`,
    prompt: `Sample prompt ${n}?`,
    answer: `Sample answer ${n}`,
    detail: 'Placeholder detail.',
  }))

  const { Story } = defineMeta({
    title: 'Memorise/FlashcardDeck',
    component: FlashcardDeck,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    args: { cards, kicker: 'Sample deck' },
  })
</script>

<Story name="Start" />

<!-- A missed card comes back a few cards later -->
<Story
  name="Part way through"
  play={async ({ canvas, userEvent }) => {
    // Only the face-down side is a button, so this finds the front of the current card
    const flip = () => userEvent.click(canvas.getByRole('button', { name: /Sample prompt \d\?/ }))
    await flip()
    await userEvent.click(canvas.getByRole('button', { name: 'Knew it' }))
    await flip()
    await userEvent.click(canvas.getByRole('button', { name: "Didn't know it" }))
    await expect(canvas.getByText('1 known')).toBeVisible()
    await expect(canvas.getByText('1 missed')).toBeVisible()
  }}
/>

<Story
  name="Finished"
  play={async ({ canvas, userEvent }) => {
    for (let i = 0; i < cards.length; i++) {
      await userEvent.click(canvas.getByRole('button', { name: /Sample prompt \d\?/ }))
      await userEvent.click(canvas.getByRole('button', { name: 'Knew it' }))
    }
    await expect(canvas.getByText('Finished')).toBeVisible()
  }}
/>
