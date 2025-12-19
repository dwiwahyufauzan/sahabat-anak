<script lang="ts">
    import { onMount } from 'svelte';
    
    const stats = $state([
        { value: '15+', label: 'Tahun Mengabdi', icon: 'calendar_month' },
        { value: '50+', label: 'Komunitas Lokal', icon: 'location_on' },
        { value: '500+', label: 'Relawan Aktif', icon: 'groups' },
        { value: '1000+', label: 'Anak Terbantu', icon: 'sentiment_satisfied' }
    ]);
    
    let animatedStats: Record<string, number> = $state({});
    let visible = $state(false);
    
    onMount(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    visible = true;
                }
            });
        }, { threshold: 0.2 });
        
        const section = document.querySelector('#mission-section');
        if (section) observer.observe(section);
        
        return () => observer.disconnect();
    });
    
    $effect(() => {
        if (visible) {
            stats.forEach(stat => {
                const target = parseInt(stat.value);
                let current = 0;
                const increment = target / 30;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    animatedStats = { ...animatedStats, [stat.label]: Math.floor(current) };
                }, 50);
                
                return () => clearInterval(timer);
            });
        }
    });
</script>

<section id="mission-section" class="py-20 bg-background-light dark:bg-[#15232b]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <!-- Image -->
            <div class="flex-1 relative {visible ? 'animate-slide-in-left' : 'opacity-0'}">
                <div class="relative rounded-2xl md:rounded-[3rem] overflow-hidden aspect-4/3 shadow-xl z-10 group">
                    <img 
                        alt="Volunteers teaching and playing with a group of children outdoors" 
                        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        src="https://i.pinimg.com/736x/6a/13/47/6a13472d807ef96fd11a8926c1805f74.jpg"
                    />
                    <div class="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <!-- Decorative floating card -->
                <div class="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 z-20 bg-white dark:bg-[#1e2f3a] p-6 rounded-2xl shadow-lg max-w-50 hidden md:block animate-slide-up"
                     style="animation-delay: 0.5s;">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600 dark:text-green-400">
                            <span class="material-symbols-outlined">sentiment_satisfied</span>
                        </div>
                        <span class="font-bold text-slate-900 dark:text-white text-sm">
                            {animatedStats['Anak Terbantu'] || '1000+'}+ Anak
                        </span>
                    </div>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Telah terbantu melalui program kami.</p>
                </div>
            </div>
            
            <!-- Text Content -->
            <div class="flex-1 {visible ? 'animate-slide-in-right' : 'opacity-0'}">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-400/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                    <span class="material-symbols-outlined text-sm">diversity_1</span>
                    Misi Kami
                </div>
                <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                    Menghadirkan Wadah <br/>
                    <span class="text-primary">Sahabat Bagi Anak</span>
                </h2>
                <div class="space-y-6 text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                    <p>
                        Melihat fenomena tersebut, kami dari komunitas Sahabat Anak merasa terpanggil untuk menghadirkan wadah yang mampu menjadi sahabat sejati bagi anak-anak Indonesia.
                    </p>
                    <p>
                        Wadah ini tidak hanya fokus pada pendidikan formal, tetapi juga pada pengembangan karakter, kreativitas, kepemimpinan, serta pelibatan peran keluarga dan masyarakat secara aktif. Kami percaya bahwa setiap anak berhak mendapatkan dukungan penuh untuk tumbuh kembang mereka.
                    </p>
                </div>
                
                <!-- Stats Section -->
                <div class="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {#each stats as stat}
                            <div class="flex flex-col items-center text-center">
                                <span class="text-3xl font-black text-primary mb-1">
                                    {animatedStats[stat.label] || stat.value}
                                </span>
                                <div class="flex items-center gap-2">
                                    <span class="material-symbols-outlined text-primary text-sm">
                                        {stat.icon}
                                    </span>
                                    <span class="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        {stat.label}
                                    </span>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
