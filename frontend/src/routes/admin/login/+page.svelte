<script lang="ts">
  import { adminStore } from '$lib/stores/admin';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let username = '';
  let password = '';
  let error = '';
  let loading = false;

  onMount(async () => {
    // Redirect if already logged in
    const isAuthenticated = await adminStore.checkAuth();
    if (isAuthenticated) {
      goto('/admin');
    }
  });

  const handleSubmit = async () => {
    error = '';
    loading = true;

    const result = await adminStore.login(username, password);
    
    loading = false;

    if (result.success) {
      goto('/admin');
    } else {
      error = result.error || 'Login gagal';
    }
  };
</script>

<svelte:head>
  <title>Admin Login - Sahabat Anak</title>
</svelte:head>

<div class="min-h-screen bg-linear-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
  <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-green-800 mb-2">Sahabat Anak</h1>
      <p class="text-gray-600">Admin Panel Login</p>
    </div>

    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-6">
      {#if error}
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      {/if}

      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
          Username
        </label>
        <input
          type="text"
          id="username"
          bind:value={username}
          required
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Masukkan username"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          bind:value={password}
          required
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Masukkan password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        {loading ? 'Loading...' : 'Login'}
      </button>
    </form>

    <div class="mt-6 text-center space-y-2">
      <a href="/admin/register" class="text-green-600 hover:text-green-700 text-sm block">
        Belum punya akun? Register
      </a>
      <a href="/" class="text-gray-500 hover:text-gray-700 text-sm block">
        ← Kembali ke Website
      </a>
    </div>
  </div>
</div>
