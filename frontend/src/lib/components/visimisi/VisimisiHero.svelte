<script>
    let scrollProgress = $state(0);
    
    $effect(() => {
        const handleScroll = () => {
            scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    });
</script>

<section class="relative w-full overflow-hidden bg-background-off dark:bg-background-dark pt-10 pb-16 md:py-20">
    <!-- Decorative blobs dengan animasi -->
    <div 
        class="blob-bg bg-primary/20 w-64 h-64 top-0 -left-12.5"
        style="transform: translateY(${scrollProgress * 50}px);"
    ></div>
    <div 
        class="blob-bg bg-secondary/10 w-96 h-96 -bottom-12.5 -right-25"
        style="transform: translateY(${-scrollProgress * 50}px);"
    ></div>
    
    <div class="relative layout-container flex flex-col items-center px-4 md:px-10 max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row items-center gap-10 md:gap-16 w-full">
            <!-- Hero Text -->
            <div class="flex flex-col gap-6 flex-1 text-center md:text-left z-10 animate-fade-in">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-white/10 border border-primary/20 w-fit mx-auto md:mx-0 shadow-sm">
                    <span class="w-2 h-2 rounded-full bg-orange-600"></span>
                    <span class="text-xs font-bold text-primary tracking-wide uppercase">Tentang Kami</span>
                </div>
                
                <h1 class="text-text-main dark:text-white text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                    Membangun Masa Depan <span class="text-primary">Anak Indonesia</span>
                </h1>
                
                <p class="text-text-sub dark:text-gray-300 text-lg md:text-xl font-medium leading-relaxed max-w-xl mx-auto md:mx-0">
                    Bersama mewujudkan generasi penerus yang cerdas, sehat, dan berkarakter mulia untuk Indonesia yang lebih baik.
                </p>
                
            </div>
            
            <!-- Hero Image -->
            <div class="flex-1 w-full max-w-150 z-10">
                <div class="relative w-full aspect-4/3 rounded-2xl md:rounded-[3rem] overflow-hidden shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500 group">
                    <div class="absolute inset-0 bg-linear-to-t from-black/40 to-transparent z-10"></div>
                    <img 
                        alt="Children smiling and playing together outdoors in a sunny environment" 
                        class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        src="https://i.pinimg.com/1200x/72/97/7e/72977e4113a0e066ad2f733df1c7a021.jpg"
                    />
                    <div class="absolute bottom-6 left-6 z-20 text-white">
                        <p class="text-sm font-bold uppercase tracking-wider opacity-90 mb-1">Inspirasi</p>
                        <p class="text-xl font-bold">Harapan untuk Masa Depan</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    .blob-bg {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        z-index: 0;
        opacity: 0.6;
        transition: transform 0.1s linear;
    }
</style>
