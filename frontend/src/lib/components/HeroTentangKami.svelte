<script>
    let scrollY = $state(0);
    
    $effect(() => {
        const handleScroll = () => scrollY = window.scrollY;
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    });
</script>

<section class="relative w-full h-96 sm:h-100 md:h-120 lg:h-150 overflow-hidden flex items-end pb-12 sm:pb-16 md:items-center md:pb-0">
    <!-- Background Image dengan Parallax -->
    <div 
        class="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-1000"
        style="
            background-image: url('https://i.pinimg.com/1200x/01/32/21/013221d9bd7914ac080b62bbce739a41.jpg');
            transform: translateY(${scrollY * 0.5}px);
        "
    ></div>
    
    <div class="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-2xl text-white animate-fade-in">
            <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight mb-4 sm:mb-5 md:mb-6 drop-shadow-sm">
                Tentang Kami: <br/>
                <span class="text-white">Sahabat Anak Indonesia</span>
            </h1>
            <p class="text-base sm:text-lg md:text-xl font-medium opacity-90 leading-relaxed mb-6 sm:mb-7 md:mb-8 max-w-xl">
                Mewujudkan masa depan ceria bagi setiap anak Indonesia melalui persahabatan, pendidikan, dan dukungan keluarga.
            </p>
        </div>
    </div>
</section>
