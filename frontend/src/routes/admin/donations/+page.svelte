<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/utils/adminApi';
  import Icon from '$lib/components/admin/Icons.svelte';

  let donations: any[] = [];
  let loading = true;
  let updatingId: number | null = null;
  let sendingEmailId: number | null = null;
  let filterStatus: string = 'all';
  let searchQuery: string = '';

  onMount(async () => {
    await loadDonations();
  });

  const loadDonations = async () => {
    loading = true;
    try {
      donations = await adminApi.donations.getAll();
    } catch (error) {
      console.error('Failed to load donations:', error);
    } finally {
      loading = false;
    }
  };

  const updateStatus = async (id: number, status: string) => {
    updatingId = id;
    try {
      await adminApi.donations.updateStatus(id, status);
      await loadDonations();
    } catch (error) {
      alert('Gagal mengupdate status');
    } finally {
      updatingId = null;
    }
  };

  const sendThankYouEmail = async (id: number, donorName: string) => {
    if (!confirm(`Kirim email terima kasih ke ${donorName}?`)) return;
    
    sendingEmailId = id;
    try {
      await adminApi.donations.sendThankYouEmail(id);
      alert('Email terima kasih berhasil dikirim!');
    } catch (error) {
      alert('Gagal mengirim email. Pastikan konfigurasi SMTP sudah benar.');
    } finally {
      sendingEmailId = null;
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(parseInt(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  $: filteredDonations = donations.filter(d => {
    const matchesStatus = filterStatus === 'all' || d.paymentStatus === filterStatus;
    const matchesSearch = !searchQuery || 
      d.donorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.donorEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  $: totalAmount = filteredDonations.reduce((sum, d) => sum + parseInt(d.amount || 0), 0);
  $: completedCount = donations.filter(d => d.paymentStatus === 'completed').length;
  $: pendingCount = donations.filter(d => d.paymentStatus === 'pending').length;
</script>

<svelte:head>
  <title>Kelola Donasi - Admin Panel</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
  <!-- Header -->
  <div class="mb-6">
    <h1 class="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
      <Icon name="dollar" className="w-8 h-8 text-blue-500" />
      Kelola Donasi
    </h1>
    <p class="text-gray-600">Kelola dan verifikasi donasi yang masuk</p>
  </div>

  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Total Donasi</p>
          <p class="text-2xl font-bold text-gray-900">{donations.length}</p>
          <p class="text-xs text-blue-600 font-medium mt-1">{formatCurrency(totalAmount.toString())}</p>
        </div>
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon name="dollar" className="w-6 h-6 text-blue-500" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Terverifikasi</p>
          <p class="text-2xl font-bold text-green-600">{completedCount}</p>
        </div>
        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <Icon name="check" className="w-6 h-6 text-green-500" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-4 border border-orange-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Pending</p>
          <p class="text-2xl font-bold text-orange-600">{pendingCount}</p>
        </div>
        <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
          <Icon name="clock" className="w-6 h-6 text-orange-500" />
        </div>
      </div>
    </div>
  </div>

  <!-- Filters -->
  <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Search -->
      <div class="relative">
        <Icon name="search" className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari donatur..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <!-- Status Filter -->
      <div class="flex gap-2">
        <button
          on:click={() => filterStatus = 'all'}
          class="px-4 py-2 rounded-lg font-medium transition-all {filterStatus === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
        >
          Semua
        </button>
        <button
          on:click={() => filterStatus = 'pending'}
          class="px-4 py-2 rounded-lg font-medium transition-all {filterStatus === 'pending' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
        >
          Pending
        </button>
        <button
          on:click={() => filterStatus = 'completed'}
          class="px-4 py-2 rounded-lg font-medium transition-all {filterStatus === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
        >
          Completed
        </button>
      </div>
    </div>
  </div>

  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else if filteredDonations.length === 0}
    <div class="bg-white rounded-xl p-12 text-center border border-gray-200">
      <Icon name="dollar" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-600 text-lg">
        {searchQuery || filterStatus !== 'all' ? 'Tidak ada donasi yang sesuai filter' : 'Belum ada donasi'}
      </p>
    </div>
  {:else}
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-linear-to-r from-blue-50 to-blue-100">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Donatur</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Jumlah</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Program</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Metode</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Bukti</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tanggal</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each filteredDonations as donation}
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3">
                  <div>
                    <p class="font-semibold text-gray-800 text-sm">{donation.donorName || 'Anonim'}</p>
                    {#if donation.donorEmail}
                      <p class="text-xs text-gray-500">{donation.donorEmail}</p>
                    {/if}
                  </div>
                </td>
                <td class="px-4 py-3 font-bold text-blue-600 text-sm">
                  {formatCurrency(donation.amount)}
                </td>
                <td class="px-4 py-3 text-xs text-gray-600">
                  {donation.programId ? `Program #${donation.programId}` : 'Umum'}
                </td>
                <td class="px-4 py-3 text-xs text-gray-600">
                  {donation.paymentMethod || '-'}
                </td>
                <td class="px-4 py-3">
                  {#if donation.paymentProof}
                    <a 
                      href="http://localhost:3000{donation.paymentProof}" 
                      target="_blank"
                      class="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1"
                    >
                      <Icon name="eye" className="w-4 h-4" />
                      Lihat
                    </a>
                  {:else}
                    <span class="text-gray-400 text-xs">Tidak ada</span>
                  {/if}
                </td>
                <td class="px-4 py-3 text-xs text-gray-600">
                  {formatDate(donation.createdAt)}
                </td>
                <td class="px-4 py-3">
                  <select
                    value={donation.paymentStatus}
                    on:change={(e) => updateStatus(donation.id, e.currentTarget.value)}
                    disabled={updatingId === donation.id}
                    class="text-xs px-2 py-1 rounded-full border font-medium
                      {donation.paymentStatus === 'completed' ? 'bg-green-100 text-green-700 border-green-300' : 
                       donation.paymentStatus === 'failed' ? 'bg-red-100 text-red-700 border-red-300' :
                       'bg-yellow-100 text-yellow-700 border-yellow-300'}"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </td>
                <td class="px-4 py-3 text-xs">
                  <div class="flex gap-2">
                    {#if donation.message}
                      <button
                        on:click={() => alert(donation.message)}
                        class="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-1"
                      >
                        <Icon name="mail" className="w-3 h-3" />
                        Pesan
                      </button>
                    {/if}
                    <button
                      on:click={() => sendThankYouEmail(donation.id, donation.donorName)}
                      disabled={sendingEmailId === donation.id}
                      class="px-3 py-1 bg-linear-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                    >
                      {#if sendingEmailId === donation.id}
                        <div class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {:else}
                        <Icon name="send" className="w-3 h-3" />
                      {/if}
                      {sendingEmailId === donation.id ? 'Kirim...' : 'Email'}
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>
