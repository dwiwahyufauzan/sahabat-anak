<script>
  import { activeCategory } from '$lib/stores/newsFilter';
  import { categories } from '$lib/data/news';
</script>

<section class="mb-8">
  <div class="flex gap-3 overflow-x-auto pb-4 no-scrollbar items-center">
    {#each categories as category}
      <button 
        class="flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-2.5 transition-all text-sm font-bold
          {$activeCategory === category.value 
            ? 'bg-[#111518] text-white shadow-md' 
            : 'bg-white border border-[#e0e0e0] hover:border-primary hover:text-primary text-[#617989] hover:shadow-md'}"
        on:click={() => activeCategory.set(category.value)}
      >
        <span class="material-symbols-outlined text-[20px]">{category.icon}</span>
        <span>{category.name}</span>
      </button>
    {/each}
  </div>
</section>
