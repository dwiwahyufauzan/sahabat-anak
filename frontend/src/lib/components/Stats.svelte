
<script>
  import { onMount } from 'svelte';
  
  let visible = $state(false);
  let counts = $state([0, 0, 0]);
  const targets = [500, 500, 25];
  
  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        visible = true;
        animateCounters();
      }
    }, { threshold: 0.3 });
    
    const section = document.getElementById('stats-section');
    if (section) observer.observe(section);
    
    return () => observer.disconnect();
  });
  
  function animateCounters() {
    const duration = 2000;
    const startTime = performance.now();
    
    function update() {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      
      counts = targets.map(target => Math.floor(target * eased));
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }
  
  const stats = [
    { icon: 'child', color: 'sky', label: 'Anak Terbantu', suffix: '+' },
    { icon: 'people', color: 'orange', label: 'Relawan Aktif', suffix: '+' },
    { icon: 'history', color: 'purple', label: 'Tahun Mengabdi', suffix: '' },
  ];
</script>

<section id="stats-section" class="py-8 sm:py-12 lg:py-16 bg-gray-900">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col items-center mb-6 sm:mb-8 lg:mb-10 text-center {visible ? 'animate-fade-in' : 'opacity-0'}">
      <span class="text-orange-500 font-bold tracking-wider text-xs lg:text-sm uppercase mb-2">Dampak Nyata</span>
      <h2 class="font-bold text-xl sm:text-2xl lg:text-3xl text-white">Statistik Program</h2>
    </div>
    
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-8">
      {#each stats as stat, i}
        <div 
          class="bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 flex items-center gap-3 sm:gap-4 lg:gap-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 {visible ? 'animate-slide-up' : 'opacity-0'}"
          style="animation-delay: {i * 150}ms"
        >
          <div class="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center shrink-0
            {stat.color === 'sky' ? 'bg-sky-100 text-sky-500' : ''}
            {stat.color === 'orange' ? 'bg-orange-100 text-orange-500' : ''}
            {stat.color === 'purple' ? 'bg-purple-100 text-purple-600' : ''}
          ">
            {#if stat.icon === 'child'}
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 lg:w-8 lg:h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4.78 14.78L15 12V7h-1V5h-4v2H9v5l-1.78 4.78c-.12.32-.11.68.02.99.14.32.39.57.72.68.16.06.33.09.5.09h7.08c.17 0 .34-.03.5-.09.33-.11.58-.36.72-.68.13-.31.14-.67.02-.99z"/>
              </svg>
            {:else if stat.icon === 'people'}
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 lg:w-8 lg:h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 lg:w-8 lg:h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
              </svg>
            {/if}
          </div>
          <div>
            <p class="text-2xl lg:text-4xl font-black text-gray-900 mb-1">
              {counts[i]}{stat.suffix}
            </p>
            <p class="text-gray-500 font-medium text-sm lg:text-lg">{stat.label}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>


