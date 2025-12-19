
<script>
  import NewsHero from '$lib/components/NewsHero.svelte';
  import CategoryFilters from '$lib/components/CategoryFilters.svelte';
  import NewsGrid from '$lib/components/NewsGrid.svelte';
  import Newsletter from '$lib/components/Newsletter.svelte';
</script>

<svelte:head>
  <title>Halaman Berita - Sahabat Anak</title>
  <meta name="description" content="Ikuti kabar terbaru Sahabat Anak, cerita inspiratif, dan kegiatan seru bersama anak-anak Indonesia." />
</svelte:head>

<div class="flex flex-col min-h-screen overflow-x-hidden">

  <main class="grow w-full max-w-7xl mx-auto px-4 sm:px-10 py-6">
    <NewsHero />
    <CategoryFilters />
    <NewsGrid />
    <Newsletter />
  </main>
</div>
