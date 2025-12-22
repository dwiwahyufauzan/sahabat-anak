<script lang="ts">
  import { adminApi } from '$lib/utils/adminApi';
  import { goto } from '$app/navigation';

  let formData = {
    slug: '',
    title: '',
    description: '',
    category: 'Pendidikan',
    image: '',
    targetAmount: '',
    location: '',
    status: 'active'
  };

  let loading = false;
  let error = '';

  const categories = ['Pendidikan', 'Kesehatan', 'Lingkungan', 'Sosial'];
  const statuses = ['active', 'completed', 'paused'];

  const handleSubmit = async () => {
    error = '';
    loading = true;

    try {
      await adminApi.programs.create(formData);
      goto('/admin/programs');
    } catch (err) {
      error = 'Gagal membuat program. Pastikan slug unik.';
    } finally {
      loading = false;
    }
  };

  const generateSlug = () => {
    formData.slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };
</script>

<svelte:head>
  <title>Tambah Program - Admin Panel</title>
</svelte:head>

<div>
  <div class="mb-6">
    <a href="/admin/programs" class="text-green-600 hover:text-green-700">
      ← Kembali ke Daftar Program
    </a>
    <h1 class="text-3xl font-bold text-gray-800 mt-2">Tambah Program Baru</h1>
  </div>

  <div class="bg-white rounded-lg shadow p-8 max-w-3xl">
    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-6">
      {#if error}
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      {/if}

      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
          Judul Program *
        </label>
        <input
          id="title"
          type="text"
          bind:value={formData.title}
          oninput={generateSlug}
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div>
        <label for="slug" class="block text-sm font-medium text-gray-700 mb-2">
          Slug (URL) *
        </label>
        <input
          id="slug"
          type="text"
          bind:value={formData.slug}
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <p class="text-sm text-gray-500 mt-1">URL: /program/{formData.slug}</p>
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
          Deskripsi *
        </label>
        <textarea
          id="description"
          bind:value={formData.description}
          required
          rows="5"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        ></textarea>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
            Kategori *
          </label>
          <select
            id="category"
            bind:value={formData.category}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {#each categories as category}
              <option value={category}>{category}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select
            id="status"
            bind:value={formData.status}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {#each statuses as status}
              <option value={status}>{status}</option>
            {/each}
          </select>
        </div>
      </div>

      <div>
        <label for="image" class="block text-sm font-medium text-gray-700 mb-2">
          URL Gambar *
        </label>
        <input
          id="image"
          type="url"
          bind:value={formData.image}
          required
          placeholder="https://example.com/image.jpg"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        {#if formData.image}
          <img src={formData.image} alt="Preview" class="mt-2 w-48 h-32 object-cover rounded-lg" />
        {/if}
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="targetAmount" class="block text-sm font-medium text-gray-700 mb-2">
            Target Donasi (Rp) *
          </label>
          <input
            id="targetAmount"
            type="number"
            bind:value={formData.targetAmount}
            required
            min="0"
            step="1000"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label for="location" class="block text-sm font-medium text-gray-700 mb-2">
            Lokasi *
          </label>
          <input
            id="location"
            type="text"
            bind:value={formData.location}
            required
            placeholder="Jakarta"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      <div class="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-2 rounded-lg transition-colors"
        >
          {loading ? 'Menyimpan...' : 'Simpan Program'}
        </button>
        <a
          href="/admin/programs"
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-2 rounded-lg transition-colors"
        >
          Batal
        </a>
      </div>
    </form>
  </div>
</div>
