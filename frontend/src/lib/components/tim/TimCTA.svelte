<script>
    let floatingAnimation = $state(0);
    
    $effect(() => {
        const interval = setInterval(() => {
            floatingAnimation = (floatingAnimation + 0.5) % 360;
        }, 50);
        return () => clearInterval(interval);
    });
</script>

<section class="mt-20">
    <div class="relative overflow-hidden rounded-[2.5rem] bg-slate-900 px-6 py-16 sm:px-12 sm:py-24 text-center shadow-2xl">
        <!-- Animated background elements -->
        <div 
            class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl transition-transform duration-300"
            style="transform: translate(-50%, -50%) rotate({floatingAnimation}deg);"
        ></div>
        
        <div 
            class="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl transition-transform duration-300"
            style="transform: translate(50%, 50%) rotate(-{floatingAnimation}deg);"
        ></div>
        
        <!-- Floating particles -->
        <div class="absolute inset-0 overflow-hidden">
            {#each [1, 2, 3, 4, 5, 6, 7, 8] as i}
                <div 
                    class="absolute w-2 h-2 bg-white/30 rounded-full animate-pulse"
                    style="
                        top: {Math.random() * 100}%;
                        left: {Math.random() * 100}%;
                        animation-delay: {i * 0.5}s;
                    "
                ></div>
            {/each}
        </div>
        
        <div class="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-6 animate-fade-in">
            <!-- Icon -->
            <div class="bg-white/10 backdrop-blur-sm p-3 rounded-full inline-block mb-2 animate-bounce-slow">
                <span class="material-symbols-outlined text-blue-400 text-4xl">volunteer_activism</span>
            </div>
            
            <!-- Heading -->
            <h2 class="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Jadilah Bagian dari Perubahan
            </h2>
            
            <!-- Description -->
            <p class="text-slate-300 text-lg">
                Kami selalu membuka pintu untuk individu yang penuh semangat. Bergabunglah dengan tim relawan kami dan buat dampak nyata hari ini.
            </p>
            
            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
                <button 
                    class="bg-blue-400 hover:bg-blue-400-dark text-white font-bold h-14 px-10 rounded-full transition-all duration-300 shadow-lg shadow-blue-400/30 hover:shadow-blue-400/50 hover:-translate-y-1 w-full sm:w-auto active:scale-95"
                    onclick={() => window.location.href = '/relawan'}
                >
                    Daftar Relawan
                </button>
                
                <button 
                    class="bg-transparent border-2 border-slate-700 text-white hover:bg-slate-800 font-bold h-14 px-10 rounded-full transition-all duration-300 w-full sm:w-auto active:scale-95"
                    onclick={() => window.location.href = '/donasi'}
                >
                    Donasi Sekarang
                </button>
            </div>
        </div>
    </div>
</section>