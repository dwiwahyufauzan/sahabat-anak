<script lang="ts">
  import { activeFilter } from '$lib/stores/filter';
  import { programDetails } from '$lib/data/programs';
  import ProgramCard from './ProgramCard.svelte';
    
  $: filteredPrograms = $activeFilter === 'all' 
    ? programDetails 
    : programDetails.filter(p => p.category === $activeFilter);
</script>

<section class="py-10 sm:py-12 md:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-background-light">
    <div class="max-w-280 mx-auto">
        <!-- Section Header -->
        <div class="flex flex-col md:flex-row justify-between items-end gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10 md:mb-12">
            <div class="max-w-xl">
                <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-text-main mb-3 sm:mb-4">Program Unggulan</h2>
                <p class="text-text-sub text-sm sm:text-base md:text-lg">
                    Fokus utama kami dalam menciptakan dampak positif yang berkelanjutan bagi anak-anak marjinal.
                </p>
            </div>
            
            <!-- Decorative Icon -->
            <div class="hidden md:block">
                <span class="material-symbols-outlined text-primary/20 text-6xl rotate-12">diversity_1</span>
            </div>
        </div>
        
        <!-- Program Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8 lg:gap-10">
            {#each programDetails as program (program.id)}
                <ProgramCard {program} />
            {/each}
        </div>
    </div>
</section>