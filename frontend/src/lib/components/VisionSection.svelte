<script>
    import { onMount } from 'svelte';
    
    let visible = false;
    
    onMount(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    visible = true;
                }
            });
        }, { threshold: 0.2 });
        
        const section = document.querySelector('#visi-lima-tahun');
        if (section) observer.observe(section);
        
        return () => observer.disconnect();
    });
</script>

<section id="visi-lima-tahun" class="px-4 md:px-40 py-10 max-w-7xl mx-auto w-full">
    <div class="flex flex-col items-center text-center gap-4 {visible ? 'animate-fade-in-up' : 'opacity-0'}">
        <div class="size-12 rounded-full bg-blue-50 text-blue-400 flex items-center justify-center mb-2 {visible ? 'animate-bounce-slow' : ''}">
            <span class="material-symbols-outlined text-3xl">rocket_launch</span>
        </div>
        
        <h2 class="text-[#111618] tracking-tight text-[28px] md:text-4xl font-bold leading-tight px-4 pb-3">
            Visi Lima Tahun ke Depan
        </h2>
        
        <p class="text-[#617c89] text-base md:text-lg max-w-2xl">
            Kami telah menyusun strategi komprehensif untuk memastikan setiap anak mendapatkan haknya. 
            Berikut adalah tahapan perjalanan kami menuju tahun 2029.
        </p>
    </div>
</section>
