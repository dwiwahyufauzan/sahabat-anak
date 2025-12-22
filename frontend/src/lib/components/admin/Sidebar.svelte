<script lang="ts">
  import { page } from '$app/stores';
  import { adminStore } from '$lib/stores/admin';

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin logout?')) {
      adminStore.logout();
    }
  };

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/programs', label: 'Program', icon: '📁' },
    { href: '/admin/news', label: 'Berita', icon: '📰' },
    { href: '/admin/donations', label: 'Donasi', icon: '💰' },
    { href: '/admin/volunteers', label: 'Relawan', icon: '🤝' },
    { href: '/admin/contacts', label: 'Pesan', icon: '✉️' },
    { href: '/admin/team', label: 'Tim', icon: '👥' }
  ];
</script>

<aside class="w-64 bg-green-800 text-white min-h-screen flex flex-col">
  <div class="p-6 border-b border-green-700">
    <h1 class="text-2xl font-bold">Sahabat Anak</h1>
    <p class="text-green-200 text-sm">Admin Panel</p>
  </div>

  <nav class="flex-1 p-4">
    <ul class="space-y-2">
      {#each menuItems as item}
        <li>
          <a
            href={item.href}
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              {$page.url.pathname === item.href 
                ? 'bg-green-700 text-white' 
                : 'text-green-100 hover:bg-green-700/50'}"
          >
            <span class="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        </li>
      {/each}
    </ul>
  </nav>

  <div class="p-4 border-t border-green-700">
    <div class="mb-3 px-4">
      <p class="text-sm text-green-200">Logged in as:</p>
      <p class="font-semibold">{$adminStore.admin?.fullName || 'Admin'}</p>
    </div>
    <button
      onclick={handleLogout}
      class="w-full flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
    >
      <span>🚪</span>
      <span>Logout</span>
    </button>
  </div>
</aside>
