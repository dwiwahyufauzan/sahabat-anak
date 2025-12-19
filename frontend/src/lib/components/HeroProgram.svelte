<script>
    import ProgramHeroImage from '$lib/assets/programhero.jpg';
</script>


<section class="relative w-full overflow-hidden">
  <div class="absolute inset-0 bg-linear-to-r from-primary/90 to-primary/40 z-10 mix-blend-multiply"></div>
  <div class="relative w-full h-100 md:h-120 overflow-hidden">
    <img
    src={ProgramHeroImage}
    alt="Program Kami"
    class="absolute inset-0 w-full h-full object-cover"
   />
   </div>

  
  <div class="absolute inset-0 z-20 flex items-center justify-center px-4 md:px-10">
    <div class="max-w-4xl w-full text-center md:text-left flex flex-col md:items-start gap-4 md:gap-6 mt-10">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold uppercase tracking-wider">
        <span class="material-symbols-outlined text-sm">volunteer_activism</span>
        Misi Kemanusiaan
      </div>
      
      <h1 class="text-white text-4xl md:text-6xl font-black leading-[1.1] tracking-tight drop-shadow-sm">
        Program Kami:<br/>Merangkul Masa Depan
      </h1>
      
      <p class="text-white/90 text-lg md:text-xl font-medium max-w-2xl leading-relaxed drop-shadow-sm">
        Beragam inisiatif yang dirancang khusus untuk memberikan perlindungan, pendidikan, dan hak-hak dasar bagi anak-anak marjinal Indonesia.
      </p>
    </div>
  </div>
</section>
