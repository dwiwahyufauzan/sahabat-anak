
<script>
    export let title = '';
    export let description = '';
    export let backgroundImage = '';
    export let backgroundAlt = '';
</script>

<section class="relative w-full">
    <div class="absolute inset-0 bg-linear-to-b from-black/50 to-black/20 z-10 rounded-b-4xl md:rounded-b-[3rem]"></div>
    <div 
        class="h-87.5 md:h-100 bg-cover bg-center rounded-b-4xl md:rounded-b-[3rem] relative" 
        style="background-image: url('{backgroundImage}')"
        role="img"
        aria-label={backgroundAlt}>
        <div class="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
            <h1 class="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight drop-shadow-lg mb-4">
                {title}
            </h1>
            <p class="text-white/90 text-lg md:text-xl font-medium max-w-2xl leading-relaxed drop-shadow-md">
                {description}
            </p>
        </div>
    </div>
</section>
