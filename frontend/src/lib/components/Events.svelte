
<script>
    import { events } from '$lib/data/content.js';
</script>

<div class="py-12 sm:py-16 md:py-20 bg-white dark:bg-background-dark">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-6 sm:mb-8 md:mb-10">
            <h2 class="font-display text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Kegiatan Terbaru
            </h2>
            <button class="hidden md:block px-6 py-3 rounded-xl border-2 border-orange-400 text-orange-400 font-bold text-sm hover:bg-orange-400 hover:text-white transition-colors">
                Lihat Semua Event
            </button>
        </div>
        
        <div class="flex overflow-x-auto pb-8 gap-6 -mx-4 px-4 scrollbar-hide snap-x">
            {#each events as event (event.id)}
                <div class="min-w-70 md:min-w-[320px] bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden snap-center group cursor-pointer hover:shadow-lg transition-all">
                    <div class="h-40 overflow-hidden relative">
                        <img src={event.image} 
                             alt={event.title} 
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div class="absolute top-3 left-3 bg-white dark:bg-gray-900 rounded-lg p-2 text-center min-w-12.5 shadow-sm">
                            <span class="block text-xs font-bold text-gray-500 uppercase">{event.date.month}</span>
                            <span class="block text-xl font-black text-secondary">{event.date.day}</span>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center gap-2 text-gray-500 text-xs font-semibold mb-2">
                            <span class="material-symbols-outlined text-sm">schedule</span> {event.time}
                            <span class="mx-1">•</span>
                            <span class="material-symbols-outlined text-sm">{event.locationType}</span> {event.location}
                        </div>
                        <h3 class="font-display text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                            {event.title}
                        </h3>
                        <p class="text-sm text-gray-500 line-clamp-2">{event.description}</p>
                    </div>
                </div>
            {/each}
        </div>
        
        <div class="block md:hidden mt-4">
            <button class="w-full py-3 rounded-xl border-2 border-orange-400 text-orange-400 font-bold text-sm hover:bg-orange-400 hover:text-orange-400 transition-colors">
                Lihat Semua Event
            </button>
        </div>
    </div>
</div>

<style>
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
