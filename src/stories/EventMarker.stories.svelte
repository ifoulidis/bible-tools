<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, waitFor, within } from 'storybook/test'
  import { events } from '$lib/data/events'
  import EventMarker from '../routes/timeline/EventMarker.svelte'

  const byId = (id: string) => {
    const event = events.find(event => event.id === id)
    if (!event) throw new Error(`No event ${id}`)
    return event
  }

  const { Story } = defineMeta({
    title: 'Timeline/EventMarker',
    component: EventMarker,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    argTypes: {
      side: { control: 'inline-radio', options: ['right', 'left'] },
      class: { table: { disable: true } },
      style: { table: { disable: true } },
    },
    args: { event: byId('temple-begun'), side: 'right', tooltip: true },
  })
</script>

<Story name="In the Bible" />

<Story name="In the world" args={{ event: byId('olympics') }} />

<!-- Near the end of the chart the name goes on the left, so it doesn't run off the edge -->
<Story name="Name on the left" args={{ event: byId('walls-rebuilt'), side: 'left' }} />

<Story
  name="Hovered"
  args={{ event: byId('qarqar') }}
  play={async ({ canvas, userEvent }) => {
    await userEvent.hover(canvas.getByRole('button', { name: /^Battle of Qarqar/ }))
    const page = within(document.body)
    await waitFor(() => expect(page.getByText(/Ahab the Israelite/)).toBeVisible())
  }}
/>
