<script>
  import { base } from '$app/paths';
  import HeroImage from '$lib/assets/hero-image.jpg';
  let visible = $state(false);
  
  $effect(() => {
    visible = true;
  });
  
  const volunteers = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuABfi8BFKHMrlMuvuAK4NQG7cxE8AnuLTBbietqKuH4i-znOOe2NfZd1r_Xw0iSnZYVizEdSrfJWw2tZcYFwC8lYYv0MbES-0zkSwQeh_fwXq4kJnZourtaws3IudvQtfcaftRSLaGobkMhdZ2Z8P4ID01md7uYMkiA759_-AB_qZgyVKRZJZpfNn0q1uX5V-JMEnV9M4IjjxdLIAcd9MKkFN3W7jZ5lnYRWjxzOuJKB-CViebRpGxx-Rkin_Jf2UeP7aa1Y94y9JMl',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCz9dOChOPtAabUprNpecUtdf4mM1BB91W6q-83tdNT5fAzQngSmb8fHAEz_Zx6hRZtjNSPV7fJDQFGhTEaQjzZjmzyrDrdRLlEY1gHgAaTiuHhpWqKCAES_CsDPK6Ya1rUiaJ-NkKO_Ny2SbgS7NbfGQ-w3pdyjA9x3CY9V_QE_KIv-lcZDSvk4N4hPI4gW5CgD2WBwqXh9L8snN6AuLYE_qjUuu0anPvpwxujjqgfpiU448_nxUG9AvulhPWoe1EFgT2nNMLC8VFA',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC8yemlyF8enAynMtPoPSoDDko7-9yMZyGzmemOg5oGbg6Bp7NzlSzY7HyvIcnleAmKbWG4QrbY244Zmm7G6PZa8cSOrb-JGZIBkFTV-GVCwpLw9Afs5sflAXS-lyr00D0IwzjpGakxvuuzsWKD7U0DDVicxS1fqd4Z4YmGtMRgNET6bIZa5YGms0hdRUjHv98QLkNYEUvO7do4hrJCnzBgsstpjQzcnX-WnkY5IIv7LusOlyNBFeY9PBl4HJ207ClkbwQ_Gu1MpupH',
  ];
</script>

