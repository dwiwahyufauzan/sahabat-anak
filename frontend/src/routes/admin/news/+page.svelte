<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/utils/adminApi';
  import { goto } from '$app/navigation';

  let news: any[] = [];
  let loading = true;
  let deleting: number | null = null;

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
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;

    deleting = id;
    try {
      await adminApi.news.delete(id);
      await loadNews();
    } catch (error) {
      alert('Gagal menghapus berita');
    } finally {
      deleting = null;
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

<div>
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold text-gray-800">Kelola Berita</h1>
    <a
      href="/admin/news/create"
      class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
    >
      + Tambah Berita
    </a>
  </div>

  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  {:else if news.length === 0}
    <div class="bg-white rounded-lg shadow p-12 text-center">
      <p class="text-gray-500 mb-4">Belum ada berita</p>
      <a
        href="/admin/news/create"
        class="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
      >
        Tambah Berita Pertama
      </a>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each news as article}
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <img src={article.image} alt={article.title} class="w-full h-48 object-cover" />
          <div class="p-6">
            <p class="text-sm text-gray-500 mb-2">{formatDate(article.date)}</p>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">{article.title}</h3>
            <p class="text-sm text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
            
            <div class="flex gap-2">
              <a
                href="/admin/news/{article.id}"
                class="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                Edit
              </a>
              <button
                onclick={() => handleDelete(article.id)}
                disabled={deleting === article.id}
                class="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm"
              >
                {deleting === article.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
