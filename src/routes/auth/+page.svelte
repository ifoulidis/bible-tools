<script lang="ts">
  let { form } = $props()
</script>

<svelte:head>
  <title>Log in</title>
</svelte:head>

<div class="mx-auto my-16 max-w-sm px-4">
  <div class="card p-8">
    <p class="eyebrow">Welcome</p>
    <h1 class="mt-2 mb-6 text-3xl font-semibold">Log in</h1>

    <form method="POST" action="?/login" class="grid gap-4">
      <label class="grid gap-1.5">
        <span class="text-sm font-medium text-stone-700">Email</span>
        <input
          name="email"
          type="email"
          autocomplete="email"
          required
          value={form?.email ?? ''}
          class="field"
        />
      </label>
      <label class="grid gap-1.5">
        <span class="text-sm font-medium text-stone-700">Password</span>
        <input
          name="password"
          type="password"
          autocomplete="current-password"
          required
          minlength="8"
          class="field"
        />
      </label>

      {#if form?.message}
        <p class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {form.message}
        </p>
      {/if}

      <div class="mt-2 flex gap-3">
        <button class="btn btn-primary">Log in</button>
        <button formaction="?/signup" class="btn btn-secondary">Sign up</button>
      </div>
    </form>
  </div>
</div>
