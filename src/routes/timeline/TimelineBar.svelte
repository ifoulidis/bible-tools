<script lang="ts">
  import type { Action } from 'svelte/action'
  import type { MouseEventHandler } from 'svelte/elements'
  import tippy from 'tippy.js'
  import { type LaneId, type TimelineDating, formatSpan } from '$lib/timeline/layout'
  import { laneClasses } from './theme'

  /** Bars narrower than this drop their name rather than show a sliver of it */
  const MIN_LABEL_PX = 50

  interface Props {
    name: string
    dating: TimelineDating
    lane: LaneId
    href: string
    /** Drawn width in px; a coregency gets a lighter leading segment of `coregencyWidth` */
    width: number
    coregencyWidth?: number
    /** Faded back while another bar is highlighted */
    dimmed?: boolean
    /** Drawn wider than its true length, so it sits above the neighbour it may overlap */
    raised?: boolean
    onhoverchange?: (hovering: boolean) => void
    onclick?: MouseEventHandler<HTMLAnchorElement>
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
    dimmed = false,
    raised = false,
    onhoverchange,
    onclick,
    class: className = '',
    style,
  }: Props = $props()

  const span = $derived(formatSpan(dating))
  const tooltipText = $derived(
    `${name}: ${span}${dating.coregencyFrom ? ` (from ${dating.coregencyFrom} with overlap)` : ''}`,
  )

  const tooltip: Action<HTMLElement, string> = (node, content) => {
    const instance = tippy(node, { content, arrow: false })
    return {
      update: newContent => instance.setContent(newContent),
      destroy: () => instance.destroy(),
    }
  }
</script>

<a
  {href}
  {style}
  class={[
    'block h-5.5 overflow-hidden rounded-md bg-linear-to-r from-(length:--coregency) to-(length:--coregency) text-xs leading-5.5 font-medium text-white shadow-bar transition duration-150 hover:z-1 hover:-translate-y-px hover:shadow-bar-lifted hover:outline-2 hover:outline-offset-1 hover:outline-stone-800 focus-visible:z-1 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-stone-800',
    laneClasses[lane].bar,
    raised && 'z-1',
    dimmed && 'opacity-20',
    className,
  ]}
  style:width="{width}px"
  style:--coregency="{coregencyWidth}px"
  use:tooltip={tooltipText}
  aria-label="{name}, {span}"
  {onclick}
  onmouseenter={() => onhoverchange?.(true)}
  onmouseleave={() => onhoverchange?.(false)}
  onfocus={() => onhoverchange?.(true)}
  onblur={() => onhoverchange?.(false)}
  >{#if width > MIN_LABEL_PX}
    <span class="block overflow-hidden px-1.5 text-clip whitespace-nowrap">{name}</span>
  {/if}
</a>
