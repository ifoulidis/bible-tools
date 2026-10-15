import type { EventKind } from '$lib/data/events'
import type { LaneId } from '$lib/timeline/layout'

// Full class names so Tailwind can see them; picked per lane instead of overriding a variable
export const laneClasses: Record<
  LaneId,
  { label: string; stripe: string; bar: string; dark: string }
> = {
  united: {
    label: 'text-united',
    stripe: 'bg-united',
    bar: 'from-united-light to-united shadow-united-dark',
    dark: 'united-dark',
  },
  israel: {
    label: 'text-israel',
    stripe: 'bg-israel',
    bar: 'from-israel-light to-israel shadow-israel-dark',
    dark: 'israel-dark',
  },
  judah: {
    label: 'text-judah',
    stripe: 'bg-judah',
    bar: 'from-judah-light to-judah shadow-judah-dark',
    dark: 'judah-dark',
  },
  prophets: {
    label: 'text-prophets',
    stripe: 'bg-prophets',
    bar: 'from-prophets-light to-prophets shadow-prophets-dark',
    dark: 'prophets-dark',
  },
}

export type Filter = 'everyone' | 'kings' | 'prophets'

export const filterLabels: Record<Filter, string> = {
  everyone: 'Everyone',
  kings: 'Kings',
  prophets: 'Prophets',
}

export const filterLanes: Record<Filter, LaneId[]> = {
  everyone: ['united', 'israel', 'judah', 'prophets'],
  kings: ['united', 'israel', 'judah'],
  prophets: ['prophets'],
}

// Soft tints for the checked filter button, kept clear of the lane colours so they read as background
export const filterClasses: Record<Filter, string> = {
  everyone: 'has-checked:bg-slate-200 has-checked:text-slate-900',
  kings: 'has-checked:bg-teal-100 has-checked:text-teal-900',
  prophets: 'has-checked:bg-lime-100 has-checked:text-lime-900',
}

/**
 * Each event is a flag on a pole standing on its year. The Bible's are vellum banners with a
 * swallowtail, a red pole and the manuscript face, like the popovers; the world's are plain white
 * tags on a grey pole. Neither uses
 * a lane colour, so they don't read as another kingdom
 */
export const eventClasses: Record<
  EventKind,
  { label: string; stripe: string; pole: string; flag: string }
> = {
  bible: {
    label: 'text-rubric',
    stripe: 'bg-rubric',
    pole: 'bg-rubric',
    flag: 'banner bg-vellum font-manuscript text-[0.8rem] text-ink',
  },
  world: {
    label: 'text-stone-500',
    stripe: 'bg-stone-400',
    pole: 'bg-stone-400',
    flag: 'tag border border-stone-300 bg-white text-[0.7rem] font-medium text-stone-600 shadow-sm',
  },
}

export const eventLabels: Record<EventKind, string> = {
  bible: 'Events',
  world: 'World',
}
