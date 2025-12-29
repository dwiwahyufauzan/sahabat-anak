<script lang="ts">
  import { adminApi } from '$lib/utils/adminApi';
  import { goto } from '$app/navigation';
  import Modal from '$lib/components/admin/Modal.svelte';

  let formData = {
    slug: '',
    title: '',
    description: '',
    fullDescription: '',
    category: 'Pendidikan',
    categoryColor: 'blue',
    icon: 'menu_book',
    image: '',
    heroImage: '',
    targetAmount: '',
    location: '',
    locations: [] as string[],
    targetAudience: '',
    scheduleFrequency: '',
    scheduleDuration: '',
    objectives: [] as string[],
    activities: [] as Array<{title: string, description: string, icon: string}>,
    impact: [] as Array<{label: string, value: string, icon: string}>,
    testimonials: [] as Array<{name: string, role: string, quote: string, avatar: string}>,
    status: 'active'
  };

  let loading = false;
  let error = '';
  let imageFile: File | null = null;
  let imagePreview = '';
  let heroImageFile: File | null = null;
  let heroImagePreview = '';

  // Modal state
  let showModal = false;
  let modalType: 'success' | 'error' | 'warning' | 'confirm' = 'success';
  let modalTitle = '';
  let modalMessage = '';
  let confirmFunction: (() => void) | null = null;

  // Helper inputs
  let newObjective = '';
  let newLocation = '';
  let newActivity = {title: '', description: '', icon: 'book'};
  let newImpact = {label: '', value: '', icon: 'trending_up'};
  let newTestimonial = {name: '', role: '', quote: '', avatar: ''};

  const categories = ['Pendidikan', 'Kesehatan', 'Lingkungan', 'Sosial'];
  const categoryColors = ['blue', 'orange', 'green', 'purple'];
  const commonIcons = ['menu_book', 'health_and_safety', 'eco', 'volunteer_activism', 'school', 'favorite'];
  const statuses = ['active', 'completed', 'archived'];

  const handleImageChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      imageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroImageChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      heroImageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        heroImagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    error = '';
    loading = true;

    try {
      // Generate slug if empty
      if (!formData.slug && formData.title) {
        generateSlug();
      }

      // Validate required fields
      if (!formData.title || !formData.slug || !formData.description) {
        throw new Error('Judul, slug, dan deskripsi wajib diisi');
      }

      // Upload thumbnail image
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);
        imageFormData.append('folder', 'programs');
        
        const response = await fetch('http://localhost:3000/upload/image', {
          method: 'POST',
          body: imageFormData
        });
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Gagal upload gambar thumbnail');
        }
        formData.image = data.url;
      }

      // Upload hero image
      if (heroImageFile) {
        const heroFormData = new FormData();
        heroFormData.append('image', heroImageFile);
        heroFormData.append('folder', 'programs');
        
        const response = await fetch('http://localhost:3000/upload/image', {
          method: 'POST',
          body: heroFormData
        });
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Gagal upload hero image');
        }
        formData.heroImage = data.url;
      }

      if (!formData.image) {
        throw new Error('Gambar thumbnail program harus diupload');
      }

      // Convert arrays to JSON strings for backend
      const submitData = {
        ...formData,
        targetAmount: formData.targetAmount ? formData.targetAmount.toString() : '0',
        locations: JSON.stringify(formData.locations),
        objectives: JSON.stringify(formData.objectives),
        activities: JSON.stringify(formData.activities),
        impact: JSON.stringify(formData.impact),
        testimonials: JSON.stringify(formData.testimonials)
      };

      await adminApi.programs.create(submitData);
      modalType = 'success';
      modalTitle = 'Berhasil!';
      modalMessage = 'Program berhasil ditambahkan!';
      showModal = true;
      setTimeout(() => goto('/admin/programs'), 1500);
    } catch (err) {
      console.error('Error creating program:', err);
      error = err instanceof Error ? err.message : 'Gagal membuat program. Silakan coba lagi.';
    } finally {
      loading = false;
    }
  };

  const generateSlug = () => {
    if (!formData.title) return;
    
    formData.slug = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Hapus karakter spesial
      .replace(/\s+/g, '-') // Ganti spasi dengan dash
      .replace(/-+/g, '-') // Hapus dash ganda
      .replace(/^-+|-+$/g, ''); // Hapus dash di awal/akhir
  };

  // Array helpers
  const addObjective = () => {
    if (newObjective.trim()) {
      formData.objectives = [...formData.objectives, newObjective.trim()];
      newObjective = '';
    }
  };

  const removeObjective = (index: number) => {
    formData.objectives = formData.objectives.filter((_, i) => i !== index);
  };

  const addLocation = () => {
    if (newLocation.trim()) {
      formData.locations = [...formData.locations, newLocation.trim()];
      newLocation = '';
    }
  };

  const removeLocation = (index: number) => {
    formData.locations = formData.locations.filter((_, i) => i !== index);
  };

  const addActivity = () => {
    if (newActivity.title.trim() && newActivity.description.trim()) {
      formData.activities = [...formData.activities, {...newActivity}];
      newActivity = {title: '', description: '', icon: 'book'};
    }
  };

  const removeActivity = (index: number) => {
    formData.activities = formData.activities.filter((_, i) => i !== index);
  };

  const addImpact = () => {
    if (newImpact.label.trim() && newImpact.value.trim()) {
      formData.impact = [...formData.impact, {...newImpact}];
      newImpact = {label: '', value: '', icon: 'trending_up'};
    }
  };

  const removeImpact = (index: number) => {
    formData.impact = formData.impact.filter((_, i) => i !== index);
  };

  const addTestimonial = () => {
    if (newTestimonial.name.trim() && newTestimonial.quote.trim()) {
      formData.testimonials = [...formData.testimonials, {...newTestimonial}];
      newTestimonial = {name: '', role: '', quote: '', avatar: ''};
    }
  };

  const removeTestimonial = (index: number) => {
    formData.testimonials = formData.testimonials.filter((_, i) => i !== index);
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
          Deskripsi Singkat *
        </label>
        <textarea
          id="description"
          bind:value={formData.description}
          required
          rows="3"
          placeholder="Deskripsi singkat untuk tampilan card program"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        ></textarea>
      </div>

      <div>
        <label for="fullDescription" class="block text-sm font-medium text-gray-700 mb-2">
          Deskripsi Lengkap
        </label>
        <textarea
          id="fullDescription"
          bind:value={formData.fullDescription}
          rows="6"
          placeholder="Deskripsi lengkap yang akan ditampilkan di halaman detail program"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        ></textarea>
      </div>

      <div class="grid grid-cols-3 gap-4">
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
          <label for="categoryColor" class="block text-sm font-medium text-gray-700 mb-2">
            Warna Kategori
          </label>
          <select
            id="categoryColor"
            bind:value={formData.categoryColor}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="blue">Biru</option>
            <option value="orange">Orange</option>
            <option value="green">Hijau</option>
            <option value="purple">Ungu</option>
          </select>
        </div>

        <div>
          <label for="icon" class="block text-sm font-medium text-gray-700 mb-2">
            Icon
          </label>
          <input
            id="icon"
            type="text"
            bind:value={formData.icon}
            placeholder="school"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <p class="text-xs text-gray-500 mt-1">Material Icons</p>
        </div>
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

      <div>
        <label for="image" class="block text-sm font-medium text-gray-700 mb-2">
          Upload Gambar Thumbnail *
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onchange={handleImageChange}
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100 file:cursor-pointer"
        />
        <p class="text-sm text-gray-500 mt-1">Format: JPG, PNG, WEBP (Maks. 5MB)</p>
        {#if imagePreview}
          <div class="mt-3">
            <p class="text-sm font-medium text-gray-700 mb-2">Preview Thumbnail:</p>
            <img src={imagePreview} alt="Preview" class="w-64 h-40 object-cover rounded-lg border-2 border-gray-200" />
          </div>
        {/if}
      </div>

      <div>
        <label for="heroImage" class="block text-sm font-medium text-gray-700 mb-2">
          Upload Hero Image (Banner)
        </label>
        <input
          id="heroImage"
          type="file"
          accept="image/*"
          onchange={handleHeroImageChange}
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100 file:cursor-pointer"
        />
        <p class="text-sm text-gray-500 mt-1">Hero image untuk halaman detail (Opsional)</p>
        {#if heroImagePreview}
          <div class="mt-3">
            <p class="text-sm font-medium text-gray-700 mb-2">Preview Hero:</p>
            <img src={heroImagePreview} alt="Hero Preview" class="w-full h-48 object-cover rounded-lg border-2 border-gray-200" />
          </div>
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
            Lokasi Utama *
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

      <!-- Locations (Multiple) -->
      <div>
        <p class="block text-sm font-medium text-gray-700 mb-2">
          Lokasi Pelaksanaan (Multiple)
        </p>
        <div class="flex gap-2 mb-2">
          <input
            type="text"
            bind:value={newLocation}
            placeholder="Tambah lokasi..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            type="button"
            onclick={addLocation}
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            + Tambah
          </button>
        </div>
        {#if formData.locations.length > 0}
          <div class="space-y-2">
            {#each formData.locations as location, i}
              <div class="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
                <span class="text-sm text-gray-700">{location}</span>
                <button
                  type="button"
                  onclick={() => removeLocation(i)}
                  class="text-red-600 hover:text-red-800"
                >
                  Hapus
                </button>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Target Audience -->
      <div>
        <label for="targetAudience" class="block text-sm font-medium text-gray-700 mb-2">
          Target Audiens
        </label>
        <textarea
          id="targetAudience"
          bind:value={formData.targetAudience}
          rows="3"
          placeholder="Anak-anak usia 6-12 tahun yang kurang mampu..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        ></textarea>
      </div>

      <!-- Schedule -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="scheduleFrequency" class="block text-sm font-medium text-gray-700 mb-2">
            Frekuensi Kegiatan
          </label>
          <input
            id="scheduleFrequency"
            type="text"
            bind:value={formData.scheduleFrequency}
            placeholder="Setiap Sabtu"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label for="scheduleDuration" class="block text-sm font-medium text-gray-700 mb-2">
            Durasi Kegiatan
          </label>
          <input
            id="scheduleDuration"
            type="text"
            bind:value={formData.scheduleDuration}
            placeholder="09:00 - 12:00"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Objectives -->
      <div>
        <p class="block text-sm font-medium text-gray-700 mb-2">
          Tujuan Program
        </p>
        <div class="flex gap-2 mb-2">
          <input
            type="text"
            bind:value={newObjective}
            placeholder="Tambah tujuan program..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            type="button"
            onclick={addObjective}
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            + Tambah
          </button>
        </div>
        {#if formData.objectives.length > 0}
          <div class="space-y-2">
            {#each formData.objectives as objective, i}
              <div class="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
                <span class="text-sm text-gray-700">{objective}</span>
                <button
                  type="button"
                  onclick={() => removeObjective(i)}
                  class="text-red-600 hover:text-red-800"
                >
                  Hapus
                </button>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Activities -->
      <div>
        <p class="block text-sm font-medium text-gray-700 mb-2">
          Kegiatan Program
        </p>
        <div class="space-y-2 mb-3">
          <input
            type="text"
            bind:value={newActivity.title}
            placeholder="Judul kegiatan..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <textarea
            bind:value={newActivity.description}
            placeholder="Deskripsi kegiatan..."
            rows="2"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          ></textarea>
          <div class="flex gap-2">
            <input
              type="text"
              bind:value={newActivity.icon}
              placeholder="Icon (contoh: book)"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              type="button"
              onclick={addActivity}
              class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              + Tambah
            </button>
          </div>
        </div>
        {#if formData.activities.length > 0}
          <div class="space-y-3">
            {#each formData.activities as activity, i}
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-medium text-gray-800">{activity.title}</h4>
                  <button
                    type="button"
                    onclick={() => removeActivity(i)}
                    class="text-red-600 hover:text-red-800"
                  >
                    Hapus
                  </button>
                </div>
                <p class="text-sm text-gray-600 mb-1">{activity.description}</p>
                <p class="text-xs text-gray-500">Icon: {activity.icon}</p>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Impact Stats -->
      <div>
        <p class="block text-sm font-medium text-gray-700 mb-2">
          Statistik Dampak
        </p>
        <div class="space-y-2 mb-3">
          <input
            type="text"
            bind:value={newImpact.label}
            placeholder="Label (contoh: Anak Terbantu)"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <div class="flex gap-2">
            <input
              type="text"
              bind:value={newImpact.value}
              placeholder="Nilai (contoh: 150+)"
              class="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="text"
              bind:value={newImpact.icon}
              placeholder="Icon (contoh: people)"
              class="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button
            type="button"
            onclick={addImpact}
            class="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            + Tambah Statistik
          </button>
        </div>
        {#if formData.impact.length > 0}
          <div class="grid grid-cols-2 gap-3">
            {#each formData.impact as stat, i}
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex justify-between items-start mb-1">
                  <p class="text-sm font-medium text-gray-700">{stat.label}</p>
                  <button
                    type="button"
                    onclick={() => removeImpact(i)}
                    class="text-red-600 hover:text-red-800 text-sm"
                  >
                    Hapus
                  </button>
                </div>
                <p class="text-lg font-bold text-blue-600">{stat.value}</p>
                <p class="text-xs text-gray-500">Icon: {stat.icon}</p>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Testimonials -->
      <div>
        <p class="block text-sm font-medium text-gray-700 mb-2">
          Testimoni
        </p>
        <div class="space-y-2 mb-3">
          <input
            type="text"
            bind:value={newTestimonial.name}
            placeholder="Nama"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <input
            type="text"
            bind:value={newTestimonial.role}
            placeholder="Peran/Jabatan"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <textarea
            bind:value={newTestimonial.quote}
            placeholder="Kutipan testimoni..."
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          ></textarea>
          <input
            type="text"
            bind:value={newTestimonial.avatar}
            placeholder="URL Avatar (opsional)"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            type="button"
            onclick={addTestimonial}
            class="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            + Tambah Testimoni
          </button>
        </div>
        {#if formData.testimonials.length > 0}
          <div class="space-y-3">
            {#each formData.testimonials as testimonial, i}
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h4 class="font-medium text-gray-800">{testimonial.name}</h4>
                    <p class="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                  <button
                    type="button"
                    onclick={() => removeTestimonial(i)}
                    class="text-red-600 hover:text-red-800"
                  >
                    Hapus
                  </button>
                </div>
                <p class="text-sm text-gray-700 italic">"{testimonial.quote}"</p>
                {#if testimonial.avatar}
                  <p class="text-xs text-gray-500 mt-1">Avatar: {testimonial.avatar}</p>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
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

<Modal
  bind:show={showModal}
  type={modalType}
  title={modalTitle}
  message={modalMessage}
  onConfirm={confirmFunction}
/>
