<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/utils/adminApi';

  let donations: any[] = [];
  let loading = true;
  let updatingId: number | null = null;
  let sendingEmailId: number | null = null;

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
</script>

<svelte:head>
  <title>Kelola Donasi - Admin Panel</title>
</svelte:head>

<div>
  <h1 class="text-3xl font-bold text-gray-800 mb-6">Kelola Donasi</h1>

  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  {:else if donations.length === 0}
    <div class="bg-white rounded-lg shadow p-12 text-center">
      <p class="text-gray-500">Belum ada donasi</p>
    </div>
  {:else}
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donatur</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Program</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metode</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bukti</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each donations as donation}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div>
                    <p class="font-semibold text-gray-800">{donation.donorName || 'Anonim'}</p>
                    {#if donation.donorEmail}
                      <p class="text-sm text-gray-500">{donation.donorEmail}</p>
                    {/if}
                  </div>
                </td>
                <td class="px-6 py-4 font-semibold text-green-600">
                  {formatCurrency(donation.amount)}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  {donation.programId ? `Program #${donation.programId}` : 'Umum'}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  {donation.paymentMethod || '-'}
                </td>
                <td class="px-6 py-4">
                  {#if donation.paymentProof}
                    <a 
                      href="http://localhost:3000{donation.paymentProof}" 
                      target="_blank"
                      class="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Lihat Bukti
                    </a>
                  {:else}
                    <span class="text-gray-400 text-sm">Tidak ada</span>
                  {/if}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  {formatDate(donation.createdAt)}
                </td>
                <td class="px-6 py-4">
                  <select
                    value={donation.paymentStatus}
                    onchange={(e) => updateStatus(donation.id, e.currentTarget.value)}
                    disabled={updatingId === donation.id}
                    class="text-xs px-2 py-1 rounded-full border
                      {donation.paymentStatus === 'completed' ? 'bg-green-100 text-green-800 border-green-300' : 
                       donation.paymentStatus === 'failed' ? 'bg-red-100 text-red-800 border-red-300' :
                       'bg-yellow-100 text-yellow-800 border-yellow-300'}"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </td>
                <td class="px-6 py-4 text-sm">
                  <div class="flex gap-2">
                    {#if donation.message}
                      <button
                        onclick={() => alert(donation.message)}
                        class="text-blue-600 hover:text-blue-800"
                      >
                        Pesan
                      </button>
                    {/if}
                    <button
                      onclick={() => sendThankYouEmail(donation.id, donation.donorName)}
                      disabled={sendingEmailId === donation.id}
                      class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                    >
                      {sendingEmailId === donation.id ? '...' : '📧 Email'}
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
