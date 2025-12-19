<script>
    import { base } from '$app/paths';
    import { heroData } from '$lib/data/roadmap';
</script>

<section class="px-4 sm:px-6 md:px-10 py-4 sm:py-5 md:py-6 lg:py-10 max-w-7xl mx-auto w-full">
    <div 
        class="rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden relative min-h-96 sm:min-h-100 md:min-h-120 lg:min-h-140x flex flex-col items-center justify-center text-center p-6 sm:p-8 md:p-10 lg:p-12 gap-4 sm:gap-5 md:gap-6 group"
        style="background-image: linear-gradient(rgba(19, 164, 236, 0.85), rgba(16, 28, 34, 0.4)), url('{heroData.image}'); background-size: cover; background-position: center;"
        role="img"
        aria-label={heroData.alt}>
        
        <div class="flex flex-col gap-3 sm:gap-4 max-w-3xl mx-auto z-10 animate-fade-in-up">
            <h1 class="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight tracking-tight drop-shadow-sm text-center px-2">
                {@html heroData.title.replace('2025-2029', '<br class="hidden md:block"/>Perjalanan 2025-2029')}
            </h1>
            
            <h2 class="text-white/90 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-xl sm:max-w-2xl mx-auto text-center px-2">
                {heroData.subtitle}
            </h2>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 z-10 w-full sm:w-auto justify-center mt-2 sm:mt-4 px-4 sm:px-0">
            <a href="#visi-lima-tahun" class="flex items-center justify-center rounded-full h-11 sm:h-12 px-6 sm:px-8 bg-white text-primary text-sm sm:text-base font-bold hover:bg-gray-50 transition-colors shadow-lg">
                Pelajari Rencana Kami
            </a>
            <a href="{base}/berita" class="flex items-center justify-center rounded-full h-11 sm:h-12 px-6 sm:px-8 bg-transparent border-2 border-white text-white text-sm sm:text-base font-bold hover:bg-white/10 transition-colors">
                Lihat Berita Kami
            </a>
        </div>
    </div>
</section>