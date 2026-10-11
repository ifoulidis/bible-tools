<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, within } from 'storybook/test'
  import Toaster from '$lib/components/toast/Toaster.svelte'
  import { type ToastTone, showToast } from '$lib/components/toast/toast.svelte'

  const tones: ToastTone[] = ['success', 'error', 'info']

  const { Story } = defineMeta({
    title: 'Feedback/Toaster',
    component: Toaster,
    tags: ['autodocs'],
  })
</script>

<!-- Toasts come from showToast anywhere in the app; these buttons stand in for that -->
<Story
  name="Tones"
  play={async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'success' }))
    await expect(await within(document.body).findByText('A success toast')).toBeVisible()
  }}
>
  {#snippet template()}
    <div class="flex gap-3">
      {#each tones as tone (tone)}
        <button class="btn btn-secondary" onclick={() => showToast(`A ${tone} toast`, tone, 4000)}
          >{tone}</button
        >
      {/each}
    </div>
    <Toaster />
  {/snippet}
</Story>
