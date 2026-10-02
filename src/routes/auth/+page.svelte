<script lang="ts">
  let { form } = $props()
</script>

<svelte:head>
  <title>Log in</title>
</svelte:head>

<div class="mx-auto my-12 max-w-sm px-4">
  <h1 class="mb-6 text-2xl font-bold">Log in</h1>

  <form method="POST" action="?/login" class="grid gap-4">
    <label class="grid gap-1">
      <span class="text-sm font-medium">Email</span>
      <input
        name="email"
        type="email"
        autocomplete="email"
        required
        value={form?.email ?? ''}
        class="rounded-lg border border-gray-300 px-3 py-2"
      />
    </label>
    <label class="grid gap-1">
      <span class="text-sm font-medium">Password</span>
      <input
        name="password"
        type="password"
        autocomplete="current-password"
        required
        minlength="8"
        class="rounded-lg border border-gray-300 px-3 py-2"
      />
    </label>

    {#if form?.message}
      <p class="text-sm text-red-700" role="alert">{form.message}</p>
    {/if}

    <div class="flex gap-3">
      <button class="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-700">
        Log in
      </button>
      <button
        formaction="?/signup"
        class="rounded-lg border border-gray-300 px-4 py-2 font-medium hover:bg-gray-50"
      >
        Sign up
      </button>
    </div>
  </form>
</div>
