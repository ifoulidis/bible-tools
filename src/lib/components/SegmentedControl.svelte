<script lang="ts" generics="T extends string">
  let {
    options,
    value = $bindable(),
    label,
    name,
  }: {
    options: { value: T; label: string }[]
    value: T
    /** Accessible name for the group */
    label: string
    /** Shared by the radios; needs to be unique on the page */
    name: string
  } = $props()
</script>

<div
  class="flex w-fit gap-1 rounded-full border border-stone-200 bg-white p-1 shadow-sm"
  role="radiogroup"
  aria-label={label}
>
  {#each options as option (option.value)}
    <label
      class="cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium text-stone-600 transition-colors not-has-checked:hover:bg-stone-100 has-checked:bg-stone-800 has-checked:text-stone-50 has-checked:shadow-sm has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-stone-800"
    >
      <input
        class="pointer-events-none absolute opacity-0"
        type="radio"
        {name}
        value={option.value}
        bind:group={value}
      />
      {option.label}
    </label>
  {/each}
</div>
