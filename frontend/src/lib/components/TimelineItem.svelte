<script lang="ts">
    let { item } = $props();
    
    let isRight = $derived(item.position === 'right');
    let isHighlight = $derived(item.highlight || false);
    let iconColor = $derived('bg-gradient-to-br from-orange-500 to-orange-700');
    let textColor = $derived('text-orange-800');
    let accentColor = $derived('from-orange-50 to-orange-100');
</script>

<div class="relative flex flex-col md:flex-row items-center md:justify-between group py-4">
    <!-- Desktop: Content Left/Right -->
    <div 
        class="md:w-5/12 flex mt-6 md:mt-0"
        class:order-2={isRight}
        class:order-1={!isRight}
        class:md:order-1={isRight}
        class:md:order-3={!isRight}
        class:md:justify-end={isRight}
        class:md:justify-start={!isRight}>
        
        <!-- Enhanced card with better shadows, gradients, and hover effects -->
        <div class="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100 w-full md:max-w-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] overflow-hidden group/card">
            <!-- Gradient accent bar on top -->
            <div class="absolute top-0 left-0 right-0 h-1 bg-linear-to-r {accentColor} opacity-60"></div>
            
            <!-- Subtle background pattern -->
            <div class="absolute inset-0 opacity-[0.03] bg-linear-to-br from-gray-900 to-transparent pointer-events-none"></div>
            
            <!-- Year badge in top right -->
            <div class="hidden md:flex absolute top-4 right-4 px-3 py-1 rounded-full bg-linear-to-r {accentColor} border border-orange-200">
                <span class="text-orange-600 font-bold text-sm">{item.year}</span>
            </div>
            
            <!-- Content -->
            <div class="relative z-10 pr-4 md:pr-16">
                <h3 class="text-[#111618] text-xl font-bold mb-3 flex items-center gap-2 group-hover/card:text-orange-600 transition-colors duration-300">
                    {item.title}
                    <!-- Added subtle animated indicator -->
                    <span class="inline-block w-2 h-2 rounded-full bg-orange-500 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></span>
                </h3>
                <p class="text-[#617c89] text-sm leading-relaxed group-hover/card:text-gray-700 transition-colors duration-300">
                    {item.description}
                </p>
            </div>
            
            <!-- Hover glow effect -->
            <div class="absolute -inset-1 bg-linear-to-r from-orange-400/20 to-orange-600/20 rounded-2xl blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 -z-10"></div>
        </div>
    </div>
    
    <!-- Enhanced center icon with pulse animation and better gradients -->
    <div 
        class="absolute left-4 md:left-1/2 -ml-4 md:-ml-7 flex items-center justify-center size-10 md:size-14 rounded-full border-4 border-white shadow-xl z-10 order-1 {iconColor} transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
        class:ring-4={isHighlight}
        class:ring-orange-300={isHighlight}
        class:ring-opacity-50={isHighlight}>
        <span class="material-symbols-outlined text-white text-base md:text-2xl drop-shadow-md">{item.icon}</span>
        
        <!-- Added subtle rotating ring effect -->
        <div class="absolute inset-0 rounded-full border-2 border-white/30 animate-spin" style="animation-duration: 3s;"></div>
    </div>
    
    <!-- Enhanced year label with badge design -->
    <div 
        class="hidden md:flex md:w-5/12 pl-12 md:pl-0 items-center order-3"
        class:md:order-3={isRight}
        class:md:order-1={!isRight}
        class:md:justify-start={isRight}
        class:md:justify-end={!isRight}>
        
        <span class="inline-flex items-center px-4 py-2 rounded-full bg-linear-to-r {accentColor} font-bold text-base md:text-lg {textColor} shadow-md border border-gray-200 backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg group-hover:scale-105"
              class:ml-8={isRight}
              class:mr-8={!isRight}>
            {item.label}
        </span>
    </div>
</div>

<style>
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>