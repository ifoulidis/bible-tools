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
      onnavigate: fn(event => event.preventDefault()),
      onhoverchange: fn(),
      onactivechange: fn(),
    },
  })

  type BarProps = ComponentProps<typeof TimelineBar>

  const tooltip = () => within(document.body).findByText(/^Jeroboam II: 793–753 BC/)
  const openLink = () => within(document.body).findByRole('link', { name: /^Open Jeroboam II/ })

  /** A tap as a phone sends it: a touch press, then the click the browser makes from it */
  async function tap(element: Element) {
    await fireEvent.pointerDown(element, { pointerType: 'touch' })
    await fireEvent.click(element)
  }
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

<!-- A mouse goes straight to the page; there's no active step -->
<Story
  name="Clicked"
  play={async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('link'))
    await expect(args.onnavigate).toHaveBeenCalledOnce()
    await expect(args.onactivechange).not.toHaveBeenCalled()
  }}
/>

<Story name="Active" args={{ active: true }} />

<!-- The first tap opens the tooltip and stays put; open it in its own tab with device emulation
     on to try it with a real finger -->
<Story
  name="Tapped once"
  globals={{ viewport: { value: 'mobile1', isRotated: false } }}
  play={async ({ canvas, args }) => {
    await tap(canvas.getByRole('link'))
    await expect(args.onactivechange).toHaveBeenCalledWith(true)
    await expect(args.onnavigate).not.toHaveBeenCalled()
    await waitFor(async () => expect(await openLink()).toBeVisible())
  }}
/>

<Story
  name="Tapped twice"
  globals={{ viewport: { value: 'mobile1', isRotated: false } }}
  play={async ({ canvas, args }) => {
    const bar = canvas.getByRole('link')
    await tap(bar)
    await tap(bar)
    await expect(args.onnavigate).toHaveBeenCalledOnce()
  }}
/>

<Story
  name="Tooltip tapped"
  globals={{ viewport: { value: 'mobile1', isRotated: false } }}
  play={async ({ canvas, args }) => {
    await tap(canvas.getByRole('link'))
    await tap(await openLink())
    await expect(args.onnavigate).toHaveBeenCalledOnce()
  }}
/>

<Story
  name="Tapped, then tapped outside"
  globals={{ viewport: { value: 'mobile1', isRotated: false } }}
  play={async ({ canvas, args }) => {
    await tap(canvas.getByRole('link'))
    await tap(document.body)
    await expect(args.onactivechange).toHaveBeenLastCalledWith(false)
    await expect(args.onnavigate).not.toHaveBeenCalled()
  }}
/>
