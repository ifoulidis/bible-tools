<script lang="ts">
  import { onMount } from 'svelte'

  import { appearance, loadSettings, saveSettings, settings } from '$lib/bible/settings.svelte'
  import { readTheme, themeCookieString } from '$lib/bible/theme'

  let { children } = $props()

  let loaded = $state(false)

  onMount(() => {
    loadSettings()
    appearance.theme = readTheme(document.cookie)
    loaded = true
    // The rest of the site keeps its own colours
    return () => {
      delete document.documentElement.dataset.theme
    }
  })

  // Saving before loading would overwrite what was saved with the defaults
  $effect(() => {
    if (!loaded) return
    // Read every setting, so a change to any of them saves
    void JSON.stringify(settings)
    saveSettings()
  })

  $effect(() => {
    if (!loaded) return
    document.documentElement.dataset.theme = appearance.theme
    document.cookie = themeCookieString(appearance.theme)
  })
</script>

{@render children()}
