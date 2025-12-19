<script>
    import { onMount } from 'svelte';
    
    const images = $state([
        {
            url: 'https://i.pinimg.com/1200x/51/7b/85/517b8571a183ecad5c972348e1fbae71.jpg',
            alt: 'Child smiling broadly while holding a book',
            category: 'Pendidikan'
        },
        {
            url: 'https://i.pinimg.com/736x/fc/b1/9c/fcb19ca9ab1971d4b664e614fb751727.jpg',
            alt: 'Children playing soccer in a field',
            category: 'Olahraga'
        },
        {
            url: 'https://i.pinimg.com/1200x/61/68/71/6168710391de29f8b22d0c1d4b7ba729.jpg',
            alt: 'Group of kids working on an art project',
            category: 'Kreativitas'
        },
        {
            url: 'https://i.pinimg.com/1200x/7a/6e/c4/7a6ec421bb75cfd3ffbd23ef6cdbaa0b.jpg',
            alt: 'Volunteer reading to a child',
            category: 'Pendampingan'
        }
    ]);
    
    let selectedImage = $state(/** @type {{ url: string; alt: string; category: string; } | null} */ (null));
    let currentIndex = $state(0);
    let visible = $state(true);
    
    /**
   * @param {number} index
   */
    function openGallery(index) {
        selectedImage = images[index];
        currentIndex = index;
    }
    
    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        selectedImage = images[currentIndex];
    }
    
    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        selectedImage = images[currentIndex];
    }
    
    // Keyboard navigation
    $effect(() => {
        if (!selectedImage) return;
        
        const handleKeydown = (/** @type {{ key: string; }} */ e) => {
            if (e.key === 'Escape') selectedImage = null;
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };
        
        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    });
</script>

<section id="gallery-section" class="w-full overflow-hidden bg-white dark:bg-[#101c22] pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 {visible ? 'animate-fade-in-up' : 'opacity-0'}">
                Momen Kebahagiaan
            </h2>
            <p class="text-base md:text-lg text-slate-600 dark:text-slate-400 {visible ? 'animate-fade-in-up' : 'opacity-0'}" style="animation-delay: 0.1s;">
                Setiap senyuman adalah cerita kebahagiaan. Lihat momen-momen berharga yang kami ciptakan bersama anak-anak.
            </p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            {#each images as image, index}
                <div 
                    class="aspect-square rounded-xl overflow-hidden relative group cursor-pointer {visible ? 'animate-zoom-in' : 'opacity-0'}" style="animation-delay: {index * 0.1}s;"
                    onclick={() => openGallery(index)}
                    onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && openGallery(index)}
                    role="button"
                    tabindex="0"
                >
                    <img 
                        alt={image.alt}
                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        src={image.url}
                    />
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center">
                        <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-white text-center p-4">
                            <span class="material-symbols-outlined text-3xl mb-2">zoom_in</span>
                            <p class="text-sm font-medium">{image.category}</p>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
        
        <!-- Gallery Modal -->
        {#if selectedImage}
            <div 
                class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                onclick={() => selectedImage = null}
                onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (selectedImage = null)}
                role="button"
                tabindex="0"
            >
                <div 
                    class="relative max-w-4xl w-full" 
                    onclick={(e) => e.stopPropagation()}
                    onkeydown={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    tabindex="-1"
                >
                    <!-- Close Button -->
                    <button 
                        class="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm"
                        onclick={() => selectedImage = null}
                    >
                        <span class="material-symbols-outlined">close</span>
                    </button>
                    
                    <!-- Navigation Buttons -->
                    <button 
                        class="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm"
                        onclick={prevImage}
                    >
                        <span class="material-symbols-outlined">chevron_left</span>
                    </button>
                    
                    <button 
                        class="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm"
                        onclick={nextImage}
                    >
                        <span class="material-symbols-outlined">chevron_right</span>
                    </button>
                    
                    <!-- Image -->
                    <img 
                        alt={selectedImage.alt}
                        class="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                        src={selectedImage.url}
                    />
                    
                    <!-- Caption -->
                    <div class="mt-4 text-white text-center">
                        <p class="text-lg font-medium">{selectedImage.category}</p>
                        <p class="text-sm text-white/70 mt-1">{currentIndex + 1} / {images.length}</p>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</section>
