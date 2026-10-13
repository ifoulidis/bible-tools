export interface Box {
  top: number
  bottom: number
  left: number
  right: number
}

export interface Placement {
  top: number
  left: number
  side: 'above' | 'below'
}

/** Kept between the popover and what it points at */
export const POPOVER_GAP_PX = 6
/** Kept between the popover and the edge of the window */
const EDGE_PX = 8

/**
 * Where to put a popover of `size` for `anchor`, in the same (viewport) coordinates.
 *
 * Below the anchor if it fits there inside `bounds` (the chart); if not, above, taking whatever
 * room it needs even if that's outside the bounds. Only if above would run off the top of the
 * window and below wouldn't run off the bottom does it go below after all.
 *
 * It starts in line with the anchor's left edge, then shifts to stay inside the bounds and the
 * window, as far as it can.
 */
export function placePopover(
  anchor: Box,
  bounds: Box,
  size: { width: number; height: number },
  viewport: { width: number; height: number },
): Placement {
  const below = anchor.bottom + POPOVER_GAP_PX
  const above = anchor.top - POPOVER_GAP_PX - size.height

  let side: Placement['side'] = below + size.height <= bounds.bottom ? 'below' : 'above'
  if (side === 'above' && above < EDGE_PX && below + size.height <= viewport.height - EDGE_PX) {
    side = 'below'
  }

  // The window wins over the chart, as a popover cut off by the window can't be read at all
  const clamp = (left: number, min: number, max: number) =>
    max < min ? left : Math.min(Math.max(left, min), max)
  const inBounds = clamp(anchor.left, bounds.left, bounds.right - size.width)
  const left = clamp(inBounds, EDGE_PX, viewport.width - EDGE_PX - size.width)

  return { side, top: side === 'below' ? below : above, left }
}
