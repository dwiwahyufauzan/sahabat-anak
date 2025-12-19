<script lang="ts">
    const stats = $state([
        { id: 1, value: 20, label: 'Tahun Mengabdi', suffix: '+' },
        { id: 2, value: 5000, label: 'Anak Terbantu', suffix: '+' },
        { id: 3, value: 50, label: 'Komunitas', suffix: '+' },
        { id: 4, value: 1000, label: 'Relawan Aktif', suffix: '+' }
    ]);
    
    let animatedValues: Record<number, number> = $state({ 1: 0, 2: 0, 3: 0, 4: 0 });
    
    $effect(() => {
        stats.forEach(stat => {
            const target = stat.value;
            let current = 0;
            const increment = target / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                animatedValues = { ...animatedValues, [stat.id]: Math.floor(current) };
            }, 20);
            
            return () => clearInterval(timer);
        });
    });
</script>

<section class="w-full bg-blue-400 text-white py-16 relative overflow-hidden">
    <!-- Animated background -->
    <div class="absolute inset-0 opacity-10">
        <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full animate-pulse" style="animation-delay: 0s;"></div>
        <div class="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white rounded-full animate-pulse" style="animation-delay: 0.5s;"></div>
    </div>
    
    <div class="layout-container px-4 md:px-10 max-w-7xl mx-auto relative z-10">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
            {#each stats as stat}
                <div class="flex flex-col items-center gap-2">
                    <span class="text-4xl md:text-5xl font-black tracking-tight">
                        {animatedValues[stat.id] || '0'}{stat.suffix}
                    </span>
                    <span class="text-sm md:text-base font-medium opacity-90">
                        {stat.label}
                    </span>
                </div>
            {/each}
        </div>
        
        <!-- Progress bar -->
        <div class="mt-10 h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
                class="h-full bg-secondary transition-all duration-1000"
                style="width: {((animatedValues[1] || 0) / 20) * 25 + ((animatedValues[2] || 0) / 5000) * 25 + ((animatedValues[3] || 0) / 50) * 25 + ((animatedValues[4] || 0) / 1000) * 25}%"
            ></div>
        </div>
    </div>
</section>
