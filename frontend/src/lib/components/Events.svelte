
<script>
    import { onMount } from 'svelte';
    import { api } from '$lib/api/client';
    import { getImageUrl } from '$lib/utils/image';
    
    /** @type {Array<{
     *   id: number;
     *   slug: string;
     *   name: string;
     *   description: string;
     *   venue: string;
     *   eventType: 'offline' | 'online';
     *   startDate: string;
     *   endDate: string;
     *   startTime: string;
     *   endTime: string;
     *   image: string | null;
     *   status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
     * }>} */
    let events = [];
    let loading = true;
    /** @type {string | null} */
    let error = null;

    onMount(async () => {
        try {
            const result = await api.getUpcomingEvents();
            events = /** @type {any} */ (result);
        } catch (err) {
            console.error('Error fetching events:', err);
            error = err instanceof Error ? err.message : 'Terjadi kesalahan';
        } finally {
            loading = false;
        }
    });

    /**
     * Format date to display month and day
     * @param {string} dateString - ISO date string
     * @returns {{month: string, day: string}}
     */
    function formatDate(dateString) {
        const date = new Date(dateString);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        return {
            month: months[date.getMonth()],
            day: date.getDate().toString()
        };
    }

    /**
     * Format time from HH:MM to HH:MM WIB
     * @param {string} time - Time string in HH:MM format
     * @returns {string}
     */
    function formatTime(time) {
        return `${time} WIB`;
    }
</script>

<div class="py-12 sm:py-16 md:py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-6 sm:mb-8 md:mb-10">
            <h2 class="font-display text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Kegiatan Terbaru
            </h2>
            <a href="/event" class="hidden md:block px-6 py-3 rounded-xl border-2 border-orange-400 text-orange-400 font-bold text-sm hover:bg-orange-400 hover:text-white transition-colors">
                Lihat Semua Event
            </a>
        </div>
        
        {#if loading}
            <div class="flex justify-center items-center py-16">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
            </div>
        {:else if error}
            <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p class="text-red-600">Gagal memuat kegiatan: {error}</p>
            </div>
        {:else if events.length === 0}
            <div class="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
                <span class="material-symbols-outlined text-6xl text-gray-300 mb-4">event_busy</span>
                <p class="text-gray-500 text-lg">Belum ada kegiatan yang dijadwalkan</p>
            </div>
        {:else}
            <div class="flex overflow-x-auto pb-8 gap-6 -mx-4 px-4 scrollbar-hide snap-x">
                {#each events as event (event.id)}
                    {@const dateInfo = formatDate(event.startDate)}
                    <a href="/event/{event.slug}" class="min-w-70 md:min-w-[320px] bg-white rounded-3xl border border-gray-100 overflow-hidden snap-center group cursor-pointer hover:shadow-lg transition-all">
                        <div class="h-40 overflow-hidden relative bg-gray-100">
                            {#if event.image}
                                <img src={getImageUrl(event.image)} 
                                     alt={event.name} 
                                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            {:else}
                                <div class="w-full h-full flex items-center justify-center bg-linear-to-br from-orange-100 to-orange-200">
                                    <span class="material-symbols-outlined text-6xl text-orange-400">event</span>
                                </div>
                            {/if}
                            <div class="absolute top-3 left-3 bg-white rounded-lg p-2 text-center min-w-12.5 shadow-sm">
                                <span class="block text-xs font-bold text-gray-500 uppercase">{dateInfo.month}</span>
                                <span class="block text-xl font-black text-secondary">{dateInfo.day}</span>
                            </div>
                        </div>
                        <div class="p-6">
                            <div class="flex items-center gap-2 text-gray-500 text-xs font-semibold mb-2">
                                <span class="material-symbols-outlined text-sm">schedule</span> {formatTime(event.startTime)}
                                <span class="mx-1">•</span>
                                <span class="material-symbols-outlined text-sm">{event.eventType === 'online' ? 'videocam' : 'location_on'}</span> {event.venue}
                            </div>
                            <h3 class="font-display text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                {event.name}
                            </h3>
                            <p class="text-sm text-gray-500 line-clamp-2">{event.description}</p>
                        </div>
                    </a>
                {/each}
            </div>
        {/if}
        
        <div class="block md:hidden mt-4">
            <a href="/event" class="block w-full py-3 rounded-xl border-2 border-orange-400 text-orange-400 font-bold text-sm hover:bg-orange-400 hover:text-white transition-colors text-center">
                Lihat Semua Event
            </a>
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
