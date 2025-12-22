<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/utils/adminApi';
  import { goto } from '$app/navigation';

  let programs: any[] = [];
  let loading = true;
  let deleting: number | null = null;

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
    if (!confirm('Apakah Anda yakin ingin menghapus program ini?')) return;

    deleting = id;
    try {
      await adminApi.programs.delete(id);
      await loadPrograms();
    } catch (error) {
      alert('Gagal menghapus program');
    } finally {
      deleting = null;
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(parseInt(amount));
  };
</script>

<svelte:head>
  <title>Kelola Program - Admin Panel</title>
</svelte:head>

<div>
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold text-gray-800">Kelola Program</h1>
    <a
      href="/admin/programs/create"
      class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
    >
      + Tambah Program
    </a>
  </div>

  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  {:else if programs.length === 0}
    <div class="bg-white rounded-lg shadow p-12 text-center">
      <p class="text-gray-500 mb-4">Belum ada program</p>
      <a
        href="/admin/programs/create"
        class="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
      >
        Tambah Program Pertama
      </a>
    </div>
  {:else}
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each programs as program}
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <img src={program.image} alt={program.title} class="w-16 h-16 object-cover rounded-lg mr-4" />
                  <div>
                    <p class="font-semibold text-gray-800">{program.title}</p>
                    <p class="text-sm text-gray-500">{program.slug}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{program.category}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{formatCurrency(program.targetAmount)}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{program.location}</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs rounded-full
                  {program.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                  {program.status}
                </span>
              </td>
              <td class="px-6 py-4 text-sm">
                <div class="flex gap-2">
                  <a
                    href="/admin/programs/{program.id}"
                    class="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </a>
                  <button
                    onclick={() => handleDelete(program.id)}
                    disabled={deleting === program.id}
                    class="text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    {deleting === program.id ? 'Deleting...' : 'Delete'}
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
