<script lang="ts">
  type Link = { id: string; name: string }

  let {
    predecessor,
    successor,
    relation,
  }: { predecessor: Link | null; successor: Link | null; relation?: string } = $props()
</script>

<nav
  class="mb-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-full border border-stone-200 bg-white/60 px-5 py-2.5 text-sm"
  aria-label="Succession"
>
  <span>
    {#if predecessor}← <a class="link" href="/people/{predecessor.id}">{predecessor.name}</a>{/if}
  </span>
  {#if relation}
    <span class="text-stone-500">{relation}</span>
  {/if}
  <span class="text-right">
    {#if successor}<a class="link" href="/people/{successor.id}">{successor.name}</a> →{/if}
  </span>
</nav>
