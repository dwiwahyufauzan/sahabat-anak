<script lang="ts">
  import { fade, fly, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { onMount } from 'svelte';
  import Icon from '$lib/components/admin/Icons.svelte';

  let mounted = false;
  let currentTime = new Date();

  onMount(() => {
    mounted = true;
    const interval = setInterval(() => {
      currentTime = new Date();
    }, 1000);

    return () => clearInterval(interval);
  });

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 10) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const features = [
    {
      icon: 'dashboard',
      title: 'Dashboard Lengkap',
      description: 'Monitor semua aktivitas dalam satu tempat',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: 'folder',
      title: 'Kelola Program',
      description: 'Atur program-program yayasan dengan mudah',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      icon: 'dollar',
      title: 'Donasi & Laporan',
      description: 'Tracking donasi dan generate laporan',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: 'users',
      title: 'Manajemen Relawan',
      description: 'Kelola data relawan dan volunteer',
      gradient: 'from-purple-500 to-purple-600'
    }
  ];

  const stats = [
    { label: 'Active Programs', value: '12+', icon: 'folder', color: 'blue' },
    { label: 'Total Volunteers', value: '150+', icon: 'users', color: 'orange' },
    { label: 'Donations Received', value: '1000+', icon: 'dollar', color: 'green' },
    { label: 'Children Helped', value: '500+', icon: 'heart', color: 'red' }
  ];
</script>

<svelte:head>
  <title>Welcome - Sahabat Anak Admin</title>
</svelte:head>

<div class="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-orange-50">
  <!-- Hero Section -->
  <div class="relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {#if mounted}
        <!-- Greeting Section -->
        <div class="text-center mb-16" in:fade={{ duration: 600, delay: 100 }}>
          <div class="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-8">
            <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span class="text-sm font-semibold text-gray-700">
              {currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span class="text-gray-400">•</span>
            <span class="text-sm font-semibold text-gray-700">
              {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <h1 
            class="text-5xl md:text-7xl font-bold mb-6"
            in:fly={{ y: 30, duration: 600, delay: 200, easing: quintOut }}
          >
            <span class="bg-gray-900 bg-clip-text text-transparent">
              {getGreeting()}
            </span>
          </h1>
          
          <p 
            class="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
            in:fly={{ y: 30, duration: 600, delay: 300, easing: quintOut }}
          >
            Selamat datang di <span class="font-bold text-blue-600">Sahabat Anak</span> Admin Panel
          </p>

          <div 
            class="flex flex-col sm:flex-row items-center justify-center gap-4"
            in:fly={{ y: 30, duration: 600, delay: 400, easing: quintOut }}
          >
            <a
              href="/admin/login"
              class="group relative px-8 py-4 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3"
            >
              <Icon name="lock" className="w-5 h-5" />
              <span class="font-semibold text-lg">Login to Dashboard</span>
              <Icon name="arrow-right" className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a
              href="/"
              class="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-3 border border-gray-200"
            >
              <Icon name="home" className="w-5 h-5" />
              <span class="font-semibold text-lg">Back to Website</span>
            </a>
          </div>
        </div>

        <!-- Features Grid -->
        <div 
          class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          in:fly={{ y: 30, duration: 600, delay: 600, easing: quintOut }}
        >
          {#each features as feature, i}
            <div 
              class="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              in:scale={{ duration: 400, delay: 800 + (i * 100), easing: quintOut }}
            >
              <div class="w-16 h-16 bg-linear-to-br {feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Icon name={feature.icon} className="w-8 h-8 text-white" />
              </div>
              <h3 class="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
              <p class="text-gray-600">{feature.description}</p>
            </div>
          {/each}
        </div>

        <!-- Info Section -->
        <div 
          class="bg-gray-900 rounded-3xl p-12 text-center text-white shadow-2xl"
          in:fly={{ y: 30, duration: 600, delay: 1000, easing: quintOut }}
        >
          <h2 class="text-3xl md:text-4xl font-bold mb-4">
            Siap untuk mulai?
          </h2>
          <p class="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Login untuk mengakses dashboard lengkap dan mulai mengelola program-program Sahabat Anak
          </p>
          <a
            href="/admin/login"
            class="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-bold text-lg"
          >
            <Icon name="lock" className="w-6 h-6" />
            Login Sekarang
            <Icon name="arrow-right" className="w-6 h-6" />
          </a>
        </div>

        <!-- Footer Info -->
        <div 
          class="mt-16 text-center text-gray-500 text-sm"
          in:fade={{ duration: 600, delay: 1200 }}
        >
          <p class="mb-2">
            <span class="font-semibold text-gray-700">Sahabat Anak Indonesia</span> - Membangun Masa Depan Anak Indonesia
          </p>
          <p>© 2025 All rights reserved</p>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
</style>
