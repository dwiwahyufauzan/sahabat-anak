<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { adminStore } from '$lib/stores/admin';
  import { fly, slide, scale, fade } from 'svelte/transition';
  import { quintOut, elasticOut } from 'svelte/easing';
  import { onMount, onDestroy } from 'svelte';
  import Icon from './Icons.svelte';

  let isCollapsed = false;
  let isMobileOpen = false;
  let showTooltip = '';
  let mounted = false;
  let isMobile = false;
  let showLogoutModal = false;

  onMount(() => {
    mounted = true;
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('keydown', handleKeyboard);
    
    // Load saved preference
    const savedCollapsed = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsed !== null) {
      isCollapsed = savedCollapsed === 'true';
    }
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('keydown', handleKeyboard);
    }
  });

  const checkMobile = () => {
    isMobile = window.innerWidth < 768;
    if (!isMobile) {
      isMobileOpen = false;
    }
  };

  const handleKeyboard = (e: KeyboardEvent) => {
    // Toggle with Ctrl/Cmd + B
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      toggleSidebar();
    }
    // Close mobile menu with Escape
    if (e.key === 'Escape' && isMobile && isMobileOpen) {
      closeMobileSidebar();
    }
  };

  const handleLogout = () => {
    showLogoutModal = true;
  };

  const confirmLogout = () => {
    adminStore.logout();
    showLogoutModal = false;
  };

  const cancelLogout = () => {
    showLogoutModal = false;
  };

  const handleLogin = () => {
    goto('/admin/login');
  };

  const toggleSidebar = () => {
    if (isMobile) {
      isMobileOpen = !isMobileOpen;
    } else {
      isCollapsed = !isCollapsed;
      localStorage.setItem('sidebarCollapsed', String(isCollapsed));
    }
  };

  const closeMobileSidebar = () => {
    isMobileOpen = false;
  };

  const menuItems = [
    { 
      href: '/admin', 
      label: 'Dashboard', 
      icon: 'dashboard',
      gradient: 'from-blue-500 to-blue-600',
      description: 'Ringkasan & Statistik'
    },
    { 
      href: '/admin/programs', 
      label: 'Program', 
      icon: 'folder',
      gradient: 'from-orange-500 to-orange-600',
      description: 'Kelola Program'
    },
    { 
      href: '/admin/events', 
      label: 'Event', 
      icon: 'calendar',
      gradient: 'from-purple-500 to-purple-600',
      description: 'Kelola Event'
    },
    { 
      href: '/admin/news', 
      label: 'Berita', 
      icon: 'news',
      gradient: 'from-blue-500 to-blue-600',
      description: 'Kelola Artikel'
    },
    { 
      href: '/admin/donations', 
      label: 'Donasi', 
      icon: 'dollar',
      gradient: 'from-orange-500 to-orange-600',
      description: 'Kelola Donasi'
    },
    { 
      href: '/admin/volunteers', 
      label: 'Relawan', 
      icon: 'users',
      gradient: 'from-blue-500 to-blue-600',
      description: 'Kelola Relawan'
    },
    { 
      href: '/admin/contacts', 
      label: 'Pesan', 
      icon: 'mail',
      gradient: 'from-orange-500 to-orange-600',
      description: 'Pesan Masuk'
    },
    { 
      href: '/admin/team', 
      label: 'Tim', 
      icon: 'team',
      gradient: 'from-blue-500 to-blue-600',
      description: 'Kelola Tim'
    }
  ];

  $: isActive = (href: string) => {
    if (href === '/admin') {
      return $page.url.pathname === href;
    }
    return $page.url.pathname.startsWith(href);
  };

  // Close mobile sidebar when route changes
  $: if ($page.url.pathname && isMobile) {
    isMobileOpen = false;
  }
</script>

