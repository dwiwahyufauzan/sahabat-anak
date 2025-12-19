<script>
    import { onMount } from 'svelte';
    import { base } from '$app/paths';
    
    let mobileMenuOpen = $state(false);
    let scrolled = $state(false);
    let aboutOpen = $state(false);
    let desktopAboutOpen = $state(false);
    /**
   * @type {string | number | NodeJS.Timeout | null | undefined}
   */
    let closeTimeout;
    
    onMount(() => {
        const handleScroll = () => {
            scrolled = window.scrollY > 10;
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    });
    
    const menuItems = [
        { label: 'Program', href: `${base}/program` },
        { label: 'Roadmap', href: `${base}/roadmap` },
        {
            label: 'Tentang Kami',
            children: [
            { label: 'Sejarah', href: `${base}/sejarah` },
            { label: 'Visi & Misi', href: `${base}/visi-misi` },
            { label: 'Tim Kami', href: `${base}/tim-kami` }
            ]
        },
        { label: 'Berita', href: `${base}/berita` },
        { label: 'Kontak Kami', href: `${base}/contact` }
    ];

    
    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }

    function openDesktopDropdown() {
        if (closeTimeout) {
            clearTimeout(closeTimeout);
            closeTimeout = null;
        }
        desktopAboutOpen = true;
    }

    function closeDesktopDropdown() {
        closeTimeout = setTimeout(() => {
            desktopAboutOpen = false;
        }, 300); // 300ms delay before closing
    }
</script>

<nav class="sticky top-0 z-50 w-full bg-white/98 backdrop-blur-sm transition-all duration-300"
     class:shadow-sm={scrolled}>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16 md:h-20">
            <!-- Logo -->
            <a href="{base}/" class="shrink-0 flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                <img 
                    src="https://www.logoai.com/oss/icons/2021/12/02/u8tXD2V7rro6bok.png" 
                    alt="Logo Sahabat Anak" 
                    class="w-9 h-9 md:w-10 md:h-10 object-contain"
                />
                <span class="font-display font-bold text-lg md:text-xl tracking-tight text-gray-900">
                    Sahabat<span class="text-blue-400">Anak</span>
                </span>
            </a>
            <!-- Desktop Menu -->
            <div class="hidden lg:flex items-center gap-1 xl:gap-2">
            {#each menuItems as item}
                {#if item.children}
                <!-- Updated dropdown to use state and event handlers with delay -->
                <div class="relative" 
                     role="group"
                     onmouseenter={openDesktopDropdown}
                     onmouseleave={closeDesktopDropdown}>
                    <button
                    class="flex items-center gap-1 px-4 py-2 text-[16px] font-medium text-gray-700 hover:text-blue-400 rounded-lg hover:bg-blue-50 transition">
                    {item.label}
                    <svg class="w-4 h-4 transition-transform {desktopAboutOpen ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                    </button>

                    <!-- Dropdown Panel -->
                    {#if desktopAboutOpen}
                    <div
                    class="absolute left-0 mt-3 w-56 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div class="rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-gray-100 p-2">
                        {#each item.children as child}
                        <a
                            href={child.href}
                            class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-400 transition">
                            <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                            <span class="font-medium">{child.label}</span>
                        </a>
                        {/each}
                    </div>
                    </div>
                    {/if}
                </div>
                {:else}
                <a
                    href={item.href}
                    class="px-4 py-2 text-[17px] font-medium text-gray-700 hover:text-blue-400 rounded-lg hover:bg-blue-50 transition">
                    {item.label}
                </a>
                {/if}
            {/each}
            </div>

            
            <!-- CTA Buttons -->
            <div class="hidden lg:flex items-center gap-3">
                <a href="{base}/relawan" class="px-5 py-2.5 rounded-full border-2 border-primary text-blue-400 font-semibold text-[15px] hover:bg-primary/5 transition-all duration-200">
                    Gabung Relawan
                </a>
                <a href="/donasi" class="px-5 py-2.5 rounded-full bg-orange-400 text-white font-semibold text-[15px] shadow-md hover:shadow-lg hover:bg-orange-600 transition-all duration-200">
                    Donasi Sekarang
                </a>
            </div>
            
            <!-- Mobile menu button -->
            <button 
                onclick={toggleMobileMenu}
                class="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu">
                {#if mobileMenuOpen}
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                {:else}
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                {/if}
            </button>
        </div>
    </div>
    
    <!-- Mobile Menu -->
    {#if mobileMenuOpen}
    <div class="lg:hidden border-t border-gray-100 bg-white shadow-lg">
        <div class="px-4 py-4 space-y-1">

        {#each menuItems as item}
            {#if item.children}
            <!-- Mobile Dropdown -->
            <button
                onclick={() => (aboutOpen = !aboutOpen)}
                class="w-full flex justify-between items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                <span>{item.label}</span>
                <svg class="w-4 h-4 transition-transform {aboutOpen ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {#if aboutOpen}
                <div class="ml-4 mt-1 space-y-1 border-l border-blue-100 pl-3">
                {#each item.children as child}
                    <a
                    href={child.href}
                    onclick={toggleMobileMenu}
                    class="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-400 hover:bg-blue-50 rounded-lg transition">
                    {child.label}
                    </a>
                {/each}
                </div>
            {/if}
            {:else}
            <a
                href={item.href}
                onclick={toggleMobileMenu}
                class="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                {item.label}
            </a>
            {/if}
        {/each}

        <!-- CTA -->
        <div class="pt-4 space-y-3 border-t border-gray-100 mt-4">
            <a href="{base}/relawan" onclick={toggleMobileMenu} class="flex items-center justify-center w-full px-5 py-3 rounded-full border-2 border-primary text-primary font-semibold">
            Gabung Relawan
            </a>
            <a href="{base}/donasi" onclick={toggleMobileMenu} class="flex items-center justify-center w-full px-5 py-3 rounded-full bg-orange-400 text-white font-semibold shadow-md">
            Donasi Sekarang
            </a>
        </div>
        </div>
    </div>
    {/if}

</nav>

<style>
    /* Smooth transitions */
    nav {
        transition: box-shadow 0.3s ease;
    }
</style>
