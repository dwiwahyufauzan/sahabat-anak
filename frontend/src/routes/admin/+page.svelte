<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/utils/adminApi';
  import { fade, fly, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  let stats = {
    totalDonations: 0,
    totalAmount: 0,
    totalVolunteers: 0,
    totalContacts: 0,
    totalPrograms: 0,
    totalNews: 0
  };

  let recentDonations: any[] = [];
  let recentVolunteers: any[] = [];
  let loading = true;
  let error = '';

  onMount(async () => {
    await loadData();
  });

  const loadData = async () => {
    loading = true;
    error = '';
    
    try {
      const [donations, volunteers, programs, news, contacts] = await Promise.all([
        adminApi.donations.getAll(),
        adminApi.volunteers.getAll(),
        adminApi.programs.getAll(),
        adminApi.news.getAll(),
        adminApi.contacts.getAll()
      ]);

      stats = {
        totalDonations: donations.length,
        totalAmount: donations.reduce((sum: number, d: any) => sum + (parseInt(d.amount) || 0), 0),
        totalVolunteers: volunteers.length,
        totalContacts: contacts.filter((c: any) => c.status === 'unread').length,
        totalPrograms: programs.length,
        totalNews: news.length
      };

      recentDonations = donations.slice(0, 5);
      recentVolunteers = volunteers.slice(0, 5);
    } catch (err) {
      console.error('Failed to load stats:', err);
      error = 'Gagal memuat data. Pastikan backend berjalan dan Anda sudah login.';
    } finally {
      loading = false;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('id-ID', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };
</script>

<svelte:head>
  <title>Dashboard - Admin Panel</title>
</svelte:head>

<div class="space-y-6">
  <!-- Hero Section -->
  <div class="relative overflow-hidden bg-linear-to-br from-blue-600 via-blue-600 to-blue-700 rounded-3xl shadow-2xl">
    <div class="absolute inset-0 bg-black/10"></div>
    <div class="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl"></div>
    
    <div class="relative px-8 py-10">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="space-y-2">
          <h1 class="text-4xl md:text-5xl font-bold text-white tracking-tight">
            {getTimeGreeting()} 👋
          </h1>
          <p class="text-emerald-100 text-lg">
            Selamat bekerja di Panel Admin Sahabat Anak
          </p>
        </div>
        
        <div class="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 shadow-xl">
          <div class="text-emerald-50 text-sm mb-1">📅 Hari Ini</div>
          <div class="text-white font-semibold text-lg">{getCurrentDate()}</div>
        </div>
      </div>
    </div>
  </div>

  {#if error}
    <div 
      class="bg-linear-to-rrom-red-50 to-rose-50 border-l-4 border-red-500 rounded-2xl p-6 shadow-lg" 
      transition:fly={{ y: -20, duration: 400 }}
    >
      <div class="flex items-start gap-4">
        <div class="shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <span class="text-xl">⚠️</span>
        </div>
        <div class="flex-1">
          <h3 class="text-red-900 font-bold text-lg mb-1">Terjadi Kesalahan</h3>
          <p class="text-red-700">{error}</p>
          <button 
            on:click={() => loadData()} 
            class="mt-4 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-medium px-6 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
          >
            🔄 Muat Ulang Data
          </button>
        </div>
      </div>
    </div>
  {/if}

  {#if loading}
    <div class="flex flex-col justify-center items-center py-24">
      <div class="relative w-20 h-20">
        <div class="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p class="mt-6 text-gray-600 font-semibold text-lg animate-pulse">Memuat dashboard...</p>
    </div>
  {:else}
    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Donation Stats -->
      <div 
        class="group relative overflow-hidden bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        transition:scale={{ duration: 400, delay: 50, easing: quintOut }}
      >
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative p-6 text-white">
          <div class="flex items-start justify-between mb-4">
            <div class="w-14 h-14 bg-white backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
              💰
            </div>
            <div class="text-right">
              <div class="text-white text-sm font-medium">Total Donasi</div>
              <div class="text-3xl font-bold mt-1">{stats.totalDonations}</div>
            </div>
          </div>
          <div class="pt-4 border-t border-white/20">
            <div class="text-sm text-emerald-50">Total Terkumpul</div>
            <div class="text-xl font-bold mt-1">{formatCurrency(stats.totalAmount)}</div>
          </div>
        </div>
      </div>

      <!-- Volunteers Stats -->
      <div 
        class="group relative overflow-hidden bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        transition:scale={{ duration: 400, delay: 100, easing: quintOut }}
      >
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative p-6 text-white">
          <div class="flex items-start justify-between mb-4">
            <div class="w-14 h-14 bg-white backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
              🤝
            </div>
            <div class="text-right">
              <div class="text-blue-100 text-sm font-medium">Total Relawan</div>
              <div class="text-3xl font-bold mt-1">{stats.totalVolunteers}</div>
            </div>
          </div>
          <div class="pt-4 border-t border-white/20">
            <div class="text-sm text-blue-50">Relawan Terdaftar</div>
            <div class="text-lg font-semibold mt-1">Siap Membantu</div>
          </div>
        </div>
      </div>

      <!-- Messages Stats -->
      <div 
        class="group relative overflow-hidden bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        transition:scale={{ duration: 400, delay: 150, easing: quintOut }}
      >
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative p-6 text-white">
          <div class="flex items-start justify-between mb-4">
            <div class="w-14 h-14 bg-white backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
              ✉️
            </div>
            <div class="text-right">
              <div class="text-white text-sm font-medium">Pesan Baru</div>
              <div class="text-3xl font-bold mt-1">{stats.totalContacts}</div>
            </div>
          </div>
          <div class="pt-4 border-t border-white/20">
            <div class="text-sm text-white">Status</div>
            <div class="text-lg font-semibold mt-1">
              {stats.totalContacts > 0 ? 'Perlu Tindakan' : 'Semua Terbaca'}
            </div>
          </div>
        </div>
      </div>

      <!-- Programs Stats -->
      <div 
        class="group relative overflow-hidden bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        transition:scale={{ duration: 400, delay: 200, easing: quintOut }}
      >
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative p-6 text-white">
          <div class="flex items-start justify-between mb-4">
            <div class="w-14 h-14 bg-white backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
              📁
            </div>
            <div class="text-right">
              <div class="text-purple-100 text-sm font-medium">Total Program</div>
              <div class="text-3xl font-bold mt-1">{stats.totalPrograms}</div>
            </div>
          </div>
          <div class="pt-4 border-t border-white/20">
            <div class="text-sm text-purple-50">Program Aktif</div>
            <div class="text-lg font-semibold mt-1">Sedang Berjalan</div>
          </div>
        </div>
      </div>

      <!-- News Stats -->
      <div 
        class="group relative overflow-hidden bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        transition:scale={{ duration: 400, delay: 250, easing: quintOut }}
      >
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative p-6 text-white">
          <div class="flex items-start justify-between mb-4">
            <div class="w-14 h-14 bg-white backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
              📰
            </div>
            <div class="text-right">
              <div class="text-rose-100 text-sm font-medium">Total Berita</div>
              <div class="text-3xl font-bold mt-1">{stats.totalNews}</div>
            </div>
          </div>
          <div class="pt-4 border-t border-white/20">
            <div class="text-sm text-rose-50">Artikel Dipublikasi</div>
            <div class="text-lg font-semibold mt-1">Konten Terkini</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div 
        class="group relative overflow-hidden bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        transition:scale={{ duration: 400, delay: 300, easing: quintOut }}
      >
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
        <div class="relative p-6 text-white h-full flex flex-col justify-center">
          <div class="text-center space-y-3">
            <div class="w-14 h-14 bg-white backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl mx-auto group-hover:scale-110 transition-transform duration-300">
              ⚡
            </div>
            <div class="text-cyan-100 text-sm font-medium">Aksi Cepat</div>
            <div class="text-2xl font-bold">Menu Pintasan</div>
            <div class="text-sm text-cyan-50 pt-2">Akses fitur utama dengan cepat</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity Section -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
      <!-- Recent Donations -->
      <div 
        class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
        transition:fly={{ x: -20, duration: 400, delay: 100 }}
      >
        <div class="bg-linear-to-r from-emerald-50 to-green-50 px-6 py-5 border-b border-emerald-100">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-xl">
                💵
              </div>
              <h2 class="text-xl font-bold text-gray-800">Donasi Terbaru</h2>
            </div>
            <a href="/admin/donations" class="text-emerald-600 hover:text-emerald-700 font-medium text-sm hover:underline">
              Lihat Semua →
            </a>
          </div>
        </div>
        
        <div class="p-6">
          {#if recentDonations.length === 0}
            <div class="text-center py-12">
              <div class="text-6xl mb-4">📭</div>
              <p class="text-gray-500 font-medium">Belum ada donasi masuk</p>
            </div>
          {:else}
            <div class="space-y-3">
              {#each recentDonations as donation, i}
                <div 
                  class="flex items-center justify-between p-4 bg-gray-50 hover:bg-emerald-50 rounded-xl border border-gray-200 hover:border-emerald-200 transition-all duration-200 group"
                  transition:fly={{ x: -10, duration: 300, delay: i * 50 }}
                >
                  <div class="flex items-center gap-4 flex-1 min-w-0">
                    <div class="w-12 h-12 bg-linear-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                      {(donation.name || 'A')[0].toUpperCase()}
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="font-semibold text-gray-800 truncate">{donation.name || 'Anonim'}</p>
                      <p class="text-sm text-emerald-600 font-bold">{formatCurrency(parseInt(donation.amount))}</p>
                      {#if donation.createdAt}
                        <p class="text-xs text-gray-500 mt-0.5">{formatDate(donation.createdAt)}</p>
                      {/if}
                    </div>
                  </div>
                  <div class="shrink-0 ml-4">
                    <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold
                      {donation.status === 'verified' 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : donation.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        : 'bg-gray-100 text-gray-800 border border-gray-200'}">
                      {donation.status === 'verified' ? '✓ Terverifikasi' : 
                       donation.status === 'pending' ? '⏳ Pending' : donation.status}
                    </span>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>

      <!-- Recent Volunteers -->
      <div 
        class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
        transition:fly={{ x: 20, duration: 400, delay: 100 }}
      >
        <div class="bg-linear-to-r from-blue-50 to-indigo-50 px-6 py-5 border-b border-blue-100">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl">
                👥
              </div>
              <h2 class="text-xl font-bold text-gray-800">Relawan Terbaru</h2>
            </div>
            <a href="/admin/volunteers" class="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline">
              Lihat Semua →
            </a>
          </div>
        </div>
        
        <div class="p-6">
          {#if recentVolunteers.length === 0}
            <div class="text-center py-12">
              <div class="text-6xl mb-4">👤</div>
              <p class="text-gray-500 font-medium">Belum ada relawan terdaftar</p>
            </div>
          {:else}
            <div class="space-y-3">
              {#each recentVolunteers as volunteer, i}
                <div 
                  class="flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 rounded-xl border border-gray-200 hover:border-blue-200 transition-all duration-200 group"
                  transition:fly={{ x: 10, duration: 300, delay: i * 50 }}
                >
                  <div class="flex items-center gap-4 flex-1 min-w-0">
                    <div class="w-12 h-12 bg-linear-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                      {volunteer.name[0].toUpperCase()}
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="font-semibold text-gray-800 truncate">{volunteer.name}</p>
                      <p class="text-sm text-gray-600 truncate">{volunteer.email}</p>
                      {#if volunteer.createdAt}
                        <p class="text-xs text-gray-500 mt-0.5">{formatDate(volunteer.createdAt)}</p>
                      {/if}
                    </div>
                  </div>
                  <div class="shrink-0 ml-4">
                    <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold
                      {volunteer.status === 'approved' 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : volunteer.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        : 'bg-gray-100 text-gray-800 border border-gray-200'}">
                      {volunteer.status === 'approved' ? '✓ Disetujui' : 
                       volunteer.status === 'pending' ? '⏳ Pending' : volunteer.status}
                    </span>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>