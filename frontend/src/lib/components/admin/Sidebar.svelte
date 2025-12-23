<script lang="ts">
  import { page } from '$app/stores';
  import { adminStore } from '$lib/stores/admin';
  import { fly, slide, scale } from 'svelte/transition';
  import { quintOut, elasticOut } from 'svelte/easing';
  import { onMount } from 'svelte';

  let isCollapsed = false;
  let showTooltip = '';
  let mounted = false;

  onMount(() => {
    mounted = true;
  });

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin logout?')) {
      adminStore.logout();
    }
  };

  const toggleSidebar = () => {
    isCollapsed = !isCollapsed;
  };

  const menuItems = [
    { 
      href: '/admin', 
      label: 'Dashboard', 
      icon: '📊',
      gradient: 'from-blue-500 to-indigo-600',
      description: 'Ringkasan & Statistik'
    },
    { 
      href: '/admin/programs', 
      label: 'Program', 
      icon: '📁',
      gradient: 'from-purple-500 to-violet-600',
      description: 'Kelola Program'
    },
    { 
      href: '/admin/news', 
      label: 'Berita', 
      icon: '📰',
      gradient: 'from-rose-500 to-pink-600',
      description: 'Kelola Artikel'
    },
    { 
      href: '/admin/donations', 
      label: 'Donasi', 
      icon: '💰',
      gradient: 'from-emerald-500 to-green-600',
      description: 'Kelola Donasi'
    },
    { 
      href: '/admin/volunteers', 
      label: 'Relawan', 
      icon: '🤝',
      gradient: 'from-blue-500 to-cyan-600',
      description: 'Kelola Relawan'
    },
    { 
      href: '/admin/contacts', 
      label: 'Pesan', 
      icon: '✉️',
      gradient: 'from-amber-500 to-orange-600',
      description: 'Pesan Masuk'
    },
    { 
      href: '/admin/team', 
      label: 'Tim', 
      icon: '👥',
      gradient: 'from-teal-500 to-emerald-600',
      description: 'Kelola Tim'
    }
  ];

  $: isActive = (href: string) => {
    if (href === '/admin') {
      return $page.url.pathname === href;
    }
    return $page.url.pathname.startsWith(href);
  };
</script>

<aside 
  class="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen flex flex-col shadow-2xl transition-all duration-300 ease-in-out {isCollapsed ? 'w-20' : 'w-72'}"
