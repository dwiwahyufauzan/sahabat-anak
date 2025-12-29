<script lang="ts">
  import '../app.css'; // Import CSS tanpa inherit layout utama
  import { onMount } from 'svelte';
  import { adminStore } from '$lib/stores/admin';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Sidebar from '$lib/components/admin/Sidebar.svelte';

  let isChecking = true;
  let isAuthenticated = false;

  onMount(async () => {
    // Skip auth check untuk halaman login, register, dan welcome
    const pathname = $page.url.pathname;
    if (pathname === '/admin/login' || pathname.startsWith('/admin/register') || pathname === '/admin/welcome' || pathname === '/admin') {
      isChecking = false;
      return;
    }

    isAuthenticated = await adminStore.checkAuth();
    
    if (!isAuthenticated) {
      goto('/admin/welcome');
    }
    
    isChecking = false;
  });

  // Reactive statement untuk update authentication status
  $: isAuthenticated = $adminStore.isAuthenticated;
</script>

{#if isChecking}
  <div class="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-orange-50">
    <div class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
      <p class="mt-4 text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
{:else if $page.url.pathname === '/admin/login' || $page.url.pathname.startsWith('/admin/register') || $page.url.pathname === '/admin/welcome'}
  <!-- Login/Register/Welcome page tanpa sidebar -->
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
