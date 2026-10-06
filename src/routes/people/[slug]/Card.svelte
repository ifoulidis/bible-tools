<script lang="ts">
  import type { Snippet } from 'svelte'

  let { title, children }: { title: string; children: Snippet } = $props()
</script>

<section class="card mb-5 p-6">
  <h2 class="mb-4 text-2xl font-semibold">{title}</h2>
  {@render children()}
</section>
