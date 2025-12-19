<script>
    let isVisible = $state(false);
    
    $effect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    isVisible = true;
                }
            },
            { threshold: 0.3 }
        );
        
        const element = document.querySelector('#vision-section');
        if (element) observer.observe(element);
        
        return () => observer.disconnect();
    });
</script>

<section id="vision-section" class="relative w-full py-16 md:py-24 bg-white dark:bg-background-dark">
    <div class="layout-container px-4 md:px-10 max-w-240 mx-auto text-center">
        <div class="mb-6 flex justify-center">
            <div class="size-16 rounded-full bg-blue-400/10 flex items-center justify-center text-blue-400 mb-4 transform {isVisible ? 'scale-100' : 'scale-0'} transition-transform duration-700">
                <span class="material-symbols-outlined text-[32px]">visibility</span>
            </div>
        </div>
        
        <h2 class="text-text-main dark:text-white text-3xl md:text-4xl font-black mb-8 tracking-tight animate-fade-in"
            style="opacity: {isVisible ? 1 : 0}; transform: translateY({isVisible ? 0 : '20px'});">
            Visi Sahabat Anak
        </h2>
        
        <div class="relative p-8 md:p-12 rounded-[2.5rem] bg-linear-to-br from-[#f0f9ff] to-[#e0f2fe] dark:from-gray-800 dark:to-gray-900 border border-primary/10 shadow-card transform {isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)'} transition-all duration-700">
            <span class="material-symbols-outlined absolute top-6 left-6 text-6xl text-primary/10 select-none">format_quote</span>
            
            <p class="relative z-10 text-xl md:text-2xl lg:text-[28px] font-bold leading-relaxed text-text-main dark:text-white">
                "Membantu dalam mewujudkan anak Indonesia yang <span class="text-primary">sehat</span>, <span class="text-primary">cerdas</span>, <span class="text-primary">kreatif</span>, berkarakter, dan berdaya, sehingga mampu menjadi agen perubahan positif bagi bangsa dan masyarakat di masa depan."
            </p>
            
            <div class="mt-8 flex justify-center gap-2">
                <div class="h-1.5 w-1.5 rounded-full bg-primary/40 {isVisible ? 'animate-pulse' : ''}" style="animation-delay: 0s;"></div>
                <div class="h-1.5 w-12 rounded-full bg-primary {isVisible ? 'animate-pulse' : ''}" style="animation-delay: 0.2s;"></div>
                <div class="h-1.5 w-1.5 rounded-full bg-primary/40 {isVisible ? 'animate-pulse' : ''}" style="animation-delay: 0.4s;"></div>
            </div>
        </div>
    </div>
</section>
