<script>
    import { testimonials } from '$lib/data/content.js';
    import { onMount } from 'svelte';
    
    let visible = false;
    
    onMount(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    visible = true;
                }
            });
        }, { threshold: 0.1 });
        
        const section = document.querySelector('#testimonials-section');
        if (section) observer.observe(section);
        
        return () => observer.disconnect();
    });
</script>

<div id="testimonials-section" class="py-20 bg-gray-950 relative overflow-hidden">
    <!-- Decoration -->
    <span class="material-symbols-outlined absolute top-10 left-10 text-9xl text-primary/10 rotate-12 select-none {visible ? 'animate-fade-in' : 'opacity-0'}">format_quote</span>
    <span class="material-symbols-outlined absolute bottom-10 right-10 text-9xl text-primary/10 -rotate-12 select-none {visible ? 'animate-fade-in' : 'opacity-0'}">format_quote</span>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 class="font-display text-3xl font-bold text-center mb-16 text-white {visible ? 'animate-fade-in-up' : 'opacity-0'}">
            Cerita Mereka
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {#each testimonials as testimonial, index (testimonial.id)}
                <div class="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative {visible ? 'animate-scale-in' : 'opacity-0'}" style="animation-delay: {index * 0.2}s;">
                    <div class="text-secondary mb-4 sm:mb-6">
                        <span class="material-symbols-outlined text-3xl sm:text-4xl">format_quote</span>
                    </div>
                    <p class="text-base sm:text-lg md:text-xl font-medium text-gray-700 mb-6 sm:mb-8 leading-relaxed">
                        "{testimonial.quote}"
                    </p>
                    <div class="flex items-center gap-4">
                        <img src={testimonial.avatar} 
                             alt={testimonial.name} 
                             class="w-14 h-14 rounded-full object-cover bg-gray-200" />
                        <div>
                            <h4 class="font-bold text-gray-900 font-display">
                                {testimonial.name}
                            </h4>
                            <p class="text-sm text-primary font-bold">{testimonial.role}</p>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>
