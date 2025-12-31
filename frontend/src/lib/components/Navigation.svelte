<script>
    import { onMount } from 'svelte';
    import { base } from '$app/paths';
    
    let mobileMenuOpen = $state(false);
    let scrolled = $state(false);
    let mobileDropdownOpen = $state('');
    let desktopDropdownOpen = $state('');
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
        {
            label: 'Aktivitas',
            children: [
                { label: 'Program', href: `${base}/program` },
                { label: 'Event', href: `${base}/event` },
                { label: 'Berita', href: `${base}/berita` }
            ]
        },
        { label: 'Roadmap', href: `${base}/roadmap` },
        { label: 'Kontak Kami', href: `${base}/contact` },
        {
            label: 'Tentang Kami',
            children: [
                { label: 'Sejarah', href: `${base}/sejarah` },
                { label: 'Visi & Misi', href: `${base}/visi-misi` },
                { label: 'Tim Kami', href: `${base}/tim-kami` }
            ]
        }
    ];

    
    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }

    /**
   * @param {string} label
   */
    function openDesktopDropdown(label) {
        if (closeTimeout) {
            clearTimeout(closeTimeout);
            closeTimeout = null;
        }
        desktopDropdownOpen = label;
    }

    function closeDesktopDropdown() {
        closeTimeout = setTimeout(() => {
            desktopDropdownOpen = '';
        }, 300); // 300ms delay before closing
    }

    /**
   * @param {string} label
   */
    function toggleMobileDropdown(label) {
        mobileDropdownOpen = mobileDropdownOpen === label ? '' : label;
    }
</script>

