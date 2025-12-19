
<script>
  import { activeCategory, searchQuery } from '$lib/stores/newsFilter';
  import { newsArticles } from '$lib/data/news';
  import NewsCard from './NewsCard.svelte';
  
  $: filteredNews = newsArticles.filter(article => {
    const matchesCategory = $activeCategory === 'all' || article.category === $activeCategory;
    const matchesSearch = $searchQuery === '' || 
      article.title.toLowerCase().includes($searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes($searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
</script>

<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
  {#each filteredNews as article (article.id)}
    <NewsCard {article} />
  {:else}
    <div class="col-span-full text-center py-12">
      <span class="material-symbols-outlined text-6xl text-gray-300 mb-4 block">search_off</span>
      <p class="text-[#617989] text-lg">Tidak ada berita yang ditemukan</p>
    </div>
  {/each}
</section>