<!-- Hamburger Menu Button (Mobile Only) -->
{#if isMobile}
  <button
    on:click={toggleSidebar}
    class="fixed top-4 left-4 z-50 w-12 h-12 bg-slate-800 hover:bg-slate-700 text-white rounded-xl shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 md:hidden"
    aria-label="Toggle menu"
    transition:scale={{ duration: 200 }}
  >
    <div class="flex flex-col gap-1.5 w-6">
      <span class="w-full h-0.5 bg-white rounded-full transition-all duration-300 {isMobileOpen ? 'rotate-45 translate-y-2' : ''}"></span>
      <span class="w-full h-0.5 bg-white rounded-full transition-all duration-300 {isMobileOpen ? 'opacity-0' : ''}"></span>
      <span class="w-full h-0.5 bg-white rounded-full transition-all duration-300 {isMobileOpen ? '-rotate-45 -translate-y-2' : ''}"></span>
    </div>
  </button>
{/if}

<!-- Overlay (Mobile Only) -->
{#if isMobile && isMobileOpen}
  <div 
    class="fixed inset-0 bg-black/50 z-40 md:hidden"
    on:click={closeMobileSidebar}
    on:keydown={(e) => e.key === 'Enter' && closeMobileSidebar()}
    transition:fade={{ duration: 200 }}
    role="button"
    tabindex="0"
    aria-label="Close menu"
  ></div>
{/if}

<aside 
  class="relative bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen flex flex-col shadow-2xl transition-all duration-300
    {isMobile 
      ? `fixed top-0 left-0 z-40 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} w-72`
      : `${isCollapsed ? 'w-20' : 'w-72'}`
    }"
>
  <!-- Background dekoratif -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
    <div class="absolute top-1/2 -left-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
  </div>

  <!-- Header -->
  <div class="relative p-6 border-b border-slate-700/50 backdrop-blur-sm">
    {#if !isCollapsed || isMobile}
      <div transition:fly={{ x: -20, duration: 300 }}>
        <div class="flex items-center gap-3 mb-2">
          <img 
            src="https://www.logoai.com/oss/icons/2021/12/02/u8tXD2V7rro6bok.png" 
            alt="Logo Sahabat Anak" 
            class="w-10 h-10 object-contain rounded-lg"
          />
          <div>
            <h1 class="text-xl font-bold">
              <span class="text-white">Sahabat</span><span class="text-orange-400">Anak</span>
            </h1>
            <p class="text-slate-400 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>
    {:else}
      <div class="flex justify-center" transition:scale={{ duration: 300 }}>
        <img 
          src="https://www.logoai.com/oss/icons/2021/12/02/u8tXD2V7rro6bok.png" 
          alt="Logo" 
          class="w-10 h-10 object-contain rounded-lg"
        />
      </div>
    {/if}
  </div>

  <!-- Tombol toggle (Desktop Only) -->
  {#if !isMobile}
    <button
      on:click={toggleSidebar}
      class="absolute -right-3 top-20 w-6 h-6 bg-linear-to-r from-orange-500 to-orange-500 hover:from-orange-600 hover:to-orange-600 border-2 border-slate-800 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 shadow-lg"
      title={isCollapsed ? 'Expand (Ctrl+B)' : 'Collapse (Ctrl+B)'}
    >
      <Icon name={isCollapsed ? 'chevron-right' : 'chevron-left'} className="w-3 h-3 text-white" />
    </button>
  {/if}

  <!-- Navigation -->
  <nav class="relative flex-1 p-4 overflow-y-auto">
    <ul class="space-y-2">
      {#each menuItems as item, i}
        {#if mounted}
          <li 
            transition:fly={{ x: -20, duration: 300, delay: i * 50, easing: quintOut }}
          >
            <a
              href={item.href}
              on:mouseenter={() => isCollapsed && !isMobile && (showTooltip = item.label)}
              on:mouseleave={() => showTooltip = ''}
              on:click={() => isMobile && closeMobileSidebar()}
              class="group relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300
                {isActive(item.href)
                  ? 'bg-linear-to-r ' + item.gradient + ' text-white shadow-lg shadow-' + (item.gradient.includes('blue') ? 'blue' : 'orange') + '-500/30'
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'}"
            >
              <!-- Icon -->
              <div class="relative z-10 transition-transform duration-300 {isActive(item.href) ? 'scale-110' : 'group-hover:scale-110'}">
                <Icon name={item.icon} className="w-6 h-6" />
              </div>
              
              {#if !isCollapsed || isMobile}
                <div class="flex-1 min-w-0 relative z-10" transition:fly={{ x: -10, duration: 200 }}>
                  <span class="font-semibold block truncate">{item.label}</span>
                  <span class="text-xs opacity-75 block truncate">{item.description}</span>
                </div>
              {/if}

              <!-- Indicator aktif -->
              {#if isActive(item.href)}
                {#if !isCollapsed || isMobile}
                  <div 
                    class="w-1.5 h-8 bg-white rounded-full relative z-10"
                    transition:scale={{ duration: 300 }}
                  ></div>
                {/if}
              {/if}

              <!-- Tooltip collapsed (Desktop only) -->
              {#if isCollapsed && !isMobile && showTooltip === item.label}
                <div 
                  class="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-xl whitespace-nowrap z-50 border border-slate-700"
                  transition:fly={{ x: -10, duration: 200 }}
                >
                  <div class="font-semibold">{item.label}</div>
                  <div class="text-xs text-slate-400">{item.description}</div>
                  <div class="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700"></div>
                </div>
              {/if}

              <!-- Efek hover -->
              <div class="absolute inset-0 rounded-xl bg-linear-to-r {item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </a>
          </li>
        {/if}
      {/each}
    </ul>
  </nav>

  <!-- Profile & Login/Logout Button -->
  <div class="relative p-4 border-t border-slate-700/50 backdrop-blur-sm">
    {#if $adminStore.isAuthenticated}
      <!-- Authenticated State - Show Profile & Logout -->
      {#if !isCollapsed || isMobile}
        <!-- Profile lengkap -->
        <div class="mb-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-linear-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
              {($adminStore.admin?.fullName || 'A')[0].toUpperCase()}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-slate-400">Logged in as</p>
              <p class="font-bold truncate">{($adminStore.admin?.fullName || 'Admin')}</p>
            </div>
          </div>
        </div>

        <button
          on:click={handleLogout}
          class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/50"
        >
          <Icon name="logout" className="w-5 h-5" />
          <span class="font-semibold">Logout</span>
        </button>
      {:else}
        <!-- Profile mini -->
        <div class="flex flex-col items-center gap-3">
          <div 
            class="w-12 h-12 bg-linear-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-xl font-bold shadow-lg"
            on:mouseenter={() => showTooltip = 'profile'}
            on:mouseleave={() => showTooltip = ''}
            role="button"
            tabindex="0"
          >
            {($adminStore.admin?.fullName || 'A')[0].toUpperCase()}
          </div>

          {#if showTooltip === 'profile'}
            <div class="absolute left-full bottom-80 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-xl whitespace-nowrap z-50 border border-slate-700" transition:fly={{ x: -10, duration: 200 }}>
              <div class="text-xs mb-1">Logged in as</div>
              <div class="font-semibold">{($adminStore.admin?.fullName || 'Admin')}</div>
              <div class="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700"></div>
            </div>
          {/if}

          <!-- Logout mini -->
          <button
            on:click={handleLogout}
            on:mouseenter={() => showTooltip = 'logout'}
            on:mouseleave={() => showTooltip = ''}
            class="w-12 h-12 bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/50"
            title="Logout"
          >
            <Icon name="logout" className="w-5 h-5" />
          </button>

          {#if showTooltip === 'logout'}
            <div class="absolute left-full bottom-20 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-xl whitespace-nowrap z-50 border border-slate-700" transition:fly={{ x: -10, duration: 200 }}>
              <div class="font-semibold">Logout</div>
              <div class="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700"></div>
            </div>
          {/if}
        </div>
      {/if}
    {:else}
      <!-- Not Authenticated State - Show Login Button -->
      {#if !isCollapsed || isMobile}
        <button
          on:click={handleLogin}
          class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
        >
          <Icon name="lock" className="w-5 h-5" />
          <span class="font-semibold">Login</span>
        </button>
      {:else}
        <!-- Login mini -->
        <button
          on:click={handleLogin}
          on:mouseenter={() => showTooltip = 'login'}
          on:mouseleave={() => showTooltip = ''}
          class="w-12 h-12 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50"
          title="Login"
        >
          <Icon name="lock" className="w-5 h-5" />
        </button>

        {#if showTooltip === 'login'}
          <div class="absolute left-full bottom-20 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-xl whitespace-nowrap z-50 border border-slate-700" transition:fly={{ x: -10, duration: 200 }}>
            <div class="font-semibold">Login</div>
            <div class="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700"></div>
          </div>
        {/if}
      {/if}
    {/if}
  </div>
</aside>

<!-- Logout Confirmation Modal -->
{#if showLogoutModal}
  <div 
    class="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-100 p-4"
    on:click={cancelLogout}
    on:keydown={(e) => e.key === 'Escape' && cancelLogout()}
    transition:fade={{ duration: 200 }}
    role="button"
    tabindex="0"
  >
    <div 
      class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      on:click|stopPropagation
      on:keydown|stopPropagation
      transition:scale={{ duration: 300, easing: elasticOut }}
      role="dialog"
      tabindex="-1"
    >
      <!-- Header with gradient -->
      <div class="bg-linear-to-r from-red-500 via-rose-500 to-orange-500 px-6 py-6 relative overflow-hidden">
        <!-- Decorative background -->
        <div class="absolute inset-0 overflow-hidden opacity-20">
          <div class="absolute -top-12 -right-12 w-32 h-32 bg-white rounded-full blur-2xl"></div>
          <div class="absolute -bottom-12 -left-12 w-32 h-32 bg-white rounded-full blur-2xl"></div>
        </div>
        
        <div class="relative flex items-center gap-4">
          <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Icon name="logout" className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 class="text-2xl font-bold text-white">Konfirmasi Logout</h3>
            <p class="text-red-100 text-sm mt-0.5">Anda akan keluar dari sistem</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 py-6">
        <div class="bg-red-50 border-2 border-red-100 rounded-xl p-4 mb-6">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <div class="flex-1">
              <h4 class="text-base font-bold text-gray-900 mb-1">
                Apakah Anda yakin ingin logout?
              </h4>
              <p class="text-sm text-gray-600 leading-relaxed">
                Anda perlu login kembali untuk mengakses admin panel. Pastikan semua pekerjaan Anda telah tersimpan.
              </p>
            </div>
          </div>
        </div>

        <!-- User Info -->
        {#if $adminStore.admin}
          <div class="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-linear-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg">
                {($adminStore.admin.fullName || 'A')[0].toUpperCase()}
              </div>
              <div class="flex-1">
                <p class="text-xs text-gray-500 mb-0.5">Logged in as</p>
                <p class="font-bold text-gray-900">{$adminStore.admin.fullName || 'Admin'}</p>
                {#if $adminStore.admin.email}
                  <p class="text-xs text-gray-600">{$adminStore.admin.email}</p>
                {/if}
              </div>
            </div>
          </div>
        {/if}

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <button
            on:click={cancelLogout}
            class="flex-1 px-5 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
          >
            <Icon name="close" className="w-4 h-4" />
            Batal
          </button>
          <button
            on:click={confirmLogout}
            class="flex-1 px-5 py-3.5 bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg shadow-red-500/30 flex items-center justify-center gap-2"
          >
            <Icon name="logout" className="w-4 h-4" />
            Ya, Logout
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }

  .animate-bounce {
    animation: bounce 1s ease-in-out infinite;
  }
</style>