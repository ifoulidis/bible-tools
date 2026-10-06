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
