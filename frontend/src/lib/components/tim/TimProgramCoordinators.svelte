<script lang="ts">
    import { onMount } from 'svelte';
    import { api } from '$lib/api/client';
    import ComingSoon from '../ComingSoon.svelte';
    
    let programCoordinators: any[] = $state([]);
    let visibleCards: number[] = $state([]);
    let loading = $state(true);
    let error = $state('');
    
    onMount(async () => {
        try {
            const allTeam = await api.getTeam() as any[];
            // Filter hanya coordinator yang aktif
            programCoordinators = allTeam.filter(member => member.teamType === 'coordinators' && member.isActive === 1);
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to load coordinators';
            console.error('Failed to load coordinators:', err);
        } finally {
            loading = false;
        }
    });
    
    $effect(() => {
        programCoordinators.forEach((_, index) => {
            setTimeout(() => {
                visibleCards = [...visibleCards, index];
            }, index * 150);
        });
    });
</script>

<section>
    <div class="flex flex-col items-center md:items-start mb-10 animate-fade-in">
        <span class="text-blue-400 font-bold text-sm tracking-widest uppercase mb-2">
            Programs
        </span>
        <h2 class="text-3xl font-bold text-slate-900 dark:text-white text-center md:text-left">
            Koordinator Program
        </h2>
        <div class="h-1.5 w-24 bg-blue-400 rounded-full mt-4"></div>
    </div>
    
    {#if loading}
        <div class="flex justify-center items-center py-20">
            <div class="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
    {:else if error}
        <ComingSoon 
            title="Koordinator Program" 
            message="Section ini sedang dalam pengembangan. Silakan coba lagi nanti." 
        />
    {:else if programCoordinators.length === 0}
        <div class="text-center py-20">
            <p class="text-gray-500">Tidak ada data koordinator program saat ini.</p>
        </div>
    {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {#each programCoordinators as coordinator, index}
                <div 
                    class="bg-white dark:bg-card-dark rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-blue-400/50 transition-all duration-500 flex flex-col items-center text-center cursor-pointer hover:-translate-y-2 hover:shadow-lg group {visibleCards.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}"
                    style="transition-delay: {index * 0.1}s;"
                    onclick={() => console.log('View profile:', coordinator.name)}
                    onkeydown={(e) => e.key === 'Enter' && console.log('View profile:', coordinator.name)}
                    tabindex="0"
                    role="button"
                >
                    <!-- Avatar -->
                    <div class="relative mb-4">
                        <div class="w-40 h-40 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden group-hover:ring-4 group-hover:ring-blue-400/20 transition-all duration-300">
                            {#if coordinator.photo}
                                <img 
                                    alt={coordinator.name}
                                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    src="http://localhost:3000/uploads/team/{coordinator.photo}"
                                />
                            {:else}
                                <div class="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-400 to-blue-600">
                                    <span class="text-5xl text-white font-bold">{coordinator.name.charAt(0)}</span>
                                </div>
                            {/if}
                        </div>
                    </div>
                    
                    <!-- Name & Title -->
                    <h4 class="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-400 transition-colors">
                        {coordinator.name}
                    </h4>
                    
                    {#if coordinator.role}
                        <p class="text-xs font-bold text-blue-400 uppercase tracking-wide mb-2">
                            {coordinator.role}
                        </p>
                    {/if}
                    
                    <!-- Bio -->
                    {#if coordinator.bio}
                        <p class="text-xs text-slate-500 dark:text-slate-400 italic line-clamp-3">
                            {coordinator.bio}
                        </p>
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</section>