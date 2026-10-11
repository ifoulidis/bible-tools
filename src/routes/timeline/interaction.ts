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
