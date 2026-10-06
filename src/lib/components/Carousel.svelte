<script lang="ts" module>
  let nextId = 0
</script>

<script lang="ts">
  import type { Snippet } from 'svelte'

  let {
    slides,
    label,
    intervalMs = 10_000,
  }: {
    slides: { label: string; content: Snippet }[]
    /** Accessible name for the whole carousel */
    label: string
    intervalMs?: number
  } = $props()

  const id = `carousel-${nextId++}`

  let active = $state(0)
  /** Off for good once someone picks a slide themselves */
  let autoplay = $state(true)
  /** Held while the pointer or focus is on the slides, so nothing moves mid-read */
  let paused = $state(false)
  let tabs = $state<HTMLButtonElement[]>([])
  let touchStartX: number | undefined

  function choose(index: number) {
    autoplay = false
    active = (index + slides.length) % slides.length
  }

  // Arrow keys move along the switcher, as in any tab list
  function onTabKeydown(event: KeyboardEvent) {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key]
    if (step === undefined) return
    event.preventDefault()
    choose(active + step)
    tabs[active]?.focus()
  }

  // A sideways swipe on a phone counts as choosing a slide
  function onTouchEnd(event: TouchEvent) {
    const endX = event.changedTouches[0]?.clientX
    if (touchStartX === undefined || endX === undefined) return
    const distance = endX - touchStartX
    if (Math.abs(distance) > 60) choose(active + (distance < 0 ? 1 : -1))
    touchStartX = undefined
  }
</script>

<section aria-roledescription="carousel" aria-label={label}>
  <!-- Every slide sits in the same grid cell, so the carousel is as tall as its tallest slide -->
  <div
    class="grid"
    role="presentation"
    onmouseenter={() => (paused = true)}
    onmouseleave={() => (paused = false)}
    onfocusin={() => (paused = true)}
    onfocusout={() => (paused = false)}
    ontouchstart={event => (touchStartX = event.touches[0]?.clientX)}
    ontouchend={onTouchEnd}
  >
    {#each slides as slide, i (slide.label)}
      <div
        id="{id}-slide-{i}"
        class="col-start-1 row-start-1 transition duration-700 ease-out motion-reduce:translate-x-0 motion-reduce:transition-none {i ===
        active
          ? 'opacity-100'
          : `pointer-events-none opacity-0 ${i < active ? '-translate-x-6' : 'translate-x-6'}`}"
        role="tabpanel"
        aria-roledescription="slide"
        aria-label="{i + 1} of {slides.length}: {slide.label}"
        inert={i !== active}
      >
        {@render slide.content()}
      </div>
    {/each}
  </div>

  <div class="mt-6 flex justify-center gap-6 sm:gap-8" role="tablist" aria-label="Choose a slide">
    {#each slides as slide, i (slide.label)}
      <button
        bind:this={tabs[i]}
        class="group flex min-w-20 flex-col items-center gap-2 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-800 {i ===
        active
          ? 'text-stone-900'
          : 'text-stone-400 hover:text-stone-700'}"
        role="tab"
        aria-selected={i === active}
        aria-controls="{id}-slide-{i}"
        tabindex={i === active ? 0 : -1}
        onclick={() => choose(i)}
        onkeydown={onTabKeydown}
      >
        {slide.label}
        <span class="block h-0.5 w-full overflow-hidden rounded-full bg-stone-200">
          {#if i === active}
            {#if autoplay}
              <!-- The fill's animation is the timer: it pauses with the slides and moves on when full -->
              {#key active}
                <span
                  class="progress block h-full origin-left bg-stone-800"
                  style:animation-duration="{intervalMs}ms"
                  style:animation-play-state={paused ? 'paused' : 'running'}
                  onanimationend={() => (active = (active + 1) % slides.length)}
                ></span>
              {/key}
            {:else}
              <span class="block h-full bg-stone-800"></span>
            {/if}
          {/if}
        </span>
      </button>
    {/each}
  </div>
</section>

<style>
  .progress {
    animation-name: fill;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }
  @keyframes fill {
    from {
      transform: scaleX(0);
    }
  }
</style>
