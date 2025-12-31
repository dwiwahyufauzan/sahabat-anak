<script lang="ts">
  import { onMount } from 'svelte';
  import { activeFilter } from '$lib/stores/filter';
  import ProgramCard from './ProgramCard.svelte';
  import { getImageUrl } from '$lib/utils/image';
    
  let programs: any[] = [];
  let loading = true;
  let error = '';
  
  $: filteredPrograms = $activeFilter === 'all' 
    ? programs 
    : programs.filter(p => p.category === $activeFilter);

  onMount(async () => {
    try {
      const response = await fetch('http://localhost:3000/api/programs');
      if (!response.ok) {
        throw new Error('Gagal memuat program');
      }
      const data = await response.json();
      
      // Transform data to include full image URLs
      programs = data.map((program: any) => ({
        ...program,
        image: getImageUrl(program.image),
        // Parse JSON fields if they're strings
        locations: typeof program.locations === 'string' ? JSON.parse(program.locations || '[]') : (program.locations || []),
        objectives: typeof program.objectives === 'string' ? JSON.parse(program.objectives || '[]') : (program.objectives || []),
        activities: typeof program.activities === 'string' ? JSON.parse(program.activities || '[]') : (program.activities || []),
        impact: typeof program.impact === 'string' ? JSON.parse(program.impact || '[]') : (program.impact || []),
        testimonials: typeof program.testimonials === 'string' ? JSON.parse(program.testimonials || '[]') : (program.testimonials || [])
      }));
    } catch (err) {
      console.error('Error loading programs:', err);
      error = err instanceof Error ? err.message : 'Gagal memuat program';
    } finally {
      loading = false;
    }
  });
</script>

<section class="py-10 sm:py-12 md:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
    <div class="max-w-280 mx-auto">
        <!-- Section Header -->
        <div class="flex flex-col md:flex-row justify-between items-end gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10 md:mb-12">
            <div class="max-w-xl">
                <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">Program Unggulan</h2>
                <p class="text-slate-600 text-sm sm:text-base md:text-lg">
                    Fokus utama kami dalam menciptakan dampak positif yang berkelanjutan bagi anak-anak marjinal.
                </p>
            </div>
            
            <!-- Decorative Icon -->
            <div class="hidden md:block">
                <span class="material-symbols-outlined text-blue-500/20 text-6xl rotate-12">diversity_1</span>
            </div>
        </div>
        
        {#if loading}
            <div class="flex justify-center items-center py-20">
                <div class="text-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p class="text-slate-600">Memuat program...</p>
                </div>
            </div>
        {:else if error}
            <div class="text-center py-20">
                <p class="text-red-600 mb-4">{error}</p>
                <button onclick={() => window.location.reload()} class="text-blue-500 hover:underline">
                    Coba lagi
                </button>
            </div>
        {:else if filteredPrograms.length === 0}
            <div class="text-center py-20">
                <p class="text-slate-600 text-lg">Tidak ada program yang tersedia.</p>
            </div>
        {:else}
            <!-- Program Cards Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8 lg:gap-10">
                {#each filteredPrograms as program (program.id)}
                    <ProgramCard {program} />
                {/each}
            </div>
        {/if}
    </div>
</section>