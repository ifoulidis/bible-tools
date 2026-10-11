<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import type { RecallResult } from '$lib/components/RecallQuiz.svelte'
  import type { Verdict } from '$lib/utility/text'
  import KingChain from '../routes/memorise/components/KingChain.svelte'

  const result = (answer: string, verdict: Verdict): RecallResult => ({
    question: { id: answer.toLowerCase(), answer, accepted: [answer] },
    given: answer,
    verdict,
    closest: answer,
  })

  const { Story } = defineMeta({
    title: 'Memorise/KingChain',
    component: KingChain,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
  })
</script>

<!-- Nothing shows until the first answer -->
<Story name="No answers yet" args={{ results: [] }} />

<Story
  name="Mixed"
  args={{
    results: [
      result('Rehoboam', 'correct'),
      result('Abijam', 'correct'),
      result('Asa', 'incorrect'),
      result('Jehoshaphat', 'typo'),
    ],
  }}
/>

<!-- Wraps onto more lines as the line of kings grows -->
<Story
  name="Long"
  args={{
    results: [
      'Rehoboam',
      'Abijam',
      'Asa',
      'Jehoshaphat',
      'Jehoram',
      'Ahaziah',
      'Athaliah',
      'Joash',
      'Amaziah',
      'Azariah',
      'Jotham',
      'Ahaz',
      'Hezekiah',
      'Manasseh',
      'Amon',
      'Josiah',
    ].map((name, i) => result(name, i % 5 === 3 ? 'incorrect' : i % 7 === 2 ? 'typo' : 'correct')),
  }}
/>
