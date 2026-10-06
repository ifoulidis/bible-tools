<script lang="ts">
  // Israel's first kings as a quiz in progress, coloured as the memorise page colours them
  const chain = [
    ['Jeroboam I', 'border-emerald-200 bg-emerald-50 text-emerald-800'],
    ['Nadab', 'border-emerald-200 bg-emerald-50 text-emerald-800'],
    ['Baasha', 'border-amber-200 bg-amber-50 text-amber-800'],
    ['Elah', 'border-emerald-200 bg-emerald-50 text-emerald-800'],
    ['Zimri', 'border-red-200 bg-red-50 text-red-800'],
    ['Omri', 'border-emerald-200 bg-emerald-50 text-emerald-800'],
  ]
</script>

<div class="grid items-center gap-10 md:grid-cols-[1.1fr_1fr] md:gap-12">
  <div>
    <p class="eyebrow">Memorise</p>
    <h2 class="mt-3 text-4xl leading-[1.05] font-semibold text-balance sm:text-5xl md:text-6xl">
      Learn the kings <em class="text-primary-700">in order</em>
    </h2>
    <p class="mt-6 max-w-[48ch] text-lg text-stone-600">
      Name each king of Israel or Judah in turn. Slip up and you'll see who really came next, with
      typos spelled out letter by letter.
    </p>
    <div class="mt-8">
      <a href="/memorise" class="btn btn-primary">
        Start memorising
        <span aria-hidden="true">→</span>
      </a>
    </div>
  </div>

  <!-- A still of the quiz, mid-answer -->
  <div class="card relative p-6" aria-hidden="true">
    <div class="flex flex-wrap gap-1.5 text-xs">
      {#each chain as [name, classes] (name)}
        <span class="rounded-full border px-2.5 py-0.5 font-medium {classes}">{name}</span>
      {/each}
      <span
        class="rounded-full border-2 border-dashed border-israel px-2.5 py-0.5 font-semibold text-israel"
        >?</span
      >
    </div>
    <p class="mt-5 font-display text-2xl font-semibold text-stone-900">
      Who reigned after <span class="text-israel">Omri</span>?
    </p>
    <div class="mt-4 flex gap-2">
      <span class="field flex-1 text-stone-800">Ahab<span class="caret">|</span></span>
      <span class="btn btn-primary px-4">Check</span>
    </div>
    <span
      class="absolute -bottom-3.5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-lg"
      >Correct</span
    >
  </div>
</div>

<style>
  .caret {
    margin-left: 1px;
    font-weight: 300;
    color: var(--color-stone-400);
  }
  @media (prefers-reduced-motion: no-preference) {
    .caret {
      animation: blink 1.1s steps(1) infinite;
    }
  }
  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
</style>