<nav class="sticky top-0 z-50 w-full bg-white/98 backdrop-blur-sm transition-all duration-300"
     class:shadow-sm={scrolled}>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16 md:h-20">
            <!-- Logo -->
            <a href="{base}/" class="shrink-0 flex items-center gap-2.5 group">
                <div class="relative">
                    <img 
                        src="https://www.logoai.com/oss/icons/2021/12/02/u8tXD2V7rro6bok.png" 
                        alt="Logo Sahabat Anak" 
                        class="w-9 h-9 md:w-10 md:h-10 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                    />
                    <div class="absolute inset-0 bg-blue-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <span class="font-display font-bold text-lg md:text-xl tracking-tight text-gray-900 transition-all duration-300 group-hover:tracking-wide">
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
                     onmouseenter={() => openDesktopDropdown(item.label)}
                     onmouseleave={closeDesktopDropdown}>
                    <button
                    class="relative flex items-center gap-1 px-4 py-2 text-[16px] font-medium text-gray-700 hover:text-blue-400 rounded-lg overflow-hidden group/btn transition-all duration-300 hover:shadow-sm">
                    <span class="absolute inset-0 bg-blue-50 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></span>
                    <span class="relative z-10">{item.label}</span>
                    <svg class="relative z-10 w-4 h-4 transition-all duration-300 {desktopDropdownOpen === item.label ? 'rotate-180' : ''} group-hover/btn:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                    </button>

                    <!-- Dropdown Panel -->
                    {#if desktopDropdownOpen === item.label}
                    <div
                    class="absolute left-0 mt-3 w-56 dropdown-enter">
                    <div class="rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-gray-100 p-2 overflow-hidden">
                        <div class="absolute inset-0 bg-linear-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        {#each item.children as child, index}
                        <a
                            href={child.href}
                            class="relative flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-400 transition-all duration-300 group/item overflow-hidden"
                            style="animation-delay: {index * 50}ms">
                            <span class="absolute inset-0 bg-blue-400/5 transform scale-x-0 group-hover/item:scale-x-100 transition-transform duration-300 origin-left"></span>
                            <span class="w-2 h-2 rounded-full bg-blue-400 transition-all duration-300 group-hover/item:scale-125 group-hover/item:shadow-md relative z-10"></span>
                            <span class="font-medium relative z-10 transition-transform duration-300 group-hover/item:translate-x-1">{child.label}</span>
                            <svg class="w-4 h-4 ml-auto opacity-0 group-hover/item:opacity-100 transform translate-x-2 group-hover/item:translate-x-0 transition-all duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                        {/each}
                    </div>
                    </div>
                    {/if}
                </div>
                {:else}
                <a
                    href={item.href}
                    class="relative px-4 py-2 text-[17px] font-medium text-gray-700 hover:text-blue-400 rounded-lg overflow-hidden group/link transition-all duration-300">
                    <span class="absolute inset-0 bg-blue-50 transform scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left"></span>
                    <span class="relative z-10">{item.label}</span>
                    <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-400 group-hover/link:w-3/4 transition-all duration-300"></span>
                </a>
                {/if}
            {/each}
            </div>

            <!-- CTA Buttons -->
            <div class="hidden lg:flex items-center gap-3">
                <a href="{base}/relawan" class="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-blue-400 text-blue-400 font-semibold hover:bg-blue-50 transition-all duration-300 hover:shadow-md">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Gabung Relawan
                </a>
                <a href="{base}/donasi" class="relative flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-400 text-white font-semibold shadow-md overflow-hidden group/donate hover:shadow-lg transition-all">
                    <div class="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/donate:translate-x-full transition-transform duration-700"></div>
                    <svg class="w-4 h-4 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span class="relative z-10">Donasi Sekarang</span>
                </a>
            </div>

            <!-- Mobile Menu Toggle -->
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
    <div class="lg:hidden border-t border-gray-100 bg-white shadow-lg mobile-menu-enter">
        <div class="px-4 py-4 space-y-1">
        {#each menuItems as item}
            {#if item.children}
            <!-- Mobile Dropdown -->
            <button
                onclick={() => toggleMobileDropdown(item.label)}
                class="w-full flex justify-between items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300">
                <span>{item.label}</span>
                <svg class="w-4 h-4 transition-transform {mobileDropdownOpen === item.label ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {#if mobileDropdownOpen === item.label}
                <div class="ml-4 mt-1 space-y-1 border-l-2 border-blue-400 pl-3 mobile-submenu-enter">
                {#each item.children as child, idx}
                    <a
                    href={child.href}
                    onclick={toggleMobileMenu}
                    class="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-400 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:pl-4 hover:shadow-sm"
                    style="animation-delay: {idx * 30}ms">
                    {child.label}
                    </a>
                {/each}
                </div>
            {/if}
            {:else}
            <a
                href={item.href}
                onclick={toggleMobileMenu}
                class="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300">
                {item.label}
            </a>
            {/if}
        {/each}

        <!-- CTA -->
        <div class="pt-4 space-y-3 border-t border-gray-100 mt-4">
            <a href="{base}/relawan" onclick={toggleMobileMenu} class="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full border-2 border-blue-400 text-blue-400 font-semibold transition-all duration-300 hover:bg-blue-50 hover:shadow-md active:scale-95">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Gabung Relawan
            </a>
            <a href="{base}/donasi" onclick={toggleMobileMenu} class="relative flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full bg-orange-400 text-white font-semibold shadow-md overflow-hidden group/donate transition-all hover:shadow-lg active:scale-95">
                <div class="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/donate:translate-x-full transition-transform duration-700"></div>
                <svg class="w-4 h-4 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span class="relative z-10">Donasi Sekarang</span>
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
    
        /* Dropdown animations */
    @keyframes dropdownEnter {
        from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .dropdown-enter {
        animation: dropdownEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Mobile menu animations */
    @keyframes mobileMenuSlide {
        from {
            opacity: 0;
            max-height: 0;
        }
        to {
            opacity: 1;
            max-height: 100vh;
        }
    }

    .mobile-menu-enter {
        animation: mobileMenuSlide 0.3s ease-out;
    }

    /* Mobile submenu animations */
    @keyframes submenuSlide {
        from {
            opacity: 0;
            transform: translateX(-10px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .mobile-submenu-enter {
        animation: submenuSlide 0.2s ease-out;
    }

    /* Pulse effect for active elements */
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }

    /* Shimmer effect */
    @keyframes shimmer {
        0% {
            background-position: -1000px 0;
        }
        100% {
            background-position: 1000px 0;
        }
    }
</style>
