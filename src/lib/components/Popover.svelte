<script lang="ts">
  import type { Snippet } from 'svelte'
  import { fade } from 'svelte/transition'
  import { type Placement, placePopover } from '$lib/utility/placement'

  interface Props {
    /** What it points at */
    anchor: HTMLElement | undefined
    /** What it tries to fit inside, such as a scrolling chart; the window if left out */
    bounds?: HTMLElement
    open: boolean
    /** Can be hovered and clicked, for when it holds a link */
    interactive?: boolean
    children: Snippet
  }

  let { anchor, bounds, open, interactive = false, children }: Props = $props()

  let popover = $state<HTMLDivElement>()
  /** Unset until it's been measured, so it never flashes up in the wrong place */
  let placement = $state<Placement>()

  function update() {
    if (!anchor || !popover) return
    const viewport = { width: window.innerWidth, height: window.innerHeight }
    const within = bounds?.getBoundingClientRect() ?? {
      top: 0,
      left: 0,
      bottom: viewport.height,
      right: viewport.width,
    }
    placement = placePopover(
      anchor.getBoundingClientRect(),
      within,
      { width: popover.offsetWidth, height: popover.offsetHeight },
      viewport,
    )
  }

  $effect(() => {
    if (!open || !anchor || !popover) {
      placement = undefined
      return
    }
    update()
    // Fixed to the window, so it has to follow the anchor when anything scrolls
    const resized = new ResizeObserver(update)
    resized.observe(popover)
    window.addEventListener('scroll', update, { capture: true, passive: true })
    window.addEventListener('resize', update)
    return () => {
      resized.disconnect()
      window.removeEventListener('scroll', update, { capture: true })
      window.removeEventListener('resize', update)
    }
  })
</script>

{#if open}
  <!-- Fixed rather than absolute so the chart's scrolling can't clip it -->
  <div
    bind:this={popover}
    class={[
      'fixed top-0 left-0 z-50 w-max max-w-72',
      !interactive && 'pointer-events-none',
      !placement && 'invisible',
    ]}
    style:translate={placement ? `${placement.left}px ${placement.top}px` : undefined}
    data-side={placement?.side}
    role="tooltip"
    transition:fade={{ duration: 120 }}
  >
    {@render children()}
  </div>
{/if}
