<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/utils/adminApi';
  import { goto } from '$app/navigation';
  import Icon from '$lib/components/admin/Icons.svelte';
  import Modal from '$lib/components/admin/Modal.svelte';
  import { getImageUrl } from '$lib/utils/image';

  let programs: any[] = [];
  let loading = true;
  let deleting: number | null = null;

  // Modal states
  let showModal = false;
  let modalType: 'success' | 'error' | 'confirm' = 'success';
  let modalTitle = '';
  let modalMessage = '';
  let deleteTarget: number | null = null;

  onMount(async () => {
    await loadPrograms();
  });

  const loadPrograms = async () => {
    loading = true;
    try {
      programs = await adminApi.programs.getAll();
    } catch (error) {
      console.error('Failed to load programs:', error);
    } finally {
      loading = false;
    }
  };

  const handleDelete = async (id: number) => {
    deleteTarget = id;
    modalType = 'confirm';
    modalTitle = 'Hapus Program?';
    modalMessage = 'Apakah Anda yakin ingin menghapus program ini? Tindakan ini tidak dapat dibatalkan.';
    showModal = true;
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    
    deleting = deleteTarget;
    try {
      await adminApi.programs.delete(deleteTarget);
      await loadPrograms();
      modalType = 'success';
      modalTitle = 'Berhasil!';
      modalMessage = 'Program berhasil dihapus';
      showModal = true;
    } catch (error) {
      modalType = 'error';
      modalTitle = 'Gagal!';
      modalMessage = 'Gagal menghapus program';
      showModal = true;
    } finally {
      deleting = null;
      deleteTarget = null;
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(parseInt(amount));
  };

  $: activeCount = programs.filter(p => p.status === 'active').length;
  $: completedCount = programs.filter(p => p.status === 'completed').length;
</script>

<svelte:head>
  <title>Kelola Program - Admin Panel</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
  <div class="flex justify-between items-center mb-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
        <Icon name="folder" className="w-8 h-8 text-blue-500" />
        Kelola Program
      </h1>
      <p class="text-gray-600">Kelola program dan kegiatan organisasi</p>
    </div>
    <a
      href="/admin/programs/create"
      class="bg-linear-to-r from-blue-500 to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
    >
      <Icon name="plus" className="w-5 h-5" />
      Tambah Program
    </a>
  </div>

  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Total Program</p>
          <p class="text-2xl font-bold text-gray-900">{programs.length}</p>
        </div>
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon name="folder" className="w-6 h-6 text-blue-500" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Aktif</p>
          <p class="text-2xl font-bold text-green-600">{activeCount}</p>
        </div>
        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <Icon name="trending-up" className="w-6 h-6 text-green-500" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Selesai</p>
          <p class="text-2xl font-bold text-blue-600">{completedCount}</p>
        </div>
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon name="check" className="w-6 h-6 text-blue-500" />
        </div>
      </div>
    </div>
  </div>

  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else if programs.length === 0}
    <div class="bg-white rounded-xl p-12 text-center border border-gray-200">
      <Icon name="folder" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-600 text-lg mb-4">Belum ada program</p>
      <a
        href="/admin/programs/create"
        class="inline-flex items-center gap-2 bg-linear-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md"
      >
        <Icon name="plus" className="w-5 h-5" />
        Tambah Program Pertama
      </a>
    </div>
  {:else}
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-linear-to-r from-blue-50 to-blue-100">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Program</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Kategori</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Target</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Lokasi</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each programs as program}
            <tr class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <img 
                    src={getImageUrl(program.image)} 
                    alt={program.title} 
                    class="w-12 h-12 object-cover rounded-lg border border-gray-200"
                    on:error={(e) => { if (e.target instanceof HTMLImageElement) e.target.src = 'https://placehold.co/48x48?text=No+Image'; }}
                  />
                  <div>
                    <p class="font-semibold text-gray-800 text-sm">{program.title}</p>
                    <p class="text-xs text-gray-500">{program.slug}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-xs text-gray-600">{program.category}</td>
              <td class="px-4 py-3 text-xs text-blue-600 font-semibold">{formatCurrency(program.targetAmount)}</td>
              <td class="px-4 py-3 text-xs text-gray-600">{program.location}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 text-xs rounded-full font-medium border
                  {program.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}">
                  {program.status}
                </span>
              </td>
              <td class="px-4 py-3 text-xs">
                <div class="flex gap-2">
                  <a
                    href="/admin/programs/edit/{program.id}"
                    class="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors flex items-center gap-1"
                  >
                    <Icon name="edit" className="w-3 h-3" />
                    Edit
                  </a>
                  <button
                    on:click={() => handleDelete(program.id)}
                    disabled={deleting === program.id}
                    class="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    {#if deleting === program.id}
                      <div class="w-3 h-3 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                    {:else}
                      <Icon name="trash" className="w-3 h-3" />
                    {/if}
                    {deleting === program.id ? 'Hapus...' : 'Hapus'}
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<Modal 
  bind:show={showModal}
  type={modalType}
  title={modalTitle}
  message={modalMessage}
  confirmText={modalType === 'confirm' ? 'Hapus' : 'OK'}
  onConfirm={modalType === 'confirm' ? confirmDelete : null}
/>
