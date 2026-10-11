<script lang="ts">
  let { class: className = '' }: { class?: string } = $props()
</script>

<!-- A round-topped stone with lines of inscription, marking someone named outside the Bible -->
<svg class={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
  <path
    d="M3.5 14.5V6a4.5 4.5 0 0 1 9 0v8.5z"
    fill="currentColor"
    fill-opacity="0.25"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linejoin="round"
  />
  <path
    d="M6 7h4M6 9.5h4M6 12h2.5"
    stroke="currentColor"
    stroke-width="1.25"
    stroke-linecap="round"
  />
</svg>
