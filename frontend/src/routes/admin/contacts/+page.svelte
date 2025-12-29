<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/utils/adminApi';
  import Icon from '$lib/components/admin/Icons.svelte';
  import Modal from '$lib/components/admin/Modal.svelte';

  let contacts: any[] = [];
  let filteredContacts: any[] = [];
  let loading = true;
  let statusFilter: 'all' | 'unread' | 'read' | 'replied' = 'all';
  let searchQuery = '';
  
  // Reply modal
  let showReplyModal = false;
  let selectedContact: any = null;
  let replyMessage = '';
  let sendingReply = false;

  // View detail modal  
  let showDetailModal = false;
  let detailContact: any = null;

  // Alert/Confirm Modal
  let showModal = false;
  let modalType: 'success' | 'error' | 'confirm' = 'success';
  let modalTitle = '';
  let modalMessage = '';
  let deleteTarget: number | null = null;

  onMount(async () => {
    await loadContacts();
  });

  const loadContacts = async () => {
    loading = true;
    try {
      contacts = await adminApi.contacts.getAll();
      applyFilters();
    } catch (error) {
      console.error('Gagal memuat pesan:', error);
    } finally {
      loading = false;
    }
  };

  const applyFilters = () => {
    let result = [...contacts];
    
    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(c => c.status === statusFilter);
    }
    
    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.subject?.toLowerCase().includes(query) ||
        c.message.toLowerCase().includes(query)
      );
    }
    
    filteredContacts = result;
  };

  $: if (statusFilter || searchQuery !== undefined) {
    applyFilters();
  }

  const markAsRead = async (id: number) => {
    try {
      await adminApi.contacts.updateStatus(id, 'read');
      await loadContacts();
    } catch (error) {
      modalType = 'error';
      modalTitle = 'Gagal!';
      modalMessage = 'Gagal menandai sebagai dibaca';
      showModal = true;
    }
  };

  const openReplyModal = (contact: any) => {
    selectedContact = contact;
    replyMessage = '';
    showReplyModal = true;
  };

  const closeReplyModal = () => {
    showReplyModal = false;
    selectedContact = null;
    replyMessage = '';
  };

  const sendReply = async () => {
    if (!replyMessage.trim()) {
      modalType = 'error';
      modalTitle = 'Peringatan!';
      modalMessage = 'Pesan balasan tidak boleh kosong';
      showModal = true;
      return;
    }

    sendingReply = true;
    try {
      await adminApi.contacts.sendReply(selectedContact.id, replyMessage);
      modalType = 'success';
      modalTitle = 'Berhasil!';
      modalMessage = 'Balasan berhasil dikirim!';
      showModal = true;
      closeReplyModal();
      await loadContacts();
    } catch (error: any) {
      modalType = 'error';
      modalTitle = 'Gagal!';
      modalMessage = error.message || 'Gagal mengirim balasan';
      showModal = true;
    } finally {
      sendingReply = false;
    }
  };

  const openDetailModal = async (contact: any) => {
    // Mark as read when opening
    if (contact.status === 'unread') {
      await markAsRead(contact.id);
    }
    detailContact = contact;
    showDetailModal = true;
  };

  const closeDetailModal = () => {
    showDetailModal = false;
    detailContact = null;
  };

  const deleteContact = async (id: number) => {
    deleteTarget = id;
    modalType = 'confirm';
    modalTitle = 'Hapus Pesan?';
    modalMessage = 'Yakin ingin menghapus pesan ini? Tindakan ini tidak dapat dibatalkan.';
    showModal = true;
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    
    try {
      await adminApi.contacts.delete(deleteTarget);
      await loadContacts();
      modalType = 'success';
      modalTitle = 'Berhasil!';
      modalMessage = 'Pesan berhasil dihapus';
      showModal = true;
    } catch (error) {
      modalType = 'error';
      modalTitle = 'Gagal!';
      modalMessage = 'Gagal menghapus pesan';
      showModal = true;
    } finally {
      deleteTarget = null;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'read': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'replied': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'unread': return 'Belum Dibaca';
      case 'read': return 'Sudah Dibaca';
      case 'replied': return 'Sudah Dibalas';
      default: return status;
    }
  };

  $: unreadCount = contacts.filter(c => c.status === 'unread').length;
  $: readCount = contacts.filter(c => c.status === 'read').length;
  $: repliedCount = contacts.filter(c => c.status === 'replied').length;
</script>

