<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import EventCard from '$lib/components/EventCard.svelte';

  let events: any[] = [];
  let loading = true;
  let error = '';
  let filter: 'all' | 'upcoming' | 'completed' = 'all';
  let mounted = false;

  onMount(async () => {
    mounted = true;
    await loadEvents();
  });

  const loadEvents = async () => {
    loading = true;
    try {
      const response = await fetch('http://localhost:3000/api/events');
      if (!response.ok) {
        throw new Error('Gagal memuat event');
      }
      const data = await response.json();
      // Simulate loading for demo purposes
      await new Promise(resolve => setTimeout(resolve, 600));
      events = data;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Gagal memuat event';
      console.error('Error loading events:', err);
    } finally {
      loading = false;
    }
  };

  const filterConfig = {
    'all': { label: 'Semua Event', icon: 'calendar_today' },
    'upcoming': { label: 'Mendatang', icon: 'event_upcoming' },
    'completed': { label: 'Selesai', icon: 'event_available' }
  };

  $: filteredEvents = filter === 'all' 
    ? events 
    : filter === 'upcoming'
    ? events.filter(e => e.status === 'upcoming' || e.status === 'ongoing')
    : events.filter(e => e.status === 'completed');
</script>

<svelte:head>
  <title>Event & Kegiatan - Sahabat Anak</title>
  <meta name="description" content="Daftar event dan kegiatan yang diselenggarakan oleh Sahabat Anak untuk mendukung anak-anak Indonesia." />
</svelte:head>

<style>
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }

  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }

  .float-animation {
    animation: float 6s ease-in-out infinite;
  }

  .shimmer {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite linear;
  }

  .grid-fade-in {
    opacity: 0;
    transform: translateY(20px);
    animation: gridFadeIn 0.6s ease forwards;
  }

  @keyframes gridFadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .grid-item {
    animation-delay: calc(var(--index) * 0.1s);
  }
</style>

