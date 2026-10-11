<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, fireEvent } from 'storybook/test'
  import { people } from '$lib/data'
  import { buildContemporaries } from '$lib/data/relations'
  import { toTimelinePerson } from '$lib/timeline/layout'
  import TimelineChart from '../routes/timeline/TimelineChart.svelte'

  // The same data the timeline page loads
  const contemporaries = Object.fromEntries(
    [...buildContemporaries(people)].map(([id, ids]) => [id, [...ids]]),
  )

  const { Story } = defineMeta({
    title: 'Timeline/TimelineChart',
    component: TimelineChart,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    argTypes: {
      filter: { control: 'inline-radio', options: ['everyone', 'kings', 'prophets'] },
      pxPerYear: { control: { type: 'range', min: 2, max: 14, step: 1 } },
      people: { table: { disable: true } },
      contemporaries: { table: { disable: true } },
    },
    args: {
      people: people.map(toTimelinePerson),
      contemporaries,
      filter: 'everyone',
      pxPerYear: 5,
    },
  })
</script>

<Story name="Everyone" />

<Story name="Kings" args={{ filter: 'kings' }} />

<Story name="Prophets" args={{ filter: 'prophets' }} />

<Story name="Zoomed out" args={{ pxPerYear: 2 }} />

<Story name="Zoomed in" args={{ pxPerYear: 14 }} />

<Story name="Phone" globals={{ viewport: { value: 'mobile1', isRotated: false } }} />

<!-- Hovering a prophet fades everyone except the kings named alongside them -->
<Story
  name="Prophet hovered"
  play={async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByRole('link', { name: /^Elijah,/ }))
    await expect(canvas.getByRole('link', { name: /^Ahab,/ })).not.toHaveClass('opacity-20')
    await expect(canvas.getByRole('link', { name: /^Josiah,/ })).toHaveClass('opacity-20')
  }}
/>

<!-- On a phone, tapping a prophet does what hovering does on a computer, and keeps it until a tap
     elsewhere -->
<Story
  name="Prophet tapped"
  globals={{ viewport: { value: 'mobile1', isRotated: false } }}
  args={{ pxPerYear: 8 }}
  play={async ({ canvas }) => {
    const elijah = canvas.getByRole('link', { name: /^Elijah,/ })
    elijah.scrollIntoView({ inline: 'center' })
    await fireEvent.pointerDown(elijah, { pointerType: 'touch' })
    await fireEvent.click(elijah)
    await expect(canvas.getByRole('link', { name: /^Ahab,/ })).not.toHaveClass('opacity-20')
    await expect(canvas.getByRole('link', { name: /^Josiah,/ })).toHaveClass('opacity-20')
  }}
/>
