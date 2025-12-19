<script>
  import { base } from '$app/paths';
  console.log('[v0] CTA section loaded');
</script>

<div class="min-h-screen">
  
  <!-- CTA Section -->
  <div class="py-12 sm:py-16 md:py-20 px-4 relative overflow-hidden">
    <!-- Background gradient circles -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-10 left-10 w-96 h-96 bg-linear-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-20 w-80 h-80 bg-linear-to-br from-blue-400/15 to-cyan-400/15 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/3 w-72 h-72 bg-linear-to-br from-pink-400/10 to-rose-400/10 rounded-full blur-3xl"></div>
    </div>

    <div class="max-w-5xl mx-auto bg-linear-to-br from-indigo-500 via-blue-500 to-indigo-600 rounded-2xl sm:rounded-3xl md:rounded-[3rem] p-6 sm:p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
      <!-- Inner gradient decorations -->
      <div class="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div class="absolute bottom-0 left-0 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl -ml-20 -mb-20"></div>
      
      <!-- Floating SVG icons -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <div class="absolute top-12 left-12">
          <svg class="w-12 h-12 text-white/40" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        
        <div class="absolute top-20 right-16">
          <svg class="w-10 h-10 text-yellow-300/50" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        </div>
        
        <div class="absolute bottom-24 right-20">
          <svg class="w-14 h-14 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"/>
          </svg>
        </div>
        
        <div class="absolute bottom-16 left-24">
          <svg class="w-8 h-8 text-pink-300/40" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0l2.163 5.837L20 8l-5.837 2.163L12 16l-2.163-5.837L4 8l5.837-2.163L12 0z"/>
            <path d="M19 14l1.081 2.919L23 18l-2.919 1.081L19 22l-1.081-2.919L15 18l2.919-1.081L19 14z"/>
          </svg>
        </div>
        
        <div class="absolute top-32 right-32">
          <svg class="w-11 h-11 text-orange-300/35" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
          </svg>
        </div>
      </div>
      
      <div class="relative z-10">
        <div class="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
          <span class="text-white font-semibold text-sm">✨ Mulai Berbagi Kebaikan</span>
        </div>
        
        <h2 class="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-4 sm:mb-6">
          Siap Menjadi Pahlawan Mereka?
        </h2>
        <p class="text-white/90 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 font-medium leading-relaxed">
          Satu langkah kecil darimu bisa menjadi lompatan besar bagi masa depan mereka. Bergabunglah dalam gerakan kebaikan ini.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a href="{base}/donasi" class="group px-8 py-4 rounded-2xl bg-orange-500 text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-orange-400 transition-all duration-300 hover:scale-105 relative overflow-hidden">
            <span class="relative z-10">Donasi Sekarang</span>
            <div class="absolute inset-0 bg-linear-to-r from-orange-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </a>
          <a href="{base}/relawan" class="px-8 py-4 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40 text-white font-bold text-lg hover:bg-white hover:text-indigo-600 transition-all duration-300 hover:scale-105 shadow-lg">
            Jadi Relawan
          </a>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div class="text-4xl font-black text-white mb-2">500+</div>
            <div class="text-white/80 font-medium">Anak Terbantu</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div class="text-4xl font-black text-white mb-2">1000+</div>
            <div class="text-white/80 font-medium">Donatur Aktif</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div class="text-4xl font-black text-white mb-2">100%</div>
            <div class="text-white/80 font-medium">Transparan</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
