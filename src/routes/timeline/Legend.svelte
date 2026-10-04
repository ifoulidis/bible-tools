<script lang="ts">
  const keyDisplayClasses = [
    ['bg-united', 'United kingdom'],
    ['bg-israel', 'Israel'],
    ['bg-judah', 'Judah'],
    ['bg-prophets', 'Prophet'],
  ]
</script>

<div class="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
  <!-- TODO: coregency one should show the three different light colours, divided among the space. -->
  <!-- TODO: approximate should be hard borders on each end, but of the appropriate colour. -->
  {#each keyDisplayClasses as [swatch, label] (label)}
    <span><i class="mr-1.5 inline-block h-3 w-6 rounded-sm align-middle {swatch}"></i>{label}</span>
  {/each}
</div>
