<script lang="ts">
  import { base } from '$app/paths';
  import type { Program } from '$lib/types/program';
  
  export let program: Program;
  
  type CategoryColor = 'blue' | 'orange' | 'green' | 'red' | 'purple' | 'yellow';
  
  const categoryColors: Record<CategoryColor, string> = {
    blue: 'bg-blue-50 text-primary',
    orange: 'bg-orange-50 text-accent',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-500',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600'
  };
</script>

<div class="flex flex-col bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group">
    <!-- Image -->
    <div class="relative h-48 sm:h-56 md:h-64 overflow-hidden">
        <div class="absolute inset-0 bg-primary/20 z-10 opacity-0 group-hover:opacity-10 transition-opacity"></div>
        <div 
            class="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style="background-image: url('{program.image}');"
            role="img"
            aria-label={program.alt}>
        </div>
        <div class="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md z-20">
            <span class="material-symbols-outlined text-primary text-2xl">{program.icon}</span>
        </div>
    </div>
    
    <!-- Content -->
    <div class="p-5 sm:p-6 md:p-8 flex flex-col flex-1">
        <h3 class="text-xl sm:text-2xl font-bold text-text-main mb-2 sm:mb-3">{program.title}</h3>
        <p class="text-sm sm:text-base text-text-sub mb-4 sm:mb-5 md:mb-6 leading-relaxed flex-1">{program.description}</p>
        
        <a href="{base}/program/{program.slug}" class="w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gray-200 hover:bg-blue-400 hover:text-white text-primary text-sm sm:text-base font-bold transition-colors flex items-center justify-center gap-2 group/btn">
            Pelajari Lebih Lanjut
            <span class="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">
                arrow_forward
            </span>
        </a>
    </div>
</div>
