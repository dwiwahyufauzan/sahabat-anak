<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/utils/adminApi';
  import Icon from '$lib/components/admin/Icons.svelte';

  let volunteers: any[] = [];
  let loading = true;
  let updatingId: number | null = null;
  let deletingId: number | null = null;
  let filterStatus: string = 'all';
  let searchQuery: string = '';

  onMount(async () => {
    await loadVolunteers();
  });

  const loadVolunteers = async () => {
    loading = true;
    try {
      volunteers = await adminApi.volunteers.getAll();
    } catch (error) {
      console.error('Failed to load volunteers:', error);
    } finally {
      loading = false;
    }
  };

  const updateStatus = async (id: number, status: string) => {
    updatingId = id;
    try {
      await adminApi.volunteers.updateStatus(id, status);
      await loadVolunteers();
    } catch (error) {
      alert('Gagal mengupdate status');
    } finally {
      updatingId = null;
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus relawan "${name}"?`)) return;

    deletingId = id;
    try {
      await adminApi.volunteers.delete(id);
      alert('Relawan berhasil dihapus');
      await loadVolunteers();
    } catch (error) {
      alert('Gagal menghapus relawan');
    } finally {
      deletingId = null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  $: filteredVolunteers = volunteers.filter(v => {
    const matchesStatus = filterStatus === 'all' || v.status === filterStatus;
    const matchesSearch = !searchQuery || 
      v.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  $: approvedCount = volunteers.filter(v => v.status === 'approved').length;
  $: pendingCount = volunteers.filter(v => v.status === 'pending').length;
  $: rejectedCount = volunteers.filter(v => v.status === 'rejected').length;
</script>

<svelte:head>
  <title>Kelola Relawan - Admin Panel</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
  <!-- Header -->
  <div class="mb-6">
    <h1 class="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
      <Icon name="users" className="w-8 h-8 text-blue-500" />
      Kelola Relawan
    </h1>
    <p class="text-gray-600">Kelola pendaftaran dan persetujuan relawan</p>
  </div>

  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <div class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Total Relawan</p>
          <p class="text-2xl font-bold text-gray-900">{volunteers.length}</p>
        </div>
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon name="users" className="w-6 h-6 text-blue-500" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Disetujui</p>
          <p class="text-2xl font-bold text-green-600">{approvedCount}</p>
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

    <div class="bg-white rounded-xl p-4 border border-red-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Ditolak</p>
          <p class="text-2xl font-bold text-red-600">{rejectedCount}</p>
        </div>
        <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
          <Icon name="close" className="w-6 h-6 text-red-500" />
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
          placeholder="Cari relawan..."
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
          on:click={() => filterStatus = 'approved'}
          class="px-4 py-2 rounded-lg font-medium transition-all {filterStatus === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
        >
          Approved
        </button>
      </div>
    </div>
  </div>

  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else if filteredVolunteers.length === 0}
    <div class="bg-white rounded-xl p-12 text-center border border-gray-200">
      <Icon name="users" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-600 text-lg">
        {searchQuery || filterStatus !== 'all' ? 'Tidak ada relawan yang sesuai filter' : 'Belum ada pendaftaran relawan'}
      </p>
    </div>
  {:else}
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-linear-to-r from-blue-50 to-blue-100">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nama</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Kontak</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Alamat</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Keahlian</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Ketersediaan</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tanggal</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each filteredVolunteers as volunteer}
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3">
                  <p class="font-semibold text-gray-800 text-sm">{volunteer.name}</p>
                </td>
                <td class="px-4 py-3">
                  <p class="text-xs text-gray-600">{volunteer.email}</p>
                  <p class="text-xs text-gray-600">{volunteer.phone}</p>
                </td>
                <td class="px-4 py-3">
                  <p class="text-xs text-gray-600 max-w-xs truncate" title={volunteer.address || '-'}>
                    {volunteer.address || '-'}
                  </p>
                </td>
                <td class="px-4 py-3 text-xs text-gray-600">
                  {volunteer.skills || '-'}
                </td>
                <td class="px-4 py-3">
                  <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full border border-blue-200 font-medium">
                    {volunteer.availability || 'Tidak diisi'}
                  </span>
                </td>
                <td class="px-4 py-3 text-xs text-gray-600">
                  {formatDate(volunteer.createdAt)}
                </td>
                <td class="px-4 py-3">
                  <select
                    value={volunteer.status}
                    on:change={(e) => updateStatus(volunteer.id, e.currentTarget.value)}
                    disabled={updatingId === volunteer.id}
                    class="text-xs px-2 py-1 rounded-full border font-medium
                      {volunteer.status === 'approved' ? 'bg-green-100 text-green-700 border-green-300' : 
                       volunteer.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-300' :
                       'bg-yellow-100 text-yellow-700 border-yellow-300'}"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <button
                      on:click={() => {
                        const details = `
ALAMAT:
${volunteer.address || 'Tidak diisi'}

MOTIVASI:
${volunteer.motivation || 'Tidak diisi'}

KETERSEDIAAN:
${volunteer.availability || 'Tidak diisi'}

Email: ${volunteer.email}
Phone: ${volunteer.phone}
Skills: ${volunteer.skills || '-'}
                        `.trim();
                        alert(details);
                      }}
                      class="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <Icon name="eye" className="w-3 h-3" />
                      Detail
                    </button>
                    <button
                      on:click={() => handleDelete(volunteer.id, volunteer.name)}
                      disabled={deletingId === volunteer.id}
                      class="px-3 py-1 bg-red-100 hover:bg-red-200 disabled:bg-gray-100 text-red-700 disabled:text-gray-400 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      {#if deletingId === volunteer.id}
                        <div class="w-3 h-3 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                      {:else}
                        <Icon name="trash" className="w-3 h-3" />
                      {/if}
                      {deletingId === volunteer.id ? 'Menghapus...' : 'Hapus'}
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
