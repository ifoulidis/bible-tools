<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import type { ComponentProps } from 'svelte'
  import { expect } from 'storybook/test'
  import RecallQuiz from '$lib/components/RecallQuiz.svelte'
  import { gradeYear } from '$lib/utility/text'

  const kings = [
    { id: 'saul', answer: 'Saul', accepted: ['Saul'] },
    { id: 'david', answer: 'David', accepted: ['David'] },
    { id: 'solomon', answer: 'Solomon', accepted: ['Solomon', 'Jedidiah'] },
  ]

  // Placeholder years: a real year quiz needs checked dates
  const years = [
    { id: 'sample-1', answer: '1868', accepted: ['1868'], year: 1868 },
    { id: 'sample-2', answer: '586 BC', accepted: ['586 BC'], year: -586 },
  ]

  const yearsById = new Map(years.map(question => [question.id, question.year]))
  function yearOf(id: string) {
    const year = yearsById.get(id)
    if (year === undefined) throw new Error(`No year for question ${id}`)
    return year
  }

  type QuizProps = ComponentProps<typeof RecallQuiz>

  const { Story } = defineMeta({
    title: 'Memorise/RecallQuiz',
    component: RecallQuiz,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
  })
</script>

<!-- The kings quiz's question, for both stories below -->
{#snippet kingsQuiz(args: QuizProps)}
  <RecallQuiz {...args}>
    {#snippet prompt(index)}
      <h2 class="text-2xl font-semibold">
        {index === 0 ? 'Who was the first king?' : `Who reigned after ${kings[index - 1].answer}?`}
      </h2>
    {/snippet}
  </RecallQuiz>
{/snippet}

<Story
  name="Names"
  template={kingsQuiz}
  args={{ questions: kings, placeholder: 'Name of the king' }}
/>

<Story
  name="Names, one typo"
  args={{ questions: kings, placeholder: 'Name of the king' }}
  play={async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText('Your answer'), 'Saull{Enter}')
    await expect(canvas.getByText('Typo')).toBeVisible()
  }}
  template={kingsQuiz}
/>

<!-- Marked by year rather than spelling: "AD 1868", "1868" and "c. 1868" all count -->
<Story
  name="Years"
  args={{
    questions: years,
    placeholder: 'Year, e.g. 1868 or 586 BC',
    grade: (given, question) => gradeYear(given, yearOf(question.id)),
  }}
  play={async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText('Your answer'), 'c. 1868{Enter}')
    await expect(canvas.getByText('2 / 2')).toBeVisible()
  }}
>
  {#snippet template(args)}
    <RecallQuiz {...args}>
      {#snippet prompt(index)}
        <h2 class="text-2xl font-semibold">Sample question {index + 1}: in what year?</h2>
      {/snippet}
    </RecallQuiz>
  {/snippet}
</Story>
