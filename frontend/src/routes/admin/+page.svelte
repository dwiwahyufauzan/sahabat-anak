<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/utils/adminApi';

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
</script>

<svelte:head>
  <title>Dashboard - Admin Panel</title>
</svelte:head>

<div>
  <h1 class="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

  {#if error}
    <div class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <p class="text-red-700 font-semibold mb-2">❌ Error</p>
      <p class="text-red-600">{error}</p>
      <button 
        onclick={() => loadData()} 
        class="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
      >
        Coba Lagi
      </button>
    </div>
  {/if}

  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  {:else}
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">Total Donasi</p>
            <p class="text-2xl font-bold text-gray-800">{stats.totalDonations}</p>
          </div>
          <div class="bg-green-100 p-3 rounded-full">
            <span class="text-2xl">💰</span>
          </div>
        </div>
        <p class="text-green-600 text-sm mt-2">{formatCurrency(stats.totalAmount)}</p>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">Total Relawan</p>
            <p class="text-2xl font-bold text-gray-800">{stats.totalVolunteers}</p>
          </div>
          <div class="bg-blue-100 p-3 rounded-full">
            <span class="text-2xl">🤝</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">Pesan Baru</p>
            <p class="text-2xl font-bold text-gray-800">{stats.totalContacts}</p>
          </div>
          <div class="bg-yellow-100 p-3 rounded-full">
            <span class="text-2xl">✉️</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">Total Program</p>
            <p class="text-2xl font-bold text-gray-800">{stats.totalPrograms}</p>
          </div>
          <div class="bg-purple-100 p-3 rounded-full">
            <span class="text-2xl">📁</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">Total Berita</p>
            <p class="text-2xl font-bold text-gray-800">{stats.totalNews}</p>
          </div>
          <div class="bg-orange-100 p-3 rounded-full">
            <span class="text-2xl">📰</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Donations -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-800">Donasi Terbaru</h2>
        </div>
        <div class="p-6">
          {#if recentDonations.length === 0}
            <p class="text-gray-500 text-center py-4">Belum ada donasi</p>
          {:else}
            <div class="space-y-4">
              {#each recentDonations as donation}
                <div class="flex items-center justify-between border-b pb-3">
                  <div>
                    <p class="font-semibold">{donation.name || 'Anonim'}</p>
                    <p class="text-sm text-gray-500">{formatCurrency(parseInt(donation.amount))}</p>
                  </div>
                  <span class="text-xs px-2 py-1 rounded-full
                    {donation.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                    {donation.status}
                  </span>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>

      <!-- Recent Volunteers -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-800">Relawan Terbaru</h2>
        </div>
        <div class="p-6">
          {#if recentVolunteers.length === 0}
            <p class="text-gray-500 text-center py-4">Belum ada relawan</p>
          {:else}
            <div class="space-y-4">
              {#each recentVolunteers as volunteer}
                <div class="flex items-center justify-between border-b pb-3">
                  <div>
                    <p class="font-semibold">{volunteer.name}</p>
                    <p class="text-sm text-gray-500">{volunteer.email}</p>
                  </div>
                  <span class="text-xs px-2 py-1 rounded-full
                    {volunteer.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                    {volunteer.status}
                  </span>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>
