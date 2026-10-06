<script lang="ts">
  const keyDisplayClasses = [
    ['bg-united', 'United kingdom'],
    ['bg-israel', 'Israel'],
    ['bg-judah', 'Judah'],
    ['bg-prophets', 'Prophet'],
  ]
</script>

<div class="mt-4 flex flex-wrap gap-x-5 gap-y-2 px-1 text-sm text-stone-600">
  <!-- TODO: coregency one should show the three different light colours, divided among the space. -->
  <!-- TODO: approximate should be hard borders on each end, but of the appropriate colour. -->
  {#each keyDisplayClasses as [swatch, label] (label)}
    <span class="inline-flex items-center gap-2"
      ><i class="inline-block h-3 w-6 rounded-full shadow-sm {swatch}"></i>{label}</span
    >
  {/each}
</div>
