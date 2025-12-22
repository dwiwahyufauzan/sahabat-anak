<script lang="ts">
  import '../app.css'; // Import CSS tanpa inherit layout utama
  import { onMount } from 'svelte';
  import { adminStore } from '$lib/stores/admin';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Sidebar from '$lib/components/admin/Sidebar.svelte';

  let isChecking = true;

  onMount(async () => {
    // Skip auth check untuk halaman login
    const pathname = $page.url.pathname;
    if (pathname === '/admin/login' || pathname.startsWith('/admin/register')) {
      isChecking = false;
      return;
    }

    const isAuthenticated = await adminStore.checkAuth();
    
    if (!isAuthenticated) {
      goto('/admin/login');
    }
    
    isChecking = false;
  });
</script>

{#if isChecking}
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
{:else if $page.url.pathname === '/admin/login' || $page.url.pathname.startsWith('/admin/register')}
  <!-- Login/Register page tanpa sidebar -->
  <slot />
{:else}
  <!-- Admin pages dengan sidebar -->
  <div class="flex min-h-screen bg-gray-100">
    <Sidebar />
    
    <main class="flex-1 overflow-auto">
      <div class="p-8">
        <slot />
      </div>
    </main>
  </div>
{/if}
