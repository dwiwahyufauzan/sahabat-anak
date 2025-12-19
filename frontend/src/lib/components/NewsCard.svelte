<script lang="ts">
  import type { NewsArticle } from '$lib/types/news';
  
  export let article: NewsArticle;
  
  const categoryColorMap = {
    'primary': 'text-primary',
    'accent-orange': 'text-accent-orange',
    'pink-500': 'text-pink-500',
    'green-600': 'text-green-600',
    'purple-600': 'text-purple-600',
    'teal-600': 'text-teal-600'
  };
</script>

<article class="flex flex-col bg-white rounded-2xl overflow-hidden border border-[#f0f3f4] shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
  <div class="relative h-48 overflow-hidden">
    <div class="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg {categoryColorMap[article.categoryColor]} text-xs font-bold flex items-center gap-1 shadow-sm">
      <span class="material-symbols-outlined text-[14px]">{article.icon}</span>
      {article.category}
    </div>
    <div 
      class="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
      style="background-image: url('{article.image}');"
      role="img"
      aria-label={article.alt}
    ></div>
  </div>

  <div class="p-5 flex flex-col flex-1">
    <div class="flex items-center gap-2 text-[#9aa6ac] text-xs font-medium mb-3">
      <span class="flex items-center gap-1">
        <span class="material-symbols-outlined text-[14px]">calendar_today</span> 
        {article.date}
      </span>
      <span>•</span>
      <span>{article.author}</span>
    </div>

    <h3 class="text-[#111518] text-xl font-bold leading-tight mb-2 group-hover:text-primary transition-colors">
      {article.title}
    </h3>

    <p class="text-[#617989] text-sm leading-relaxed line-clamp-2 mb-4">
      {article.excerpt}
    </p>

    <div class="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
      <span class="text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
        Baca Selengkapnya 
        <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
      </span>
    </div>
  </div>
</article>