<main class="min-h-screen bg-gray-50">
  <!-- Hero Section dengan layout 2 kolom -->
  <section class="relative overflow-hidden bg-gray-900">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 40px 40px;"></div>
    </div>

    <!-- Content Grid -->
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24">
      <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        <!-- Left Side - Content -->
        <div in:fade={{ duration: 800 }} class="text-left">
          <!-- Badge -->
          <div 
            in:slide={{ delay: 200, duration: 600 }}
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-600 backdrop-blur-md 
                   border border-white/20 text-white text-sm font-semibold tracking-wide mb-6 shadow-lg"
          >
            <span class="material-symbols-outlined text-lg">event</span>
            <span>Event & Kegiatan</span>
          </div>
          
          <!-- Title -->
          <h1 
            in:slide={{ delay: 400, duration: 700 }}
            class="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight"
          >
            <span class="block">Kegiatan</span>
            <span class="block text-blue-400">
              Sahabat Anak
            </span>
          </h1>
          
          <!-- Description -->
          <p 
            in:slide={{ delay: 600, duration: 700 }}
            class="text-lg sm:text-xl text-blue-100 leading-relaxed mb-10"
          >
            Ikuti berbagai event dan kegiatan yang kami selenggarakan untuk mendukung
            perkembangan dan kesejahteraan anak-anak Indonesia.
          </p>

          <!-- Stats -->
          <div 
            in:fade={{ delay: 800, duration: 800 }}
            class="grid grid-cols-3 gap-3 sm:gap-4"
          >
            {#each [
              { value: events.filter(e => e.status === 'upcoming' || e.status === 'ongoing').length, label: 'Mendatang', icon: 'event_upcoming' },
              { value: events.filter(e => e.status === 'completed').length, label: 'Selesai', icon: 'check_circle' },
              { value: events.length, label: 'Total Event', icon: 'calendar_month' }
            ] as stat, i}
              <div 
                in:slide={{ delay: 900 + i * 100, duration: 600 }}
                class="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/20"
              >
                <div class="flex items-center gap-1 sm:gap-2 mb-1">
                  <span class="material-symbols-outlined text-lg sm:text-xl text-blue-300">{stat.icon}</span>
                  <div class="text-2xl sm:text-3xl font-black text-white">
                    {stat.value}
                  </div>
                </div>
                <div class="text-xs text-gray-200 font-medium">
                  {stat.label}
                </div>
              </div>
            {/each}
          </div>
        </div>

        <!-- Right Side - Image -->
        <div 
          in:fade={{ delay: 400, duration: 1000 }}
          class="relative hidden lg:block"
        >
          <div class="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
            <img 
              src="https://i.pinimg.com/1200x/e0/6a/44/e06a443995670ba7b921ec564515b277.jpg" 
              alt="Event Sahabat Anak" 
              class="w-full h-125 object-cover"
            />
            <div class="absolute inset-0 bg-linear-to-t from-indigo-900/40 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Filter Section -->
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      <div class="flex flex-wrap items-center justify-center gap-3">
        {#each Object.entries(filterConfig) as [key, config]}
          <button
            on:click={() => filter = key as 'all' | 'upcoming' | 'completed'}
            class={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 
                   ${filter === key 
                     ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105' 
                     : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'}`}
          >
            <span class="material-symbols-outlined text-xl">
              {config.icon}
            </span>
            <span class="whitespace-nowrap">{config.label}</span>
            {#if filter === key}
              <span class="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {filteredEvents.length}
              </span>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- Events Grid dengan animasi staggered -->
  <section class="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      {#if loading}
        <!-- Loading skeleton dengan animasi -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {#each Array(6) as _, i}
            <div 
              class="bg-white rounded-2xl border border-slate-200 overflow-hidden shimmer"
              style="height: 400px; animation-delay: ${i * 0.1}s;"
            >
              <div class="h-48 bg-slate-200"></div>
              <div class="p-6">
                <div class="h-6 bg-slate-200 rounded mb-4 w-3/4"></div>
                <div class="h-4 bg-slate-200 rounded mb-2 w-full"></div>
                <div class="h-4 bg-slate-200 rounded mb-2 w-5/6"></div>
                <div class="flex items-center gap-2 mt-6">
                  <div class="w-8 h-8 bg-slate-200 rounded-full"></div>
                  <div class="h-4 bg-slate-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {:else if error}
        <!-- Error state -->
        <div 
          in:fade
          class="max-w-md mx-auto text-center py-20"
        >
          <div class="w-20 h-20 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
            <span class="material-symbols-outlined text-3xl text-red-500">error</span>
          </div>
          <h3 class="text-xl font-semibold text-slate-900 mb-2">Terjadi Kesalahan</h3>
          <p class="text-slate-600 mb-6">{error}</p>
          <button 
            on:click={loadEvents}
            class="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full 
                   font-medium hover:bg-blue-600 transition-colors duration-300"
          >
            <span class="material-symbols-outlined">refresh</span>
            Coba Lagi
          </button>
        </div>
      {:else if filteredEvents.length === 0}
        <!-- Empty state -->
        <div 
          in:fade
          class="max-w-md mx-auto text-center py-20"
        >
          <div class="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
            <span class="material-symbols-outlined text-4xl text-slate-400">calendar_add_on</span>
          </div>
          <h3 class="text-xl font-semibold text-slate-900 mb-2">
            {filter === 'upcoming' ? 'Belum ada event mendatang' : 
             filter === 'completed' ? 'Belum ada event selesai' : 
             'Belum ada event'}
          </h3>
          <p class="text-slate-500">
            {filter === 'upcoming' ? 'Cek kembali nanti untuk event mendatang' : 
             'Event akan segera ditambahkan'}
          </p>
        </div>
      {:else}
        <!-- Events grid dengan animasi staggered -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {#each filteredEvents as event, i (event.id)}
            <div 
              class="grid-fade-in grid-item"
              style="--index: {i};"
              in:slide={{ delay: i * 100, duration: 600 }}
            >
              <EventCard {event} />
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </section>

  <!-- CTA Section -->
  <section class="py-20 bg-linear-to-b from-white to-gray-100">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative bg-linear-to-r from-blue-600 to-indigo-600 rounded-3xl overflow-hidden shadow-2xl">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 40px 40px;"></div>
        </div>
        
        <div class="relative px-8 sm:px-12 py-12 sm:py-16 text-center">
          <h2 class="text-3xl sm:text-4xl font-black text-white mb-4">
            Tertarik Berpartisipasi?
          </h2>
          <p class="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
            Bergabunglah sebagai relawan atau hubungi kami untuk informasi lebih lanjut tentang kegiatan kami.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="/relawan" 
              class="group w-full sm:w-auto inline-flex items-center justify-center gap-2 
                     px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg
                     hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span class="material-symbols-outlined text-2xl">group_add</span>
              <span>Daftar Relawan</span>
              <span class="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </a>
            <a 
              href="/contact" 
              class="group w-full sm:w-auto inline-flex items-center justify-center gap-2 
                     px-8 py-4 bg-orange-600 backdrop-blur-sm text-white rounded-xl font-bold text-lg
                     border-2 border-white/30 hover:bg-orange-400 transition-all duration-300"
            >
              <span class="material-symbols-outlined text-2xl">chat</span>
              <span>Hubungi Kami</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>