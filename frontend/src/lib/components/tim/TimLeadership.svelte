<script lang="ts">
    import { onMount } from 'svelte';
    import { api } from '$lib/api/client';
    import TeamCard from './TeamCard.svelte';
    import ComingSoon from '../ComingSoon.svelte';
    
    let leadershipTeam: any[] = [];
    let loading = true;
    let error = '';
    
    onMount(async () => {
        try {
            const allTeam = await api.getTeam() as any[];
            // Filter hanya leadership yang aktif
            leadershipTeam = allTeam.filter(member => member.teamType === 'leadership' && member.isActive === 1);
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to load leadership team';
            console.error('Failed to load leadership team:', err);
        } finally {
            loading = false;
        }
    });
</script>

<section id="leadership">
    <div class="flex flex-col items-center md:items-start mb-10 animate-fade-in">
        <span class="text-blue-400 font-bold text-sm tracking-widest uppercase mb-2">
            Leadership
        </span>
        <h2 class="text-3xl font-bold text-slate-900 dark:text-white text-center md:text-left">
            Pengurus Harian
        </h2>
        <div class="h-1.5 w-24 bg-blue-400 rounded-full mt-4"></div>
    </div>
    
    {#if loading}
        <div class="flex justify-center items-center py-20">
            <div class="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
    {:else if error}
        <ComingSoon 
            title="Pengurus Harian" 
            message="Section ini sedang dalam pengembangan. Silakan coba lagi nanti." 
        />
    {:else if leadershipTeam.length === 0}
        <div class="text-center py-20">
            <p class="text-gray-500">Tidak ada data leadership saat ini.</p>
        </div>
    {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {#each leadershipTeam as member, index}
                <TeamCard 
                    {member}
                    index={index}
                    type="leadership"
                />
            {/each}
        </div>
    {/if}
</section>