<section class="relative w-full overflow-hidden bg-white pt-6 sm:pt-8 pb-12 sm:pb-16 lg:pt-16 lg:pb-24">
  <!-- Background Decorations -->
  <div class="absolute top-0 right-0 -translate-y-12 translate-x-12 w-40 sm:w-48 md:w-64 h-40 sm:h-48 md:h-64 bg-sky-400/20 rounded-full blur-3xl"></div>
  <div class="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
  
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      <!-- Text Content -->
      <div class="flex flex-col gap-5 lg:gap-6 text-center lg:text-left order-2 lg:order-1 {visible ? 'animate-slide-in-left' : 'opacity-0'}">
        <div class="inline-flex items-center gap-2 self-center lg:self-start px-4 py-2 bg-sky-400/10 rounded-full text-sky-500 text-sm font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>Membangun Harapan Baru</span>
        </div>
        
        <h1 class="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-gray-900 leading-tight tracking-tight">
          Bersama Membangun 
          <span class="text-transparent bg-clip-text bg-linear-to-r from-sky-400 to-blue-600 relative inline-block">
            Masa Depan Anak
            <svg class="absolute w-full h-2 lg:h-3 -bottom-1 left-0 text-orange-500 opacity-60" fill="none" viewBox="0 0 200 9" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 7C28.5 4 78.5 1 198 3" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
            </svg>
          </span>
        </h1>
        
        <p class="text-base lg:text-lg text-gray-500 leading-relaxed max-w-xl mx-auto lg:mx-0">
          Kami percaya setiap anak berhak mendapatkan pendidikan, kasih sayang, dan masa depan yang cerah. Mari bergandengan tangan wujudkan mimpi mereka.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start pt-2 lg:pt-4">
          <a href="{base}/donasi" class="h-12 lg:h-14 px-6 lg:px-8 rounded-2xl bg-orange-500 text-white font-bold text-sm lg:text-base shadow-xl shadow-orange-500/30 hover:bg-orange-600 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
            <span>Donasi Sekarang</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </a>
          <a href="{base}/relawan" class="h-12 lg:h-14 px-6 lg:px-8 rounded-2xl bg-white border-2 border-gray-200 text-gray-800 font-bold text-sm lg:text-base hover:border-sky-400 hover:text-sky-400 hover:bg-sky-50 transition-all duration-300 flex items-center justify-center gap-2">
            <span>Gabung Relawan</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </a>
        </div>
        
        <div class="pt-4 lg:pt-6 flex items-center justify-center lg:justify-start gap-4">
          <div class="flex -space-x-3">
            {#each volunteers as src, i}
              <img 
                alt="Volunteer" 
                class="w-9 h-9 lg:w-10 lg:h-10 rounded-full border-2 border-white object-cover"
                {src}
                style="animation-delay: {i * 100}ms"
              />
            {/each}
            <div class="w-9 h-9 lg:w-10 lg:h-10 rounded-full border-2 border-white bg-sky-400 text-white flex items-center justify-center text-xs font-bold">+2k</div>
          </div>
          <p class="text-sm font-semibold text-gray-500">Telah bergabung bersama kami</p>
        </div>
      </div>
      
      <!-- Image Composition -->
      <div class="relative h-87.5 sm:h-100 lg:h-137.5 flex items-center justify-center order-1 lg:order-2 {visible ? 'animate-slide-in-right' : 'opacity-0'}">
        <div class="absolute inset-0 bg-sky-400/10 rounded-full blur-3xl transform scale-75 opacity-50"></div>
        
        <div class="relative w-full h-full max-w-md lg:max-w-lg mx-auto">
          <!-- Main Image -->
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] sm:w-[85%] h-[80%] sm:h-[85%] bg-yellow-200 rounded-3xl lg:rounded-[2.5rem] rotate-3 overflow-hidden shadow-2xl z-10 border-4 border-white">
            <img 
              alt="Anak-anak bahagia" 
              class="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-700" 
              src="{HeroImage}"
            />
          </div>
          
          <!-- Floating Elements -->
          <div class="absolute top-[8%] sm:top-[10%] left-[5%] sm:-left-[5%] bg-white p-3 lg:p-4 rounded-xl lg:rounded-2xl shadow-xl z-20 animate-bounce-slow">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 lg:w-10 lg:h-10 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
            </svg>
          </div>
          
          <div class="absolute bottom-[12%] sm:bottom-[15%] right-[2%] sm:-right-[5%] bg-white p-3 rounded-xl lg:rounded-2xl shadow-xl z-20 flex items-center gap-2 lg:gap-3 animate-float">
            <div class="w-8 h-8 lg:w-10 lg:h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 lg:w-5 lg:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
            </div>
            <div>
              <p class="text-[10px] lg:text-xs text-gray-500 font-bold">Program Pendidikan</p>
              <p class="text-xs lg:text-sm font-black text-gray-800">Aktif Berjalan</p>
            </div>
          </div>
          
          <!-- Decorative Star -->
          <svg class="absolute -top-2 lg:-top-4 right-4 lg:-right-4 w-16 h-16 lg:w-24 lg:h-24 text-sky-400 opacity-80 animate-pulse-slow" fill="currentColor" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50.5 12.5C53.5 18.5 60.5 20.5 66.5 18.5C64.5 24.5 67.5 31.5 73.5 33.5C67.5 36.5 65.5 43.5 68.5 49.5C62.5 47.5 55.5 50.5 53.5 56.5C50.5 50.5 43.5 48.5 37.5 50.5C39.5 44.5 36.5 37.5 30.5 35.5C36.5 32.5 38.5 25.5 35.5 19.5C41.5 21.5 48.5 18.5 50.5 12.5Z"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</section>

