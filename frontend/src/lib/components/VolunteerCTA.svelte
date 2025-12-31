<script>
  import { base } from '$app/paths';
</script>

<section class="w-full bg-slate-100 py-12 sm:py-14 md:py-16 lg:py-24">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 text-center">
    <div class="size-14 sm:size-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 text-blue-500">
      <span class="material-symbols-outlined text-3xl sm:text-4xl">handshake</span>
    </div>
    
    <h2 class="text-slate-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-3 sm:mb-4">
      Ingin terlibat langsung?
    </h2>
    
    <p class="text-slate-600 text-sm sm:text-base md:text-lg mb-6 sm:mb-7 md:mb-8 max-w-2xl mx-auto">
      Mari berkontribusi tenaga dan waktu Anda sebagai relawan untuk masa depan anak-anak yang lebih cerah.
    </p>
    
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <a href="{base}/relawan" class="w-full sm:w-auto px-8 h-12 rounded-full bg-blue-500 hover:bg-blue-700 text-white font-bold text-base transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2">
        <span class="material-symbols-outlined">how_to_reg</span>
        Daftar Jadi Relawan
      </a>
      
      <a href="{base}/contact" class="w-full sm:w-auto px-8 h-12 rounded-full bg-white border-2 border-slate-900 hover:border-blue-500 text-slate-900 hover:text-blue-500 font-bold text-base transition-all flex items-center justify-center gap-2">
        <span class="material-symbols-outlined">contact_support</span>
        Tanya Dulu
      </a>
    </div>
  </div>
</section>
