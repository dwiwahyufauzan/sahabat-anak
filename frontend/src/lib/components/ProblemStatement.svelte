<script>
    let isVisible = $state(false);
    
    $effect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        isVisible = true;
                    }
                });
            },
            { threshold: 0.3 }
        );
        
        const element = document.querySelector('#problem-statement');
        if (element) observer.observe(element);
        
        return () => observer.disconnect();
    });
</script>

<section id="problem-statement" class="py-20 bg-white dark:bg-[#101c22]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <!-- Text Content -->
            <div class="flex-1 order-2 lg:order-1">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-accent text-xs font-bold uppercase tracking-wider mb-4 animate-slide-up"
                     style="animation-delay: 0.1s; opacity: {isVisible ? 1 : 0}; transform: translateY({isVisible ? 0 : '20px'});">
                    <span class="material-symbols-outlined text-sm">warning</span>
                    Tantangan Saat Ini
                </div>
                <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight animate-fade-in"
                    style="animation-delay: 0.2s; opacity: {isVisible ? 1 : 0};">
                    Anak Adalah Aset <span class="text-primary">Berharga Bangsa</span>
                </h2>
                <div class="space-y-6 text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                    <p class="animate-fade-in" style="animation-delay: 0.3s; opacity: {isVisible ? 1 : 0};">
                        Anak adalah generasi penerus yang akan menentukan masa depan Indonesia. Namun, kenyataannya masih banyak anak yang menghadapi berbagai tantangan, mulai dari keterbatasan akses pendidikan, kurangnya ruang kreatif, hingga lemahnya pendampingan keluarga.
                    </p>
                    <p class="animate-fade-in" style="animation-delay: 0.4s; opacity: {isVisible ? 1 : 0};">
                        Faktor lain seperti penggunaan gadget yang berlebihan serta minimnya dukungan lingkungan sekitar turut menghambat tumbuh kembang anak, baik secara intelektual, emosional, maupun sosial. Ini adalah panggilan bagi kita semua untuk bertindak.
                    </p>
                </div>
            </div>
            
            <!-- Image -->
            <div class="flex-1 order-1 lg:order-2">
                <div class="relative rounded-2xl md:rounded-[3rem] overflow-hidden aspect-4/3 shadow-2xl shadow-slate-200 dark:shadow-black/50 group hover:shadow-primary/20 transition-shadow duration-500">
                    <img 
                        alt="Thoughtful young child looking out a window representing future challenges" 
                        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        src="https://i.pinimg.com/1200x/d9/cf/c7/d9cfc73c85e6358f6358fcb39301bd4a.jpg"
                    />
                    <div class="absolute inset-0 bg-primary/10 mix-blend-multiply group-hover:bg-primary/5 transition-colors duration-500"></div>
                </div>
            </div>
        </div>
    </div>
</section>

