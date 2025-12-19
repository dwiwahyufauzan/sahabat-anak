<script>
  function scrollToForm() {
    const form = document.getElementById('volunteer-form');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
</script>

<section class="w-full max-w-360 px-4 md:px-10 py-6 md:py-8">
  <div 
    class="flex flex-col min-h-137.5 gap-8 bg-cover bg-center bg-no-repeat rounded-[3rem] items-start justify-center px-6 md:px-16 relative overflow-hidden group shadow-2xl shadow-sky-100" 
    style='background-image: url("https://i.pinimg.com/1200x/7b/da/26/7bda2615e5d81d8085d636d6364ffb2b.jpg");'
    role="img"
    aria-label="Group of diverse volunteers smiling and helping children in a park"
  >
    <div class="absolute inset-0 bg-linear-to-r from-sky-900/90 via-sky-800/60 to-transparent z-0"></div>
    <div class="absolute top-10 right-10 w-32 h-32 bg-secondary rounded-full mix-blend-overlay opacity-80 blur-2xl animate-pulse"></div>
    <div class="absolute bottom-10 left-1/2 w-64 h-64 bg-primary rounded-full mix-blend-overlay opacity-60 blur-3xl"></div>

    <div class="flex flex-col gap-6 text-left max-w-3xl z-10 relative">
      <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-1.5 w-fit">
        <span class="size-2 rounded-full bg-orange-400"></span>
        <span class="text-white text-sm font-bold tracking-wide">Mari Berbagi Kebahagiaan</span>
      </div>

      <h1 class="text-white text-5xl md:text-7xl font-black leading-tight tracking-tight drop-shadow-sm">
        Jadilah Pahlawan <br/>
        <span class="text-primary text-transparent bg-clip-text bg-linear-to-r from-sky-200 to-white">Bagi Mereka</span>
      </h1>

      <h2 class="text-sky-50 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
        Bergabunglah dengan ribuan relawan Sahabat Anak. Waktu dan kepedulian Anda dapat mengubah masa depan seorang anak hari ini.
      </h2>

      <div class="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
        <button 
          on:click={scrollToForm}
          class="flex items-center justify-center rounded-full h-14 px-10 bg-orange-400 text-white hover:bg-secondary-hover transition-all shadow-[0_10px_20px_-5px_rgba(255,140,0,0.4)] hover:shadow-[0_15px_25px_-5px_rgba(255,140,0,0.5)] transform hover:-translate-y-1 text-lg font-bold tracking-wide"
        >
          Gabung Sekarang
        </button>
        <a href="/program" class="flex items-center justify-center rounded-full h-14 px-10 bg-white text-sky-900 hover:bg-sky-50 transition-all text-lg font-bold shadow-lg">
          Pelajari Program
        </a>
      </div>
    </div>
  </div>
</section>
