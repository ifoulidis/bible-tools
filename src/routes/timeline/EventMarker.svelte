<script lang="ts">
  import Manuscript from '$lib/components/Manuscript.svelte'
  import Popover from '$lib/components/Popover.svelte'
  import type { TimelineEvent } from '$lib/data/events'
  import { formatYear } from '$lib/timeline/layout'
  import { eventClasses } from './theme'

  interface Props {
    event: TimelineEvent
    /** Which side of the marker the name goes */
    side?: 'left' | 'right'
    /** Show the details in a popover; off where the chart is turned sideways with CSS */
    tooltip?: boolean
    /** The popover goes below the marker if it fits inside this (the chart), and above if not */
    bounds?: HTMLElement
    class?: string
    style?: string
  }

  let {
    event,
    side = 'right',
    tooltip = true,
    bounds,
    class: className = '',
    style,
  }: Props = $props()

  const year = $derived(formatYear(event))
  const classes = $derived(eventClasses[event.kind])

  let marker = $state<HTMLButtonElement>()
  let hovered = $state(false)
  let focused = $state(false)
  /** Tapped open on a touch screen, until a tap anywhere else */
  let tapped = $state(false)

  $effect(() => {
    if (!tapped) return
    const clearOutside = (pointer: PointerEvent) => {
      if (pointer.target instanceof Node && marker?.contains(pointer.target)) return
      tapped = false
    }
    document.addEventListener('pointerdown', clearOutside)
    return () => document.removeEventListener('pointerdown', clearOutside)
  })
</script>

<button
  bind:this={marker}
  type="button"
  {style}
  class={[
    'flex h-7 cursor-default items-center gap-1.5 rounded-sm text-xs leading-none font-medium whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-stone-800',
    side === 'left' && '-translate-x-full flex-row-reverse',
    classes.label,
    className,
  ]}
  aria-label="{event.name}, {year}"
  onpointerenter={pointer => {
    if (pointer.pointerType === 'mouse') hovered = true
  }}
  onpointerleave={pointer => {
    if (pointer.pointerType === 'mouse') hovered = false
  }}
  onpointerup={pointer => {
    if (pointer.pointerType !== 'mouse') tapped = !tapped
  }}
  onfocus={focus => {
    // A tap can focus a button too; only the keyboard should open the popover this way
    if (focus.currentTarget.matches(':focus-visible')) focused = true
  }}
  onblur={() => (focused = false)}
>
  <!-- Centred on the event's year: the marker is 10px wide and placed 5px before it -->
  <span class="size-2.5 shrink-0 rotate-45 rounded-xs {classes.marker}"></span>
  {event.name}
</button>

{#if tooltip}
  <Popover anchor={marker} {bounds} open={hovered || focused || tapped}>
    <Manuscript
      eyebrow={event.kind === 'bible' ? 'In the Bible' : 'In the world'}
      title={event.name}
    >
      <p class="italic">{year}{event.ref ? ` · ${event.ref}` : ''}</p>
      <p class="mt-1">{event.detail}</p>
    </Manuscript>
  </Popover>
{/if}
