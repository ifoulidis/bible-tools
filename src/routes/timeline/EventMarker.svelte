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
  let open = $derived(hovered || focused || tapped)

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

<!-- A flag on a pole: the pole stands on the event's year (the chart places this at it), with a dot
     at its foot, and the flag carries the name. Near the end of the chart the flag flies left -->
<button
  bind:this={marker}
  type="button"
  {style}
  class={[
    'group flex h-7 cursor-default items-start whitespace-nowrap focus-visible:outline-none',
    side === 'right' ? '-translate-x-px' : '-translate-x-[calc(100%-1px)] flex-row-reverse',
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
  <span class="relative mt-0.75 h-[calc(100%-0.375rem)] w-0.5 shrink-0 rounded-full {classes.pole}">
    <span
      class="absolute -bottom-0.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full {classes.pole}"
    ></span>
  </span>
  <span
    class={[
      'flag mt-0.75 flex h-4.5 items-center px-1.5 leading-none transition duration-150 group-hover:-translate-y-px group-focus-visible:outline-2 group-focus-visible:outline-offset-1 group-focus-visible:outline-stone-800',
      side === 'left' && 'flag-left',
      open && 'flag-raised -translate-y-px',
      classes.flag,
    ]}
  >
    {event.name}
  </span>
</button>

{#if tooltip}
  <Popover anchor={marker} {bounds} {open}>
    <Manuscript
      eyebrow={event.kind === 'bible' ? 'In the Bible' : 'In the world'}
      title={event.name}
    >
      <p class="italic">{year}{event.ref ? ` · ${event.ref}` : ''}</p>
      <p class="mt-1">{event.detail}</p>
    </Manuscript>
  </Popover>
{/if}
