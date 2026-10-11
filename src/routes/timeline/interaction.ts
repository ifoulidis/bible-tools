/** `PointerEvent.pointerType`, or null for a click with no pointer, such as Enter on a focused link */
export type PointerType = 'mouse' | 'pen' | 'touch' | null

export type BarClick = 'navigate' | 'activate'

/**
 * What a click on a timeline bar should do. A mouse has hover to show the tooltip, so its click
 * goes straight to the person's page. A finger or pen doesn't, so the first tap activates the bar
 * and shows its tooltip instead, and a tap on a bar that's already active goes through.
 */
export function barClick(pointer: PointerType, active: boolean): BarClick {
  if (active) return 'navigate'
  return pointer === 'touch' || pointer === 'pen' ? 'activate' : 'navigate'
}

/** Narrows `PointerEvent.pointerType`, which browsers may report as "" or something new */
export function parsePointerType(value: string): PointerType {
  return value === 'mouse' || value === 'pen' || value === 'touch' ? value : null
}

/** The lines of a bar's tooltip: "Ahab: 874–853 BC", then any finds that name them */
export function tooltipLines(
  name: string,
  span: string,
  coregencyFrom: number | undefined,
  attestedBy: string[],
): string[] {
  const overlap = coregencyFrom ? ` (from ${coregencyFrom} with overlap)` : ''
  return [
    `${name}: ${span}${overlap}`,
    ...(attestedBy.length > 0 ? [`Named outside the Bible: ${attestedBy.join('; ')}`] : []),
  ]
}
