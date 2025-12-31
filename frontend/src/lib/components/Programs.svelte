<script>
    import { base } from '$app/paths';
    import { onMount } from 'svelte';
    import { api } from '$lib/api/client';
    import { getImageUrl } from '$lib/utils/image';
    import ComingSoon from './ComingSoon.svelte';
    
    let visible = $state(false);
    /**
   * @type {any[]}
   */
    let programs = $state([]);
    let loading = $state(true);
    let error = $state('');
    
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

        // Fetch programs from API
        (async () => {
            try {
                const data = await api.getPrograms();
                programs = Array.isArray(data) ? data : [];
            } catch (err) {
                error = err instanceof Error ? err.message : 'Failed to load programs';
                console.error('Failed to fetch programs:', err);
            } finally {
                loading = false;
            }
        })();

        return () => {
            observer.disconnect();
        };
    });
</script>

<div id="programs-section" class="py-20 lg:py-28 bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-4 {visible ? 'animate-fade-in-up' : 'opacity-0'}">
            <div class="max-w-2xl">
                <h2 class="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                    Program Unggulan
                </h2>
                <p class="text-sm sm:text-base md:text-lg text-slate-600">
                    Berbagai inisiatif kami untuk mendukung tumbuh kembang anak Indonesia secara holistik.
                </p>
            </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {#if loading}
                <div class="col-span-full text-center py-12">
                    <div class="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p class="text-slate-600 mt-4">Memuat program...</p>
                </div>
            {:else if error}
                <div class="col-span-full">
                    <ComingSoon 
                        title="Program Kami" 
                        message="Section ini sedang dalam pengembangan. Silakan coba lagi nanti." 
                    />
                </div>
            {:else if programs.length === 0}
                <div class="col-span-full text-center py-12">
                    <p class="text-slate-600">Belum ada program tersedia.</p>
                </div>
            {:else}
                {#each programs as program, index (program.id)}
                    <div class="group bg-white rounded-4xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 {visible ? 'animate-scale-in' : 'opacity-0'}" style="animation-delay: {index * 0.1}s;">
                        <div class="h-64 overflow-hidden relative">
                            <div class="absolute inset-0 bg-linear-to-t from-black/50 to-transparent z-10"></div>
                            <img 
                                src={getImageUrl(program.image)} 
                                alt={program.title} 
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onerror={(e) => { if (e.target instanceof HTMLImageElement) e.target.src = 'https://placehold.co/400x300?text=No+Image'; }}
                            />
                            <div class="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-600">
                                {program.category}
                            </div>
                        </div>
                        <div class="p-8">
                            <div class="flex items-center gap-2 mb-3">
                                <span class="material-symbols-outlined text-blue-600">menu_book</span>
                                <h3 class="font-display text-xl font-bold text-slate-900">
                                    {program.title}
                                </h3>
                            </div>
                            <p class="text-slate-600 mb-6 line-clamp-3">
                                {program.description}
                            </p>
                            <a href="{base}/program/{program.slug}" class="inline-flex items-center text-blue-500 font-bold hover:text-blue-700 transition-colors">
                                Pelajari Lebih Lanjut
                                <span class="material-symbols-outlined ml-1 text-lg">arrow_outward</span>
                            </a>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    </div>
</div>