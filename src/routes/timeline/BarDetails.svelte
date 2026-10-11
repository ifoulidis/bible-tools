<script lang="ts">
  let {
    name,
    lines,
    href,
    showLink,
    onnavigate,
  }: {
    name: string
    lines: string[]
    href: string
    /** Only when tapped open: a mouse goes to the page by clicking the bar itself */
    showLink: boolean
    onnavigate?: (event: MouseEvent) => void
  } = $props()
</script>

<!-- What a bar's tooltip or callout says. The data attribute lets an active bar tell a tap on its
     details from a tap elsewhere, which would close them -->
<div data-bar-details>
  {#each lines as line (line)}
    <p>{line}</p>
  {/each}
  {#if showLink}
    <a
      class="mt-1 block font-medium underline decoration-stone-500 underline-offset-4"
      {href}
      tabindex="-1"
      onclick={event => onnavigate?.(event)}>Open {name}'s page →</a
    >
  {/if}
</div>
