<script lang="ts">
  import { adminStore } from '$lib/stores/admin';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import Icon from '$lib/components/admin/Icons.svelte';

  let username = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let fullName = '';
  let error = '';
  let loading = false;
  let showPassword = false;
  let showConfirmPassword = false;

  onMount(async () => {
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

<div class="min-h-screen bg-linear-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4 relative overflow-hidden">
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl"></div>
  </div>

  <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 border border-gray-100">
    <div class="bg-linear-to-r from-blue-500 to-orange-500 p-6 text-white text-center">
      <div class="flex justify-center mb-3">
        <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
          <img 
            src="https://www.logoai.com/oss/icons/2021/12/02/u8tXD2V7rro6bok.png" 
            alt="Logo" 
            class="w-14 h-14 object-contain"
          />
        </div>
      </div>
      <h1 class="text-2xl font-bold mb-1">Register Admin</h1>
      <p class="text-blue-100 text-sm">Buat akun admin baru</p>
    </div>

    <div class="p-6">
      {#if error}
        <div class="mb-4 bg-red-50 border-l-4 border-red-500 px-4 py-3 rounded flex items-start gap-3">
          <Icon name="alert-circle" className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
          <p class="text-red-700 text-sm">{error}</p>
        </div>
      {/if}

      <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
        <div>
          <label for="fullName" class="block text-sm font-semibold text-gray-700 mb-1.5">
            Nama Lengkap
          </label>
          <input
            type="text"
            id="fullName"
            bind:value={fullName}
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Masukkan nama lengkap"
          />
        </div>

        <div>
          <label for="username" class="block text-sm font-semibold text-gray-700 mb-1.5">
            Username
          </label>
          <input
            type="text"
            id="username"
            bind:value={username}
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Masukkan username"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-semibold text-gray-700 mb-1.5">
            Email
          </label>
          <input
            type="email"
            id="email"
            bind:value={email}
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="admin@sahabatanak.org"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-semibold text-gray-700 mb-1.5">
            Password
          </label>
          <div class="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              bind:value={password}
              required
              minlength="8"
              class="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Minimal 8 karakter"
            />
            <button
              type="button"
              onclick={() => showPassword = !showPassword}
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <Icon name="eye" className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-semibold text-gray-700 mb-1.5">
            Konfirmasi Password
          </label>
          <div class="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              bind:value={confirmPassword}
              required
              minlength="8"
              class="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Ulangi password"
            />
            <button
              type="button"
              onclick={() => showConfirmPassword = !showConfirmPassword}
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <Icon name="eye" className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          class="w-full bg-linear-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
        >
          {#if loading}
            <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Loading...</span>
          {:else}
            <span>Buat Akun Admin</span>
            <Icon name="chevron-right" className="w-5 h-5" />
          {/if}
        </button>
      </form>

      <div class="mt-6 text-center space-y-3">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white text-gray-500">Sudah punya akun?</span>
          </div>
        </div>

        <a 
          href="/admin/login" 
          class="block text-blue-600 hover:text-blue-700 font-medium text-sm py-2 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <span class="font-bold">Login</span> ke Admin Panel
        </a>
        
        <a 
          href="/" 
          class="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 text-sm py-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Icon name="chevron-left" className="w-4 h-4" />
          <span>Kembali ke Website</span>
        </a>
      </div>
    </div>
  </div>
</div>
