<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/utils/adminApi';

  let contacts: any[] = [];
  let loading = true;
  let markingRead: number | null = null;

  onMount(async () => {
    await loadContacts();
  });

  const loadContacts = async () => {
    loading = true;
    try {
      contacts = await adminApi.contacts.getAll();
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      loading = false;
    }
  };

  const markAsRead = async (id: number) => {
    markingRead = id;
    try {
      await adminApi.contacts.markAsRead(id);
      await loadContacts();
    } catch (error) {
      alert('Gagal menandai sebagai dibaca');
    } finally {
      markingRead = null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
</script>

<svelte:head>
  <title>Kelola Pesan - Admin Panel</title>
</svelte:head>

<div>
  <h1 class="text-3xl font-bold text-gray-800 mb-6">Kelola Pesan Kontak</h1>

  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  {:else if contacts.length === 0}
    <div class="bg-white rounded-lg shadow p-12 text-center">
      <p class="text-gray-500">Belum ada pesan</p>
    </div>
  {:else}
    <div class="space-y-4">
      {#each contacts as contact}
        <div class="bg-white rounded-lg shadow p-6 {contact.status === 'unread' ? 'border-l-4 border-green-500' : ''}">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">{contact.name}</h3>
              <p class="text-sm text-gray-600">{contact.email}</p>
              <p class="text-sm text-gray-500">{formatDate(contact.createdAt)}</p>
            </div>
            <div class="flex items-center gap-2">
              {#if contact.status === 'unread'}
                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Baru</span>
              {:else if contact.status === 'read'}
                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Dibaca</span>
              {:else if contact.status === 'replied'}
                <span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Dibalas</span>
              {/if}
              {#if contact.status === 'unread'}
                <button
                  onclick={() => markAsRead(contact.id)}
                  disabled={markingRead === contact.id}
                  class="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  {markingRead === contact.id ? 'Loading...' : 'Tandai Dibaca'}
                </button>
              {/if}
            </div>
          </div>
          
          {#if contact.subject}
            <p class="text-gray-700 font-semibold mb-2">Subjek: {contact.subject}</p>
          {/if}
          
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
