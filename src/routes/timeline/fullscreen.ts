/**
 * "native" uses the browser's Fullscreen API. Where that isn't available (iPhones only allow it
 * for video) or is refused, "overlay" covers the window instead
 */
export type Fullscreen = 'off' | 'native' | 'overlay'

/**
 * How the timeline page is laid out:
 * - "page": the normal page
 * - "wide": full screen on a computer or tablet, with the controls on top and the legend below
 * - "phone": full screen on a phone held sideways: just the chart, with a rail of controls beside it
 * - "phone-rotated": the same, turned sideways with CSS while the phone is held upright, for when
 *   the browser can't lock the screen to landscape (iPhones can't)
 */
export type FullscreenLayout = 'page' | 'wide' | 'phone' | 'phone-rotated'

export function fullscreenLayout(
  fullscreen: Fullscreen,
  { phone, portrait }: { phone: boolean; portrait: boolean },
): FullscreenLayout {
  if (fullscreen === 'off') return 'page'
  if (!phone) return 'wide'
  return portrait ? 'phone-rotated' : 'phone'
}

/** A touch screen small in at least one direction, so a phone in either orientation */
export const PHONE_QUERY =
  '(pointer: coarse) and (max-width: 640px), (pointer: coarse) and (max-height: 500px)'
