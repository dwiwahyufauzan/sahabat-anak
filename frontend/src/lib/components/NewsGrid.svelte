
<script>
  import { onMount } from 'svelte';
  import { activeCategory, searchQuery } from '$lib/stores/newsFilter';
  import { api } from '$lib/api/client';
  import NewsCard from './NewsCard.svelte';
  import ComingSoon from './ComingSoon.svelte';
  
  /**
   * @type {any[]}
   */
  let newsArticles = $state([]);
  let loading = $state(true);
  let error = $state('');

  onMount(async () => {
    try {
      const data = await api.getNews();
      newsArticles = Array.isArray(data) ? data : [];
    } catch (err) {
       error = err instanceof Error ? err.message : 'Failed to load news';
      console.error('Failed to fetch news:', err);
    } finally {
      loading = false;
    }
  });
  
  let filteredNews = $derived(newsArticles.filter(article => {
    const matchesCategory = $activeCategory === 'all' || article.category === $activeCategory;
    const matchesSearch = $searchQuery === '' || 
      article.title.toLowerCase().includes($searchQuery.toLowerCase()) ||
      (article.excerpt && article.excerpt.toLowerCase().includes($searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  }));
</script>

<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
  {#if loading}
    <div class="col-span-full text-center py-12">
      <div class="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p class="text-gray-500 dark:text-gray-400 mt-4">Memuat berita...</p>
    </div>
  {:else if error}
    <div class="col-span-full">
      <ComingSoon 
        title="Berita & Kegiatan" 
        message="Section ini sedang dalam pengembangan. Silakan coba lagi nanti." 
      />
    </div>
  {:else if filteredNews.length > 0}
    {#each filteredNews as article (article.id)}
      <NewsCard {article} />
    {/each}
  {:else}
    <div class="col-span-full text-center py-12">
      <span class="material-symbols-outlined text-6xl text-gray-300 mb-4 block">search_off</span>
      <p class="text-[#617989] text-lg">Tidak ada berita yang ditemukan</p>
    </div>
  {/if}
</section>


