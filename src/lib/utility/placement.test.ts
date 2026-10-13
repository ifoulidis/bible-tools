import { describe, expect, it } from 'vitest'

import { POPOVER_GAP_PX, placePopover } from './placement'

const box = (top: number, left: number, height: number, width: number) => ({
  top,
  bottom: top + height,
  left,
  right: left + width,
})

const chart = box(100, 50, 400, 800)
const viewport = { width: 1000, height: 800 }
const size = { width: 200, height: 120 }

describe('placePopover', () => {
  it('goes below when there is room in the chart', () => {
    const anchor = box(150, 100, 22, 80)
    expect(placePopover(anchor, chart, size, viewport)).toEqual({
      side: 'below',
      top: anchor.bottom + POPOVER_GAP_PX,
      left: 100,
    })
  })

  it('goes above when there is no room below in the chart', () => {
    const anchor = box(400, 100, 22, 80)
    expect(placePopover(anchor, chart, size, viewport)).toMatchObject({
      side: 'above',
      top: 400 - POPOVER_GAP_PX - size.height,
    })
  })

  it('stays above even when that takes it outside the chart', () => {
    // Room for neither, inside a short chart: above, spilling over its top edge
    const shortChart = box(300, 50, 60, 800)
    const anchor = box(320, 100, 22, 80)
    const placed = placePopover(anchor, shortChart, size, viewport)
    expect(placed.side).toBe('above')
    expect(placed.top).toBeLessThan(shortChart.top)
  })

  it('goes below after all if above would run off the top of the window', () => {
    const topChart = box(0, 50, 60, 800)
    const anchor = box(20, 100, 22, 80)
    expect(placePopover(anchor, topChart, size, viewport).side).toBe('below')
  })

  it('shifts left to stay inside the chart', () => {
    const anchor = box(150, 780, 22, 60)
    expect(placePopover(anchor, chart, size, viewport).left).toBe(chart.right - size.width)
  })

  it("starts at the chart's left edge for a bar scrolled partly out of view", () => {
    const anchor = box(150, -40, 22, 200)
    expect(placePopover(anchor, chart, size, viewport).left).toBe(chart.left)
  })

  it('keeps inside the window when the chart is wider than it', () => {
    const wideChart = box(100, -500, 400, 3000)
    const anchor = box(150, 950, 22, 80)
    expect(placePopover(anchor, wideChart, size, viewport).left).toBe(1000 - 8 - size.width)
  })
})