>
  <!-- Decorative background elements -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
    <div class="absolute top-1/2 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
  </div>

  <!-- Header -->
  <div class="relative p-6 border-b border-slate-700/50 backdrop-blur-sm">
    {#if !isCollapsed}
      <div transition:fly={{ x: -20, duration: 300 }}>
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
            🌟
          </div>
          <div class="flex-1">
            <h1 class="text-xl font-bold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
              Sahabat Anak
            </h1>
          </div>
        </div>
        <p class="text-slate-400 text-sm ml-13">Admin Panel</p>
      </div>
    {:else}
      <div class="flex justify-center" transition:scale={{ duration: 300 }}>
        <div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
          🌟
        </div>
      </div>
    {/if}
  </div>

  <!-- Toggle Button -->
  <button
    on:click={toggleSidebar}
    class="absolute -right-3 top-20 w-6 h-6 bg-slate-700 hover:bg-slate-600 border-2 border-slate-800 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 shadow-lg"
    title={isCollapsed ? 'Expand' : 'Collapse'}
  >
    <span class="text-xs transition-transform duration-300 {isCollapsed ? 'rotate-180' : ''}">
      ◀
    </span>
  </button>

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
              on:mouseenter={() => isCollapsed && (showTooltip = item.label)}
              on:mouseleave={() => showTooltip = ''}
              class="group relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300
                {isActive(item.href)
                  ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg scale-105' 
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:scale-105'}"
            >
              <!-- Icon with animation -->
              <span class="text-2xl transition-transform duration-300 group-hover:scale-110 {isActive(item.href) ? 'animate-bounce' : ''}">
                {item.icon}
              </span>
              
              {#if !isCollapsed}
                <div class="flex-1 min-w-0" transition:fly={{ x: -10, duration: 200 }}>
                  <span class="font-semibold block truncate">{item.label}</span>
                  <span class="text-xs opacity-75 block truncate">{item.description}</span>
                </div>
              {/if}

              <!-- Active indicator -->
              {#if isActive(item.href)}
                <div 
                  class="absolute inset-0 rounded-xl opacity-20 bg-white blur-sm -z-10"
                  transition:scale={{ duration: 300, easing: elasticOut }}
                ></div>
                {#if !isCollapsed}
                  <div 
                    class="w-2 h-2 bg-white rounded-full animate-pulse"
                    transition:scale={{ duration: 300 }}
                  ></div>
                {/if}
              {/if}

              <!-- Tooltip for collapsed state -->
              {#if isCollapsed && showTooltip === item.label}
                <div 
                  class="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-xl whitespace-nowrap z-50 border border-slate-700"
                  transition:fly={{ x: -10, duration: 200 }}
                >
                  <div class="font-semibold">{item.label}</div>
                  <div class="text-xs text-slate-400">{item.description}</div>
                  <div class="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700"></div>
                </div>
              {/if}

              <!-- Hover effect -->
              <div class="absolute inset-0 rounded-xl bg-linear-to-r {item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </a>
          </li>
        {/if}
      {/each}
    </ul>

    <!-- Quick Stats (only when expanded) -->
    {#if !isCollapsed && mounted}
      <div 
        class="mt-6 p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50"
        transition:slide={{ duration: 300, easing: quintOut }}
      >
        <div class="text-xs text-slate-400 mb-3 font-semibold">Quick Stats</div>
        <div class="space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-300">Online</span>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span class="text-green-400 font-semibold">Active</span>
            </div>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-300">Server</span>
            <span class="text-emerald-400 font-semibold">Running</span>
          </div>
        </div>
      </div>
    {/if}
  </nav>

  <!-- User Profile & Logout -->
  <div class="relative p-4 border-t border-slate-700/50 backdrop-blur-sm">
    {#if !isCollapsed}
      <div 
        class="mb-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
        transition:slide={{ duration: 300 }}
      >
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-linear-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
            {($adminStore.admin?.fullName || 'A')[0].toUpperCase()}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-slate-400">Logged in as</p>
            <p class="font-bold text-white truncate">{$adminStore.admin?.fullName || 'Admin'}</p>
          </div>
        </div>
      </div>

      <button
        on:click={handleLogout}
        class="group w-full flex items-center gap-3 px-4 py-3 bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/50"
      >
        <span class="text-xl transition-transform duration-300 group-hover:rotate-12">🚪</span>
        <span class="font-semibold">Logout</span>
      </button>
    {:else}
      <div class="flex flex-col items-center gap-3">
        <div 
          class="w-12 h-12 bg-linear-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center text-xl font-bold shadow-lg"
          on:mouseenter={() => showTooltip = 'profile'}
          on:mouseleave={() => showTooltip = ''}
          role="button"
          tabindex="0"
        >
          {($adminStore.admin?.fullName || 'A')[0].toUpperCase()}
        </div>

        {#if showTooltip === 'profile'}
          <div 
            class="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-xl whitespace-nowrap z-50 border border-slate-700"
            style="bottom: 80px;"
            transition:fly={{ x: -10, duration: 200 }}
          >
            <div class="text-xs text-slate-400">Logged in as</div>
            <div class="font-semibold">{$adminStore.admin?.fullName || 'Admin'}</div>
            <div class="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700"></div>
          </div>
        {/if}

        <button
          on:click={handleLogout}
          on:mouseenter={() => showTooltip = 'logout'}
          on:mouseleave={() => showTooltip = ''}
          class="group w-12 h-12 bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/50 flex items-center justify-center"
          title="Logout"
        >
          <span class="text-xl transition-transform duration-300 group-hover:rotate-12">🚪</span>
        </button>

        {#if showTooltip === 'logout'}
          <div 
            class="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-xl whitespace-nowrap z-50 border border-slate-700"
            style="bottom: 20px;"
            transition:fly={{ x: -10, duration: 200 }}
          >
            <div class="font-semibold">Logout</div>
            <div class="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700"></div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</aside>

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