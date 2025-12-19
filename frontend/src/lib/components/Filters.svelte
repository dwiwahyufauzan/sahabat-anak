<script>
    import ProgramHeroImage from '$lib/assets/programhero.jpg';
</script>

<section class="relative w-full overflow-hidden">
  <div class="relative w-full h-80 sm:h-96 md:h-100 lg:h-120 overflow-hidden">
    <img
    src={ProgramHeroImage}
    alt="Program Kami"
    class="absolute inset-0 w-full h-full object-cover"
   />
   <div class="absolute inset-0 bg-black/50 z-10"></div>
   </div>
  
  <div class="absolute inset-0 z-20 flex items-center justify-center px-4 sm:px-6 md:px-10">
    <div class="max-w-4xl w-full text-center md:text-left flex flex-col items-center md:items-start gap-3 sm:gap-4 md:gap-6 mt-8 sm:mt-10">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs sm:text-sm font-bold uppercase tracking-wider">
        <span class="material-symbols-outlined text-sm">volunteer_activism</span>
        <span class="whitespace-nowrap">Misi Kemanusiaan</span>
      </div>
      
      <h1 class="text-white text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black leading-tight sm:leading-[1.1] tracking-tight drop-shadow-sm">
        Program Kami:<br class="hidden sm:block"/>
        <span class="sm:hidden"> </span>Merangkul Masa Depan
      </h1>
      
      <p class="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl font-medium max-w-xl md:max-w-2xl leading-relaxed drop-shadow-sm mx-auto md:mx-0">
        Beragam inisiatif yang dirancang khusus untuk memberikan perlindungan, pendidikan, dan hak-hak dasar bagi anak-anak marjinal Indonesia.
      </p>
    </div>
  </div>
</section>