<script lang="ts">
    // Data pilar dengan Svelte 5 runes
    const pillars = $state([
        {
            id: 1,
            icon: 'school',
            title: 'Pendidikan',
            description: 'Akses belajar yang layak dan menyenangkan untuk menunjang intelektualitas anak.',
            color: 'bg-red-500',
            stats: '500+ Kelas'
        },
        {
            id: 2,
            icon: 'palette',
            title: 'Kreativitas',
            description: 'Ruang ekspresi seni dan bakat untuk mengembangkan potensi unik setiap anak.',
            color: 'bg-orange-500',
            stats: '200+ Workshop'
        },
        {
            id: 3,
            icon: 'psychology',
            title: 'Karakter',
            description: 'Pembentukan mental, kepemimpinan, dan etika untuk generasi yang tangguh.',
            color: 'bg-purple-500',
            stats: '50+ Program'
        },
        {
            id: 4,
            icon: 'family_restroom',
            title: 'Keluarga',
            description: 'Edukasi bagi orang tua dan lingkungan untuk menciptakan ekosistem pendukung.',
            color: 'bg-green-500',
            stats: '1000+ Keluarga'
        }
    ]);
    
    /** @type {number | null} */
    let activePillar = $state<number | null>(null);
    
    /**
   * @param {number} id
   */
    function setActivePillar(id: number) {
        activePillar = activePillar === id ? null : id;
    }
</script>

<section class="py-24 bg-white dark:bg-[#101c22]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Fokus Utama Kami
            </h2>
            <p class="text-lg text-slate-600 dark:text-slate-300">
                Kami bergerak secara holistik untuk memastikan anak-anak mendapatkan dukungan dari berbagai aspek kehidupan.
            </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {#each pillars as pillar}
                <div 
                    class="bg-background-light dark:bg-[#15232b] p-8 rounded-3xl border-2 border-gray-900 dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group flex flex-col items-center text-center md:items-start md:text-left"
                    class:ring-2={activePillar === pillar.id}
                    class:ring-primary={activePillar === pillar.id}
                    onclick={() => setActivePillar(pillar.id)}
                    onkeydown={(e) => e.key === 'Enter' && setActivePillar(pillar.id)}
                    tabindex="0"
                    role="button"
                >
                    <div class="{pillar.color} size-14 rounded-2xl text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <span class="material-symbols-outlined text-3xl">
                            {pillar.icon}
                        </span>
                    </div>
                    
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">
                        {pillar.title}
                    </h3>
                    
                    <p class="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        {pillar.description}
                    </p>
                    
                    <!-- Statistik yang muncul saat hover/active -->
                    {#if activePillar === pillar.id}
                        <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <span class="text-sm font-semibold text-primary">
                                {pillar.stats}
                            </span>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</section>

