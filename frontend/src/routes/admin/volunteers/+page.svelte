<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/utils/adminApi';

  let volunteers: any[] = [];
  let loading = true;
  let updatingId: number | null = null;

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
</script>

<svelte:head>
  <title>Kelola Relawan - Admin Panel</title>
</svelte:head>

<div>
  <h1 class="text-3xl font-bold text-gray-800 mb-6">Kelola Relawan</h1>

  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  {:else if volunteers.length === 0}
    <div class="bg-white rounded-lg shadow p-12 text-center">
      <p class="text-gray-500">Belum ada pendaftaran relawan</p>
    </div>
  {:else}
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kontak</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alamat</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keahlian</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ketersediaan</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each volunteers as volunteer}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <p class="font-semibold text-gray-800">{volunteer.name}</p>
                </td>
                <td class="px-6 py-4">
                  <p class="text-sm text-gray-600">{volunteer.email}</p>
                  <p class="text-sm text-gray-600">{volunteer.phone}</p>
                </td>
                <td class="px-6 py-4">
                  <p class="text-sm text-gray-600 max-w-xs truncate" title={volunteer.address || '-'}>
                    {volunteer.address || '-'}
                  </p>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  {volunteer.skills || '-'}
                </td>
                <td class="px-6 py-4">
                  <span class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {volunteer.availability || 'Tidak diisi'}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  {formatDate(volunteer.createdAt)}
                </td>
                <td class="px-6 py-4">
                  <select
                    value={volunteer.status}
                    onchange={(e) => updateStatus(volunteer.id, e.currentTarget.value)}
                    disabled={updatingId === volunteer.id}
                    class="text-xs px-2 py-1 rounded-full border
                      {volunteer.status === 'approved' ? 'bg-green-100 text-green-800 border-green-300' : 
                       volunteer.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-300' :
                       'bg-yellow-100 text-yellow-800 border-yellow-300'}"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td class="px-6 py-4">
                  <button
                    onclick={() => {
                      const details = `
📍 ALAMAT:
${volunteer.address || 'Tidak diisi'}

💭 MOTIVASI:
${volunteer.motivation || 'Tidak diisi'}

⏰ KETERSEDIAAN:
${volunteer.availability || 'Tidak diisi'}

📧 Email: ${volunteer.email}
📱 Phone: ${volunteer.phone}
🎯 Skills: ${volunteer.skills || '-'}
                      `.trim();
                      alert(details);
                    }}
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    📋 Detail Lengkap
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>
