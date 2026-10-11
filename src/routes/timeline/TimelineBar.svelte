<script lang="ts">
  import tippy, { type Instance } from 'tippy.js'
  import { type LaneId, type TimelineDating, formatSpan } from '$lib/timeline/layout'
  import SteleIcon from './SteleIcon.svelte'
  import { type PointerType, barClick, parsePointerType, tooltipLines } from './interaction'
  import { laneClasses } from './theme'

  /** Bars narrower than this drop their name rather than show a sliver of it */
  const MIN_LABEL_PX = 50
  /** Bars narrower than this drop the badge too; the tooltip still names the find */
  const MIN_BADGE_PX = 20

  interface Props {
    name: string
    dating: TimelineDating
    lane: LaneId
    href: string
    /** Drawn width in px; a coregency gets a lighter leading segment of `coregencyWidth` */
    width: number
    coregencyWidth?: number
    /** Finds outside the Bible that name them, which earn the bar a badge */
    attestedBy?: string[]
    /**
     * Tapped once on a touch screen: the tooltip stays open, and the next tap on the bar or the
     * tooltip goes to their page. A tap anywhere else clears it.
     */
    active?: boolean
    onactivechange?: (active: boolean) => void
    /** Faded back while another bar is highlighted */
    dimmed?: boolean
    /** Drawn wider than its true length, so it sits above the neighbour it may overlap */
    raised?: boolean
    /** Hovered with a mouse or focused from the keyboard, but not tapped */
    onhoverchange?: (hovering: boolean) => void
    /** Just before a click goes through to their page; call `preventDefault` to stay put */
    onnavigate?: (event: MouseEvent) => void
    class?: string
    style?: string
  }

  let {
    name,
    dating,
    lane,
    href,
    width,
    coregencyWidth = 0,
    attestedBy = [],
    active = false,
    onactivechange,
    dimmed = false,
    raised = false,
    onhoverchange,
    onnavigate,
    class: className = '',
    style,
  }: Props = $props()

  const span = $derived(formatSpan(dating))
  const lines = $derived(tooltipLines(name, span, dating.coregencyFrom, attestedBy))

  let hovered = $state(false)
  let focused = $state(false)
  let showTooltip = $derived(active || hovered || focused)

  /** What pressed the bar last, so its click knows whether it was a tap */
  let pointer: PointerType = null

  let bar = $state<HTMLAnchorElement>()
  /** Rendered here, then handed to tippy, which moves it into the tooltip */
  let tooltipContent = $state<HTMLDivElement>()
  let instance = $state<Instance>()

  $effect(() => {
    if (!bar || !tooltipContent) return
    // Shown and hidden from `showTooltip` rather than tippy's own triggers, which can't tell a
    // tap from a hover. On the body so the chart's scrolling doesn't clip it, and interactive so
    // its link can be tapped
    const created = tippy(bar, {
      content: tooltipContent,
      arrow: false,
      trigger: 'manual',
      interactive: true,
      appendTo: () => document.body,
    })
    instance = created
    return () => created.destroy()
  })

  $effect(() => {
    if (showTooltip) instance?.show()
    else instance?.hide()
  })

  /** Hover and keyboard focus both count as hovering, so the chart hears when either changes */
  function setHovered(next: boolean) {
    const before = hovered || focused
    hovered = next
    if ((hovered || focused) !== before) onhoverchange?.(hovered || focused)
  }

  function setFocused(next: boolean) {
    const before = hovered || focused
    focused = next
    if ((hovered || focused) !== before) onhoverchange?.(hovered || focused)
  }

  // While active, a press anywhere but the bar or its tooltip clears it
  $effect(() => {
    if (!active) return
    const clearOutside = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return
      if (bar?.contains(event.target) || instance?.popper.contains(event.target)) return
      setActive(false)
    }
    document.addEventListener('pointerdown', clearOutside)
    return () => document.removeEventListener('pointerdown', clearOutside)
  })

  // Kept here as well as reported, so the bar works on its own without a parent tracking it
  function setActive(next: boolean) {
    active = next
    onactivechange?.(next)
  }

  function handleClick(event: MouseEvent) {
    const action = barClick(pointer, active)
    pointer = null
    if (action === 'activate') {
      event.preventDefault()
      setActive(true)
      return
    }
    onnavigate?.(event)
  }
</script>

<a
  bind:this={bar}
  {href}
  {style}
  class={[
    'flex h-5.5 items-center overflow-hidden rounded-md bg-linear-to-r from-(length:--coregency) to-(length:--coregency) text-xs leading-5.5 font-medium text-white shadow-bar transition duration-150 hover:z-1 hover:-translate-y-px hover:shadow-bar-lifted hover:outline-2 hover:outline-offset-1 hover:outline-stone-800 focus-visible:z-1 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-stone-800',
    laneClasses[lane].bar,
    (raised || active) && 'z-1',
    active && '-translate-y-px shadow-bar-lifted outline-2 outline-offset-1 outline-stone-800',
    dimmed && 'opacity-20',
    className,
  ]}
  style:width="{width}px"
  style:--coregency="{coregencyWidth}px"
  aria-label="{name}, {span}{attestedBy.length > 0 ? ', named outside the Bible' : ''}"
  onclick={handleClick}
  onpointerdown={event => (pointer = parsePointerType(event.pointerType))}
  onpointerenter={event => {
    if (event.pointerType === 'mouse') setHovered(true)
  }}
  onpointerleave={event => {
    if (event.pointerType === 'mouse') setHovered(false)
  }}
  onfocus={event => {
    // A tap can focus a link too; only the keyboard should open the tooltip this way
    if (event.currentTarget.matches(':focus-visible')) setFocused(true)
  }}
  onblur={() => setFocused(false)}
>
  {#if width > MIN_LABEL_PX}
    <span class="min-w-0 flex-1 overflow-hidden px-1.5 text-clip whitespace-nowrap">{name}</span>
  {/if}
  {#if attestedBy.length > 0 && width > MIN_BADGE_PX}
    <SteleIcon class="mx-auto size-3.5 shrink-0 {width > MIN_LABEL_PX ? 'mr-1' : ''}" />
  {/if}
</a>

<div class="hidden">
  <div bind:this={tooltipContent}>
    {#each lines as line (line)}
      <p>{line}</p>
    {/each}
    {#if active}
      <!-- Only reachable by tapping: a mouse goes to the page by clicking the bar itself -->
      <a
        class="mt-1 block font-medium underline decoration-stone-500 underline-offset-4"
        {href}
        tabindex="-1"
        onclick={event => onnavigate?.(event)}>Open {name}'s page →</a
      >
    {/if}
  </div>
</div>
