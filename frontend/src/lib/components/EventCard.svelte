<script lang="ts">
  import { base } from '$app/paths';
  import { getImageUrl } from '$lib/utils/image';

  export let event: any;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // HH:MM
  };

  const getMonth = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase();
  };

  const getDay = (dateString: string) => {
    const date = new Date(dateString);
    return date.getDate();
  };
</script>

<div class="flex flex-col bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 group">
    <!-- Image with Date Badge -->
    <div class="relative h-48 sm:h-56 md:h-64 overflow-hidden">
        <div class="absolute inset-0 bg-blue-500/20 z-10 opacity-0 group-hover:opacity-10 transition-opacity"></div>
        <div 
            class="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style="background-image: url('{getImageUrl(event.image || '/placeholder.svg')}');"
            role="img"
            aria-label={event.name}>
        </div>
        
        <!-- Date Badge -->
        <div class="absolute top-4 left-4 bg-white rounded-xl shadow-lg z-20 overflow-hidden">
            <div class="bg-blue-500 text-white text-center py-1 px-3">
                <p class="text-xs font-bold">{getMonth(event.startDate)}</p>
            </div>
            <div class="px-3 py-2">
                <p class="text-2xl font-bold text-slate-900">{getDay(event.startDate)}</p>
            </div>
        </div>

        <!-- Event Type Badge -->
        <div class="absolute top-4 right-4 z-20">
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold {event.eventType === 'online' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}">
                <span class="material-symbols-outlined text-sm">
                    {event.eventType === 'online' ? 'videocam' : 'location_on'}
                </span>
                {event.eventType === 'online' ? 'Online' : 'Offline'}
            </span>
        </div>
    </div>
    
    <!-- Content -->
    <div class="p-5 sm:p-6 md:p-8 flex flex-col flex-1">
        <!-- Event Name -->
        <h3 class="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">{event.name}</h3>
        
        <!-- Event Info -->
        <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-sm text-slate-600">
                <span class="material-symbols-outlined text-lg text-blue-500">schedule</span>
                <span>{formatTime(event.startTime)} - {formatTime(event.endTime)} WIB</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-slate-600">
                <span class="material-symbols-outlined text-lg text-blue-500">
                    {event.eventType === 'online' ? 'videocam' : 'location_on'}
                </span>
                <span>{event.venue}</span>
            </div>
            {#if event.targetAudience}
                <div class="flex items-center gap-2 text-sm text-slate-600">
                    <span class="material-symbols-outlined text-lg text-blue-500">group</span>
                    <span>{event.targetAudience}</span>
                </div>
            {/if}
        </div>

        <!-- Description -->
        <p class="text-sm sm:text-base text-slate-600 mb-4 sm:mb-5 md:mb-6 leading-relaxed flex-1 line-clamp-3">
            {event.description}
        </p>
        
        <!-- CTA Button -->
        <a 
            href="{base}/event/{event.slug}" 
            class="w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-slate-200 hover:bg-blue-500 hover:text-white text-blue-600 text-sm sm:text-base font-bold transition-colors flex items-center justify-center gap-2 group/btn"
        >
            Lihat Detail
            <span class="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">
                arrow_forward
            </span>
        </a>
    </div>
</div>
