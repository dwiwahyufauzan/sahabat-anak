<script>
    import { base } from '$app/paths';
    import { programDetails } from '$lib/data/programs';
    import { onMount } from 'svelte';
    
    let visible = false;
    
    onMount(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    visible = true;
                }
            });
        }, { threshold: 0.1 });
        
        const section = document.querySelector('#programs-section');
        if (section) observer.observe(section);
        
        return () => observer.disconnect();
    });
</script>

<div id="programs-section" class="py-20 lg:py-28 bg-white dark:bg-background-dark">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-4 {visible ? 'animate-fade-in-up' : 'opacity-0'}">
            <div class="max-w-2xl">
                <h2 class="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Program Unggulan
                </h2>
                <p class="text-sm sm:text-base md:text-lg text-text-light dark:text-gray-400">
                    Berbagai inisiatif kami untuk mendukung tumbuh kembang anak Indonesia secara holistik.
                </p>
            </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {#each programDetails as program, index (program.id)}
                <div class="group bg-white dark:bg-gray-800 rounded-4xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 {visible ? 'animate-scale-in' : 'opacity-0'}" style="animation-delay: {index * 0.1}s;">
                    <div class="h-64 overflow-hidden relative">
                        <div class="absolute inset-0 bg-linear-to-t from-black/50 to-transparent z-10"></div>
                        <img src={program.image} 
                             alt={program.alt} 
                             class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div class="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-{program.categoryColor}-500">
                            {program.category}
                        </div>
                    </div>
                    <div class="p-8">
                        <div class="flex items-center gap-2 mb-3">
                            <span class="material-symbols-outlined text-{program.categoryColor}-500">{program.icon}</span>
                            <h3 class="font-display text-xl font-bold text-gray-900 dark:text-white">
                                {program.title}
                            </h3>
                        </div>
                        <p class="text-gray-500 dark:text-gray-400 mb-6 line-clamp-3">
                            {program.description}
                        </p>
                        <a href="{base}/program/{program.slug}" class="inline-flex items-center text-blue-400 font-bold hover:text-blue-600 transition-colors">
                            Pelajari Lebih Lanjut
                            <span class="material-symbols-outlined ml-1 text-lg">arrow_outward</span>
                        </a>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>