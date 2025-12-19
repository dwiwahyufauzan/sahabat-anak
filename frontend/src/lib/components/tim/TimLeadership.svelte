<script>
    import { leadershipTeam } from '$lib/utils/teamData.js';
    import TeamCard from './TeamCard.svelte';
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
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each leadershipTeam as member, index}
            <TeamCard 
                {member}
                index={index}
                type="leadership"
            />
        {/each}
    </div>
</section>
