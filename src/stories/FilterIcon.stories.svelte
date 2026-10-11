<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import FilterIcon from '../routes/timeline/FilterIcon.svelte'
  import { filterLabels } from '../routes/timeline/theme'

  const { Story } = defineMeta({
    title: 'Timeline/FilterIcon',
    component: FilterIcon,
    tags: ['autodocs'],
    argTypes: { filter: { control: 'inline-radio', options: ['everyone', 'kings', 'prophets'] } },
    args: { filter: 'kings', class: 'size-10 text-stone-700' },
  })
</script>

<Story name="Kings" />

<!-- The three side by side, at the size the phone's full screen rail uses -->
<Story name="All three">
  {#snippet template()}
    <div class="flex gap-6 text-stone-700">
      {#each ['everyone', 'kings', 'prophets'] as const as filter (filter)}
        <figure class="grid justify-items-center gap-2 text-sm">
          <FilterIcon {filter} class="size-5" />
          <figcaption>{filterLabels[filter]}</figcaption>
        </figure>
      {/each}
    </div>
  {/snippet}
</Story>
