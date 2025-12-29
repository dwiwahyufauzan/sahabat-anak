<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/utils/adminApi';
  import { goto } from '$app/navigation';
  import Icon from '$lib/components/admin/Icons.svelte';
  import Modal from '$lib/components/admin/Modal.svelte';

  let news: any[] = [];
  let loading = true;
  let deleting: number | null = null;

  // Modal states
  let showModal = false;
  let modalType: 'success' | 'error' | 'confirm' = 'success';
  let modalTitle = '';
  let modalMessage = '';
  let deleteTarget: number | null = null;

  onMount(async () => {
    await loadNews();
  });

  const loadNews = async () => {
    loading = true;
    try {
      news = await adminApi.news.getAll();
    } catch (error) {
      console.error('Failed to load news:', error);
    } finally {
      loading = false;
    }
  };

  const handleDelete = async (id: number) => {
    deleteTarget = id;
    modalType = 'confirm';
    modalTitle = 'Hapus Berita?';
    modalMessage = 'Apakah Anda yakin ingin menghapus berita ini? Tindakan ini tidak dapat dibatalkan.';
    showModal = true;
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    
    deleting = deleteTarget;
    try {
      await adminApi.news.delete(deleteTarget);
      await loadNews();
      modalType = 'success';
      modalTitle = 'Berhasil!';
      modalMessage = 'Berita berhasil dihapus';
      showModal = true;
    } catch (error) {
      modalType = 'error';
      modalTitle = 'Gagal!';
      modalMessage = 'Gagal menghapus berita';
      showModal = true;
    } finally {
      deleting = null;
      deleteTarget = null;
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
  <title>Kelola Berita - Admin Panel</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
  <div class="flex justify-between items-center mb-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
        <Icon name="news" className="w-8 h-8 text-blue-500" />
        Kelola Berita
      </h1>
      <p class="text-gray-600">Kelola artikel dan berita organisasi</p>
    </div>
    <a
      href="/admin/news/create"
      class="bg-linear-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
    >
      <Icon name="plus" className="w-5 h-5" />
      Tambah Berita
    </a>
  </div>

  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    <div class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Total Berita</p>
          <p class="text-2xl font-bold text-gray-900">{news.length}</p>
        </div>
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon name="news" className="w-6 h-6 text-blue-500" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-4 border border-orange-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Terbaru</p>
          <p class="text-2xl font-bold text-orange-600">{news.length > 0 ? formatDate(news[0]?.publishedAt || news[0]?.date) : '-'}</p>
        </div>
        <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
          <Icon name="clock" className="w-6 h-6 text-orange-500" />
        </div>
      </div>
    </div>
  </div>

  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else if news.length === 0}
    <div class="bg-white rounded-xl p-12 text-center border border-gray-200">
      <Icon name="news" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-600 text-lg mb-4">Belum ada berita</p>
      <a
        href="/admin/news/create"
        class="inline-flex items-center gap-2 bg-linear-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md"
      >
        <Icon name="plus" className="w-5 h-5" />
        Tambah Berita Pertama
      </a>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each news as article}
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
          <img src={article.image} alt={article.title} class="w-full h-40 object-cover" />
          <div class="p-4">
            <div class="flex items-center gap-2 mb-2">
              <Icon name="clock" className="w-4 h-4 text-gray-400" />
              <p class="text-xs text-gray-500">{formatDate(article.publishedAt || article.date)}</p>
            </div>
            <h3 class="text-base font-semibold text-gray-800 mb-2 line-clamp-2">{article.title}</h3>
            <p class="text-xs text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
            
            <div class="flex gap-2">
              <a
                href="/admin/news/{article.id}"
                class="flex-1 text-center bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
              >
                <Icon name="edit" className="w-4 h-4" />
                Edit
              </a>
              <button
                on:click={() => handleDelete(article.id)}
                disabled={deleting === article.id}
                class="flex-1 bg-red-100 hover:bg-red-200 disabled:bg-gray-100 text-red-700 disabled:text-gray-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
              >
                {#if deleting === article.id}
                  <div class="w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                {:else}
                  <Icon name="trash" className="w-4 h-4" />
                {/if}
                {deleting === article.id ? 'Hapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      {/each}
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
