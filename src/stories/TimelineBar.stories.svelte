<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import type { ComponentProps } from 'svelte'
  import { expect, fireEvent, fn, waitFor, within } from 'storybook/test'
  import TimelineBar from '../routes/timeline/TimelineBar.svelte'

  const dating = { span: { from: 793, to: 753, approx: false }, confidence: 'firm' } as const

  // Real names from the dataset, shortest to longest
  const names = ['Asa', 'Ahab', 'Jehoiakim', 'Jeroboam II', 'Zechariah son of Jehoiada']
  // Either side of the 50px cutoff where the name is dropped, up to a long reign at full zoom
  const widths = [6, 20, 21, 30, 50, 51, 70, 100, 150, 250]

  const { Story } = defineMeta({
    title: 'Timeline/TimelineBar',
    component: TimelineBar,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    argTypes: {
      lane: { control: 'inline-radio', options: ['united', 'israel', 'judah', 'prophets'] },
      width: { control: { type: 'range', min: 0, max: 400 } },
      coregencyWidth: { control: { type: 'range', min: 0, max: 400 } },
      class: { table: { disable: true } },
      style: { table: { disable: true } },
    },
    args: {
      name: 'Jeroboam II',
      dating,
      lane: 'israel',
      href: '/people/jeroboam-ii',
      width: 160,
      coregencyWidth: 0,
      dimmed: false,
      raised: false,
      // Logged in the Actions panel instead of navigating the preview away
      onclick: fn(event => event.preventDefault()),
      onhoverchange: fn(),
    },
  })

  type BarProps = ComponentProps<typeof TimelineBar>

  const tooltip = () => within(document.body).findByText(/^Jeroboam II: 793–753 BC/)
</script>

<Story name="Default" />

<!-- Every name at every width, either side of where the name and badge drop out -->
{#snippet widthGrid(args: BarProps)}
  <table class="border-separate border-spacing-x-3 border-spacing-y-2 text-xs text-stone-500">
    <thead>
      <tr>
        <th></th>
        {#each widths as width (width)}
          <th class="text-left font-medium tabular-nums">{width}px</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each names as name (name)}
        <tr>
          <th class="pr-2 text-right font-medium whitespace-nowrap">{name}</th>
          {#each widths as width (width)}
            <td style:min-width="{width}px"><TimelineBar {...args} {name} {width} /></td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
{/snippet}

<Story
  name="Text vs width"
  template={widthGrid}
  parameters={{ controls: { include: ['lane', 'attestedBy'] } }}
/>

<Story
  name="Text vs width, named outside the Bible"
  template={widthGrid}
  args={{ attestedBy: ['Tell al-Rimah Stele (Adad-nirari III)'] }}
  parameters={{ controls: { include: ['lane', 'attestedBy'] } }}
/>

<Story name="Lanes" parameters={{ controls: { exclude: ['lane'] } }}>
  {#snippet template(args)}
    <div class="flex flex-col gap-2">
      {#each ['united', 'israel', 'judah', 'prophets'] as const as lane (lane)}
        <TimelineBar {...args} {lane} />
      {/each}
    </div>
  {/snippet}
</Story>

<Story
  name="Coregency"
  args={{
    dating: { ...dating, coregencyFrom: 793, span: { from: 782, to: 753, approx: false } },
    coregencyWidth: 44,
  }}
/>

<Story
  name="Approximate"
  args={{ dating: { ...dating, span: { ...dating.span, approx: true } } }}
/>

<Story name="Dimmed" args={{ dimmed: true }} />

<Story
  name="Hovered"
  play={async ({ canvas, userEvent, args }) => {
    await userEvent.hover(canvas.getByRole('link'))
    await expect(await tooltip()).toBeVisible()
    await expect(args.onhoverchange).toHaveBeenCalledWith(true)
  }}
/>

<Story
  name="Focused with keyboard"
  play={async ({ userEvent, args }) => {
    await userEvent.tab()
    await expect(await tooltip()).toBeVisible()
    await expect(args.onhoverchange).toHaveBeenCalledWith(true)
  }}
/>

<Story
  name="Clicked"
  play={async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('link'))
    await expect(args.onclick).toHaveBeenCalledOnce()
  }}
/>

<!-- Tippy only treats input as touch after a real touchstart, so this emulates one; for the real
     thing, open the story in its own tab with device emulation on -->
<Story
  name="Tapped"
  globals={{ viewport: { value: 'mobile1', isRotated: false } }}
  play={async ({ canvas, userEvent, args }) => {
    const bar = canvas.getByRole('link')
    await fireEvent.touchStart(bar)
    await userEvent.click(bar)
    await expect(args.onclick).toHaveBeenCalledOnce()
    await waitFor(async () => expect(await tooltip()).toBeVisible())
  }}
/>
