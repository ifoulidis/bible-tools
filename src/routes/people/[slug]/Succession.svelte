<script lang="ts">
  type Link = { id: string; name: string }

  let {
    predecessor,
    successor,
    relation,
  }: { predecessor: Link | null; successor: Link | null; relation?: string } = $props()
</script>

<nav class="mb-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4" aria-label="Succession">
  <span>
    {#if predecessor}← <a class="text-blue-700 underline" href="/people/{predecessor.id}"
        >{predecessor.name}</a
      >{/if}
  </span>
  {#if relation}
    <span class="text-gray-500">{relation}</span>
  {/if}
  <span class="text-right">
    {#if successor}<a class="text-blue-700 underline" href="/people/{successor.id}"
        >{successor.name}</a
      > →{/if}
  </span>
</nav>
