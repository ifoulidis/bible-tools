<script lang="ts">
  import tippy from 'tippy.js'
  import type { TimelineEvent } from '$lib/data/events'
  import { formatYear } from '$lib/timeline/layout'
  import { eventClasses } from './theme'

  interface Props {
    event: TimelineEvent
    /** Which side of the marker the name goes */
    side?: 'left' | 'right'
    /** Show the details in a floating tooltip; off where the chart is turned sideways with CSS */
    tooltip?: boolean
    class?: string
    style?: string
  }

  let { event, side = 'right', tooltip = true, class: className = '', style }: Props = $props()

  const year = $derived(formatYear(event))
  const classes = $derived(eventClasses[event.kind])

  let marker = $state<HTMLButtonElement>()
  /** Rendered here, then handed to tippy, which moves it into the tooltip */
  let tooltipContent = $state<HTMLDivElement>()

  $effect(() => {
    if (!tooltip || !marker || !tooltipContent) return
    // Tippy's own triggers will do: there's nowhere to go, so a tap only has to show the details
    const created = tippy(marker, {
      content: tooltipContent,
      arrow: false,
      appendTo: () => document.fullscreenElement ?? document.body,
    })
    return () => created.destroy()
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
>
  <!-- Centred on the event's year: the marker is 10px wide and placed 5px before it -->
  <span class="size-2.5 shrink-0 rotate-45 rounded-[2px] {classes.marker}"></span>
  {event.name}
</button>

{#if tooltip}
  <div class="hidden">
    <div bind:this={tooltipContent} class="max-w-64 py-0.5">
      <p class="font-semibold">{event.name}</p>
      <p class="text-stone-300">{year}{event.ref ? ` · ${event.ref}` : ''}</p>
      <p class="mt-1">{event.detail}</p>
    </div>
  </div>
{/if}
