
<script>
    const missions = $state([
        {
            id: 1,
            icon: 'school',
            title: 'Empowerment',
            description: 'Mendampingi anak dalam mengembangkan potensi diri melalui pendidikan, kreativitas, dan kegiatan positif yang membangun rasa percaya diri.',
            color: 'bg-blue-100 dark:bg-blue-900/30',
            textColor: 'text-blue-600'
        },
        {
            id: 2,
            icon: 'volunteer_activism',
            title: 'Character Building',
            description: 'Membangun karakter anak yang berakhlak mulia, berempati, dan peduli terhadap sesama serta lingkungan sekitar mereka.',
            color: 'bg-orange-100 dark:bg-orange-900/30',
            textColor: 'text-secondary'
        },
        {
            id: 3,
            icon: 'diversity_1',
            title: 'Community Engagement',
            description: 'Menguatkan peran keluarga dan masyarakat dalam melindungi, mendukung, dan mendidik anak agar tumbuh dalam lingkungan yang aman.',
            color: 'bg-purple-100 dark:bg-purple-900/30',
            textColor: 'text-purple-600'
        },
        {
            id: 4,
            icon: 'flag',
            title: 'Future Leadership',
            description: 'Menumbuhkan jiwa kepemimpinan dan kemandirian anak agar siap menjadi generasi penerus bangsa yang tangguh dan adaptif.',
            color: 'bg-emerald-100 dark:bg-emerald-900/30',
            textColor: 'text-emerald-600'
        }
    ]);
    
    /**
   * @type {any[]}
   */
    let visibleMissions = $state([]);
    
    $effect(() => {
        missions.forEach((mission, index) => {
            setTimeout(() => {
                visibleMissions = [...visibleMissions, mission.id];
            }, index * 200);
        });
    });
</script>

<section id="mission" class="relative w-full py-16 md:py-24 bg-background-light dark:bg-background-dark">
    <div class="layout-container px-4 md:px-10 max-w-7xl mx-auto">
        <div class="text-center mb-16 max-w-2xl mx-auto">
            <h2 class="text-text-main dark:text-white text-3xl md:text-4xl font-black mb-4 tracking-tight animate-fade-in">
                Misi Kami
            </h2>
            <p class="text-text-sub dark:text-gray-400 text-lg animate-fade-in" style="animation-delay: 0.1s;">
                Langkah nyata yang kami lakukan setiap hari untuk mencapai impian besar bagi anak-anak Indonesia.
            </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
            {#each missions as mission}
                <div 
                    class="group flex flex-col p-8 bg-white dark:bg-gray-800 rounded-4xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-card transition-all duration-500 transform {visibleMissions.includes(mission.id) ? 'translateY(0) opacity-100' : 'translateY(20px) opacity-0'}"
                    style="transition-delay: {mission.id * 0.1}s;"
                >
                    <div class="flex items-start justify-between mb-6">
                        <div class="{mission.color} {mission.textColor} size-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <span class="material-symbols-outlined text-[32px]">
                                {mission.icon}
                            </span>
                        </div>
                        <span class="text-5xl font-black text-gray-100 dark:text-gray-700 select-none group-hover:text-gray-200 dark:group-hover:text-gray-600 transition-colors">
                            {String(mission.id).padStart(2, '0')}
                        </span>
                    </div>
                    
                    <h3 class="text-xl md:text-2xl font-bold text-text-main dark:text-white mb-3">
                        {mission.title}
                    </h3>
                    
                    <p class="text-text-sub dark:text-gray-300 leading-relaxed">
                        {mission.description}
                    </p>
                </div>
            {/each}
        </div>
    </div>
</section>


