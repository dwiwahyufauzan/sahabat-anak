<script>
    let parallaxOffset = $state(0);
    
    $effect(() => {
        const handleScroll = () => {
            parallaxOffset = window.scrollY * 0.2;
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    });
</script>

<div class="relative w-full overflow-hidden">
    <!-- Background decorative shape -->
    <div class="absolute inset-0 bg-blue-400/10 dark:bg-blue-400/5 -z-10 h-3/4 skew-y-2 origin-top-left transform rounded-br-[100px]"></div>
    
    <!-- Floating decorative elements -->
    <div class="absolute top-20 left-10 w-40 h-40 bg-blue-400/5 rounded-full blur-3xl animate-pulse"></div>
    <div class="absolute bottom-10 right-10 w-60 h-60 bg-purple-400/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        <div class="grid md:grid-cols-2 gap-12 items-center">
            <!-- Text Content -->
            <div class="flex flex-col gap-6 text-center md:text-left animate-fade-in">
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.15] tracking-tight">
                    Tim Kami: <br class="hidden lg:block"/>
                    <span class="text-primary">Bersama Melangkah Maju</span>
                </h1>
                
                <p class="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mx-auto md:mx-0 animate-fade-in" style="animation-delay: 0.2s;">
                    Mengenal wajah-wajah penuh dedikasi di balik senyuman anak-anak Indonesia. Kami adalah keluarga besar yang percaya pada satu mimpi: masa depan yang lebih cerah.
                </p>
                
                <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4 animate-fade-in" style="animation-delay: 0.4s;">
                    <button 
                        class="bg-blue-400 hover:bg-primary-dark text-white font-bold h-12 px-8 rounded-full transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/50 hover:-translate-y-1 flex items-center justify-center gap-2 active:scale-95"
                        onclick={() => window.location.href = '/relawan'}
                    >
                        <span>Gabung Relawan</span>
                        <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </button>
                    
                    <button 
                        class="bg-white dark:bg-card-dark text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary font-bold h-12 px-8 rounded-full transition-all duration-300 flex items-center justify-center hover:-translate-y-1 active:scale-95"
                        onclick={() => {
                            const structureSection = document.getElementById('leadership');
                            structureSection?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        Lihat Struktur
                    </button>
                </div>
            </div>
            
            <!-- Image Content -->
            <div class="relative group animate-fade-in" style="animation-delay: 0.6s;">
                <div class="absolute -inset-1 bg-linear-to-r from-primary to-purple-400 rounded-[2.5rem] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                
                <div 
                    class="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-4/3"
                    style="transform: translateY({parallaxOffset}px);"
                >
                    <img 
                        alt="A diverse group of smiling volunteers wearing blue t-shirts working together outdoors" 
                        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0KhQRWypcPEAryN7eKzsA0WimJgwYT-VkcCXQ6qzcSfZLCYqdQPQ4YyRjvl5P81RPw-rXCr0tPKV8Iedvz9NAzUWx8nJ5tX1a90ZEjzO9HkIfgsbvPIL9pf_I10qUoghgWAx3EC7QPjF6MS3r21E37xMIa1J7E3S1oOsMKFpsRRxPsvvhL9RAr9gslKXe3U5ZGZbgHqjXOUZw4wJC-RF4ugsE19qxLXjPcLbv0oBoz5tKoUDfgDMX71Jr8vqIW0cdWL4gjGxHmBnr"
                    />
                    
                    <div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-8">
                        <div class="text-white">
                            <p class="font-bold text-lg">Sahabat Anak Family</p>
                            <p class="text-sm opacity-80">Subang, 2023</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
