<script>
    import { programCoordinators } from '$lib/utils/teamData.js';
    
    /**
   * @type {any[]}
   */
    let visibleCards = $state([]);
    
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
                    <div class="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden group-hover:ring-4 group-hover:ring-blue-400/20 transition-all duration-300">
                        <img 
                            alt={coordinator.alt}
                            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            src={coordinator.photo}
                        />
                    </div>
                    
                    <!-- Program indicator -->
                    <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        {coordinator.programShort}
                    </div>
                </div>
                
                <!-- Name & Title -->
                <h4 class="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-400 transition-colors">
                    {coordinator.name}
                </h4>
                
                <p class="text-xs font-bold text-blue-400 uppercase tracking-wide mb-2">
                    {coordinator.program}
                </p>
                
                <!-- Quote -->
                <p class="text-xs text-slate-500 dark:text-slate-400 italic">
                    "{coordinator.quote}"
                </p>
            </div>
        {/each}
    </div>
</section>