<svelte:head>
  <title>Kelola Pesan - Admin Panel</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
  <!-- Header -->
  <div class="mb-6">
    <h1 class="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
      <Icon name="mail" className="w-8 h-8 text-blue-500" />
      Kelola Pesan Kontak
    </h1>
    <p class="text-gray-600">Kelola dan balas pesan dari pengunjung website</p>
  </div>

  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <div class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">Total Pesan</p>
          <p class="text-2xl font-bold text-gray-900">{contacts.length}</p>
        </div>
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon name="mail" className="w-6 h-6 text-blue-500" />
        </div>
      </div>
    </div>
    
    <div class="bg-white rounded-xl p-4 border border-orange-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">Belum Dibaca</p>
          <p class="text-2xl font-bold text-orange-600">{unreadCount}</p>
        </div>
        <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
          <Icon name="alert-circle" className="w-6 h-6 text-orange-500" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">Sudah Dibaca</p>
          <p class="text-2xl font-bold text-blue-600">{readCount}</p>
        </div>
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon name="eye" className="w-6 h-6 text-blue-500" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">Sudah Dibalas</p>
          <p class="text-2xl font-bold text-green-600">{repliedCount}</p>
        </div>
        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <Icon name="check" className="w-6 h-6 text-green-500" />
        </div>
      </div>
    </div>
  </div>

  <!-- Filters -->
  <div class="bg-white rounded-xl p-4 mb-6 border border-gray-200 shadow-sm">
    <div class="flex flex-col md:flex-row gap-4">
      <!-- Search -->
      <div class="flex-1">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="search" className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Cari nama, email, atau pesan..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <!-- Status Filter -->
      <div class="flex gap-2">
        <button
          on:click={() => statusFilter = 'all'}
          class="px-4 py-2 rounded-lg font-medium transition-all {statusFilter === 'all' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
        >
          Semua
        </button>
        <button
          on:click={() => statusFilter = 'unread'}
          class="px-4 py-2 rounded-lg font-medium transition-all {statusFilter === 'unread' ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
        >
          Belum Dibaca
        </button>
        <button
          on:click={() => statusFilter = 'read'}
          class="px-4 py-2 rounded-lg font-medium transition-all {statusFilter === 'read' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
        >
          Dibaca
        </button>
        <button
          on:click={() => statusFilter = 'replied'}
          class="px-4 py-2 rounded-lg font-medium transition-all {statusFilter === 'replied' ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
        >
          Dibalas
        </button>
      </div>
    </div>
  </div>

  <!-- Messages List -->
  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else if filteredContacts.length === 0}
    <div class="bg-white rounded-xl p-12 text-center border border-gray-200">
      <Icon name="mail" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-600 text-lg">
        {searchQuery || statusFilter !== 'all' ? 'Tidak ada pesan yang sesuai filter' : 'Belum ada pesan'}
      </p>
    </div>
  {:else}
    <div class="space-y-3">
      {#each filteredContacts as contact}
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div class="p-4">
            <div class="flex items-start justify-between gap-4">
              <!-- Left: Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="font-semibold text-gray-900 truncate">{contact.name}</h3>
                  <span class="px-3 py-1 rounded-full text-xs font-medium border {getStatusColor(contact.status)}">
                    {getStatusLabel(contact.status)}
                  </span>
                </div>
                <div class="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span class="flex items-center gap-1">
                    <Icon name="mail" className="w-4 h-4" />
                    {contact.email}
                  </span>
                  <span class="flex items-center gap-1">
                    <Icon name="clock" className="w-4 h-4" />
                    {formatDate(contact.createdAt)}
                  </span>
                </div>
                {#if contact.subject}
                  <p class="text-sm font-medium text-gray-700 mb-1">
                    <span class="text-gray-500">Subjek:</span> {contact.subject}
                  </p>
                {/if}
                <p class="text-sm text-gray-600 line-clamp-2">{contact.message}</p>
              </div>

              <!-- Right: Actions -->
              <div class="flex flex-col gap-2">
                <button
                  on:click={() => openDetailModal(contact)}
                  class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Icon name="eye" className="w-4 h-4" />
                  <span>Detail</span>
                </button>
                
                {#if contact.status !== 'replied'}
                  <button
                    on:click={() => openReplyModal(contact)}
                    class="px-4 py-2 bg-linear-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                  >
                    <Icon name="send" className="w-4 h-4" />
                    <span>Balas</span>
                  </button>
                {/if}

                <button
                  on:click={() => deleteContact(contact.id)}
                  class="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Icon name="trash" className="w-4 h-4" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- Detail Modal -->
{#if showDetailModal && detailContact}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="button" tabindex="0" on:click={closeDetailModal} on:keydown={(e) => e.key === 'Escape' && closeDetailModal()}>
    <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true" tabindex="0" on:click|stopPropagation on:keydown={(e) => e.stopPropagation()}>
      <div class="sticky top-0 bg-linear-to-r from-blue-500 to-orange-500 p-6 text-white">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold">Detail Pesan</h2>
          <button on:click={closeDetailModal} class="w-8 h-8 hover:bg-white/20 rounded-lg transition-colors">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div class="p-6 space-y-4">
        <!-- Contact Info -->
        <div class="bg-gray-50 rounded-xl p-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500 mb-1">Nama</p>
              <p class="font-semibold">{detailContact.name}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">Email</p>
              <p class="font-semibold">{detailContact.email}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">Status</p>
              <span class="inline-block px-3 py-1 rounded-full text-xs font-medium border {getStatusColor(detailContact.status)}">
                {getStatusLabel(detailContact.status)}
              </span>
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">Waktu</p>
              <p class="font-semibold text-sm">{formatDate(detailContact.createdAt)}</p>
            </div>
          </div>
        </div>

        <!-- Subject -->
        {#if detailContact.subject}
          <div>
            <p class="text-sm text-gray-500 mb-2">Subjek</p>
            <p class="font-semibold text-lg">{detailContact.subject}</p>
          </div>
        {/if}

        <!-- Message -->
        <div>
          <p class="text-sm text-gray-500 mb-2">Pesan</p>
          <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p class="whitespace-pre-wrap text-gray-700">{detailContact.message}</p>
          </div>
        </div>

        <!-- Reply if exists -->
        {#if detailContact.reply}
          <div>
            <p class="text-sm text-gray-500 mb-2 flex items-center gap-2">
              <Icon name="send" className="w-4 h-4" />
              Balasan Anda {#if detailContact.repliedAt}
                <span class="text-xs">- {formatDate(detailContact.repliedAt)}</span>
              {/if}
            </p>
            <div class="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
              <p class="whitespace-pre-wrap text-gray-700">{detailContact.reply}</p>
            </div>
          </div>
        {/if}

        <!-- Actions -->
        <div class="flex gap-3 pt-4">
          {#if detailContact.status !== 'replied'}
            <button
              on:click={() => {
                const contact = detailContact;
                closeDetailModal();
                setTimeout(() => openReplyModal(contact), 100);
              }}
              class="flex-1 px-6 py-3 bg-linear-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Icon name="send" className="w-5 h-5" />
              <span>Balas Pesan</span>
            </button>
          {/if}
          <button
            on:click={closeDetailModal}
            class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Alert/Confirm Modal -->
<Modal
  type={modalType}
  title={modalTitle}
  message={modalMessage}
  bind:show={showModal}
  onConfirm={modalType === 'confirm' ? confirmDelete : undefined}
/>
<!-- Reply Modal -->
{#if showReplyModal && selectedContact}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="button" tabindex="0" on:click={closeReplyModal} on:keydown={(e) => e.key === 'Escape' && closeReplyModal()}>
    <div class="bg-white rounded-2xl max-w-2xl w-full" role="dialog" aria-modal="true" tabindex="0" on:click|stopPropagation on:keydown={(e) => e.stopPropagation()}>
      <div class="bg-linear-to-r from-blue-500 to-orange-500 p-6 text-white rounded-t-2xl">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold mb-1">Balas Pesan</h2>
            <p class="text-blue-100 text-sm">Kepada: {selectedContact.name} ({selectedContact.email})</p>
          </div>
          <button on:click={closeReplyModal} class="w-8 h-8 hover:bg-white/20 rounded-lg transition-colors">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div class="p-6 space-y-4">
        <!-- Original Message -->
        <div>
          <p class="text-sm font-semibold text-gray-700 mb-2">Pesan Asli:</p>
          <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p class="text-sm text-gray-600 whitespace-pre-wrap">{selectedContact.message}</p>
          </div>
        </div>

        <!-- Reply Input -->
        <div>
          <label for="reply-message" class="block text-sm font-semibold text-gray-700 mb-2">
            Balasan Anda:
          </label>
          <textarea
            id="reply-message"
            bind:value={replyMessage}
            rows="8"
            placeholder="Tulis balasan Anda di sini..."
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          ></textarea>
          <p class="text-xs text-gray-500 mt-2">
            Balasan akan dikirim ke email: {selectedContact.email}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-2">
          <button
            on:click={sendReply}
            disabled={sendingReply || !replyMessage.trim()}
            class="flex-1 px-6 py-3 bg-linear-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
          >
            {#if sendingReply}
              <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Mengirim...</span>
            {:else}
              <Icon name="send" className="w-5 h-5" />
              <span>Kirim Balasan</span>
            {/if}
          </button>
          <button
            on:click={closeReplyModal}
            disabled={sendingReply}
            class="px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 rounded-xl font-semibold transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
