<script lang="ts">
  import type { Snippet } from 'svelte'

  let { title, children }: { title: string; children: Snippet } = $props()
</script>

<section class="mb-5 rounded-lg border border-gray-200 p-5">
  <h2 class="mb-3 text-xl font-semibold">{title}</h2>
  {@render children()}
</section>
