<script lang="ts">
  import { adminStore } from '$lib/stores/admin';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let username = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let fullName = '';
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

    if (password !== confirmPassword) {
      error = 'Password tidak cocok';
      return;
    }

    if (password.length < 8) {
      error = 'Password minimal 8 karakter';
      return;
    }

    loading = true;

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, fullName })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registrasi gagal');
      }

      // Auto login setelah register
      const loginResult = await adminStore.login(username, password);
      
      if (loginResult.success) {
        goto('/admin');
      } else {
        goto('/admin/login');
      }
    } catch (err: any) {
      error = err.message || 'Terjadi kesalahan';
    } finally {
      loading = false;
    }
  };
</script>

<svelte:head>
  <title>Register Admin - Sahabat Anak</title>
</svelte:head>

<div class="min-h-screen bg-linear-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
  <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-primary mb-2">Sahabat Anak</h1>
      <p class="text-gray-600">Register Admin Baru</p>
    </div>

    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
      {#if error}
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      {/if}

      <div>
        <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
          Nama Lengkap
        </label>
        <input
          type="text"
          id="fullName"
          bind:value={fullName}
          required
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Masukkan nama lengkap"
        />
      </div>

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
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          bind:value={email}
          required
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="admin@sahabatanak.org"
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
          minlength="8"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Minimal 8 karakter"
        />
      </div>

      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
          Konfirmasi Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          bind:value={confirmPassword}
          required
          minlength="8"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Masukkan ulang password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        class="w-full bg-primary hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        {loading ? 'Loading...' : 'Register'}
      </button>
    </form>

    <div class="mt-6 text-center space-y-2">
      <a href="/admin/login" class="text-primary hover:text-blue-600 text-sm block">
        Sudah punya akun? Login
      </a>
      <a href="/" class="text-gray-500 hover:text-gray-700 text-sm block">
        ← Kembali ke Website
      </a>
    </div>
  </div>
</div>
