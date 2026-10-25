<script lang="ts">
  import { onMount } from 'svelte'

  import { loadSettings, saveSettings, settings } from '$lib/bible/settings.svelte'

  let { children } = $props()

  let loaded = $state(false)

  onMount(() => {
    loadSettings()
    loaded = true
  })

  // Saving before loading would overwrite what was saved with the defaults
  $effect(() => {
    if (!loaded) return
    // Read every setting, so a change to any of them saves
    void JSON.stringify(settings)
    saveSettings()
  })
</script>

{@render children()}
