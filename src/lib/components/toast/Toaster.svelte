<script lang="ts">
  import { fly } from 'svelte/transition'

  import { type ToastTone, dismissToast, toasts } from './toast.svelte'

  const toneClasses: Record<ToastTone, string> = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-stone-800 text-stone-50',
  }
</script>

<div
  class="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-4"
  role="status"
  aria-live="polite"
>
  {#each toasts as toast (toast.id)}
    <button
      class="pointer-events-auto rounded-full px-5 py-2 text-sm font-semibold shadow-lg {toneClasses[
        toast.tone
      ]}"
      transition:fly={{ y: 16, duration: 200 }}
      onclick={() => dismissToast(toast.id)}
    >
      {toast.message}
    </button>
  {/each}
</div>
