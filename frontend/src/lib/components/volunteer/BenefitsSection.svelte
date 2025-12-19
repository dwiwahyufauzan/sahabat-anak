<script>
  import { benefits } from '$lib/data/volunteer';
  import BenefitCard from '../shared/BenefitCard.svelte';
</script>

<section class="w-full max-w-360 px-4 md:px-10 py-16 md:py-24 relative overflow-hidden">
  <div class="absolute -left-20 top-20 w-96 h-96 bg-sky-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -z-10"></div>
  <div class="absolute -right-20 bottom-20 w-96 h-96 bg-orange-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -z-10"></div>

  <div class="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
    <div class="flex flex-col gap-6 lg:w-1/3">
      <div class="inline-flex items-center gap-2 text-orange-400 font-extrabold uppercase tracking-widest text-xs">
        <span class="material-symbols-outlined text-xl">verified</span>
        Kenapa Bergabung?
      </div>

      <h2 class="text-text-main text-4xl md:text-5xl font-black leading-tight">
        Keuntungan Menjadi Relawan
      </h2>

      <p class="text-text-muted text-lg leading-relaxed font-medium">
        Dapatkan pengalaman berharga, teman baru, dan kepuasan batin sambil berbagi kebaikan dengan anak-anak yang membutuhkan.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:w-2/3">
      {#each benefits as benefit (benefit.id)}
        <div class:md:col-span-2={benefit.id === 3} class:lg:col-span-1={benefit.id === 3}>
          <BenefitCard {benefit} />
        </div>
      {/each}
    </div>
  </div>
</section>
