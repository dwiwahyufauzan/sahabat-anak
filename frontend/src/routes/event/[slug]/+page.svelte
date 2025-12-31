<script lang="ts">
  import { page } from '$app/stores';
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import { getImageUrl } from '$lib/utils/image';
  
  const slug = $page.params.slug || '';
  
  let event: any = null;
  let loading = true;
  let error = '';
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // HH:MM
  };
  
  onMount(async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/events/${slug}`);
      if (!response.ok) {
        throw new Error('Event tidak ditemukan');
      }
      event = await response.json();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Gagal memuat event';
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  {#if event}
    <title>{event.name} - Sahabat Anak</title>
    <meta name="description" content={event.description} />
  {:else}
    <title>Event - Sahabat Anak</title>
  {/if}
</svelte:head>

{#if loading}
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-slate-600">Memuat event...</p>
    </div>
  </div>
{:else if error || !event}
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4">{error || 'Event tidak ditemukan'}</h1>
      <a href="{base}/event" class="text-blue-600 hover:underline">Kembali ke daftar event</a>
    </div>
  </div>
{:else}
  <div class="min-h-screen bg-slate-50">
    <!-- Hero Section -->
    <div class="relative h-96 bg-linear-to-br from-blue-500 to-indigo-600 overflow-hidden">
      <div class="absolute inset-0">
        {#if event.image}
          <img 
            src={getImageUrl(event.image)} 
            alt={event.name}
            class="w-full h-full object-cover opacity-30"
          />
          <div class="absolute inset-0 bg-linear-to-t from-blue-900/80 to-transparent"></div>
        {/if}
      </div>
      
      <div class="container mx-auto px-4 h-full flex items-end relative z-10 pb-12">
        <div class="max-w-4xl">
          <!-- Breadcrumb -->
          <div class="mb-4 flex items-center gap-2 text-sm text-white/80">
            <a href="{base}/" class="hover:text-white transition-colors">Beranda</a>
            <span>/</span>
            <a href="{base}/event" class="hover:text-white transition-colors">Event</a>
            <span>/</span>
            <span class="font-semibold text-white">{event.name}</span>
          </div>
          
          <!-- Event Type Badge -->
          <div class="mb-4">
            <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full {event.eventType === 'online' ? 'bg-blue-500' : 'bg-green-500'} text-white font-bold">
              <span class="material-symbols-outlined">
                {event.eventType === 'online' ? 'videocam' : 'location_on'}
              </span>
              {event.eventType === 'online' ? 'Event Online' : 'Event Offline'}
            </span>
          </div>
          
          <!-- Title -->
          <h1 class="text-4xl md:text-5xl font-black text-white mb-4">{event.name}</h1>
          
          <!-- Quick Info -->
          <div class="flex flex-wrap items-center gap-6 text-white/90">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined">calendar_today</span>
              <span>{formatDate(event.startDate)}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined">schedule</span>
              <span>{formatTime(event.startTime)} - {formatTime(event.endTime)} WIB</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-12 -mt-20 relative z-20">
      <div class="max-w-5xl mx-auto">
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Description Card -->
            <div class="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
              <h2 class="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span class="material-symbols-outlined text-blue-600">info</span>
                Tentang Event
              </h2>
              <p class="text-slate-700 leading-relaxed whitespace-pre-line">{event.description}</p>
            </div>

            <!-- Objectives Card -->
            {#if event.objectives}
              <div class="bg-linear-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200">
                <h2 class="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <span class="material-symbols-outlined text-blue-600">flag</span>
                  Tujuan
                </h2>
                <p class="text-slate-700 leading-relaxed whitespace-pre-line">{event.objectives}</p>
              </div>
            {/if}
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Event Details Card -->
            <div class="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 sticky top-6">
              <h3 class="text-xl font-bold text-slate-900 mb-6">Detail Event</h3>
              
              <div class="space-y-6">
                <!-- Date & Time -->
                <div>
                  <div class="flex items-center gap-2 mb-3">
                    <span class="material-symbols-outlined text-blue-600">event</span>
                    <h4 class="font-bold text-slate-900">Waktu</h4>
                  </div>
                  <div class="space-y-2">
                    <div class="flex items-start gap-2">
                      <span class="material-symbols-outlined text-sm text-slate-400 mt-0.5">calendar_today</span>
                      <div>
                        <p class="text-slate-700 text-sm font-medium">Mulai</p>
                        <p class="text-slate-600 text-sm">{formatDate(event.startDate)}</p>
                      </div>
                    </div>
                    <div class="flex items-start gap-2">
                      <span class="material-symbols-outlined text-sm text-slate-400 mt-0.5">event_available</span>
                      <div>
                        <p class="text-slate-700 text-sm font-medium">Selesai</p>
                        <p class="text-slate-600 text-sm">{formatDate(event.endDate)}</p>
                      </div>
                    </div>
                    <div class="flex items-start gap-2">
                      <span class="material-symbols-outlined text-sm text-slate-400 mt-0.5">schedule</span>
                      <p class="text-slate-700 text-sm">{formatTime(event.startTime)} - {formatTime(event.endTime)} WIB</p>
                    </div>
                  </div>
                </div>

                <div class="border-t border-slate-200"></div>

                <!-- Venue -->
                <div>
                  <div class="flex items-center gap-2 mb-3">
                    <span class="material-symbols-outlined text-green-600">
                      {event.eventType === 'online' ? 'videocam' : 'location_on'}
                    </span>
                    <h4 class="font-bold text-slate-900">Tempat</h4>
                  </div>
                  <p class="text-slate-700 text-sm">{event.venue}</p>
                </div>

                <div class="border-t border-slate-200"></div>

                <!-- Target Audience -->
                {#if event.targetAudience}
                  <div>
                    <div class="flex items-center gap-2 mb-3">
                      <span class="material-symbols-outlined text-purple-600">group</span>
                      <h4 class="font-bold text-slate-900">Target Audiens</h4>
                    </div>
                    <p class="text-slate-700 text-sm">{event.targetAudience}</p>
                  </div>
                {/if}

                <div class="border-t border-slate-200"></div>

                <!-- Status -->
                <div>
                  <div class="flex items-center gap-2 mb-3">
                    <span class="material-symbols-outlined text-orange-600">av_timer</span>
                    <h4 class="font-bold text-slate-900">Status</h4>
                  </div>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold
                    {event.status === 'upcoming' ? 'bg-orange-100 text-orange-800' : ''}
                    {event.status === 'ongoing' ? 'bg-green-100 text-green-800' : ''}
                    {event.status === 'completed' ? 'bg-blue-100 text-blue-800' : ''}
                    {event.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}">
                    {event.status === 'upcoming' ? 'Akan Datang' :
                     event.status === 'ongoing' ? 'Sedang Berlangsung' :
                     event.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                  </span>
                </div>
              </div>

              <!-- CTA Buttons -->
              <div class="mt-8 space-y-3">
                <a
                  href="{base}/relawan"
                  class="w-full px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-center transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <span class="material-symbols-outlined">how_to_reg</span>
                  Daftar Jadi Relawan
                </a>
                <a
                  href="{base}/contact"
                  class="w-full px-6 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-center transition-colors flex items-center justify-center gap-2"
                >
                  <span class="material-symbols-outlined">mail</span>
                  Hubungi Kami
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Material Icons -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
