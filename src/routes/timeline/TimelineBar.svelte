<script lang="ts">
  import Popover from '$lib/components/Popover.svelte'
  import { type LaneId, type TimelineDating, formatSpan } from '$lib/timeline/layout'
  import BarDetails from './BarDetails.svelte'
  import SteleIcon from './SteleIcon.svelte'
  import { type PointerType, barClick, parsePointerType } from './interaction'
  import { laneClasses } from './theme'

  /**
   * Bars narrower than this drop their name rather than show a sliver of it, and the badge goes
   * with it, as a badge alone doesn't say whose it is. The tooltip still names the find
   */
  const MIN_LABEL_PX = 50

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
    altNames?: string[]
    /**
     * Tapped once on a touch screen: the tooltip stays open, and the next tap on the bar or the
     * tooltip goes to their page. A tap anywhere else clears it.
     */
    active?: boolean
    onactivechange?: (active: boolean) => void
    /**
     * Show details in a floating popover. Off where the chart shows them itself, as it does when
     * turned sideways with CSS, which the popover can't follow
     */
    tooltip?: boolean
    /** The popover goes below the bar if it fits inside this (the chart), and above if not */
    bounds?: HTMLElement
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
    altNames = [],
    active = false,
    onactivechange,
    tooltip = true,
    bounds,
    dimmed = false,
    raised = false,
    onhoverchange,
    onnavigate,
    class: className = '',
    style,
  }: Props = $props()

  const span = $derived(formatSpan(dating))

  let hovered = $state(false)
  let focused = $state(false)
  let showTooltip = $derived(active || hovered || focused)

  /** What pressed the bar last, so its click knows whether it was a tap */
  let pointer: PointerType = null

  let bar = $state<HTMLAnchorElement>()

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
      if (!(event.target instanceof Element)) return
      if (bar?.contains(event.target) || event.target.closest('[data-bar-details]')) return
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
    {#if attestedBy.length > 0}
      <SteleIcon class="mr-1 size-3.5 shrink-0" />
    {/if}
  {/if}
</a>

{#if tooltip}
  <!-- Only a tapped bar's popover has a link to tap; a hovered one stays out of the mouse's way -->
  <Popover anchor={bar} {bounds} open={showTooltip} interactive={active}>
    <BarDetails
      {name}
      {lane}
      {span}
      coregencyFrom={dating.coregencyFrom}
      {altNames}
      {attestedBy}
      {href}
      showLink={active}
      {onnavigate}
    />
  </Popover>
{/if}
