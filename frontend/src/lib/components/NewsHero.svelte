<script>
  import { highlightNews } from '$lib/data/news';
  import { searchQuery } from '$lib/stores/newsFilter';
  
  let localSearch = '';
  
  function handleSearch() {
    searchQuery.set(localSearch);
  }
</script>

<section class="relative rounded-3xl overflow-hidden bg-[#eaf6ff] mb-10">
  <div class="flex flex-col md:flex-row items-center p-6 md:p-12 gap-8 md:gap-12">
    <div class="flex-1 space-y-6">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-primary text-xs font-bold uppercase tracking-wider shadow-sm">
        <span class="material-symbols-outlined text-[16px]">campaign</span>
        Update Terkini
      </div>
      
      <h1 class="text-3xl md:text-5xl font-black text-[#111518] leading-[1.15] tracking-tight">
        Kabar Terbaru <span class="text-blue-400">Sahabat Anak</span>
      </h1>
      
      <p class="text-[#617989] text-base md:text-lg leading-relaxed max-w-lg">
        Ikuti perjalanan kami dalam memberikan masa depan yang lebih cerah, cerita inspiratif, dan kegiatan seru bersama anak-anak Indonesia.
      </p>

      <!-- Search Bar in Hero -->
      <div class="flex w-full max-w-md items-center bg-white rounded-xl p-1.5 shadow-soft border border-gray-100">
        <span class="material-symbols-outlined text-[#617989] ml-3">search</span>
        <input 
          bind:value={localSearch}
          on:keypress={(e) => e.key === 'Enter' && handleSearch()}
          class="w-full border-none focus:ring-0 text-sm md:text-base px-3 placeholder:text-gray-400" 
          placeholder="Cari berita atau kegiatan..." 
          type="text"
        />
        <button 
          on:click={handleSearch}
          class="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-bold text-sm transition-colors"
        >
          Cari
        </button>
      </div>
    </div>

    <div class="w-full md:w-1/2 aspect-video md:aspect-4/3 rounded-2xl overflow-hidden shadow-card relative group">
      <div class="absolute inset-0 bg-linear-to-t from-black/40 to-transparent z-10"></div>
      <div 
        class="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
        style="background-image: url('{highlightNews.image}');"
        role="img"
        aria-label={highlightNews.alt}
      ></div>
      
      <div class="absolute bottom-4 left-4 right-4 z-20 text-white">
        <span class="bg-orange-400 text-xs font-bold px-2 py-1 rounded mb-2 inline-block">
          {highlightNews.category}
        </span>
        <h3 class="font-bold text-lg md:text-xl leading-tight">
          {highlightNews.title}
        </h3>
      </div>
    </div>
  </div>
</section>
