<script lang="ts">
  import { goto } from '$app/navigation';
  import { adminApi } from '$lib/utils/adminApi';

  let formData = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    category: '',
    author: ''
  };

  let isSubmitting = false;

  // Generate slug from title
  const generateSlug = () => {
    if (!formData.title) return;
    
    formData.slug = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      alert('Judul dan konten wajib diisi');
      return;
    }

    // Generate slug if not manually set
    if (!formData.slug) {
      generateSlug();
    }

    isSubmitting = true;
    try {
      // Prepare data - convert empty strings to undefined for optional fields
      const submitData: any = {
        slug: formData.slug,
        title: formData.title,
        content: formData.content,
      };

      // Add optional fields only if they have values
      if (formData.excerpt && formData.excerpt.trim()) {
        submitData.excerpt = formData.excerpt;
      }
      if (formData.image && formData.image.trim()) {
        submitData.image = formData.image;
      }
      if (formData.category && formData.category.trim()) {
        submitData.category = formData.category;
      }
      if (formData.author && formData.author.trim()) {
        submitData.author = formData.author;
      }

      await adminApi.news.create(submitData);
      alert('Berita berhasil dibuat!');
      goto('/admin/news');
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal membuat berita: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      isSubmitting = false;
    }
  };
</script>

<svelte:head>
  <title>Buat Berita Baru - Admin Panel</title>
</svelte:head>

<div>
  <div class="mb-6">
    <a href="/admin/news" class="text-green-600 hover:text-green-700">
      ← Kembali ke Daftar Berita
    </a>
  </div>

  <h1 class="text-3xl font-bold text-gray-800 mb-6">Buat Berita Baru</h1>

  <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="bg-white rounded-lg shadow p-6">
    <div class="grid grid-cols-1 gap-6">
      <!-- Title -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2" for="title">
          Judul Berita *
        </label>
        <input
          bind:value={formData.title}
          oninput={generateSlug}
          type="text"
          id="title"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Masukkan judul berita"
          required
        />
      </div>

      <!-- Slug -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2" for="slug">
          Slug (URL) *
        </label>
        <input
          bind:value={formData.slug}
          type="text"
          id="slug"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="judul-berita-otomatis"
          required
        />
        <p class="text-sm text-gray-500 mt-1">URL: /berita/{formData.slug}</p>
      </div>

      <!-- Excerpt -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2" for="excerpt">
          Ringkasan
        </label>
        <textarea
          bind:value={formData.excerpt}
          id="excerpt"
          rows="3"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Ringkasan singkat berita"
        ></textarea>
      </div>

      <!-- Content -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2" for="content">
          Konten *
        </label>
        <textarea
          bind:value={formData.content}
          id="content"
          rows="10"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Tulis konten berita lengkap di sini"
          required
        ></textarea>
      </div>

      <!-- Image URL -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2" for="image">
          URL Gambar
        </label>
        <input
          bind:value={formData.image}
          type="url"
          id="image"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="https://example.com/image.jpg"
        />
        {#if formData.image}
          <img src={formData.image} alt="Preview" class="mt-2 w-full max-w-md h-48 object-cover rounded-lg" />
        {/if}
      </div>

      <!-- Category -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2" for="category">
          Kategori
        </label>
        <select
          bind:value={formData.category}
          id="category"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">Pilih kategori</option>
          <option value="Kegiatan">Kegiatan</option>
          <option value="Pengumuman">Pengumuman</option>
          <option value="Berita">Berita</option>
          <option value="Event">Event</option>
        </select>
      </div>

      <!-- Author -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2" for="author">
          Penulis
        </label>
        <input
          bind:value={formData.author}
          type="text"
          id="author"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Nama penulis"
        />
      </div>

      <!-- Submit Button -->
      <div class="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-2 rounded-lg transition-colors"
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan Berita'}
        </button>
        <a
          href="/admin/news"
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-2 rounded-lg transition-colors inline-block"
        >
          Batal
        </a>
      </div>
    </div>
  </form>
</div>